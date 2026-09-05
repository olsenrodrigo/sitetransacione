import { rotaPorPath } from "@shared/seo";
import { usarSeo, seoDaRota } from "@/lib/seo";
import { usarLead } from "@/components/site/LeadModal";
import HeroPagina from "@/components/site/HeroPagina";
import CTA from "@/components/site/CTA";
import {
  Abertura,
  Botao,
  Marcador,
  NotaLegal,
  Revelar,
  Seta,
} from "@/components/site/primitivas";

const rota = rotaPorPath("/diagnostico")!;
const migalhas = [
  { nome: "Início", path: "/" },
  { nome: "Diagnóstico", path: "/diagnostico" },
];

const PERGUNTAS = [
  {
    n: "01",
    titulo: "Onde está o passivo",
    texto:
      "Federal, estadual ou nas duas esferas. A esfera define qual norma e qual motor de cálculo se aplicam ao caso.",
  },
  {
    n: "02",
    titulo: "A faixa do passivo",
    texto:
      "Valor consolidado, somando principal, juros, multa e encargos. Faixa aproximada basta — nenhum valor exato é pedido.",
  },
  {
    n: "03",
    titulo: "O regime tributário",
    texto:
      "A apuração da capacidade efetiva depende das demonstrações contábeis, e o regime determina quais existem.",
  },
  {
    n: "04",
    titulo: "A situação da dívida",
    texto:
      "A transação alcança o crédito já inscrito em dívida ativa. Débito ainda não inscrito segue outro caminho.",
  },
];

const ETAPAS = [
  {
    titulo: "Anamnese",
    texto: "Levantamento do passivo, das garantias e do histórico, com a equipe técnica.",
  },
  {
    titulo: "Documentos",
    texto:
      "Envio por link gerado pela plataforma, com o arquivo cifrado na origem — sem trafegar pelo servidor da aplicação.",
  },
  {
    titulo: "Diagnóstico em 48 horas",
    texto:
      "Classificação apurada, cenários aplicáveis e economia potencial — ou os fundamentos da ausência dela.",
  },
];

export default function Diagnostico() {
  usarSeo(seoDaRota(rota, migalhas));
  const { abrir } = usarLead();

  return (
    <>
      <HeroPagina
        sobrescrita="Diagnóstico de elegibilidade"
        titulo={
          <>
            Quatro perguntas antes de qualquer{" "}
            <em style={{ fontStyle: "italic", color: "#3FD9A0" }}>análise técnica</em>
          </>
        }
        resumo={rota.resumo}
        migalhas={migalhas}
        acoes={
          <>
            <Botao variante="esmeralda" tamanho="lg" onClick={() => abrir("diagnostico")}>
              Começar agora
              <Seta />
            </Botao>
            <Botao href="/como-funciona" variante="contorno-claro" tamanho="lg">
              Ver o método
            </Botao>
          </>
        }
      />

      {/* O que é perguntado */}
      <section className="faixa faixa-clara">
        <div className="coluna">
          <Revelar>
            <Abertura
              sobrescrita="Menos de um minuto"
              titulo="Este passo existe para não fazer você perder tempo"
              resposta="Nenhum documento é pedido aqui. Quatro perguntas verificam se o caso comporta diagnóstico — e, quando não comporta, o resultado diz por quê e indica o caminho."
            />
          </Revelar>

          <div className="mt-16 space-y-11">
            {PERGUNTAS.map((p, i) => (
              <Revelar key={p.n} atraso={i * 70}>
                <div className="flex gap-6 md:gap-8">
                  <span
                    className="numeral shrink-0 pt-1 text-[1.1rem]"
                    style={{ color: "#0E9E6E" }}
                  >
                    {p.n}
                  </span>
                  <div className="border-t border-borda pt-1">
                    <h3 className="subafirmacao text-verde">{p.titulo}</h3>
                    <p className="corpo mt-3">{p.texto}</p>
                  </div>
                </div>
              </Revelar>
            ))}
          </div>

          <Revelar atraso={140}>
            <div className="mt-14 text-center">
              <Botao tamanho="lg" onClick={() => abrir("diagnostico")}>
                Responder as quatro perguntas
                <Seta />
              </Botao>
            </div>
          </Revelar>

          <NotaLegal centro>
            As respostas são usadas para direcionar o atendimento. Nada é enviado antes de
            você preencher e confirmar o formulário de contato.
          </NotaLegal>
        </div>
      </section>

      {/* O que acontece depois */}
      <section className="faixa faixa-escura">
        <div className="coluna-larga">
          <Revelar>
            <Abertura
              claro
              sobrescrita="Depois da qualificação"
              titulo="Onde o cálculo técnico realmente acontece"
              resposta="A qualificação termina no formulário. A aferição da classificação, os cenários e a análise de sensibilidade acontecem na plataforma autenticada, depois da anamnese."
            />
          </Revelar>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {ETAPAS.map((e, i) => (
              <Revelar key={e.titulo} atraso={i * 80}>
                <div
                  className="h-full rounded-xl border p-7"
                  style={{ borderColor: "#24332D", background: "rgba(255,255,255,0.018)" }}
                >
                  <div className="flex items-center gap-2.5">
                    <Marcador className="text-esmeralda-clara" />
                    <h3 className="fonte-display text-[1.1rem] text-white">{e.titulo}</h3>
                  </div>
                  <p className="corpo-sm mt-3.5">{e.texto}</p>
                </div>
              </Revelar>
            ))}
          </div>
        </div>
      </section>

      <CTA
        sobrescrita="Sem compromisso"
        titulo="Descubra em um minuto se cabe para a sua empresa"
        descricao="Se o perfil não comportar diagnóstico, dizemos com franqueza e não pedimos os seus dados."
        rotulo="Fazer o diagnóstico"
      />
    </>
  );
}
