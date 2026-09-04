import { rotaPorPath, SITE, ATUALIZADO } from "@shared/seo";
import { usarSeo, seoDaRota } from "@/lib/seo";
import { Migalhas, Revelar, Sobrescrita } from "@/components/site/primitivas";
import { DOCUMENTOS_LEGAIS, type DocLegal } from "@/data/legal";

const PATHS: Record<DocLegal, string> = {
  privacidade: "/privacidade",
  termos: "/termos",
  cookies: "/cookies",
};

const NOMES: Record<DocLegal, string> = {
  privacidade: "Política de privacidade",
  termos: "Termos de uso",
  cookies: "Aviso de cookies",
};

export default function Legal({ doc }: { doc: DocLegal }) {
  const rota = rotaPorPath(PATHS[doc])!;
  const migalhas = [
    { nome: "Início", path: "/" },
    { nome: NOMES[doc], path: PATHS[doc] },
  ];
  usarSeo(seoDaRota(rota, migalhas));

  const conteudo = DOCUMENTOS_LEGAIS[doc];
  const dataBr = new Date(ATUALIZADO + "T12:00:00").toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <article>
      <header className="relative overflow-hidden pb-8 pt-28 md:pt-36">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{ background: "linear-gradient(170deg, #FFFFFF 0%, #F7F6F2 65%)" }}
        />
        <div className="container-prosa relative">
          <Revelar>
            <Migalhas itens={migalhas} />
            <Sobrescrita>Documento legal</Sobrescrita>
            <h1
              className="fonte-display mt-5"
              style={{
                fontSize: "clamp(1.8rem, 1.2rem + 2.2vw, 2.6rem)",
                lineHeight: 1.14,
                letterSpacing: "-0.02em",
                fontWeight: 500,
              }}
            >
              {rota.h1}
            </h1>
            <p className="nota mt-5">
              Última atualização: {dataBr} · {SITE.nomeLegal}
            </p>
          </Revelar>
        </div>
      </header>

      <div className="container-prosa pb-20">
        <div className="prosa">
          {conteudo.map((b, i) =>
            b.t === "h2" ? (
              <h2 key={i}>{b.c}</h2>
            ) : b.t === "ul" ? (
              <ul key={i}>
                {b.itens.map((it) => (
                  <li key={it}>{it}</li>
                ))}
              </ul>
            ) : (
              <p key={i}>{b.c}</p>
            ),
          )}
        </div>

        <p className="nota mt-12 border-t border-borda pt-6">
          Dúvidas sobre este documento ou sobre o tratamento dos seus dados podem ser
          encaminhadas para{" "}
          <a href={`mailto:${SITE.email}`} className="text-verde underline underline-offset-2">
            {SITE.email}
          </a>
          .
        </p>
      </div>
    </article>
  );
}
