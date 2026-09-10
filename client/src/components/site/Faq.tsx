import type { FaqItem } from "@shared/seo";
import { Abertura, Revelar } from "./primitivas";
import { cn } from "@/lib/utils";

function Item({ item, indice, claro }: { item: FaqItem; indice: number; claro?: boolean }) {
  return (
    <details open={indice === 0} className="group border-b" style={{ borderColor: claro ? "#24332D" : "#E3E6E1" }}>
      <summary className="flex w-full cursor-pointer list-none items-start justify-between gap-6 py-6 text-left">
        <span className="fonte-display text-[1.08rem] leading-snug md:text-[1.18rem]"
          style={{ color: claro ? "#fff" : "#0A5C42", fontWeight: 500 }}>
          {item.pergunta}
        </span>
        <span aria-hidden="true" className="mt-1.5 shrink-0 transition-transform duration-300 group-open:rotate-45">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 2v12M2 8h12" stroke={claro ? "#3FD9A0" : "#0E9E6E"} strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </span>
      </summary>
      <div className="pb-7 pr-8"><p className="corpo-sm">{item.resposta}</p></div>
    </details>
  );
}

export default function Faq({
  itens,
  titulo = "Perguntas frequentes",
  sobrescrita = "Dúvidas objetivas",
  resposta,
  claro = false,
  fundo = "faixa-clara",
}: {
  itens: FaqItem[];
  titulo?: string;
  sobrescrita?: string;
  resposta?: string;
  claro?: boolean;
  fundo?: string;
}) {

  return (
    <section className={cn(fundo, "faixa")}>
      <div className="coluna">
        <Revelar>
          <Abertura
            claro={claro}
            sobrescrita={sobrescrita}
            titulo={titulo}
            resposta={resposta}
          />
        </Revelar>
        <Revelar atraso={80}>
          <div
            className="mt-12 border-t"
            style={{ borderColor: claro ? "#24332D" : "#E3E6E1" }}
          >
            {itens.map((item, i) => (
              <Item
                key={item.pergunta}
                item={item}
                indice={i}
                claro={claro}
              />
            ))}
          </div>
        </Revelar>
      </div>
    </section>
  );
}
