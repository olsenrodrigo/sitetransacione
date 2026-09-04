import { build as esbuild } from "esbuild";
import { build as viteBuild } from "vite";
import { rm, readFile } from "fs/promises";
import { execFileSync } from "child_process";

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
  await rm("dist", { recursive: true, force: true });

  console.log("→ cliente");
  await viteBuild();

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
    outfile: "dist/index.cjs",
    define: { "process.env.NODE_ENV": '"production"' },
    minify: true,
    external: todas.filter((d) => !empacotar.includes(d)),
    logLevel: "info",
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
