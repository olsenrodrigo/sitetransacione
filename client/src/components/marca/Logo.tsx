/**
 * Marca Transacione — componentes oficiais.
 *
 * O braço do T é uma seta dupla, sobre grade exata de 32×32:
 *   seta superior → o que a empresa leva ao Fisco
 *   seta inferior → o que retorna à empresa
 *   haste         → a metodologia que sustenta as duas
 *
 * A mesma geometria está em tools/build-marca.py, que gera os arquivos
 * distribuíveis em marca/assets. Alterar aqui exige regerar lá.
 */

const SETA_SUP = "M3 4H23V2L27 6L23 10V8H3Z";
const SETA_INF = "M29 16H9V18L5 14L9 10V12H29Z";
const HASTE = "M14 16h4v14h-4z";

type Variante = "verde" | "branco" | "grafite" | "duotone";

const CORES: Record<Variante, { base: string; acento: string }> = {
  verde: { base: "#0A5C42", acento: "#0A5C42" },
  branco: { base: "#FFFFFF", acento: "#FFFFFF" },
  grafite: { base: "#0C1512", acento: "#0C1512" },
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
      <path fill={c.base} d={SETA_SUP} />
      <path fill={c.acento} d={SETA_INF} />
      <path fill={c.base} d={HASTE} />
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
      className={`inline-flex items-center ${className ?? ""}`}
      style={{ gap: altura * 0.36 }}
    >
      <Simbolo variante={variante} tamanho={altura * 1.18} />
      <span
        className="fonte-display"
        style={{
          color: c.base,
          fontSize: altura * 0.98,
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
