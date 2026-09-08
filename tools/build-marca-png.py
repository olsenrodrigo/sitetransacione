#!/usr/bin/env python3
"""
Exporta a marca em PNG de alta resolução, para uso de terceiros.

O SVG é a entrega principal — redimensiona sem perda. Estes PNGs existem
porque nem toda ferramenta aceita vetor: apresentação, assinatura de e-mail,
perfil de rede social, gráfica que pede bitmap.

Cada peça sai em três larguras (1x/2x/4x a partir de uma base generosa),
com fundo transparente quando faz sentido, e as versões sobre fundo sólido
para quem precisa aplicar direto.

Uso:  python3 tools/build-marca-png.py
Saída: marca/png/
"""

from __future__ import annotations

import os
import subprocess
import sys

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ASSETS = os.path.join(RAIZ, "marca/assets")
SAIDA = os.path.join(RAIZ, "marca/png")
TMP = os.path.join(RAIZ, ".dados/png")
CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

VERDE = "#0A5C42"
GRAFITE = "#0C1512"
OSSO = "#F7F6F2"

# (arquivo SVG, apelido do PNG, fundo — None = transparente, larguras)
PECAS = [
    ("logo-horizontal.svg", "logo-horizontal-verde", None, (1200, 2400, 4800)),
    ("logo-horizontal-branco.svg", "logo-horizontal-branco", None, (1200, 2400, 4800)),
    ("logo-horizontal-grafite.svg", "logo-horizontal-grafite", None, (1200, 2400, 4800)),
    ("logo-horizontal-esmeralda.svg", "logo-horizontal-esmeralda", None, (1200, 2400, 4800)),
    ("logo-horizontal-duotone.svg", "logo-horizontal-duotone", None, (1200, 2400, 4800)),
    ("logo-vertical.svg", "logo-vertical", None, (900, 1800, 3600)),
    ("simbolo.svg", "simbolo-verde", None, (600, 1200, 2400)),
    ("simbolo-branco.svg", "simbolo-branco", None, (600, 1200, 2400)),
    ("simbolo-esmeralda.svg", "simbolo-esmeralda", None, (600, 1200, 2400)),
    ("simbolo-duotone.svg", "simbolo-duotone", None, (600, 1200, 2400)),
    ("app-icon.svg", "app-icon", None, (512, 1024, 2048)),
    # Versões já aplicadas sobre fundo, para quem não vai compor nada.
    ("logo-horizontal.svg", "fundo/logo-sobre-osso", OSSO, (1200, 2400)),
    ("logo-horizontal-branco.svg", "fundo/logo-sobre-grafite", GRAFITE, (1200, 2400)),
    ("logo-horizontal-branco.svg", "fundo/logo-sobre-verde", VERDE, (1200, 2400)),
]

# Margem em volta da peça, em fração da largura — o mesmo ar do manual.
MARGEM = 0.08


def dimensoes(svg_path: str) -> tuple[float, float]:
    """Lê a proporção do viewBox — os SVGs da marca sempre o declaram."""
    with open(svg_path, encoding="utf-8") as f:
        cab = f.read(400)
    vb = cab.split('viewBox="')[1].split('"')[0].split()
    return float(vb[2]), float(vb[3])


def renderizar(svg_rel: str, apelido: str, fundo: str | None, larguras) -> list[str]:
    svg_path = os.path.join(ASSETS, svg_rel)
    w, h = dimensoes(svg_path)
    with open(svg_path, encoding="utf-8") as f:
        svg = f.read()

    feitos = []
    for larg in larguras:
        cont = larg / (1 + 2 * MARGEM)
        alt = round(cont * h / w + 2 * MARGEM * cont)
        bg = fundo or "transparent"
        html = f"""<!doctype html><meta charset="utf-8"><style>
html,body{{margin:0;padding:0;background:{bg}}}
.c{{width:{larg}px;height:{alt}px;display:flex;align-items:center;
   justify-content:center;background:{bg}}}
.c svg{{width:{cont:.1f}px;height:auto;display:block}}
</style><div class="c">{svg}</div>"""

        os.makedirs(TMP, exist_ok=True)
        tmp_html = os.path.join(TMP, "p.html")
        with open(tmp_html, "w", encoding="utf-8") as f:
            f.write(html)

        destino = os.path.join(SAIDA, f"{apelido}@{larg}.png")
        os.makedirs(os.path.dirname(destino), exist_ok=True)
        cmd = [
            CHROME, "--headless=new", "--disable-gpu", "--hide-scrollbars",
            f"--window-size={larg},{alt}", "--virtual-time-budget=4000",
            f"--screenshot={destino}", f"file://{tmp_html}",
        ]
        if fundo is None:
            cmd.insert(4, "--default-background-color=00000000")
        subprocess.run(cmd, check=True, capture_output=True)
        feitos.append(destino)
    return feitos


def leiame():
    return """# Logos em PNG — Transacione

Exportações de alta resolução, para quando a ferramenta de destino não aceita
vetor. **Sempre que puder, use o SVG em `../assets/`** — ele redimensiona sem
perda e é a entrega principal.

## Como escolher

| Situação | Arquivo |
|---|---|
| Fundo claro | `logo-horizontal-verde@*.png` |
| Fundo escuro ou fotografia | `logo-horizontal-branco@*.png` |
| Impressão sem cor | `logo-horizontal-grafite@*.png` |
| Espaço quadrado, avatar | `logo-vertical@*.png` |
| Ícone de aplicativo | `app-icon@*.png` |
| Já aplicado sobre fundo | `fundo/` |

O número após o `@` é a largura em pixels. Escolha pelo tamanho final de uso:
para um logo exibido a 300 px, pegue o `@1200` — a folga cobre telas de alta
densidade e reduções.

## Fundo

Todos os arquivos fora da pasta `fundo/` têm **fundo transparente**. Ao colocar
a versão verde sobre fundo escuro, ou a branca sobre claro, a marca desaparece —
confira o contraste antes.

## Margem

Cada PNG já traz a área de proteção da marca (8% da largura em cada lado). Não é
preciso adicionar espaço; também não corte o que já está aí.

## Regerar

```bash
python3 tools/build-marca.py Newsreader.ttf   # SVGs, a partir da geometria
python3 tools/build-marca-png.py              # estes PNGs, a partir dos SVGs
```
"""


def main():
    total = []
    for svg, apelido, fundo, larguras in PECAS:
        total += renderizar(svg, apelido, fundo, larguras)
        print(f"  {apelido:<34} {len(larguras)} tamanhos")

    with open(os.path.join(SAIDA, "LEIA-ME.md"), "w", encoding="utf-8") as f:
        f.write(leiame())

    peso = sum(os.path.getsize(p) for p in total) / 1024 / 1024
    print(f"\n{len(total)} PNGs em marca/png/ ({peso:.1f} MB)")


if __name__ == "__main__":
    if not os.path.exists(CHROME):
        sys.exit("Chrome não encontrado — ajuste a constante CHROME.")
    main()
