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
    App.tsx                   Rotas síncronas, compartilhadas pelo HTML e pelo cliente
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
- o conteúdo completo da página em HTML visível, com o CSS embutido

O visitante recebe a página com o visual pronto sem depender de downloads de JavaScript,
CSS ou fontes. O React hidrata esse HTML para ativar o diagnóstico e a navegação client-side.
Menu móvel e FAQ usam elementos nativos; links de contato continuam disponíveis se o
JavaScript for bloqueado. Todas as rotas são síncronas: a navegação não depende de baixar chunks adicionais.

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


### VPS: publicação sem interrupção

O Nginx usa `current/public` e serve HTML, fontes e assets diretamente. Apenas `/api/`
é encaminhado ao Node na porta 3027. A configuração está em `deploy/nginx.conf`.
Ela mantém os dois nomes HTTPS e o redirecionamento de HTTP para HTTPS.

```bash
npm run deploy
```

O comando verifica os tipos, compila em `.build`, valida as 17 páginas e move o resultado
para `.releases/<data>`. Somente então troca o link `current` atomicamente. Falha de build
não altera a publicação. Assets com hash anteriores são preservados para abas abertas.
Não apague `.releases` nem os assets antigos enquanto houver versões em uso.
O deploy do frontend não exige reiniciar o Node; alterações da API exigem atualizar e
reiniciar seu processo separadamente (`pm2 restart sitetransacione`, como o usuário
`claude-user` nesta VPS). `npm start` usa `current/index.cjs` quando há uma release publicada. `npm run build` continua gerando `dist` para uso local.

Para reverter, crie um link temporário para a release anterior e substitua `current` com
`mv -Tf`; não remova o link ativo antes da troca. O deploy imprime os dois caminhos.

Os tempos de atendimento ficam em `/var/log/nginx/transacione-access.log` (`rt`, `upstream`
e TLS). O diagnóstico opcional `?suporte=acesso` registra somente eventos de carregamento
em `/var/log/nginx/transacione-support.log`, sem cookies nem conteúdo de formulários.


### Testes de acesso em navegador

`script/check-browser.cjs` requer Playwright e os navegadores Chromium/WebKit instalados.
Execute com `TEST_URL=https://www.transacione.com.br node script/check-browser.cjs`.
O teste verifica conteúdo e menu móvel com JavaScript desativado, bloqueado e atrasado,
com todos os subrecursos bloqueados, sem IntersectionObserver e sem localStorage;
nos cenários interativos também abre o diagnóstico. `CHROMIUM_PATH` permite apontar
para um Chromium já instalado. Não envia formulários nem e-mails.

### Destino AWS sem servidor permanente

`npm run build:aws` gera as páginas em `.build/aws/public`, o pacote da API
em `.build/aws/lambda` e a função de roteamento `router.js`. Não altera `current`.
`npm run test:aws` verifica validação, idempotência, limite de envios e falhas de
persistência. A Lambda usa `LEADS_TABLE` e DynamoDB; contatos não expiram,
mas contadores temporários usam `expiresAt`. O frontend envia o hash SHA256
necessário ao CloudFront OAC e uma chave de idempotência por submissão.

O bucket deve ser privado e o CloudFront deve ter acesso somente ao prefixo
`public/`. A API usa Function URL com autenticação IAM e permissões limitadas
à distribuição; `/api/*` usa cache desativado. O roteamento preserva os HTMLs
pré-renderizados e retorna 404 para arquivos/rotas desconhecidos. Assets com hash
anteriores são incluídos no build quando `current` está disponível.

`deploy/aws/provision.py` prepara comandos e JSONs locais por fase (`base`,
`edge`, `certificate`, `monitor`). Sem `--execute`, não cria recursos AWS.
Com `--execute`, verifica a identidade esperada, usa `us-east-1` e salva cada
resposta em `.dados/aws/state.json`. A fase edge deixa a distribuição desativada:
confirmar assinatura FREE ativa, conteúdo enviado e permissões antes de habilitar.
CloudFront e Route 53 são serviços globais. Nunca versionar `.dados` ou credenciais.
O script destina-se à migração inicial; não é um reconciliador de infraestrutura.

`deploy/aws/import-leads.py` importa os registros locais com identificadores
estáveis e escrita condicional; pode ser repetido sem sobrescrever contatos.
Notificações SES só são habilitadas com `LEAD_EMAIL_FROM` e `LEAD_EMAIL_TO`,
identidade SES validada e permissão IAM correspondente. Falhas deixam o contato
gravado com notificação pendente, recuperável por operação administrativa.

Antes de trocar DNS, validar o destino HTTPS, todas as páginas e formulários;
manter a origem e conciliar contatos recebidos durante a propagação. Os IDs,
checkpoints, orçamento e pendências específicas ficam no relatório operacional
local `MIGRACAO-AWS.md`.
