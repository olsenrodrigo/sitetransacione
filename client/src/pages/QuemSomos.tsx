import { rotaPorPath } from "@shared/seo";
import { usarSeo, seoDaRota } from "@/lib/seo";
import HeroPagina from "@/components/site/HeroPagina";
import CTA from "@/components/site/CTA";
import { SOCIOS, INDICADORES } from "@/data/site";
import {
  Botao,
  CabecalhoSecao,
  Marcador,
  Revelar,
  Seta,
} from "@/components/site/primitivas";

const rota = rotaPorPath("/quem-somos")!;
const migalhas = [
  { nome: "Início", path: "/" },
  { nome: "Quem somos", path: "/quem-somos" },
];

function Socio({ socio, indice }: { socio: (typeof SOCIOS)[number]; indice: number }) {
  return (
    <Revelar atraso={indice * 100}>
      <article className="grid h-full gap-8 rounded-lg border border-borda bg-white p-7 md:p-9 lg:grid-cols-[auto_1fr] lg:gap-10">
        {/* Retrato tipográfico — monograma na tipografia da marca */}
        <div className="flex lg:block">
          <div
            className="flex h-24 w-24 shrink-0 items-center justify-center rounded-lg lg:h-28 lg:w-28"
            style={{
              background:
                "linear-gradient(155deg, rgba(10,92,66,0.94) 0%, rgba(14,158,110,0.82) 100%)",
            }}
            aria-hidden="true"
          >
            <span
              className="fonte-display text-white"
              style={{ fontSize: "2.1rem", fontWeight: 500, letterSpacing: "-0.02em" }}
            >
              {socio.iniciais}
            </span>
          </div>
        </div>

        <div>
          <p className="sobrescrita" style={{ color: "#0E9E6E" }}>
            {socio.area}
          </p>
          <h3 className="fonte-display mt-3 text-[1.55rem] leading-tight text-verde">
            {socio.nome}
          </h3>
          <p className="mt-1.5 text-[0.84rem] text-cinza">{socio.cargo}</p>

          <p
            className="fonte-display mt-6 border-l-2 pl-4 text-[1.08rem] leading-relaxed"
            style={{ borderColor: "#0E9E6E", color: "#33443d" }}
          >
            {socio.lead}
          </p>

          <p className="corpo-sm mt-5">{socio.bio}</p>

          <ul className="mt-7 grid gap-2.5 border-t border-borda pt-6 sm:grid-cols-2">
            {socio.credenciais.map((c) => (
              <li key={c} className="flex items-start gap-2.5">
                <Marcador className="mt-0.5 text-esmeralda" />
                <span className="text-[0.82rem] leading-relaxed text-tinta">{c}</span>
              </li>
            ))}
          </ul>
        </div>
      </article>
    </Revelar>
  );
}

export default function QuemSomos() {
  usarSeo(seoDaRota(rota, migalhas));

  return (
    <>
      <HeroPagina
        sobrescrita="Quem conduz"
        titulo={
          <>
            Duas competências que o tema{" "}
            <em style={{ fontStyle: "italic", color: "#0E9E6E" }}>exige juntas</em>
          </>
        }
        resumo={rota.resumo}
        migalhas={migalhas}
        acoes={
          <Botao href="/diagnostico" tamanho="lg">
            Falar com a equipe técnica
            <Seta />
          </Botao>
        }
      />

      {/* Indicadores */}
      <section className="secao-sm">
        <div className="container-t">
          <div className="grid gap-px overflow-hidden rounded-lg border border-borda bg-borda sm:grid-cols-2 lg:grid-cols-4">
            {INDICADORES.map((i, n) => (
              <Revelar key={i.rotulo} atraso={n * 60} className="bg-white p-7">
                <p className="numeral text-[2.4rem] text-verde">
                  {i.valor}
                  <span className="text-[1rem] text-esmeralda"> {i.unidade}</span>
                </p>
                <p className="corpo-sm mt-2.5 text-[0.85rem]">{i.rotulo}</p>
              </Revelar>
            ))}
          </div>
        </div>
      </section>

      {/* Sócios */}
      <section className="secao-sm">
        <div className="container-t">
          <div className="grid gap-6 lg:gap-8">
            {SOCIOS.map((s, i) => (
              <Socio key={s.nome} socio={s} indice={i} />
            ))}
          </div>

          <Revelar atraso={140}>
            <p className="nota mt-8 max-w-3xl">
              O diagnóstico e o trabalho contábil são contratados com a Consultoria.
              Eventual atuação em juízo é contratada separadamente, com o escritório
              jurídico.
            </p>
          </Revelar>
        </div>
      </section>

      {/* A origem da tecnologia */}
      <section className="fundo-escuro">
        <div className="container-t secao">
          <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-16">
            <Revelar>
              <CabecalhoSecao
                claro
                sobrescrita="Histórico de mercado"
                titulo="A tecnologia foi desenvolvida por quem já conduzia esses casos"
                descricao="Advogados tributaristas e contadores. É a experiência jurídica e contábil de campo, destilada em parâmetros, cálculo e prova."
              />
            </Revelar>

            <Revelar atraso={90}>
              <div className="space-y-6">
                {[
                  {
                    t: "22 anos em direito tributário",
                    d: "Contencioso, planejamento e consultoria para grupos industriais e empresariais, nas duas esferas.",
                  },
                  {
                    t: "Mais de 100 projetos no campo",
                    d: "Projetos de transação e recuperabilidade conduzidos até a homologação.",
                  },
                  {
                    t: "Duas esferas, dois motores",
                    d: "PGFN e PGE-SP, com norma, critério e motor de cálculo próprios em cada uma.",
                  },
                ].map((b) => (
                  <div
                    key={b.t}
                    className="border-b pb-6 last:border-0 last:pb-0"
                    style={{ borderColor: "#24332D" }}
                  >
                    <h3 className="fonte-display text-[1.15rem] text-white">{b.t}</h3>
                    <p className="corpo-sm mt-2">{b.d}</p>
                  </div>
                ))}
              </div>
            </Revelar>
          </div>
        </div>
      </section>

      <CTA
        sobrescrita="Fale com quem conduz"
        titulo="Traga um caso concreto"
        descricao="A anamnese é conduzida pela equipe técnica. Em 48 horas depois dos documentos, o diagnóstico responde se há espaço — e de quanto."
      />
    </>
  );
}
