import { Link, useLocation } from "wouter";
import { rotaPorPath } from "@shared/seo";
import { usarSeo, seoDaRota } from "@/lib/seo";
import { INDICADORES, whatsappDaPagina } from "@/data/site";
import { Simbolo } from "@/components/marca/Logo";
import Faq from "@/components/site/Faq";
import CTA from "@/components/site/CTA";
import {
  Botao,
  CabecalhoSecao,
  Marcador,
  Revelar,
  Seta,
  Sobrescrita,
  BlocoResposta,
  NotaLegal,
} from "@/components/site/primitivas";

const rota = rotaPorPath("/")!;

/* --------------------------------------------------------------- Hero */

function Hero() {
  const [local] = useLocation();

  return (
    <section className="relative overflow-hidden pb-16 pt-28 md:pb-24 md:pt-36">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(168deg, #FFFFFF 0%, #F7F6F2 46%, #EFF3F0 100%)",
        }}
      />
      <div
        aria-hidden="true"
        className="grade-fina pointer-events-none absolute inset-0 opacity-60"
        style={{
          maskImage: "radial-gradient(ellipse 80% 60% at 70% 20%, #000 0%, transparent 72%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 60% at 70% 20%, #000 0%, transparent 72%)",
        }}
      />

      <div className="container-t relative">
        <div className="grid items-center gap-14 lg:grid-cols-[1.08fr_0.92fr] lg:gap-16">
          <div>
            <Revelar>
              <Sobrescrita>Transação tributária federal e estadual</Sobrescrita>
            </Revelar>

            <Revelar atraso={60}>
              <h1 className="titulo-hero mt-6">
                Sua dívida com o governo pode custar{" "}
                <em style={{ fontStyle: "italic", color: "#0E9E6E" }}>
                  bem menos
                </em>{" "}
                do que custa hoje
              </h1>
            </Revelar>

            <Revelar atraso={120}>
              <p className="corpo mt-6 max-w-xl">
                A União e o Estado de São Paulo negociam dívidas tributárias inscritas
                com desconto, entrada facilitada e prazo alongado. O tamanho do desconto
                depende de uma classificação atribuída à sua empresa — e essa
                classificação é presumida por sistema.{" "}
                <strong style={{ color: "#0A5C42", fontWeight: 600 }}>
                  A própria lei permite corrigi-la.
                </strong>
              </p>
            </Revelar>

            <Revelar atraso={180}>
              <div className="mt-9 flex flex-wrap gap-3">
                <Botao href="/diagnostico" tamanho="lg">
                  Fazer o diagnóstico
                  <Seta />
                </Botao>
                <Botao href="/como-funciona" variante="secundario" tamanho="lg">
                  Como funciona
                </Botao>
              </div>
            </Revelar>

            <Revelar atraso={240}>
              <p className="nota mt-6 max-w-lg">
                Diagnóstico técnico concluído em 48 horas. Pode concluir que não há
                espaço de revisão — e, nesse caso, apresenta os fundamentos.
              </p>
            </Revelar>
          </div>

          {/* Painel: a classificação como eixo do desconto */}
          <Revelar atraso={200}>
            <div className="cartao relative overflow-hidden p-7 md:p-8">
              <div
                aria-hidden="true"
                className="absolute -right-3 -top-3 h-24 w-24 opacity-[0.04]"
              >
                <Simbolo tamanho={96} />
              </div>

              <p className="sobrescrita" style={{ color: "#0E9E6E" }}>
                O eixo da negociação
              </p>

              <div className="mt-7 space-y-6">
                <div>
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="text-[0.78rem] font-medium uppercase tracking-wider text-cinza">
                      Classificação presumida
                    </span>
                    <span className="numeral text-[0.95rem] text-cinza-claro">hoje</span>
                  </div>
                  <div
                    className="mt-2.5 h-3 w-full rounded-sm"
                    style={{ background: "#0A5C42" }}
                  />
                  <p className="nota mt-2">
                    Calculada por sistema parametrizado, desconsidera a situação
                    econômico-financeira global da empresa.
                  </p>
                </div>

                <div>
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="text-[0.78rem] font-medium uppercase tracking-wider text-verde">
                      Classificação efetiva
                    </span>
                    <span className="numeral text-[0.95rem] text-esmeralda">
                      apurada
                    </span>
                  </div>
                  <div className="mt-2.5 flex gap-1">
                    <div
                      className="h-3 rounded-sm"
                      style={{ background: "#0E9E6E", width: "54%" }}
                    />
                    <div
                      className="h-3 flex-1 rounded-sm border border-dashed"
                      style={{ borderColor: "rgba(14,158,110,0.4)" }}
                    />
                  </div>
                  <p className="nota mt-2">
                    Apurada das demonstrações por metodologias oficiais. É a diferença
                    entre as duas que reabre o desconto.
                  </p>
                </div>
              </div>

              <div className="mt-7 border-t border-borda pt-5">
                <div className="grid grid-cols-2 gap-x-4 gap-y-5">
                  {INDICADORES.map((i) => (
                    <div key={i.rotulo}>
                      <p className="numeral text-[1.7rem] text-verde">
                        {i.valor}
                        <span className="text-[0.95rem] text-esmeralda"> {i.unidade}</span>
                      </p>
                      <p className="nota mt-1 leading-snug">{i.rotulo}</p>
                    </div>
                  ))}
                </div>
              </div>

              <p className="nota mt-6" style={{ fontSize: "0.7rem" }}>
                Representação esquemática do princípio da revisão. Não representa caso
                real nem projeção de resultado.
              </p>
            </div>
          </Revelar>
        </div>
      </div>
    </section>
  );
}

