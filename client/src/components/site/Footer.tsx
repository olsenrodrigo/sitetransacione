import { Link } from "wouter";
import { Logo } from "@/components/marca/Logo";
import { SITE, NAV } from "@/data/site";

const LEGAIS = [
  { rotulo: "Política de privacidade", path: "/privacidade" },
  { rotulo: "Termos de uso", path: "/termos" },
  { rotulo: "Aviso de cookies", path: "/cookies" },
];

export default function Footer() {
  const ano = new Date().getFullYear();

  return (
    <footer className="fundo-escuro border-t border-borda-escura">
      <div className="container-t py-16 md:py-20">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr] md:gap-10">
          <div>
            <Logo variante="branco" altura={26} />
            <p className="corpo-sm mt-5 max-w-sm">
              Aferição, revisão e negociação de transação tributária federal e estadual.
              Tecnologia própria, sustentada jurídica, contábil e economicamente.
            </p>
            <div
              className="mt-6 space-y-1 text-[0.82rem]"
              style={{ color: "#a9bbb4" }}
            >
              <p>
                {SITE.endereco.rua}, {SITE.endereco.complemento}
              </p>
              <p>
                {SITE.endereco.bairro} — {SITE.endereco.cidade}/{SITE.endereco.uf} ·{" "}
                <span className="num">{SITE.endereco.cep}</span>
              </p>
              <p className="pt-2">
                <a
                  href={`mailto:${SITE.email}`}
                  className="transition-colors hover:text-esmeralda-clara"
                >
                  {SITE.email}
                </a>
              </p>
            </div>
          </div>

          <nav aria-label="Rodapé — navegação">
            <p
              className="sobrescrita mb-4"
              style={{ color: "#3FD9A0" }}
            >
              Navegação
            </p>
            <ul className="space-y-2.5">
              {NAV.map((n) => (
                <li key={n.path}>
                  <Link
                    href={n.path}
                    className="text-[0.86rem] transition-colors hover:text-esmeralda-clara"
                    style={{ color: "#a9bbb4" }}
                  >
                    {n.rotulo}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/diagnostico"
                  className="text-[0.86rem] transition-colors hover:text-esmeralda-clara"
                  style={{ color: "#a9bbb4" }}
                >
                  Diagnóstico
                </Link>
              </li>
            </ul>
          </nav>

          <div>
            <p className="sobrescrita mb-4" style={{ color: "#3FD9A0" }}>
              Base normativa
            </p>
            <ul className="space-y-2.5 text-[0.82rem]" style={{ color: "#a9bbb4" }}>
              <li>Lei nº 13.988/2020</li>
              <li>Portaria PGFN nº 6.757/2022</li>
              <li>Lei estadual nº 17.843/2023</li>
              <li>Resolução PGE nº 6/2024</li>
            </ul>

            <p className="sobrescrita mb-4 mt-8" style={{ color: "#3FD9A0" }}>
              Legal
            </p>
            <ul className="space-y-2.5">
              {LEGAIS.map((l) => (
                <li key={l.path}>
                  <Link
                    href={l.path}
                    className="text-[0.82rem] transition-colors hover:text-esmeralda-clara"
                    style={{ color: "#a9bbb4" }}
                  >
                    {l.rotulo}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 border-t border-borda-escura pt-7">
          <p className="nota max-w-4xl">
            Este site tem finalidade informativa. Não constitui oferta, consulta jurídica,
            promessa de resultado ou garantia de desconto. Percentuais, prazos e
            elegibilidade dependem da classificação apurada e dos limites da norma
            aplicável a cada caso concreto. O diagnóstico e o trabalho contábil são
            contratados com a Consultoria; eventual atuação em juízo é contratada
            separadamente, com o escritório jurídico.
          </p>
          <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="nota">
              © <span className="num">{ano}</span> {SITE.nome} · {SITE.nomeLegal}
            </p>
            <p className="nota">
              Marca, identidade e site por{" "}
              <a
                href="https://www.sintetiza.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-esmeralda-clara"
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
