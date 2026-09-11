import { rotaPorPath } from "@shared/seo";
import { usarSeo, seoDaRota } from "@/lib/seo";
import Jornada from "@/components/site/Jornada";
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

const rota = rotaPorPath("/como-funciona")!;
const migalhas = [
  { nome: "Início", path: "/" },
  { nome: "Como funciona", path: "/como-funciona" },
];

const ESTEIRA = [
  {
    n: "1",
    titulo: "Anamnese",
    texto:
      "Passivo em aberto, transacionado e parcelado, garantias, histórico de recolhimento e os insights que o caso já sugere.",
  },
  {
    n: "2",
    titulo: "Documentos",
    texto:
      "Extratos de CAPAG, Regularize, e-CAC e PGE-SP, mais as escriturações ECD, ECF e EFD do período relevante.",
  },
  {
    n: "3",
    titulo: "Extração",
    texto:
      "Leitura assistida com citação literal do trecho de origem, conferência humana e aprovação de cada dado.",
  },
  {
    n: "4",
    titulo: "Análise",
    texto:
      "Motores estadual e federal aplicam a regra parametrizada, com cenários e análise de sensibilidade.",
  },
  {
    n: "5",
    titulo: "Resultado",
    texto:
      "Classificação apurada, cenários aplicáveis e economia potencial — ou o registro fundamentado da ausência dela.",
  },
];

const DOCUMENTOS = [
  {
    grupo: "Federal — PGFN",
    itens: [
      "Extrato de CAPAG fornecido pela PGFN",
      "Situação fiscal do Regularize e do e-CAC",
      "Relação das inscrições em dívida ativa da União",
    ],
  },
  {
    grupo: "Estadual — PGE-SP",
    itens: [
      "Extratos das inscrições na dívida ativa estadual",
      "Comprovação de garantias vinculadas",
      "Histórico de parcelamentos do débito",
    ],
  },
  {
    grupo: "Contábil e fiscal",
    itens: [
      "ECD — Escrituração Contábil Digital",
      "ECF — Escrituração Contábil Fiscal",
      "EFD — Escrituração Fiscal Digital",
    ],
  },
];

const DEPURACAO = [
  {
    titulo: "Duplicidade",
    texto: "Inscrições que representam o mesmo débito, cobradas mais de uma vez.",
  },
  {
    titulo: "Indício de prescrição",
    texto:
      "Inscrições cuja idade sugere exame, com o parâmetro normativo aplicado ao caso.",
  },
  {
    titulo: "Memória do critério",
    texto: "O que foi comparado, os valores encontrados e a regra usada em cada achado.",
  },
  {
    titulo: "Resumo por natureza",
    texto: "Composição do passivo por tipo de tributo e situação da inscrição.",
  },
];

