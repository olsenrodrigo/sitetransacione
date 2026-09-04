import type { Express, Request } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { leadSchema } from "@shared/schema";
import { fromError } from "zod-validation-error";
import { enviarEmailLead } from "./email";

/** Limite simples por IP, em memória: 5 envios a cada 10 minutos. */
const JANELA = 10 * 60 * 1000;
const LIMITE = 5;
const contadores = new Map<string, { n: number; ate: number }>();

function excedeuLimite(req: Request) {
  const ip =
    (req.headers["x-forwarded-for"] as string | undefined)?.split(",")[0]?.trim() ||
    req.socket.remoteAddress ||
    "desconhecido";
  const agora = Date.now();
  const atual = contadores.get(ip);

  if (!atual || atual.ate < agora) {
    contadores.set(ip, { n: 1, ate: agora + JANELA });
    return false;
  }
  atual.n += 1;
  return atual.n > LIMITE;
}

/* Limpeza periódica para a tabela não crescer indefinidamente. */
setInterval(() => {
  const agora = Date.now();
  for (const [ip, v] of contadores) if (v.ate < agora) contadores.delete(ip);
}, JANELA).unref?.();

export async function registerRoutes(httpServer: Server, app: Express): Promise<Server> {
  app.get("/api/saude", (_req, res) => res.json({ ok: true }));

  app.post("/api/leads", async (req, res) => {
    const parse = leadSchema.safeParse(req.body);
    if (!parse.success) {
      return res.status(400).json({ mensagem: fromError(parse.error).toString() });
    }

    const dados = parse.data;

    /* Honeypot preenchido: responde como sucesso e descarta. */
    if (dados.website) return res.status(201).json({ ok: true });

    if (excedeuLimite(req)) {
      return res.status(429).json({
        mensagem: "Muitos envios em sequência. Tente novamente em alguns minutos.",
      });
    }

    let id = 0;
    try {
      ({ id } = await storage.criarLead({
        origem: dados.origem,
        nome: dados.nome,
        empresa: dados.empresa || null,
        email: dados.email,
        telefone: dados.telefone,
        mensagem: dados.mensagem || null,
        qualificacao: dados.qualificacao ?? null,
        paginaOrigem: dados.paginaOrigem || null,
      }));
    } catch (err) {
      console.error("[leads] falha ao gravar:", err);
      return res
        .status(500)
        .json({ mensagem: "Não foi possível registrar agora. Tente novamente." });
    }

    /* A notificação não bloqueia a resposta ao visitante. */
    enviarEmailLead(dados, id).catch((err) =>
      console.error("[leads] falha ao notificar por e-mail:", err),
    );

    return res.status(201).json({ ok: true, id });
  });

  return httpServer;
}
