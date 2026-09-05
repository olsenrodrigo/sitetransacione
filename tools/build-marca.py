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
# O braço do T é uma seta dupla: a transação acontece nos dois sentidos.
#   seta superior : o que a empresa leva ao Fisco
#   seta inferior : o que retorna à empresa
#   haste         : a metodologia que sustenta as duas
# Peso único de 4 unidades; cabeças a 45°, com 8 de altura e 4 de ponta.
SETA_SUP = "M3 4H23V2L27 6L23 10V8H3Z"      # aponta à direita
SETA_INF = "M29 16H9V18L5 14L9 10V12H29Z"   # aponta à esquerda
HASTE    = "M14 16h4v14h-4z"
PARTES   = (SETA_SUP, SETA_INF, HASTE)
SIM_X, SIM_Y, SIM_W, SIM_H = 3, 2, 26, 28   # bounding box do simbolo

CAP = 100.0            # altura de caixa alta do logotipo
SIM_ALTURA = 122.0     # altura do simbolo no lockup
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
    corpo = "".join(f'<path fill="{cor}" d="{d}"/>' for d in PARTES)
    return f'<g{t}>{corpo}</g>'


def simbolo_duotone(cor_base, cor_acento, transform=""):
    """A seta de retorno recebe o acento: é o que volta para a empresa."""
    t = f' transform="{transform}"' if transform else ""
    return (f'<g{t}><path fill="{cor_base}" d="{SETA_SUP}"/>'
            f'<path fill="{cor_acento}" d="{SETA_INF}"/>'
            f'<path fill="{cor_base}" d="{HASTE}"/></g>')


def build(ttf, out_dirs):
    d, wlogo = logotipo(ttf)
    esc = SIM_ALTURA / SIM_H
    simw = SIM_W * esc
    gap = 46
    H = 130
    total = simw + gap + wlogo
    ty = (H - SIM_ALTURA) / 2
    tl = (H - CAP) / 2
    sim_tf = f"translate(0,{ty:.2f}) scale({esc:.4f}) translate({-SIM_X},{-SIM_Y})"

    ativos = {}

    # ---- lockup horizontal (3 versoes de cor + duotone)
    for nome, cb, ca in [("logo-horizontal", VERDE, VERDE),
                         ("logo-horizontal-branco", BRANCO, BRANCO),
                         ("logo-horizontal-grafite", GRAFITE, GRAFITE)]:
        corpo = (simbolo_g(cb, sim_tf) +
                 f'<g transform="translate({simw+gap:.2f},{tl})"><path fill="{ca}" d="{d}"/></g>')
        ativos[f"{nome}.svg"] = svg(f"{total:.1f}", H, corpo)

    corpo = (simbolo_duotone(VERDE, ESMER, sim_tf) +
             f'<g transform="translate({simw+gap:.2f},{tl})"><path fill="{VERDE}" d="{d}"/></g>')
    ativos["logo-horizontal-duotone.svg"] = svg(f"{total:.1f}", H, corpo)

    # ---- lockup vertical
    vsim = 132.0
    vesc = vsim / SIM_H
    vsimw = SIM_W * vesc
    vgap = 40
    VW = max(vsimw, wlogo)
    VH = vsim + vgap + CAP
    corpo = (simbolo_g(VERDE, f"translate({(VW-vsimw)/2:.2f},0) scale({vesc:.4f}) translate({-SIM_X},{-SIM_Y})") +
             f'<g transform="translate({(VW-wlogo)/2:.2f},{vsim+vgap})"><path fill="{VERDE}" d="{d}"/></g>')
    ativos["logo-vertical.svg"] = svg(f"{VW:.1f}", f"{VH:.1f}", corpo)

    # ---- simbolo isolado
    ativos["simbolo.svg"] = svg(32, 32, simbolo_g(VERDE))
    ativos["simbolo-branco.svg"] = svg(32, 32, simbolo_g(BRANCO))
    ativos["simbolo-duotone.svg"] = svg(32, 32, simbolo_duotone(VERDE, ESMER))

    # ---- app icon / favicon (fundo verde, simbolo reverso)
    icon = (f'<rect width="32" height="32" rx="7" fill="{VERDE}"/>'
            + simbolo_g(BRANCO, "translate(16,16) scale(0.66) translate(-16,-16)"))
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
