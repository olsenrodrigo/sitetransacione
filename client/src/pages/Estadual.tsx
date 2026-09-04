import { rotaPorPath } from "@shared/seo";
import { usarSeo, seoDaRota } from "@/lib/seo";
import HeroPagina from "@/components/site/HeroPagina";
import Faq from "@/components/site/Faq";
import CTA from "@/components/site/CTA";
import {
  Botao,
  CabecalhoSecao,
  Marcador,
  Revelar,
  Seta,
  NotaLegal,
} from "@/components/site/primitivas";

const rota = rotaPorPath("/transacao-estadual")!;
const migalhas = [
  { nome: "Início", path: "/" },
  { nome: "Transação estadual", path: "/transacao-estadual" },
];

const CRITERIOS = [
  { letra: "G", nome: "Grau de garantia", texto: "A existência e a qualidade das garantias vinculadas às inscrições." },
  { letra: "P", nome: "Parcelamentos", texto: "O histórico de parcelamentos do débito e o comportamento neles." },
  { letra: "H", nome: "Histórico de recolhimento", texto: "A regularidade do contribuinte no recolhimento ao longo do tempo." },
  { letra: "I", nome: "Idade das inscrições", texto: "Há quanto tempo o crédito está inscrito em dívida ativa." },
];

const MOTOR = [
  {
    titulo: "Aferição e simulação prévia",
    texto:
      "Calcula o grau atual e simula cenários antes de negociar, com cada critério aberto e justificado.",
  },
  {
    titulo: "Insights de estratégia",
    texto:
      "Cenários de garantia, parcelamento e inadimplemento. Cada simulação gravada vira uma versão comparável.",
  },
  {
    titulo: "Pedido de revisão",
    texto:
      "Gera a fundamentação técnica para requerer a revisão do grau de recuperabilidade, quando cabível.",
  },
];

const NUMEROS = [
  { valor: "até 60%", rotulo: "de desconto sobre o valor total do crédito (regra geral)" },
  { valor: "até 75%", rotulo: "para ME, EPP e empresas em recuperação judicial" },
  { valor: "até 75%", rotulo: "quitação com precatórios e créditos acumulados de ICMS" },
  { valor: "120–145", rotulo: "parcelas (145 para ME/EPP e recuperação judicial)" },
];

const FRENTES = [
  "Revisão do grau",
  "Proposta individual",
  "Escolha da modalidade",
  "Depuração das inscrições",
  "Grupo econômico",
  "Repactuação de transação",
  "Administração do passivo",
  "Amortização com precatório",
  "Acordo Paulista (adesão)",
];

