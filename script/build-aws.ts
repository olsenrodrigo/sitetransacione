import { build } from "esbuild";
import { execFileSync } from "node:child_process";
import { mkdir, writeFile, readdir, cp } from "node:fs/promises";
import path from "node:path";
import { ROTAS } from "../shared/seo";
import { ARTIGOS } from "../shared/artigos";
const dir = path.resolve(".build/aws");
execFileSync("npx", ["tsx", "script/build.ts"], { stdio: "inherit", env: { ...process.env, BUILD_DIR: dir } });
execFileSync("npx", ["tsx", "script/verify-build.ts", dir], { stdio: "inherit" });
await mkdir(path.join(dir, "lambda"), { recursive: true });
await build({ entryPoints: ["server/lambda.ts"], outfile: path.join(dir, "lambda/index.cjs"), bundle: true, platform: "node", format: "cjs", target: "node22", minify: true });
const routes = [...new Set([...ROTAS.map(r => r.path), ...ARTIGOS.map(a => `/conteudo/${a.slug}`)])];
// Keep hashed assets from the active VPS release for already-open browser tabs.
try { await cp(path.resolve("current/public/assets"), path.join(dir, "public/assets"), { recursive: true, force: false }); } catch (e) { if ((e as NodeJS.ErrnoException).code !== "ENOENT") throw e; }
const files = (await readdir(path.join(dir, "public"), { recursive: true, withFileTypes: true }))
  .filter(f => f.isFile()).map(f => "/" + path.relative(path.join(dir, "public"), path.join(f.parentPath, f.name)).split(path.sep).join("/"));
const code = `function handler(event) {
 var r = event.request;
 var routes = ${JSON.stringify(routes)};
 var files = ${JSON.stringify(files)};
 if (r.uri === '/__suporte/acesso.gif') return {statusCode:204,headers:{'cache-control':{value:'no-store'}}};
 if (r.uri.indexOf('/api/') === 0) return r;
 var p = r.uri.replace(/\\/+$/, '') || '/';
 if (routes.indexOf(p) !== -1) { r.uri = (p === '/' ? '' : p) + '/index.html'; return r; }
 if (files.indexOf(r.uri) !== -1) return r;
 return {statusCode:404,statusDescription:'Not Found',headers:{'content-type':{value:'text/plain; charset=utf-8'},'cache-control':{value:'no-store'}},body:'Página não encontrada.'};
}`;
if (Buffer.byteLength(code) > 10000) throw new Error("CloudFront router exceeds 10 KB");
await writeFile(path.join(dir, "router.js"), code);
await writeFile(path.join(dir, "routes.json"), JSON.stringify(routes));
console.log("AWS artifacts ready in", dir);
