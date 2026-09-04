import { useMemo, useState } from "react";
import { rotaPorPath } from "@shared/seo";
import type { Qualificacao } from "@shared/schema";
import { usarSeo, seoDaRota } from "@/lib/seo";
import Formulario from "@/components/site/Formulario";
import {
  Botao,
  Marcador,
  Migalhas,
  Revelar,
  Seta,
  Sobrescrita,
} from "@/components/site/primitivas";

const rota = rotaPorPath("/diagnostico")!;
const migalhas = [
  { nome: "Início", path: "/" },
  { nome: "Diagnóstico", path: "/diagnostico" },
];

/* ------------------------------------------------------------- Perguntas */

type Chave = "esfera" | "faixa" | "regime" | "situacao";

interface Pergunta {
  chave: Chave;
  titulo: string;
  ajuda: string;
  opcoes: { valor: string; rotulo: string; detalhe?: string }[];
}

const PERGUNTAS: Pergunta[] = [
  {
    chave: "esfera",
    titulo: "Onde está o passivo da empresa?",
    ajuda: "A esfera define qual norma e qual motor de cálculo se aplicam ao caso.",
    opcoes: [
      { valor: "federal", rotulo: "Federal", detalhe: "Dívida ativa da União — PGFN" },
      { valor: "estadual", rotulo: "Estadual", detalhe: "Dívida ativa paulista — PGE-SP" },
      { valor: "ambas", rotulo: "Nas duas esferas", detalhe: "Passivo federal e estadual" },
      { valor: "nao_sei", rotulo: "Ainda não sei", detalhe: "A anamnese identifica" },
    ],
  },
  {
    chave: "faixa",
    titulo: "Qual a faixa aproximada do passivo?",
    ajuda: "Valor consolidado, somando principal, juros, multa e encargos.",
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
    titulo: "Qual o regime tributário da empresa?",
    ajuda:
      "A apuração da capacidade efetiva depende das demonstrações contábeis — o regime determina quais existem.",
    opcoes: [
      { valor: "lucro_real", rotulo: "Lucro Real" },
      { valor: "lucro_presumido", rotulo: "Lucro Presumido" },
      { valor: "simples", rotulo: "Simples Nacional" },
      { valor: "outro", rotulo: "Outro ou não sei" },
    ],
  },
  {
    chave: "situacao",
    titulo: "Qual a situação atual da dívida?",
    ajuda: "A transação alcança o crédito já inscrito em dívida ativa.",
    opcoes: [
      { valor: "inscrita", rotulo: "Inscrita em dívida ativa" },
      { valor: "execucao_fiscal", rotulo: "Em execução fiscal" },
      { valor: "ja_transacionada", rotulo: "Já transacionada ou parcelada" },
      { valor: "nao_inscrita", rotulo: "Ainda não inscrita" },
      { valor: "nao_sei", rotulo: "Não sei informar" },
    ],
  },
];

/* --------------------------------------------------------------- Veredito */

type Veredito = {
  chave: "prioritario" | "elegivel" | "condicional" | "fora_de_escopo";
  titulo: string;
  texto: string;
  proximo: string;
  aceitaContato: boolean;
};

/**
 * Regra de elegibilidade — transparente de propósito.
 * O objetivo não é maximizar contatos: é encaminhar ao time apenas os casos
 * que a metodologia consegue atender, e dizer com franqueza quando não é o caso.
 */
