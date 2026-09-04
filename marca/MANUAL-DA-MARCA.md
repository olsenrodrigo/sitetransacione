# Manual de aplicação da marca — Transacione

**Versão 1.0 · Setembro de 2026**
CORREA Consultoria Empresarial Estratégica
Desenvolvido por Sintetiza AI

---

## 1. O conceito

A Transacione trabalha sobre uma única premissa: **o mesmo passivo, reclassificado, custa
menos**. A marca precisa dizer isso antes de qualquer texto.

O símbolo é a letra **T** construída sobre grade ortogonal exata, com três elementos que
carregam o argumento:

| Elemento | Geometria | O que significa |
|---|---|---|
| Barra superior | 24 × 4 unidades | O passivo como está — a classificação presumida |
| Barra inferior | 12 × 4 unidades (50% da superior) | O mesmo passivo, reclassificado |
| Haste | 4 × 22 unidades | A metodologia que sustenta as duas |

A leitura é imediata como letra e sustenta a leitura conceitual quando explicada. Não há
seta, não há gráfico ascendente, não há metáfora de crescimento — o negócio é redução, e a
marca não promete resultado.

**Assinatura verbal:** *Transação tributária federal e estadual.*

---

## 2. Construção do símbolo

Grade de **32 × 32 unidades**. Todas as coordenadas são inteiras — a marca permanece nítida
em qualquer densidade de tela e em favicon de 16 px.

```
Barra superior   x: 4 → 28    y:  5 →  9     (largura 24, altura 4)
Intervalo        y: 9 → 11    (2 unidades)
Barra inferior   x: 10 → 22   y: 11 → 15     (largura 12, altura 4)
Haste            x: 14 → 18   y:  5 → 27     (largura 4, altura 22)

Caixa do símbolo  24 × 22 unidades, centrada em (16, 16)
```

Peso único de **4 unidades** em todos os traços. Cantos vivos a 90°, sem raio, sem chanfro.

### Área de proteção

Reserve, em todos os lados, o equivalente à **altura de uma barra** (4 unidades = 1/6 da
largura do símbolo). Nada entra nessa margem: nem texto, nem borda, nem imagem.

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

Grafia sempre **Transacione**, com T maiúsculo e o restante em caixa baixa. Nunca em caixa
alta, nunca em versalete, nunca abreviada.

### Lockup horizontal (principal)

Símbolo à esquerda, logotipo à direita.

- Altura do símbolo = **1,08 × altura de caixa alta** do logotipo
- Espaço entre eles = **0,52 × altura de caixa alta**
- Alinhamento pelo eixo óptico vertical

### Lockup vertical (secundário)

Para espaços quadrados: assinatura de apresentação, selo de rodapé, avatar de rede social.
Símbolo centrado acima, logotipo centrado abaixo, com intervalo de **0,40 × altura de caixa
alta**.

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

| Estilo | Família | Tamanho | Entrelinha | Tracking |
|---|---|---|---|---|
| Manchete | Newsreader 500 | `clamp(2,15rem, 1,35rem + 3,2vw, 3,7rem)` | 1,07 | −2,4% |
| Título de seção | Newsreader 500 | `clamp(1,75rem, 1,2rem + 2,1vw, 2,85rem)` | 1,14 | −1,8% |
| Título de cartão | Newsreader 500 | 1,2 rem | 1,3 | −1,0% |
| Sobrescrita | Inter 600 | 0,6875 rem, caixa alta | 1,4 | +16% |
| Corpo | Inter 400 | 1–1,0625 rem | 1,68 | 0 |
| Corpo pequeno | Inter 400 | 0,9125 rem | 1,62 | 0 |
| Nota | Inter 400 | 0,78 rem | 1,55 | 0 |

### Numerais

Todo número exibido em tabela, indicador ou valor comparável usa **numerais tabulares**
(`font-variant-numeric: tabular-nums`). Percentuais e prazos que funcionam como destaque
usam Newsreader 500 com tracking −3%.

---

## 6. Versões e aplicação

| Arquivo | Quando usar |
|---|---|
| `logo-horizontal.svg` | Padrão, sobre fundo claro |
| `logo-horizontal-branco.svg` | Sobre Grafite, Verde Profundo ou fotografia escura |
| `logo-horizontal-grafite.svg` | Documentos monocromáticos e impressão sem cor |
| `logo-horizontal-duotone.svg` | Materiais que explicam o conceito da marca; a barra inferior em Esmeralda |
| `logo-vertical.svg` | Espaços quadrados, selos, avatares |
| `simbolo.svg` / `simbolo-branco.svg` / `simbolo-duotone.svg` | Símbolo isolado, quando a marca já foi apresentada |
| `favicon.svg` / `app-icon.svg` | Aba do navegador, ícone de aplicativo — símbolo reverso em quadrado de raio 7/32 |

### Sobre fundos

- **Claro** (Osso, Branco): versão Verde Profundo
- **Escuro** (Grafite, Verde Profundo): versão branca
- **Fotografia**: versão branca, apenas sobre região de luminância abaixo de 40%, com
  véu escuro se necessário
- **Uma cor**: versão grafite

---

## 7. Usos proibidos

1. Alterar as proporções entre barras, haste e intervalo.
2. Igualar as barras — a diferença de largura **é** o conceito.
3. Aplicar gradiente, sombra, contorno, relevo ou brilho ao símbolo.
4. Rotacionar, inclinar, espelhar ou distorcer.
5. Recolorir fora da paleta institucional.
6. Substituir a tipografia do logotipo por outra família.
7. Encaixar o lockup horizontal dentro de um contêiner colorido (use o lockup vertical ou
   o app icon).
8. Aplicar sobre fundo de contraste insuficiente.
9. Usar o símbolo como bullet, ícone de interface ou elemento decorativo repetido em
   tamanho de texto.
10. Inserir o logotipo em frase corrida como se fosse palavra.

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
    ├── logo-horizontal-duotone.svg
    ├── logo-vertical.svg
    ├── simbolo.svg
    ├── simbolo-branco.svg
    ├── simbolo-duotone.svg
    ├── favicon.svg
    └── app-icon.svg
```

Todos os arquivos são **SVG vetorial**, com o logotipo já convertido em contornos — não
dependem da fonte instalada no computador de destino. Redimensionam sem perda para
qualquer aplicação, de favicon a fachada.

Para regerar os arquivos após qualquer ajuste na geometria:

```bash
python3 tools/build-marca.py /caminho/para/Newsreader.ttf
```

O script é a fonte da verdade da geometria. As mesmas coordenadas estão replicadas em
`client/src/components/marca/Logo.tsx`, para o site renderizar a marca sem requisição de
rede — alterar uma exige alterar a outra.

**Titularidade:** marca, identidade visual e arquivos abertos são de propriedade da
Transacione / CORREA Consultoria Empresarial Estratégica.
