#!/usr/bin/env python3
"""
Gera o manual de marca da Transacione em PDF.

Monta um HTML paginado em A4 paisagem, com as fontes e os SVGs da marca
embutidos (o arquivo é autossuficiente), e converte com o Chrome headless.

Uso:  python3 tools/build-manual-pdf.py
Saída: marca/Manual-da-Marca-Transacione.pdf
"""

from __future__ import annotations

import base64
import os
import subprocess
import sys

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FONTES = os.path.join(RAIZ, "client/public/fonts")
SAIDA_HTML = os.path.join(RAIZ, ".dados/manual.html")
SAIDA_PDF = os.path.join(RAIZ, "marca/Manual-da-Marca-Transacione.pdf")

CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

# ------------------------------------------------------------------ marca
SIMBOLO = (
    "M4 8 L8 4 L8 6 L24 6 L24 4 L28 8 L24 12 L24 10 "
    "L18 10 L18 28 L14 28 L14 10 L8 10 L8 12 Z"
)
BRACO = "M4 8 L8 4 L8 6 L24 6 L24 4 L28 8 L24 12 L24 10 L8 10 L8 12 Z"

VERDE = "#0A5C42"
ESMER = "#0E9E6E"
ESMER_CLARA = "#3FD9A0"
GRAFITE = "#0C1512"
OSSO = "#F7F6F2"
OSSO2 = "#EEECE5"
TINTA = "#14201C"
CINZA = "#5A6B64"
CINZA_CLARO = "#606E67"
BORDA = "#E3E6E1"
LATAO = "#C9A227"
TERRACOTA = "#B4463C"

CAP_EM = 0.67
FOLGA = 1.03
GAP_CAP = 0.07


def b64(caminho: str) -> str:
    with open(caminho, "rb") as f:
        return base64.b64encode(f.read()).decode()


def sim(cor: str = VERDE, tam: int = 64, acento: str | None = None,
        estilo: str = "", vb: str = "0 0 32 32") -> str:
    """Símbolo isolado, com a margem de proteção no viewBox."""
    extra = f'<path fill="{acento}" d="{BRACO}"/>' if acento else ""
    st = f' style="{estilo}"' if estilo else ""
    return (f'<svg viewBox="{vb}" width="{tam}" height="{tam}"{st}>'
            f'<path fill="{cor}" d="{SIMBOLO}"/>{extra}</svg>')


def logo(cor: str = VERDE, corpo: int = 34, acento: str | None = None) -> str:
    """Lockup: o símbolo ocupa o lugar da letra T."""
    s = corpo * CAP_EM * FOLGA
    extra = f'<path fill="{acento}" d="{BRACO}"/>' if acento else ""
    return (
        f'<span class="lk">'
        f'<svg viewBox="4 4 24 24" width="{s:.2f}" height="{s:.2f}" '
        f'style="margin-right:{corpo * CAP_EM * GAP_CAP:.2f}px">'
        f'<path fill="{cor}" d="{SIMBOLO}"/>{extra}</svg>'
        f'<span class="lkt" style="color:{cor};font-size:{corpo}px">ransacione</span>'
        f"</span>"
    )


def pagina(num: str, titulo: str, corpo: str, capa: bool = False) -> str:
    if capa:
        return f'<section class="pg capa">{corpo}</section>'
    return f"""<section class="pg">
  <header class="ph"><span>{titulo}</span>{sim(VERDE, 14)}</header>
  <div class="pc">{corpo}</div>
  <footer class="pf"><span>Transacione · Manual de marca</span><span>{num}</span></footer>
</section>"""


# ------------------------------------------------------------------ páginas

def p_capa():
    return pagina("", "", f"""
<div class="capa-marca">{logo("#FFFFFF", 62)}</div>
<div class="capa-txt">
  <p class="capa-sup">Manual de aplicação da marca</p>
  <h1 class="capa-h1">A troca acontece<br><em>nos dois sentidos</em></h1>
  <p class="capa-sub">Transação tributária federal e estadual</p>
</div>
<div class="capa-pe">
  <span>Versão 2.3 · Setembro de 2026</span>
  <span>CORREA Consultoria Empresarial Estratégica</span>
</div>
<div class="capa-sim">{sim("#FFFFFF", 520)}</div>
""", capa=True)


def p_sumario():
    itens = [
        ("01", "O conceito", "Por que a marca tem essa forma"),
        ("02", "Construção do símbolo", "Geometria, grade e proporções"),
        ("03", "Área de proteção e tamanhos", "O ar mínimo e o limite de redução"),
        ("04", "O logotipo", "O símbolo é a letra T"),
        ("05", "Variações de cor", "As seis versões e quando usar cada uma"),
        ("06", "Símbolo isolado e ícones", "Favicon, app icon e marca d'água"),
        ("07", "Paleta institucional", "Verde Profundo, Esmeralda e Grafite"),
        ("08", "Neutros e semânticas", "Superfícies, texto e sinalização"),
        ("09", "Contraste verificado", "Medição WCAG 2.1 de cada par"),
        ("10", "Tipografia", "Newsreader e Inter"),
        ("11", "Escala tipográfica", "Os nove estilos do sistema"),
        ("12", "Aplicação sobre fundos", "Claro, escuro, fotografia e uma cor"),
        ("13", "Usos proibidos", "O que descaracteriza a marca"),
        ("14", "Tom de comunicação", "O que se pode e o que não se pode afirmar"),
        ("15", "Arquivos e titularidade", "O que foi entregue e como regerar"),
    ]
    linhas = "".join(
        f'<li><span class="sn">{n}</span><span class="st">{t}</span>'
        f'<span class="sd">{d}</span></li>'
        for n, t, d in itens
    )
    return pagina("02", "Sumário", f"""
<h2 class="h2">Sumário</h2>
<ol class="sumario">{linhas}</ol>
""")


