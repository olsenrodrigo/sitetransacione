import test from "node:test";
import assert from "node:assert/strict";
import { createHandler } from "./lambda";
process.env.LEADS_TABLE = "test-leads";
delete process.env.LEAD_EMAIL_TO;
const valid = { origem: "contato", nome: "Teste técnico", email: "test@example.com", telefone: "11999999999", consentimento: true };
const event = (data: unknown = valid) => ({ rawPath: "/api/leads", body: JSON.stringify(data), headers: { "content-type": "application/json", "idempotency-key": "testidempotencykey123", "cloudfront-viewer-address": "203.0.113.10:54321" }, requestContext: { http: { method: "POST", sourceIp: "127.0.0.1" } } });
function setup(fail?: string) {
 const leads = new Map<string, unknown>(); const counts = new Map<string, number>();
 const requests: any[] = [];
 const db = { async send(command: any) {
  const x = command.input; requests.push(x);
  if (fail) throw Object.assign(new Error("failure"), { name: fail });
  if (x.ProjectionExpression) return { Item: leads.get(x.Key.pk) };
  if (x.TransactItems) {
   const [u,p] = x.TransactItems; const key = u.Update.Key.pk;
   if ((counts.get(key) || 0) >= 5) throw Object.assign(new Error(), { name: "TransactionCanceledException", CancellationReasons: [{ Code: "ConditionalCheckFailed" }, { Code: "None" }] });
   counts.set(key, (counts.get(key) || 0) + 1); leads.set(p.Put.Item.pk, p.Put.Item); return {};
  }
  return {};
 } };
 const mail = { async send() { throw new Error("Email must not be sent during these tests"); } };
 return { handler: createHandler(db as any, mail as any), leads, counts, requests };
}
test("validation, invalid JSON, oversized bodies and honeypot never write", async () => {
 const s = setup();
 assert.equal((await s.handler(event({}))).statusCode, 400);
 assert.equal((await s.handler({ ...event(), body: "{" })).statusCode, 400);
 assert.equal((await s.handler({ ...event(), body: " ".repeat(17000) })).statusCode, 413);
 assert.equal((await s.handler(event({ ...valid, website: "spam" }))).statusCode, 201);
 assert.equal(s.requests.length, 0);
});
test("contact is durable, retries return the original ID without another write", async () => {
 const s = setup(); const a = await s.handler(event()); const b = await s.handler(event());
 assert.equal(a.statusCode, 201); assert.deepEqual(JSON.parse(a.body), JSON.parse(b.body));
 assert.equal(s.leads.size, 1); assert.equal([...s.counts.values()][0], 1);
 const item = [...s.leads.values()][0] as any;
 assert.equal(item.consentimento, true); assert.equal(item.expiresAt, undefined);
 assert.equal(item.notificacao, "not_configured");
});
test("failed storage cannot report success or email a contact", async () => {
 const s = setup("ServiceUnavailable"); assert.equal((await s.handler(event())).statusCode, 503);
});
test("six submissions from the same viewer are limited, forged forwarded IP ignored", async () => {
 const s = setup();
 for (let i=0;i<6;i++) {
  const e = event({ ...valid, nome: `Pessoa ${i}` });
  e.headers = { ...e.headers, "x-forwarded-for": `198.51.100.${i}` } as any;
  assert.equal((await s.handler(e)).statusCode, i<5 ? 201 : 429);
 }
 assert.equal(s.leads.size, 5);
});
test("routes, methods and content types are enforced", async () => {
 const s=setup();
 assert.equal((await s.handler({ ...event(), rawPath: "/api/saude", requestContext: { http: { method: "GET", sourceIp: "127.0.0.1" } } })).statusCode, 200);
 assert.equal((await s.handler({ ...event(), rawPath: "/api/admin" })).statusCode, 404);
 assert.equal((await s.handler({ ...event(), requestContext: { http: { method: "DELETE", sourceIp: "127.0.0.1" } } })).statusCode, 405);
 assert.equal((await s.handler({ ...event(), headers: { "content-type": "text/plain" } })).statusCode, 415);
 assert.equal(s.requests.length, 0);
});
