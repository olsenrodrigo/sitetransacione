import { JORNADA, CONTINUIDADE } from "@shared/jornada";

/** HTML visível desde a resposta inicial, inclusive sem JavaScript. */
export default function Jornada({ claro = false, detalhada = false }: { claro?: boolean; detalhada?: boolean }) {
  return (
    <div data-jornada>
      <ol aria-label="Os quatro ciclos da gestão do passivo" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {JORNADA.map((etapa, i) => (
          <li key={etapa.numero} className={`relative rounded-xl border p-5 text-left md:p-6 ${claro ? "border-white/15 bg-white/[0.04]" : "border-borda bg-white"}`}>
            <div className={`flex items-center justify-between ${claro ? "text-esmeralda-clara" : "text-esmeralda"}`}>
              <span className="numeral text-sm">{etapa.numero}</span>
              <span aria-hidden="true" className="text-xl">{i === 3 ? "↺" : "→"}</span>
            </div>
            <h3 className={`mt-4 fonte-display text-[1.15rem] leading-snug ${claro ? "text-white" : "text-verde"}`}>{etapa.titulo}</h3>
            <p className={`mt-3 text-[0.87rem] leading-relaxed ${claro ? "text-[#C6D3CE]" : "text-cinza"}`}>{detalhada ? etapa.detalhe : etapa.resumo}</p>
          </li>
        ))}
      </ol>
      <p className={`mt-5 text-sm leading-relaxed ${claro ? "text-[#C6D3CE]" : "text-cinza"}`}>
        <span aria-hidden="true" className={`mr-2 ${claro ? "text-esmeralda-clara" : "text-esmeralda"}`}>↺</span>
        {CONTINUIDADE}
      </p>
    </div>
  );
}
