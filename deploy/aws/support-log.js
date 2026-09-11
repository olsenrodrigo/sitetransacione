// Called by the CloudFront router. Only explicit support visits are logged.
// Keep ES5 syntax for the edge runtime; never log cookies, IPs or form contents.
function logSupportRequest(request) {
  var query = request.querystring || {};
  function value(name, limit) {
    var raw = query[name] && query[name].value;
    if (typeof raw !== 'string') return '';
    raw = raw.slice(0, limit * 4);
    try { raw = decodeURIComponent(raw); } catch (e) {}
    return raw.replace(/[\u0000-\u001f\u007f]/g, ' ').slice(0, limit);
  }
  var record;
  if (request.uri === '/__suporte/acesso.gif') {
    var id = value('id', 64);
    var tipo = value('tipo', 24);
    if (!/^[a-zA-Z0-9-]{6,64}$/.test(id)) return;
    if (['inicio', 'resultado', 'recurso', 'javascript', 'promise', 'tempos', 'rede', 'recursos'].indexOf(tipo) === -1) return;
    record = { evento: 'suporte-acesso', id: id, tipo: tipo, detalhe: value('detalhe', 240) };
  } else if (value('suporte', 16) === 'acesso') {
    record = { evento: 'suporte-html', caminho: request.uri.slice(0, 160) };
    var caso = value('caso', 64);
    if (/^[a-zA-Z0-9-]{6,64}$/.test(caso)) record.caso = caso;
  } else {
    return;
  }
  var headers = request.headers || {};
  var agent = headers['user-agent'] && headers['user-agent'].value;
  record.navegador = typeof agent === 'string' ? agent.slice(0, 240) : '';
  console.log(JSON.stringify(record));
}
