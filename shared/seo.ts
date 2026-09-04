/**
 * Fonte única de metadados por rota.
 *
 * Consumido em dois lugares:
 *  - client/src/lib/seo.ts        → aplica no <head> durante a navegação SPA
 *  - script/prerender.ts          → gera um HTML estático por rota no build,
 *                                   com head completo, JSON-LD e conteúdo
 *                                   crítico em <noscript> (SEO + GEO)
 */

export const SITE = {
  nome: "Transacione",
  nomeLegal: "CORREA Consultoria Empresarial Estratégica",
  url: "https://www.transacione.com.br",
  descricaoCurta:
    "Aferição, revisão e negociação de transação tributária federal (PGFN) e estadual (PGE-SP), com motores de cálculo determinísticos e análise jurídica e contábil.",
  telefone: "+55 11 4000-0000",
  whatsapp: "5511940000000",
  email: "contato@transacione.com.br",
  emailParceiros: "parceiros@transacione.com.br",
  endereco: {
    rua: "Av. Paulista, 1000",
    complemento: "Conj. 101",
    bairro: "Bela Vista",
    cidade: "São Paulo",
    uf: "SP",
    cep: "01310-100",
    pais: "BR",
  },
  og: "/og.png",
  idioma: "pt-BR",
} as const;

export interface FaqItem {
  pergunta: string;
  resposta: string;
}

export interface RotaSeo {
  path: string;
  titulo: string;
  tituloOg?: string;
  descricao: string;
  h1: string;
  /** Resposta objetiva de 1–3 frases. É o bloco que os modelos de IA citam. */
  resumo: string;
  /** Palavras-chave alvo — usadas no relatório de linha de base, não em meta keywords. */
  intencao: string[];
  faq?: FaqItem[];
  tipo?: "WebPage" | "Service" | "AboutPage" | "CollectionPage" | "ContactPage";
  /** Pontos citáveis, renderizados em <noscript> e no bloco de resposta da página. */
  pontos?: string[];
  atualizado?: string;
  noindex?: boolean;
}

export const ATUALIZADO = "2026-09-04";

