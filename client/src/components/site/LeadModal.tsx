import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import { Link, useLocation } from "wouter";
import { formatarTelefone } from "@/lib/utils";
import { Simbolo } from "@/components/marca/Logo";
import { Marcador, Seta } from "./primitivas";

/* ================================================================ Contexto */

type Origem = "contato" | "diagnostico" | "parceiro";

interface Ctx {
  abrir: (origem?: Origem) => void;
}

const LeadCtx = createContext<Ctx>({ abrir: () => {} });

/** Abre o formulário de captação de qualquer lugar do site. */
export const usarLead = () => useContext(LeadCtx);

/* ============================================================== Perguntas */

type Chave = "esfera" | "faixa" | "regime" | "situacao";

const PERGUNTAS: {
  chave: Chave;
  titulo: string;
  opcoes: { valor: string; rotulo: string }[];
}[] = [
  {
    chave: "esfera",
    titulo: "Onde está o passivo?",
    opcoes: [
      { valor: "federal", rotulo: "Federal — PGFN" },
      { valor: "estadual", rotulo: "Estadual — PGE-SP" },
      { valor: "ambas", rotulo: "Nas duas esferas" },
      { valor: "nao_sei", rotulo: "Ainda não sei" },
    ],
  },
  {
    chave: "faixa",
    titulo: "Faixa aproximada do passivo",
    opcoes: [
      { valor: "ate_1m", rotulo: "Até R$ 1 milhão" },
      { valor: "1m_5m", rotulo: "R$ 1 mi a R$ 5 mi" },
      { valor: "5m_20m", rotulo: "R$ 5 mi a R$ 20 mi" },
      { valor: "20m_100m", rotulo: "R$ 20 mi a R$ 100 mi" },
      { valor: "acima_100m", rotulo: "Acima de R$ 100 milhões" },
    ],
  },
  {
    chave: "regime",
    titulo: "Regime tributário",
    opcoes: [
      { valor: "lucro_real", rotulo: "Lucro Real" },
      { valor: "lucro_presumido", rotulo: "Lucro Presumido" },
      { valor: "simples", rotulo: "Simples Nacional" },
      { valor: "outro", rotulo: "Outro ou não sei" },
    ],
  },
  {
    chave: "situacao",
    titulo: "Situação da dívida",
    opcoes: [
      { valor: "inscrita", rotulo: "Inscrita em dívida ativa" },
      { valor: "execucao_fiscal", rotulo: "Em execução fiscal" },
      { valor: "ja_transacionada", rotulo: "Já transacionada ou parcelada" },
      { valor: "nao_inscrita", rotulo: "Ainda não inscrita" },
      { valor: "nao_sei", rotulo: "Não sei informar" },
    ],
  },
];

/* =============================================================== Veredito */

type Veredito = {
  chave: "prioritario" | "elegivel" | "condicional" | "fora_de_escopo";
  titulo: string;
  texto: string;
  aceitaContato: boolean;
};

/**
 * Regra de elegibilidade — transparente de propósito.
 * O objetivo não é maximizar contatos: é encaminhar ao time apenas os casos
 * que a metodologia atende, e dizer com franqueza quando não é o caso.
 */
function avaliar(r: Record<Chave, string>): Veredito {
  const grande = ["5m_20m", "20m_100m", "acima_100m"].includes(r.faixa);

  if (r.situacao === "nao_inscrita")
    return {
      chave: "fora_de_escopo",
      titulo: "Ainda não é o momento",
      texto:
        "A transação alcança o crédito já inscrito em dívida ativa. Enquanto o débito não é inscrito, o caminho passa por outras frentes — parcelamento ordinário, discussão administrativa ou revisão do lançamento —, que não são o objeto deste diagnóstico. Vale acompanhar a inscrição: assim que ocorrer, faz sentido voltar.",
      aceitaContato: false,
    };

  if (r.regime === "simples" && !grande)
    return {
      chave: "fora_de_escopo",
      titulo: "Provavelmente não é o caso",
      texto:
        "Empresas do Simples Nacional com passivo abaixo de R$ 5 milhões raramente comportam a revisão da classificação: a apuração da capacidade efetiva depende de demonstrações contábeis que o regime normalmente não produz na profundidade necessária. Para esse perfil, as modalidades de adesão por edital costumam ser o caminho direto — e dispensam análise técnica prévia.",
      aceitaContato: false,
    };

  if (r.faixa === "ate_1m")
    return {
      chave: "condicional",
      titulo: "Pode caber — com ressalva",
      texto:
        "Passivos abaixo de R$ 1 milhão nem sempre comportam a revisão, porque o custo do trabalho técnico precisa ser proporcional ao ganho possível. Há exceções: débito antigo, classificação claramente desalinhada ou existência de precatório mudam essa conta. Deixe o contato e avaliamos com franqueza.",
      aceitaContato: true,
    };

  if (grande)
    return {
      chave: "prioritario",
      titulo: "Perfil prioritário",
      texto:
        "É exatamente o perfil em que a revisão da classificação costuma produzir a maior diferença. Com os documentos em mãos, o diagnóstico é concluído em 48 horas e indica a classificação apurada, os cenários aplicáveis e a economia potencial — ou os fundamentos da ausência dela.",
      aceitaContato: true,
    };

  return {
    chave: "elegivel",
    titulo: "Há espaço para diagnóstico",
    texto:
      "O perfil informado comporta a análise. O diagnóstico verifica a classificação atual, o espaço de revisão e as modalidades a que a empresa tem acesso.",
    aceitaContato: true,
  };
}

