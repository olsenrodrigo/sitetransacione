import { useId, useState } from "react";
import type { FaqItem } from "@shared/seo";
import { Abertura, Revelar } from "./primitivas";
import { cn } from "@/lib/utils";

function Item({
  item,
  aberto,
  alternar,
  idBase,
  indice,
  claro,
}: {
  item: FaqItem;
  aberto: boolean;
  alternar: () => void;
  idBase: string;
  indice: number;
  claro?: boolean;
}) {
  const idBotao = `${idBase}-b${indice}`;
  const idPainel = `${idBase}-p${indice}`;

  return (
    <div
      className="border-b"
      style={{ borderColor: claro ? "#24332D" : "#E3E6E1" }}
    >
      <h3>
        <button
          type="button"
          id={idBotao}
          aria-expanded={aberto}
          aria-controls={idPainel}
          onClick={alternar}
          className="flex w-full items-start justify-between gap-6 py-6 text-left"
        >
          <span
            className="fonte-display text-[1.08rem] leading-snug transition-colors md:text-[1.18rem]"
            style={{
              color: aberto ? (claro ? "#3FD9A0" : "#0E9E6E") : claro ? "#fff" : "#0A5C42",
              fontWeight: 500,
            }}
          >
            {item.pergunta}
          </span>
          <span
            aria-hidden="true"
            className="mt-1.5 shrink-0 transition-transform duration-300"
            style={{ transform: aberto ? "rotate(45deg)" : "none" }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M8 2v12M2 8h12"
                stroke={claro ? "#3FD9A0" : "#0E9E6E"}
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </span>
        </button>
      </h3>
      <div
        id={idPainel}
        role="region"
        aria-labelledby={idBotao}
        hidden={!aberto}
        className="pb-7 pr-8"
      >
        <p className="corpo-sm">{item.resposta}</p>
      </div>
    </div>
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
  const [aberto, setAberto] = useState<number | null>(0);
  const idBase = useId();

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
                idBase={idBase}
                claro={claro}
                aberto={aberto === i}
                alternar={() => setAberto(aberto === i ? null : i)}
              />
            ))}
          </div>
        </Revelar>
      </div>
    </section>
  );
}
