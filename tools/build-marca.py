#!/usr/bin/env python3
"""
Gerador dos ativos oficiais da marca Transacione.

Constroi o simbolo por geometria exata (grade 32x32) e o logotipo a partir
dos contornos vetoriais da Newsreader — sem dependencia de fonte no destino.

Uso:  python3 tools/build-marca.py <caminho-Newsreader.ttf>
Saida: marca/assets/ e client/public/marca/
"""
import os, sys, shutil
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.misc.transform import Transform

# ---------------------------------------------------------------- paleta
VERDE   = "#0A5C42"   # Verde Profundo
ESMER   = "#0E9E6E"   # Esmeralda
GRAFITE = "#0C1512"   # Grafite
BRANCO  = "#FFFFFF"
OSSO    = "#F7F6F2"

# ------------------------------------------------- simbolo (grade 32x32)
# O braço do T é UMA seta de duas pontas, fundida à haste numa peça só:
# a transação acontece nos dois sentidos, e a metodologia sustenta as duas.
# Contorno único, percorrido no sentido horário a partir da ponta esquerda.
# Peso 4 · cabeças de 8 de altura e 4 de projeção (45°) · caixa 24x24.
SIMBOLO = (
    "M4 8 L8 4 L8 6 L24 6 L24 4 L28 8 L24 12 L24 10 "
    "L18 10 L18 28 L14 28 L14 10 L8 10 L8 12 Z"
)
# Braço isolado — usado só na versão duotone, sobreposto ao símbolo.
BRACO = "M4 8 L8 4 L8 6 L24 6 L24 4 L28 8 L24 12 L24 10 L8 10 L8 12 Z"
SIM_X, SIM_Y, SIM_W, SIM_H = 4, 4, 24, 24   # bounding box do simbolo

CAP = 100.0            # altura de caixa alta do logotipo
# O simbolo E a letra T da palavra: mesma altura de caixa alta (com 3% de
# folga optica, porque a forma geometrica pesa menos que a serifada) e um
# espaco curto ate o "r", como se fosse mais uma letra.
SIM_ALTURA = CAP * 1.03
GAP_LETRA = CAP * 0.07
TRACKING = -0.012


def logotipo(ttf, texto="Transacione", wght=500, opsz=36):
    f = instancer.instantiateVariableFont(TTFont(ttf), {"wght": wght, "opsz": opsz})
    gs, cmap, hmtx = f.getGlyphSet(), f.getBestCmap(), f["hmtx"]
    cap = f["OS/2"].sCapHeight or 700
    s = CAP / cap
    x, partes = 0.0, []
    for ch in texto:
        g = cmap[ord(ch)]
        pen = SVGPathPen(gs, ntos=lambda v: f"{v:.2f}")
        gs[g].draw(TransformPen(pen, Transform().translate(x, CAP).scale(s, -s)))
        if pen.getCommands():
            partes.append(pen.getCommands())
        x += hmtx[g][0] * s + TRACKING * CAP
    return " ".join(partes), x - TRACKING * CAP


def svg(vb_w, vb_h, corpo, fundo=None):
    bg = f'<rect width="100%" height="100%" fill="{fundo}"/>' if fundo else ""
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {vb_w} {vb_h}" '
            f'width="{vb_w}" height="{vb_h}" role="img" aria-label="Transacione">'
            f'{bg}{corpo}</svg>')


def simbolo_g(cor, transform=""):
    t = f' transform="{transform}"' if transform else ""
    return f'<g{t}><path fill="{cor}" d="{SIMBOLO}"/></g>'


def simbolo_duotone(cor_base, cor_acento, transform=""):
    """A seta recebe o acento; a haste, a cor institucional."""
    t = f' transform="{transform}"' if transform else ""
    return (f'<g{t}><path fill="{cor_base}" d="{SIMBOLO}"/>'
            f'<path fill="{cor_acento}" d="{BRACO}"/></g>')


