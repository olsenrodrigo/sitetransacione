# Diagnóstico de acesso na AWS

O endereço `/?suporte=acesso&caso=cliente-20260910` ativa o diagnóstico existente
no navegador. O código exibido na faixa de suporte identifica os eventos daquele
carregamento. O parâmetro opcional `caso` identifica a requisição inicial de HTML.

O roteador registra somente visitas explícitas de suporte e os eventos válidos
em `/__suporte/acesso.gif`. Visitas comuns não geram esses registros. Os campos
são código, tipo, detalhe limitado, caminho e identificação do navegador;
cookies, endereço IP, cabeçalhos de autorização e formulários não são registrados
pelo código. O diagnóstico original não é alterado.

`script/build-aws.ts` incorpora `support-log.js` à CloudFront Function. Antes desta
correção, a rota de suporte retornava 204 e descartava os eventos. Não havia logs
de acesso da distribuição nem `console.log` na função para recuperá-los.

Os registros ficam no CloudWatch Logs, região `us-east-1`, grupo
`/aws/cloudfront/function/transacione-routes`. Retenção configurada: sete dias.
Use um valor de `caso` sem nomes, e-mails ou outros dados pessoais.

```sh
aws logs tail /aws/cloudfront/function/transacione-routes \
  --region us-east-1 --since 30m --format short
```

- `suporte-html`: a requisição de HTML chegou à função, antes de o JavaScript
  executar. Isso não garante que o HTML tenha chegado ao navegador.
- `suporte-acesso` / `inicio`: o script de suporte executou.
- `recurso`, `javascript`, `promise`: falhas detectadas pelo script.
- `resultado`: presença de conteúdo no DOM e número de erros após sete segundos.
  Não equivale a uma avaliação visual ou garantia de funcionamento completo.

O script de suporte carrega assincronamente e pode perder erros que aconteceram
antes de instalar seus listeners. Em teste com módulos bloqueados antes dessa
instalação, o conteúdo estático permaneceu visível e o contador ficou em zero.
Por isso, `erros=0` não prova que os módulos executaram; consultar também a captura
de tela e, quando disponível, a aba Network/Console do navegador afetado.

Se o cliente nem recebe a página, solicitar captura da mensagem exata, URL,
horário com fuso e navegador/rede. A ausência de eventos isoladamente não prova
bloqueio: o navegador pode não executar o script e os logs podem demorar a chegar.
Identificar testes sintéticos pelo caso/código para não confundi-los com o cliente.

A [documentação da AWS](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/edge-functions-logs.html)
descreve o envio de `console.log` de funções LIVE para esse grupo e região.
Os testes em DEVELOPMENT devolvem os registros na própria resposta do teste.

Para atualizar uma função existente, obter e preservar o código LIVE e a
configuração, verificar alterações concorrentes pelos ETags, testar em DEVELOPMENT
e publicar somente o código validado. O script `provision.py` é de criação e
checkpoints; não deve ser executado como se fosse um reconciliador de atualizações.

## Medições de carregamento — versão 3

O HTML carrega `/suporte-acesso.js?v=20260910-3`. A faixa mostra os tempos assim
que disponíveis; o temporizador de sete segundos serve apenas para uma amostra
posterior e não representa o tempo de carregamento. O código muda a cada navegação.

Novos tipos de evento, com detalhes JSON limitados a 240 caracteres:

- `tempos`: `ttfb` (primeiro byte), `html` (fim do HTML), `dom` (DOMContentLoaded),
  `load` (fim do evento load), `fcp` (primeiro conteúdo) e `lcp` (último maior
  conteúdo observado). Tempos em milissegundos desde o início da navegação.
  `suporte` é o instante de execução do script; `oculto` indica aba inicialmente
  oculta, quando o script conseguiu observar esse estado.
- `rede`: duração de DNS, conexão, TLS, espera pela resposta e download do HTML,
  bytes de transferência e tipo de navegação. Conexão inclui TLS: não somar
  os dois. Zero pode refletir conexão/DNS reutilizados.
- `recursos`: arquivos de mesma origem, quantidade com transferência ou cache,
  bytes transferidos e arquivo mais demorado. O script e os beacons de suporte
  são excluídos desse resumo. Cache é reconhecido por transferência zero e
  tamanho decodificado positivo; campos indisponíveis não provam uso de cache.

As amostras são coletadas depois de load e sete segundos após a inicialização
da faixa. Uma tentativa adicional em pagehide pode não chegar ao servidor.
FCP e LCP são opcionais conforme o navegador; valores ausentes são `null`,
exibidos como “não informado”. Navigation Timing antigo é usado como fallback.
Nenhum timestamp indisponível é inventado ou substituído pela espera de suporte.

`load` inclui o próprio script de diagnóstico e não mede interatividade completa,
imagens que só carregam após rolagem ou conclusão de todos os trabalhos de React.
FCP é o primeiro conteúdo do documento, não uma garantia de que toda a página
está visível. A faixa de suporte é ignorada como candidata de LCP quando o
navegador identifica seu elemento. A instrumentação adiciona pequenas requisições;
comparar também com a medição sem suporte quando necessário.

Para comparar cache de arquivos, abrir em uma nova sessão privada e recarregar
na mesma aba; correlacionar os dois códigos e o resumo de recursos. Isso não
garante DNS, TLS e cache da CDN vazios. Não é possível recuperar retroativamente
essas medições para códigos emitidos pela versão anterior.

Referências: [Navigation Timing](https://developer.mozilla.org/en-US/docs/Web/API/Performance_API/Navigation_timing),
[Paint Timing](https://developer.mozilla.org/en-US/docs/Web/API/PerformancePaintTiming).
