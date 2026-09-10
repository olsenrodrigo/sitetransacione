import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { Link } from "wouter";
import { SITE } from "@shared/seo";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------ Revelar */

/**
 * Entrada suave no scroll. Só opacity/transform — não força layout.
 *
 * O que já está na primeira dobra é marcado como visível antes da primeira
 * pintura (useLayoutEffect), sem animação: conteúdo com opacity 0 não conta
 * para o LCP, e animar a dobra inicial atrasaria a métrica sem ganho.
 */
export function Revelar({
  children,
  atraso = 0,
  className,
  as: Tag = "div",
}: {
  children: ReactNode;
  atraso?: number;
  className?: string;
  as?: "div" | "section" | "li" | "article";
}) {
  const ref = useRef<HTMLElement>(null);
  const [visivel, setVisivel] = useState(true);
  const [imediato, setImediato] = useState(false);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduzido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const naDobra = el.getBoundingClientRect().top < window.innerHeight * 0.92;

    if (reduzido || naDobra || !("IntersectionObserver" in window)) {
      setImediato(true);
      setVisivel(true);
      return;
    }

    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisivel(true);
          obs.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.06 },
    );
    setVisivel(false);
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <Tag
      ref={ref as never}
      className={cn("revelar", className)}
      data-visivel={visivel}
      style={imediato ? undefined : { transitionDelay: `${atraso}ms` }}
    >
      {children}
    </Tag>
  );
}

/* ---------------------------------------------------------- Sobrescrita */

export function Sobrescrita({
  children,
  claro = false,
  centro = false,
  className,
}: {
  children: ReactNode;
  claro?: boolean;
  centro?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn("flex items-center gap-3", centro && "justify-center", className)}
    >
      <span
        aria-hidden="true"
        className="h-px w-7 shrink-0"
        style={{ background: claro ? "#3FD9A0" : "#0E9E6E" }}
      />
      <span className="sobrescrita" style={{ color: claro ? "#3FD9A0" : "#0E9E6E" }}>
        {children}
      </span>
      {centro && (
        <span
          aria-hidden="true"
          className="h-px w-7 shrink-0"
          style={{ background: claro ? "#3FD9A0" : "#0E9E6E" }}
        />
      )}
    </span>
  );
}

/* ------------------------------------------------------------- Botões */

type BotaoProps = {
  children: ReactNode;
  href?: string;
  externo?: boolean;
  onClick?: () => void;
  variante?: "primario" | "esmeralda" | "contorno" | "contorno-claro" | "fantasma";
  tamanho?: "md" | "lg";
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
};

const ESTILOS: Record<NonNullable<BotaoProps["variante"]>, string> = {
  primario: "bg-verde text-white hover:bg-verde-800 border border-transparent",
  esmeralda:
    "bg-esmeralda text-grafite hover:bg-esmeralda-clara border border-transparent font-semibold",
  contorno:
    "bg-transparent text-verde border border-verde/25 hover:border-verde/60 hover:bg-verde/[0.04]",
  "contorno-claro":
    "bg-transparent text-white border border-white/25 hover:border-white/55 hover:bg-white/[0.06]",
  fantasma: "bg-transparent text-verde border border-transparent hover:bg-verde/[0.06]",
};

export function Botao({
  children,
  href,
  externo,
  onClick,
  variante = "primario",
  tamanho = "md",
  className,
  type = "button",
  disabled,
}: BotaoProps) {
  const base = cn(
    "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors duration-200",
    "disabled:pointer-events-none disabled:opacity-55",
    tamanho === "lg" ? "px-7 py-4 text-[0.98rem]" : "px-5 py-2.5 text-[0.875rem]",
    ESTILOS[variante],
    className,
  );

  if (href && externo)
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={base}>
        {children}
      </a>
    );
  if (href)
    return (
      <Link href={href} className={base}>
        {children}
      </Link>
    );
  // O contato continua acessível enquanto o JavaScript baixa ou se for bloqueado.
  if (onClick && type === "button" && !disabled)
    return (
      <a href={`mailto:${SITE.email}`} className={base} onClick={(event) => {
        event.preventDefault();
        onClick();
      }}>
        {children}
      </a>
    );
  return (
    <button type={type} onClick={onClick} className={base} disabled={disabled}>
      {children}
    </button>
  );
}