function avaliar(r: Record<Chave, string>): Veredito {
  const grande = ["5m_20m", "20m_100m", "acima_100m"].includes(r.faixa);
  const medio = r.faixa === "1m_5m";
  const pequeno = r.faixa === "ate_1m";

  if (r.situacao === "nao_inscrita")
    return {
      chave: "fora_de_escopo",
      titulo: "Ainda não é o momento da transação",
      texto:
        "A transação tributária alcança o crédito já inscrito em dívida ativa. Enquanto o débito não é inscrito, o caminho passa por outras frentes — parcelamento ordinário, discussão administrativa ou revisão do lançamento —, que não são o objeto deste diagnóstico.",
      proximo:
        "Vale acompanhar a inscrição. Assim que ocorrer, o diagnóstico passa a fazer sentido.",
      aceitaContato: false,
    };

  if (r.regime === "simples" && !grande)
    return {
      chave: "fora_de_escopo",
      titulo: "Provavelmente não é o caso",
      texto:
        "Empresas do Simples Nacional com passivo abaixo de R$ 5 milhões raramente comportam a revisão da classificação, porque a apuração da capacidade efetiva depende de demonstrações contábeis que o regime normalmente não produz na profundidade necessária. Para esse perfil, as modalidades de adesão por edital costumam ser o caminho direto — e dispensam análise técnica prévia.",
      proximo:
        "Vale consultar os editais vigentes da PGFN e da PGE-SP, ou falar com o seu contador sobre adesão.",
      aceitaContato: false,
    };

  if (pequeno)
    return {
      chave: "condicional",
      titulo: "Pode caber — com ressalva",
      texto:
        "Passivos abaixo de R$ 1 milhão nem sempre comportam a revisão da classificação, porque o custo do trabalho técnico precisa ser proporcional ao ganho possível. Há exceções: débito antigo, classificação claramente desalinhada ou existência de precatório mudam essa conta.",
      proximo:
        "Se quiser, deixe o contato descrevendo a situação. Avaliamos e respondemos com franqueza se vale seguir.",
      aceitaContato: true,
    };

  if (grande)
    return {
      chave: "prioritario",
      titulo: "Perfil prioritário para diagnóstico",
      texto:
        "O perfil informado é exatamente aquele em que a revisão da classificação costuma produzir a maior diferença. Com os documentos em mãos, o diagnóstico técnico é concluído em 48 horas e indica a classificação apurada, os cenários aplicáveis e a economia potencial — ou os fundamentos da ausência dela.",
      proximo: "Deixe o contato para agendar a anamnese e receber a lista de documentos.",
      aceitaContato: true,
    };

  return {
    chave: "elegivel",
    titulo: "Há espaço para um diagnóstico técnico",
    texto:
      medio
        ? "O perfil informado comporta a análise. Nessa faixa, o resultado costuma depender da idade das inscrições e da distância entre a classificação presumida e a efetiva."
        : "O perfil informado comporta a análise. O diagnóstico verifica a classificação atual, o espaço de revisão e as modalidades a que a empresa tem acesso.",
    proximo: "Deixe o contato para agendar a anamnese e receber a lista de documentos.",
    aceitaContato: true,
  };
}

const CORES: Record<Veredito["chave"], { fundo: string; borda: string; texto: string }> = {
  prioritario: { fundo: "rgba(14,158,110,0.07)", borda: "rgba(14,158,110,0.35)", texto: "#0A5C42" },
  elegivel: { fundo: "rgba(14,158,110,0.05)", borda: "rgba(14,158,110,0.28)", texto: "#0A5C42" },
  condicional: { fundo: "rgba(201,162,39,0.08)", borda: "rgba(201,162,39,0.4)", texto: "#7A6218" },
  fora_de_escopo: { fundo: "rgba(90,107,100,0.07)", borda: "rgba(90,107,100,0.25)", texto: "#41544C" },
};

/* ------------------------------------------------------------------ Página */

