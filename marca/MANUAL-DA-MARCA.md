# Manual de aplicação da marca — Transacione

> **Versão para apresentação:** [`Manual-da-Marca-Transacione.pdf`](Manual-da-Marca-Transacione.pdf)
> — 17 páginas em A4 paisagem, com as variações renderizadas e o conceito explicado
> visualmente. Este Markdown é a fonte de consulta rápida; o PDF é o documento de entrega.

**Versão 2.3 · Setembro de 2026**
CORREA Consultoria Empresarial Estratégica
Desenvolvido por Sintetiza AI

---

## 1. O conceito

A Transacione trabalha sobre uma premissa: **transação é troca, e a troca acontece nos
dois sentidos**. A marca precisa dizer isso antes de qualquer texto.

O símbolo é a letra **T** cujo braço é uma **seta de duas pontas** — herança direta do
ícone de troca que a Transacione já usava, agora resolvido como monograma. Seta e haste
são uma peça só, um contorno contínuo: a metodologia não é um acessório do processo, é o
que o sustenta.

| Elemento | O que significa |
|---|---|
| Ponta esquerda | O que retorna à empresa: desconto, prazo, capacidade recomposta |
| Ponta direita | O que a empresa leva ao Fisco: documento, apuração, proposta |
| Haste, fundida ao braço | A metodologia que sustenta as duas pontas |

A leitura é imediata como letra e como movimento. Não há gráfico ascendente nem metáfora
de crescimento — o negócio é reduzir um passivo, e a marca não promete resultado.

**Assinatura verbal:** *Transação tributária federal e estadual.*

---

## 2. Construção do símbolo

Grade de **32 × 32 unidades**, com o símbolo ocupando uma caixa de **24 × 24** centrada
em (16, 16). Todas as coordenadas são inteiras — a marca permanece nítida em qualquer
densidade de tela e em favicon de 16 px.

O símbolo é **um único contorno fechado**, percorrido no sentido horário a partir da
ponta esquerda:

```
M4 8  L8 4  L8 6  L24 6  L24 4  L28 8  L24 12  L24 10
      L18 10  L18 28  L14 28  L14 10  L8 10  L8 12  Z
```

```
Braço      corpo y: 6 → 10        (peso 4), x: 8 → 24
Cabeças    altura 8 (y: 4 → 12), projeção 4 → pontas em (4, 8) e (28, 8)
Haste      x: 14 → 18, y: 10 → 28 (peso 4), fundida ao braço
```

Peso único de **4 unidades** em todos os traços. Cabeças a 45°, com 8 unidades de altura
e 4 de projeção — proporção 2:1 sobre o corpo, que mantém a seta legível a 16 px sem
dominar a composição. Cantos vivos a 90°, sem raio, sem chanfro.

Por ser um contorno único, a marca nunca se fragmenta: não há como aplicar cor a uma
parte sem que ela permaneça ligada às outras.

### Área de proteção

Reserve, em todos os lados, o equivalente ao **peso do traço** (4 unidades = 1/6 da
caixa do símbolo). Nada entra nessa margem: nem texto, nem borda, nem imagem.

### Tamanho mínimo

| Aplicação | Mínimo |
|---|---|
| Símbolo isolado, digital | 16 px |
| Símbolo isolado, impresso | 5 mm |
| Lockup horizontal, digital | 120 px de largura |
| Lockup horizontal, impresso | 32 mm de largura |

---

## 3. O logotipo

**Newsreader**, peso 500 (Medium), entrelinha 1, **tracking −1,2%**.

A escolha é deliberada: uma serifada editorial contemporânea dá gravidade jurídica sem
soar antiquada, e contrasta com o símbolo geométrico em vez de repeti-lo. A palavra
"Transacione" é um verbo no imperativo — a serifa lhe dá autoridade em vez de urgência.

### O símbolo é a letra T

O logotipo **não é símbolo + palavra**: o símbolo ocupa o lugar da letra **T**, e a
palavra continua em "ransacione". Marca e nome são a mesma coisa, não duas coisas lado a
lado — é o que torna o conjunto minimalista.

```
[símbolo] ransacione
```

Isso funciona porque a caixa do símbolo (24 × 24 unidades) tem quase exatamente a largura
do T da Newsreader na mesma altura de caixa alta — 100 contra 102,5 unidades. A troca não
altera o ritmo da palavra.

| Medida | Valor |
|---|---|
| Altura do símbolo | **1,03 × altura de caixa alta** — a forma geométrica pesa opticamente menos que a serifada, e a folga compensa |
| Espaço até o "r" | **0,07 × altura de caixa alta** |
| Alinhamento | base do símbolo sobre a linha de base do texto |