export default function ComoFunciona() {
  usarSeo(seoDaRota(rota, migalhas));

  return (
    <>
      <HeroPagina
        sobrescrita="Gestão contínua do passivo"
        titulo={
          <>
            Da gestão da dívida à{" "}
            <em style={{ fontStyle: "italic", color: "#0E9E6E" }}>liquidação do passivo</em>
          </>
        }
        resumo={rota.resumo}
        migalhas={migalhas}
        acoes={
          <>
            <Botao href="/diagnostico" variante="esmeralda" tamanho="lg">
              Começar o diagnóstico
              <Seta />
            </Botao>
            <Botao href="/tecnologia" variante="contorno-claro" tamanho="lg">
              Como o cálculo é feito
            </Botao>
          </>
        }
      />

      <section className="faixa faixa-clara">
        <div className="coluna-larga">
          <Abertura alinhamento="esquerda" sobrescrita="A jornada Transacione" titulo="Quatro ciclos, uma estratégia para a empresa"
            resposta="O diagnóstico define por onde começar. Quem já tem um acordo também pode avaliar repactuação, amortização e liquidação com precatório, quando cabíveis." />
          <div className="mt-10"><Jornada detalhada /></div>
          <Botao className="mt-8" href="/precatorios" variante="contorno">Conhecer a operação com precatórios <Seta /></Botao>
        </div>
      </section>

      {/* Esteira do diagnóstico */}
      <section className="faixa faixa-clara">
        <div className="coluna-larga">
          <Revelar>
            <Abertura
              alinhamento="esquerda"
              sobrescrita="Diagnóstico em 48 horas"
              titulo="O primeiro ciclo começa pela apuração"
              resposta="Cada etapa produz um artefato conferível. Se não houver espaço para revisão, o diagnóstico registra essa conclusão e apresenta os respectivos fundamentos."
            />
          </Revelar>

          <ol className="mt-14 grid gap-px overflow-hidden rounded-lg border border-borda bg-borda md:grid-cols-5">
            {ESTEIRA.map((e, i) => (
              <Revelar key={e.n} atraso={i * 60} as="li" className="bg-white p-6">
                <div className="flex items-center gap-2.5">
                  <span
                    className="flex h-7 w-7 items-center justify-center rounded-sm text-[0.78rem] font-semibold"
                    style={{ background: "#0A5C42", color: "#fff" }}
                  >
                    {e.n}
                  </span>
                  <h3 className="fonte-display text-[1.05rem] text-verde">{e.titulo}</h3>
                </div>
                <p className="corpo-sm mt-3.5 text-[0.85rem]">{e.texto}</p>
              </Revelar>
            ))}
          </ol>
        </div>
      </section>

      {/* Documentos */}
      <section className="faixa-sm faixa-clara" style={{ background: "#EFF1EC" }}>
        <div className="coluna-larga">
          <Revelar>
            <Abertura
              alinhamento="esquerda"
              sobrescrita="O que reunir"
              titulo="Os documentos do diagnóstico"
              resposta="O envio é feito por link gerado pela plataforma, com o arquivo cifrado na origem — sem trafegar pelo servidor da aplicação."
            />
          </Revelar>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {DOCUMENTOS.map((d, i) => (
              <Revelar key={d.grupo} atraso={i * 80}>
                <div className="h-full rounded-lg border border-borda bg-white p-7">
                  <p className="sobrescrita" style={{ color: "#0E9E6E" }}>
                    {d.grupo}
                  </p>
                  <ul className="mt-5 space-y-3">
                    {d.itens.map((it) => (
                      <li key={it} className="flex items-start gap-2.5">
                        <Marcador className="mt-1 text-esmeralda" />
                        <span className="text-[0.86rem] leading-relaxed text-tinta">
                          {it}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Revelar>
            ))}
          </div>

          <NotaLegal>
            A relação varia conforme a esfera, o porte e a situação das inscrições. A
            lista definitiva é confirmada na anamnese, antes de qualquer envio.
          </NotaLegal>
        </div>
      </section>

      {/* Depuração */}
      <section className="faixa-escura">
        <div className="coluna-larga faixa">
          <Revelar>
            <Abertura
              alinhamento="esquerda"
              claro
              sobrescrita="Depuração da dívida ativa"
              titulo="Antes de calcular desconto: verificar o que de fato deve ser cobrado"
              resposta="Um passo que costuma ser pulado e que muda o denominador de todo o resto."
            />
          </Revelar>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {DEPURACAO.map((d, i) => (
              <Revelar key={d.titulo} atraso={i * 70}>
                <div
                  className="h-full rounded-lg border p-6"
                  style={{ borderColor: "#24332D", background: "rgba(255,255,255,0.015)" }}
                >
                  <h3 className="fonte-display text-[1.08rem] text-white">{d.titulo}</h3>
                  <p className="corpo-sm mt-3 text-[0.85rem]">{d.texto}</p>
                </div>
              </Revelar>
            ))}
          </div>

          <p className="nota mt-8 max-w-3xl">
            Indício de prescrição é critério objetivo para direcionar a análise jurídica.
            O sistema nunca afirma, e nunca deve afirmar, prescrição consumada. A
            depuração é exportável em planilha e anexável ao processo.
          </p>
        </div>
      </section>

      {/* Decisão a cada etapa */}
      <section className="faixa faixa-clara">
        <div className="coluna-larga">
          <Revelar>
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="afirmacao">
                A cada etapa, você decide se avança — sempre com números na mesa
              </h2>
              <p className="corpo mt-5">
                Nada acontece sem a sua aprovação. Depois do diagnóstico vêm o pedido de
                revisão da classificação, a estruturação da transação, o protocolo e o
                acompanhamento até a homologação final.
              </p>
              <div className="mt-9 flex flex-wrap justify-center gap-3">
                <Botao href="/transacao-federal" variante="contorno">
                  Ver a esfera federal
                </Botao>
                <Botao href="/transacao-estadual" variante="contorno">
                  Ver a esfera estadual
                </Botao>
              </div>
            </div>
          </Revelar>
        </div>
      </section>

      <Faq itens={rota.faq!} />
      <CTA />
    </>
  );
}
