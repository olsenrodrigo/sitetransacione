import { usarSeo } from "@/lib/seo";
import { Botao, Seta, Sobrescrita } from "@/components/site/primitivas";
import { NAV } from "@/data/site";
import { Link } from "wouter";

export default function NaoEncontrado() {
  usarSeo({
    titulo: "Página não encontrada | Transacione",
    descricao: "A página que você procura não existe ou foi movida.",
    path: "/404",
    noindex: true,
  });

  return (
    <section className="faixa faixa-clara pt-32 md:pt-40">
      <div className="coluna-larga">
        <div className="max-w-2xl">
          <Sobrescrita>Erro 404</Sobrescrita>
          <h1 className="manchete mt-5">Esta página não existe</h1>
          <p className="corpo mt-5">
            O endereço pode ter mudado ou o link pode estar incompleto. Abaixo estão os
            caminhos principais do site.
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <Botao href="/" tamanho="lg">
              Voltar ao início
              <Seta />
            </Botao>
            <Botao href="/diagnostico" variante="contorno" tamanho="lg">
              Fazer o diagnóstico
            </Botao>
          </div>

          <ul className="mt-12 grid gap-px overflow-hidden rounded-lg border border-borda bg-borda sm:grid-cols-2">
            {NAV.map((n) => (
              <li key={n.path}>
                <Link
                  href={n.path}
                  className="block bg-white px-5 py-4 text-[0.875rem] text-tinta transition-colors hover:text-verde"
                >
                  {n.rotulo}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
