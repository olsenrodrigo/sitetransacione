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
} from "@/components/site/primitivas";

const rota = rotaPorPath("/tecnologia")!;
const migalhas = [
  { nome: "Início", path: "/" },
  { nome: "A tecnologia", path: "/tecnologia" },
];

const GARANTIAS = [
  {
    n: "01",
    titulo: "Citação literal",
    texto:
      "Cada dado extraído carrega o trecho de origem do documento, exibido lado a lado para conferência antes de qualquer uso.",
  },
  {
    n: "02",
    titulo: "Gate de aprovação humana",
    texto:
      "Nenhum valor entra no cálculo sem conferência e aprovação de uma pessoa identificada.",
  },
  {
    n: "03",
    titulo: "Parâmetros versionados",
    texto:
      "Cada norma tem vigência datada. A data do caso define a versão do parâmetro aplicada ao cálculo.",
  },
  {
    n: "04",
    titulo: "Trilha somente-anexação",
    texto:
      "O registro de quem fez o quê e quando não admite exclusão nem sobrescrita. Nada é apagado.",
  },
];

const SEGURANCA = [
  {
    titulo: "Cifrado na origem",
    texto:
      "O arquivo vai cifrado direto ao armazenamento, sem trafegar pelo servidor da aplicação.",
  },
  {
    titulo: "Segregação por cliente",
    texto:
      "Cada empresa opera isolada. Não há visibilidade entre clientes em nenhuma camada.",
  },
  {
    titulo: "Acesso por perfil",
    texto:
      "O menu se adapta à função: quem não tem permissão não enxerga a entrada.",
  },
  {
    titulo: "Trilha imutável",
    texto:
      "Registro somente-anexação de quem fez o quê e quando, disponível para auditoria.",
  },
  {
    titulo: "Compartilhamento com prazo",
    texto:
      "Link externo com validade definida, para o cliente acompanhar sem criar conta.",
  },
  {
    titulo: "Sigilo profissional",
    texto:
      "O trabalho está sujeito ao dever de sigilo profissional, com responsáveis identificados.",
  },
];