/* --------------------------------------------------------------- Ícones */

export function Seta({ className }: { className?: string }) {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M3 8h10m0 0-4-4m4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Marcador({ className }: { className?: string }) {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className={cn("shrink-0", className)}
    >
      <path
        d="M3 8.4l3.1 3.1L13 4.6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ---------------------------------------------- Abertura de faixa ---- */

/**
 * Abre uma faixa: sobrescrita, afirmação e a linha de resposta.
 * Centrada por padrão — a coluna estreita concentra a leitura.
 */
export function Abertura({
  sobrescrita,
  titulo,
  resposta,
  claro = false,
  alinhamento = "centro",
  className,
}: {
  sobrescrita?: string;
  titulo: ReactNode;
  resposta?: ReactNode;
  claro?: boolean;
  alinhamento?: "centro" | "esquerda";
  className?: string;
}) {
  const centro = alinhamento === "centro";
  return (
    <div className={cn(centro && "text-center", className)}>
      {sobrescrita && (
        <Sobrescrita claro={claro} centro={centro} className="mb-6">
          {sobrescrita}
        </Sobrescrita>
      )}
      <h2 className="afirmacao">{titulo}</h2>
      {resposta && (
        <p className={cn("corpo mt-6", centro && "mx-auto max-w-2xl")}>{resposta}</p>
      )}
    </div>
  );
}

/* ------------------------------------------------------------- Migalhas */

export function Migalhas({
  itens,
  claro = false,
}: {
  itens: { nome: string; path: string }[];
  claro?: boolean;
}) {
  return (
    <nav aria-label="Você está aqui" className="mb-7">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.72rem]">
        {itens.map((it, i) => {
          const ultimo = i === itens.length - 1;
          return (
            <li key={it.path} className="flex items-center gap-2">
              {ultimo ? (
                <span style={{ color: claro ? "#8AA098" : "#606E67" }}>{it.nome}</span>
              ) : (
                <Link
                  href={it.path}
                  className="-my-1 inline-block py-1 transition-colors hover:underline"
                  style={{ color: claro ? "#A9BBB4" : "#5A6B64" }}
                >
                  {it.nome}
                </Link>
              )}
              {!ultimo && (
                <span aria-hidden="true" style={{ color: claro ? "#4D5F58" : "#B4BDB8" }}>
                  /
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/* ------------------------------------------------------ Bloco de resposta */

/**
 * Resposta direta. Existe por dois motivos: dá ao leitor a conclusão antes
 * do argumento, e entrega aos modelos de IA um trecho objetivo e citável.
 */
export function BlocoResposta({
  children,
  claro = false,
}: {
  children: ReactNode;
  claro?: boolean;
}) {
  return (
    <div
      className="border-l-2 py-1 pl-5"
      style={{ borderColor: claro ? "#3FD9A0" : "#0E9E6E" }}
    >
      <p
        className="fonte-display"
        style={{
          fontSize: "1.1rem",
          lineHeight: 1.62,
          color: claro ? "#DFE9E5" : "#33443D",
        }}
      >
        {children}
      </p>
    </div>
  );
}

export function NotaLegal({
  children,
  centro = false,
}: {
  children: ReactNode;
  centro?: boolean;
}) {
  return (
    <p className={cn("nota mt-8", centro && "mx-auto max-w-2xl text-center")}>
      {children}
    </p>
  );
}

/* ------------------------------------------------------------- Indicador */

export function Indicador({
  valor,
  unidade,
  rotulo,
  claro = false,
}: {
  valor: string;
  unidade?: string;
  rotulo: string;
  claro?: boolean;
}) {
  return (
    <div>
      <p
        className="numeral text-[2.6rem] md:text-[3rem]"
        style={{ color: claro ? "#fff" : "#0A5C42" }}
      >
        {valor}
        {unidade && (
          <span
            className="text-[1rem] md:text-[1.1rem]"
            style={{ color: claro ? "#3FD9A0" : "#0E9E6E" }}
          >
            {" "}
            {unidade}
          </span>
        )}
      </p>
      <p className="corpo-sm mt-3 text-[0.86rem]">{rotulo}</p>
    </div>
  );
}
