import type { ReactNode } from "react";
import { Simbolo } from "@/components/marca/Logo";
import { Migalhas, Revelar, Sobrescrita, BlocoResposta } from "./primitivas";

/**
 * Abertura das páginas internas: mesma faixa escura da home, em altura
 * reduzida. Mantém o ritmo claro-escuro em toda a navegação.
 */
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
    <section className="faixa-escura relative overflow-hidden pb-20 pt-32 md:pb-24 md:pt-40">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 top-0 opacity-[0.035] md:right-0"
      >
        <Simbolo variante="branco" tamanho={420} />
      </div>
      <div
        aria-hidden="true"
        className="halo"
        style={{ width: 460, height: 460, left: "10%", top: "-10%" }}
      />

      <div className="coluna-larga relative">
        <Revelar>
          <Migalhas itens={migalhas} claro />
          <Sobrescrita claro>{sobrescrita}</Sobrescrita>
          <h1 className="afirmacao mt-6 max-w-4xl">{titulo}</h1>
        </Revelar>

        <Revelar atraso={80}>
          <div className="mt-9 max-w-3xl">
            <BlocoResposta claro>{resumo}</BlocoResposta>
          </div>
        </Revelar>

        {acoes && (
          <Revelar atraso={140}>
            <div className="mt-10 flex flex-wrap gap-3">{acoes}</div>
          </Revelar>
        )}

        {base && (
          <Revelar atraso={180}>
            <p className="nota mt-9">{base}</p>
          </Revelar>
        )}
      </div>
    </section>
  );
}
