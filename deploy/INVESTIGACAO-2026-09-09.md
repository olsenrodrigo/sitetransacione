# Investigação e correção do carregamento — 09/09/2026

## Falhas confirmadas no código e na publicação

- O HTML inicial tinha `#root` vazio. O conteúdo gerado pelo build ficava em
  `noscript`, invisível quando JavaScript estava habilitado mas não carregava.
- A exibição dependia do download/execução dos bundles e de CSS externo.
  As animações também começavam com o conteúdo oculto.
- O build apagava `dist` antes de compilar, removendo arquivos em uso e chunks
  ainda referenciados por abas abertas. A compilação levava dezenas de segundos.
- O Nginx encaminhava inclusive HTML e assets ao Node.

Esses problemas explicam cenários reproduzíveis de tela vazia. Não há evidência
suficiente para atribuir cada relato anterior à mesma causa: não foi capturada
uma sessão original do cliente com erro de rede. Os registros opt-in anteriores
incluíam testes sintéticos; eles não foram tratados como prova de falha do cliente.

## Infraestrutura verificada

- Os dois nomes apontavam para `76.13.229.194` nos servidores autoritativos e nos
  resolvedores Google/Cloudflare, com validação DNSSEC. Não havia AAAA publicado.
- Cadeias TLS válidas; TLS 1.2 testado com RSA e ECDSA, além de TLS 1.3.
- Não foi observada saturação de CPU ou esgotamento da memória disponível.
  O uso de swap estava alto, mas sem OOM no kernel nas 24 horas consultadas.
- As sondas externas responderam nos dois nomes. Depois da publicação:
  [São Paulo, Londres e Nova York](https://check-host.net/check-report/4acd8424kb0d)
  retornaram 200, em aproximadamente 0,02 s, 1,09 s e 0,76 s respectivamente.
  Esses valores medem requisições HTTP das sondas, não o tempo de pintura nos celulares.

## Correção publicada

As 17 páginas agora contêm o HTML completo e CSS embutido, usando os mesmos
componentes React e preservando a identidade visual. React hidrata o documento
para ativar o diagnóstico. Não há carregamento de rotas em chunks sob demanda.

Menu móvel e FAQ usam `details`/`summary`. CTAs têm contato por e-mail como destino
nativo enquanto a interação não foi ativada. As seções começam visíveis e a
animação é opcional. O script de suporte é assíncrono.

O Nginx serve `current/public` diretamente; somente `/api/` passa pelo Node.
`npm run deploy` compila e valida fora da publicação, preserva assets anteriores
e troca `current` atomicamente. O HTML exige revalidação; arquivos com hash
recebem cache longo. A configuração e o procedimento estão versionados.

## Validação

- TypeScript e build de produção aprovados.
- Validador das 17 rotas verifica HTML real, ausência de shells pendentes, CSS
  embutido, contato, menu, canonical e existência dos assets.
- 17 rotas × Chromium/WebKit × JavaScript ligado/desligado: 68 navegações aprovadas
  pelo domínio público, sem erros de execução.
- Sete condições em cada engine: normal, JavaScript desligado, bloqueado ou
  atrasado, todos os subrecursos bloqueados, sem IntersectionObserver e com
  localStorage bloqueado. Conteúdo/menu funcionaram em todas; o diagnóstico abriu
  nas condições com JavaScript disponível. Nenhum formulário real foi enviado.
- HTTP/HTTPS, com/sem `www`, terminam em 200. Asset anterior continua em 200;
  asset inexistente retorna 404. API de saúde retorna 200 e formulário inválido 400.
- A home completa, incluindo CSS, trafega em aproximadamente 23,4 KB com gzip.
- Durante o segundo deploy, 285 requisições em 90 segundos: nenhuma falha HTTP
  ou perda de conteúdo; maior duração observada de 538 ms a partir da VPS.
- Com latência artificial de 300 ms, 512 kbit/s, CPU 4× mais lenta e JavaScript
  ainda pendente, o conteúdo ficou visível em 1,55 s no Chromium.
- Diagnóstico opcional validado com seu script chegando após o DOMContentLoaded.

As verificações cobrem as falhas reproduzidas e a publicação atual. Não constituem
promessa de disponibilidade absoluta de operadoras, DNS ou dispositivos. A
confirmação final da experiência no aparelho originalmente afetado ainda depende
de um novo acesso do cliente; as correções já estão publicadas.
