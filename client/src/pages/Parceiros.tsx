import { rotaPorPath } from "@shared/seo";
import { usarSeo, seoDaRota } from "@/lib/seo";
import HeroPagina from "@/components/site/HeroPagina";
import Faq from "@/components/site/Faq";
import CTA from "@/components/site/CTA";
import { usarLead } from "@/components/site/LeadModal";
import {
  Botao,
  Abertura,
  Marcador,
  Revelar,
  Seta,
  NotaLegal,
} from "@/components/site/primitivas";

const rota = rotaPorPath("/parceiros")!;
const migalhas = [
  { nome: "Início", path: "/" },
  { nome: "Parceiros", path: "/parceiros" },
];

const RADAR = [
  {
    gatilho: "Débito antigo, de difícil recuperação ou irrecuperável",
    leitura: "Quanto pior a classificação, maior o desconto possível.",
  },
  {
    gatilho: "ME, EPP ou empresa em recuperação judicial",
    leitura: "Até 75% de desconto e parcelamento em até 145 meses.",
  },
  {
    gatilho: "Cliente que já transacionou",
    leitura: "Foi na melhor modalidade? Cabe repactuação e revisão.",
  },
  {
    gatilho: "Tem, ou pode adquirir, precatório",
    leitura: "Oferta que quita até 75% da dívida já reduzida.",
  },
  {
    gatilho: "Débito já ajuizado em execução fiscal",
    leitura: "A transação encerra o litígio e destrava o caixa.",
  },
  {
    gatilho: "Grupo econômico nas duas esferas",
    leitura: "Tratamento conjunto federal e estadual amplia o ganho.",
  },
];

const PAPEL = [
  {
    n: "1",
    titulo: "Identifica",
    texto:
      "Passa a carteira pelo radar e reconhece os clientes com passivo na PGE-SP ou na PGFN.",
  },
  {
    n: "2",
    titulo: "Apresenta",
    texto:
      "Leva a oportunidade ao cliente com o material fornecido — o discurso e os números prontos.",
  },
  {
    n: "3",
    titulo: "Encaminha",
    texto:
      "Nós fazemos o diagnóstico, a revisão e a execução. O parceiro acompanha e mantém a relação.",
  },
];

const CONFIANCA = [
  { titulo: "Diagnóstico em 48h", texto: "Prazo concreto para prometer ao cliente." },
  { titulo: "Cálculo determinístico", texto: "Mesma entrada, sempre o mesmo resultado." },
  { titulo: "Extração com citação", texto: "Cada dado com o trecho de origem, aprovado por profissionais." },
  { titulo: "Rastreabilidade", texto: "Todo número reconstituível até quem aprovou." },
];

const OBJECOES = [
  {
    p: "“Isso é promessa de desconto?”",
    r: "Não. É diagnóstico técnico de viabilidade — pode concluir que não há caso e dizer por quê. Economia potencial não é valor negociado nem promessa de resultado.",
  },
  {
    p: "“A IA vai inventar número?”",
    r: "Não. A IA só extrai, com citação literal do documento. O cálculo é regra parametrizada e determinística, e nada entra sem aprovação humana.",
  },
  {
    p: "“Já fiz minha transação.”",
    r: "Ainda há potencial: repactuação das condições vigentes, revisão do que já foi feito e uso de precatório para quitar as parcelas.",
  },
];

