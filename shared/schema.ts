import { pgTable, text, serial, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

/**
 * Um único registro para todas as origens de contato do site.
 * `origem` distingue o formulário de contato, o diagnóstico de elegibilidade
 * e o canal de parceiros; `qualificacao` guarda as respostas do diagnóstico.
 */
export const leads = pgTable("leads", {
  id: serial("id").primaryKey(),
  origem: text("origem").notNull(),
  nome: text("nome").notNull(),
  empresa: text("empresa"),
  email: text("email").notNull(),
  telefone: text("telefone").notNull(),
  mensagem: text("mensagem"),
  qualificacao: jsonb("qualificacao"),
  paginaOrigem: text("pagina_origem"),
  criadoEm: timestamp("criado_em").defaultNow().notNull(),
});

const telefoneBr = z
  .string()
  .trim()
  .min(10, "Telefone inválido")
  .max(20, "Telefone inválido")
  .regex(/^[\d\s()+\-.]+$/, "Telefone inválido");

/** Faixas usadas no diagnóstico — mantidas em um só lugar, cliente e servidor. */
export const ESFERAS = ["federal", "estadual", "ambas", "nao_sei"] as const;
export const FAIXAS = ["ate_1m", "1m_5m", "5m_20m", "20m_100m", "acima_100m"] as const;
export const REGIMES = ["lucro_real", "lucro_presumido", "simples", "outro"] as const;
export const SITUACOES = [
  "inscrita",
  "execucao_fiscal",
  "ja_transacionada",
  "nao_inscrita",
  "nao_sei",
] as const;

export const qualificacaoSchema = z.object({
  esfera: z.enum(ESFERAS),
  faixa: z.enum(FAIXAS),
  regime: z.enum(REGIMES),
  situacao: z.enum(SITUACOES),
  veredito: z.string().max(40),
});

export const leadSchema = z.object({
  origem: z.enum(["contato", "diagnostico", "parceiro"]),
  nome: z.string().trim().min(2, "Informe o nome").max(120),
  empresa: z.string().trim().max(160).optional().or(z.literal("")),
  email: z.string().trim().email("E-mail inválido").max(160),
  telefone: telefoneBr,
  mensagem: z.string().trim().max(4000).optional().or(z.literal("")),
  qualificacao: qualificacaoSchema.optional(),
  paginaOrigem: z.string().trim().max(200).optional().or(z.literal("")),
  /** Honeypot: preenchido apenas por robôs. */
  website: z.string().max(0).optional().or(z.literal("")),
  consentimento: z.literal(true, {
    errorMap: () => ({ message: "É necessário aceitar a política de privacidade" }),
  }),
});

export type LeadInput = z.infer<typeof leadSchema>;
export type Qualificacao = z.infer<typeof qualificacaoSchema>;
export type Lead = typeof leads.$inferSelect;

export const insertLeadSchema = createInsertSchema(leads).omit({
  id: true,
  criadoEm: true,
});
export type InsertLead = z.infer<typeof insertLeadSchema>;