def p_conceito():
    return pagina("03", "01 · O conceito", f"""
<div class="duas">
  <div>
    <p class="sup">01 · O conceito</p>
    <h2 class="h2">Transação é troca —<br>e a troca acontece<br>nos dois sentidos</h2>
    <p class="txt">A marca precisa dizer isso antes de qualquer texto.</p>
    <p class="txt">O símbolo é a letra <strong>T</strong> cujo braço é uma
      <strong>seta de duas pontas</strong> — herança direta do ícone de troca que a
      Transacione já usava, agora resolvido como monograma.</p>
    <p class="txt">Seta e haste são <strong>uma peça só</strong>, um contorno contínuo:
      a metodologia não é acessório do processo, é o que o sustenta.</p>
    <div class="aviso">
      <p>Não há gráfico ascendente nem metáfora de crescimento. O negócio é reduzir um
      passivo, e a marca não promete resultado — coerente com um setor em que promessa
      é risco regulatório.</p>
    </div>
  </div>
  <div class="conc-fig">
    {sim(VERDE, 240)}
    <ul class="leg">
      <li><b>Ponta esquerda</b><span>O que retorna à empresa: desconto, prazo,
        capacidade recomposta</span></li>
      <li><b>Ponta direita</b><span>O que a empresa leva ao Fisco: documento,
        apuração, proposta</span></li>
      <li><b>Haste, fundida ao braço</b><span>A metodologia que sustenta as duas
        pontas</span></li>
    </ul>
  </div>
</div>
<p class="assin">Assinatura verbal: <em>Transação tributária federal e estadual.</em></p>
""")


def grade_svg(tam=300):
    """Símbolo sobre a grade de construção, com as cotas principais."""
    u = tam / 32
    linhas = "".join(
        f'<line x1="{i*u}" y1="0" x2="{i*u}" y2="{tam}" stroke="{BORDA}" '
        f'stroke-width="{1.6 if i % 4 == 0 else 0.6}"/>'
        f'<line x1="0" y1="{i*u}" x2="{tam}" y2="{i*u}" stroke="{BORDA}" '
        f'stroke-width="{1.6 if i % 4 == 0 else 0.6}"/>'
        for i in range(33)
    )
    caixa = (f'<rect x="{4*u}" y="{4*u}" width="{24*u}" height="{24*u}" fill="none" '
             f'stroke="{ESMER}" stroke-width="1.2" stroke-dasharray="5 4"/>')
    return (f'<svg viewBox="0 0 {tam} {tam}" width="{tam}" height="{tam}">'
            f'{linhas}{caixa}'
            f'<g transform="scale({u})"><path fill="{VERDE}" d="{SIMBOLO}"/></g></svg>')


def p_construcao():
    return pagina("04", "02 · Construção do símbolo", f"""
<p class="sup">02 · Construção do símbolo</p>
<h2 class="h2">Grade de 32 × 32, coordenadas inteiras</h2>
<div class="constr">
  <div class="constr-fig">{grade_svg(310)}
    <p class="cap">Caixa do símbolo: 24 × 24, centrada em (16, 16)</p>
  </div>
  <div>
    <p class="txt">O símbolo é <strong>um único contorno fechado</strong>, percorrido no
      sentido horário a partir da ponta esquerda. Por ser uma peça só, nunca se
      fragmenta: não há como colorir uma parte sem que ela permaneça ligada às
      outras.</p>
    <pre class="cod">M4 8  L8 4  L8 6  L24 6  L24 4  L28 8  L24 12  L24 10
      L18 10  L18 28  L14 28  L14 10  L8 10  L8 12  Z</pre>
    <table class="tb">
      <tr><th>Elemento</th><th>Coordenadas</th></tr>
      <tr><td>Braço, corpo</td><td>x 8 → 24 · y 6 → 10 · peso 4</td></tr>
      <tr><td>Cabeças</td><td>altura 8 (y 4 → 12) · projeção 4 · pontas em (4, 8) e (28, 8)</td></tr>
      <tr><td>Haste</td><td>x 14 → 18 · y 10 → 28 · peso 4, fundida ao braço</td></tr>
    </table>
    <p class="txt">Peso único de <strong>4 unidades</strong> em todos os traços. Cabeças a
      45°, com 8 de altura e 4 de projeção — proporção 2:1 sobre o corpo, que mantém a
      seta legível a 16 px sem dominar. Cantos vivos a 90°, sem raio, sem chanfro.</p>
  </div>
</div>
""")


def p_protecao():
    u = 7
    prot = (
        f'<svg viewBox="0 0 {40*u} {40*u}" width="270" height="270">'
        f'<rect x="0" y="0" width="{40*u}" height="{40*u}" fill="{OSSO2}"/>'
        f'<rect x="{4*u}" y="{4*u}" width="{32*u}" height="{32*u}" fill="#fff"/>'
        f'<rect x="{8*u}" y="{8*u}" width="{24*u}" height="{24*u}" fill="none" '
        f'stroke="{ESMER}" stroke-width="1.4" stroke-dasharray="5 4"/>'
        f'<g transform="translate({4*u},{4*u}) scale({u})">'
        f'<path fill="{VERDE}" d="{SIMBOLO}"/></g>'
        f'<text x="{20*u}" y="{2.9*u}" text-anchor="middle" fill="{ESMER}" '
        f'font-size="{2.1*u}" font-family="monospace">4 u</text></svg>'
    )
    escala = "".join(
        f'<div class="esc-i"><div class="esc-b">{sim(VERDE, t)}</div>'
        f'<span>{t} px</span></div>'
        for t in (16, 24, 32, 48, 64)
    )
    return pagina("05", "03 · Área de proteção e tamanhos", f"""
<p class="sup">03 · Área de proteção e tamanhos mínimos</p>
<h2 class="h2">O ar em volta faz parte da marca</h2>
<div class="duas">
  <div>
    <div class="fig-c">{prot}</div>
    <p class="cap">Margem = peso do traço (4 unidades = 1/6 da caixa)</p>
  </div>
  <div>
    <p class="txt">Reserve, em todos os lados, o equivalente ao <strong>peso do
      traço</strong>. Nada entra nessa margem: nem texto, nem borda, nem imagem.</p>
    <table class="tb">
      <tr><th>Aplicação</th><th>Mínimo</th></tr>
      <tr><td>Símbolo isolado, digital</td><td>16 px</td></tr>
      <tr><td>Símbolo isolado, impresso</td><td>5 mm</td></tr>
      <tr><td>Logotipo, digital</td><td>26 px de corpo</td></tr>
      <tr><td>Logotipo, impresso</td><td>9 mm de corpo</td></tr>
    </table>
    <p class="txt">Abaixo de 26 px de corpo a seta deixa de ser legível no logotipo.
      Nesse caso, use o <strong>símbolo isolado</strong> em vez de reduzir o
      conjunto.</p>
    <div class="escala">{escala}</div>
    <p class="cap">O símbolo reduzido — a seta sobrevive até 16 px</p>
  </div>
</div>
""")


