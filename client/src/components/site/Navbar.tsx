import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "wouter";
import { Logo } from "@/components/marca/Logo";
import { SITE } from "@shared/seo";
import { NAV } from "@/data/site";
import { Seta } from "./primitivas";
import { usarLead } from "./LeadModal";
import { cn } from "@/lib/utils";

/**
 * A home abre com uma faixa escura de tela cheia: a barra entra transparente
 * e em branco, e só ganha fundo quando a página rola. Nas demais rotas, que
 * abrem em faixa clara, ela já nasce sólida.
 */
export default function Navbar() {
  const [rolou, setRolou] = useState(false);
  const menu = useRef<HTMLDetailsElement>(null);
  const [local] = useLocation();
  const { abrir } = usarLead();

  const sobreEscuro = local === "/" && !rolou;

  useEffect(() => {
    const h = () => setRolou(window.scrollY > 40);
    h();
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  useEffect(() => {
    if (menu.current) menu.current.open = false;
  }, [local]);

  return (
    <>
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-md focus:bg-verde focus:px-4 focus:py-2 focus:text-sm focus:text-white"
      >
        Pular para o conteúdo
      </a>

      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,backdrop-filter] duration-300",
          sobreEscuro
            ? "bg-transparent"
            : "bg-[rgba(247,246,242,0.9)] shadow-[0_1px_0_rgba(10,92,66,0.09)] backdrop-blur-xl",
        )}
      >
        <div className="coluna-larga">
          <div className="flex h-[4.75rem] items-center justify-between gap-6">
            <Link href="/" aria-label="Transacione — página inicial" className="shrink-0">
              <Logo variante={sobreEscuro ? "branco" : "verde"} altura={28} />
            </Link>

            <nav
              className="hidden items-center gap-4 xl:flex xl:gap-5"
              aria-label="Principal"
            >
              {NAV.map((item) => {
                const ativo = local === item.path || local.startsWith(item.path + "/");
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    className="relative whitespace-nowrap text-[0.78rem] font-medium transition-colors xl:text-[0.8125rem]"
                    style={{
                      color: sobreEscuro
                        ? ativo
                          ? "#fff"
                          : "rgba(255,255,255,0.72)"
                        : ativo
                          ? "#0A5C42"
                          : "#41544C",
                    }}
                    aria-current={ativo ? "page" : undefined}
                  >
                    {item.rotulo}
                    <span
                      aria-hidden="true"
                      className="absolute -bottom-1.5 left-0 h-px transition-all duration-300"
                      style={{
                        width: ativo ? "100%" : 0,
                        background: sobreEscuro ? "#3FD9A0" : "#0E9E6E",
                      }}
                    />
                  </Link>
                );
              })}
            </nav>

            <div className="hidden shrink-0 items-center xl:flex">
              <a
                href={`mailto:${SITE.email}`}
                onClick={(event) => { event.preventDefault(); abrir("diagnostico"); }}
                className={cn(
                  "inline-flex items-center gap-2 whitespace-nowrap rounded-lg px-3.5 py-2.5 text-[0.78rem] font-semibold transition-colors xl:px-4 xl:text-[0.8125rem]",
                  sobreEscuro
                    ? "bg-esmeralda text-grafite hover:bg-esmeralda-clara"
                    : "bg-verde text-white hover:bg-verde-800",
                )}
              >
                <span className="xl:hidden">Diagnóstico</span>
                <span className="hidden xl:inline">Fazer o diagnóstico</span>
                <Seta />
              </a>
            </div>

            <details ref={menu} className="xl:hidden">
              <summary className="-mr-2 cursor-pointer list-none p-2" aria-label="Abrir menu">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M3.5 7h17M3.5 12h17M3.5 17h17" stroke={sobreEscuro ? "#fff" : "#0A5C42"} strokeWidth="1.7" strokeLinecap="round" />
                </svg>
              </summary>
              <nav className="absolute inset-x-0 top-full border-t border-verde/10 bg-osso"
                aria-label="Principal (móvel)" style={{ maxHeight: "calc(100vh - 4.75rem)", overflowY: "auto" }}>
                <div className="coluna-larga py-5">
                  {NAV.map((item) => (
                    <Link key={item.path} href={item.path}
                      className="block border-b border-verde/[0.07] py-4 text-[1rem] font-medium"
                      style={{ color: local === item.path ? "#0E9E6E" : "#14201C" }}>
                      {item.rotulo}
                    </Link>
                  ))}
                  <a href={`mailto:${SITE.email}`}
                    onClick={(event) => {
                      event.preventDefault();
                      if (menu.current) menu.current.open = false;
                      abrir("diagnostico");
                    }}
                    className="mt-5 flex items-center justify-center gap-2 rounded-lg bg-verde px-5 py-3.5 text-[0.95rem] font-semibold text-white">
                    Fazer o diagnóstico <Seta />
                  </a>
                </div>
              </nav>
            </details>
          </div>
        </div>
      </header>
    </>
  );
}