export const ROTAS: RotaSeo[] = [
  {
    path: "/",
    titulo:
      "Transacione | Transação tributária federal (PGFN) e estadual (PGE-SP)",
    descricao:
      "Sua dívida tributária pode custar menos. Aferimos a classificação usada pela PGFN e pela PGE-SP, pedimos revisão quando cabível e estruturamos a transação. Diagnóstico técnico em 48 horas.",
    h1: "Sua dívida com o governo pode custar bem menos do que custa hoje",
    resumo:
      "A União (PGFN) e o Estado de São Paulo (PGE-SP) negociam dívidas tributárias inscritas com desconto sobre juros, multa e encargos, entrada facilitada e prazo alongado. O tamanho do desconto depende de uma classificação atribuída ao contribuinte — CAPAG na esfera federal, grau de recuperabilidade na estadual — e essa classificação é presumida por sistema, podendo não refletir a realidade econômico-financeira da empresa. A própria legislação admite pedido de revisão.",
    intencao: [
      "transação tributária com desconto",
      "negociar dívida tributária empresa",
      "desconto dívida ativa da União",
    ],
    tipo: "WebPage",
    pontos: [
      "Descontos de até 65% (PGFN, regra geral) e até 75% em hipóteses específicas, incidentes sobre juros, multa e encargos legais — nunca sobre o principal.",
      "Descontos de até 60% do valor total do débito na PGE-SP, e até 75% para ME/EPP e empresas em recuperação judicial.",
      "Parcelamento em até 120 meses pela regra geral e até 145 meses nas hipóteses previstas — contra 60 meses do parcelamento ordinário.",
      "Diagnóstico técnico concluído em 48 horas, que pode concluir pela ausência de espaço de revisão e apresentar os fundamentos dessa conclusão.",
      "Base normativa: Lei 13.988/2020 e Portaria PGFN 6.757/2022 (federal); Lei estadual 17.843/2023 e Resolução PGE 6/2024 (estadual).",
    ],
    faq: [
      {
        pergunta: "O que é transação tributária?",
        resposta:
          "Transação tributária é o acordo, previsto em lei, entre o contribuinte e a Fazenda Pública para extinguir litígios e liquidar créditos inscritos em dívida ativa mediante concessões recíprocas. Na esfera federal é regida pela Lei nº 13.988/2020 e pela Portaria PGFN nº 6.757/2022; no Estado de São Paulo, pela Lei nº 17.843/2023 e pela Resolução PGE nº 6/2024. As concessões podem incluir desconto sobre juros, multas e encargos legais, entrada reduzida e prazo de pagamento alongado.",
      },
      {
        pergunta: "De quanto pode ser o desconto na transação tributária?",
        resposta:
          "Na esfera federal, os descontos alcançam até 65% do valor total dos créditos pela regra geral e até 75% para pessoa física, ME, EPP, Santas Casas, instituições de ensino e empresas em recuperação judicial, incidindo sobre juros, multas e encargos legais — nunca sobre o principal. No Estado de São Paulo, o teto é de 60% do valor total do débito, e de 75% para ME, EPP e recuperação judicial. O percentual efetivo depende da classificação atribuída ao crédito ou ao contribuinte e dos limites da lei aplicável ao caso.",
      },
      {
        pergunta:
          "Por que a classificação da minha empresa pode estar errada?",
        resposta:
          "Na esfera federal, a PGFN atribui uma Capacidade de Pagamento (CAPAG) presumida, calculada por sistema parametrizado a partir de dados declarados, que não considera a situação econômico-financeira global da empresa. Na esfera estadual, a PGE-SP apura o grau de recuperabilidade por critérios objetivos (NF = G + P + H + I) que podem não refletir a realidade do crédito. Em ambos os casos a norma admite requerer a revisão: a Portaria PGFN nº 6.757/2022 prevê a apuração da capacidade efetiva a partir das demonstrações contábeis, e a Resolução PGE nº 6/2024 admite o pedido de revisão do grau.",
      },
      {
        pergunta: "Em quanto tempo sai o diagnóstico?",
        resposta:
          "Em 48 horas a partir da entrega dos documentos. O diagnóstico informa se há espaço de economia, de quanto, ou por que não há. Não é promessa de resultado: quando a análise conclui que não cabe revisão, essa conclusão é registrada com os fundamentos correspondentes.",
      },
      {
        pergunta: "Minha empresa já fez transação. Ainda vale analisar?",
        resposta:
          "Sim. Há três caminhos possíveis: repactuação das condições vigentes, revisão do que já foi feito — inclusive quanto à modalidade escolhida — e uso de precatório para amortizar até 75% do débito consolidado após os descontos.",
      },
    ],
  },
  {
    path: "/como-funciona",
    titulo: "Como funciona a transação tributária | Transacione",
    descricao:
      "O método em quatro etapas: anamnese do passivo, extração assistida com conferência humana, análise pelos motores estadual e federal, e negociação até a homologação.",
    h1: "Como funciona, do documento ao acordo homologado",
    resumo:
      "O trabalho tem quatro etapas: (1) diagnóstico em 48 horas a partir dos documentos enviados; (2) pedido de revisão da classificação, com fundamentação jurídica, contábil e econômica; (3) estruturação e protocolo da transação; (4) acompanhamento até a homologação. A cada etapa o contribuinte decide se avança, com os números na mesa.",
    intencao: [
      "como funciona a transação tributária",
      "passo a passo transação tributária PGFN",
      "quais documentos para transação tributária",
    ],
    tipo: "Service",
    pontos: [
      "Etapa 1 — Anamnese: levantamento do passivo em aberto, transacionado, parcelado e do histórico de recolhimento.",
      "Etapa 2 — Documentos: extratos de CAPAG, Regularize, e-CAC e PGE-SP, além de ECD, ECF e EFD.",
      "Etapa 3 — Extração: leitura assistida por IA com citação literal do trecho de origem e aprovação humana de cada dado antes de entrar no cálculo.",
      "Etapa 4 — Análise: motores estadual e federal, com cenários e análise de sensibilidade.",
      "Etapa 5 — Resultado: classificação apurada, cenários aplicáveis e economia potencial — ou o registro fundamentado da ausência dela.",
    ],
    faq: [
      {
        pergunta: "Quais documentos são necessários para o diagnóstico?",
        resposta:
          "Extrato de CAPAG e situação fiscal do Regularize e do e-CAC na esfera federal; extratos da dívida ativa na PGE-SP na esfera estadual; e as escriturações contábeis e fiscais — ECD, ECF e EFD — do período relevante. O envio é feito por link gerado pela plataforma, com o arquivo cifrado na origem.",
      },
      {
        pergunta: "Preciso entender de direito tributário para contratar?",
        resposta:
          "Não. A empresa envia os documentos pelo link gerado pela plataforma e a equipe conduz o restante. A cada etapa é apresentado um ponto de decisão com números, e nada avança sem aprovação do contribuinte.",
      },
    ],
  },
  {
    path: "/transacao-federal",
    titulo:
      "Transação tributária federal PGFN | Revisão de CAPAG | Transacione",
    descricao:
      "Revisão da Capacidade de Pagamento presumida para a efetiva, escolha da melhor modalidade no sistema multiportas da PGFN e estruturação da proposta individual. Lei 13.988/2020 e Portaria PGFN 6.757/2022.",
    h1: "Transação tributária federal: a CAPAG define o desconto — e pode estar errada",
    resumo:
      "A PGFN atribui à empresa uma Capacidade de Pagamento (CAPAG) presumida, apurada por sistema parametrizado. É essa classificação que determina se haverá desconto, qual a entrada e qual o prazo. A Portaria PGFN nº 6.757/2022 admite a apuração da capacidade efetiva a partir das demonstrações contábeis, por metodologias oficiais — análise da Geração de Resultados Futuros (GRF) e do Patrimônio Líquido Realizável (PLR). A reclassificação é o que costuma destravar as maiores reduções.",
    intencao: [
      "revisão de CAPAG",
      "CAPAG presumida e efetiva PGFN",
      "desconto dívida ativa da União",
      "transação individual PGFN",
    ],
    tipo: "Service",
    pontos: [
      "CAPAG-P (presumida) é reconstituída a partir do extrato fornecido pela PGFN; CAPAG-E (efetiva) é apurada das demonstrações por metodologias oficiais.",
      "O grau resulta da cobertura da dívida pela capacidade apurada e define as condições disponíveis.",
      "Sistema multiportas: adesão por edital, transação individual, transação de pequeno valor e relevante e disseminada controvérsia — comparamos desconto, entrada e prazo de cada porta.",
      "Descontos de até 65% pela regra geral e até 75% para PF, ME/EPP, Santas Casas, instituições de ensino e recuperação judicial, incidentes sobre juros, multas e encargos legais.",
      "Até 120 parcelas pela regra geral e até 145 nas hipóteses específicas; contribuições previdenciárias limitadas a 60 parcelas por vedação constitucional.",
      "Amortização com prejuízo fiscal e base negativa de CSLL (até 70% do saldo) e uso de precatórios.",
      "Base normativa: Lei nº 13.988/2020 e Portaria PGFN nº 6.757/2022, arts. 43 e 44.",
    ],
    faq: [
      {
        pergunta: "O que é CAPAG na PGFN?",
        resposta:
          "CAPAG é a Capacidade de Pagamento atribuída pela Procuradoria-Geral da Fazenda Nacional ao contribuinte para fins de transação tributária. Ela é presumida — calculada por sistema parametrizado a partir de dados declarados — e determina a faixa de desconto, o valor da entrada e o prazo disponíveis. A Portaria PGFN nº 6.757/2022 admite a revisão dessa capacidade para refletir a realidade econômico-financeira efetiva da empresa.",
      },
      {
        pergunta: "Como pedir a revisão da CAPAG?",
        resposta:
          "A revisão é requerida com fundamentação jurídica e econômico-financeira, demonstrando a capacidade efetiva apurada das demonstrações contábeis por metodologias oficiais — notadamente a análise da Geração de Resultados Futuros (GRF) e do Patrimônio Líquido Realizável (PLR). O pedido é peça técnica com sede normativa citada, instruída com os documentos que sustentam cada número.",
      },
      {
        pergunta:
          "O desconto da transação federal incide sobre o valor principal?",
        resposta:
          "Não. Na esfera federal os descontos alcançam juros, multas e encargos legais. O valor principal do tributo não é objeto de redução. O que reduz o montante devido além disso são a amortização com prejuízo fiscal e base negativa de CSLL e o uso de precatórios.",
      },
      {
        pergunta: "Qual a diferença entre adesão por edital e transação individual?",
        resposta:
          "Na adesão por edital as condições são pré-fixadas pela PGFN e o contribuinte adere aos termos publicados, para os débitos elegíveis. Na transação individual a proposta é construída sobre a capacidade de pagamento apurada do caso concreto, exigindo a totalidade das inscrições elegíveis. A escolha entre as portas muda o resultado, e por isso é comparada antes de protocolar.",
      },
    ],
  },
  {
    path: "/transacao-estadual",
    titulo:
      "Transação tributária estadual PGE-SP | Grau de recuperabilidade | Transacione",
    descricao:
      "Aferição e revisão do grau de recuperabilidade (NF = G + P + H + I) na PGE-SP, Acordo Paulista e proposta individual. Lei estadual 17.843/2023 e Resolução PGE 6/2024.",
    h1: "Transação tributária estadual: o grau de recuperabilidade define o desconto",
    resumo:
      "A PGE-SP atribui ao crédito inscrito uma nota final composta por quatro critérios objetivos — NF = G + P + H + I: grau de garantia, parcelamentos, histórico de recolhimento e idade das inscrições. É essa nota que define a faixa de recuperabilidade e, com ela, o desconto, a entrada e o prazo. Quanto maior a nota, maior o grau e menor o desconto. A Resolução PGE nº 6/2024 admite requerer a revisão do grau quando ele está subestimado em relação à realidade do crédito.",
    intencao: [
      "acordo paulista ICMS",
      "grau de recuperabilidade PGE-SP",
      "revisão do grau de recuperabilidade",
      "transação tributária estadual São Paulo",
    ],
    tipo: "Service",
    pontos: [
      "NF = G + P + H + I — grau de garantia, parcelamentos, histórico de recolhimento e idade das inscrições, com cada critério aberto e justificado.",
      "Reclassificação quando NF ≥ 3; o corte de classificação muda a faixa de recuperabilidade e, com ela, o desconto disponível.",
      "Descontos de até 60% do valor total do débito e até 75% para ME/EPP e recuperação judicial, incidentes sobre multas, juros e honorários — não sobre o principal.",
      "Até 120 parcelas pela regra e 145 para ME/EPP e recuperação judicial; garantia exigida a partir de 60 meses de parcelamento.",
      "Quitação com precatórios e créditos acumulados de ICMS em até 75% do débito consolidado.",
      "Base normativa: Lei estadual nº 17.843/2023 e Resolução PGE nº 6/2024, art. 34 e seguintes.",
    ],
    faq: [
      {
        pergunta: "O que é o grau de recuperabilidade da PGE-SP?",
        resposta:
          "É a classificação atribuída pela Procuradoria-Geral do Estado de São Paulo ao crédito inscrito em dívida ativa, apurada pela nota final NF = G + P + H + I, composta pelo grau de garantia, pelos parcelamentos, pelo histórico de recolhimento e pela idade das inscrições. A faixa resultante — de créditos de alta recuperabilidade a irrecuperáveis — determina o desconto, a entrada e o prazo admitidos na transação.",
      },
      {
        pergunta: "É possível revisar o grau de recuperabilidade?",
        resposta:
          "Sim. A Resolução PGE nº 6/2024 admite o pedido de revisão do grau. A aferição prévia mostra qual dos quatro critérios está puxando a nota para cima e quanto ele precisaria mudar para reabrir o desconto, permitindo instruir o pedido com fundamentação técnica. Aferir e revisar antes de negociar pode alterar uma situação de desconto zero para um desconto expressivo.",
      },
      {
        pergunta: "O que é o Acordo Paulista?",
        resposta:
          "É a modalidade de transação por adesão do Estado de São Paulo, com condições pré-fixadas em edital para os débitos elegíveis, instituída no âmbito da Lei nº 17.843/2023. É uma das portas disponíveis; a outra é a proposta individual, que na esfera estadual não exige a totalidade das inscrições — é possível selecionar quais entram na negociação.",
      },
    ],
  },
  {
    path: "/tecnologia",
    titulo:
      "A tecnologia: motores determinísticos e rastreabilidade | Transacione",
    descricao:
      "Motores de cálculo determinísticos com parâmetros versionados por vigência, extração assistida com citação literal, gate de aprovação humana e trilha somente-anexação.",
    h1: "A tecnologia acelera e prova. Os profissionais decidem e sustentam",
    resumo:
      "Os motores de cálculo da Transacione são determinísticos: a mesma entrada com os mesmos parâmetros produz sempre o mesmo resultado. A inteligência artificial atua apenas na leitura assistida dos documentos, sempre com citação literal do trecho de origem exibido lado a lado, e nenhum valor alimenta o cálculo antes de ser conferido e aprovado por uma pessoa. Todo número do laudo pode ser reconstituído até o documento, o trecho e quem aprovou.",
    intencao: [
      "software transação tributária",
      "cálculo determinístico CAPAG",
      "rastreabilidade laudo tributário",
    ],
    tipo: "Service",
    pontos: [
      "O cálculo não usa IA: é regra parametrizada, com fórmula e critério visíveis. Nenhum valor vem de estimativa.",
      "Parâmetros versionados por vigência datada — a data do caso define a versão da norma aplicável.",
      "Extração com citação literal: cada dado extraído carrega o trecho de origem do documento, exibido para conferência.",
      "Gate de aprovação humana antes de qualquer número entrar no cálculo.",
      "Trilha somente-anexação: registro de quem fez o quê e quando, sem exclusão.",
      "Segurança: arquivo cifrado na origem, segregação por cliente, acesso por perfil e compartilhamento externo com prazo de validade.",
    ],
    faq: [
      {
        pergunta: "A inteligência artificial calcula o desconto?",
        resposta:
          "Não. A IA faz apenas a leitura assistida dos documentos, extraindo cada valor com o trecho literal de origem, exibido lado a lado para conferência. O cálculo é feito por motores determinísticos, com regra parametrizada, fórmula e critério visíveis — a mesma entrada e os mesmos parâmetros produzem sempre o mesmo resultado. Nada alimenta o cálculo antes de ser conferido e aprovado por uma pessoa.",
      },
      {
        pergunta: "Como os documentos da empresa são protegidos?",
        resposta:
          "O arquivo é cifrado na origem e vai direto ao armazenamento, sem trafegar pelo servidor da aplicação. Cada empresa opera em ambiente segregado, sem visibilidade entre clientes em nenhuma camada. O acesso é por perfil — quem não tem permissão não enxerga a entrada — e todo evento é registrado em trilha somente-anexação. O compartilhamento externo é feito por link com validade definida. O trabalho está sujeito ao dever de sigilo profissional, com responsáveis identificados.",
      },
    ],
  },
  {
    path: "/parceiros",
    titulo: "Parceria para contadores e escritórios | Transacione",
    descricao:
      "Amplie os serviços da sua carteira sem montar estrutura técnica. Radar de oportunidades, material comercial pronto e diagnóstico em 48 horas para o seu cliente.",
    h1: "Para contadores e escritórios: a oportunidade está na sua carteira",
    resumo:
      "O parceiro identifica na própria base os clientes com passivo inscrito na PGFN ou na PGE-SP, apresenta a oportunidade com material pronto e encaminha o caso. A Transacione conduz o diagnóstico, a revisão e a execução; o parceiro acompanha e mantém a relação com o cliente — sem montar estrutura técnica nem assumir o risco de execução.",
    intencao: [
      "parceria transação tributária",
      "parceria contador escritório tributário",
      "indicar cliente transação tributária",
    ],
    tipo: "Service",
    pontos: [
      "Radar de oportunidades: débito antigo ou classificado como de difícil recuperação, ME/EPP ou recuperação judicial, cliente que já transacionou, quem tem ou pode adquirir precatório, débito já ajuizado em execução fiscal e grupo econômico com passivo nas duas esferas.",
      "Três passos para o parceiro: identifica na carteira, apresenta com o material fornecido e encaminha o caso.",
      "Prazo concreto para prometer ao cliente: diagnóstico em 48 horas.",
      "O parceiro amplia os serviços à sua base sem estrutura técnica própria e sem risco de execução.",
    ],
    faq: [
      {
        pergunta: "Como funciona a parceria com contadores?",
        resposta:
          "O parceiro identifica na carteira os clientes com passivo inscrito na PGFN ou na PGE-SP e encaminha o caso com o material comercial fornecido. A Transacione executa o diagnóstico em 48 horas, o pedido de revisão da classificação e a estruturação da transação. O parceiro acompanha o processo e mantém a relação com o cliente.",
      },
      {
        pergunta: "O parceiro precisa de estrutura técnica própria?",
        resposta:
          "Não. A análise jurídica, contábil e econômica e a execução do caso ficam com a Transacione. O parceiro contribui com o conhecimento da carteira e com a relação de confiança já construída com o cliente.",
      },
    ],
  },
  {
    path: "/quem-somos",
    titulo: "Quem conduz | Transacione",
    descricao:
      "Direito tributário e competência contábil, fiscal e de tecnologia. Conheça os responsáveis técnicos pela metodologia e pelos motores de cálculo da Transacione.",
    h1: "Duas competências que o tema exige juntas",
    resumo:
      "A Transacione nasce de 22 anos de atuação em direito tributário e de mais de 20 anos em contabilidade, tributos e finanças corporativas. A tecnologia foi desenvolvida por quem já conduzia esses casos — advogados tributaristas e contadores — e é a experiência de campo destilada em parâmetros, cálculo e prova.",
    intencao: ["quem é a Transacione", "responsáveis técnicos transação tributária"],
    tipo: "AboutPage",
    pontos: [
      "Eduardo Corrêa da Silva — advogado, mestre em Direito Tributário pela FGV, Presidente da Comissão de Direito Tributário da OAB/SP (2025/27), juiz do Tribunal de Impostos e Taxas do Estado de São Paulo.",
      "Fernando Lucas Corrêa — contador, mais de 20 anos em tributos e finanças, ex-sócio da RSM Brasil e do TMF Group, três exits concluídas como fundador.",
      "22 anos de atuação em direito tributário: contencioso, planejamento e consultoria.",
      "Mais de 100 projetos de transação e recuperabilidade conduzidos no campo.",
      "Duas esferas — PGFN e PGE-SP — com norma, critério e motor próprios em cada uma.",
    ],
  },
  {
    path: "/conteudo",
    titulo: "Central de conteúdo | Transacione",
    descricao:
      "Análises técnicas sobre transação tributária federal e estadual: CAPAG, grau de recuperabilidade, precatórios, depuração da dívida ativa e escolha de modalidade.",
    h1: "Central de conteúdo",
    resumo:
      "Material técnico sobre transação tributária nas esferas federal e estadual, com base normativa citada em cada análise.",
    intencao: ["blog transação tributária", "artigos dívida ativa PGFN PGE-SP"],
    tipo: "CollectionPage",
  },
  {
    path: "/diagnostico",
    titulo: "Diagnóstico de elegibilidade | Transacione",
    descricao:
      "Responda quatro perguntas e descubra em menos de um minuto se o passivo da sua empresa comporta um diagnóstico técnico de transação tributária.",
    h1: "Descubra em um minuto se cabe um diagnóstico técnico",
    resumo:
      "Um questionário curto verifica esfera, faixa de passivo, regime tributário e situação da dívida antes de qualquer análise técnica. O resultado indica se o caso comporta diagnóstico — e, quando não comporta, diz por quê.",
    intencao: ["diagnóstico transação tributária", "minha empresa pode transacionar"],
    tipo: "ContactPage",
  },
  {
    path: "/privacidade",
    titulo: "Política de privacidade | Transacione",
    descricao:
      "Como a Transacione trata dados pessoais, com que finalidade, por quanto tempo e quais são os direitos do titular sob a LGPD (Lei nº 13.709/2018).",
    h1: "Política de privacidade",
    resumo:
      "Descreve as finalidades do tratamento de dados pessoais realizado pela Transacione, as bases legais, os prazos de retenção e os direitos do titular previstos na Lei nº 13.709/2018.",
    intencao: [],
    tipo: "WebPage",
  },
  {
    path: "/termos",
    titulo: "Termos de uso | Transacione",
    descricao:
      "Condições de uso do site da Transacione, natureza informativa do conteúdo e limites da relação estabelecida por meio dos formulários.",
    h1: "Termos de uso",
    resumo:
      "Estabelece as condições de uso do site, a natureza informativa do conteúdo publicado e os limites da relação estabelecida por meio dos formulários.",
    intencao: [],
    tipo: "WebPage",
  },
  {
    path: "/cookies",
    titulo: "Aviso de cookies | Transacione",
    descricao:
      "Quais cookies o site da Transacione utiliza, para que servem e como o visitante pode gerenciá-los.",
    h1: "Aviso de cookies",
    resumo:
      "Relaciona os cookies utilizados no site, sua finalidade e as opções de gerenciamento disponíveis ao visitante.",
    intencao: [],
    tipo: "WebPage",
  },
];

export const rotaPorPath = (p: string): RotaSeo | undefined =>
  ROTAS.find((r) => r.path === p);
