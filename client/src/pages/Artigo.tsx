import { useEffect } from "react";
import { Link, useRoute } from "wouter";
import { artigoPorSlug, ARTIGOS, type Bloco } from "@shared/artigos";
import { SITE } from "@shared/seo";
import { usarSeo, artigoLd } from "@/lib/seo";
import CTA from "@/components/site/CTA";
import Faq from "@/components/site/Faq";
import NaoEncontrado from "./NaoEncontrado";
import { Migalhas, Revelar, Seta, Sobrescrita } from "@/components/site/primitivas";

const dataBr = (iso: string) =>
  new Date(iso + "T12:00:00").toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

function RenderBloco({ b }: { b: Bloco }) {
  switch (b.t) {
    case "h2":
      return <h2>{b.c}</h2>;
    case "h3":
      return <h3>{b.c}</h3>;
    case "p":
      return <p>{b.c}</p>;
    case "ul":
      return (
        <ul>
          {b.itens.map((i) => (
            <li key={i}>{i}</li>
          ))}
        </ul>
      );
    case "ol":
      return (
        <ol>
          {b.itens.map((i) => (
            <li key={i}>{i}</li>
          ))}
        </ol>
      );
    case "quote":
      return <blockquote>{b.c}</blockquote>;
    case "nota":
      return (
        <p
          className="rounded-md px-5 py-4 text-[0.84rem] leading-relaxed"
          style={{ background: "#EFF1EC", color: "#5A6B64" }}
        >
          {b.c}
        </p>
      );
    case "tabela":
      return (
        <div className="rolagem-x">
          <table>
            <thead>
              <tr>
                {b.cabecalho.map((c) => (
                  <th key={c}>{c}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {b.linhas.map((l, i) => (
                <tr key={i}>
                  {l.map((c, j) => (
                    <td key={j}>{c}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
  }
}

export default function Artigo() {
  const [, params] = useRoute("/conteudo/:slug");
  const artigo = params?.slug ? artigoPorSlug(params.slug) : undefined;

  const migalhas = artigo
    ? [
        { nome: "Início", path: "/" },
        { nome: "Conteúdo", path: "/conteudo" },
        { nome: artigo.titulo, path: `/conteudo/${artigo.slug}` },
      ]
    : [];

  usarSeo({
    titulo: artigo?.tituloSeo ?? "Conteúdo | Transacione",
    descricao: artigo?.descricao ?? "",
    path: artigo ? `/conteudo/${artigo.slug}` : "/conteudo",
    tipo: "article",
    noindex: !artigo,
    faq: artigo?.faq,
    migalhas,
  });

  useEffect(() => {
    if (!artigo) return;
    const id = "ld-artigo";
    document.getElementById(id)?.remove();
    const s = document.createElement("script");
    s.type = "application/ld+json";
    s.id = id;
    s.textContent = JSON.stringify(
      artigoLd({
        titulo: artigo.titulo,
        descricao: artigo.descricao,
        slug: artigo.slug,
        publicado: artigo.publicado,
        atualizado: artigo.atualizado,
        autor: artigo.autor,
      }),
    );
    document.head.appendChild(s);
    return () => document.getElementById(id)?.remove();
  }, [artigo]);

  if (!artigo) return <NaoEncontrado />;

  const relacionados = ARTIGOS.filter((a) => a.slug !== artigo.slug).slice(0, 2);

  return (
    <>
      <article>
        <header className="relative overflow-hidden pb-10 pt-28 md:pt-36">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{ background: "linear-gradient(170deg, #FFFFFF 0%, #F7F6F2 65%)" }}
          />
          <div className="coluna-prosa relative">
            <Migalhas
              itens={[
                { nome: "Início", path: "/" },
                { nome: "Conteúdo", path: "/conteudo" },
                { nome: artigo.categoria, path: "/conteudo" },
              ]}
            />
            <Sobrescrita>{artigo.categoria}</Sobrescrita>
            <h1
              className="fonte-display mt-5"
              style={{
                fontSize: "clamp(1.85rem, 1.2rem + 2.4vw, 2.75rem)",
                lineHeight: 1.13,
                letterSpacing: "-0.02em",
                fontWeight: 500,
              }}
            >
              {artigo.titulo}
            </h1>

            <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-1 text-[0.78rem] text-cinza">
              <span>{artigo.autor}</span>
              <span aria-hidden="true">·</span>
              <time dateTime={artigo.publicado}>{dataBr(artigo.publicado)}</time>
              <span aria-hidden="true">·</span>
              <span>{artigo.leitura} min de leitura</span>
            </div>

            <div
              className="mt-9 rounded-lg border-l-2 p-6"
              style={{ borderColor: "#0E9E6E", background: "#FFFFFF" }}
            >
              <p className="sobrescrita" style={{ color: "#0E9E6E" }}>
                Resposta direta
              </p>
              <p
                className="fonte-display mt-3.5"
                style={{ fontSize: "1.08rem", lineHeight: 1.62, color: "#33443d" }}
              >
                {artigo.resposta}
              </p>
            </div>
          </div>
        </header>

        <div className="coluna-prosa pb-16">
          <div className="prosa">
            {artigo.corpo.map((b, i) => (
              <RenderBloco key={i} b={b} />
            ))}
          </div>

          <p className="nota mt-12 border-t border-borda pt-6">
            Atualizado em {dataBr(artigo.atualizado)}. Conteúdo informativo, publicado por{" "}
            {SITE.nome}. Não constitui consulta jurídica nem promessa de resultado.
          </p>
        </div>
      </article>

      {artigo.faq?.length ? (
        <div style={{ background: "#EFF1EC" }}>
          <Faq itens={artigo.faq} sobrescrita="Sobre este tema" />
        </div>
      ) : null}

      {/* Relacionados */}
      <section className="faixa-sm faixa-clara">
        <div className="coluna-larga">
          <h2 className="afirmacao">Continue lendo</h2>
          <div className="mt-9 grid gap-6 md:grid-cols-2">
            {relacionados.map((a, i) => (
              <Revelar key={a.slug} atraso={i * 70}>
                <Link
                  href={`/conteudo/${a.slug}`}
                  className="group flex h-full flex-col rounded-lg border border-borda bg-white p-7 transition-[border-color] duration-300 hover:border-esmeralda/45"
                >
                  <span
                    className="w-fit rounded-sm px-2.5 py-1 text-[0.66rem] font-semibold uppercase tracking-[0.14em]"
                    style={{ background: "rgba(14,158,110,0.1)", color: "#0A5C42" }}
                  >
                    {a.categoria}
                  </span>
                  <h3 className="fonte-display mt-4 flex-1 text-[1.2rem] leading-snug text-verde">
                    {a.titulo}
                  </h3>
                  <span className="mt-5 inline-flex items-center gap-2 text-[0.84rem] font-medium text-verde transition-transform duration-300 group-hover:translate-x-0.5">
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
