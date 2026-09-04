# Transacione — site institucional

Site de alta performance da **Transacione**, marca da CORREA Consultoria Empresarial
Estratégica, para transação tributária federal (PGFN) e estadual (PGE-SP).

Inclui a identidade visual completa da marca, o manual de aplicação, o site com SEO
técnico e otimização para IAs generativas (GEO), e o mini-diagnóstico de elegibilidade.

---

## Stack

| Camada | Tecnologia |
|---|---|
| Interface | React 19 + Vite 7 + Tailwind CSS 4 + wouter |
| Servidor | Express 5 + TypeScript (tsx em dev, esbuild em produção) |
| Dados | Drizzle ORM + PostgreSQL, com fallback local em arquivo |
| E-mail | Nodemailer (SMTP) |
| Tipografia | Newsreader + Inter, variáveis, self-hosted e subsetadas |

Base de código derivada do `whitelabel_v2`, reconstruída para múltiplas rotas,
pré-renderização estática e a identidade da Transacione.

---

## Como rodar

```bash
npm install
npm run dev          # desenvolvimento com HMR em http://localhost:5000
```

Para validar o build de produção — que é o único que contém o HTML pré-renderizado,
o sitemap e o `llms.txt`:

```bash
npm run build
npm start            # http://localhost:5000
# ou, em um comando:
npm run preview
```

Nenhuma variável de ambiente é obrigatória. Sem `DATABASE_URL`, os leads são gravados em
`.dados/leads.jsonl`; sem SMTP, a notificação por e-mail é apenas registrada no log. Veja
`.env.example`.

### Scripts

| Comando | O que faz |
|---|---|
| `npm run dev` | Servidor de desenvolvimento com HMR |
| `npm run build` | Cliente + pré-renderização + bundle do servidor |
| `npm start` | Serve o build de produção |
| `npm run preview` | `build` seguido de `start` |
| `npm run check` | Verificação de tipos |
| `npm run db:push` | Aplica o schema no Postgres (exige `DATABASE_URL`) |

---

## Arquitetura

```
client/
  index.html                  Modelo base: head, CSS crítico, preload das fontes
  public/                     Fontes, marca, favicon, OG image, manifest
  src/
    App.tsx                   Rotas (home no bundle inicial, demais sob demanda)
    index.css                 Tokens da marca, tipografia e utilitários
    components/marca/         Símbolo e lockup, em geometria vetorial
    components/site/          Navbar, footer, layout, FAQ, formulário, primitivas
    data/                     Dados institucionais, sócios, textos legais
    lib/seo.ts                <head> e JSON-LD por rota, na navegação SPA
    pages/                    Uma página por rota
server/
  index.ts                    Bootstrap do Express
  routes.ts                   POST /api/leads (validação, honeypot, rate limit)
  storage.ts                  Postgres, ou arquivo local quando não há banco
  email.ts                    Notificação de novo contato
  static.ts                   Serve o build, um HTML por rota, cache por tipo
shared/
  seo.ts                      Metadados e FAQ de cada rota — fonte única
  artigos.ts                  Central de conteúdo, em blocos estruturados
  schema.ts                   Schema e validação do lead
script/
  build.ts                    Orquestra o build
  prerender.ts                HTML por rota + sitemap.xml + robots.txt + llms.txt
tools/
  build-marca.py              Gera os arquivos oficiais da marca
marca/                        Manual de aplicação e SVGs distribuíveis
```

### Pré-renderização

O site é uma SPA, mas o build gera **um HTML estático por rota** em
`dist/public/<rota>/index.html`, cada um com:

- `<title>`, `description`, `canonical`, Open Graph e Twitter próprios
- JSON-LD: `ProfessionalService`, `WebPage`/`Service`/`Article`, `FAQPage`, `BreadcrumbList`
- o conteúdo crítico da página em `<noscript>`

Isso garante que buscadores e agentes de IA leiam cada URL com conteúdo real, sem depender
da execução de JavaScript, mantendo a navegação client-side para quem usa o site.

`shared/seo.ts` e `shared/artigos.ts` são a fonte única: alimentam a pré-renderização, o
`<head>` durante a navegação, o `sitemap.xml` e o `llms.txt`. Adicionar uma rota ou um
artigo lá propaga para todo o resto.

### GEO — otimização para IAs generativas

- `llms.txt` gerado no build, com a síntese normativa do domínio e o índice das páginas
- Bloco de **resposta direta** no topo de cada página e de cada artigo — objetivo,
  autocontido e citável
- `FAQPage` estruturado em todas as páginas relevantes
- `robots.txt` liberando explicitamente GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot,
  Google-Extended e Applebot-Extended
- Base normativa citada em cada afirmação técnica

---

## Marca

A identidade está em `marca/`, com o manual de aplicação em
[`marca/MANUAL-DA-MARCA.md`](marca/MANUAL-DA-MARCA.md).

A geometria do símbolo vive em dois lugares que precisam permanecer iguais:

- `tools/build-marca.py` — gera os SVGs distribuíveis
- `client/src/components/marca/Logo.tsx` — renderiza a marca no site, sem requisição de rede

Para regerar os arquivos:

```bash
python3 tools/build-marca.py /caminho/para/Newsreader.ttf
```

---

## Conformidade

O conteúdo é redigido em tom técnico e verificável: explica método, base normativa e
critério, **sem prometer percentual, resultado ou êxito**. Toda página com número traz a
base normativa citada e a ressalva de que não constitui promessa de resultado.

O mini-diagnóstico qualifica antes de coletar contato e, quando o perfil não comporta a
análise, diz isso com franqueza e **não pede os dados** — a regra está em
`client/src/pages/Diagnostico.tsx`, deliberadamente transparente.

Páginas legais: `/privacidade` (LGPD), `/termos` e `/cookies`.

---

## Publicação

O build produz `dist/`:

- `dist/public/` — estáticos e HTML pré-renderizado
- `dist/index.cjs` — servidor Node

```bash
npm ci && npm run build && npm start
```

O servidor respeita `PORT` (padrão 5000) e escuta em `0.0.0.0`.

Antes de publicar em produção, ajuste em `shared/seo.ts` o objeto `SITE`: domínio final,
telefone, WhatsApp, e-mails e endereço. Esses valores alimentam canonical, JSON-LD,
sitemap, rodapé e os links de WhatsApp de todas as páginas.

---

Marca, identidade visual e site desenvolvidos por [Sintetiza AI](https://www.sintetiza.ai).
