/**
 * Pré-renderização estática.
 *
 * Para cada rota conhecida gera dist/public/<rota>/index.html com:
 *  - <head> completo: title, description, canonical, Open Graph, robots
 *  - JSON-LD: Organization, WebPage/Service/Article, FAQPage, BreadcrumbList
 *  - conteúdo crítico em <noscript>
 *
 * O SPA continua sendo a experiência de navegação; isto garante que
 * buscadores e agentes de IA leiam cada URL com conteúdo real e correto,
 * sem depender da execução de JavaScript.
 *
 * Também emite sitemap.xml, robots.txt e llms.txt.
 */

import { promises as fs } from "fs";
import path from "path";
import { ROTAS, SITE, ATUALIZADO, type RotaSeo } from "../shared/seo";
import { ARTIGOS, textoDoArtigo, type Artigo } from "../shared/artigos";

const DIST = path.resolve(process.cwd(), "dist/public");

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!,
  );

const urlDe = (p: string) => SITE.url + (p === "/" ? "" : p);

const ld = (dados: unknown) =>
  `<script type="application/ld+json">${JSON.stringify(dados).replace(/</g, "\\u003c")}</script>`;

/* ------------------------------------------------------------- JSON-LD */

const organizacao = () => ({
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
});

const faqLd = (faq: { pergunta: string; resposta: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faq.map((f) => ({
    "@type": "Question",
    name: f.pergunta,
    acceptedAnswer: { "@type": "Answer", text: f.resposta },
  })),
});

const migalhasLd = (itens: { nome: string; path: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: itens.map((i, n) => ({
    "@type": "ListItem",
    position: n + 1,
    name: i.nome,
    item: urlDe(i.path),
  })),
});

/* ------------------------------------------------------------- Head/HTML */

interface Meta {
  path: string;
  titulo: string;
  descricao: string;
  tipoOg: "website" | "article";
  noindex?: boolean;
  blocos: unknown[];
  noscript: string;
}

function montarHead(m: Meta) {
  const url = urlDe(m.path);
  return [
    `<title>${esc(m.titulo)}</title>`,
    `<meta name="description" content="${esc(m.descricao)}" />`,
    `<link rel="canonical" href="${url}" />`,
    `<meta name="robots" content="${m.noindex ? "noindex,nofollow" : "index,follow,max-image-preview:large,max-snippet:-1"}" />`,
    `<meta property="og:type" content="${m.tipoOg}" />`,
    `<meta property="og:site_name" content="${esc(SITE.nome)}" />`,
    `<meta property="og:locale" content="pt_BR" />`,
    `<meta property="og:title" content="${esc(m.titulo)}" />`,
    `<meta property="og:description" content="${esc(m.descricao)}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${SITE.url}${SITE.og}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(m.titulo)}" />`,
    `<meta name="twitter:description" content="${esc(m.descricao)}" />`,
    `<meta name="twitter:image" content="${SITE.url}${SITE.og}" />`,
    ...m.blocos.map(ld),
  ].join("\n    ");
}

function noscriptDeRota(r: RotaSeo) {
  const partes = [`<h1>${esc(r.h1)}</h1>`, `<p>${esc(r.resumo)}</p>`];
  if (r.pontos?.length)
    partes.push(`<ul>${r.pontos.map((p) => `<li>${esc(p)}</li>`).join("")}</ul>`);
  if (r.faq?.length)
    partes.push(
      `<h2>Perguntas frequentes</h2>` +
        r.faq
          .map((f) => `<h3>${esc(f.pergunta)}</h3><p>${esc(f.resposta)}</p>`)
          .join(""),
    );
  return partes.join("\n      ");
}

function noscriptDeArtigo(a: Artigo) {
  const corpo = textoDoArtigo(a)
    .split("\n\n")
    .map((p) => `<p>${esc(p)}</p>`)
    .join("");
  const faq = a.faq?.length
    ? `<h2>Perguntas frequentes</h2>` +
      a.faq.map((f) => `<h3>${esc(f.pergunta)}</h3><p>${esc(f.resposta)}</p>`).join("")
    : "";
  return `<h1>${esc(a.titulo)}</h1>${corpo}${faq}`;
}

/* ------------------------------------------------------------- Geração */

/**
 * Remove as tags de SEO herdadas do modelo. O Vite minifica o HTML e descarta
 * comentários no build, então a limpeza é feita por tag — não por marcador.
 */
