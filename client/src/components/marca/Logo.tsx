/**
 * Marca Transacione — componentes oficiais.
 *
 * O braço do T é UMA seta de duas pontas, fundida à haste numa peça só:
 * a transação acontece nos dois sentidos, e a metodologia sustenta as duas.
 * Contorno único sobre grade 32×32, caixa de 24×24 centrada em (16, 16).
 *
 * A mesma geometria está em tools/build-marca.py, que gera os arquivos
 * distribuíveis em marca/assets. Alterar aqui exige regerar lá.
 */

const SIMBOLO =
  "M4 8 L8 4 L8 6 L24 6 L24 4 L28 8 L24 12 L24 10 " +
  "L18 10 L18 28 L14 28 L14 10 L8 10 L8 12 Z";

/** Braço isolado — usado só na versão duotone, sobreposto ao símbolo. */
const BRACO = "M4 8 L8 4 L8 6 L24 6 L24 4 L28 8 L24 12 L24 10 L8 10 L8 12 Z";

type Variante = "verde" | "branco" | "grafite" | "duotone";

const CORES: Record<Variante, { base: string; acento?: string }> = {
  verde: { base: "#0A5C42" },
  branco: { base: "#FFFFFF" },
  grafite: { base: "#0C1512" },
  duotone: { base: "#0A5C42", acento: "#0E9E6E" },
};

export function Simbolo({
  variante = "verde",
  tamanho = 32,
  className,
}: {
  variante?: Variante;
  tamanho?: number;
  className?: string;
}) {
  const c = CORES[variante];
  return (
    <svg
      viewBox="0 0 32 32"
      width={tamanho}
      height={tamanho}
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <path fill={c.base} d={SIMBOLO} />
      {c.acento && <path fill={c.acento} d={BRACO} />}
    </svg>
  );
}

/**
 * Lockup horizontal. O símbolo é vetorial; o logotipo usa a Newsreader
 * carregada pelo próprio site — a marca fica nítida em qualquer densidade
 * de tela sem custo adicional de rede.
 */
export function Logo({
  variante = "verde",
  altura = 30,
  className,
}: {
  variante?: Variante;
  altura?: number;
  className?: string;
}) {
  const c = CORES[variante];
  return (
    <span
      className={`inline-flex items-center ${className ?? ""}`.trim()}
      style={{ gap: altura * 0.3 }}
    >
      <Simbolo variante={variante} tamanho={altura * 1.05} />
      <span
        className="fonte-display"
        style={{
          color: c.base,
          fontSize: altura,
          fontWeight: 500,
          letterSpacing: "-0.012em",
          lineHeight: 1,
          paddingBottom: altura * 0.03,
        }}
      >
        Transacione
      </span>
    </span>
  );
}