def p_logotipo():
    return pagina("06", "04 · O logotipo", f"""
<p class="sup">04 · O logotipo</p>
<h2 class="h2">O símbolo <em>é</em> a letra T</h2>
<p class="txt lead">O logotipo não é símbolo + palavra: o símbolo ocupa o lugar da letra
  <strong>T</strong>, e a palavra continua em “ransacione”. Marca e nome são a mesma
  coisa, não duas coisas lado a lado — é o que torna o conjunto minimalista.</p>
<div class="lg-demo">{logo(VERDE, 62)}</div>
<div class="duas mt">
  <div>
    <p class="txt">Funciona porque a caixa do símbolo (24 × 24) tem quase exatamente a
      largura do T da Newsreader na mesma altura de caixa alta — <strong>100 contra
      102,5 unidades</strong>. A troca não altera o ritmo da palavra.</p>
    <table class="tb">
      <tr><th>Medida</th><th>Valor</th></tr>
      <tr><td>Altura do símbolo</td><td>1,03 × altura de caixa alta</td></tr>
      <tr><td>Espaço até o “r”</td><td>0,07 × altura de caixa alta</td></tr>
      <tr><td>Alinhamento</td><td>base do símbolo na linha de base do texto</td></tr>
    </table>
    <p class="txt sm">A folga de 3% compensa o peso óptico: a forma geométrica pesa menos
      que a serifada na mesma altura.</p>
  </div>
  <div>
    <div class="comp">
      <div class="comp-i"><span class="comp-l">T tipográfico</span>
        <span class="lkt" style="font-size:56px;color:{CINZA_CLARO}">T</span></div>
      <div class="comp-i"><span class="comp-l">Símbolo</span>
        {sim(VERDE, 39, vb="4 4 24 24")}</div>
    </div>
    <p class="cap">Mesma altura de caixa alta, larguras equivalentes</p>
    <div class="aviso">
      <p>Em código o SVG usa <code>viewBox="4 4 24 24"</code> — recortado na caixa do
      símbolo, sem a margem de proteção. Assim a base do SVG coincide com a base da
      letra e o alinhamento por baseline encaixa sozinho.</p>
    </div>
  </div>
</div>
""")


def p_variacoes():
    def bloco(rot, arq, fundo, html, nota):
        return (f'<div class="var"><div class="var-p" style="background:{fundo}">{html}</div>'
                f'<p class="var-r">{rot}</p><p class="var-a">{arq}</p>'
                f'<p class="var-n">{nota}</p></div>')

    grade = "".join([
        bloco("Padrão", "logo-horizontal.svg", "#fff", logo(VERDE, 30),
              "Sobre Osso ou Branco. É a versão de uso corrente."),
        bloco("Reversa", "logo-horizontal-branco.svg", GRAFITE, logo("#FFFFFF", 30),
              "Sobre Grafite, Verde Profundo ou fotografia escura."),
        bloco("Esmeralda", "logo-horizontal-esmeralda.svg", GRAFITE, logo(ESMER, 30),
              "Quando o Verde Profundo não tem contraste suficiente."),
        bloco("Grafite", "logo-horizontal-grafite.svg", "#fff", logo(GRAFITE, 30),
              "Documentos monocromáticos e impressão sem cor."),
        bloco("Duotone", "logo-horizontal-duotone.svg", "#fff",
              logo(VERDE, 30, acento=ESMER),
              "Só em materiais que explicam o conceito da marca."),
        bloco("Vertical", "logo-vertical.svg", "#fff",
              f'<div class="vert">{sim(VERDE, 40)}'
              f'<span class="lkt" style="font-size:20px;color:{VERDE}">Transacione</span></div>',
              "Pouca largura disponível. Aqui o T é tipográfico."),
    ])
    return pagina("07", "05 · Variações de cor", f"""
<p class="sup">05 · Variações de cor</p>
<h2 class="h2">Seis versões, um critério: contraste</h2>
<div class="vars">{grade}</div>
""")


def p_icones():
    icon = (f'<svg viewBox="0 0 32 32" width="104" height="104">'
            f'<rect width="32" height="32" rx="7" fill="{VERDE}"/>'
            f'<g transform="translate(16,16) scale(0.72) translate(-16,-16)">'
            f'<path fill="#fff" d="{SIMBOLO}"/></g></svg>')
    icon_p = (f'<svg viewBox="0 0 32 32" width="32" height="32">'
              f'<rect width="32" height="32" rx="7" fill="{VERDE}"/>'
              f'<g transform="translate(16,16) scale(0.72) translate(-16,-16)">'
              f'<path fill="#fff" d="{SIMBOLO}"/></g></svg>')
    return pagina("08", "06 · Símbolo isolado e ícones", f"""
<p class="sup">06 · Símbolo isolado e ícones</p>
<h2 class="h2">Quando a marca aparece sozinha</h2>
<div class="tres">
  <div class="cx">
    <div class="cx-p">{sim(VERDE, 96)}</div>
    <p class="cx-t">Símbolo</p>
    <p class="cx-d">Quando a marca já foi apresentada na peça, ou o espaço não comporta o
      logotipo. Também nas variações branco, esmeralda e duotone.</p>
  </div>
  <div class="cx">
    <div class="cx-p">{icon}</div>
    <p class="cx-t">App icon e favicon</p>
    <p class="cx-d">Símbolo reverso sobre Verde Profundo, em quadrado de raio 7/32.
      O símbolo ocupa 72% do quadrado.</p>
  </div>
  <div class="cx">
    <div class="cx-p" style="background:{GRAFITE}">
      <div style="opacity:.09">{sim("#FFFFFF", 96)}</div></div>
    <p class="cx-t">Marca d'água</p>
    <p class="cx-d">Opacidade entre 3% e 9%, sempre fora da área de texto. Nunca atrás de
      conteúdo que precise ser lido.</p>
  </div>
</div>
<div class="icones-real">
  <span class="ir-l">Tamanho real do favicon:</span>{icon_p}
  <span class="ir-l" style="margin-left:28px">e do símbolo:</span>{sim(VERDE, 16)}
</div>
""")


def swatch(nome, token, hexv, rgb, cmyk, cor_txt="#fff"):
    return (f'<div class="sw"><div class="sw-c" style="background:{hexv};color:{cor_txt}">'
            f'{hexv}</div><p class="sw-n">{nome}</p><p class="sw-t">{token}</p>'
            f'<p class="sw-d">RGB {rgb}<br>CMYK {cmyk}</p></div>')


