import { SITE } from "@shared/seo";

export type DocLegal = "privacidade" | "termos" | "cookies";

type BlocoLegal =
  | { t: "p"; c: string }
  | { t: "h2"; c: string }
  | { t: "ul"; itens: string[] };

export const DOCUMENTOS_LEGAIS: Record<DocLegal, BlocoLegal[]> = {
  /* ------------------------------------------------------- Privacidade */
  privacidade: [
    {
      t: "p",
      c: `Esta política descreve como ${SITE.nomeLegal}, responsável pela marca ${SITE.nome} ("nós"), trata dados pessoais coletados por meio deste site, em conformidade com a Lei nº 13.709/2018 — Lei Geral de Proteção de Dados Pessoais (LGPD).`,
    },

    { t: "h2", c: "1. Quais dados coletamos" },
    {
      t: "p",
      c: "Coletamos apenas os dados que você fornece voluntariamente e os dados técnicos mínimos necessários para operar e medir o site.",
    },
    {
      t: "ul",
      itens: [
        "Dados de contato informados nos formulários: nome, empresa ou razão social, e-mail, telefone e a mensagem que você escrever.",
        "Respostas do diagnóstico de elegibilidade: esfera do passivo, faixa de valor, regime tributário e situação da dívida. São respostas de faixa, não valores exatos.",
        "Dados técnicos de navegação: endereço IP, tipo de dispositivo, navegador, páginas visitadas e origem do acesso, coletados por ferramentas de medição.",
      ],
    },
    {
      t: "p",
      c: "Não solicitamos, por meio deste site, documentos fiscais, contábeis ou societários. O envio de documentos para o diagnóstico técnico ocorre apenas na plataforma autenticada, por link cifrado, após contratação.",
    },

    { t: "h2", c: "2. Para que usamos" },
    {
      t: "ul",
      itens: [
        "Responder ao seu contato e conduzir a etapa comercial de qualificação.",
        "Direcionar o atendimento à esfera e ao perfil informados no diagnóstico.",
        "Medir o desempenho do site e entender como o conteúdo é encontrado e utilizado.",
        "Cumprir obrigações legais e regulatórias aplicáveis.",
      ],
    },

    { t: "h2", c: "3. Base legal" },
    {
      t: "p",
      c: "O tratamento dos dados de contato tem por base o consentimento manifestado no formulário (art. 7º, I, da LGPD) e, quando aplicável, os procedimentos preliminares relacionados a contrato do qual você é parte (art. 7º, V). Os dados técnicos de navegação são tratados com base no legítimo interesse (art. 7º, IX), limitado à medição e à segurança do site.",
    },

    { t: "h2", c: "4. Compartilhamento" },
    {
      t: "p",
      c: "Não vendemos e não cedemos dados pessoais. Compartilhamos apenas com operadores necessários à prestação do serviço — provedor de hospedagem, serviço de envio de e-mail e ferramentas de medição —, sempre limitados à finalidade descrita, e com autoridades quando houver dever legal.",
    },

    { t: "h2", c: "5. Retenção" },
    {
      t: "p",
      c: "Dados de contato de casos não convertidos são mantidos por até 24 meses a contar do último contato, prazo após o qual são eliminados ou anonimizados. Dados de clientes seguem os prazos legais e regulatórios aplicáveis à relação contratual e ao dever de guarda profissional.",
    },

    { t: "h2", c: "6. Seus direitos" },
    {
      t: "p",
      c: "Você pode, a qualquer momento, solicitar confirmação de tratamento, acesso, correção, anonimização, portabilidade ou eliminação dos seus dados, bem como revogar o consentimento e obter informação sobre compartilhamentos.",
    },
    {
      t: "p",
      c: `Os pedidos devem ser enviados para ${SITE.email} e são respondidos nos prazos da LGPD.`,
    },

    { t: "h2", c: "7. Segurança" },
    {
      t: "p",
      c: "Adotamos medidas técnicas e administrativas para proteger os dados contra acesso não autorizado, perda ou alteração indevida: tráfego cifrado por TLS, controle de acesso por perfil, registro de eventos e backups. Nenhum sistema é imune a incidentes; em caso de incidente com risco relevante, comunicamos os titulares e a ANPD nos termos da lei.",
    },

    { t: "h2", c: "8. Alterações" },
    {
      t: "p",
      c: "Esta política pode ser atualizada para refletir mudanças no serviço ou na legislação. A data da última atualização é sempre indicada no topo desta página.",
    },
  ],

  /* ------------------------------------------------------------ Termos */
  termos: [
    {
      t: "p",
      c: `Ao navegar neste site você concorda com as condições descritas abaixo. O site é mantido por ${SITE.nomeLegal}, responsável pela marca ${SITE.nome}.`,
    },

    { t: "h2", c: "1. Natureza do conteúdo" },
    {
      t: "p",
      c: "Todo o conteúdo publicado tem finalidade informativa e educacional. Não constitui consulta jurídica, parecer, oferta de serviço, promessa de resultado ou garantia de desconto. Percentuais, prazos e hipóteses de elegibilidade dependem da classificação apurada e dos limites da norma aplicável a cada caso concreto.",
    },
    {
      t: "p",
      c: "As referências normativas indicadas ao longo do site apontam a legislação vigente na data da publicação. Normas mudam; a versão aplicável a um caso é a vigente na data pertinente, verificada durante o trabalho técnico.",
    },

    { t: "h2", c: "2. Formulários e diagnóstico de elegibilidade" },
    {
      t: "p",
      c: "O preenchimento de formulários e do diagnóstico de elegibilidade não cria relação contratual, não constitui contratação de serviço advocatício ou contábil e não estabelece relação de cliente. O diagnóstico de elegibilidade é uma triagem comercial baseada exclusivamente nas respostas informadas, sem verificação documental, e seu resultado é indicativo.",
    },
    {
      t: "p",
      c: "O diagnóstico técnico — aferição de classificação, cenários e sensibilidade — é serviço contratado à parte e realizado sobre documentação verificada.",
    },

    { t: "h2", c: "3. Contratação" },
    {
      t: "p",
      c: "O diagnóstico e o trabalho contábil são contratados com a Consultoria. Eventual atuação em juízo é contratada separadamente, com o escritório jurídico. As condições de cada contratação constam do respectivo instrumento.",
    },

    { t: "h2", c: "4. Propriedade intelectual" },
    {
      t: "p",
      c: "A marca, a identidade visual, os textos, as análises e os elementos gráficos deste site são protegidos e não podem ser reproduzidos ou distribuídos sem autorização prévia por escrito, ressalvada a citação com indicação da fonte e link para a página original.",
    },

    { t: "h2", c: "5. Disponibilidade e links externos" },
    {
      t: "p",
      c: "Empregamos esforços razoáveis para manter o site disponível e atualizado, sem garantir operação ininterrupta. Links para sites de terceiros são oferecidos por conveniência; não respondemos por seu conteúdo ou por suas práticas de privacidade.",
    },

    { t: "h2", c: "6. Foro" },
    {
      t: "p",
      c: "Estes termos são regidos pela legislação brasileira. Fica eleito o foro da Comarca de São Paulo/SP para dirimir eventuais controvérsias, com renúncia a qualquer outro, por mais privilegiado que seja.",
    },
  ],

  /* ----------------------------------------------------------- Cookies */
  cookies: [
    {
      t: "p",
      c: "Cookies são pequenos arquivos gravados no seu navegador quando você visita um site. Usamos poucos, e explicamos abaixo quais são e para que servem.",
    },

    { t: "h2", c: "1. Cookies essenciais" },
    {
      t: "p",
      c: "Necessários ao funcionamento do site. Guardam apenas a sua preferência quanto a este próprio aviso e informações de sessão. Não podem ser desativados sem comprometer a navegação, e não identificam você.",
    },

    { t: "h2", c: "2. Cookies de medição" },
    {
      t: "p",
      c: "Ajudam a entender quais páginas são acessadas, por qual caminho e com que desempenho, para melhorar o conteúdo e a velocidade do site. São aplicados apenas se você aceitar todos os cookies no aviso exibido na primeira visita.",
    },
    {
      t: "ul",
      itens: [
        "Google Analytics 4 — medição de audiência e de eventos de conversão.",
        "Google Tag Manager — gerenciamento das tags de medição.",
        "Google Search Console — desempenho na busca orgânica (não utiliza cookies no site).",
      ],
    },

    { t: "h2", c: "3. Como gerenciar" },
    {
      t: "p",
      c: "Você pode alterar sua escolha limpando os dados do site no seu navegador, o que faz o aviso ser exibido novamente. Também é possível bloquear ou apagar cookies nas configurações do navegador — bloquear os essenciais pode afetar o funcionamento de partes do site.",
    },

    { t: "h2", c: "4. Não rastreamos para publicidade" },
    {
      t: "p",
      c: "Não utilizamos cookies de publicidade comportamental, remarketing ou perfilamento para terceiros neste site.",
    },
  ],
};
