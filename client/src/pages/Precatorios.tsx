import { rotaPorPath } from "@shared/seo";
import { FONTES_PRECATORIOS } from "@shared/jornada";
import { usarSeo, seoDaRota } from "@/lib/seo";
import HeroPagina from "@/components/site/HeroPagina";
import Faq from "@/components/site/Faq";
import CTA from "@/components/site/CTA";
import { Abertura, Botao, NotaLegal, Seta } from "@/components/site/primitivas";

const rota = rotaPorPath("/precatorios")!;
const FASES_FEDERAIS = [
  {
    titulo: "Estruturação da operação",
    etapas: [
      ["Seleção do crédito", "Identificação do precatório federal elegível, próprio ou de terceiro, e do débito que poderá receber o crédito."],
      ["Due diligence", "Conferência do processo, da titularidade, da cadeia de cessões, dos bloqueios, das retenções e do valor líquido disponível."],
      ["Cessão por escritura pública", "Formalização da aquisição, quando necessária, com as condições e responsabilidades das partes."],
      ["Proteção contratual", "Definição das condições de pagamento. Uma conta de garantia (escrow) pode ser negociada entre as partes; não é exigência geral da PGFN."],
    ],
  },
  {
    titulo: "Regularização no tribunal",
    etapas: [
      ["Comunicação da cessão", "Registro e comunicação ao juízo e ao ente devedor, conforme o procedimento aplicável."],
      ["Certidão do valor disponível", "Obtenção da CVLD, a Certidão do Valor Líquido Disponível, compatível com a titularidade e a utilização pretendida."],
    ],
  },
  {
    titulo: "Utilização perante a PGFN",
    etapas: [
      ["Pedido no Regularize", "Protocolo da oferta com as inscrições ou negociações a amortizar e os documentos exigidos."],
      ["Análise e exigências", "Acompanhamento do requerimento e resposta a pedidos de esclarecimento ou complementação."],
      ["Aceitação do crédito", "A utilização admitida fica sob condição resolutória de posterior disponibilização financeira pelo tribunal."],
      ["Encontro de contas e baixa", "Acompanhamento da disponibilização dos recursos e da baixa definitiva. Eventual diferença de saldo é apurada para liquidação."],
    ],
  },
];

