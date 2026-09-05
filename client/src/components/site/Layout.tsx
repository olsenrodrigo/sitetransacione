import { useEffect, useState, type ReactNode } from "react";
import { useLocation, Link } from "wouter";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { LeadProvider } from "./LeadModal";
import { whatsappDaPagina } from "@/data/site";

/* ------------------------------------------------------- Botão WhatsApp */

function BotaoWhatsapp() {
  const [local] = useLocation();
  const [visivel, setVisivel] = useState(false);

  useEffect(() => {
    const h = () => setVisivel(window.scrollY > 640);
    h();
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <a
      href={whatsappDaPagina(local)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar pelo WhatsApp"
      data-evento="whatsapp_flutuante"
      className="fixed bottom-5 right-5 z-40 flex h-12 w-12 items-center justify-center rounded-full shadow-lg transition-[opacity,transform] duration-300 md:bottom-7 md:right-7"
      style={{
        background: "#0A5C42",
        opacity: visivel ? 1 : 0,
        transform: visivel ? "translate3d(0,0,0) scale(1)" : "translate3d(0,12px,0) scale(0.9)",
        pointerEvents: visivel ? "auto" : "none",
      }}
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff" aria-hidden="true">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    </a>
  );
}

/* ------------------------------------------------------- Aviso de cookies */

const CHAVE_COOKIES = "transacione:cookies";

function AvisoCookies() {
  const [visivel, setVisivel] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(CHAVE_COOKIES)) {
        const t = setTimeout(() => setVisivel(true), 1800);
        return () => clearTimeout(t);
      }
    } catch {
      /* navegação privada ou armazenamento bloqueado: não exibe */
    }
  }, []);

  const decidir = (valor: "aceito" | "essenciais") => {
    try {
      localStorage.setItem(CHAVE_COOKIES, valor);
    } catch {
      /* segue sem persistir */
    }
    setVisivel(false);
  };

  if (!visivel) return null;

  return (
    <div
      role="dialog"
      aria-label="Aviso de cookies"
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-borda bg-white/97 backdrop-blur-md md:bottom-5 md:left-5 md:right-auto md:max-w-sm md:rounded-xl md:border md:shadow-xl"
      style={{ animation: "subir .4s cubic-bezier(.22,1,.36,1)" }}
    >
      <div className="p-5">
        <p className="corpo-sm text-[0.88rem]">
          Usamos cookies essenciais para o funcionamento do site e cookies de medição para
          entender como ele é usado.{" "}
          <Link href="/cookies" className="text-verde underline underline-offset-2">
            Saiba mais
          </Link>
          .
        </p>
        <div className="mt-4 flex flex-wrap gap-2.5">
          <button
            type="button"
            onClick={() => decidir("aceito")}
            className="rounded-lg bg-verde px-4 py-2.5 text-[0.82rem] font-medium text-white transition-colors hover:bg-verde-800"
          >
            Aceitar todos
          </button>
          <button
            type="button"
            onClick={() => decidir("essenciais")}
            className="rounded-lg border border-verde/25 px-4 py-2.5 text-[0.82rem] font-medium text-verde transition-colors hover:border-verde/60"
          >
            Apenas essenciais
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- Layout */

export default function Layout({ children }: { children: ReactNode }) {
  const [local] = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [local]);

  return (
    <LeadProvider>
      <div className="flex min-h-dvh flex-col">
        <Navbar />
        <main id="conteudo" className="flex-1">
          {children}
        </main>
        <Footer />
        <BotaoWhatsapp />
        <AvisoCookies />
      </div>
    </LeadProvider>
  );
}
