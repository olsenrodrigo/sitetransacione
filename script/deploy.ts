import { cp, mkdir, readdir, realpath, rename, symlink } from "node:fs/promises";
import path from "node:path";
import { execFileSync } from "node:child_process";

// O Nginx aponta para current/public. Um build nunca altera a versão ativa.
const root = process.cwd();
const lock = path.join(root, ".deploy-lock");
await mkdir(lock); // Não permite duas publicações concorrentes.
try {
  execFileSync("npm", ["run", "check"], { stdio: "inherit" });
  execFileSync("npm", ["run", "build"], {
    stdio: "inherit", env: { ...process.env, BUILD_DIR: ".build" },
  });
  execFileSync("npx", ["tsx", "script/verify-build.ts", ".build"], { stdio: "inherit" });
  const release = path.join(root, ".releases", new Date().toISOString().replace(/[:.]/g, "-"));
  await mkdir(path.dirname(release), { recursive: true });
  await rename(path.join(root, ".build"), release);

  // Abas abertas/HTML em cache ainda podem solicitar chunks da versão anterior.
  // Só assets com hash são herdados; HTML e arquivos sem hash são sempre novos.
  let previous: string | undefined;
  try { previous = await realpath(path.join(root, "current")); }
  catch (error: any) { if (error.code !== "ENOENT") throw error; }
  previous ||= path.join(root, "dist");
  try {
    for (const file of await readdir(path.join(previous, "public/assets"))) {
      await cp(path.join(previous, "public/assets", file), path.join(release, "public/assets", file), {
        force: false, errorOnExist: false,
      });
    }
  } catch (error: any) { if (error.code !== "ENOENT") throw error; }

  const temporary = path.join(root, `.current-${process.pid}`);
  await symlink(path.relative(root, release), temporary);
  await rename(temporary, path.join(root, "current"));
  console.log(`Publicado: ${release}\nAnterior: ${previous}`);
} finally {
  const { rmdir } = await import("node:fs/promises");
  await rmdir(lock);
}