export default function Precatorios() {
  usarSeo(seoDaRota(rota));
  return (
    <>
      <HeroPagina sobrescrita="Precatórios · São Paulo e União" titulo="Precatórios para amortizar e liquidar o passivo tributário" resumo={rota.resumo}
        migalhas={[{ nome: "Início", path: "/" }, { nome: "Precatórios", path: "/precatorios" }]}
        acoes={<><Botao href="#estadual" variante="esmeralda">Precatório estadual <Seta /></Botao><Botao href="#federal" variante="contorno-claro">Precatório federal <Seta /></Botao></>} />

      <section className="faixa faixa-clara">
        <div className="coluna-larga">
          <Abertura alinhamento="esquerda" sobrescrita="Onde entra a economia" titulo="Primeiro, o acordo. Depois, a estratégia para o saldo."
            resposta="Na jornada da transação, os descontos cabíveis reduzem a dívida. O precatório pode então amortizar o saldo remanescente: quando adquirido por um preço inferior ao crédito reconhecido, o deságio pode reduzir o desembolso da empresa." />
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {[
              ["Dívida negociada", "Apuramos o saldo depois dos descontos e as condições que precisam ser mantidas no acordo."],
              ["Crédito com deságio", "Comparamos o preço de aquisição, o valor utilizável e os custos jurídicos, operacionais e financeiros."],
              ["Encontro de contas", "O órgão competente valida o crédito e sua aplicação. Acompanhamos a baixa e eventual valor ainda a pagar."],
            ].map(([titulo, texto]) => <div key={titulo} className="cartao p-6"><h3 className="titulo-card">{titulo}</h3><p className="corpo-sm mt-3">{texto}</p></div>)}
          </div>
          <NotaLegal>O deságio de aquisição não é um desconto concedido pelo Fisco. O preço, a economia líquida e a elegibilidade dependem de cada título e operação. Um precatório estadual não substitui automaticamente um crédito federal, nem o contrário.</NotaLegal>
        </div>
      </section>

      <section id="estadual" className="faixa faixa-escura scroll-mt-24">
        <div className="coluna-larga">
          <Abertura claro alinhamento="esquerda" sobrescrita="Precatório estadual · PGE-SP" titulo="São Paulo: duas fases, da aquisição à compensação"
            resposta="Na transação paulista, precatórios elegíveis podem ser utilizados em até 75% do saldo após os descontos, conforme a legislação e o acordo. Estruturamos o crédito e acompanhamos sua aplicação à dívida negociada." />
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            <div className="rounded-xl border border-white/15 p-7">
              <p className="sobrescrita text-esmeralda-clara">01 · Aquisição e regularização</p>
              <h3 className="subafirmacao mt-4 text-white">Um título apto para a operação</h3>
              <ul className="mt-5 list-disc space-y-3 pl-5 text-sm leading-relaxed text-[#C6D3CE]">
                <li>Seleção do precatório e avaliação do preço de aquisição.</li>
                <li>Análise jurídica e financeira, atualização do valor e conferência de impedimentos.</li>
                <li>Escritura pública de cessão, habilitação judicial e registro no tribunal, inclusive no DEPRE quando aplicável.</li>
                <li>Obtenção das certidões e documentos para a oferta à PGE-SP.</li>
              </ul>
              <p className="mt-6 text-sm text-esmeralda-clara">Referência de planejamento: até 3 meses.</p>
            </div>
            <div className="rounded-xl border border-white/15 p-7">
              <p className="sobrescrita text-esmeralda-clara">02 · Validação e encontro de contas</p>
              <h3 className="subafirmacao mt-4 text-white">O crédito aplicado à dívida</h3>
              <ul className="mt-5 list-disc space-y-3 pl-5 text-sm leading-relaxed text-[#C6D3CE]">
                <li>Protocolo da documentação e do pedido de utilização.</li>
                <li>Validação administrativa pela PGE-SP e atendimento às exigências.</li>
                <li>Reconhecimento do crédito e amortização do saldo admitido no acordo.</li>
                <li>Conferência da baixa e organização do pagamento do remanescente.</li>
              </ul>
              <p className="mt-6 text-sm text-esmeralda-clara">Referência de planejamento: até 2 meses.</p>
            </div>
          </div>
          <p className="nota mt-8">A referência de 5 meses para as duas fases é uma estimativa operacional, sujeita ao título, à documentação e à análise dos órgãos. Não é prazo legal nem garantia de conclusão.</p>
          <a className="mt-5 inline-block text-sm text-esmeralda-clara underline underline-offset-4" href={FONTES_PRECATORIOS.estadual} target="_blank" rel="noopener noreferrer">Consultar a Lei estadual nº 17.843/2023</a>
        </div>
      </section>

      <section id="federal" className="faixa faixa-clara scroll-mt-24">
        <div className="coluna-larga">
          <Abertura alinhamento="esquerda" sobrescrita="Precatório federal · PGFN" titulo="União: dez passos até a liquidação"
            resposta="Créditos federais elegíveis, próprios ou adquiridos de terceiros, podem amortizar ou liquidar débitos inscritos em dívida ativa da União, inclusive saldo de transação ou parcelamento. A análise pode alcançar parcelas vincendas do acordo; o limite paulista de 75% não é uma regra geral da PGFN." />
          <div className="mt-12 space-y-10">
            {FASES_FEDERAIS.map((fase, index) => (
              <div key={fase.titulo}>
                <h3 className="subafirmacao text-verde"><span className="mr-3 text-esmeralda">{String.fromCharCode(65 + index)}</span>{fase.titulo}</h3>
                <ol start={index === 0 ? 1 : index === 1 ? 5 : 7} className="mt-5 grid gap-4 md:grid-cols-2">
                  {fase.etapas.map(([titulo, texto], i) => (
                    <li key={titulo} className="cartao flex gap-4 p-6">
                      <span aria-hidden="true" className="numeral pt-1 text-sm text-esmeralda">{String(i + (index === 0 ? 1 : index === 1 ? 5 : 7)).padStart(2, "0")}</span>
                      <div><h4 className="font-semibold text-verde">{titulo}</h4><p className="corpo-sm mt-2">{texto}</p></div>
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
          <NotaLegal>O pedido não dispensa o cumprimento das parcelas e das obrigações do acordo. A disponibilidade e a atualização do crédito precisam ser conferidas; diferenças de saldo podem exigir pagamento complementar. O prazo depende do tribunal e da PGFN.</NotaLegal>
          <a className="mt-5 inline-block text-sm text-verde underline underline-offset-4" href={FONTES_PRECATORIOS.federal} target="_blank" rel="noopener noreferrer">Consultar o procedimento oficial da PGFN e a Portaria nº 10.826/2022</a>
        </div>
      </section>
      <Faq itens={rota.faq!} titulo="Antes de utilizar um precatório" />
      <CTA titulo="O precatório faz sentido para o seu passivo?" descricao="Avaliamos a dívida, a esfera, o título e os custos da operação. Você decide com a viabilidade jurídica e os números na mesa." rotulo="Avaliar minha operação" />
    </>
  );
}