Em código, o SVG usa `viewBox="4 4 24 24"` — recortado na caixa do símbolo, sem a margem
de proteção. Assim a base do SVG coincide com a base da letra, e o alinhamento por
baseline encaixa sozinho, sem ajuste manual.

Grafia sempre **Transacione**, com T maiúsculo e o restante em caixa baixa. Nunca em caixa
alta, nunca em versalete, nunca abreviada.

### Tamanho mínimo do logotipo

O símbolo precisa de **26 px de altura de caixa alta** para a seta continuar legível — o
que corresponde a um logotipo de **26 px** de corpo. Abaixo disso, use o símbolo isolado
em vez do logotipo.

### Lockup vertical (secundário)

Para quando há **pouca largura em relação à altura** disponível: assinatura de
apresentação, coluna estreita, faixa lateral. O símbolo aparece acima da palavra
completa — "Transacione" com T tipográfico, porque a leitura empilhada não sustenta a
substituição.

A proporção é de aproximadamente **2:1** (largura por altura), não quadrada: a palavra é
longa e não deve ser quebrada em duas linhas. Para espaço genuinamente quadrado — avatar
de rede social, ícone — use o **app icon** ou o **símbolo isolado**.

---

## 4. Paleta

### Cores institucionais

| Token | Nome | HEX | RGB | CMYK aprox. |
|---|---|---|---|---|
| `--color-verde` | **Verde Profundo** | `#0A5C42` | 10, 92, 66 | 90 / 40 / 78 / 35 |
| `--color-esmeralda` | **Esmeralda** | `#0E9E6E` | 14, 158, 110 | 82 / 12 / 70 / 1 |
| `--color-esmeralda-clara` | Esmeralda Clara | `#3FD9A0` | 63, 217, 160 | 62 / 0 / 47 / 0 |
| `--color-grafite` | **Grafite** | `#0C1512` | 12, 21, 18 | 80 / 62 / 68 / 80 |
| `--color-grafite-2` | Grafite Elevado | `#16241F` | 22, 36, 31 | 79 / 55 / 66 / 66 |

**Verde Profundo** é a cor da marca: logotipo, títulos sobre fundo claro, botões primários.
**Esmeralda** é o acento — a cor do que foi revisto. Herda a cor do material anterior da
Transacione, o que preserva reconhecimento, mas foi escurecida e acompanhada de uma base
institucional para deixar de parecer verde de aplicativo.

### Neutros

| Token | Nome | HEX | Uso |
|---|---|---|---|
| `--color-osso` | Osso | `#F7F6F2` | Fundo padrão das páginas |
| `--color-osso-2` | Osso Sombra | `#EEECE5` | Superfícies alternadas |
| — | Branco | `#FFFFFF` | Cartões e superfícies elevadas |
| `--color-tinta` | Tinta | `#14201C` | Texto corrente sobre fundo claro |
| `--color-cinza` | Cinza | `#5A6B64` | Texto secundário |
| `--color-cinza-claro` | Cinza Claro | `#606E67` | Notas e legendas |
| `--color-borda` | Borda | `#E3E6E1` | Fios e contornos sobre claro |
| `--color-borda-escura` | Borda Escura | `#24332D` | Fios e contornos sobre escuro |

### Cores semânticas

| Situação | HEX | Observação |
|---|---|---|
| Positivo / economia apurada | `#0E9E6E` | Nunca usado para prometer resultado |
| Atenção / ressalva | `#C9A227` | Latão — uso restrito, ≤ 5% da superfície |
| Negativo / erro | `#B4463C` | Terracota, e não vermelho puro |

### Contraste verificado (WCAG 2.1)

| Combinação | Razão | Nível |
|---|---|---|
| Verde Profundo `#0A5C42` sobre Branco | 8,01:1 | AAA (texto normal) |
| Verde Profundo sobre Osso `#F7F6F2` | 7,41:1 | AAA (texto normal) |
| Branco sobre Verde Profundo | 8,01:1 | AAA |
| Tinta `#14201C` sobre Osso | 15,50:1 | AAA |
| Cinza `#5A6B64` sobre Osso | 5,22:1 | AA (texto normal) |
| Cinza Claro `#606E67` sobre Osso Sombra `#EEECE5` | 4,53:1 | AA (texto normal) |
| Esmeralda Clara `#3FD9A0` sobre Grafite `#0C1512` | 10,29:1 | AAA |
| Esmeralda `#0E9E6E` sobre Branco | 3,42:1 | **AA apenas para texto grande (≥ 24 px) e elementos gráficos** |
| Esmeralda `#0E9E6E` sobre Grafite | 5,42:1 | AA (texto normal) |

