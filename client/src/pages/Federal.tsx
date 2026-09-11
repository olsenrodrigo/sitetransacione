import { rotaPorPath } from "@shared/seo";
import { usarSeo, seoDaRota } from "@/lib/seo";
import HeroPagina from "@/components/site/HeroPagina";
import Faq from "@/components/site/Faq";
import CTA from "@/components/site/CTA";
import {
  Botao,
  Abertura,
  Marcador,
  Revelar,
  Seta,
  NotaLegal,
} from "@/components/site/primitivas";

const rota = rotaPorPath("/transacao-federal")!;
const migalhas = [
  { nome: "Início", path: "/" },
  { nome: "Transação federal", path: "/transacao-federal" },
];

const MOTOR = [
  {
    sigla: "CAPAG-P",
    nome: "Presumida",
    texto:
      "Reconstituída a partir do extrato de CAPAG fornecido pela PGFN, isolando as variáveis que sustentam a classificação atual.",
  },
  {
    sigla: "CAPAG-E",
    nome: "Efetiva",
    texto:
      "Apurada das demonstrações contábeis por metodologias oficiais — Geração de Resultados Futuros (GRF) e Patrimônio Líquido Realizável (PLR).",
  },
  {
    sigla: "GRAU",
    nome: "Cobertura",
    texto:
      "Resulta da cobertura da dívida pela capacidade apurada. É o grau que define as condições disponíveis para a transação.",
  },
];

const PORTAS = [
  {
    nome: "Adesão por edital",
    texto: "Condições pré-fixadas em edital (PGDAU), publicadas com frequência, para os débitos elegíveis.",
  },
  {
    nome: "Transação individual",
    texto: "Proposta sob medida, construída sobre a capacidade efetiva apurada do caso concreto.",
  },
  {
    nome: "Pequeno valor",
    texto: "Modalidade específica para débitos de menor valor, na forma do edital aplicável.",
  },
  {
    nome: "Relevante controvérsia",
    texto: "Para teses de relevante e disseminada controvérsia, nos termos do edital.",
  },
];

const NUMEROS = [
  { valor: "até 65%", rotulo: "de desconto sobre o valor total dos créditos (regra geral)" },
  { valor: "até 75%", rotulo: "PF, ME/EPP, Santas Casas, instituições de ensino e recuperação judicial" },
  { valor: "120–145", rotulo: "parcelas (145 nas hipóteses específicas)" },
  { valor: "60", rotulo: "parcelas — contribuições previdenciárias" },
];

const FRENTES = [
  "Revisão de CAPAG",
  "Proposta individual",
  "Escolha da modalidade",
  "Depuração das inscrições",
  "Grupo econômico",
  "Repactuação de transação",
  "Administração do passivo",
  "Amortização com precatório",
  "Contencioso de pequeno valor",
];

