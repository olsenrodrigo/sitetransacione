import type { ReactNode } from "react";
import { Link } from "wouter";
import { Logo } from "@/components/marca/Logo";
import { SITE, NAV } from "@/data/site";

const LEGAIS = [
  { rotulo: "Política de privacidade", path: "/privacidade" },
  { rotulo: "Termos de uso", path: "/termos" },
  { rotulo: "Aviso de cookies", path: "/cookies" },
];

const NORMAS = [
  "Lei nº 13.988/2020",
  "Portaria PGFN nº 6.757/2022",
  "Lei estadual nº 17.843/2023",
  "Resolução PGE nº 6/2024",
];

const linkRodape =
  "-my-1 inline-block py-1.5 text-[0.9rem] text-cinza transition-colors hover:text-verde sm:my-0 sm:py-0.5 sm:text-[0.86rem]";

function Coluna({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <div>
      <p className="sobrescrita mb-4 text-esmeralda">{titulo}</p>
      {children}
    </div>
  );
}

/**
 * Rodapé claro: fecha o site depois do CTA escuro, mantendo a alternância
 * de faixas. Uma coluna em telas estreitas, duas em tablet e quatro no
 * desktop — a marca ocupa a largura inteira até `lg`.
 */
export default function Footer() {
  const ano = new Date().getFullYear();

  return (
    <footer className="faixa-osso2 border-t border-borda">
      <div className="coluna-larga py-14 md:py-16">
        <div className="grid gap-10 sm:grid-cols-2 sm:gap-x-8 lg:grid-cols-[1.5fr_1fr_1fr_1fr] lg:gap-10">
          {/* Marca e contato */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link
              href="/"
              aria-label="Transacione — página inicial"
              className="-my-1 inline-block py-1"
            >
              <Logo altura={28} />
            </Link>
            <p className="corpo-sm mt-5 max-w-sm text-[0.9rem]">
              Aferição, revisão e negociação de transação tributária federal e estadual.
              Tecnologia própria, sustentada jurídica, contábil e economicamente.
            </p>
            <address className="mt-6 space-y-1 text-[0.85rem] not-italic text-cinza">
              <p>
                {SITE.endereco.rua}, {SITE.endereco.complemento}
              </p>
              <p>
                {SITE.endereco.bairro} — {SITE.endereco.cidade}/{SITE.endereco.uf}
                <span className="hidden sm:inline"> · </span>
                <br className="sm:hidden" />
                <span className="num">{SITE.endereco.cep}</span>
              </p>
              <p className="pt-1.5">
                <a
                  href={`mailto:${SITE.email}`}
                  className="-my-1 inline-block break-all py-1.5 font-medium text-verde transition-colors hover:text-esmeralda sm:my-0 sm:py-0.5"
                >
                  {SITE.email}
                </a>
              </p>
            </address>
          </div>

          <Coluna titulo="Navegação">
            <nav aria-label="Rodapé — navegação">
              <ul className="space-y-1.5">
                {NAV.map((n) => (
                  <li key={n.path}>
                    <Link href={n.path} className={linkRodape}>
                      {n.rotulo}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link href="/diagnostico" className={linkRodape}>
                    Diagnóstico
                  </Link>
                </li>
              </ul>
            </nav>
          </Coluna>

          <Coluna titulo="Base normativa">
            <ul className="space-y-1.5 text-[0.85rem] text-cinza">
              {NORMAS.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>
          </Coluna>

          <Coluna titulo="Legal">
            <ul className="space-y-1.5">
              {LEGAIS.map((l) => (
                <li key={l.path}>
                  <Link href={l.path} className={linkRodape}>
                    {l.rotulo}
                  </Link>
                </li>
              ))}
            </ul>
          </Coluna>
        </div>

        <div className="mt-12 border-t border-borda pt-8">
          <p className="nota max-w-4xl">
            Este site tem finalidade informativa. Não constitui oferta, consulta jurídica,
            promessa de resultado ou garantia de desconto. Percentuais, prazos e
            elegibilidade dependem da classificação apurada e dos limites da norma
            aplicável a cada caso concreto. O diagnóstico e o trabalho contábil são
            contratados com a Consultoria; eventual atuação em juízo é contratada
            separadamente, com o escritório jurídico.
          </p>
          <div className="mt-6 flex flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            <p className="nota">
              © <span className="num">{ano}</span> {SITE.nome} · {SITE.nomeLegal}
            </p>
            <p className="nota">
              Marca, identidade e site por{" "}
              <a
                href="https://www.sintetiza.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="-my-1 inline-block py-1.5 transition-colors hover:text-verde sm:my-0 sm:py-0"
              >
                Sintetiza AI
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