def p_paleta():
    return pagina("09", "07 · Paleta institucional", f"""
<p class="sup">07 · Paleta institucional</p>
<h2 class="h2">Verde Profundo, Esmeralda e Grafite</h2>
<div class="sws">
  {swatch("Verde Profundo", "--color-verde", VERDE, "10, 92, 66", "90 / 40 / 78 / 35")}
  {swatch("Esmeralda", "--color-esmeralda", ESMER, "14, 158, 110", "82 / 12 / 70 / 1")}
  {swatch("Esmeralda Clara", "--color-esmeralda-clara", ESMER_CLARA, "63, 217, 160",
          "62 / 0 / 47 / 0", GRAFITE)}
  {swatch("Grafite", "--color-grafite", GRAFITE, "12, 21, 18", "80 / 62 / 68 / 80")}
</div>
<div class="duas mt">
  <div>
    <p class="txt"><strong>Verde Profundo</strong> é a cor da marca: logotipo, títulos
      sobre fundo claro, botões primários. Carrega a autoridade institucional que o
      setor exige.</p>
  </div>
  <div>
    <p class="txt"><strong>Esmeralda</strong> é o acento — a cor do que foi revisto.
      Herda o verde do material anterior da Transacione, o que preserva reconhecimento,
      mas foi escurecida e ancorada numa base institucional para deixar de parecer verde
      de aplicativo.</p>
  </div>
</div>
""")


def p_neutros():
    def mini(nome, hexv, token, txt="#fff"):
        return (f'<div class="mn"><div class="mn-c" style="background:{hexv};color:{txt}">'
                f'{hexv}</div><p class="mn-n">{nome}</p><p class="mn-t">{token}</p></div>')
    return pagina("10", "08 · Neutros e semânticas", f"""
<p class="sup">08 · Neutros e cores semânticas</p>
<h2 class="h2">Superfícies, texto e sinalização</h2>
<p class="sup2">Neutros</p>
<div class="mns">
  {mini("Osso", OSSO, "--color-osso", TINTA)}
  {mini("Osso Sombra", OSSO2, "--color-osso-2", TINTA)}
  {mini("Branco", "#FFFFFF", "superfícies elevadas", TINTA)}
  {mini("Tinta", TINTA, "--color-tinta")}
  {mini("Cinza", CINZA, "--color-cinza")}
  {mini("Cinza Claro", CINZA_CLARO, "--color-cinza-claro")}
  {mini("Borda", BORDA, "--color-borda", TINTA)}
  {mini("Borda Escura", "#24332D", "--color-borda-escura")}
</div>
<p class="sup2 mt">Semânticas</p>
<div class="mns">
  {mini("Positivo", ESMER, "economia apurada")}
  {mini("Atenção", LATAO, "ressalva · ≤ 5% da superfície", GRAFITE)}
  {mini("Negativo", TERRACOTA, "erro — não vermelho puro")}
</div>
<div class="aviso mt">
  <p>O Esmeralda sinaliza economia apurada, nunca resultado prometido. O Latão é de uso
  restrito: acima de 5% da superfície ele compete com a marca.</p>
</div>
""")


def p_contraste():
    pares = [
        ("Verde Profundo", VERDE, "Branco", "#FFFFFF", "8,01", "AAA"),
        ("Verde Profundo", VERDE, "Osso", OSSO, "7,41", "AAA"),
        ("Branco", "#FFFFFF", "Verde Profundo", VERDE, "8,01", "AAA"),
        ("Tinta", TINTA, "Osso", OSSO, "15,50", "AAA"),
        ("Cinza", CINZA, "Osso", OSSO, "5,22", "AA"),
        ("Cinza Claro", CINZA_CLARO, "Osso Sombra", OSSO2, "4,53", "AA"),
        ("Esmeralda Clara", ESMER_CLARA, "Grafite", GRAFITE, "10,29", "AAA"),
        ("Esmeralda", ESMER, "Grafite", GRAFITE, "5,42", "AA"),
        ("Esmeralda", ESMER, "Branco", "#FFFFFF", "3,42", "AA grande"),
    ]
    linhas = "".join(
        f'<tr><td><span class="pt" style="background:{cf};'
        f'{"border:1px solid "+BORDA if cf=="#FFFFFF" else ""}"></span>{f}</td>'
        f'<td><span class="pt" style="background:{cb};'
        f'{"border:1px solid "+BORDA if cb=="#FFFFFF" else ""}"></span>{b}</td>'
        f'<td class="num">{r}:1</td>'
        f'<td><span class="badge {"aaa" if n=="AAA" else ("aa" if n=="AA" else "aag")}">'
        f"{n}</span></td></tr>"
        for f, cf, b, cb, r, n in pares
    )
    return pagina("11", "09 · Contraste verificado", f"""
<p class="sup">09 · Contraste verificado</p>
<h2 class="h2">Cada par foi medido, não estimado</h2>
<table class="tb largo">
  <tr><th>Frente</th><th>Fundo</th><th>Razão</th><th>WCAG 2.1</th></tr>
  {linhas}
</table>
<div class="aviso alerta">
  <p><strong>O Esmeralda não é aprovado para texto corrente sobre fundo claro</strong>
  (3,42:1). Use Verde Profundo no texto e reserve o Esmeralda para acentos, fios, ícones
  e títulos acima de 24 px.</p>
</div>
""")


def p_tipografia():
    amostra = "ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz 0123456789"
    return pagina("12", "10 · Tipografia", f"""
<p class="sup">10 · Tipografia</p>
<h2 class="h2">Newsreader e Inter</h2>
<div class="tipo">
  <div class="tp-h"><span class="tp-n">Newsreader</span>
    <span class="tp-u">Display · títulos · numerais · citações</span></div>
  <p class="tp-a serif">Transação tributária</p>
  <p class="tp-s serif">{amostra}</p>
  <p class="tp-d">Serifada editorial contemporânea. Dá gravidade jurídica sem soar
    antiquada, e contrasta com o símbolo geométrico em vez de repeti-lo. Pesos 400–700,
    variável.</p>
</div>
<div class="tipo">
  <div class="tp-h"><span class="tp-n sans">Inter</span>
    <span class="tp-u">Interface · corpo · rótulos · formulários</span></div>
  <p class="tp-a sans">Diagnóstico em 48 horas</p>
  <p class="tp-s sans">{amostra}</p>
  <p class="tp-d">Grotesca neutra, desenhada para tela. Pesos 400–700, variável.</p>
</div>
<div class="aviso">
  <p>Ambas em <strong>SIL Open Font License 1.1</strong> — uso comercial livre, sem custo
  e sem dependência de terceiros. No site são servidas do próprio domínio, com eixo
  óptico fixado e subconjunto latino: <strong>30 KB + 22 KB</strong>, contra ~180 KB do
  carregamento padrão.</p>
</div>
""")


