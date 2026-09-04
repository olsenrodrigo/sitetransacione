import type { ReactNode } from "react";
import { Migalhas, Revelar, Sobrescrita, BlocoResposta } from "./primitivas";

export default function HeroPagina({
  sobrescrita,
  titulo,
  resumo,
  migalhas,
  acoes,
  base,
}: {
  sobrescrita: string;
  titulo: ReactNode;
  resumo: string;
  migalhas: { nome: string; path: string }[];
  acoes?: ReactNode;
  base?: string;
}) {
  return (
    <section className="relative overflow-hidden pb-14 pt-28 md:pb-18 md:pt-36">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ background: "linear-gradient(170deg, #FFFFFF 0%, #F7F6F2 58%)" }}
      />
      <div
        aria-hidden="true"
        className="grade-fina pointer-events-none absolute inset-0 opacity-50"
        style={{
          maskImage: "radial-gradient(ellipse 70% 80% at 78% 8%, #000 0%, transparent 70%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 70% 80% at 78% 8%, #000 0%, transparent 70%)",
        }}
      />

      <div className="container-t relative">
        <Revelar>
          <Migalhas itens={migalhas} />
          <Sobrescrita>{sobrescrita}</Sobrescrita>
          <h1
            className="fonte-display mt-5 max-w-4xl"
            style={{
              fontSize: "clamp(1.95rem, 1.25rem + 2.8vw, 3.3rem)",
              lineHeight: 1.1,
              letterSpacing: "-0.022em",
              fontWeight: 500,
            }}
          >
            {titulo}
          </h1>
        </Revelar>

        <Revelar atraso={80}>
          <div className="mt-8 max-w-3xl">
            <BlocoResposta>{resumo}</BlocoResposta>
          </div>
        </Revelar>

        {acoes && (
          <Revelar atraso={140}>
            <div className="mt-9 flex flex-wrap gap-3">{acoes}</div>
          </Revelar>
        )}

        {base && (
          <Revelar atraso={180}>
            <p className="nota mt-8">{base}</p>
          </Revelar>
        )}
      </div>
    </section>
  );
}