/* --------------------------------------------------- Os três fatos */

const FATOS = [
  {
    titulo: "Existe desconto por lei",
    texto:
      "Reduzir juros, multas e encargos, com entrada e prazo facilitados, está previsto em norma. Não é favor: é direito de quem se enquadra.",
    ref: "Lei 13.988/2020 · Lei estadual 17.843/2023",
  },
  {
    titulo: "A classificação define o desconto",
    texto:
      "O governo classifica a capacidade de pagamento na esfera federal e o grau de recuperabilidade na estadual. É essa nota que determina se haverá desconto, a entrada e o prazo.",
    ref: "Portaria PGFN 6.757/2022 · Resolução PGE 6/2024",
  },
  {
    titulo: "A classificação pode estar errada",
    texto:
      "Ela é presumida a partir de um sistema parametrizado que desconsidera a empresa em sua realidade global. E a própria legislação permite corrigi-la.",
    ref: "Revisão de CAPAG · Revisão do grau",
  },
];

function Fatos() {
  return (
    <section className="secao">
      <div className="container-t">
        <Revelar>
          <BlocoResposta>{rota.resumo}</BlocoResposta>
        </Revelar>

        <div className="mt-14 grid gap-px overflow-hidden rounded-lg border border-borda bg-borda md:grid-cols-3">
          {FATOS.map((f, i) => (
            <Revelar key={f.titulo} atraso={i * 70} className="bg-white p-7 md:p-8">
              <span className="numeral text-[0.8rem] tracking-widest text-esmeralda">
                0{i + 1}
              </span>
              <h3 className="titulo-card mt-4">{f.titulo}</h3>
              <p className="corpo-sm mt-3">{f.texto}</p>
              <p className="nota mt-5 border-t border-borda pt-4">{f.ref}</p>
            </Revelar>
          ))}
        </div>

        <Revelar atraso={120}>
          <p className="corpo mx-auto mt-12 max-w-2xl text-center">
            <strong style={{ color: "#0A5C42", fontWeight: 600 }}>
              Nosso trabalho:
            </strong>{" "}
            conferir a sua classificação, corrigi-la quando couber e negociar as melhores
            condições que a lei permite. Tudo documentado e dentro da lei.
          </p>
        </Revelar>
      </div>
    </section>
  );
}

/* ------------------------------------------------------ Duas esferas */

const ESFERAS = [
  {
    tag: "Federal",
    orgao: "PGFN · Capacidade de pagamento",
    titulo: "Dívida ativa da União",
    texto:
      "A CAPAG presumida é reconstituída do extrato da PGFN e comparada à efetiva, apurada das demonstrações por metodologias oficiais — GRF e PLR. O grau resulta da cobertura da dívida pela capacidade apurada.",
    itens: [
      "Revisão de CAPAG-P para CAPAG-E",
      "Escolha da melhor porta no sistema multiportas",
      "Proposta individual com análise de sensibilidade",
    ],
    teto: "até 65%",
    tetoNota: "e até 75% em hipóteses específicas",
    path: "/transacao-federal",
    base: "Lei 13.988/2020 · Portaria PGFN 6.757/2022",
  },
  {
    tag: "Estadual",
    orgao: "PGE-SP · Grau de recuperabilidade",
    titulo: "Dívida ativa paulista",
    texto:
      "A nota final NF = G + P + H + I define a faixa de recuperabilidade do crédito. A aferição prévia mostra qual critério puxa a nota para cima e quanto ele precisaria mudar para reabrir o desconto.",
    itens: [
      "Aferição e simulação prévia do grau",
      "Pedido de revisão quando o grau está subestimado",
      "Acordo Paulista ou proposta individual",
    ],
    teto: "até 60%",
    tetoNota: "e até 75% para ME/EPP e recuperação judicial",
    path: "/transacao-estadual",
    base: "Lei estadual 17.843/2023 · Resolução PGE 6/2024",
  },
];