export default function Parceiros() {
  usarSeo(seoDaRota(rota, migalhas));
  const { abrir } = usarLead();

  return (
    <>
      <HeroPagina
        sobrescrita="Canal de parceria"
        titulo={
          <>
            A oportunidade já está na{" "}
            <em style={{ fontStyle: "italic", color: "#0E9E6E" }}>sua carteira</em>
          </>
        }
        resumo={rota.resumo}
        migalhas={migalhas}
        acoes={
          <>
            <Botao variante="esmeralda" tamanho="lg" onClick={() => abrir("parceiro")}>
              Quero ser parceiro
              <Seta />
            </Botao>
            <Botao href="/como-funciona" variante="contorno-claro" tamanho="lg">
              Ver o método
            </Botao>
          </>
        }
      />

      {/* Radar */}
      <section className="faixa faixa-clara">
        <div className="coluna-larga">
          <Revelar>
            <Abertura
              alinhamento="esquerda"
              sobrescrita="Insights para o parceiro"
              titulo="Radar de oportunidades: o que procurar em cada cliente"
              resposta="Seis sinais que indicam passivo com espaço de revisão. Nenhum deles exige análise técnica para ser identificado."
            />
          </Revelar>

          <div className="mt-12 overflow-hidden rounded-lg border border-borda">
            {RADAR.map((r, i) => (
              <Revelar
                key={r.gatilho}
                atraso={i * 50}
                className="flex flex-col gap-2 border-b border-borda bg-white px-6 py-5 last:border-0 sm:flex-row sm:items-center sm:gap-6 sm:px-7"
              >
                <p className="flex-1 text-[0.92rem] font-medium text-verde">{r.gatilho}</p>
                <span aria-hidden="true" className="hidden text-esmeralda sm:block">
                  →
                </span>
                <p className="corpo-sm flex-1 text-[0.86rem]">{r.leitura}</p>
              </Revelar>
            ))}
          </div>
        </div>
      </section>

      {/* Papel do parceiro */}
      <section className="faixa-escura">
        <div className="coluna-larga faixa">
          <Revelar>
            <Abertura
              alinhamento="esquerda"
              claro
              sobrescrita="O seu papel"
              titulo="Como o parceiro entra"
              resposta="O parceiro amplia os serviços à sua base sem montar estrutura técnica nem assumir o risco de execução."
            />
          </Revelar>

          <div className="mt-12 grid gap-8 md:grid-cols-3 md:gap-10">
            {PAPEL.map((p, i) => (
              <Revelar key={p.n} atraso={i * 80}>
                <div
                  className="border-t-2 pt-6"
                  style={{ borderColor: "#0E9E6E" }}
                >
                  <div className="flex items-baseline gap-3">
                    <span className="numeral text-[2.4rem] text-esmeralda-clara">{p.n}</span>
                    <h3 className="fonte-display text-[1.2rem] text-white">{p.titulo}</h3>
                  </div>
                  <p className="corpo-sm mt-4">{p.texto}</p>
                </div>
              </Revelar>
            ))}
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {CONFIANCA.map((c, i) => (
              <Revelar key={c.titulo} atraso={i * 60}>
                <div
                  className="h-full rounded-lg border p-6"
                  style={{ borderColor: "#24332D", background: "rgba(255,255,255,0.015)" }}
                >
                  <h3 className="fonte-display text-[1.02rem] text-white">{c.titulo}</h3>
                  <p className="corpo-sm mt-2.5 text-[0.84rem]">{c.texto}</p>
                </div>
              </Revelar>
            ))}
          </div>

          <p className="nota mt-8">
            O parceiro promete um diagnóstico sério em 48 horas. A tecnologia entrega — e
            a análise técnica sustenta.
          </p>
        </div>
      </section>

      {/* Objeções */}
      <section className="faixa-sm faixa-clara">
        <div className="coluna-larga">
          <Revelar>
            <Abertura
              alinhamento="esquerda"
              sobrescrita="Para o parceiro responder"
              titulo="Três objeções — e as respostas"
            />
          </Revelar>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {OBJECOES.map((o, i) => (
              <Revelar key={o.p} atraso={i * 70}>
                <div className="h-full rounded-lg border border-borda bg-white p-7">
                  <p className="fonte-display text-[1.1rem] leading-snug text-verde">
                    {o.p}
                  </p>
                  <p className="corpo-sm mt-4">{o.r}</p>
                </div>
              </Revelar>
            ))}
          </div>
        </div>
      </section>

      {/* Candidatura */}
      <section id="candidatura" className="faixa faixa-clara" style={{ background: "#EFF1EC" }}>
        <div className="coluna-larga">
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
            <Revelar>
              <Abertura
              alinhamento="esquerda"
                sobrescrita="Canal do parceiro"
                titulo="Traga um caso"
                resposta="Em 48 horas dizemos se há oportunidade. Este canal é exclusivo para contadores, escritórios de advocacia e consultorias — clientes finais devem usar o diagnóstico."
              />
              <ul className="mt-8 space-y-3">
                {[
                  "Material comercial pronto para apresentar ao cliente",
                  "Diagnóstico técnico conduzido pela nossa equipe",
                  "O parceiro acompanha e mantém a relação com o cliente",
                  "Sem estrutura técnica própria e sem risco de execução",
                ].map((i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <Marcador className="mt-1 text-esmeralda" />
                    <span className="text-[0.88rem] leading-relaxed text-tinta">{i}</span>
                  </li>
                ))}
              </ul>
              <NotaLegal>
                É cliente final e quer avaliar o próprio passivo?{" "}
                <a href="/diagnostico" className="text-verde underline underline-offset-2">
                  Use o diagnóstico de elegibilidade
                </a>
                .
              </NotaLegal>
            </Revelar>

            <Revelar atraso={90}>
              <div className="cartao p-8 md:p-10">
                <p className="sobrescrita" style={{ color: "#0E9E6E" }}>
                  Traga um caso
                </p>
                <p className="subafirmacao mt-4 text-verde">
                  Em 48 horas dizemos se há oportunidade
                </p>
                <p className="corpo-sm mt-4">
                  Quatro perguntas sobre o passivo do cliente e os seus dados de contato.
                  Leva menos de um minuto e não exige nenhum documento.
                </p>
                <div className="mt-7">
                  <Botao tamanho="lg" onClick={() => abrir("parceiro")}>
                    Enviar um caso
                    <Seta />
                  </Botao>
                </div>
                <p className="nota mt-5">
                  Resposta da equipe de parcerias em até um dia útil.
                </p>
              </div>
            </Revelar>
          </div>
        </div>
      </section>

      <Faq itens={rota.faq!} titulo="Parceria: perguntas frequentes" />
      <CTA
        sobrescrita="Canal do parceiro"
        titulo="Passe a sua carteira pelo radar"
        descricao="O parceiro identifica, apresenta e encaminha. A Transacione faz o diagnóstico, a revisão e a execução — sem que o parceiro monte estrutura técnica ou assuma risco."
        rotulo="Enviar um caso"
        origem="parceiro"
      />
    </>
  );
}
