/**
 * Marca Transacione — componentes oficiais.
 *
 * O símbolo é geometria exata sobre grade 32×32:
 *   barra superior  → o passivo como está
 *   barra inferior  → o mesmo passivo, reclassificado (50% da largura)
 *   haste           → a metodologia que sustenta as duas
 *
 * Os mesmos caminhos estão em tools/build-marca.py, que gera os arquivos
 * distribuíveis em marca/assets. Alterar aqui exige regerar lá.
 */

const BARRA_SUP = "M4 5h24v4H4z";
const BARRA_INF = "M10 11h12v4H10z";
const HASTE = "M14 5h4v22h-4z";

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
      <path fill={c.base} d={BARRA_SUP} />
      <path fill={c.acento} d={BARRA_INF} />
      <path fill={c.base} d={HASTE} />
    </svg>
  );
}

/**
 * Lockup horizontal. O símbolo é vetorial; o logotipo usa a Newsreader
 * carregada pelo próprio site — o que mantém a marca nítida em qualquer
 * densidade de tela sem custo adicional de rede.
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
      style={{ gap: altura * 0.42 }}
    >
      <Simbolo variante={variante} tamanho={altura} />
      <span
        className="fonte-display"
        style={{
          color: c.base,
          fontSize: altura * 0.92,
          fontWeight: 500,
          letterSpacing: "-0.012em",
          lineHeight: 1,
          paddingBottom: altura * 0.04,
        }}
      >
        Transacione
      </span>
    </span>
  );
}