def p_escala():
    linhas = [
        ("Manchete", ".manchete", "Newsreader 500", "clamp(2,4 · 4,6 rem)", "1,03", "−3,0%"),
        ("Afirmação de faixa", ".afirmacao", "Newsreader 500", "clamp(1,9 · 3,1 rem)", "1,10", "−2,2%"),
        ("Subafirmação", ".subafirmacao", "Newsreader 500", "clamp(1,3 · 1,75 rem)", "1,32", "−1,4%"),
        ("Título de cartão", ".titulo-card", "Newsreader 500", "1,22 rem", "1,28", "−1,0%"),
        ("Numeral de destaque", ".numeral", "Newsreader 500", "herda", "1,0", "−3,5%"),
        ("Sobrescrita", ".sobrescrita", "Inter 600", "0,6875 rem caixa alta", "—", "+18%"),
        ("Corpo", ".corpo", "Inter 400", "1,0625 · 1,125 rem", "1,70", "0"),
        ("Corpo pequeno", ".corpo-sm", "Inter 400", "0,9375 rem", "1,65", "0"),
        ("Nota", ".nota", "Inter 400", "0,79 rem", "1,60", "0"),
    ]
    tr = "".join(
        f'<tr><td>{a}</td><td><code>{b}</code></td><td>{c}</td><td>{d}</td>'
        f'<td class="num">{e}</td><td class="num">{f}</td></tr>'
        for a, b, c, d, e, f in linhas
    )
    return pagina("13", "11 · Escala tipográfica", f"""
<p class="sup">11 · Escala tipográfica</p>
<h2 class="h2">Nove estilos, três degraus por faixa</h2>
<table class="tb largo pequena">
  <tr><th>Estilo</th><th>Utilitário</th><th>Família</th><th>Tamanho</th>
    <th>Entrelinha</th><th>Tracking</th></tr>
  {tr}
</table>
<div class="duas mt">
  <div>
    <p class="txt">A hierarquia é de três degraus por faixa: <strong>sobrescrita</strong>
      anuncia o assunto, <strong>afirmação</strong> faz a declaração e
      <strong>corpo</strong> a sustenta. A manchete existe só na primeira dobra.</p>
  </div>
  <div>
    <p class="txt"><strong>Numerais tabulares</strong> em toda tabela, indicador ou valor
      comparável (<code>font-variant-numeric: tabular-nums</code>). Percentuais e prazos
      de destaque usam Newsreader 500 com tracking −3,5%.</p>
  </div>
</div>
<p class="cap">Valores extraídos de <code>client/src/index.css</code> — o manual e o código
  dizem o mesmo número.</p>
""")


def p_fundos():
    return pagina("14", "12 · Aplicação sobre fundos", f"""
<p class="sup">12 · Aplicação sobre fundos</p>
<h2 class="h2">A regra é uma só: contraste</h2>
<div class="fundos">
  <div class="fd"><div class="fd-p" style="background:{OSSO}">{logo(VERDE, 26)}</div>
    <p class="fd-t">Claro</p><p class="fd-d">Osso ou Branco → versão Verde Profundo</p></div>
  <div class="fd"><div class="fd-p" style="background:{GRAFITE}">{logo("#FFFFFF", 26)}</div>
    <p class="fd-t">Escuro</p><p class="fd-d">Grafite ou Verde Profundo → versão branca</p></div>
  <div class="fd"><div class="fd-p" style="background:{VERDE}">{logo("#FFFFFF", 26)}</div>
    <p class="fd-t">Verde institucional</p><p class="fd-d">Sempre a versão branca</p></div>
  <div class="fd"><div class="fd-p"
      style="background:linear-gradient(120deg,#20302a,#0d1a15)">{logo("#FFFFFF", 26)}</div>
    <p class="fd-t">Fotografia</p><p class="fd-d">Versão branca, só sobre luminância abaixo
      de 40% — com véu escuro se necessário</p></div>
  <div class="fd"><div class="fd-p" style="background:#fff">{logo(GRAFITE, 26)}</div>
    <p class="fd-t">Uma cor</p><p class="fd-d">Impressão sem cor → versão grafite</p></div>
  <div class="fd"><div class="fd-p" style="background:{OSSO2}">{logo(ESMER, 26)}</div>
    <p class="fd-t">Esmeralda</p><p class="fd-d">Só quando o Verde Profundo não tem
      contraste suficiente</p></div>
</div>
""")


def p_proibidos():
    err = [
        ("Distorcer", f'<div style="transform:scaleX(1.5)">{sim(TERRACOTA, 54)}</div>'),
        ("Rotacionar", f'<div style="transform:rotate(20deg)">{sim(TERRACOTA, 54)}</div>'),
        ("Inverter", f'<div style="transform:scaleY(-1)">{sim(TERRACOTA, 54)}</div>'),
        ("Aplicar sombra ou relevo",
         f'<div style="filter:drop-shadow(3px 4px 2px rgba(0,0,0,.5))">{sim(TERRACOTA, 54)}</div>'),
        ("Recolorir fora da paleta", sim("#B15CD1", 54)),
        ("Contraste insuficiente",
         f'<div style="background:{ESMER};padding:6px">{sim(VERDE, 44)}</div>'),
        ("Separar seta e haste",
         f'<svg viewBox="0 0 32 34" width="54" height="57">'
         f'<path fill="{TERRACOTA}" d="{BRACO}"/>'
         f'<path fill="{TERRACOTA}" d="M14 15h4v15h-4z"/></svg>'),
        ("T tipográfico ao lado do símbolo",
         f'<div class="lk">{sim(TERRACOTA, 34, vb="4 4 24 24")}'
         f'<span class="lkt" style="font-size:26px;color:{TERRACOTA};margin-left:5px">'
         f'Transacione</span></div>'),
        ("Textura ou trama sobre a marca",
         f'<div style="background:repeating-linear-gradient(0deg,{BORDA} 0 1px,'
         f'transparent 1px 9px),repeating-linear-gradient(90deg,{BORDA} 0 1px,'
         f'transparent 1px 9px);padding:6px">{sim(TERRACOTA, 44)}</div>'),
    ]
    itens = "".join(
        f'<div class="pr"><div class="pr-p">{h}<span class="pr-x">✕</span></div>'
        f'<p class="pr-t">{t}</p></div>'
        for t, h in err
    )
    return pagina("15", "13 · Usos proibidos", f"""
<p class="sup">13 · Usos proibidos</p>
<h2 class="h2">O que descaracteriza a marca</h2>
<div class="prs">{itens}</div>
<p class="txt sm mt">Também proibido: alterar as proporções entre braço, cabeças e haste;
  substituir a tipografia do logotipo; encaixar o lockup horizontal em contêiner colorido
  (use o vertical ou o app icon); usar o símbolo como bullet ou ícone de interface;
  inserir o logotipo em frase corrida como se fosse palavra.</p>
""")


