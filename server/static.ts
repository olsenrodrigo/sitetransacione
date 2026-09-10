import express, { type Express } from "express";
import fs from "fs";
import path from "path";

/**
 * Serve o build. Cada rota tem um HTML pré-renderizado próprio
 * (dist/public/<rota>/index.html) com head, JSON-LD e conteúdo crítico —
 * é ele que buscadores e agentes de IA leem sem executar JavaScript.
 */
export function serveStatic(app: Express) {
  const dist = path.resolve(__dirname, "public");
  if (!fs.existsSync(dist)) {
    throw new Error(`Build não encontrado em ${dist}. Rode "npm run build" antes.`);
  }

  const enviarHtml = (res: express.Response, arquivo: string) => {
    res.set("Cache-Control", "public, max-age=0, must-revalidate");
    res.sendFile(path.relative(dist, arquivo), { root: dist });
  };

  // Ativos com hash no nome podem ser cacheados indefinidamente.
  app.use(
    "/assets",
    express.static(path.join(dist, "assets"), {
      immutable: true,
      maxAge: "1y",
      index: false,
      redirect: false,
    }),
  );

  // Um chunk ausente deve retornar 404, nunca o HTML da aplicação.
  app.use("/assets", (_req, res) => res.status(404).end());

  app.use(
    express.static(dist, {
      index: false,
      // Sem redirecionar diretórios: a URL canônica não tem barra final e
      // deve responder 200, não 301.
      redirect: false,
      maxAge: "7d",
      setHeaders: (res, arquivo) => {
        if (arquivo.endsWith(".html"))
          res.setHeader("Cache-Control", "public, max-age=0, must-revalidate");
        if (arquivo.endsWith(".woff2"))
          res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
      },
    }),
  );

  app.get("/{*path}", (req, res) => {
    const limpo = decodeURIComponent(req.path).replace(/\/+$/, "");
    // Evita travessia de diretório: normaliza e confina ao diretório do build.
    const candidato = path.resolve(dist, "." + limpo, "index.html");
    if (candidato.startsWith(dist) && fs.existsSync(candidato)) {
      return enviarHtml(res, candidato);
    }
    // Rota desconhecida: entrega o shell da SPA, que renderiza o 404.
    res.status(404);
    return enviarHtml(res, path.join(dist, "index.html"));
  });
}
