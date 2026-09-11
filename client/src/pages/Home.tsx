import { Link } from "wouter";
import { rotaPorPath } from "@shared/seo";
import { usarSeo, seoDaRota } from "@/lib/seo";
import { INDICADORES, SOCIOS } from "@/data/site";
import { Simbolo } from "@/components/marca/Logo";
import { usarLead } from "@/components/site/LeadModal";
import Jornada from "@/components/site/Jornada";
import Retrato from "@/components/site/Retrato";
import Faq from "@/components/site/Faq";
import CTA from "@/components/site/CTA";
import {
  Abertura,
  Botao,
  Indicador,
  Marcador,
  NotaLegal,
  Revelar,
  Seta,
  Sobrescrita,
} from "@/components/site/primitivas";

const rota = rotaPorPath("/")!;

/* ============================================================ 1 · Hero ==== */

function Hero() {
  const { abrir } = usarLead();
  return (
    <section className="faixa-escura relative overflow-hidden">
      <div aria-hidden="true" className="pointer-events-none absolute right-[-180px] top-20 opacity-[0.035]">
        <Simbolo variante="branco" tamanho={620} />
      </div>
      <div className="coluna-larga relative z-10 pb-12 pt-32 md:pb-16 md:pt-36">
        <Sobrescrita claro>Transacione · Gestão do passivo tributário</Sobrescrita>
        <h1 className="fonte-display mt-6 max-w-4xl text-[clamp(2.2rem,5vw,4.25rem)] leading-[1.08] tracking-[-0.035em] text-white">
          Administração estratégica do <em className="text-esmeralda-clara">passivo tributário</em>
        </h1>
        <p className="mt-6 max-w-2xl text-[1.05rem] leading-relaxed text-[#DFE9E5] md:text-lg">
          Da gestão da dívida à transação e ao encontro de contas com precatório.
          O diagnóstico indica quando agir e qual caminho faz sentido para a sua empresa.
        </p>
        <h2 className="sobrescrita mb-5 mt-10 text-esmeralda-clara">Uma jornada em quatro ciclos</h2>
        <Jornada claro />
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Botao variante="esmeralda" tamanho="lg" onClick={() => abrir("diagnostico")}>Avaliar minha dívida <Seta /></Botao>
          <Botao href="/como-funciona" variante="contorno-claro" tamanho="lg">Entender a jornada <Seta /></Botao>
        </div>
        <p className="nota mt-5 max-w-2xl">Diagnóstico técnico em 48 horas a partir da entrega dos documentos. Cada etapa avança com a sua aprovação e a análise das condições do caso.</p>
      </div>
    </section>
  );
}

/* ================================================= 2 · A nota que decide == */

const FATOS = [
  {
    n: "01",
    titulo: "Existe desconto por lei",
    texto:
      "Reduzir juros, multas e encargos, com entrada e prazo facilitados, está previsto em norma. A concessão depende do enquadramento e da aprovação nas condições aplicáveis.",
  },
  {
    n: "02",
    titulo: "Uma nota define quanto",
    texto:
      "Capacidade de pagamento na esfera federal, grau de recuperabilidade na estadual. É essa nota que determina o desconto, a entrada e o prazo.",
  },
  {
    n: "03",
    titulo: "A nota pode estar errada",
    texto:
      "Ela sai de um sistema parametrizado que não enxerga a empresa em sua realidade global. E a própria legislação admite pedido de revisão.",
  },
];

function ANota() {
  return (
    <section className="faixa-clara faixa">
      <div className="coluna">
        <Revelar>
          <Abertura
            sobrescrita="Uma das frentes da transação"
            titulo={
              <>
                A conta que o governo faz sobre a sua empresa{" "}
                <em style={{ fontStyle: "italic", color: "#0E9E6E" }}>pode estar errada</em>
              </>
            }
            resposta="A União e o Estado de São Paulo negociam dívidas inscritas com desconto sobre juros, multa e encargos. O tamanho do desconto sai de uma classificação que a empresa não escolheu e, quase sempre, nunca conferiu."
          />
        </Revelar>

        <div className="mt-16 space-y-12">
          {FATOS.map((f, i) => (
            <Revelar key={f.n} atraso={i * 80}>
              <div className="flex gap-6 md:gap-8">
                <span
                  className="numeral shrink-0 pt-1 text-[1.1rem]"
                  style={{ color: "#0E9E6E" }}
                >
                  {f.n}
                </span>
                <div className="border-t border-borda pt-1">
                  <h3 className="subafirmacao text-verde">{f.titulo}</h3>
                  <p className="corpo mt-3">{f.texto}</p>
                </div>
              </div>
            </Revelar>
          ))}
        </div>

        <Revelar atraso={120}>
          <p className="afirmacao mt-16 text-center">
            <span className="grifo">
              Nosso trabalho é conferir essa nota, corrigi-la quando couber e negociar o
              que a lei permite.
            </span>
          </p>
        </Revelar>
      </div>
    </section>
  );
}

