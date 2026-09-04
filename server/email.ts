import nodemailer from "nodemailer";
import type { LeadInput } from "@shared/schema";
import { SITE } from "@shared/seo";

const ROTULOS: Record<string, Record<string, string>> = {
  esfera: {
    federal: "Federal (PGFN)",
    estadual: "Estadual (PGE-SP)",
    ambas: "Federal e estadual",
    nao_sei: "Não sabe informar",
  },
  faixa: {
    ate_1m: "Até R$ 1 milhão",
    "1m_5m": "R$ 1 mi a R$ 5 mi",
    "5m_20m": "R$ 5 mi a R$ 20 mi",
    "20m_100m": "R$ 20 mi a R$ 100 mi",
    acima_100m: "Acima de R$ 100 milhões",
  },
  regime: {
    lucro_real: "Lucro Real",
    lucro_presumido: "Lucro Presumido",
    simples: "Simples Nacional",
    outro: "Outro ou não sabe",
  },
  situacao: {
    inscrita: "Inscrita em dívida ativa",
    execucao_fiscal: "Em execução fiscal",
    ja_transacionada: "Já transacionada ou parcelada",
    nao_inscrita: "Ainda não inscrita",
    nao_sei: "Não sabe informar",
  },
  veredito: {
    prioritario: "PRIORITÁRIO",
    elegivel: "Elegível",
    condicional: "Condicional",
    fora_de_escopo: "Fora de escopo",
  },
};

const ORIGENS: Record<string, string> = {
  contato: "Formulário de contato",
  diagnostico: "Diagnóstico de elegibilidade",
  parceiro: "Canal de parceiros",
};

function transporte() {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER) return null;
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
}

const escapar = (s: string) =>
  s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!,
  );

function linha(rotulo: string, valor: string, destaque = false) {
  return `<tr>
    <td style="padding:9px 14px;font:600 12px/1.4 Arial,sans-serif;color:#5A6B64;text-transform:uppercase;letter-spacing:.06em;vertical-align:top;width:170px;border-bottom:1px solid #E3E6E1">${escapar(rotulo)}</td>
    <td style="padding:9px 14px;font:${destaque ? "700" : "400"} 14px/1.55 Arial,sans-serif;color:${destaque ? "#0A5C42" : "#14201C"};white-space:pre-line;border-bottom:1px solid #E3E6E1">${escapar(valor)}</td>
  </tr>`;
}

export async function enviarEmailLead(dados: LeadInput, id: number) {
  const t = transporte();
  if (!t) {
    console.warn("[email] SMTP não configurado — lead gravado sem notificação por e-mail.");
    return false;
  }

  const q = dados.qualificacao;
  const prioritario = q?.veredito === "prioritario";
  const para =
    dados.origem === "parceiro"
      ? process.env.CONTACT_EMAIL_PARCEIROS || process.env.CONTACT_EMAIL || SITE.emailParceiros
      : process.env.CONTACT_EMAIL || SITE.email;

  const linhas = [
    linha("Origem", ORIGENS[dados.origem] ?? dados.origem),
    linha("Nome", dados.nome),
    dados.empresa ? linha("Empresa", dados.empresa) : "",
    linha("E-mail", dados.email),
    linha("Telefone", dados.telefone),
    q ? linha("Veredito", ROTULOS.veredito[q.veredito] ?? q.veredito, true) : "",
    q ? linha("Esfera", ROTULOS.esfera[q.esfera] ?? q.esfera) : "",
    q ? linha("Faixa de passivo", ROTULOS.faixa[q.faixa] ?? q.faixa, true) : "",
    q ? linha("Regime", ROTULOS.regime[q.regime] ?? q.regime) : "",
    q ? linha("Situação da dívida", ROTULOS.situacao[q.situacao] ?? q.situacao) : "",
    dados.mensagem ? linha("Mensagem", dados.mensagem) : "",
    linha("Página de origem", dados.paginaOrigem || "—"),
  ]
    .filter(Boolean)
    .join("");

  await t.sendMail({
    from: `"Site Transacione" <${process.env.SMTP_USER}>`,
    to: para,
    replyTo: dados.email,
    subject: `${prioritario ? "[PRIORITÁRIO] " : ""}${ORIGENS[dados.origem] ?? "Contato"} — ${dados.nome}${dados.empresa ? ` (${dados.empresa})` : ""}`,
    html: `<div style="background:#F7F6F2;padding:26px">
  <div style="max-width:640px;margin:0 auto;background:#fff;border:1px solid #E3E6E1;border-radius:10px;overflow:hidden">
    <div style="background:#0A5C42;padding:18px 22px">
      <p style="margin:0;font:600 12px/1 Arial,sans-serif;color:#3FD9A0;letter-spacing:.16em;text-transform:uppercase">Transacione</p>
      <p style="margin:8px 0 0;font:400 19px/1.3 Georgia,serif;color:#fff">Novo contato pelo site</p>
    </div>
    <table style="width:100%;border-collapse:collapse">${linhas}</table>
    <div style="padding:16px 22px;background:#F7F6F2">
      <p style="margin:0;font:400 11px/1.5 Arial,sans-serif;color:#8A9992">
        Registro #${id} · ${new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" })} ·
        Enviado automaticamente pelo formulário do site.
      </p>
    </div>
  </div>
</div>`,
  });
  return true;
}
