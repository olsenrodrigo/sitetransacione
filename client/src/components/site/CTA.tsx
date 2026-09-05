import { useLocation } from "wouter";
import { Botao, Revelar, Seta, Sobrescrita } from "./primitivas";
import { whatsappDaPagina } from "@/data/site";
import { Simbolo } from "@/components/marca/Logo";
import { usarLead } from "./LeadModal";

export default function CTA({
  sobrescrita = "Comece pelo diagnóstico",
  titulo = "Em 48 horas você sabe se cabe para a sua empresa",
  descricao = "O diagnóstico técnico verifica se há espaço de economia, de quanto — ou por que não há. Nada avança sem a sua aprovação, e cada etapa é apresentada com números na mesa.",
  rotulo = "Fazer o diagnóstico",
  origem = "diagnostico",
}: {
  sobrescrita?: string;
  titulo?: string;
  descricao?: string;
  rotulo?: string;
  origem?: "diagnostico" | "parceiro";
}) {
  const [local] = useLocation();
  const { abrir } = usarLead();

  return (
    <section className="faixa-escura faixa relative overflow-hidden">
      <div
        aria-hidden="true"
        className="halo"
        style={{ width: 620, height: 620, right: "-12%", top: "-22%" }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 left-1/2 -translate-x-1/2 opacity-[0.04]"
      >
        <Simbolo variante="branco" tamanho={460} />
      </div>

      <div className="coluna relative text-center">
        <Revelar>
          <Sobrescrita claro centro>
            {sobrescrita}
          </Sobrescrita>
          <h2 className="afirmacao mt-7">{titulo}</h2>
          <p className="corpo mx-auto mt-6 max-w-xl">{descricao}</p>

          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            <Botao variante="esmeralda" tamanho="lg" onClick={() => abrir(origem)}>
              {rotulo}
              <Seta />
            </Botao>
            <a
              href={whatsappDaPagina(local)}
              target="_blank"
              rel="noopener noreferrer"
              data-evento="whatsapp_cta"
              className="inline-flex items-center justify-center gap-2 rounded-lg border px-7 py-4 text-[0.98rem] font-medium transition-colors"
              style={{ borderColor: "rgba(255,255,255,0.24)", color: "#fff" }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Falar pelo WhatsApp
            </a>
          </div>

          <p className="nota mx-auto mt-8 max-w-lg">
            Se não houver espaço para revisão, o diagnóstico registra essa conclusão e
            apresenta os fundamentos. Não constitui promessa de resultado.
          </p>
        </Revelar>
      </div>
    </section>
  );
}
