import { useState } from "react";
import type { Socio } from "@/data/site";
import { cn } from "@/lib/utils";

/**
 * Retrato do sócio. Enquanto a imagem não carrega — ou se ela falhar —
 * mostra o monograma sobre o gradiente da marca, para a página nunca
 * exibir um buraco no lugar da pessoa.
 */
export default function Retrato({
  socio,
  tamanho = 56,
  className,
}: {
  socio: Pick<Socio, "nome" | "iniciais" | "foto">;
  tamanho?: number;
  className?: string;
}) {
  const [falhou, setFalhou] = useState(false);

  return (
    <span
      className={cn("relative block shrink-0 overflow-hidden rounded-xl", className)}
      style={{
        width: tamanho,
        height: tamanho,
        background:
          "linear-gradient(150deg, rgba(14,158,110,0.92) 0%, rgba(10,92,66,0.92) 100%)",
      }}
    >
      <span
        aria-hidden="true"
        className="fonte-display absolute inset-0 flex items-center justify-center text-white"
        style={{ fontSize: tamanho * 0.32, fontWeight: 500 }}
      >
        {socio.iniciais}
      </span>

      {!falhou && (
        <img
          src={socio.foto}
          alt={socio.nome}
          width={tamanho}
          height={tamanho}
          loading="lazy"
          decoding="async"
          onError={() => setFalhou(true)}
          className="relative h-full w-full object-cover"
          style={{ objectPosition: "center 22%" }}
        />
      )}
    </span>
  );
}