export default function Federal() {
  usarSeo(seoDaRota(rota, migalhas));

  return (
    <>
      <HeroPagina
        sobrescrita="Federal · PGFN"
        titulo={
          <>
            A CAPAG define o seu desconto — e ela pode estar{" "}
            <em style={{ fontStyle: "italic", color: "#0E9E6E" }}>errada</em>
          </>
        }
        resumo={rota.resumo}
        migalhas={migalhas}
        acoes={
          <>
            <Botao href="/diagnostico" variante="esmeralda" tamanho="lg">
              Avaliar a minha CAPAG
              <Seta />
            </Botao>
            <Botao href="/transacao-estadual" variante="contorno-claro" tamanho="lg">
              Ver a esfera estadual
            </Botao>
          </>
        }
        base="Base normativa: Lei nº 13.988/2020 · Portaria PGFN nº 6.757/2022"
      />

      {/* Motor federal */}
      <section className="faixa faixa-clara">
        <div className="coluna-larga">
          <Revelar>
            <Abertura
              alinhamento="esquerda"
              sobrescrita="Motor federal · CAPAG"
              titulo="Avaliar a revisão de CAPAG-P para CAPAG-E"
              resposta="Três grandezas conversam. A presumida sai do sistema; a efetiva sai das demonstrações; o grau resulta da relação entre a capacidade apurada e a dívida."
            />
          </Revelar>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {MOTOR.map((m, i) => (
              <Revelar key={m.sigla} atraso={i * 80}>
                <div className="h-full rounded-lg border border-borda bg-white p-7">
                  <div className="flex items-baseline gap-2.5">
                    <span className="numeral text-[1.05rem] font-semibold tracking-tight text-verde">
                      {m.sigla}
                    </span>
                    <span
                      className="rounded-sm px-2 py-0.5 text-[0.66rem] font-semibold uppercase tracking-wider"
                      style={{ background: "rgba(14,158,110,0.1)", color: "#0A5C42" }}
                    >
                      {m.nome}
                    </span>
                  </div>
                  <p className="corpo-sm mt-4">{m.texto}</p>
                </div>
              </Revelar>
            ))}
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <Revelar>
              <div className="h-full rounded-lg border border-verde/20 bg-white p-7 md:p-8">
                <h3 className="titulo-card">Insights para buscar a revisão</h3>
                <p className="corpo-sm mt-3.5">
                  O bloco de sensibilidade mostra qual variável sustenta a classificação
                  atual e quanto ela precisaria variar para mudar de faixa. É essa leitura
                  que orienta a fundamentação jurídica e econômico-financeira do pedido.
                </p>
              </div>
            </Revelar>
            <Revelar atraso={80}>
              <div className="h-full rounded-lg border border-verde/20 bg-white p-7 md:p-8">
                <h3 className="titulo-card">Proposta e estratégia</h3>
                <p className="corpo-sm mt-3.5">
                  Simulação e construção da transação individual, com apoio na escolha da
                  melhor estratégia entre as transações disponíveis — adesão por edital
                  contra proposta individual.
                </p>
              </div>
            </Revelar>
          </div>
        </div>
      </section>

      {/* Sistema multiportas */}
      <section className="faixa-sm faixa-clara" style={{ background: "#EFF1EC" }}>
        <div className="coluna-larga">
          <Revelar>
            <Abertura
              alinhamento="esquerda"
              sobrescrita="Sistema multiportas · PGFN"
              titulo="Várias transações disponíveis — a porta certa muda o resultado"
              resposta="Avaliamos todas as modalidades a que a empresa tem acesso e indicamos a de melhor resultado, não a primeira que aparece."
            />
          </Revelar>

          <div className="mt-12 grid gap-px overflow-hidden rounded-lg border border-borda bg-borda sm:grid-cols-2">
            {PORTAS.map((p, i) => (
              <Revelar key={p.nome} atraso={i * 60} className="bg-white p-7">
                <h3 className="titulo-card">{p.nome}</h3>
                <p className="corpo-sm mt-3">{p.texto}</p>
              </Revelar>
            ))}
          </div>

          <Revelar atraso={160}>
            <div className="mt-8 rounded-lg border border-verde/20 bg-white px-7 py-6">
              <p className="corpo-sm">
                <strong style={{ color: "#0A5C42", fontWeight: 600 }}>
                  Uma diferença que pega quem compara as esferas:
                </strong>{" "}
                na proposta individual federal, a norma exige a inclusão da totalidade das
                inscrições elegíveis. Na estadual, não — é possível selecionar quais
                entram. Para grupos com passivo nas duas, a estratégia de uma restringe a
                da outra.
              </p>
            </div>
          </Revelar>
        </div>
      </section>

      {/* Quanto pode chegar */}
      <section className="faixa-escura">
        <div className="coluna-larga faixa">
          <Revelar>
            <Abertura
              alinhamento="esquerda"
              claro
              sobrescrita="Quanto pode chegar"
              titulo="Descontos e prazos na esfera federal"
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
              style={{ borderColor: "rgba(14,158,110,0.28)", background: "rgba(14,158,110,0.05)" }}
            >
              <p className="corpo-sm" style={{ color: "#dfe9e5" }}>
                <strong style={{ color: "#fff", fontWeight: 600 }}>Onde incide:</strong>{" "}
                os descontos alcançam juros, multas e encargos legais — não o principal.
                Além deles, o montante devido pode ser reduzido pela amortização com
                prejuízo fiscal e base negativa de CSLL, admitida em até 70% do saldo, e
                pelo uso de precatórios.
              </p>
            </div>
          </Revelar>

          <p className="nota mt-8">
            Lei nº 13.988/2020 · Portaria PGFN nº 6.757/2022 (arts. 43 e 44). Percentuais
            e prazos conforme a classificação apurada e os limites da lei. Não constitui
            promessa de resultado.
          </p>
        </div>
      </section>

      {/* Precatórios */}
      <section className="faixa faixa-clara">
        <div className="coluna-larga">
          <div className="grid items-center gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
            <Revelar>
              <Abertura
              alinhamento="esquerda"
                sobrescrita="Uma alavanca a mais"
                titulo="Precatório federal: amortizar ou liquidar o saldo negociado"
                resposta="Precatório próprio ou adquirido de terceiro, aplicado ao saldo já reduzido da transação. A ordem importa: primeiro incidem os descontos, depois o precatório amortiza o remanescente."
              />
              <div className="mt-8">
                <Botao href="/precatorios#federal" variante="contorno">
                  Conhecer o fluxo federal
                  <Seta />
                </Botao>
              </div>
            </Revelar>

            <Revelar atraso={90}>
              <div className="cartao p-7 md:p-9">
                <p className="sobrescrita" style={{ color: "#0E9E6E" }}>
                  A esteira da vertical
                </p>
                <ol className="mt-6 space-y-4">
                  {[
                    "Viabilidade",
                    "Due diligence",
                    "Aquisição ou cessão",
                    "Homologação",
                    "Encontro de contas",
                    "Liquidação",
                  ].map((e, i) => (
                    <li key={e} className="flex items-center gap-4">
                      <span className="numeral w-6 text-[0.85rem] text-esmeralda">
                        {i + 1}
                      </span>
                      <span className="text-[0.9rem] text-tinta">{e}</span>
                    </li>
                  ))}
                </ol>
                <p className="nota mt-7 border-t border-borda pt-5">
                  A extensão depende do crédito elegível e do saldo admitido pela PGFN.
                  O teto de 75% da transação paulista não é uma regra geral federal.
                </p>
              </div>
            </Revelar>
          </div>
        </div>
      </section>

      {/* Frentes */}
      <section className="faixa-sm faixa-clara" style={{ background: "#EFF1EC" }}>
        <div className="coluna-larga">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
            <Revelar>
              <Abertura
              alinhamento="esquerda"
                sobrescrita="O que dá para fazer"
                titulo="As frentes de trabalho — federal"
                resposta="O resultado raramente vem de uma alavanca só. O diagnóstico indica quais se aplicam ao caso concreto."
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

      <Faq itens={rota.faq!} titulo="Transação federal: perguntas frequentes" />
      <CTA
        titulo="Descubra se cabe revisão de CAPAG na sua empresa"
        descricao="Com o extrato de CAPAG e as escriturações em mãos, o diagnóstico técnico é concluído em 48 horas — e diz também quando não há espaço."
      />
    </>
  );
}
