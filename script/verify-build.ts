import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { ROTAS } from "../shared/seo";
import { ARTIGOS } from "../shared/artigos";

const publicDir = path.resolve(process.argv[2] || "dist", "public");
const routes = [...ROTAS.map(r => r.path), ...ARTIGOS.map(a => `/conteudo/${a.slug}`)];
for (const route of routes) {
  const html = await readFile(path.join(publicDir, route, "index.html"), "utf8");
  assert.match(html, /<div id="root">.+<h1[\s>]/s, `${route}: conteúdo ausente`);
  assert.ok(!html.includes('<div id="root"></div>'), `${route}: shell vazio`);
  assert.ok(!html.includes('rel="stylesheet"'), `${route}: CSS bloqueia a pintura`);
  assert.ok(!(/<!--\$(?:\?|!)-->/.test(html)), `${route}: renderização suspensa`);
  assert.match(html, /mailto:/, `${route}: falta contato sem JavaScript`);
  assert.match(html, /<details/, `${route}: falta navegação móvel nativa`);
  for (const [, asset] of html.matchAll(/(?:src|href)="(\/assets\/[^"?#]+)"/g)) {
    assert.ok((await stat(path.join(publicDir, asset))).isFile(), `${route}: falta ${asset}`);
  }
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
  assert.equal(new URL(canonical!).pathname.replace(/\/$/, ""), route.replace(/\/$/, ""));
}
console.log(`${routes.length} rotas: HTML completo, CSS embutido, contato, menu, canonical e assets OK.`);