export default function Tecnologia() {
  usarSeo(seoDaRota(rota, migalhas));

  return (
    <>
      <HeroPagina
        sobrescrita="Confiança no número"
        titulo={
          <>
            A tecnologia acelera e prova. Os profissionais{" "}
            <em style={{ fontStyle: "italic", color: "#0E9E6E" }}>
              decidem e sustentam
            </em>
          </>
        }
        resumo={rota.resumo}
        migalhas={migalhas}
        acoes={
          <>
            <Botao href="/diagnostico" variante="esmeralda" tamanho="lg">
              Fazer o diagnóstico
              <Seta />
            </Botao>
            <Botao
              href="/conteudo/onde-a-ia-entra-no-calculo-tributario"
              variante="contorno-claro"
              tamanho="lg"
            >
              Ler a análise técnica
            </Botao>
          </>
        }
      />

      {/* Onde a IA entra e onde não entra */}
      <section className="faixa faixa-clara">
        <div className="coluna-larga">
          <Revelar>
            <Abertura
              alinhamento="esquerda"
              sobrescrita="A separação que importa"
              titulo="Onde a inteligência artificial entra — e onde não entra"
              resposta="Ler um documento é uma tarefa. Aplicar uma regra normativa é outra. Tratá-las como a mesma coisa é o que produz número indefensável."
            />
          </Revelar>

          <div className="mt-12 grid gap-6 lg:grid-cols-2 lg:gap-8">
            <Revelar>
              <div className="h-full rounded-lg border border-borda bg-white p-7 md:p-9">
                <span
                  className="rounded-sm px-2.5 py-1 text-[0.66rem] font-semibold uppercase tracking-[0.14em]"
                  style={{ background: "rgba(14,158,110,0.1)", color: "#0A5C42" }}
                >
                  IA sim
                </span>
                <h3 className="fonte-display mt-5 text-[1.5rem] text-verde">
                  A leitura assistida
                </h3>
                <p className="corpo-sm mt-4">
                  Encontrar, num extrato de CAPAG, numa ECD ou num espelho de inscrição, o
                  valor que corresponde a um campo é tarefa de extração — e é auditável,
                  porque o valor extraído pode ser exibido junto ao trecho de origem. Nada
                  alimenta o cálculo antes de conferido e aprovado por uma pessoa.
                </p>
              </div>
            </Revelar>

            <Revelar atraso={90}>
              <div
                className="h-full rounded-lg border p-7 md:p-9"
                style={{ borderColor: "rgba(10,92,66,0.3)", background: "#FFFFFF" }}
              >
                <span
                  className="rounded-sm px-2.5 py-1 text-[0.66rem] font-semibold uppercase tracking-[0.14em]"
                  style={{ background: "rgba(180,70,60,0.1)", color: "#B4463C" }}
                >
                  IA não
                </span>
                <h3 className="fonte-display mt-5 text-[1.5rem] text-verde">
                  O cálculo
                </h3>
                <p className="corpo-sm mt-4">
                  Os motores são determinísticos: mesma entrada e mesmos parâmetros
                  produzem sempre o mesmo resultado. Cálculo por regra parametrizada, com
                  fórmula e critério visíveis — nenhum valor vem de estimativa. Se a mesma
                  entrada produzisse resultados diferentes, o número não se defenderia
                  perante a Fazenda.
                </p>
              </div>
            </Revelar>
          </div>
        </div>
      </section>

      {/* As quatro garantias */}
      <section className="faixa-escura">
        <div className="coluna-larga faixa">
          <Revelar>
            <Abertura
              alinhamento="esquerda"
              claro
              sobrescrita="Rastreabilidade"
              titulo="Todo número do laudo pode ser reconstituído até a origem"
              resposta="Pegue um número do resultado final e peça a reconstituição. Se algum elo faltar, o número é uma afirmação — não uma prova."
            />
          </Revelar>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {GARANTIAS.map((g, i) => (
              <Revelar key={g.n} atraso={i * 70}>
                <div
                  className="h-full rounded-lg border p-6"
                  style={{ borderColor: "#24332D", background: "rgba(255,255,255,0.015)" }}
                >
                  <span className="numeral text-[0.8rem] tracking-widest text-esmeralda-clara">
                    {g.n}
                  </span>
                  <h3 className="fonte-display mt-3.5 text-[1.08rem] text-white">
                    {g.titulo}
                  </h3>
                  <p className="corpo-sm mt-3 text-[0.85rem]">{g.texto}</p>
                </div>
              </Revelar>
            ))}
          </div>

          <Revelar atraso={200}>
            <div
              className="mt-8 rounded-lg border p-7 md:p-8"
              style={{
                borderColor: "rgba(14,158,110,0.28)",
                background: "rgba(14,158,110,0.05)",
              }}
            >
              <p className="sobrescrita" style={{ color: "#3FD9A0" }}>
                O teste da rastreabilidade
              </p>
              <p className="corpo-sm mt-4" style={{ color: "#dfe9e5" }}>
                Um laudo rastreável devolve, para qualquer número: o documento, o trecho
                de origem, a regra aplicada, a versão do parâmetro vigente na data do caso
                e a identificação de quem aprovou o dado.
              </p>
            </div>
          </Revelar>
        </div>
      </section>

      {/* Segurança da informação */}
      <section className="faixa faixa-clara">
        <div className="coluna-larga">
          <Revelar>
            <Abertura
              alinhamento="esquerda"
              sobrescrita="Segurança da informação"
              titulo="Os documentos tratados são os mais sensíveis da empresa"
              resposta="A arquitetura parte dessa premissa, do primeiro upload ao encerramento do caso."
            />
          </Revelar>

          <div className="mt-12 grid gap-px overflow-hidden rounded-lg border border-borda bg-borda sm:grid-cols-2 lg:grid-cols-3">
            {SEGURANCA.map((s, i) => (
              <Revelar key={s.titulo} atraso={i * 55} className="bg-white p-7">
                <div className="flex items-start gap-3">
                  <Marcador className="mt-1 text-esmeralda" />
                  <div>
                    <h3 className="fonte-display text-[1.05rem] text-verde">{s.titulo}</h3>
                    <p className="corpo-sm mt-2 text-[0.85rem]">{s.texto}</p>
                  </div>
                </div>
              </Revelar>
            ))}
          </div>

          <p className="nota mt-8 max-w-3xl">
            Especificações técnicas detalhadas são disponibilizadas mediante solicitação
            das áreas de tecnologia ou compliance.
          </p>
        </div>
      </section>

      <Faq itens={rota.faq!} titulo="Tecnologia: perguntas frequentes" />
      <CTA
        titulo="Traga um caso e veja a metodologia aplicada"
        descricao="O diagnóstico entrega a classificação apurada, os cenários aplicáveis e a memória de cálculo de cada número — conferível linha a linha."
      />
    </>
  );
}