def p_tom():
    pares = [
        ("“Descontos de até 65%, conforme a classificação e os limites da lei.”",
         "“Reduza sua dívida em 65%.”"),
        ("“O diagnóstico verifica se há espaço de economia — ou por que não há.”",
         "“Descubra quanto você vai economizar.”"),
        ("“A Portaria PGFN nº 6.757/2022 admite a revisão.”",
         "“Nós conseguimos a revisão.”"),
        ("“Indício de prescrição, com o parâmetro normativo aplicado.”",
         "“Sua dívida está prescrita.”"),
    ]
    linhas = "".join(
        f'<tr><td class="ok">{a}</td><td class="nao">{b}</td></tr>' for a, b in pares
    )
    return pagina("16", "14 · Tom de comunicação", f"""
<p class="sup">14 · Tom de comunicação</p>
<h2 class="h2">Explicar método, nunca prometer resultado</h2>
<p class="txt lead">A marca opera num setor em que promessa é risco regulatório e ruína
  reputacional. A regra é simples: <strong>explicar método, base normativa e critério —
  nunca percentual, resultado ou êxito.</strong></p>
<table class="tb largo tom">
  <tr><th class="ok">Escreva assim</th><th class="nao">Não escreva assim</th></tr>
  {linhas}
</table>
<div class="aviso mt">
  <p>Todo material com número traz a base normativa citada e a ressalva de que não
  constitui promessa de resultado. Toda afirmação técnica é reconstituível até o
  documento de origem.</p>
</div>
""")


def p_arquivos():
    return pagina("17", "15 · Arquivos e titularidade", f"""
<p class="sup">15 · Arquivos e titularidade</p>
<h2 class="h2">O que foi entregue</h2>
<div class="duas">
  <div>
    <pre class="cod arq">marca/
├── MANUAL-DA-MARCA.md
├── Manual-da-Marca-Transacione.pdf
├── png/            exportações em alta
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
    └── app-icon.svg</pre>
  </div>
  <div>
    <p class="txt">Todos os arquivos são <strong>SVG vetorial</strong>, com o logotipo já
      convertido em contornos — não dependem da fonte instalada no computador de destino.
      Redimensionam sem perda, de favicon a fachada.</p>
    <p class="txt">Para regerar após qualquer ajuste na geometria:</p>
    <pre class="cod">python3 tools/build-marca.py Newsreader.ttf
python3 tools/build-marca-png.py
python3 tools/build-manual-pdf.py</pre>
    <p class="txt sm">O script é a fonte da verdade da geometria. As mesmas coordenadas
      estão em <code>client/src/components/marca/Logo.tsx</code>, para o site renderizar a
      marca sem requisição de rede — alterar uma exige alterar a outra. A imagem de
      compartilhamento (<code>og.png</code>) e o ícone de toque derivam da mesma geometria
      e precisam ser refeitos quando ela mudar.</p>
    <div class="aviso">
      <p><strong>Titularidade:</strong> marca, identidade visual e arquivos abertos são de
      propriedade da Transacione / CORREA Consultoria Empresarial Estratégica.</p>
    </div>
  </div>
</div>
<div class="fim">{logo(VERDE, 30)}<span>Desenvolvido por Sintetiza AI · sintetiza.ai</span></div>
""")


# ------------------------------------------------------------------ CSS

