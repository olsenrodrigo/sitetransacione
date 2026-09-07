/**
 * Marca Transacione — componentes oficiais.
 *
 * O braço do T é UMA seta de duas pontas, fundida à haste numa peça só:
 * a transação acontece nos dois sentidos, e a metodologia sustenta as duas.
 * Contorno único sobre grade 32×32, caixa de 24×24 centrada em (16, 16).
 *
 * No logotipo, o símbolo NÃO acompanha a palavra — ele É a letra T de
 * "Transacione". Por isso o lockup é o símbolo seguido de "ransacione".
 *
 * A mesma geometria está em tools/build-marca.py, que gera os arquivos
 * distribuíveis em marca/assets. Alterar aqui exige regerar lá.
 */

const SIMBOLO =
  "M4 8 L8 4 L8 6 L24 6 L24 4 L28 8 L24 12 L24 10 " +
  "L18 10 L18 28 L14 28 L14 10 L8 10 L8 12 Z";

/** Braço isolado — usado só na versão duotone, sobreposto ao símbolo. */
const BRACO = "M4 8 L8 4 L8 6 L24 6 L24 4 L28 8 L24 12 L24 10 L8 10 L8 12 Z";

/* Métricas da Newsreader, medidas do arquivo da fonte. */
const CAP_EM = 0.67; // altura de caixa alta ÷ em
const FOLGA = 1.03; // símbolo 3% acima da caixa alta: a forma geométrica
//                     pesa opticamente menos que a serifada
const GAP_CAP = 0.07; // espaço até o "r", em frações da caixa alta

type Variante = "verde" | "branco" | "grafite" | "esmeralda" | "duotone";

const CORES: Record<Variante, { base: string; acento?: string }> = {
  verde: { base: "#0A5C42" },
  branco: { base: "#FFFFFF" },
  grafite: { base: "#0C1512" },
  esmeralda: { base: "#0E9E6E" },
  duotone: { base: "#0A5C42", acento: "#0E9E6E" },
};

/**
 * Símbolo isolado, com a margem de proteção incluída no viewBox.
 * Use quando a marca aparece sozinha — favicon, marca d'água, selo.
 */
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
 * Lockup horizontal — o símbolo ocupa o lugar da letra T.
 *
 * O viewBox recortado na caixa do símbolo (4 4 24 24) faz a base do SVG
 * coincidir com a base da letra, então o alinhamento por baseline encaixa
 * o símbolo na linha do texto sem nenhum ajuste manual.
 */
export function Logo({
  variante = "verde",
  altura = 30,
  className,
}: {
  /** Cor da marca. */
  variante?: Variante;
  /** Tamanho da fonte do logotipo, em pixels. */
  altura?: number;
  className?: string;
}) {
  const c = CORES[variante];
  const sim = altura * CAP_EM * FOLGA;

  return (
    <span
      className={`inline-flex items-baseline whitespace-nowrap ${className ?? ""}`}
      role="img"
      aria-label="Transacione"
    >
      <svg
        viewBox="4 4 24 24"
        width={sim}
        height={sim}
        aria-hidden="true"
        focusable="false"
        style={{ marginRight: altura * CAP_EM * GAP_CAP }}
      >
        <path fill={c.base} d={SIMBOLO} />
        {c.acento && <path fill={c.acento} d={BRACO} />}
      </svg>
      <span
        className="fonte-display"
        aria-hidden="true"
        style={{
          color: c.base,
          fontSize: altura,
          fontWeight: 500,
          letterSpacing: "-0.012em",
          lineHeight: 1,
        }}
      >
        ransacione
      </span>
    </span>
  );
}
