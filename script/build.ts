import { build as esbuild } from "esbuild";
import { build as viteBuild } from "vite";
import { rm, readFile } from "fs/promises";
import { execFileSync } from "child_process";
import path from "node:path";

const outDir = path.resolve(process.env.BUILD_DIR || "dist");

// Dependências do servidor empacotadas no bundle: menos syscalls no cold start.
const empacotar = [
  "connect-pg-simple",
  "date-fns",
  "drizzle-orm",
  "drizzle-zod",
  "express",
  "express-session",
  "memorystore",
  "nodemailer",
  "pg",
  "zod",
  "zod-validation-error",
];

async function main() {
  await rm(outDir, { recursive: true, force: true });

  console.log("→ cliente");
  await viteBuild();

  console.log("→ renderizador estático");
  await viteBuild({
    build: {
      ssr: "src/entry-server.tsx",
      outDir: path.join(outDir, "ssr"),
      rollupOptions: { output: { manualChunks: undefined } },
    },
  });

  console.log("→ pré-renderização (HTML por rota, sitemap, robots, llms.txt)");
  execFileSync("npx", ["tsx", "script/prerender.ts"], { stdio: "inherit" });

  console.log("→ servidor");
  const pkg = JSON.parse(await readFile("package.json", "utf-8"));
  const todas = [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.devDependencies || {}),
  ];

  await esbuild({
    entryPoints: ["server/index.ts"],
    platform: "node",
    bundle: true,
    format: "cjs",
    outfile: path.join(outDir, "index.cjs"),
    define: { "process.env.NODE_ENV": '"production"' },
    minify: true,
    external: todas.filter((d) => !empacotar.includes(d)),
    logLevel: "info",
  });
  await rm(path.join(outDir, "ssr"), { recursive: true, force: true });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