export default function Estadual() {
  usarSeo(seoDaRota(rota, migalhas));

  return (
    <>
      <HeroPagina
        sobrescrita="Estadual · PGE-SP"
        titulo={
          <>
            O grau de recuperabilidade define o desconto — e ele pode estar{" "}
            <em style={{ fontStyle: "italic", color: "#0E9E6E" }}>subestimado</em>
          </>
        }
        resumo={rota.resumo}
        migalhas={migalhas}
        acoes={
          <>
            <Botao href="/diagnostico" tamanho="lg">
              Aferir o meu grau
              <Seta />
            </Botao>
            <Botao href="/transacao-federal" variante="secundario" tamanho="lg">
              Ver a esfera federal
            </Botao>
          </>
        }
        base="Base normativa: Lei estadual nº 17.843/2023 · Resolução PGE nº 6/2024"
      />

      {/* A fórmula */}
      <section className="secao">
        <div className="container-t">
          <Revelar>
            <CabecalhoSecao
              sobrescrita="O que define o desconto"
              titulo="A nota final do crédito"
              descricao="Quatro critérios objetivos compõem a nota. Quanto maior a nota, maior o grau — e menor o desconto. Rever o grau é o que reabre o desconto."
            />
          </Revelar>

          <Revelar atraso={70}>
            <div className="mt-10 flex flex-wrap items-baseline gap-x-4 gap-y-2">
              <span className="numeral text-[2.6rem] text-verde md:text-[3.2rem]">
                NF = G + P + H + I
              </span>
              <span className="nota">
                grau de garantia · parcelamentos · histórico de recolhimento · idade das
                inscrições
              </span>
            </div>
          </Revelar>

          <div className="mt-10 grid gap-px overflow-hidden rounded-lg border border-borda bg-borda sm:grid-cols-2 lg:grid-cols-4">
            {CRITERIOS.map((c, i) => (
              <Revelar key={c.letra} atraso={i * 60} className="bg-white p-6">
                <span className="numeral text-[2rem] text-esmeralda">{c.letra}</span>
                <h3 className="fonte-display mt-2 text-[1.02rem] text-verde">{c.nome}</h3>
                <p className="corpo-sm mt-2.5 text-[0.85rem]">{c.texto}</p>
              </Revelar>
            ))}
          </div>

          <Revelar atraso={200}>
            <div className="mt-8 grid gap-6 md:grid-cols-2">
              <div className="rounded-lg border border-verde/20 bg-white p-7">
                <h3 className="titulo-card">Corte de classificação</h3>
                <p className="corpo-sm mt-3">
                  A recuperabilidade muda de faixa conforme a nota, com reclassificação
                  prevista quando NF ≥ 3. É a faixa resultante que determina o desconto, a
                  entrada e o prazo admitidos.
                </p>
              </div>
              <div className="rounded-lg border border-verde/20 bg-white p-7">
                <h3 className="titulo-card">O insight-chave</h3>
                <p className="corpo-sm mt-3">
                  A tecnologia mostra qual critério puxa a nota para cima e quanto ele
                  precisaria mudar para reabrir o desconto. Aferir e revisar antes de
                  negociar pode alterar uma situação de desconto zero para um desconto
                  expressivo.
                </p>
              </div>
            </div>
          </Revelar>
        </div>
      </section>

      {/* Motor estadual */}
      <section className="secao-sm" style={{ background: "#EFF1EC" }}>
        <div className="container-t">
          <Revelar>
            <CabecalhoSecao
              sobrescrita="Motor estadual · PGE-SP"
              titulo="A tecnologia afere, simula e instrui a revisão do grau"
            />
          </Revelar>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {MOTOR.map((m, i) => (
              <Revelar key={m.titulo} atraso={i * 80}>
                <div className="h-full rounded-lg border border-borda bg-white p-7">
                  <h3 className="titulo-card">{m.titulo}</h3>
                  <p className="corpo-sm mt-3.5">{m.texto}</p>
                </div>
              </Revelar>
            ))}
          </div>
        </div>
      </section>

      {/* Quanto pode chegar */}
      <section className="fundo-escuro">
        <div className="container-t secao">
          <Revelar>
            <CabecalhoSecao
              claro
              sobrescrita="Quanto pode chegar"
              titulo="Descontos e prazos na transação tributária estadual"
            />
          </Revelar>

          <div
            className="mt-12 grid gap-px overflow-hidden rounded-lg sm:grid-cols-2 lg:grid-cols-4"
            style={{ background: "#24332D" }}
          >
            {NUMEROS.map((n, i) => (
              <Revelar key={n.rotulo} atraso={i * 60} className="bg-grafite p-7">
                <p className="numeral text-[2.1rem] text-esmeralda-clara">{n.valor}</p>
                <p className="corpo-sm mt-3 text-[0.85rem]">{n.rotulo}</p>
              </Revelar>
            ))}
          </div>

          <Revelar atraso={140}>
            <div
              className="mt-8 rounded-lg border p-7"
              style={{
                borderColor: "rgba(14,158,110,0.28)",
                background: "rgba(14,158,110,0.05)",
              }}
            >
              <p className="corpo-sm" style={{ color: "#dfe9e5" }}>
                <strong style={{ color: "#fff", fontWeight: 600 }}>Onde incide:</strong>{" "}
                os descontos alcançam multas, juros e honorários — não o principal.
                Aplicam-se aos créditos classificados como de difícil recuperação ou
                irrecuperáveis. Garantia exigida a partir de 60 meses de parcelamento.
              </p>
            </div>
          </Revelar>

          <p className="nota mt-8">
            Lei estadual nº 17.843/2023 · Resolução PGE nº 6/2024 (art. 34 e seguintes).
            Percentuais e prazos conforme a classificação e os limites da lei. Não
            constitui promessa de resultado.
          </p>
        </div>
      </section>

      {/* Adesão x individual */}
      <section className="secao">
        <div className="container-t">
          <Revelar>
            <CabecalhoSecao
              sobrescrita="Duas portas"
              titulo="Acordo Paulista ou proposta individual"
              descricao="A adesão traz condições pré-fixadas e caminho mais curto. A individual constrói as condições sobre a realidade do crédito — e, na esfera estadual, permite selecionar quais inscrições entram."
            />
          </Revelar>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            <Revelar>
              <div className="h-full rounded-lg border border-borda bg-white p-7 md:p-9">
                <h3 className="titulo-card">Acordo Paulista — adesão</h3>
                <p className="corpo-sm mt-3.5">
                  Modalidade de transação por adesão do Estado de São Paulo, com condições
                  pré-fixadas em edital para os débitos elegíveis, no âmbito da Lei nº
                  17.843/2023.
                </p>
              </div>
            </Revelar>
            <Revelar atraso={80}>
              <div className="h-full rounded-lg border border-verde/25 bg-white p-7 md:p-9">
                <h3 className="titulo-card">Proposta individual</h3>
                <p className="corpo-sm mt-3.5">
                  Proposta do devedor ou do credor, construída sobre o grau apurado.{" "}
                  <strong style={{ color: "#0A5C42", fontWeight: 600 }}>
                    Não exige a totalidade das inscrições
                  </strong>{" "}
                  — é possível selecionar quais entram na negociação, o que abre espaço de
                  estratégia inexistente na esfera federal.
                </p>
              </div>
            </Revelar>
          </div>
        </div>
      </section>

      {/* Frentes */}
      <section className="secao-sm" style={{ background: "#EFF1EC" }}>
        <div className="container-t">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
            <Revelar>
              <CabecalhoSecao
                sobrescrita="O que dá para fazer"
                titulo="As frentes de trabalho — estadual"
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
                    <Marcador className="text-esmeralda" />
                    {f}
                  </li>
                ))}
              </ul>
            </Revelar>
          </div>

          <NotaLegal>
            Elegibilidade e condições conforme a norma e o edital aplicáveis a cada caso.
          </NotaLegal>
        </div>
      </section>

      <Faq itens={rota.faq!} titulo="Transação estadual: perguntas frequentes" />
      <CTA
        titulo="Descubra se o grau da sua empresa comporta revisão"
        descricao="Com os extratos da PGE-SP e as escriturações em mãos, o diagnóstico técnico é concluído em 48 horas — e diz também quando não há espaço."
      />
    </>
  );
}
