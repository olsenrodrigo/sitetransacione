import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { Link } from "wouter";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------ Revelar */

/**
 * Entrada suave no scroll. Só opacity/transform — não força layout.
 *
 * O que já está na primeira dobra é marcado como visível antes da primeira
 * pintura (useLayoutEffect), sem animação e sem atraso: conteúdo com
 * opacity 0 não conta para o LCP, e animar a dobra inicial atrasaria a
 * métrica sem ganho perceptível.
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
  const [visivel, setVisivel] = useState(false);
  const [imediato, setImediato] = useState(false);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduzido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const naDobra = el.getBoundingClientRect().top < window.innerHeight * 0.92;

    if (reduzido || naDobra) {
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
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
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
  className,
}: {
  children: ReactNode;
  claro?: boolean;
  className?: string;
}) {
  return (
    <span className={cn("flex items-center gap-3", className)}>
      <span
        aria-hidden="true"
        className="h-px w-7 shrink-0"
        style={{ background: claro ? "#3FD9A0" : "#0E9E6E" }}
      />
      <span
        className="sobrescrita"
        style={{ color: claro ? "#3FD9A0" : "#0E9E6E" }}
      >
        {children}
      </span>
    </span>
  );
}

/* ------------------------------------------------------------- Botões */

type BotaoProps = {
  children: ReactNode;
  href?: string;
  externo?: boolean;
  onClick?: () => void;
  variante?: "primario" | "secundario" | "fantasma" | "claro";
  tamanho?: "md" | "lg";
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
};

const ESTILOS: Record<NonNullable<BotaoProps["variante"]>, string> = {
  primario:
    "bg-verde text-white hover:bg-verde-800 border border-transparent shadow-[0_1px_2px_rgba(10,92,66,0.18)]",
  secundario:
    "bg-transparent text-verde border border-verde/25 hover:border-verde/60 hover:bg-verde/[0.04]",
  fantasma: "bg-transparent text-verde border border-transparent hover:bg-verde/[0.06]",
  claro:
    "bg-esmeralda text-grafite border border-transparent hover:bg-esmeralda-clara font-semibold",
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
    "inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors duration-200",
    "disabled:opacity-55 disabled:pointer-events-none",
    tamanho === "lg" ? "px-7 py-3.5 text-[0.95rem]" : "px-5 py-2.5 text-[0.875rem]",
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
  return (
    <button type={type} onClick={onClick} className={base} disabled={disabled}>
      {children}
    </button>
  );
}

/* --------------------------------------------------------------- Seta */

export function Seta({ className }: { className?: string }) {
  return (
    <svg
      width="14"
      height="14"
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
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ------------------------------------------------------ Cabeçalho de seção */

export function CabecalhoSecao({
  sobrescrita,
  titulo,
  descricao,
  claro = false,
  centro = false,
  className,
}: {
  sobrescrita?: string;
  titulo: ReactNode;
  descricao?: ReactNode;
  claro?: boolean;
  centro?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "max-w-3xl",
        centro && "mx-auto text-center [&>span]:justify-center",
        className,
      )}
    >
      {sobrescrita && (
        <Sobrescrita claro={claro} className="mb-5">
          {sobrescrita}
        </Sobrescrita>
      )}
      <h2 className="titulo-secao">{titulo}</h2>
      {descricao && <p className="corpo mt-4 max-w-2xl">{descricao}</p>}
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
                  className="transition-colors hover:underline"
                  style={{ color: claro ? "#a9bbb4" : "#5a6b64" }}
                >
                  {it.nome}
                </Link>
              )}
              {!ultimo && (
                <span aria-hidden="true" style={{ color: claro ? "#4d5f58" : "#B4BDB8" }}>
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
 * Resposta direta no topo da página. Existe por dois motivos: dá ao leitor
 * a conclusão antes do argumento, e entrega aos modelos de IA um trecho
 * objetivo, autocontido e citável.
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
      className="rounded-lg border-l-2 py-1"
      style={{
        borderColor: claro ? "#3FD9A0" : "#0E9E6E",
        paddingLeft: "1.15rem",
      }}
    >
      <p
        className="fonte-display"
        style={{
          fontSize: "1.075rem",
          lineHeight: 1.6,
          color: claro ? "#dfe9e5" : "#33443d",
        }}
      >
        {children}
      </p>
    </div>
  );
}

/* ---------------------------------------------------------------- Nota */

export function NotaLegal({ children }: { children: ReactNode }) {
  return <p className="nota mt-6 max-w-3xl">{children}</p>;
}