/* ========================================== 3 · O que muda na prática ===== */

const HOJE = [
  "Desconto limitado ou ausente, calculado sobre uma capacidade superestimada.",
  "Entrada pesada, que pressiona o caixa de uma só vez.",
  "Prazo curto, com parcelas que não cabem no fluxo real.",
];

const DEPOIS = [
  "Desconto maior: juros, multa e encargos reduzidos até o limite da lei.",
  "Entrada menor, compatível com a capacidade efetiva demonstrada.",
  "Prazo alongado, com parcela que cabe no caixa da empresa.",
];

function NaPratica() {
  return (
    <section className="faixa-escura faixa relative overflow-hidden">
      <div
        aria-hidden="true"
        className="halo"
        style={{ width: 480, height: 480, right: "-8%", top: "10%" }}
      />
      <div className="coluna-larga relative">
        <Revelar>
          <Abertura claro sobrescrita="Na prática" titulo="O que muda quando a nota é corrigida" />
        </Revelar>

        <div className="mt-14 grid gap-5 md:grid-cols-2 md:gap-7">
          <Revelar>
            <div
              className="h-full rounded-xl border p-7 md:p-9"
              style={{ borderColor: "#24332D", background: "rgba(255,255,255,0.015)" }}
            >
              <p className="sobrescrita" style={{ color: "#8AA098" }}>
                Hoje
              </p>
              <p className="subafirmacao mt-3" style={{ color: "#C6D3CE" }}>
                Com a nota presumida
              </p>
              <ul className="mt-8 space-y-5">
                {HOJE.map((t) => (
                  <li key={t} className="flex items-start gap-3.5">
                    <span
                      aria-hidden="true"
                      className="mt-2.5 h-px w-4 shrink-0"
                      style={{ background: "#4D5F58" }}
                    />
                    <span className="text-[0.94rem] leading-relaxed" style={{ color: "#8EA19A" }}>
                      {t}
                    </span>
                  </li>
                ))}
              </ul>
              <p
                className="mt-9 border-t pt-5 text-[0.84rem]"
                style={{ borderColor: "#24332D", color: "#8AA098" }}
              >
                Condições definidas por um modelo automático.
              </p>
            </div>
          </Revelar>

          <Revelar atraso={90}>
            <div
              className="h-full rounded-xl border p-7 md:p-9"
              style={{
                borderColor: "rgba(14,158,110,0.42)",
                background:
                  "linear-gradient(155deg, rgba(14,158,110,0.12) 0%, rgba(14,158,110,0.02) 62%)",
              }}
            >
              <p className="sobrescrita" style={{ color: "#3FD9A0" }}>
                Depois
              </p>
              <p className="subafirmacao mt-3 text-white">Com a nota efetiva</p>
              <ul className="mt-8 space-y-5">
                {DEPOIS.map((t) => (
                  <li key={t} className="flex items-start gap-3.5">
                    <Marcador className="mt-1 text-esmeralda-clara" />
                    <span className="text-[0.94rem] leading-relaxed" style={{ color: "#DFE9E5" }}>
                      {t}
                    </span>
                  </li>
                ))}
              </ul>
              <p
                className="mt-9 border-t pt-5 text-[0.84rem]"
                style={{ borderColor: "rgba(14,158,110,0.25)", color: "#3FD9A0" }}
              >
                Condições construídas sobre a realidade da empresa.
              </p>
            </div>
          </Revelar>
        </div>

        <NotaLegal centro>
          Cenário ilustrativo. O resultado real é apurado no diagnóstico. Este material não
          constitui promessa de resultado.
        </NotaLegal>
      </div>
    </section>
  );
}

