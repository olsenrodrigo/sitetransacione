/** A jornada institucional, compartilhada pelas páginas e pelos metadados. */
export const JORNADA = [
  {
    numero: "01",
    titulo: "Gestão da dívida tributária",
    resumo: "Transacionar agora ou administrar com responsabilidade? O diagnóstico decide.",
    detalhe: "Mapeamos dívidas, acordos, garantias e fluxo de caixa. A análise indica o momento de negociar e as medidas para administrar o passivo enquanto isso.",
  },
  {
    numero: "02",
    titulo: "Transação: adesão ou repactuação",
    resumo: "Edital, revisão de grau ou CAPAG e proposta individual: a porta depende do caso.",
    detalhe: "Comparamos as modalidades e, quando cabível, pedimos revisão da classificação. Estruturamos a adesão, a proposta individual ou a repactuação do acordo existente.",
  },
  {
    numero: "03",
    titulo: "Amortização da dívida com deságio",
    resumo: "Avaliamos o precatório para reduzir o desembolso sobre o saldo já negociado.",
    detalhe: "Simulamos a aquisição do crédito com deságio, os custos e o saldo elegível em São Paulo e na União. Na esfera federal, a análise também pode abranger parcelas vincendas do acordo.",
  },
  {
    numero: "04",
    titulo: "Encontro de contas com precatório",
    resumo: "Da análise do título e da cessão à validação, ao encontro de contas e à liquidação.",
    detalhe: "Conduzimos a due diligence, a regularização do crédito e os requerimentos ao órgão competente. Acompanhamos a utilização reconhecida e a liquidação do passivo, inclusive eventual remanescente.",
  },
] as const;

export const CONTINUIDADE = "Uma gestão contínua: monitoramento dos acordos, novas dívidas e oportunidades de renegociação alimentam o próximo ciclo.";

export const FONTES_PRECATORIOS = {
  estadual: "https://www.al.sp.gov.br/repositorio/legislacao/lei/2023/lei-17843-07.11.2023.html",
  federal: "https://www.gov.br/pt-br/servicos/utilizar-precatorios-federais-para-pagamento-divida-ativa-da-uniao",
} as const;