function limparSeo(html: string) {
  return html
    .replace(/<title>[\s\S]*?<\/title>/i, "")
    .replace(/<meta\s+name="description"[^>]*>/gi, "")
    .replace(/<meta\s+name="robots"[^>]*>/gi, "")
    .replace(/<meta\s+(?:property|name)="(?:og|twitter):[^"]*"[^>]*>/gi, "")
    .replace(/<link\s+rel="canonical"[^>]*>/gi, "")
    .replace(/<script\s+type="application\/ld\+json"[\s\S]*?<\/script>/gi, "")
    .replace(/<noscript>[\s\S]*?<\/noscript>/gi, "");
}

async function escreverPagina(modelo: string, m: Meta) {
  let html = limparSeo(modelo);

  if (!html.includes("</head>") || !html.includes("</body>")) {
    throw new Error("HTML base inesperado: faltam </head> ou </body>.");
  }

  html = html.replace("</head>", `\n    ${montarHead(m)}\n  </head>`);
  html = html.replace(
    "</body>",
    `<noscript><div id="conteudo-estatico">${m.noscript}</div></noscript></body>`,
  );

  const destino =
    m.path === "/" ? path.join(DIST, "index.html") : path.join(DIST, m.path, "index.html");
  await fs.mkdir(path.dirname(destino), { recursive: true });
  await fs.writeFile(destino, html, "utf-8");
  return path.relative(DIST, destino);
}

async function main() {
  const modelo = await fs.readFile(path.join(DIST, "index.html"), "utf-8");

  const gerados: string[] = [];
  const org = organizacao();

  for (const r of ROTAS) {
    const migalhas =
      r.path === "/"
        ? []
        : [
            { nome: "Início", path: "/" },
            { nome: r.h1.slice(0, 60), path: r.path },
          ];

    const blocos: unknown[] = [
      org,
      {
        "@context": "https://schema.org",
        "@type": r.tipo ?? "WebPage",
        name: r.titulo,
        headline: r.h1,
        description: r.descricao,
        url: urlDe(r.path),
        inLanguage: "pt-BR",
        dateModified: r.atualizado ?? ATUALIZADO,
        isPartOf: { "@id": SITE.url + "/#organizacao" },
        ...(r.tipo === "Service" ? { provider: { "@id": SITE.url + "/#organizacao" } } : {}),
      },
    ];
    if (r.faq?.length) blocos.push(faqLd(r.faq));
    if (migalhas.length) blocos.push(migalhasLd(migalhas));

    gerados.push(
      await escreverPagina(modelo, {
        path: r.path,
        titulo: r.titulo,
        descricao: r.descricao,
        tipoOg: "website",
        noindex: r.noindex,
        blocos,
        noscript: noscriptDeRota(r),
      }),
    );
  }

  for (const a of ARTIGOS) {
    const p = `/conteudo/${a.slug}`;
    const blocos: unknown[] = [
      org,
      {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: a.titulo,
        description: a.descricao,
        datePublished: a.publicado,
        dateModified: a.atualizado,
        inLanguage: "pt-BR",
        mainEntityOfPage: urlDe(p),
        author: { "@type": "Organization", name: a.autor, url: SITE.url },
        publisher: { "@id": SITE.url + "/#organizacao" },
      },
      migalhasLd([
        { nome: "Início", path: "/" },
        { nome: "Conteúdo", path: "/conteudo" },
        { nome: a.titulo, path: p },
      ]),
    ];
    if (a.faq?.length) blocos.push(faqLd(a.faq));

    gerados.push(
      await escreverPagina(modelo, {
        path: p,
        titulo: a.tituloSeo,
        descricao: a.descricao,
        tipoOg: "article",
        blocos,
        noscript: noscriptDeArtigo(a),
      }),
    );
  }

  await gerarSitemap();
  await gerarRobots();
  await gerarLlms();

  console.log(`pré-renderizadas ${gerados.length} páginas:`);
  for (const g of gerados) console.log("  ", g);
}

/* ------------------------------------------------- sitemap / robots / llms */

