import { createHash, randomUUID } from "node:crypto";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand, TransactWriteCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { SESv2Client, SendEmailCommand } from "@aws-sdk/client-sesv2";
import { leadSchema } from "../shared/schema";

const region = process.env.AWS_REGION || "us-east-1";
const db = DynamoDBDocumentClient.from(new DynamoDBClient({ region }), { marshallOptions: { removeUndefinedValues: true } });
const ses = new SESv2Client({ region });
type Event = { rawPath: string; body?: string; isBase64Encoded?: boolean; headers?: Record<string, string>; requestContext: { http: { method: string; sourceIp: string } } };
const hash = (value: string) => createHash("sha256").update(value).digest("hex");
const response = (statusCode: number, body: object) => ({ statusCode, headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" }, body: JSON.stringify(body) });

// Dependencies are injectable so failure/concurrency behavior is testable without AWS.
export function createHandler(database = db, mailer = ses) {
  return async (event: Event) => {
    if (region !== "us-east-1") return response(503, { mensagem: "Serviço indisponível." });
    const method = event.requestContext.http.method;
    if (event.rawPath === "/api/saude" && method === "GET") return response(200, { ok: true });
    if (event.rawPath !== "/api/leads") return response(404, { mensagem: "Não encontrado." });
    if (method !== "POST") return response(405, { mensagem: "Método não permitido." });
    const table = process.env.LEADS_TABLE;
    if (!table) return response(503, { mensagem: "Serviço indisponível." });
    const headers = Object.fromEntries(Object.entries(event.headers || {}).map(([k, v]) => [k.toLowerCase(), v]));
    if (!/^application\/json(?:\s*;|$)/i.test(headers["content-type"] || "")) return response(415, { mensagem: "Envie JSON." });
    const body = event.isBase64Encoded ? Buffer.from(event.body || "", "base64").toString("utf8") : event.body || "";
    if (Buffer.byteLength(body) > 16384) return response(413, { mensagem: "Formulário muito grande." });
    let input: unknown;
    try { input = JSON.parse(body); } catch { return response(400, { mensagem: "Formulário inválido." }); }
    // A filled honeypot must never persist a contact or consume email resources.
    if (input && typeof input === "object" && "website" in input && input.website) return response(201, { ok: true });
    const parsed = leadSchema.safeParse(input);
    if (!parsed.success) return response(400, { mensagem: parsed.error.issues[0]?.message || "Formulário inválido." });
    const dados = parsed.data;
    const token = headers["idempotency-key"];
    if (token && !/^[a-zA-Z0-9_-]{16,128}$/.test(token)) return response(400, { mensagem: "Identificador inválido." });
    const id = token ? hash(`${token}:${JSON.stringify(dados)}`) : randomUUID();
    const pk = `LEAD#${id}`;
    const now = Date.now();
    const window = Math.floor(now / 600000);
    // CloudFront supplies this header itself; viewer X-Forwarded-For is untrusted.
    const viewer = headers["cloudfront-viewer-address"] || event.requestContext.http.sourceIp;
    const ip = viewer.startsWith("[") ? viewer.slice(1, viewer.indexOf("]")) : viewer.replace(/:\d+$/, "");
    const rateKey = `RATE#${hash(`${ip}:${window}`)}`;
    try {
      if (token) {
        const previous = await database.send(new GetCommand({ TableName: table, Key: { pk }, ConsistentRead: true, ProjectionExpression: "pk" }));
        if (previous.Item) return response(201, { ok: true, id });
      }
      await database.send(new TransactWriteCommand({ TransactItems: [
        { Update: { TableName: table, Key: { pk: rateKey }, UpdateExpression: "SET expiresAt = :ttl ADD #n :one", ConditionExpression: "attribute_not_exists(#n) OR #n < :limit", ExpressionAttributeNames: { "#n": "count" }, ExpressionAttributeValues: { ":one": 1, ":limit": 5, ":ttl": (window + 2) * 600 } } },
        { Put: { TableName: table, Item: { pk, id, ...dados, criadoEm: new Date(now).toISOString(), notificacao: process.env.LEAD_EMAIL_TO ? "pending" : "not_configured" }, ConditionExpression: "attribute_not_exists(pk)" } },
      ] }));
    } catch (error) {
      const e = error as { name?: string; CancellationReasons?: { Code?: string }[] };
      if (e.name === "TransactionCanceledException") {
        if (e.CancellationReasons?.[1]?.Code === "ConditionalCheckFailed") return response(201, { ok: true, id });
        if (e.CancellationReasons?.[0]?.Code === "ConditionalCheckFailed") return response(429, { mensagem: "Muitos envios em sequência. Tente novamente em alguns minutos." });
      }
      console.error(JSON.stringify({ event: "lead_write_failed", type: e.name || "Error" }));
      return response(503, { mensagem: "Não foi possível registrar agora. Tente novamente." });
    }
    // Await notification. Lambda may freeze immediately after returning the response.
    if (process.env.LEAD_EMAIL_TO && process.env.LEAD_EMAIL_FROM) {
      try {
        await mailer.send(new SendEmailCommand({ FromEmailAddress: process.env.LEAD_EMAIL_FROM, Destination: { ToAddresses: [process.env.LEAD_EMAIL_TO] }, ReplyToAddresses: [dados.email], Content: { Simple: { Subject: { Data: `Transacione: novo contato (${dados.origem})`, Charset: "UTF-8" }, Body: { Text: { Data: JSON.stringify(dados, null, 2), Charset: "UTF-8" } } } } }));
        await database.send(new UpdateCommand({ TableName: table, Key: { pk }, UpdateExpression: "SET notificacao = :status", ExpressionAttributeValues: { ":status": "sent" } }));
      } catch (error) {
        // Contact remains durable with pending status for manual recovery.
        console.error(JSON.stringify({ event: "lead_email_pending", id, type: (error as Error).name }));
      }
    }
    return response(201, { ok: true, id });
  };
}
export const handler = createHandler();
