import { useEffect } from "react";
import { SITE, type RotaSeo } from "@shared/seo";

/**
 * Aplica <title>, meta, canonical e JSON-LD no <head> a cada navegação.
 * A pré-renderização já entrega o head correto no HTML servido; este hook
 * mantém tudo coerente durante a navegação client-side.
 */

function meta(attr: "name" | "property", chave: string, valor: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${chave}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, chave);
    document.head.appendChild(el);
  }
  el.setAttribute("content", valor);
}

function link(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

function jsonLd(id: string, dados: unknown) {
  const anterior = document.getElementById(id);
  if (anterior) anterior.remove();
  if (!dados) return;
  const s = document.createElement("script");
  s.type = "application/ld+json";
  s.id = id;
  s.textContent = JSON.stringify(dados);
  document.head.appendChild(s);
}

export interface DadosSeo {
  titulo: string;
  descricao: string;
  path: string;
  tipo?: string;
  imagem?: string;
  noindex?: boolean;
  publicado?: string;
  atualizado?: string;
  faq?: { pergunta: string; resposta: string }[];
  migalhas?: { nome: string; path: string }[];
}

export function usarSeo(d: DadosSeo) {
  useEffect(() => {
    const url = SITE.url + (d.path === "/" ? "" : d.path);
    document.title = d.titulo;
    meta("name", "description", d.descricao);
    meta(
      "name",
      "robots",
      d.noindex ? "noindex,nofollow" : "index,follow,max-image-preview:large,max-snippet:-1",
    );
    link("canonical", url);

    meta("property", "og:title", d.titulo);
    meta("property", "og:description", d.descricao);
    meta("property", "og:url", url);
    meta("property", "og:type", d.tipo === "article" ? "article" : "website");
    meta("property", "og:site_name", SITE.nome);
    meta("property", "og:locale", "pt_BR");
    meta("property", "og:image", SITE.url + (d.imagem ?? SITE.og));
    meta("name", "twitter:card", "summary_large_image");
    meta("name", "twitter:title", d.titulo);
    meta("name", "twitter:description", d.descricao);
    meta("name", "twitter:image", SITE.url + (d.imagem ?? SITE.og));

    jsonLd("ld-faq", d.faq?.length ? faqLd(d.faq) : null);
    jsonLd("ld-breadcrumb", d.migalhas?.length ? migalhasLd(d.migalhas) : null);
  }, [d.path, d.titulo, d.descricao, d.noindex, d.tipo, d.imagem, d.faq, d.migalhas]);
}

export function seoDaRota(
  r: RotaSeo,
  migalhas?: { nome: string; path: string }[],
): DadosSeo {
  return {
    titulo: r.titulo,
    descricao: r.descricao,
    path: r.path,
    noindex: r.noindex,
    faq: r.faq,
    migalhas,
  };
}

/* ------------------------------------------------------------------ JSON-LD */

export const organizacaoLd = () => ({
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": SITE.url + "/#organizacao",
  name: SITE.nome,
  legalName: SITE.nomeLegal,
  url: SITE.url,
  logo: SITE.url + "/marca/logo-horizontal.svg",
  image: SITE.url + SITE.og,
  description: SITE.descricaoCurta,
  telephone: SITE.telefone,
  email: SITE.email,
  areaServed: [
    { "@type": "Country", name: "Brasil" },
    { "@type": "State", name: "São Paulo" },
  ],
  address: {
    "@type": "PostalAddress",
    streetAddress: `${SITE.endereco.rua}, ${SITE.endereco.complemento}`,
    addressLocality: SITE.endereco.cidade,
    addressRegion: SITE.endereco.uf,
    postalCode: SITE.endereco.cep,
    addressCountry: SITE.endereco.pais,
  },
  knowsAbout: [
    "Transação tributária",
    "Capacidade de pagamento (CAPAG)",
    "Grau de recuperabilidade",
    "Dívida ativa da União",
    "Dívida ativa do Estado de São Paulo",
    "Precatórios",
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Serviços",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Transação tributária federal (PGFN)",
          description:
            "Revisão da capacidade de pagamento, escolha de modalidade e estruturação da transação individual.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Transação tributária estadual (PGE-SP)",
          description:
            "Aferição e revisão do grau de recuperabilidade e estruturação da transação.",
        },
      },
    ],
  },
});

export const faqLd = (faq: { pergunta: string; resposta: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faq.map((f) => ({
    "@type": "Question",
    name: f.pergunta,
    acceptedAnswer: { "@type": "Answer", text: f.resposta },
  })),
});

export const migalhasLd = (itens: { nome: string; path: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: itens.map((i, n) => ({
    "@type": "ListItem",
    position: n + 1,
    name: i.nome,
    item: SITE.url + (i.path === "/" ? "" : i.path),
  })),
});

export const artigoLd = (a: {
  titulo: string;
  descricao: string;
  slug: string;
  publicado: string;
  atualizado: string;
  autor: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "Article",
  headline: a.titulo,
  description: a.descricao,
  datePublished: a.publicado,
  dateModified: a.atualizado,
  inLanguage: "pt-BR",
  mainEntityOfPage: `${SITE.url}/conteudo/${a.slug}`,
  author: { "@type": "Organization", name: a.autor, url: SITE.url },
  publisher: {
    "@type": "Organization",
    name: SITE.nome,
    logo: { "@type": "ImageObject", url: SITE.url + "/marca/logo-horizontal.svg" },
  },
});
