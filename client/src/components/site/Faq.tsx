import { useId, useState } from "react";
import type { FaqItem } from "@shared/seo";
import { CabecalhoSecao, Revelar } from "./primitivas";

function Item({
  item,
  aberto,
  alternar,
  idBase,
  indice,
}: {
  item: FaqItem;
  aberto: boolean;
  alternar: () => void;
  idBase: string;
  indice: number;
}) {
  const idBotao = `${idBase}-b${indice}`;
  const idPainel = `${idBase}-p${indice}`;

  return (
    <div className="border-b border-borda">
      <h3>
        <button
          type="button"
          id={idBotao}
          aria-expanded={aberto}
          aria-controls={idPainel}
          onClick={alternar}
          className="flex w-full items-start justify-between gap-6 py-5 text-left"
        >
          <span
            className="fonte-display text-[1.05rem] leading-snug transition-colors md:text-[1.12rem]"
            style={{ color: aberto ? "#0E9E6E" : "#0A5C42", fontWeight: 500 }}
          >
            {item.pergunta}
          </span>
          <span
            aria-hidden="true"
            className="mt-1 shrink-0 transition-transform duration-300"
            style={{ transform: aberto ? "rotate(45deg)" : "none" }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M8 2v12M2 8h12"
                stroke="#0E9E6E"
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
        className="pb-6 pr-8"
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
  descricao,
}: {
  itens: FaqItem[];
  titulo?: string;
  sobrescrita?: string;
  descricao?: string;
}) {
  const [aberto, setAberto] = useState<number | null>(0);
  const idBase = useId();

  return (
    <section className="secao">
      <div className="container-t">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <Revelar>
            <CabecalhoSecao
              sobrescrita={sobrescrita}
              titulo={titulo}
              descricao={descricao}
            />
          </Revelar>
          <Revelar atraso={80}>
            <div className="border-t border-borda">
              {itens.map((item, i) => (
                <Item
                  key={item.pergunta}
                  item={item}
                  indice={i}
                  idBase={idBase}
                  aberto={aberto === i}
                  alternar={() => setAberto(aberto === i ? null : i)}
                />
              ))}
            </div>
          </Revelar>
        </div>
      </div>
    </section>
  );
}