function Esferas() {
  return (
    <section className="secao-sm">
      <div className="container-t">
        <Revelar>
          <CabecalhoSecao
            sobrescrita="Duas esferas, um só diagnóstico"
            titulo="A maioria dos grupos carrega passivo nas duas"
            descricao="Tratá-las isoladamente é o erro mais comum: a estratégia de uma restringe a da outra. Escolha por onde começar."
          />
        </Revelar>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {ESFERAS.map((e, i) => (
            <Revelar key={e.tag} atraso={i * 90}>
              <Link
                href={e.path}
                className="group flex h-full flex-col rounded-lg border border-borda bg-white p-7 transition-[border-color,transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:border-esmeralda/45 hover:shadow-[0_10px_34px_-18px_rgba(10,92,66,0.35)] md:p-9"
              >
                <div className="flex items-center justify-between gap-4">
                  <span
                    className="rounded-sm px-2.5 py-1 text-[0.66rem] font-semibold uppercase tracking-[0.14em]"
                    style={{ background: "rgba(14,158,110,0.1)", color: "#0A5C42" }}
                  >
                    {e.tag}
                  </span>
                  <span className="nota">{e.orgao}</span>
                </div>

                <h3 className="fonte-display mt-6 text-[1.6rem] leading-tight text-verde">
                  {e.titulo}
                </h3>
                <p className="corpo-sm mt-3.5 flex-1">{e.texto}</p>

                <ul className="mt-6 space-y-2.5">
                  {e.itens.map((it) => (
                    <li key={it} className="flex items-start gap-2.5">
                      <Marcador className="mt-1 text-esmeralda" />
                      <span className="text-[0.875rem] leading-relaxed text-tinta">
                        {it}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="mt-7 flex items-end justify-between gap-4 border-t border-borda pt-6">
                  <div>
                    <p className="numeral text-[2rem] text-verde">{e.teto}</p>
                    <p className="nota mt-1 max-w-[16rem]">{e.tetoNota}</p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-[0.82rem] font-medium text-verde transition-transform duration-300 group-hover:translate-x-0.5">
                    Ver a esfera
                    <Seta />
                  </span>
                </div>

                <p className="nota mt-5">{e.base}</p>
              </Link>
            </Revelar>
          ))}
        </div>

        <NotaLegal>
          Percentuais conforme a classificação apurada e os limites da lei aplicável.
          Os descontos incidem sobre juros, multas e encargos ou honorários — não sobre
          o valor principal. Não constitui promessa de resultado.
        </NotaLegal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------ Antes e depois */

const HOJE = [
  "Desconto limitado ou ausente, calculado sobre uma capacidade de pagamento superestimada.",
  "Entrada pesada, com percentual inicial alto que pressiona o caixa de uma só vez.",
  "Prazo curto, com parcelas que não cabem no fluxo real da empresa.",
];

const DEPOIS = [
  "Desconto maior: redução de juros, multa e encargos até o limite que a lei permite.",
  "Entrada menor, compatível com a capacidade efetiva demonstrada.",
  "Prazo alongado, com parcela que cabe no caixa da empresa.",
];

function AntesDepois() {
  return (
    <section className="fundo-escuro">
      <div className="container-t secao">
        <Revelar>
          <CabecalhoSecao
            claro
            sobrescrita="Na prática"
            titulo="O que muda quando a classificação é corrigida"
          />
        </Revelar>

        <div className="mt-12 grid gap-6 md:grid-cols-2 md:gap-8">
          <Revelar>
            <div
              className="h-full rounded-lg border p-7 md:p-9"
              style={{ borderColor: "#24332D", background: "rgba(255,255,255,0.015)" }}
            >
              <p className="sobrescrita" style={{ color: "#8AA098" }}>
                Hoje
              </p>
              <p
                className="fonte-display mt-3 text-[1.35rem]"
                style={{ color: "#c6d3ce" }}
              >
                Com a classificação presumida
              </p>
              <ul className="mt-7 space-y-5">
                {HOJE.map((t) => (
                  <li key={t} className="flex items-start gap-3.5">
                    <span
                      aria-hidden="true"
                      className="mt-2 h-px w-4 shrink-0"
                      style={{ background: "#4d5f58" }}
                    />
                    <span className="text-[0.9rem] leading-relaxed" style={{ color: "#8ea19a" }}>
                      {t}
                    </span>
                  </li>
                ))}
              </ul>
              <p
                className="mt-8 border-t pt-5 text-[0.82rem]"
                style={{ borderColor: "#24332D", color: "#8AA098" }}
              >
                Condições definidas por um modelo automático.
              </p>
            </div>
          </Revelar>

          <Revelar atraso={90}>
            <div
              className="h-full rounded-lg border p-7 md:p-9"
              style={{
                borderColor: "rgba(14,158,110,0.4)",
                background:
                  "linear-gradient(155deg, rgba(14,158,110,0.10) 0%, rgba(14,158,110,0.02) 60%)",
              }}
            >
              <p className="sobrescrita" style={{ color: "#3FD9A0" }}>
                Depois
              </p>
              <p className="fonte-display mt-3 text-[1.35rem] text-white">
                Com a classificação efetiva
              </p>
              <ul className="mt-7 space-y-5">
                {DEPOIS.map((t) => (
                  <li key={t} className="flex items-start gap-3.5">
                    <Marcador className="mt-1 text-esmeralda-clara" />
                    <span className="text-[0.9rem] leading-relaxed" style={{ color: "#dfe9e5" }}>
                      {t}
                    </span>
                  </li>
                ))}
              </ul>
              <p
                className="mt-8 border-t pt-5 text-[0.82rem]"
                style={{ borderColor: "rgba(14,158,110,0.25)", color: "#3FD9A0" }}
              >
                Condições construídas sobre a realidade da empresa.
              </p>
            </div>
          </Revelar>
        </div>

        <p className="nota mt-8">
          Cenário ilustrativo. O resultado real é apurado no diagnóstico. Este material
          não constitui promessa de resultado.
        </p>
      </div>
    </section>
  );
}

/* --------------------------------------------------------- Três passos */

const PASSOS = [
  {
    n: "1",
    titulo: "Diagnóstico",
    texto:
      "Você envia os documentos pelo link gerado pela plataforma. Em 48 horas dizemos se há espaço de economia, de quanto — ou por que não há.",
  },
  {
    n: "2",
    titulo: "Revisão da classificação",
    texto:
      "Demonstramos ao governo a situação real da empresa e pedimos a correção da classificação, com base jurídica, contábil e econômica.",
  },
  {
    n: "3",
    titulo: "Negociação",
    texto:
      "Estruturamos a melhor transação possível, protocolamos, negociamos e acompanhamos até a homologação final.",
  },
];

function Passos() {
  return (
    <section className="secao">
      <div className="container-t">
        <Revelar>
          <CabecalhoSecao
            sobrescrita="Simples assim"
            titulo="Nosso trabalho, em três passos"
            descricao="Você não precisa entender de tributário. Precisa apenas enviar os documentos — o resto é com a nossa equipe."
          />
        </Revelar>

        <div className="mt-12 grid gap-8 md:grid-cols-3 md:gap-10">
          {PASSOS.map((p, i) => (
            <Revelar key={p.n} atraso={i * 80}>
              <div className="border-t-2 pt-6" style={{ borderColor: "#0E9E6E" }}>
                <div className="flex items-baseline gap-3">
                  <span className="numeral text-[2.6rem] text-verde">{p.n}</span>
                  <h3 className="titulo-card">{p.titulo}</h3>
                </div>
                <p className="corpo-sm mt-4">{p.texto}</p>
              </div>
            </Revelar>
          ))}
        </div>

        <Revelar atraso={200}>
          <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-4 rounded-lg border border-borda bg-white px-7 py-6">
            <p className="corpo-sm flex-1" style={{ minWidth: "18rem" }}>
              A cada etapa você decide se avança, sempre com números na mesa.{" "}
              <strong style={{ color: "#0A5C42", fontWeight: 600 }}>
                Nada acontece sem a sua aprovação.
              </strong>
            </p>
            <Botao href="/como-funciona" variante="secundario">
              Ver o método completo
              <Seta />
            </Botao>
          </div>
        </Revelar>
      </div>
    </section>
  );
}

/* --------------------------------------------------- Por que funciona */

const DIFERENCIAIS = [
  {
    titulo: "Tecnologia própria",
    itens: [
      ["Motores determinísticos", "mesma entrada e mesmos parâmetros produzem sempre o mesmo resultado."],
      ["Parâmetros versionados", "cada norma tem vigência datada; a data do caso define a versão aplicável."],
      ["Extração com citação literal", "cada dado vem com o trecho de origem, exibido para conferência."],
      ["Rastreabilidade total", "todo número reconstituível até o documento e a pessoa que aprovou."],
    ],
  },
  {
    titulo: "Análise jurídica e contábil",
    itens: [
      ["Leitura de campo", "tese sustentável nasce de quem já enfrentou a Fazenda nas duas esferas."],
      ["Fundamentação técnica", "o pedido de revisão é peça jurídica com sede normativa citada."],
      ["Visão contábil-fiscal", "demonstrações lidas por profissionais qualificados."],
      ["Execução até o fim", "da proposta ao protocolo e à homologação."],
    ],
  },
];

function PorQueFunciona() {
  return (
    <section className="secao" style={{ background: "#EFF1EC" }}>
      <div className="container-t">
        <Revelar>
          <CabecalhoSecao
            sobrescrita="Por que funciona"
            titulo="Dois diferenciais que só fazem sentido juntos"
            descricao="A tecnologia acelera e prova. Os profissionais decidem e sustentam."
          />
        </Revelar>

        <div className="mt-12 grid gap-6 lg:grid-cols-2 lg:gap-8">
          {DIFERENCIAIS.map((d, i) => (
            <Revelar key={d.titulo} atraso={i * 90}>
              <div className="h-full rounded-lg border border-borda bg-white p-7 md:p-9">
                <h3 className="fonte-display text-[1.4rem] text-verde">{d.titulo}</h3>
                <dl className="mt-7 space-y-5">
                  {d.itens.map(([t, desc]) => (
                    <div key={t} className="border-t border-borda pt-5 first:border-0 first:pt-0">
                      <dt className="text-[0.9rem] font-semibold text-verde">{t}</dt>
                      <dd className="corpo-sm mt-1.5">{desc}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </Revelar>
          ))}
        </div>

        <Revelar atraso={180}>
          <div className="mt-8 flex flex-wrap items-center justify-between gap-5 rounded-lg border border-verde/15 bg-white px-7 py-6">
            <p className="corpo-sm max-w-2xl">
              <strong style={{ color: "#0A5C42", fontWeight: 600 }}>
                A IA faz a leitura assistida. O cálculo não usa IA.
              </strong>{" "}
              Cada valor extraído carrega o trecho literal do documento, exibido lado a
              lado — e nada alimenta o cálculo antes de conferido e aprovado por uma
              pessoa.
            </p>
            <Botao href="/tecnologia" variante="secundario">
              Ver a tecnologia
              <Seta />
            </Botao>
          </div>
        </Revelar>
      </div>
    </section>
  );
}

/* ------------------------------------------------------- Frentes de trabalho */

const FRENTES = [
  "Revisão do grau (PGE-SP)",
  "Revisão de CAPAG (PGFN)",
  "Proposta individual",
  "Escolha da modalidade",
  "Depuração das inscrições",
  "Grupo econômico",
  "Repactuação de transação",
  "Administração do passivo",
  "Amortização com precatório",
];

function Frentes() {
  return (
    <section className="secao-sm">
      <div className="container-t">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <Revelar>
            <CabecalhoSecao
              sobrescrita="O que dá para fazer"
              titulo="As frentes de trabalho"
              descricao="O resultado raramente vem de uma alavanca só. O diagnóstico indica quais se aplicam ao caso concreto."
            />
          </Revelar>

          <Revelar atraso={80}>
            <ul className="grid gap-px overflow-hidden rounded-lg border border-borda bg-borda sm:grid-cols-2">
              {FRENTES.map((f) => (
                <li
                  key={f}
                  className="flex items-center gap-3 bg-white px-5 py-4 text-[0.875rem] text-tinta"
                >
                  <span
                    aria-hidden="true"
                    className="h-1.5 w-1.5 shrink-0 rounded-[1px]"
                    style={{ background: "#0E9E6E" }}
                  />
                  {f}
                </li>
              ))}
            </ul>
          </Revelar>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- Home */

export default function Home() {
  usarSeo(seoDaRota(rota));

  return (
    <>
      <Hero />
      <Fatos />
      <Esferas />
      <AntesDepois />
      <Passos />
      <PorQueFunciona />
      <Frentes />
      <Faq
        itens={rota.faq!}
        titulo="O que perguntam antes de começar"
        descricao="Respostas objetivas, com a base normativa indicada. Se a sua pergunta não estiver aqui, fale com a equipe."
      />
      <CTA />
    </>
  );
}