def css():
    nr = b64(os.path.join(FONTES, "newsreader-var.woff2"))
    it = b64(os.path.join(FONTES, "inter-var.woff2"))
    return f"""
@font-face{{font-family:NR;src:url(data:font/woff2;base64,{nr}) format("woff2-variations");
  font-weight:400 700;font-display:block}}
@font-face{{font-family:IT;src:url(data:font/woff2;base64,{it}) format("woff2-variations");
  font-weight:400 700;font-display:block}}

@page{{size:297mm 210mm;margin:0}}
*{{margin:0;padding:0;box-sizing:border-box}}
html{{-webkit-print-color-adjust:exact;print-color-adjust:exact}}
body{{font-family:IT,sans-serif;color:{TINTA};background:#fff}}

.pg{{width:297mm;height:210mm;position:relative;overflow:hidden;background:{OSSO};
  page-break-after:always;display:flex;flex-direction:column}}
.pg:last-child{{page-break-after:auto}}
.ph{{display:flex;justify-content:space-between;align-items:center;
  padding:11mm 16mm 0;font-size:7.5pt;letter-spacing:.14em;text-transform:uppercase;
  color:{CINZA_CLARO}}}
.pc{{flex:1;padding:8mm 16mm 0;min-height:0}}
.pf{{display:flex;justify-content:space-between;padding:0 16mm 9mm;font-size:7pt;
  color:{CINZA_CLARO}}}

/* capa */
.capa{{background:{GRAFITE};color:#fff;padding:16mm;justify-content:space-between}}
.capa-sim{{position:absolute;right:-90mm;bottom:-60mm;opacity:.05}}
.capa-marca{{position:relative;z-index:2}}
.capa-txt{{position:relative;z-index:2}}
.capa-sup{{font-size:8pt;letter-spacing:.2em;text-transform:uppercase;color:{ESMER_CLARA};
  margin-bottom:7mm}}
.capa-h1{{font-family:NR,serif;font-weight:500;font-size:40pt;line-height:1.06;
  letter-spacing:-.025em}}
.capa-h1 em{{font-style:italic;color:{ESMER_CLARA}}}
.capa-sub{{font-size:11pt;color:#A9BBB4;margin-top:6mm}}
.capa-pe{{position:relative;z-index:2;display:flex;justify-content:space-between;
  font-size:8pt;color:#8AA098;border-top:1px solid #24332D;padding-top:5mm}}

/* tipografia base */
.lk{{display:inline-flex;align-items:baseline;white-space:nowrap}}
.lkt{{font-family:NR,serif;font-weight:500;letter-spacing:-.012em;line-height:1}}
.sup{{font-size:7.5pt;letter-spacing:.18em;text-transform:uppercase;color:{ESMER};
  font-weight:600;margin-bottom:4mm}}
.sup2{{font-size:7.5pt;letter-spacing:.16em;text-transform:uppercase;color:{CINZA};
  font-weight:600;margin-bottom:3mm}}
.h2{{font-family:NR,serif;font-weight:500;font-size:23pt;line-height:1.12;
  letter-spacing:-.02em;color:{VERDE};margin-bottom:6mm}}
.h2 em{{font-style:italic;color:{ESMER}}}
.txt{{font-size:9.5pt;line-height:1.62;color:{CINZA};margin-bottom:3.6mm;max-width:105mm}}
.txt.lead{{font-size:11pt;color:{TINTA};max-width:190mm;margin-bottom:6mm}}
.txt.sm{{font-size:8.5pt}}
.txt strong{{color:{VERDE};font-weight:600}}
.cap{{font-size:7.5pt;color:{CINZA_CLARO};margin-top:2.5mm;line-height:1.5}}
.mt{{margin-top:7mm}}
code{{font-family:ui-monospace,monospace;font-size:.88em;background:{OSSO2};
  padding:1px 4px;border-radius:3px;color:{VERDE}}}

.duas{{display:grid;grid-template-columns:1fr 1fr;gap:14mm}}
.tres{{display:grid;grid-template-columns:1fr 1fr 1fr;gap:9mm}}

.aviso{{background:#fff;border-left:2px solid {ESMER};padding:4.5mm 5mm;margin-top:5mm;
  border-radius:0 4px 4px 0}}
.aviso p{{font-size:8.5pt;line-height:1.6;color:{CINZA};margin:0}}
.aviso.alerta{{border-left-color:{TERRACOTA}}}

.tb{{width:100%;border-collapse:collapse;font-size:8.5pt;margin:4mm 0}}
.tb th{{text-align:left;font-size:7pt;letter-spacing:.1em;text-transform:uppercase;
  color:{CINZA};font-weight:600;border-bottom:1.5px solid {BORDA};padding:2.5mm 2mm}}
.tb td{{padding:2.5mm 2mm;border-bottom:1px solid {BORDA};color:{TINTA};
  vertical-align:top;line-height:1.5}}
.tb.pequena{{font-size:7.8pt}}
.tb .num{{font-variant-numeric:tabular-nums}}
.pt{{display:inline-block;width:11px;height:11px;border-radius:2px;margin-right:6px;
  vertical-align:-1px}}
.badge{{font-size:7pt;font-weight:600;padding:1.5px 6px;border-radius:3px;
  letter-spacing:.04em}}
.badge.aaa{{background:rgba(14,158,110,.14);color:{VERDE}}}
.badge.aa{{background:rgba(14,158,110,.08);color:{VERDE}}}
.badge.aag{{background:rgba(201,162,39,.16);color:#7A6218}}

.cod{{font-family:ui-monospace,monospace;font-size:7.6pt;line-height:1.65;background:#fff;
  border:1px solid {BORDA};border-radius:4px;padding:4mm;color:{VERDE};margin:4mm 0;
  white-space:pre;overflow:hidden}}
.cod.arq{{color:{CINZA};font-size:7.8pt}}

/* sumário */
.sumario{{list-style:none;columns:2;column-gap:14mm}}
.sumario li{{display:flex;gap:4mm;align-items:baseline;padding:2.6mm 0;
  border-bottom:1px solid {BORDA};break-inside:avoid}}
.sn{{font-family:NR,serif;font-size:9pt;color:{ESMER};width:8mm;flex-shrink:0}}
.st{{font-size:9.5pt;font-weight:600;color:{VERDE};width:44mm;flex-shrink:0}}
.sd{{font-size:8pt;color:{CINZA_CLARO};line-height:1.4}}

/* conceito */
.conc-fig{{display:flex;flex-direction:column;align-items:center;justify-content:center}}
.leg{{list-style:none;margin-top:7mm;width:100%}}
.leg li{{border-top:1px solid {BORDA};padding:2.6mm 0}}
.leg b{{display:block;font-size:8.5pt;color:{VERDE};margin-bottom:.8mm}}
.leg span{{font-size:8pt;color:{CINZA};line-height:1.5}}
.assin{{margin-top:6mm;padding-top:4mm;border-top:1px solid {BORDA};font-size:9pt;
  color:{CINZA}}}
.assin em{{font-family:NR,serif;font-style:italic;color:{VERDE};font-size:10.5pt}}

/* construção */
.constr{{display:grid;grid-template-columns:auto 1fr;gap:14mm;align-items:start}}
.constr-fig{{text-align:center}}
.fig-c{{display:flex;justify-content:center}}

.escala{{display:flex;align-items:flex-end;gap:7mm;margin-top:6mm}}
.esc-i{{text-align:center}}
.esc-b{{display:flex;align-items:flex-end;justify-content:center;height:22mm}}
.esc-i span{{display:block;font-size:7pt;color:{CINZA_CLARO};margin-top:2mm}}

/* logotipo */
.lg-demo{{background:#fff;border:1px solid {BORDA};border-radius:6px;padding:11mm;
  display:flex;justify-content:center;margin-bottom:2mm}}
.comp{{display:flex;gap:10mm;background:#fff;border:1px solid {BORDA};border-radius:6px;
  padding:7mm;justify-content:center;align-items:flex-end}}
.comp-i{{text-align:center}}
.comp-l{{display:block;font-size:7pt;color:{CINZA_CLARO};margin-bottom:3mm;
  letter-spacing:.08em;text-transform:uppercase}}

/* variações */
.vars{{display:grid;grid-template-columns:repeat(3,1fr);gap:7mm}}
.var-p{{border:1px solid {BORDA};border-radius:5px;height:26mm;display:flex;
  align-items:center;justify-content:center;padding:4mm}}
.var-r{{font-size:9pt;font-weight:600;color:{VERDE};margin-top:3mm}}
.var-a{{font-family:ui-monospace,monospace;font-size:7pt;color:{ESMER};margin-top:.8mm}}
.var-n{{font-size:7.8pt;color:{CINZA};line-height:1.5;margin-top:1.6mm}}
.vert{{display:flex;flex-direction:column;align-items:center;gap:3mm}}

/* ícones */
.cx-p{{background:#fff;border:1px solid {BORDA};border-radius:5px;height:44mm;
  display:flex;align-items:center;justify-content:center}}
.cx-t{{font-size:10pt;font-weight:600;color:{VERDE};margin-top:3.5mm}}
.cx-d{{font-size:8pt;color:{CINZA};line-height:1.55;margin-top:1.6mm}}
.icones-real{{margin-top:7mm;padding-top:5mm;border-top:1px solid {BORDA};display:flex;
  align-items:center;gap:9px}}
.ir-l{{font-size:8pt;color:{CINZA_CLARO}}}

/* paleta */
.sws{{display:grid;grid-template-columns:repeat(4,1fr);gap:7mm}}
.sw-c{{height:34mm;border-radius:5px;display:flex;align-items:flex-end;padding:4mm;
  font-family:ui-monospace,monospace;font-size:8pt}}
.sw-n{{font-size:10pt;font-weight:600;color:{VERDE};margin-top:3mm}}
.sw-t{{font-family:ui-monospace,monospace;font-size:7pt;color:{ESMER};margin-top:.8mm}}
.sw-d{{font-size:7.5pt;color:{CINZA};line-height:1.5;margin-top:1.6mm}}
.mns{{display:grid;grid-template-columns:repeat(4,1fr);gap:5mm}}
.mn-c{{height:17mm;border-radius:4px;display:flex;align-items:flex-end;padding:2.5mm;
  font-family:ui-monospace,monospace;font-size:7pt}}
.mn-n{{font-size:8.5pt;font-weight:600;color:{VERDE};margin-top:2mm}}
.mn-t{{font-family:ui-monospace,monospace;font-size:6.6pt;color:{CINZA_CLARO};
  margin-top:.5mm}}

/* tipografia */
.tipo{{background:#fff;border:1px solid {BORDA};border-radius:6px;padding:6mm;
  margin-bottom:5mm}}
.tp-h{{display:flex;align-items:baseline;gap:5mm;margin-bottom:3.5mm;
  border-bottom:1px solid {BORDA};padding-bottom:3mm}}
.tp-n{{font-family:NR,serif;font-size:15pt;font-weight:500;color:{VERDE}}}
.tp-n.sans{{font-family:IT,sans-serif;font-weight:600}}
.tp-u{{font-size:7.5pt;color:{CINZA_CLARO};letter-spacing:.06em;text-transform:uppercase}}
.tp-a{{font-size:25pt;color:{TINTA};margin-bottom:2.5mm;letter-spacing:-.02em}}
.serif{{font-family:NR,serif;font-weight:500}}
.sans{{font-family:IT,sans-serif}}
.tp-s{{font-size:9.5pt;color:{CINZA};letter-spacing:.01em;margin-bottom:3mm}}
.tp-d{{font-size:8.5pt;color:{CINZA};line-height:1.55}}

/* fundos */
.fundos{{display:grid;grid-template-columns:repeat(3,1fr);gap:7mm}}
.fd-p{{border:1px solid {BORDA};border-radius:5px;height:24mm;display:flex;
  align-items:center;justify-content:center}}
.fd-t{{font-size:9.5pt;font-weight:600;color:{VERDE};margin-top:3mm}}
.fd-d{{font-size:8pt;color:{CINZA};line-height:1.5;margin-top:1.4mm}}

/* proibidos */
.prs{{display:grid;grid-template-columns:repeat(5,1fr);gap:5mm}}
.pr-p{{position:relative;background:#fff;border:1px solid {BORDA};border-radius:5px;
  height:27mm;display:flex;align-items:center;justify-content:center;overflow:hidden}}
.pr-x{{position:absolute;top:2mm;right:2.5mm;color:{TERRACOTA};font-size:11pt;
  font-weight:700}}
.pr-t{{font-size:7.6pt;color:{CINZA};line-height:1.45;margin-top:2.4mm}}

/* tom */
.tom td{{font-size:9pt;line-height:1.55;width:50%}}
.tom .ok{{color:{VERDE}}}
.tom .nao{{color:{TERRACOTA};text-decoration:line-through;text-decoration-thickness:1px;
  text-decoration-color:rgba(180,70,60,.35)}}
.tom th.ok{{color:{VERDE}}}
.tom th.nao{{color:{TERRACOTA}}}

.fim{{margin-top:auto;padding-top:6mm;border-top:1px solid {BORDA};display:flex;
  justify-content:space-between;align-items:flex-end}}
.fim span{{font-size:8pt;color:{CINZA_CLARO}}}
"""