const TOM: Record<Veredito["chave"], { fundo: string; borda: string; texto: string }> = {
  prioritario: { fundo: "rgba(14,158,110,0.09)", borda: "rgba(14,158,110,0.4)", texto: "#0A5C42" },
  elegivel: { fundo: "rgba(14,158,110,0.06)", borda: "rgba(14,158,110,0.3)", texto: "#0A5C42" },
  condicional: { fundo: "rgba(201,162,39,0.09)", borda: "rgba(201,162,39,0.42)", texto: "#7A6218" },
  fora_de_escopo: { fundo: "rgba(90,107,100,0.08)", borda: "rgba(90,107,100,0.28)", texto: "#41544C" },
};

/* ================================================================== Campos */

const campo =
  "w-full rounded-lg border border-verde/15 bg-osso/60 px-4 py-3 text-[0.94rem] text-tinta outline-none transition placeholder:text-cinza-claro/70 focus:border-esmeralda focus:bg-white focus:ring-2 focus:ring-esmeralda/25";

const rot = "mb-1.5 block text-[0.82rem] font-medium text-verde";

/* =================================================================== Modal */

function Modal({
  origem,
  aoFechar,
}: {
  origem: Origem;
  aoFechar: () => void;
}) {
  const [local] = useLocation();
  const [etapa, setEtapa] = useState<"qualificar" | "contato" | "pronto">("qualificar");
  const [respostas, setRespostas] = useState<Partial<Record<Chave, string>>>({});
  const [indice, setIndice] = useState(0);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [dados, setDados] = useState({
    nome: "",
    empresa: "",
    email: "",
    telefone: "",
    mensagem: "",
    website: "",
  });
  const [consentimento, setConsentimento] = useState(false);

  const painel = useRef<HTMLDivElement>(null);
  const primeiroFoco = useRef<HTMLButtonElement | HTMLInputElement>(null);

  const completo = PERGUNTAS.every((p) => respostas[p.chave]);
  const veredito = useMemo(
    () => (completo ? avaliar(respostas as Record<Chave, string>) : null),
    [completo, respostas],
  );

  /* Esc fecha; Tab fica preso no painel. */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return aoFechar();
      if (e.key !== "Tab" || !painel.current) return;
      const alvos = painel.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), input:not([disabled]), textarea, a[href], [tabindex]:not([tabindex="-1"])',
      );
      if (!alvos.length) return;
      const primeiro = alvos[0];
      const ultimo = alvos[alvos.length - 1];
      if (e.shiftKey && document.activeElement === primeiro) {
        e.preventDefault();
        ultimo.focus();
      } else if (!e.shiftKey && document.activeElement === ultimo) {
        e.preventDefault();
        primeiro.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    document.body.classList.add("travado");
    primeiroFoco.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.classList.remove("travado");
    };
  }, [aoFechar]);

  function responder(chave: Chave, valor: string) {
    const proximas = { ...respostas, [chave]: valor };
    setRespostas(proximas);
    if (indice < PERGUNTAS.length - 1) setIndice(indice + 1);
    else setEtapa("contato");
  }

  const alterar = (k: keyof typeof dados) => (e: { target: { value: string } }) =>
    setDados((d) => ({
      ...d,
      [k]: k === "telefone" ? formatarTelefone(e.target.value) : e.target.value,
    }));

  const envioRef = useRef<{ body: string; key: string } | null>(null);

  async function enviar(e: FormEvent) {
    e.preventDefault();
    setErro(null);
    setEnviando(true);
    try {
      const body = JSON.stringify({
        ...dados,
        origem,
        paginaOrigem: local,
        consentimento,
        qualificacao: veredito
          ? { ...(respostas as Record<Chave, string>), veredito: veredito.chave }
          : undefined,
      });
      const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(body));
      const payloadHash = Array.from(new Uint8Array(digest), b => b.toString(16).padStart(2, "0")).join("");
      // Repetir o mesmo formulário mantém a chave e evita gravar contato duplicado.
      if (envioRef.current?.body !== body) envioRef.current = { body, key: Array.from(crypto.getRandomValues(new Uint8Array(16)), b => b.toString(16).padStart(2, "0")).join("") };
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-amz-content-sha256": payloadHash, "Idempotency-Key": envioRef.current!.key },
        body,
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.mensagem ?? "Não foi possível enviar agora.");
      setEtapa("pronto");
    } catch (err) {
      /* Confirmar recebimento sem ter recebido deixaria a empresa esperando
         um retorno que não viria. Melhor pedir para tentar de novo. */
      setErro(
        err instanceof Error
          ? err.message
          : "Não conseguimos enviar agora. Tente novamente em instantes.",
      );
    } finally {
      setEnviando(false);
    }
  }

  const pergunta = PERGUNTAS[indice];
  const progresso = Math.round(
    (Object.keys(respostas).length / PERGUNTAS.length) * 100,
  );

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center p-0 sm:items-center sm:p-5"
      role="dialog"
      aria-modal="true"
      aria-label="Diagnóstico de elegibilidade"
    >
      <div
        className="absolute inset-0 bg-grafite/75 backdrop-blur-sm"
        style={{ animation: "fadeIn .25s ease-out" }}
        onClick={aoFechar}
      />

      <div
        ref={painel}
        className="relative flex max-h-[96dvh] w-full max-w-xl flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl sm:max-h-[92dvh] sm:rounded-2xl"
        style={{ animation: "subir .32s cubic-bezier(.22,1,.36,1)" }}
      >
        {/* Cabeçalho */}
        <div className="relative shrink-0 overflow-hidden bg-grafite px-6 py-4 sm:px-8 sm:py-5">
          <div
            aria-hidden="true"
            className="halo"
            style={{ width: 260, height: 260, right: -80, top: -140 }}
          />
          <div className="relative flex items-start justify-between gap-4">
            <div>
              <span className="sobrescrita" style={{ color: "#3FD9A0" }}>
                {origem === "parceiro" ? "Canal do parceiro" : "Diagnóstico em 48 horas"}
              </span>
              <p className="fonte-display mt-1.5 text-[1.15rem] leading-tight text-white sm:mt-2 sm:text-[1.35rem]">
                {etapa === "pronto"
                  ? "Recebemos o seu contato"
                  : origem === "parceiro"
                    ? "Traga um caso da sua carteira"
                    : "Descubra se cabe para a sua empresa"}
              </p>
            </div>
            <button
              ref={etapa === "qualificar" ? undefined : undefined}
              type="button"
              onClick={aoFechar}
              aria-label="Fechar"
              className="-mr-1 -mt-1 shrink-0 rounded-md p-1.5 text-white/45 transition-colors hover:bg-white/10 hover:text-white"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M5 5l14 14M19 5L5 19" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          {etapa !== "pronto" && (
            <div className="relative mt-4 sm:mt-5">
              <div className="flex items-center justify-between text-[0.7rem]" style={{ color: "#8AA098" }}>
                <span>
                  {etapa === "qualificar"
                    ? `Pergunta ${indice + 1} de ${PERGUNTAS.length}`
                    : "Dados de contato"}
                </span>
                <span className="num" style={{ color: "#3FD9A0" }}>
                  {etapa === "contato" ? 100 : progresso}%
                </span>
              </div>
              <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-white/12">
                <div
                  className="h-full rounded-full transition-[width] duration-500"
                  style={{
                    width: `${etapa === "contato" ? 100 : progresso}%`,
                    background: "#0E9E6E",
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Corpo */}
        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6 sm:px-8 sm:py-7">
          {/* ---------- Etapa 1: qualificação ---------- */}
          {etapa === "qualificar" && (
            <div key={pergunta.chave}>
              <h3 className="subafirmacao text-verde">{pergunta.titulo}</h3>
              <div className="mt-5 grid gap-2.5">
                {pergunta.opcoes.map((o, i) => {
                  const ativo = respostas[pergunta.chave] === o.valor;
                  return (
                    <button
                      key={o.valor}
                      ref={i === 0 ? (primeiroFoco as never) : undefined}
                      type="button"
                      onClick={() => responder(pergunta.chave, o.valor)}
                      className="flex items-center gap-3.5 rounded-lg border px-4 py-3.5 text-left transition-colors"
                      style={{
                        borderColor: ativo ? "#0E9E6E" : "#E3E6E1",
                        background: ativo ? "rgba(14,158,110,0.06)" : "#fff",
                      }}
                    >
                      <span
                        aria-hidden="true"
                        className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 transition-colors"
                        style={{
                          borderColor: ativo ? "#0E9E6E" : "rgba(10,92,66,0.22)",
                          background: ativo ? "#0E9E6E" : "transparent",
                        }}
                      >
                        {ativo && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
                      </span>
                      <span className="text-[0.94rem] font-medium text-tinta">
                        {o.rotulo}
                      </span>
                    </button>
                  );
                })}
              </div>

              {indice > 0 && (
                <button
                  type="button"
                  onClick={() => setIndice(indice - 1)}
                  className="mt-6 text-[0.84rem] text-cinza underline underline-offset-4 transition-colors hover:text-verde"
                >
                  Voltar
                </button>
              )}
            </div>
          )}

          {/* ---------- Etapa 2: veredito + contato ---------- */}
          {etapa === "contato" && veredito && (
            <div>
              <div
                className="rounded-lg border p-5"
                style={{ background: TOM[veredito.chave].fundo, borderColor: TOM[veredito.chave].borda }}
              >
                <p
                  className="fonte-display text-[1.18rem] leading-snug"
                  style={{ color: TOM[veredito.chave].texto }}
                >
                  {veredito.titulo}
                </p>
                <p className="corpo-sm mt-2.5">{veredito.texto}</p>
              </div>

              {veredito.aceitaContato ? (
                <form onSubmit={enviar} className="relative mt-6" noValidate>
                  {/* Honeypot: invisível para pessoas, atrativo para robôs. */}
                  <div aria-hidden="true" className="absolute h-0 w-0 overflow-hidden opacity-0">
                    <label htmlFor="lm-website">Não preencha</label>
                    <input
                      id="lm-website"
                      tabIndex={-1}
                      autoComplete="off"
                      value={dados.website}
                      onChange={alterar("website")}
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <label htmlFor="lm-nome" className={rot}>
                        Nome completo *
                      </label>
                      <input
                        id="lm-nome"
                        required
                        autoComplete="name"
                        className={campo}
                        value={dados.nome}
                        onChange={alterar("nome")}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label htmlFor="lm-empresa" className={rot}>
                        {origem === "parceiro" ? "Escritório ou empresa" : "Razão social"}
                      </label>
                      <input
                        id="lm-empresa"
                        autoComplete="organization"
                        className={campo}
                        value={dados.empresa}
                        onChange={alterar("empresa")}
                      />
                    </div>
                    <div>
                      <label htmlFor="lm-email" className={rot}>
                        E-mail *
                      </label>
                      <input
                        id="lm-email"
                        type="email"
                        required
                        autoComplete="email"
                        inputMode="email"
                        className={campo}
                        value={dados.email}
                        onChange={alterar("email")}
                      />
                    </div>
                    <div>
                      <label htmlFor="lm-tel" className={rot}>
                        WhatsApp *
                      </label>
                      <input
                        id="lm-tel"
                        type="tel"
                        required
                        autoComplete="tel"
                        inputMode="tel"
                        placeholder="(11) 99999-0000"
                        className={campo}
                        value={dados.telefone}
                        onChange={alterar("telefone")}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label htmlFor="lm-msg" className={rot}>
                        Algo que ajude a adiantar
                      </label>
                      <textarea
                        id="lm-msg"
                        rows={3}
                        className={`${campo} resize-y`}
                        placeholder="Há inscrições antigas? Já houve parcelamento ou transação? Existe precatório disponível?"
                        value={dados.mensagem}
                        onChange={alterar("mensagem")}
                      />
                    </div>
                  </div>

                  <label className="mt-5 flex cursor-pointer items-start gap-3">
                    <input
                      type="checkbox"
                      required
                      checked={consentimento}
                      onChange={(e) => setConsentimento(e.target.checked)}
                      className="mt-0.5 h-4 w-4 shrink-0 accent-[#0A5C42]"
                    />
                    <span className="text-[0.8rem] leading-relaxed text-cinza">
                      Autorizo o contato e o tratamento dos meus dados para esta
                      finalidade, conforme a{" "}
                      <Link
                        href="/privacidade"
                        onClick={aoFechar}
                        className="text-verde underline underline-offset-2"
                      >
                        política de privacidade
                      </Link>
                      .
                    </span>
                  </label>

                  {erro && (
                    <p
                      role="alert"
                      className="mt-5 rounded-lg px-4 py-3 text-[0.85rem]"
                      style={{ background: "rgba(180,70,60,0.08)", color: "#8F3A32" }}
                    >
                      {erro}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={enviando}
                    className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-verde px-6 py-4 text-[0.98rem] font-semibold text-white transition-colors hover:bg-verde-800 disabled:pointer-events-none disabled:opacity-60"
                  >
                    {enviando ? "Enviando…" : "Enviar e agendar a anamnese"}
                    {!enviando && <Seta />}
                  </button>
                  <p className="mt-3 text-center text-[0.76rem] text-cinza-claro">
                    Sem compromisso. Nenhum dado é enviado antes desta confirmação.
                  </p>
                </form>
              ) : (
                <div className="mt-6">
                  <p className="corpo-sm">
                    Preferimos dizer isso agora do que depois de uma reunião. Se a
                    situação mudar — inscrição do débito, alteração de regime ou
                    crescimento do passivo —, faz sentido voltar.
                  </p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <Link
                      href="/conteudo"
                      onClick={aoFechar}
                      className="inline-flex items-center gap-2 rounded-lg border border-verde/25 px-5 py-3 text-[0.9rem] font-medium text-verde transition-colors hover:border-verde/60"
                    >
                      Ler a central de conteúdo
                      <Seta />
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        setRespostas({});
                        setIndice(0);
                        setEtapa("qualificar");
                      }}
                      className="rounded-lg px-5 py-3 text-[0.9rem] font-medium text-cinza transition-colors hover:text-verde"
                    >
                      Refazer
                    </button>
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={() => {
                  setEtapa("qualificar");
                  setIndice(PERGUNTAS.length - 1);
                }}
                className="mt-6 text-[0.84rem] text-cinza underline underline-offset-4 transition-colors hover:text-verde"
              >
                Rever as respostas
              </button>
            </div>
          )}

          {/* ---------- Etapa 3: confirmação ---------- */}
          {etapa === "pronto" && (
            <div className="py-6 text-center">
              <span
                className="mx-auto flex h-14 w-14 items-center justify-center rounded-full"
                style={{ background: "rgba(14,158,110,0.12)" }}
              >
                <Marcador className="text-esmeralda" />
              </span>
              <h3 className="subafirmacao mt-5 text-verde">
                A equipe técnica entra em contato
              </h3>
              <p className="corpo-sm mx-auto mt-3 max-w-sm">
                Retornamos em até um dia útil pelo WhatsApp informado, com a lista de
                documentos e a agenda da anamnese. O diagnóstico é concluído em 48 horas
                a partir da entrega dos documentos.
              </p>
              <div className="mx-auto mt-7 flex max-w-xs flex-col gap-3">
                <button
                  type="button"
                  onClick={aoFechar}
                  className="rounded-lg bg-verde px-6 py-3.5 text-[0.95rem] font-semibold text-white transition-colors hover:bg-verde-800"
                >
                  Fechar
                </button>
                <Link
                  href="/conteudo"
                  onClick={aoFechar}
                  className="text-[0.86rem] text-cinza underline underline-offset-4 transition-colors hover:text-verde"
                >
                  Ler enquanto isso
                </Link>
              </div>
              <p className="nota mt-7">
                Se não houver espaço para revisão, o diagnóstico registra essa conclusão
                e apresenta os fundamentos. Não constitui promessa de resultado.
              </p>
            </div>
          )}
        </div>

        {/* Rodapé de marca */}
        <div className="hidden shrink-0 items-center gap-2.5 border-t border-borda bg-osso px-6 py-3 min-[480px]:flex sm:px-8 [@media(max-height:560px)]:hidden">
          <Simbolo tamanho={16} />
          <p className="nota">
            Transação tributária federal e estadual · Lei 13.988/2020 · Lei 17.843/2023
          </p>
        </div>
      </div>
    </div>
  );
}

/* ================================================================ Provider */

export function LeadProvider({ children }: { children: ReactNode }) {
  const [aberto, setAberto] = useState(false);
  const [origem, setOrigem] = useState<Origem>("diagnostico");

  const abrir = useCallback((o: Origem = "diagnostico") => {
    setOrigem(o);
    setAberto(true);
  }, []);

  const valor = useMemo(() => ({ abrir }), [abrir]);

  return (
    <LeadCtx.Provider value={valor}>
      {children}
      {aberto && <Modal origem={origem} aoFechar={() => setAberto(false)} />}
    </LeadCtx.Provider>
  );
}