/* ================================================== 4 · As duas esferas === */

const ESFERAS = [
  {
    tag: "Federal",
    orgao: "PGFN · Capacidade de pagamento",
    titulo: "Dívida ativa da União",
    texto:
      "A CAPAG presumida é reconstituída do extrato da PGFN e comparada à efetiva, apurada das demonstrações por metodologias oficiais — GRF e PLR.",
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
      "A nota final NF = G + P + H + I define a faixa do crédito. A aferição prévia mostra qual critério puxa a nota para cima e quanto precisaria mudar.",
    itens: [
      "Aferição e simulação prévia do grau",
      "Pedido de revisão quando o grau está subestimado",
      "Acordo Paulista ou proposta individual",
    ],
    teto: "até 65%",
    tetoNota: "e até 70% nas hipóteses especiais previstas",
    path: "/transacao-estadual",
    base: "Lei estadual 17.843/2023 · Resolução PGE 6/2024",
  },
];

function Esferas() {
  return (
    <section className="faixa-clara faixa">
      <div className="coluna-larga">
        <Revelar>
          <Abertura
            sobrescrita="Duas esferas, um só diagnóstico"
            titulo="A maioria dos grupos carrega passivo nas duas"
            resposta="Tratá-las isoladamente é o erro mais comum: a estratégia de uma restringe a da outra. Escolha por onde começar."
          />
        </Revelar>

        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          {ESFERAS.map((e, i) => (
            <Revelar key={e.tag} atraso={i * 90}>
              <Link
                href={e.path}
                className="group flex h-full flex-col rounded-xl border border-borda bg-white p-8 transition-[border-color,transform,box-shadow] duration-300 hover:-translate-y-1 hover:border-esmeralda/45 hover:shadow-[0_16px_44px_-24px_rgba(10,92,66,0.4)] md:p-10"
              >
                <div className="flex items-center justify-between gap-4">
                  <span
                    className="rounded-md px-2.5 py-1 text-[0.66rem] font-semibold uppercase tracking-[0.14em]"
                    style={{ background: "rgba(14,158,110,0.1)", color: "#0A5C42" }}
                  >
                    {e.tag}
                  </span>
                  <span className="nota">{e.orgao}</span>
                </div>

                <h3 className="afirmacao mt-7 text-[1.65rem] leading-tight md:text-[1.9rem]">
                  {e.titulo}
                </h3>
                <p className="corpo-sm mt-4 flex-1">{e.texto}</p>

                <ul className="mt-7 space-y-3">
                  {e.itens.map((it) => (
                    <li key={it} className="flex items-start gap-2.5">
                      <Marcador className="mt-1 text-esmeralda" />
                      <span className="text-[0.9rem] leading-relaxed text-tinta">{it}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-8 flex items-end justify-between gap-4 border-t border-borda pt-7">
                  <div>
                    <p className="numeral text-[2.3rem] text-verde">{e.teto}</p>
                    <p className="nota mt-2 max-w-[17rem]">{e.tetoNota}</p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-[0.85rem] font-medium text-verde transition-transform duration-300 group-hover:translate-x-1">
                    Ver a esfera
                    <Seta />
                  </span>
                </div>

                <p className="nota mt-5">{e.base}</p>
              </Link>
            </Revelar>
          ))}
        </div>

        <NotaLegal centro>
          Percentuais conforme a classificação apurada e os limites da lei aplicável. Os
          descontos incidem sobre juros, multas e encargos ou honorários — não sobre o valor
          principal.
        </NotaLegal>
      </div>
    </section>
  );
}

/* ==================================================== 5 · Como funciona === */

function Precatorios() {
  return (
    <section className="faixa-verde faixa">
      <div className="coluna-larga">
        <Abertura claro alinhamento="esquerda" sobrescrita="Precatórios · Estadual e federal"
          titulo="A dívida foi negociada. O próximo passo pode estar no precatório."
          resposta="Além dos descontos da transação, avaliamos o uso de crédito próprio ou adquirido com deságio para amortizar o saldo. Da análise do título ao encontro de contas, cada esfera tem seu caminho." />
        <div className="mt-9 grid gap-5 md:grid-cols-2">
          <div className="rounded-xl border border-white/20 p-7">
            <h3 className="subafirmacao text-white">São Paulo · PGE-SP</h3>
            <p className="corpo-sm mt-3">Aquisição e regularização do precatório, seguidas de validação administrativa e amortização, nos limites da transação paulista.</p>
            <Botao className="mt-6" href="/precatorios#estadual" variante="contorno-claro">Ver o fluxo estadual <Seta /></Botao>
          </div>
          <div className="rounded-xl border border-white/20 p-7">
            <h3 className="subafirmacao text-white">União · PGFN</h3>
            <p className="corpo-sm mt-3">Estruturação da operação, regularização no tribunal e pedido no Regularize para amortizar ou liquidar o saldo, inclusive parcelas vincendas elegíveis do acordo.</p>
            <Botao className="mt-6" href="/precatorios#federal" variante="contorno-claro">Ver o fluxo federal <Seta /></Botao>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ====================================================== 6 · A tecnologia == */

function Tecnologia() {
  return (
    <section className="faixa-clara faixa">
      <div className="coluna-larga">
        <Revelar>
          <Abertura
            sobrescrita="Confiança no número"
            titulo="A IA lê. A IA não calcula."
            resposta="Ler um documento é uma tarefa. Aplicar uma regra normativa é outra. Tratá-las como a mesma coisa é o que produz número indefensável."
          />
        </Revelar>

        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          <Revelar>
            <div className="h-full rounded-xl border border-borda bg-white p-8 md:p-10">
              <span
                className="rounded-md px-2.5 py-1 text-[0.66rem] font-semibold uppercase tracking-[0.14em]"
                style={{ background: "rgba(14,158,110,0.1)", color: "#0A5C42" }}
              >
                IA sim
              </span>
              <h3 className="afirmacao mt-6 text-[1.5rem] md:text-[1.75rem]">
                A leitura assistida
              </h3>
              <p className="corpo-sm mt-4">
                Cada valor extraído carrega o trecho literal do documento, exibido lado a
                lado para conferência. Nada alimenta o cálculo antes de ser aprovado por uma
                pessoa identificada.
              </p>
            </div>
          </Revelar>

          <Revelar atraso={90}>
            <div
              className="h-full rounded-xl border bg-white p-8 md:p-10"
              style={{ borderColor: "rgba(10,92,66,0.3)" }}
            >
              <span
                className="rounded-md px-2.5 py-1 text-[0.66rem] font-semibold uppercase tracking-[0.14em]"
                style={{ background: "rgba(180,70,60,0.1)", color: "#B4463C" }}
              >
                IA não
              </span>
              <h3 className="afirmacao mt-6 text-[1.5rem] md:text-[1.75rem]">O cálculo</h3>
              <p className="corpo-sm mt-4">
                Os motores são determinísticos: mesma entrada e mesmos parâmetros produzem
                sempre o mesmo resultado. Regra parametrizada, com fórmula e critério
                visíveis — nenhum valor vem de estimativa.
              </p>
            </div>
          </Revelar>
        </div>

        <Revelar atraso={140}>
          <div className="mt-8 rounded-xl border border-verde/20 bg-white px-8 py-7">
            <p className="sobrescrita" style={{ color: "#0E9E6E" }}>
              O teste da rastreabilidade
            </p>
            <p className="corpo-sm mt-4">
              Pegue um número do laudo e peça a reconstituição. Um laudo rastreável devolve
              o documento, o trecho de origem, a regra aplicada, a versão do parâmetro
              vigente na data do caso e quem aprovou o dado. Se algum elo faltar, o número é
              uma afirmação — não uma prova.
            </p>
            <div className="mt-6">
              <Botao href="/tecnologia" variante="contorno">
                Ver a tecnologia
                <Seta />
              </Botao>
            </div>
          </div>
        </Revelar>
      </div>
    </section>
  );
}

/* ====================================================== 7 · Quem conduz === */

function QuemConduz() {
  return (
    <section className="faixa-escura faixa relative overflow-hidden">
      <div
        aria-hidden="true"
        className="halo"
        style={{ width: 460, height: 460, left: "-6%", bottom: "6%" }}
      />
      <div className="coluna-larga relative">
        <Revelar>
          <Abertura
            claro
            sobrescrita="Quem conduz"
            titulo="Duas competências que o tema exige juntas"
            resposta="A tecnologia foi desenvolvida por quem já conduzia esses casos — advogados tributaristas e contadores. É experiência de campo destilada em parâmetro, cálculo e prova."
          />
        </Revelar>

        <div className="mt-14 grid gap-6 lg:grid-cols-2 lg:gap-7">
          {SOCIOS.map((s, i) => (
            <Revelar key={s.nome} atraso={i * 100} as="article">
              <div
                className="flex h-full flex-col rounded-xl border p-8 md:p-9"
                style={{ borderColor: "#24332D", background: "rgba(255,255,255,0.018)" }}
              >
                <div className="flex items-center gap-4">
                  <Retrato socio={s} tamanho={64} />
                  <div className="min-w-0">
                    <p className="sobrescrita" style={{ color: "#3FD9A0" }}>
                      {s.area}
                    </p>
                    <h3 className="fonte-display mt-1.5 text-[1.2rem] leading-tight text-white sm:text-[1.35rem]">
                      {s.nome}
                    </h3>
                  </div>
                </div>

                <p
                  className="fonte-display mt-7 border-l-2 pl-4 text-[1.05rem] leading-relaxed"
                  style={{ borderColor: "#0E9E6E", color: "#DFE9E5" }}
                >
                  {s.lead}
                </p>

                <p className="corpo-sm mt-5 flex-1">{s.bio}</p>

                <ul className="mt-7 space-y-2.5 border-t pt-6" style={{ borderColor: "#24332D" }}>
                  {s.credenciais.slice(0, 5).map((c) => (
                    <li key={c} className="flex items-start gap-2.5">
                      <Marcador className="mt-0.5 text-esmeralda-clara" />
                      <span className="text-[0.84rem] leading-relaxed" style={{ color: "#A9BBB4" }}>
                        {c}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </Revelar>
          ))}
        </div>

        <Revelar atraso={160}>
          <div className="mt-10 text-center">
            <Botao href="/quem-somos" variante="contorno-claro">
              Ver a trajetória completa
              <Seta />
            </Botao>
          </div>
        </Revelar>

        <NotaLegal centro>
          O diagnóstico e o trabalho contábil são contratados com a Consultoria. Eventual
          atuação em juízo é contratada separadamente, com o escritório jurídico.
        </NotaLegal>
      </div>
    </section>
  );
}

/* ========================================================= 8 · Números ==== */

function Numeros() {
  return (
    <section className="faixa-clara faixa-sm">
      <div className="coluna-larga">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {INDICADORES.map((i, n) => (
            <Revelar key={i.rotulo} atraso={n * 70}>
              <Indicador valor={i.valor} unidade={i.unidade} rotulo={i.rotulo} />
            </Revelar>
          ))}
        </div>
      </div>
    </section>
  );
}

/* =================================================== 9 · Frentes ========== */

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
    <section className="faixa-osso2 faixa-sm">
      <div className="coluna-larga">
        <Revelar>
          <Abertura
            sobrescrita="O que dá para fazer"
            titulo="As frentes de trabalho"
            resposta="O resultado raramente vem de uma alavanca só. O diagnóstico indica quais se aplicam ao caso concreto."
          />
        </Revelar>

        <Revelar atraso={90}>
          <ul className="mx-auto mt-12 grid max-w-4xl gap-px overflow-hidden rounded-xl border border-borda bg-borda sm:grid-cols-2 lg:grid-cols-3">
            {FRENTES.map((f) => (
              <li
                key={f}
                className="flex items-center gap-3 bg-white px-5 py-4 text-[0.9rem] text-tinta"
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
    </section>
  );
}

/* ============================================================== Home ===== */

export default function Home() {
  usarSeo(seoDaRota(rota));

  return (
    <>
      <Hero />
      <ANota />
      <NaPratica />
      <Esferas />
      <Tecnologia />
      <QuemConduz />
      <Numeros />
      <Frentes />
      <Precatorios />
      <Faq
        itens={rota.faq!}
        titulo="O que perguntam antes de começar"
        resposta="Respostas objetivas, com a base normativa indicada. Se a sua pergunta não estiver aqui, fale com a equipe."
      />
      <CTA />
    </>
  );
}
