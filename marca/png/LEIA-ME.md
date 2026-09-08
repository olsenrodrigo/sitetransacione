# Logos em PNG — Transacione

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
