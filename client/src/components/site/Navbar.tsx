import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { Logo } from "@/components/marca/Logo";
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
  const [aberto, setAberto] = useState(false);
  const [local] = useLocation();
  const { abrir } = usarLead();

  const sobreEscuro = local === "/" && !rolou && !aberto;

  useEffect(() => {
    const h = () => setRolou(window.scrollY > 40);
    h();
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  useEffect(() => setAberto(false), [local]);

  useEffect(() => {
    document.body.classList.toggle("travado", aberto);
    return () => document.body.classList.remove("travado");
  }, [aberto]);

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
              <Logo variante={sobreEscuro ? "branco" : "verde"} altura={25} />
            </Link>

            <nav className="hidden items-center gap-7 xl:flex" aria-label="Principal">
              {NAV.map((item) => {
                const ativo = local === item.path || local.startsWith(item.path + "/");
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    className="relative text-[0.8125rem] font-medium transition-colors"
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
              <button
                type="button"
                onClick={() => abrir("diagnostico")}
                className={cn(
                  "inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-[0.8125rem] font-semibold transition-colors",
                  sobreEscuro
                    ? "bg-esmeralda text-grafite hover:bg-esmeralda-clara"
                    : "bg-verde text-white hover:bg-verde-800",
                )}
              >
                Fazer o diagnóstico
                <Seta />
              </button>
            </div>

            <button
              type="button"
              onClick={() => setAberto((v) => !v)}
              className="-mr-2 p-2 xl:hidden"
              aria-label={aberto ? "Fechar menu" : "Abrir menu"}
              aria-expanded={aberto}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                {aberto ? (
                  <path
                    d="M5 5l14 14M19 5L5 19"
                    stroke="#0A5C42"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                  />
                ) : (
                  <path
                    d="M3.5 7h17M3.5 12h17M3.5 17h17"
                    stroke={sobreEscuro ? "#fff" : "#0A5C42"}
                    strokeWidth="1.7"
                    strokeLinecap="round"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {aberto && (
          <nav
            className="border-t border-verde/10 bg-osso xl:hidden"
            aria-label="Principal (móvel)"
            style={{ height: "calc(100dvh - 4.75rem)", overflowY: "auto" }}
          >
            <div className="coluna-larga py-5">
              {NAV.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className="block border-b border-verde/[0.07] py-4 text-[1rem] font-medium"
                  style={{ color: local === item.path ? "#0E9E6E" : "#14201C" }}
                >
                  {item.rotulo}
                </Link>
              ))}
              <button
                type="button"
                onClick={() => {
                  setAberto(false);
                  abrir("diagnostico");
                }}
                className="mt-7 flex w-full items-center justify-center gap-2 rounded-lg bg-verde px-5 py-4 text-[0.98rem] font-semibold text-white"
              >
                Fazer o diagnóstico
                <Seta />
              </button>
              <p className="nota mt-5">
                Diagnóstico técnico em 48 horas. Pode concluir que não há espaço de
                revisão — e dizer por quê.
              </p>
            </div>
          </nav>
        )}
      </header>
    </>
  );
}
