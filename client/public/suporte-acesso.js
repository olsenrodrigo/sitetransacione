/* Ativado exclusivamente por ?suporte=acesso. Não lê cookies nem formulários. */
(function () {
  var codigo = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  var eventos = 0;
  var erros = 0;
  var aviso;
  var p = window.performance;
  var inicioSuporte = p && p.now ? Math.round(p.now()) : null;
  var ocultoInicial = document.visibilityState === 'hidden';
  var lcp = null;
  function registrar(tipo, detalhe) {
    if (++eventos > 24) return;
    var img = new Image();
    img.src = '/__suporte/acesso.gif?id=' + codigo + '&tipo=' + tipo +
      '&detalhe=' + encodeURIComponent(String(detalhe || '').slice(0, 240));
  }
  window.addEventListener('error', function (e) {
    erros++;
    if (erros > 8) return;
    var alvo = e.target;
    var arquivo = alvo && (alvo.src || alvo.href);
    registrar(arquivo ? 'recurso' : 'javascript', arquivo ?
      arquivo.split('?')[0].split('/').pop() : e.message);
  }, true);
  window.addEventListener('unhandledrejection', function (e) {
    erros++;
    if (erros > 8) return;
    registrar('promise', e.reason && e.reason.message || 'Falha assíncrona');
  });

  function entradas(tipo) {
    try { return p && p.getEntriesByType ? p.getEntriesByType(tipo) : []; }
    catch (e) { return []; }
  }
  function ms(valor) {
    return typeof valor === 'number' && isFinite(valor) && valor >= 0 && valor < 86400000 ? Math.round(valor) : null;
  }
  function navegacao() {
    var atual = entradas('navigation')[0];
    if (atual) return atual;
    // Fallback for browsers without Navigation Timing Level 2.
    if (!p || !p.timing || !p.timing.navigationStart) return {};
    var legado = p.timing;
    var dados = {};
    var campos = ['domainLookupStart', 'domainLookupEnd', 'connectStart', 'connectEnd',
      'secureConnectionStart', 'requestStart', 'responseStart', 'responseEnd',
      'domContentLoadedEventEnd', 'loadEventEnd'];
    for (var i = 0; i < campos.length; i++) {
      var campo = campos[i];
      dados[campo] = legado[campo] > 0 ? legado[campo] - legado.navigationStart : 0;
    }
    dados.type = p.navigation && p.navigation.type === 1 ? 'reload' : 'navigate';
    return dados;
  }
  function tempos(etapa) {
    var n = navegacao();
    var pinturas = entradas('paint');
    var fcp = null;
    for (var i = 0; i < pinturas.length; i++) {
      if (pinturas[i].name === 'first-contentful-paint') fcp = ms(pinturas[i].startTime);
    }
    return { v: 3, etapa: etapa, ttfb: ms(n.responseStart || undefined),
      html: ms(n.responseEnd || undefined), dom: ms(n.domContentLoadedEventEnd || undefined),
      load: ms(n.loadEventEnd || undefined), fcp: fcp, lcp: ms(lcp),
      suporte: inicioSuporte, oculto: ocultoInicial };
  }
  function segundos(valor) {
    return valor === null ? 'não informado' : (valor / 1000).toFixed(2).replace('.', ',') + ' s';
  }
  function atualizar() {
    if (!aviso) return;
    var t = tempos('tela');
    aviso.textContent = 'Primeiro conteúdo: ' + segundos(t.fcp) +
      ' · Carga da página: ' + segundos(t.load) +
      (erros ? ' · Erros detectados: ' + erros : '') + ' · Código ' + codigo;
  }
  function medir(etapa) {
    registrar('tempos', JSON.stringify(tempos(etapa)));
    var n = navegacao();
    registrar('rede', JSON.stringify({ etapa: etapa, dns: ms(n.domainLookupEnd - n.domainLookupStart),
      conexao: ms(n.connectEnd - n.connectStart),
      tls: n.secureConnectionStart > 0 ? ms(n.connectEnd - n.secureConnectionStart) : null,
      espera: ms(n.responseStart - n.requestStart), download: ms(n.responseEnd - n.responseStart),
      bytes: typeof n.transferSize === 'number' ? n.transferSize : null,
      tipo: n.type || 'desconhecido' }));
    var recursos = entradas('resource');
    var total = 0, cache = 0, rede = 0, bytes = 0, lento = null;
    var origem = location.protocol + '//' + location.host + '/';
    for (var i = 0; i < recursos.length; i++) {
      var r = recursos[i];
      if (r.name.indexOf(origem) !== 0 || /\/(__suporte\/|suporte-acesso\.js)/.test(r.name)) continue;
      total++;
      if (typeof r.transferSize === 'number') {
        bytes += r.transferSize;
        if (r.transferSize === 0 && r.decodedBodySize > 0) cache++;
        if (r.transferSize > 0) rede++;
      }
      if (!lento || r.duration > lento.duration) lento = r;
    }
    registrar('recursos', JSON.stringify({ etapa: etapa, total: total, cache: cache, rede: rede, bytes: bytes,
      lento: lento ? lento.name.split('?')[0].split('/').pop().slice(0, 64) : null,
      ms: lento ? ms(lento.duration) : null }));
    atualizar();
  }
  if (window.PerformanceObserver) {
    try {
      new PerformanceObserver(function () { atualizar(); }).observe({ type: 'paint', buffered: true });
    } catch (e) {}
    try {
      new PerformanceObserver(function (lista) {
        var entradasLcp = lista.getEntries();
        for (var i = 0; i < entradasLcp.length; i++) {
          var entrada = entradasLcp[i];
          if (!aviso || !entrada.element || !aviso.contains(entrada.element)) lcp = entrada.startTime;
        }
      }).observe({ type: 'largest-contentful-paint', buffered: true });
    } catch (e) {}
  }
  registrar('inicio', '');
  function iniciar() {
    aviso = document.createElement('div');
    aviso.id = 'suporte-acesso';
    aviso.setAttribute('role', 'status');
    aviso.style.cssText = 'position:fixed;top:0;left:0;right:0;z-index:2147483647;background:#fff;color:#14201c;padding:10px;font:14px system-ui;border-bottom:2px solid #0a5c42;text-align:center';
    document.body.appendChild(aviso);
    atualizar();
    setTimeout(function () {
      var root = document.getElementById('root');
      var conteudo = !!(root && root.querySelector('h1'));
      registrar('resultado', 'conteudo=' + conteudo + ';erros=' + erros);
      medir('7s');
    }, 7000);
  }
  function carregou() { setTimeout(function () { medir('load'); }, 0); }
  if (document.readyState === 'complete') carregou();
  else window.addEventListener('load', carregou);
  window.addEventListener('pagehide', function () { medir('saida'); });
  if (document.readyState === 'loading') window.addEventListener('DOMContentLoaded', iniciar);
  else iniciar();
})();