def build(ttf, out_dirs):
    # "ransacione" — o T vem do simbolo.
    d, wlogo = logotipo(ttf, "ransacione")
    esc = SIM_ALTURA / SIM_H
    simw = SIM_W * esc
    H = 130
    total = simw + GAP_LETRA + wlogo
    topo = (H - CAP) / 2
    # base do simbolo na linha de base do texto
    sim_tf = (f"translate(0,{topo + CAP - SIM_ALTURA:.2f}) scale({esc:.4f}) "
              f"translate({-SIM_X},{-SIM_Y})")
    txt_tf = f"translate({simw + GAP_LETRA:.2f},{topo:.2f})"

    ativos = {}

    # ---- lockup horizontal
    for nome, cor in [("logo-horizontal", VERDE),
                      ("logo-horizontal-branco", BRANCO),
                      ("logo-horizontal-grafite", GRAFITE),
                      ("logo-horizontal-esmeralda", ESMER)]:
        corpo = (simbolo_g(cor, sim_tf) +
                 f'<g transform="{txt_tf}"><path fill="{cor}" d="{d}"/></g>')
        ativos[f"{nome}.svg"] = svg(f"{total:.1f}", H, corpo)

    corpo = (simbolo_duotone(VERDE, ESMER, sim_tf) +
             f'<g transform="{txt_tf}"><path fill="{VERDE}" d="{d}"/></g>')
    ativos["logo-horizontal-duotone.svg"] = svg(f"{total:.1f}", H, corpo)

    # ---- lockup vertical: simbolo acima, palavra inteira abaixo
    d_full, w_full = logotipo(ttf, "Transacione")
    # símbolo dominante: é ele que carrega a leitura quando a palavra vai abaixo
    vsim = 200.0
    vesc = vsim / SIM_H
    vsimw = SIM_W * vesc
    vgap = 44
    VW = max(vsimw, w_full)
    VH = vsim + vgap + CAP
    corpo = (simbolo_g(VERDE, f"translate({(VW-vsimw)/2:.2f},0) scale({vesc:.4f}) "
                              f"translate({-SIM_X},{-SIM_Y})") +
             f'<g transform="translate({(VW-w_full)/2:.2f},{vsim+vgap})">'
             f'<path fill="{VERDE}" d="{d_full}"/></g>')
    ativos["logo-vertical.svg"] = svg(f"{VW:.1f}", f"{VH:.1f}", corpo)

    # ---- simbolo isolado
    ativos["simbolo.svg"] = svg(32, 32, simbolo_g(VERDE))
    ativos["simbolo-branco.svg"] = svg(32, 32, simbolo_g(BRANCO))
    ativos["simbolo-esmeralda.svg"] = svg(32, 32, simbolo_g(ESMER))
    ativos["simbolo-duotone.svg"] = svg(32, 32, simbolo_duotone(VERDE, ESMER))

    # ---- app icon / favicon (fundo verde, simbolo reverso)
    icon = (f'<rect width="32" height="32" rx="7" fill="{VERDE}"/>'
            + simbolo_g(BRANCO, "translate(16,16) scale(0.72) translate(-16,-16)"))
    ativos["favicon.svg"] = svg(32, 32, icon)
    ativos["app-icon.svg"] = svg(32, 32, icon)

    for od in out_dirs:
        os.makedirs(od, exist_ok=True)
        for nome, conteudo in ativos.items():
            open(os.path.join(od, nome), "w").write(conteudo)
    return list(ativos)


if __name__ == "__main__":
    ttf = sys.argv[1]
    raiz = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    feitos = build(ttf, [os.path.join(raiz, "marca/assets"),
                         os.path.join(raiz, "client/public/marca")])
    # favicon na raiz do public
    shutil.copy(os.path.join(raiz, "client/public/marca/favicon.svg"),
                os.path.join(raiz, "client/public/favicon.svg"))
    print("\n".join(feitos))
