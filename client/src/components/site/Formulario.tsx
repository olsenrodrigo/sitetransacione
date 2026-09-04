import { useState, type FormEvent } from "react";
import { useLocation, Link } from "wouter";
import type { Qualificacao } from "@shared/schema";
import { formatarTelefone } from "@/lib/utils";
import { Botao, Marcador, Seta } from "./primitivas";

type Estado = "idle" | "enviando" | "ok" | "erro";

const campo =
  "w-full rounded-md border border-borda bg-white px-3.5 py-2.5 text-[0.9rem] text-tinta outline-none transition-colors placeholder:text-cinza-claro focus:border-esmeralda";

const rotulo = "block text-[0.78rem] font-semibold uppercase tracking-wider text-cinza";

export default function Formulario({
  origem,
  qualificacao,
  rotuloEnvio = "Enviar",
  rotuloEmpresa = "Empresa",
  placeholderMensagem = "Descreva brevemente a situação do passivo: esfera, valor aproximado e se já houve parcelamento ou transação.",
  sucesso = "Recebemos o seu contato. Nossa equipe responde em até um dia útil.",
  compacto = false,
}: {
  origem: "contato" | "diagnostico" | "parceiro";
  qualificacao?: Qualificacao;
  rotuloEnvio?: string;
  rotuloEmpresa?: string;
  placeholderMensagem?: string;
  sucesso?: string;
  compacto?: boolean;
}) {
  const [local] = useLocation();
  const [estado, setEstado] = useState<Estado>("idle");
  const [erro, setErro] = useState("");
  const [dados, setDados] = useState({
    nome: "",
    empresa: "",
    email: "",
    telefone: "",
    mensagem: "",
    website: "",
  });
  const [consentimento, setConsentimento] = useState(false);

  const alterar = (k: keyof typeof dados) => (e: { target: { value: string } }) =>
    setDados((d) => ({
      ...d,
      [k]: k === "telefone" ? formatarTelefone(e.target.value) : e.target.value,
    }));

  async function enviar(e: FormEvent) {
    e.preventDefault();
    setErro("");
    setEstado("enviando");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...dados,
          origem,
          qualificacao,
          paginaOrigem: local,
          consentimento,
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.mensagem ?? "Não foi possível enviar agora.");
      setEstado("ok");
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Não foi possível enviar agora.");
      setEstado("erro");
    }
  }

  if (estado === "ok")
    return (
      <div className="cartao p-8 text-center md:p-10">
        <span
          className="mx-auto flex h-11 w-11 items-center justify-center rounded-full"
          style={{ background: "rgba(14,158,110,0.12)" }}
        >
          <Marcador className="text-esmeralda" />
        </span>
        <h3 className="titulo-card mt-5">Contato enviado</h3>
        <p className="corpo-sm mx-auto mt-3 max-w-sm">{sucesso}</p>
        <div className="mt-7">
          <Botao href="/conteudo" variante="secundario">
            Ler enquanto isso
            <Seta />
          </Botao>
        </div>
      </div>
    );

  return (
    <form onSubmit={enviar} className="cartao relative p-6 md:p-8" noValidate>
      {/* Honeypot: invisível para pessoas, atrativo para robôs. */}
      <div aria-hidden="true" className="absolute h-0 w-0 overflow-hidden opacity-0">
        <label htmlFor="website">Não preencha este campo</label>
        <input
          id="website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={dados.website}
          onChange={alterar("website")}
        />
      </div>

      <div className={compacto ? "space-y-4" : "grid gap-4 sm:grid-cols-2"}>
        <div className={compacto ? "" : "sm:col-span-2"}>
          <label htmlFor="nome" className={rotulo}>
            Nome completo *
          </label>
          <input
            id="nome"
            name="nome"
            required
            autoComplete="name"
            className={`${campo} mt-2`}
            value={dados.nome}
            onChange={alterar("nome")}
          />
        </div>

        <div className={compacto ? "" : "sm:col-span-2"}>
          <label htmlFor="empresa" className={rotulo}>
            {rotuloEmpresa}
          </label>
          <input
            id="empresa"
            name="empresa"
            autoComplete="organization"
            className={`${campo} mt-2`}
            value={dados.empresa}
            onChange={alterar("empresa")}
          />
        </div>

        <div>
          <label htmlFor="email" className={rotulo}>
            E-mail corporativo *
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            inputMode="email"
            className={`${campo} mt-2`}
            value={dados.email}
            onChange={alterar("email")}
          />
        </div>

        <div>
          <label htmlFor="telefone" className={rotulo}>
            Telefone *
          </label>
          <input
            id="telefone"
            name="telefone"
            type="tel"
            required
            autoComplete="tel"
            inputMode="tel"
            placeholder="(11) 99999-9999"
            className={`${campo} mt-2`}
            value={dados.telefone}
            onChange={alterar("telefone")}
          />
        </div>

        <div className={compacto ? "" : "sm:col-span-2"}>
          <label htmlFor="mensagem" className={rotulo}>
            Mensagem
          </label>
          <textarea
            id="mensagem"
            name="mensagem"
            rows={4}
            className={`${campo} mt-2 resize-y`}
            placeholder={placeholderMensagem}
            value={dados.mensagem}
            onChange={alterar("mensagem")}
          />
        </div>
      </div>

      <label className="mt-6 flex cursor-pointer items-start gap-3">
        <input
          type="checkbox"
          required
          checked={consentimento}
          onChange={(e) => setConsentimento(e.target.checked)}
          className="mt-0.5 h-4 w-4 shrink-0 accent-[#0A5C42]"
        />
        <span className="text-[0.8rem] leading-relaxed text-cinza">
          Autorizo o contato e o tratamento dos meus dados para esta finalidade, conforme
          a{" "}
          <Link href="/privacidade" className="text-verde underline underline-offset-2">
            política de privacidade
          </Link>
          .
        </span>
      </label>

      {estado === "erro" && (
        <p
          role="alert"
          className="mt-5 rounded-md px-4 py-3 text-[0.84rem]"
          style={{ background: "rgba(180,70,60,0.08)", color: "#8F3A32" }}
        >
          {erro}
        </p>
      )}

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <Botao type="submit" tamanho="lg" disabled={estado === "enviando"}>
          {estado === "enviando" ? "Enviando…" : rotuloEnvio}
          {estado !== "enviando" && <Seta />}
        </Botao>
        <p className="nota">Resposta em até um dia útil.</p>
      </div>
    </form>
  );
}
