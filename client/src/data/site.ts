import { SITE } from "@shared/seo";
/* Importadas como módulo: o Vite gera hash no nome, então trocar uma foto
   invalida o cache do navegador sozinho — com nome fixo em /public, quem já
   tinha visitado continuaria vendo a antiga pelos 7 dias de cache. */
import fotoEduardo from "@/assets/equipe/eduardo-correa-da-silva.jpg";
import fotoFernando from "@/assets/equipe/fernando-lucas-correa.jpg";
import { linkWhatsapp } from "@/lib/utils";

export { SITE };

export const NAV = [
  { rotulo: "Como funciona", path: "/como-funciona" },
  { rotulo: "Federal", path: "/transacao-federal" },
  { rotulo: "Estadual", path: "/transacao-estadual" },
  { rotulo: "A tecnologia", path: "/tecnologia" },
  { rotulo: "Parceiros", path: "/parceiros" },
  { rotulo: "Quem somos", path: "/quem-somos" },
  { rotulo: "Conteúdo", path: "/conteudo" },
];

/** Mensagem de WhatsApp pré-preenchida conforme a página de origem. */
const MENSAGENS: Record<string, string> = {
  "/": "Olá. Vim pelo site da Transacione e gostaria de entender se o passivo tributário da minha empresa comporta um diagnóstico.",
  "/como-funciona":
    "Olá. Li a página “Como funciona” no site da Transacione e gostaria de saber quais documentos preciso reunir.",
  "/transacao-federal":
    "Olá. Tenho passivo inscrito em dívida ativa da União e gostaria de avaliar a revisão de CAPAG.",
  "/transacao-estadual":
    "Olá. Tenho passivo inscrito na dívida ativa do Estado de São Paulo e gostaria de avaliar a revisão do grau de recuperabilidade.",
  "/tecnologia":
    "Olá. Gostaria de entender melhor a metodologia e a rastreabilidade do laudo da Transacione.",
  "/parceiros":
    "Olá. Sou contador/tenho um escritório e gostaria de conhecer o canal de parceria da Transacione.",
  "/quem-somos":
    "Olá. Vim pela página “Quem somos” do site da Transacione e gostaria de falar com a equipe técnica.",
  "/diagnostico":
    "Olá. Fiz o diagnóstico de elegibilidade no site da Transacione e gostaria de dar sequência.",
};

export function whatsappDaPagina(path: string) {
  const base =
    MENSAGENS[path] ??
    "Olá. Vim pelo site da Transacione e gostaria de falar com a equipe.";
  return linkWhatsapp(SITE.whatsapp, base);
}

/* --------------------------------------------------------------- Equipe */

export interface Socio {
  nome: string;
  area: string;
  cargo: string;
  /** Abertura assertiva — o que essa pessoa resolve no caso concreto. */
  lead: string;
  bio: string;
  credenciais: string[];
  iniciais: string;
  foto: string;
}

export const SOCIOS: Socio[] = [
  {
    nome: "Eduardo Corrêa da Silva",
    iniciais: "EC",
    foto: fotoEduardo,
    area: "Jurídico tributário",
    cargo: "Responsável técnico jurídico",
    lead: "Quem sustenta a tese do lado de dentro da mesa — e do lado de dentro do tribunal que a julga.",
    bio: "Advogado tributarista há 22 anos, Eduardo conduz contencioso, planejamento e consultoria para grupos industriais e empresariais nas duas esferas. Julga no Tribunal de Impostos e Taxas do Estado de São Paulo, o que significa que conhece pelo lado de quem decide o que faz um pedido de revisão se sustentar — e o que faz ele cair. Preside a Comissão de Direito Tributário da OAB/SP e ocupa as cadeiras jurídicas do CIESP e da FIESP, onde a pauta tributária das indústrias paulistas é formada. Na Transacione, é ele quem transforma a apuração técnica em peça jurídica com sede normativa citada.",
    credenciais: [
      "Mestre em Direito Tributário pela FGV",
      "Pós-graduado em Direito Tributário (PUC/SP) e em Processo Tributário (IICS)",
      "Presidente da Comissão de Direito Tributário da OAB/SP — gestão 2025/2027",
      "Juiz do Tribunal de Impostos e Taxas do Estado de São Paulo (TIT/SP)",
      "Diretor do DEJUR do CIESP e Conselheiro do CONJUR da FIESP",
      "Diretor jurídico do SICETEL/ABIMETAL",
      "Professor convidado de Direito Tributário na pós-graduação da ESA/OAB-SP",
      "Sócio-fundador da Correa, Porto Advogados",
    ],
  },
  {
    nome: "Fernando Lucas Corrêa",
    iniciais: "FC",
    foto: fotoFernando,
    area: "Contábil, fiscal e tecnologia",
    cargo: "Responsável técnico pelo diagnóstico e pela plataforma",
    lead: "Quem já construiu — e vendeu — a operação contábil que hoje lê o balanço da sua empresa.",
    bio: "Contador com mais de 20 anos em tributos e finanças corporativas, Fernando foi sócio da RSM Brasil BPS, uma das maiores operações de BPO contábil do país, vendida para a TMF Group. Fundou e vendeu ainda a HubCount, de automação contábil, adquirida pela Stone Co., e a AccountTech, adquirida pela Contabilizei — três exits concluídos. Essa trajetória explica o desenho da plataforma: quem passou duas décadas respondendo por número de cliente não aceita cálculo que não se reconstitui. Na Transacione, responde pelo diagnóstico, pela apuração da capacidade efetiva e pelo versionamento dos motores de cálculo.",
    credenciais: [
      "Contador, mais de 20 anos em tributário, contábil e finanças corporativas",
      "Ex-sócio da RSM Brasil e do TMF Group",
      "Sócio da RSM Brasil BPS — vendida para a TMF Group",
      "Fundador da HubCount — adquirida pela Stone Co.",
      "Fundador da AccountTech — adquirida pela Contabilizei",
      "Passagem por Deloitte em consultoria",
      "Responsável pelo diagnóstico em 48 horas e pela plataforma",
      "Constrói e versiona os motores de cálculo com o time",
    ],
  },
];

/* --------------------------------------------------------------- Números */

export const INDICADORES = [
  { valor: "22", unidade: "anos", rotulo: "de atuação em direito tributário" },
  { valor: "100", unidade: "+", rotulo: "projetos de transação conduzidos no campo" },
  { valor: "2", unidade: "esferas", rotulo: "PGFN e PGE-SP, com motor próprio em cada" },
  { valor: "48", unidade: "horas", rotulo: "para concluir o diagnóstico técnico" },
];