> O Esmeralda não é aprovado para texto corrente sobre fundo claro. Use Verde Profundo
> para texto e reserve o Esmeralda para acentos, fios, ícones e títulos grandes.

---

## 5. Tipografia

| Função | Família | Pesos | Observação |
|---|---|---|---|
| Display e títulos | **Newsreader** | 400–700 (variável) | Serifada editorial. Títulos, numerais de destaque, citações |
| Interface e texto | **Inter** | 400–700 (variável) | Grotesca neutra. Corpo, rótulos, botões, formulários |

Ambas são variáveis, licenciadas em **SIL Open Font License 1.1** — uso comercial livre,
sem custo e sem dependência de terceiros.

No site, as duas são servidas do próprio domínio, com eixo de tamanho óptico fixado e
subconjunto latino: **30 KB + 22 KB**, contra ~180 KB do carregamento padrão.

### Escala tipográfica

Cada estilo abaixo corresponde a um utilitário em `client/src/index.css` — os valores são
os do código, não uma aproximação.

| Estilo | Utilitário | Família | Tamanho | Entrelinha | Tracking |
|---|---|---|---|---|---|
| Manchete | `.manchete` | Newsreader 500 | `clamp(2,4rem · 1,5rem + 4vw · 4,6rem)` | 1,03 | −3,0% |
| Afirmação de faixa | `.afirmacao` | Newsreader 500 | `clamp(1,9rem · 1,25rem + 2,6vw · 3,1rem)` | 1,10 | −2,2% |
| Subafirmação | `.subafirmacao` | Newsreader 500 | `clamp(1,3rem · 1rem + 1,1vw · 1,75rem)` | 1,32 | −1,4% |
| Título de cartão | `.titulo-card` | Newsreader 500 | 1,22 rem | 1,28 | −1,0% |
| Numeral de destaque | `.numeral` | Newsreader 500 | herda do contexto | 1,0 | −3,5% |
| Sobrescrita | `.sobrescrita` | Inter 600 | 0,6875 rem, caixa alta | — | +18% |
| Corpo | `.corpo` | Inter 400 | 1,0625 rem · 1,125 rem a partir de 768 px | 1,70 | 0 |
| Corpo pequeno | `.corpo-sm` | Inter 400 | 0,9375 rem | 1,65 | 0 |
| Nota | `.nota` | Inter 400 | 0,79 rem | 1,60 | 0 |

A hierarquia é de três degraus por faixa: **sobrescrita** anuncia o assunto, **afirmação**
faz a declaração e **corpo** a sustenta. A manchete existe só na primeira dobra da home.

### Numerais

Todo número exibido em tabela, indicador ou valor comparável usa **numerais tabulares**
(`font-variant-numeric: tabular-nums`). Percentuais e prazos que funcionam como destaque
usam Newsreader 500 com tracking −3%.

---

## 6. Versões e aplicação

| Arquivo | Quando usar |
|---|---|
| `logo-horizontal.svg` | Padrão, sobre fundo claro |
| `logo-horizontal-esmeralda.svg` | Quando o Verde Profundo não tem contraste suficiente |
| `logo-horizontal-branco.svg` | Sobre Grafite, Verde Profundo ou fotografia escura |
| `logo-horizontal-grafite.svg` | Documentos monocromáticos e impressão sem cor |
| `logo-horizontal-duotone.svg` | Materiais que explicam o conceito; o braço em Esmeralda sobre a haste em Verde Profundo |
| `logo-vertical.svg` | Pouca largura disponível: assinatura de apresentação, coluna estreita |
| `simbolo.svg` / `simbolo-branco.svg` / `simbolo-esmeralda.svg` / `simbolo-duotone.svg` | Símbolo isolado, quando a marca já foi apresentada ou o espaço não comporta o logotipo |
| `favicon.svg` / `app-icon.svg` | Aba do navegador, ícone de aplicativo — símbolo reverso em quadrado de raio 7/32 |

### Sobre fundos

- **Claro** (Osso, Branco): versão Verde Profundo
- **Escuro** (Grafite, Verde Profundo): versão branca
- **Fotografia**: versão branca, apenas sobre região de luminância abaixo de 40%, com
  véu escuro se necessário
- **Uma cor**: versão grafite

---

## 7. Usos proibidos

1. Alterar as proporções entre o braço, as cabeças e a haste.
2. Separar a seta da haste, ou fazer as pontas apontarem para o mesmo lado — a peça
   única e a oposição **são** o conceito.