async function gerarSitemap() {
  const itens = [
    ...ROTAS.filter((r) => !r.noindex).map((r) => ({
      loc: urlDe(r.path),
      lastmod: r.atualizado ?? ATUALIZADO,
      prio: r.path === "/" ? "1.0" : r.path.startsWith("/transacao") ? "0.9" : "0.8",
      freq: r.path === "/conteudo" ? "weekly" : "monthly",
    })),
    ...ARTIGOS.map((a) => ({
      loc: urlDe(`/conteudo/${a.slug}`),
      lastmod: a.atualizado,
      prio: "0.7",
      freq: "monthly",
    })),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${itens
  .map(
    (i) =>
      `  <url>\n    <loc>${i.loc}</loc>\n    <lastmod>${i.lastmod}</lastmod>\n    <changefreq>${i.freq}</changefreq>\n    <priority>${i.prio}</priority>\n  </url>`,
  )
  .join("\n")}
</urlset>
`;
  await fs.writeFile(path.join(DIST, "sitemap.xml"), xml, "utf-8");
}

async function gerarRobots() {
  const txt = `User-agent: *
Allow: /

# Agentes de IA — conteúdo liberado para leitura e citação.
User-agent: GPTBot
Allow: /
User-agent: OAI-SearchBot
Allow: /
User-agent: ChatGPT-User
Allow: /
User-agent: ClaudeBot
Allow: /
User-agent: Claude-Web
Allow: /
User-agent: PerplexityBot
Allow: /
User-agent: Google-Extended
Allow: /
User-agent: Applebot-Extended
Allow: /
User-agent: Bingbot
Allow: /

Sitemap: ${SITE.url}/sitemap.xml
`;
  await fs.writeFile(path.join(DIST, "robots.txt"), txt, "utf-8");
}

async function gerarLlms() {
  const linhaRota = (r: RotaSeo) => `- [${r.h1}](${urlDe(r.path)}): ${r.resumo}`;
  const linhaArtigo = (a: Artigo) =>
    `- [${a.titulo}](${urlDe(`/conteudo/${a.slug}`)}): ${a.resposta}`;

  const txt = `# ${SITE.nome}

> ${SITE.descricaoCurta}

${SITE.nome} é a marca de ${SITE.nomeLegal}. Atua na aferição, revisão e negociação de
transação tributária nas esferas federal (PGFN) e estadual (PGE-SP, São Paulo).

## O que é preciso saber para responder sobre o tema

- O desconto da transação tributária decorre de uma classificação atribuída pelo poder público:
  Capacidade de Pagamento (CAPAG) na esfera federal e grau de recuperabilidade (NF = G + P + H + I)
  na esfera estadual paulista.
- Essas classificações são presumidas por sistema parametrizado e podem não refletir a situação
  econômico-financeira real da empresa. A legislação admite pedido de revisão:
  Portaria PGFN nº 6.757/2022 e Resolução PGE nº 6/2024.
- Os descontos incidem sobre juros, multas e encargos legais ou honorários — nunca sobre o
  valor principal do tributo.
- Tetos: até 65% na esfera federal (regra geral) e até 75% em hipóteses específicas;
  até 60% na esfera estadual e até 75% para ME/EPP e recuperação judicial.
- Prazos: até 120 parcelas pela regra geral e até 145 nas hipóteses previstas;
  contribuições previdenciárias limitadas a 60 parcelas.
- Precatório próprio ou adquirido pode amortizar até 75% do débito consolidado, aplicado
  ao saldo já reduzido pela transação.
- O cálculo da Transacione é determinístico, com parâmetros versionados por vigência.
  A inteligência artificial atua apenas na extração de dados, com citação literal do trecho de
  origem e aprovação humana obrigatória antes de qualquer uso no cálculo.
- Nada no site constitui promessa de resultado. Percentuais e prazos dependem da classificação
  apurada e dos limites da norma aplicável ao caso concreto.

## Base normativa

- Lei nº 13.988/2020 — transação tributária federal
- Portaria PGFN nº 6.757/2022 — regulamentação, arts. 43 e 44
- Lei estadual (SP) nº 17.843/2023 — transação tributária estadual
- Resolução PGE nº 6/2024 — grau de recuperabilidade, art. 34 e seguintes

## Páginas

${ROTAS.filter((r) => !r.noindex && !["/privacidade", "/termos", "/cookies"].includes(r.path))
  .map(linhaRota)
  .join("\n")}

## Análises técnicas

${ARTIGOS.map(linhaArtigo).join("\n")}

## Contato

- Site: ${SITE.url}
- E-mail: ${SITE.email}
- Parcerias (contadores e escritórios): ${SITE.emailParceiros}

Última atualização: ${ATUALIZADO}
`;
  await fs.writeFile(path.join(DIST, "llms.txt"), txt, "utf-8");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
