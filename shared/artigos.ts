/**
 * Central de conteúdo — artigos técnicos.
 *
 * Estrutura em blocos (e não HTML) por três razões: renderização sem
 * dangerouslySetInnerHTML, extração de texto puro para o <noscript> da
 * pré-renderização, e reaproveitamento dos blocos de pergunta e resposta
 * como FAQPage nos dados estruturados.
 */

export type Bloco =
  | { t: "p"; c: string }
  | { t: "h2"; c: string }
  | { t: "h3"; c: string }
  | { t: "ul"; itens: string[] }
  | { t: "ol"; itens: string[] }
  | { t: "quote"; c: string }
  | { t: "nota"; c: string }
  | { t: "tabela"; cabecalho: string[]; linhas: string[][] };

export interface Artigo {
  slug: string;
  titulo: string;
  tituloSeo: string;
  descricao: string;
  /** Resposta direta em 2–4 frases. É o trecho que buscadores e modelos citam. */
  resposta: string;
  categoria: "Federal" | "Estadual" | "Método" | "Precatórios";
  publicado: string;
  atualizado: string;
  leitura: number;
  autor: string;
  intencao: string[];
  corpo: Bloco[];
  faq?: { pergunta: string; resposta: string }[];
}

export const ARTIGOS: Artigo[] = [
  {
    slug: "revisao-de-capag-pgfn",
    titulo: "Revisão de CAPAG na PGFN: quando a classificação presumida não reflete a empresa",
    tituloSeo:
      "Revisão de CAPAG na PGFN: como funciona e quando cabe | Transacione",
    descricao:
      "A CAPAG presumida é calculada por sistema e define desconto, entrada e prazo. Entenda a diferença para a capacidade efetiva, a base normativa da revisão e o que precisa ser demonstrado.",
    resposta:
      "A Capacidade de Pagamento (CAPAG) atribuída pela PGFN é presumida: sai de um sistema parametrizado que não enxerga a situação econômico-financeira global da empresa. Como é ela que define a faixa de desconto, a entrada e o prazo da transação, uma presunção acima da realidade fecha o desconto antes da negociação começar. A Portaria PGFN nº 6.757/2022 admite a apuração da capacidade efetiva a partir das demonstrações contábeis, por metodologias oficiais — e é essa reclassificação que costuma destravar as maiores reduções.",
    categoria: "Federal",
    publicado: "2026-08-12",
    atualizado: "2026-09-04",
    leitura: 7,
    autor: "Equipe técnica Transacione",
    intencao: [
      "revisão de CAPAG",
      "CAPAG presumida efetiva",
      "como pedir revisão de CAPAG PGFN",
    ],
    corpo: [
      {
        t: "p",
        c: "Toda transação tributária federal começa por uma classificação que a empresa não escolheu e, quase sempre, não conferiu. A Procuradoria-Geral da Fazenda Nacional atribui ao contribuinte uma Capacidade de Pagamento — a CAPAG — e é essa nota, e não o tamanho do passivo, que determina se haverá desconto, qual será a entrada e em quantas parcelas o débito pode ser pago.",
      },
      { t: "h2", c: "O que a CAPAG presumida enxerga — e o que ela não enxerga" },
      {
        t: "p",
        c: "A CAPAG presumida é calculada por sistema, a partir de dados declarados e de parâmetros fixos. É um método de massa: precisa classificar milhões de contribuintes sem análise individual. O efeito colateral é conhecido de quem trabalha com o instituto — a presunção captura mal empresas cuja realidade econômico-financeira global se afasta do que os dados declarados sugerem isoladamente.",
      },
      {
        t: "ul",
        itens: [
          "Grupos econômicos cujo resultado consolidado difere significativamente do resultado da pessoa jurídica devedora.",
          "Empresas com ativo relevante, porém sem liquidez — o patrimônio existe, mas não se converte em caixa no horizonte da transação.",
          "Empresas em recuperação de margem após ciclo de prejuízo, cujo desempenho recente não representa a capacidade projetada.",
          "Passivos que já foram objeto de parcelamento e cujo histórico distorce a leitura automática.",
        ],
      },
      { t: "h2", c: "CAPAG-P, CAPAG-E e o grau de cobertura" },
      {
        t: "p",
        c: "Na prática, três grandezas conversam. A CAPAG-P é a presumida, reconstituída a partir do extrato fornecido pela própria PGFN. A CAPAG-E é a efetiva, apurada das demonstrações contábeis por metodologias oficiais — notadamente a análise da Geração de Resultados Futuros (GRF) e do Patrimônio Líquido Realizável (PLR). O grau resulta da cobertura da dívida pela capacidade apurada e é ele que define, ao final, as condições disponíveis.",
      },
      {
        t: "quote",
        c: "Revisar a CAPAG não é pedir um favor. É demonstrar, com documento e método, que o número usado como premissa da negociação não corresponde à empresa.",
      },
      { t: "h2", c: "O que precisa ser demonstrado" },
      {
        t: "p",
        c: "O pedido de revisão é peça técnica, não petição de intenções. Ele precisa reconstituir o cálculo da presumida, apresentar a apuração da efetiva pelas metodologias admitidas e explicar, item a item, a origem de cada divergência — sempre com o documento de suporte identificado.",
      },
      {
        t: "ol",
        itens: [
          "Reconstituição da CAPAG-P a partir do extrato da PGFN, isolando as variáveis que a sustentam.",
          "Apuração da CAPAG-E sobre as demonstrações contábeis (ECD e ECF) e as escriturações fiscais do período relevante.",
          "Análise de sensibilidade: qual variável sustenta a classificação atual e quanto ela precisaria variar para mudar de faixa.",
          "Fundamentação jurídica com sede normativa citada e fundamentação econômico-financeira com memória de cálculo aberta.",
        ],
      },
      { t: "h2", c: "Onde o desconto incide" },
      {
        t: "p",
        c: "Vale repetir, porque é a confusão mais comum: na esfera federal os descontos alcançam juros, multas e encargos legais — não o principal. A regra geral admite até 65% de redução, e até 75% em hipóteses específicas como pessoa física, ME, EPP, Santas Casas, instituições de ensino e empresas em recuperação judicial. O que reduz o montante além disso são a amortização com prejuízo fiscal e base negativa de CSLL, admitida em até 70% do saldo, e o uso de precatórios.",
      },
      {
        t: "nota",
        c: "Percentuais e prazos conforme a classificação apurada e os limites da norma aplicável ao caso concreto. Este conteúdo é informativo e não constitui promessa de resultado.",
      },
    ],
    faq: [
      {
        pergunta: "Qual a base normativa da revisão de CAPAG?",
        resposta:
          "A Lei nº 13.988/2020 institui a transação tributária no âmbito federal e a Portaria PGFN nº 6.757/2022 disciplina a matéria, prevendo a apuração da capacidade de pagamento e a possibilidade de sua revisão para refletir a situação econômico-financeira efetiva do contribuinte.",
      },
      {
        pergunta: "A revisão de CAPAG garante desconto maior?",
        resposta:
          "Não. A revisão é um pedido técnico cujo resultado depende do que as demonstrações contábeis efetivamente demonstram e da avaliação da PGFN. Um diagnóstico sério pode concluir que não há espaço de revisão — e essa conclusão, com os fundamentos, também é um resultado útil, porque evita despesa e expectativa sem lastro.",
      },
      {
        pergunta: "Quanto tempo leva para saber se há espaço de revisão?",
        resposta:
          "Com os documentos em mãos — extrato de CAPAG, situação fiscal e escriturações ECD, ECF e EFD — o diagnóstico técnico é concluído em 48 horas.",
      },
    ],
  },
  {
    slug: "grau-de-recuperabilidade-pge-sp",
    titulo: "Grau de recuperabilidade na PGE-SP: como a nota NF = G + P + H + I define o seu desconto",
    tituloSeo:
      "Grau de recuperabilidade PGE-SP: a fórmula NF = G+P+H+I | Transacione",
    descricao:
      "Os quatro critérios que compõem a nota final do crédito inscrito na dívida ativa paulista, o corte de classificação e quando cabe pedir a revisão do grau.",
    resposta:
      "A PGE-SP atribui a cada crédito inscrito uma nota final composta por quatro critérios objetivos — NF = G + P + H + I: grau de garantia, parcelamentos, histórico de recolhimento e idade das inscrições. Essa nota define a faixa de recuperabilidade do crédito e, com ela, o desconto, a entrada e o prazo admitidos. Quanto maior a nota, maior o grau e menor o desconto; por isso, aferir e, quando cabível, revisar o grau antes de negociar pode alterar uma situação de desconto zero para um desconto expressivo.",
    categoria: "Estadual",
    publicado: "2026-08-19",
    atualizado: "2026-09-04",
    leitura: 6,
    autor: "Equipe técnica Transacione",
    intencao: [
      "grau de recuperabilidade PGE-SP",
      "NF = G + P + H + I",
      "revisão do grau de recuperabilidade",
      "acordo paulista ICMS",
    ],
    corpo: [
      {
        t: "p",
        c: "No Estado de São Paulo, o desconto da transação tributária não é uma faixa negociada caso a caso na mesa. Ele decorre de uma classificação prévia do crédito, apurada por fórmula. Entender essa fórmula é entender onde está o espaço — e onde não está.",
      },
      { t: "h2", c: "Os quatro critérios" },
      {
        t: "tabela",
        cabecalho: ["Critério", "O que mede"],
        linhas: [
          ["G — grau de garantia", "A existência e a qualidade das garantias vinculadas às inscrições."],
          ["P — parcelamentos", "O histórico de parcelamentos do débito e o comportamento neles."],
          ["H — histórico de recolhimento", "A regularidade do contribuinte no recolhimento ao longo do tempo."],
          ["I — idade das inscrições", "Há quanto tempo o crédito está inscrito em dívida ativa."],
        ],
      },
      {
        t: "p",
        c: "A soma compõe a nota final. A recuperabilidade muda de faixa conforme essa nota, e a norma prevê a reclassificação quando NF ≥ 3. A lógica é direta: quanto mais recuperável o Estado considera o crédito, menos motivo há para conceder desconto. Um crédito bem garantido, recente e de contribuinte historicamente adimplente vale mais para a Fazenda — e, por isso mesmo, abre menos espaço de redução.",
      },
      { t: "h2", c: "O insight que muda a conversa" },
      {
        t: "p",
        c: "A aferição prévia não serve só para conhecer a nota. Serve para identificar qual dos quatro critérios está puxando a nota para cima e quanto ele precisaria mudar para reabrir o desconto. Essa é a informação que transforma uma negociação passiva em uma estratégia: cenários de garantia, de parcelamento e de inadimplemento podem ser simulados antes de qualquer protocolo, e cada simulação gravada vira uma versão comparável.",
      },
      { t: "h2", c: "Onde o desconto incide, e até quanto" },
      {
        t: "ul",
        itens: [
          "Limite legal de até 65% de redução do valor total, conforme grau e modalidade.",
          "Limite de até 70% nas hipóteses especiais previstas, como ME, EPP e recuperação judicial.",
          "A redução alcança multas, juros e honorários — não o valor principal.",
          "Parcelamento em até 120 meses pela regra e até 145 meses para ME/EPP e recuperação judicial.",
          "Garantia exigida a partir de 60 meses de parcelamento.",
          "Quitação com precatórios e créditos acumulados de ICMS em até 75% do débito consolidado.",
        ],
      },
      { t: "h2", c: "Antes do desconto, a depuração" },
      {
        t: "p",
        c: "Há um passo que costuma ser pulado e que muda o denominador de tudo: verificar o que de fato deve ser cobrado. A depuração da dívida ativa procura inscrições em duplicidade — o mesmo débito cobrado mais de uma vez — e inscrições cuja idade sugere exame de prescrição, sempre com o parâmetro normativo aplicado e a memória do critério registrada. Indício de prescrição é critério objetivo para direcionar a análise jurídica; o sistema não afirma, e não deve afirmar, prescrição consumada.",
      },
      {
        t: "nota",
        c: "Base normativa: Lei estadual nº 17.843/2023 e Resolução PGE nº 6/2024, art. 34 e seguintes. Percentuais e prazos conforme a classificação e os limites da lei. Não constitui promessa de resultado.",
      },
    ],
    faq: [
      {
        pergunta: "A proposta individual estadual exige incluir todas as inscrições?",
        resposta:
          "Não. Diferentemente da esfera federal, na PGE-SP a proposta individual não exige a totalidade das inscrições — é possível selecionar quais entram na negociação. Essa é uma das diferenças relevantes entre as duas esferas e afeta a estratégia de quem tem passivo nas duas.",
      },
      {
        pergunta: "Vale mais aderir ao Acordo Paulista ou fazer proposta individual?",
        resposta:
          "Depende do caso. A adesão por edital traz condições pré-fixadas e caminho mais curto; a proposta individual permite construir as condições sobre a realidade do crédito e selecionar inscrições. A comparação entre desconto, entrada e prazo de cada porta é feita antes de protocolar qualquer coisa.",
      },
    ],
  },
  {
    slug: "precatorio-para-amortizar-transacao",
    titulo: "Precatório na transação tributária: como amortizar o saldo negociado",
    tituloSeo:
      "Precatório na transação tributária: amortização do saldo | Transacione",
    descricao:
      "Como o precatório próprio ou adquirido de terceiro se aplica ao saldo já reduzido da transação, nas esferas federal e estadual, e qual é a esteira da operação.",
    resposta:
      "O precatório próprio ou adquirido de terceiro pode amortizar o saldo após os descontos da transação. Em São Paulo, a utilização observa o teto de 75% e as condições do acordo. Na União, créditos federais elegíveis podem amortizar ou liquidar o saldo admitido pela PGFN. Cada esfera exige seu próprio procedimento de regularização e validação.",
    categoria: "Precatórios",
    publicado: "2026-08-26",
    atualizado: "2026-09-10",
    leitura: 5,
    autor: "Equipe técnica Transacione",
    intencao: [
      "precatório transação tributária",
      "compensar dívida com precatório",
      "amortizar débito com precatório PGFN",
    ],
    corpo: [
      {
        t: "p",
        c: "O precatório pode integrar a estratégia de quem ainda vai negociar ou já tem uma transação em andamento. O diagnóstico compara a viabilidade da operação com outras medidas, como a repactuação do acordo.",
      },
      { t: "h2", c: "A ordem das operações" },
      {
        t: "p",
        c: "Na transação, primeiro se apura o saldo com os descontos admitidos. Depois se avalia a amortização com o precatório. O teto de 75% é da transação paulista, não uma regra geral federal. Na PGFN, a utilização do crédito elegível pode alcançar a liquidação do saldo admitido; eventual remanescente deve ser pago conforme o acordo.",
      },
      { t: "h2", c: "A esteira da operação" },
      {
        t: "ol",
        itens: [
          "Viabilidade — verificar se a hipótese e a esfera admitem o uso e em que extensão.",
          "Due diligence — exame do título, da cadeia de cessões e das pendências que possam comprometê-lo.",
          "Aquisição ou cessão — quando o precatório não é próprio.",
          "Homologação — reconhecimento do título no procedimento aplicável.",
          "Encontro de contas — imputação do valor ao saldo consolidado da transação.",
          "Liquidação — pagamento do remanescente conforme as condições acordadas.",
        ],
      },
      { t: "h2", c: "Três situações em que vale examinar" },
      {
        t: "ul",
        itens: [
          "A empresa é titular de precatório e não o considerou como ativo de liquidez para o passivo fiscal.",
          "A empresa tem saldo negociado na esfera federal e quer avaliar a liquidação de parcelas vincendas com crédito elegível adquirido de terceiro.",
          "O débito está ajuizado em execução fiscal — mesmo nessa situação há caminho para transacionar e ofertar precatório.",
        ],
      },
      {
        t: "nota",
        c: "Nas hipóteses e formas admitidas pela legislação aplicável a cada esfera e a cada modalidade. Conteúdo informativo; não constitui promessa de resultado nem recomendação de aquisição de ativo.",
      },
    ],
  },
  {
    slug: "sistema-multiportas-pgfn-qual-modalidade",
    titulo: "Sistema multiportas da PGFN: a porta escolhida muda o resultado",
    tituloSeo:
      "Modalidades de transação da PGFN: qual porta escolher | Transacione",
    descricao:
      "Adesão por edital, transação individual, pequeno valor e relevante e disseminada controvérsia. As diferenças que mudam desconto, entrada e prazo.",
    resposta:
      "A PGFN opera um sistema multiportas: há mais de uma modalidade de transação disponível, e a elegibilidade e as condições variam entre elas. A adesão por edital tem condições pré-fixadas e caminho mais curto; a transação individual constrói a proposta sobre a capacidade de pagamento apurada do caso concreto, mas exige a totalidade das inscrições elegíveis. Comparar desconto, entrada e prazo de cada porta antes de protocolar é o que evita fechar na primeira que aparece.",
    categoria: "Federal",
    publicado: "2026-09-01",
    atualizado: "2026-09-04",
    leitura: 5,
    autor: "Equipe técnica Transacione",
    intencao: [
      "modalidades transação tributária PGFN",
      "adesão por edital ou transação individual",
      "transação de pequeno valor PGFN",
    ],
    corpo: [
      {
        t: "p",
        c: "Falar em “a transação da PGFN” no singular esconde a decisão mais consequente do processo. Não há uma transação: há um conjunto de modalidades, com requisitos e condições distintos, e a escolha entre elas move o resultado tanto quanto a classificação do contribuinte.",
      },
      {
        t: "tabela",
        cabecalho: ["Modalidade", "Característica", "Quando costuma pesar"],
        linhas: [
          [
            "Adesão por edital",
            "Condições pré-fixadas em edital (PGDAU), publicadas com frequência.",
            "Débitos elegíveis com perfil aderente ao edital vigente e necessidade de prazo curto.",
          ],
          [
            "Transação individual",
            "Proposta construída sobre a capacidade efetiva; exige a totalidade das inscrições elegíveis.",
            "Passivos relevantes em que a revisão da CAPAG abre faixa melhor que a do edital.",
          ],
          [
            "Pequeno valor",
            "Modalidade específica para débitos de menor valor, por edital.",
            "Passivos abaixo do limite previsto na norma.",
          ],
          [
            "Relevante e disseminada controvérsia",
            "Para teses com controvérsia relevante e disseminada, por edital.",
            "Quando o débito discutido se enquadra na tese objeto do edital.",
          ],
        ],
      },
      { t: "h2", c: "A armadilha da totalidade" },
      {
        t: "p",
        c: "Uma diferença específica costuma pegar quem compara as duas esferas: na proposta individual federal, a norma exige a inclusão da totalidade das inscrições elegíveis. Na estadual, não — é possível selecionar. Para um grupo com passivo nas duas esferas, tratar cada uma isoladamente é o erro mais comum, porque a estratégia de uma restringe a da outra.",
      },
      { t: "h2", c: "O que comparar antes de protocolar" },
      {
        t: "ul",
        itens: [
          "Percentual de desconto efetivo sobre o total devido, e não sobre a rubrica isolada.",
          "Valor da entrada e o impacto imediato no caixa.",
          "Número de parcelas e o valor da parcela contra o fluxo real da empresa.",
          "Exigência de garantia e seu custo.",
          "Efeito sobre litígios em curso e sobre o encerramento das execuções fiscais.",
        ],
      },
      {
        t: "nota",
        c: "Elegibilidade e condições conforme a norma e o edital aplicáveis a cada caso. Lei nº 13.988/2020 e Portaria PGFN nº 6.757/2022.",
      },
    ],
  },
  {
    slug: "onde-a-ia-entra-no-calculo-tributario",
    titulo: "Onde a inteligência artificial entra no cálculo tributário — e onde não entra",
    tituloSeo:
      "IA no cálculo tributário: extração assistida e motor determinístico | Transacione",
    descricao:
      "Por que a extração de dados pode ser assistida por IA e o cálculo não pode. Citação literal, gate de aprovação humana, parâmetros versionados e rastreabilidade.",
    resposta:
      "A inteligência artificial faz a leitura assistida dos documentos: cada valor extraído carrega o trecho literal de origem, exibido lado a lado para conferência. O cálculo não usa IA — é feito por motores determinísticos, com regra parametrizada, fórmula e critério visíveis, de modo que a mesma entrada com os mesmos parâmetros produz sempre o mesmo resultado. Nenhum valor alimenta o cálculo antes de ser conferido e aprovado por uma pessoa.",
    categoria: "Método",
    publicado: "2026-09-02",
    atualizado: "2026-09-04",
    leitura: 6,
    autor: "Equipe técnica Transacione",
    intencao: [
      "IA cálculo tributário",
      "cálculo determinístico transação tributária",
      "rastreabilidade laudo fiscal",
    ],
    corpo: [
      {
        t: "p",
        c: "A pergunta chega cedo em toda conversa técnica: “a IA vai inventar número?”. A resposta honesta exige separar duas tarefas que costumam ser tratadas como uma só.",
      },
      { t: "h2", c: "Ler é uma tarefa. Calcular é outra." },
      {
        t: "p",
        c: "Ler um extrato de CAPAG, uma ECD ou um espelho de inscrição é uma tarefa de extração: encontrar, num documento não estruturado, o valor que corresponde a um campo. É exatamente onde modelos de linguagem são úteis — e é uma tarefa auditável, porque o valor extraído pode ser exibido junto ao trecho de origem, para conferência humana.",
      },
      {
        t: "p",
        c: "Calcular a capacidade efetiva, a nota de recuperabilidade ou o saldo de uma proposta é outra coisa: é aplicar uma regra normativa a um conjunto de entradas. Uma regra não admite variação estatística. Se a mesma entrada produzir resultados diferentes em execuções distintas, o número não é defensável perante a Fazenda — e um laudo que não se defende não serve.",
      },
      {
        t: "quote",
        c: "A tecnologia acelera e prova. Os profissionais decidem e sustentam.",
      },
      { t: "h2", c: "As quatro garantias" },
      {
        t: "ol",
        itens: [
          "Citação literal — cada dado extraído carrega o trecho de origem do documento, exibido para conferência antes de qualquer uso.",
          "Gate de aprovação humana — nenhum valor entra no cálculo sem conferência e aprovação de uma pessoa identificada.",
          "Parâmetros versionados — cada norma tem vigência datada, e a data do caso define a versão aplicável ao cálculo.",
          "Trilha somente-anexação — o registro de quem fez o quê e quando não admite exclusão nem sobrescrita.",
        ],
      },
      { t: "h2", c: "O teste da rastreabilidade" },
      {
        t: "p",
        c: "Há um critério simples para avaliar qualquer laudo de transação tributária: pegue um número do resultado final e peça a reconstituição até a origem. Um laudo rastreável devolve o documento, o trecho, a regra aplicada, a versão do parâmetro vigente na data do caso e a identificação de quem aprovou o dado. Se algum desses elos falta, o número é uma afirmação, não uma prova.",
      },
      {
        t: "nota",
        c: "Especificações técnicas detalhadas são disponibilizadas mediante solicitação das áreas de tecnologia ou compliance.",
      },
    ],
    faq: [
      {
        pergunta: "O laudo pode ser conferido por um auditor externo?",
        resposta:
          "Sim. A rastreabilidade existe justamente para isso: todo número do laudo pode ser reconstituído até o documento, o trecho de origem, a regra aplicada, a versão datada do parâmetro e a pessoa que aprovou o dado.",
      },
    ],
  },
];

export const artigoPorSlug = (slug: string): Artigo | undefined =>
  ARTIGOS.find((a) => a.slug === slug);

/** Texto puro de um artigo — usado no <noscript> da pré-renderização. */
export function textoDoArtigo(a: Artigo): string {
  const partes: string[] = [a.resposta];
  for (const b of a.corpo) {
    if (b.t === "p" || b.t === "h2" || b.t === "h3" || b.t === "quote" || b.t === "nota")
      partes.push(b.c);
    else if (b.t === "ul" || b.t === "ol") partes.push(b.itens.join(" "));
    else if (b.t === "tabela")
      partes.push(b.linhas.map((l) => l.join(" — ")).join(" "));
  }
  return partes.join("\n\n");
}