3. Engrossar ou afinar as cabeças em relação ao corpo do braço.
4. Aplicar gradiente, sombra, contorno, relevo ou brilho ao símbolo.
5. Rotacionar, inclinar, inverter ou distorcer.
6. Recolorir fora da paleta institucional.
7. Substituir a tipografia do logotipo por outra família.
8. Encaixar o lockup horizontal dentro de um contêiner colorido (use o app icon).
9. Aplicar sobre fundo de contraste insuficiente.
10. Usar o símbolo como bullet, ícone de interface ou elemento decorativo repetido em
   tamanho de texto.
11. Inserir o logotipo em frase corrida como se fosse palavra.
12. Escrever "Transacione" com T tipográfico ao lado do símbolo — no logotipo o símbolo
   **é** o T, não um acompanhante.
13. Aplicar textura, padrão de grade ou trama sobre as superfícies da marca.

---

## 8. Tom de comunicação

A marca opera em um setor onde promessa é risco regulatório e ruína reputacional. A regra
é simples: **explicar método, base normativa e critério — nunca percentual, resultado ou
êxito**.

| Escreva assim | Não escreva assim |
|---|---|
| "Descontos de até 65%, conforme a classificação e os limites da lei." | "Reduza sua dívida em 65%." |
| "O diagnóstico verifica se há espaço de economia — ou por que não há." | "Descubra quanto você vai economizar." |
| "A Portaria PGFN nº 6.757/2022 admite a revisão." | "Nós conseguimos a revisão." |
| "Indício de prescrição, com o parâmetro normativo aplicado." | "Sua dívida está prescrita." |

Todo material com número traz a base normativa citada e a ressalva de que não constitui
promessa de resultado. Toda afirmação técnica é reconstituível até o documento de origem.

---

## 9. Arquivos e titularidade

```
marca/
├── MANUAL-DA-MARCA.md          este documento
└── assets/
    ├── logo-horizontal.svg
    ├── logo-horizontal-branco.svg
    ├── logo-horizontal-grafite.svg
    ├── logo-horizontal-esmeralda.svg
    ├── logo-horizontal-duotone.svg
    ├── logo-vertical.svg
    ├── simbolo.svg
    ├── simbolo-branco.svg
    ├── simbolo-esmeralda.svg
    ├── simbolo-duotone.svg
    ├── favicon.svg
    └── app-icon.svg

marca/png/                        exportações para quem não aceita vetor
├── LEIA-ME.md
├── logo-horizontal-*@1200/2400/4800.png
├── logo-vertical@900/1800/3600.png
├── simbolo-*@600/1200/2400.png
├── app-icon@512/1024/2048.png
└── fundo/                        já aplicados sobre Osso, Grafite e Verde

client/src/assets/equipe/
├── eduardo-correa-da-silva.jpg    retrato quadrado, 400 px
└── fernando-lucas-correa.jpg      retrato quadrado, 800 px
```

Os retratos são quadrados e enquadrados no busto, com os olhos a cerca de 38% da altura —
proporção de retrato, que é o que o componente `Retrato` espera. Substituições devem
manter esse enquadramento.

Ficam em `client/src/assets/` e não em `public/`: assim o Vite gera um hash no nome do
arquivo e trocar uma foto invalida o cache do navegador sozinho. Com nome fixo, quem já
tivesse visitado o site continuaria vendo a foto antiga durante os sete dias de cache.

Todos os arquivos são **SVG vetorial**, com o logotipo já convertido em contornos — não
dependem da fonte instalada no computador de destino. Redimensionam sem perda para
qualquer aplicação, de favicon a fachada.

Para regerar os arquivos após qualquer ajuste na geometria:

```bash
python3 tools/build-marca.py /caminho/para/Newsreader.ttf   # SVGs
python3 tools/build-marca-png.py                            # PNGs
python3 tools/build-manual-pdf.py                           # este manual em PDF
```

O script é a fonte da verdade da geometria. As mesmas coordenadas estão replicadas em
`client/src/components/marca/Logo.tsx`, para o site renderizar a marca sem requisição de
rede — alterar uma exige alterar a outra. O componente expõe `<Simbolo>` (símbolo isolado,
com margem de proteção) e `<Logo>` (o lockup, com o símbolo no lugar da letra T).

A imagem de compartilhamento (`client/public/og.png`, 1200 × 630) e o ícone de toque
(`apple-touch-icon.png`) são gerados a partir dos mesmos caminhos e precisam ser refeitos
quando a geometria mudar.

**Titularidade:** marca, identidade visual e arquivos abertos são de propriedade da
Transacione / CORREA Consultoria Empresarial Estratégica.
