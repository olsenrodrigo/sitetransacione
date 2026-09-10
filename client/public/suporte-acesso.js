/* Ativado exclusivamente por ?suporte=acesso. Não lê cookies nem formulários. */
(function () {
  var codigo = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  var eventos = 0;
  var erros = 0;
  function registrar(tipo, detalhe) {
    if (++eventos > 12) return;
    var img = new Image();
    img.src = '/__suporte/acesso.gif?id=' + codigo + '&tipo=' + tipo +
      '&detalhe=' + encodeURIComponent(String(detalhe || '').slice(0, 240));
  }
  window.addEventListener('error', function (e) {
    erros++;
    var alvo = e.target;
    var arquivo = alvo && (alvo.src || alvo.href);
    registrar(arquivo ? 'recurso' : 'javascript', arquivo ?
      arquivo.split('?')[0].split('/').pop() : e.message);
  }, true);
  window.addEventListener('unhandledrejection', function (e) {
    erros++;
    registrar('promise', e.reason && e.reason.message || 'Falha assíncrona');
  });
  registrar('inicio', '');
  function iniciar() {
    var aviso = document.createElement('div');
    aviso.id = 'suporte-acesso';
    aviso.setAttribute('role', 'status');
    aviso.style.cssText = 'position:fixed;top:0;left:0;right:0;z-index:2147483647;background:#fff;color:#14201c;padding:10px;font:14px system-ui;border-bottom:2px solid #0a5c42;text-align:center';
    aviso.textContent = 'Verificando acesso… Código ' + codigo;
    document.body.appendChild(aviso);
    setTimeout(function () {
      var root = document.getElementById('root');
      var conteudo = !!(root && root.querySelector('h1'));
      registrar('resultado', 'conteudo=' + conteudo + ';erros=' + erros);
      aviso.textContent = (conteudo && !erros ? 'Página carregada.' : 'Falha de carregamento registrada.') + ' Código ' + codigo;
    }, 7000);
  }
  if (document.readyState === 'loading') window.addEventListener('DOMContentLoaded', iniciar);
  else iniciar();
})();