export default function Diagnostico() {
  usarSeo(seoDaRota(rota, migalhas));

  const [passo, setPasso] = useState(0);
  const [respostas, setRespostas] = useState<Partial<Record<Chave, string>>>({});

  const completo = PERGUNTAS.every((p) => respostas[p.chave]);
  const veredito = useMemo(
    () => (completo ? avaliar(respostas as Record<Chave, string>) : null),
    [completo, respostas],
  );

  const qualificacao: Qualificacao | undefined =
    completo && veredito
      ? ({ ...(respostas as Record<Chave, string>), veredito: veredito.chave } as Qualificacao)
      : undefined;

  function responder(chave: Chave, valor: string) {
    setRespostas((r) => ({ ...r, [chave]: valor }));
    if (passo < PERGUNTAS.length - 1) setPasso((p) => p + 1);
    else setPasso(PERGUNTAS.length);
  }

  function reiniciar() {
    setRespostas({});
    setPasso(0);
  }

  const atual = PERGUNTAS[passo];
  const progresso = Math.round((Object.keys(respostas).length / PERGUNTAS.length) * 100);

  return (
    <>
      <section className="relative overflow-hidden pb-16 pt-28 md:pt-36">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{ background: "linear-gradient(170deg, #FFFFFF 0%, #F7F6F2 60%)" }}
        />
        <div className="container-t relative">
          <Migalhas itens={migalhas} />

          <div className="grid gap-12 lg:grid-cols-[0.82fr_1.18fr] lg:gap-16">
            <div>
              <Sobrescrita>Diagnóstico de elegibilidade</Sobrescrita>
              <h1
                className="fonte-display mt-5"
                style={{
                  fontSize: "clamp(1.9rem, 1.2rem + 2.6vw, 3rem)",
                  lineHeight: 1.1,
                  letterSpacing: "-0.022em",
                  fontWeight: 500,
                }}
              >
                Quatro perguntas antes de qualquer análise técnica
              </h1>
              <p className="corpo mt-5">
                Este passo existe para não fazer você perder tempo. Ele verifica esfera,
                faixa de passivo, regime e situação da dívida — e diz, com franqueza,
                quando o caso não comporta diagnóstico.
              </p>

              <ul className="mt-8 space-y-3">
                {[
                  "Leva menos de um minuto e não exige nenhum documento.",
                  "O cálculo técnico só acontece depois, na plataforma autenticada.",
                  "Se o perfil não comportar, o resultado diz por quê — e indica o caminho.",
                ].map((i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <Marcador className="mt-1 text-esmeralda" />
                    <span className="text-[0.88rem] leading-relaxed text-tinta">{i}</span>
                  </li>
                ))}
              </ul>

              <p className="nota mt-8">
                As respostas são usadas para direcionar o atendimento. Nada é enviado
                antes de você preencher e confirmar o formulário de contato.
              </p>
            </div>

            {/* Questionário */}
            <div className="cartao overflow-hidden">
              <div className="border-b border-borda px-6 py-4 md:px-8">
                <div className="flex items-center justify-between gap-4">
                  <span className="sobrescrita text-cinza">
                    {passo < PERGUNTAS.length
                      ? `Pergunta ${passo + 1} de ${PERGUNTAS.length}`
                      : "Resultado"}
                  </span>
                  <span className="numeral text-[0.8rem] text-esmeralda">
                    {progresso}%
                  </span>
                </div>
                <div
                  className="mt-3 h-1 w-full overflow-hidden rounded-full"
                  style={{ background: "#EEECE5" }}
                  role="progressbar"
                  aria-valuenow={progresso}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label="Progresso do diagnóstico"
                >
                  <div
                    className="h-full rounded-full transition-[width] duration-500"
                    style={{ width: `${progresso}%`, background: "#0E9E6E" }}
                  />
                </div>
              </div>

              <div className="p-6 md:p-8">
                {passo < PERGUNTAS.length ? (
                  <div key={atual.chave}>
                    <h2 className="fonte-display text-[1.3rem] leading-snug text-verde">
                      {atual.titulo}
                    </h2>
                    <p className="corpo-sm mt-2.5 text-[0.85rem]">{atual.ajuda}</p>

                    <div className="mt-6 grid gap-2.5">
                      {atual.opcoes.map((o) => {
                        const escolhido = respostas[atual.chave] === o.valor;
                        return (
                          <button
                            key={o.valor}
                            type="button"
                            onClick={() => responder(atual.chave, o.valor)}
                            className="flex items-center justify-between gap-4 rounded-md border px-4 py-3.5 text-left transition-colors"
                            style={{
                              borderColor: escolhido ? "#0E9E6E" : "#E3E6E1",
                              background: escolhido ? "rgba(14,158,110,0.05)" : "#fff",
                            }}
                          >
                            <span>
                              <span className="block text-[0.9rem] font-medium text-tinta">
                                {o.rotulo}
                              </span>
                              {o.detalhe && (
                                <span className="mt-0.5 block text-[0.78rem] text-cinza">
                                  {o.detalhe}
                                </span>
                              )}
                            </span>
                            <span
                              aria-hidden="true"
                              className="shrink-0 text-esmeralda opacity-0 transition-opacity"
                              style={{ opacity: escolhido ? 1 : 0 }}
                            >
                              <Marcador />
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    {passo > 0 && (
                      <button
                        type="button"
                        onClick={() => setPasso((p) => p - 1)}
                        className="mt-6 text-[0.82rem] text-cinza underline underline-offset-4 transition-colors hover:text-verde"
                      >
                        Voltar
                      </button>
                    )}
                  </div>
                ) : (
                  veredito && (
                    <div>
                      <div
                        className="rounded-lg border p-6"
                        style={{
                          background: CORES[veredito.chave].fundo,
                          borderColor: CORES[veredito.chave].borda,
                        }}
                      >
                        <h2
                          className="fonte-display text-[1.32rem] leading-snug"
                          style={{ color: CORES[veredito.chave].texto }}
                        >
                          {veredito.titulo}
                        </h2>
                        <p className="corpo-sm mt-3.5">{veredito.texto}</p>
                        <p
                          className="mt-4 border-t pt-4 text-[0.85rem] font-medium"
                          style={{
                            borderColor: CORES[veredito.chave].borda,
                            color: CORES[veredito.chave].texto,
                          }}
                        >
                          {veredito.proximo}
                        </p>
                      </div>

                      <div className="mt-6">
                        {veredito.aceitaContato ? (
                          <Formulario
                            origem="diagnostico"
                            qualificacao={qualificacao}
                            compacto
                            rotuloEnvio="Enviar e agendar a anamnese"
                            rotuloEmpresa="Razão social"
                            placeholderMensagem="Se quiser adiantar: há inscrições antigas? Já houve parcelamento ou transação? Existe precatório disponível?"
                            sucesso="Recebemos as suas respostas e o contato. Nossa equipe retorna com a lista de documentos e a agenda da anamnese."
                          />
                        ) : (
                          <div className="cartao p-6">
                            <p className="corpo-sm">
                              Preferimos dizer isso agora do que depois de uma reunião. Se
                              a situação mudar — inscrição do débito, alteração de regime
                              ou crescimento do passivo —, o diagnóstico passa a fazer
                              sentido e você pode voltar.
                            </p>
                            <div className="mt-5 flex flex-wrap gap-3">
                              <Botao href="/conteudo" variante="secundario">
                                Ler a central de conteúdo
                                <Seta />
                              </Botao>
                              <Botao onClick={reiniciar} variante="fantasma">
                                Refazer o diagnóstico
                              </Botao>
                            </div>
                          </div>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={reiniciar}
                        className="mt-6 text-[0.82rem] text-cinza underline underline-offset-4 transition-colors hover:text-verde"
                      >
                        Refazer o diagnóstico
                      </button>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="secao-sm" style={{ background: "#EFF1EC" }}>
        <div className="container-t">
          <Revelar>
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="titulo-secao">O que acontece depois</h2>
              <p className="corpo mt-4">
                A qualificação termina aqui. O cálculo técnico — aferição da
                classificação, cenários e sensibilidade — acontece na plataforma
                autenticada, depois da anamnese e do envio dos documentos por link
                cifrado.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Botao href="/como-funciona" variante="secundario">
                  Ver as cinco etapas
                  <Seta />
                </Botao>
                <Botao href="/tecnologia" variante="secundario">
                  Como o cálculo é feito
                </Botao>
              </div>
            </div>
          </Revelar>
        </div>
      </section>
    </>
  );
}