def main():
    paginas = [
        p_capa(), p_sumario(), p_conceito(), p_construcao(), p_protecao(),
        p_logotipo(), p_variacoes(), p_icones(), p_paleta(), p_neutros(),
        p_contraste(), p_tipografia(), p_escala(), p_fundos(), p_proibidos(),
        p_tom(), p_arquivos(),
    ]
    html = (f'<!doctype html><html lang="pt-BR"><head><meta charset="utf-8">'
            f"<title>Manual de marca — Transacione</title><style>{css()}</style>"
            f"</head><body>{''.join(paginas)}</body></html>")

    os.makedirs(os.path.dirname(SAIDA_HTML), exist_ok=True)
    with open(SAIDA_HTML, "w", encoding="utf-8") as f:
        f.write(html)

    subprocess.run(
        [CHROME, "--headless=new", "--disable-gpu", "--no-pdf-header-footer",
         f"--print-to-pdf={SAIDA_PDF}", "--virtual-time-budget=20000",
         f"file://{SAIDA_HTML}"],
        check=True, capture_output=True,
    )
    print(f"{SAIDA_PDF}  ({os.path.getsize(SAIDA_PDF) / 1024:.0f} KB, "
          f"{len(paginas)} páginas)")


if __name__ == "__main__":
    if not os.path.exists(CHROME):
        sys.exit("Chrome não encontrado — ajuste a constante CHROME.")
    main()
