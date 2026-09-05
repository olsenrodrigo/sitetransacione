import { Link } from "wouter";
import { rotaPorPath } from "@shared/seo";
import { ARTIGOS } from "@shared/artigos";
import { usarSeo, seoDaRota } from "@/lib/seo";
import CTA from "@/components/site/CTA";
import { Migalhas, Revelar, Seta, Sobrescrita } from "@/components/site/primitivas";

const rota = rotaPorPath("/conteudo")!;
const migalhas = [
  { nome: "Início", path: "/" },
  { nome: "Conteúdo", path: "/conteudo" },
];

const dataBr = (iso: string) =>
  new Date(iso + "T12:00:00").toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

export default function Conteudo() {
  usarSeo(seoDaRota(rota, migalhas));

  const [destaque, ...demais] = ARTIGOS;

  return (
    <>
      <section className="relative overflow-hidden pb-12 pt-28 md:pt-36">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{ background: "linear-gradient(170deg, #FFFFFF 0%, #F7F6F2 60%)" }}
        />
        <div className="coluna-larga relative">
          <Revelar>
            <Migalhas itens={migalhas} />
            <Sobrescrita>Central de conteúdo</Sobrescrita>
            <h1
              className="fonte-display mt-5 max-w-3xl"
              style={{
                fontSize: "clamp(1.95rem, 1.25rem + 2.6vw, 3rem)",
                lineHeight: 1.1,
                letterSpacing: "-0.022em",
                fontWeight: 500,
              }}
            >
              Análises técnicas, com a base normativa citada
            </h1>
            <p className="corpo mt-5 max-w-2xl">
              Material sobre transação tributária nas esferas federal e estadual. Cada
              texto abre com a resposta objetiva e indica a norma aplicável.
            </p>
          </Revelar>
        </div>
      </section>

      {/* Destaque */}
      <section className="pb-4">
        <div className="coluna-larga">
          <Revelar>
            <Link
              href={`/conteudo/${destaque.slug}`}
              className="group grid gap-8 rounded-lg border border-borda bg-white p-7 transition-[border-color,box-shadow] duration-300 hover:border-esmeralda/45 hover:shadow-[0_10px_34px_-20px_rgba(10,92,66,0.32)] md:p-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12"
            >
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <span
                    className="rounded-sm px-2.5 py-1 text-[0.66rem] font-semibold uppercase tracking-[0.14em]"
                    style={{ background: "rgba(14,158,110,0.1)", color: "#0A5C42" }}
                  >
                    {destaque.categoria}
                  </span>
                  <span className="nota">
                    {dataBr(destaque.publicado)} · {destaque.leitura} min de leitura
                  </span>
                </div>
                <h2 className="fonte-display mt-5 text-[1.75rem] leading-tight text-verde md:text-[2.1rem]">
                  {destaque.titulo}
                </h2>
                <p className="corpo mt-4">{destaque.descricao}</p>
                <span className="mt-7 inline-flex items-center gap-2 text-[0.88rem] font-medium text-verde transition-transform duration-300 group-hover:translate-x-0.5">
                  Ler a análise
                  <Seta />
                </span>
              </div>

              <div
                className="rounded-lg border-l-2 p-6"
                style={{ borderColor: "#0E9E6E", background: "#F7F6F2" }}
              >
                <p className="sobrescrita" style={{ color: "#0E9E6E" }}>
                  Resposta direta
                </p>
                <p
                  className="fonte-display mt-4"
                  style={{ fontSize: "1.02rem", lineHeight: 1.6, color: "#33443d" }}
                >
                  {destaque.resposta}
                </p>
              </div>
            </Link>
          </Revelar>
        </div>
      </section>

      {/* Demais artigos */}
      <section className="faixa faixa-clara">
        <div className="coluna-larga">
          <div className="grid gap-6 md:grid-cols-2">
            {demais.map((a, i) => (
              <Revelar key={a.slug} atraso={i * 70} as="article">
                <Link
                  href={`/conteudo/${a.slug}`}
                  className="group flex h-full flex-col rounded-lg border border-borda bg-white p-7 transition-[border-color,transform] duration-300 hover:-translate-y-0.5 hover:border-esmeralda/45"
                >
                  <div className="flex flex-wrap items-center gap-3">
                    <span
                      className="rounded-sm px-2.5 py-1 text-[0.66rem] font-semibold uppercase tracking-[0.14em]"
                      style={{ background: "rgba(14,158,110,0.1)", color: "#0A5C42" }}
                    >
                      {a.categoria}
                    </span>
                    <span className="nota">
                      {dataBr(a.publicado)} · {a.leitura} min
                    </span>
                  </div>
                  <h2 className="fonte-display mt-5 flex-1 text-[1.32rem] leading-snug text-verde">
                    {a.titulo}
                  </h2>
                  <p className="corpo-sm mt-3.5">{a.descricao}</p>
                  <span className="mt-6 inline-flex items-center gap-2 text-[0.84rem] font-medium text-verde transition-transform duration-300 group-hover:translate-x-0.5">
                    Ler
                    <Seta />
                  </span>
                </Link>
              </Revelar>
            ))}
          </div>
        </div>
      </section>

      <CTA />
    </>
  );
}
