import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import legacy from "@vitejs/plugin-legacy";
import path from "path";

export default defineConfig(({ isSsrBuild }) => ({
  plugins: [
    react(),
    tailwindcss(),
    // Gera um bundle adicional (ES5 + polyfills, carregado via <script nomodule>)
    // para navegadores/WebViews que não suportam módulos ES ou sintaxe ES2022 —
    // sem isso, esses navegadores ficam com a página em branco (o <script type="module">
    // é simplesmente ignorado, sem erro visível).
    !isSsrBuild && legacy({
      targets: ["defaults", "not IE 11"],
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
    },
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, process.env.BUILD_DIR || "dist", "public"),
    emptyOutDir: true,
    cssMinify: "lightningcss",
    rollupOptions: {
      output: {
        // Núcleo do React num chunk estável: melhora o cache entre deploys.
        manualChunks(id) {
          if (id.includes("node_modules/react") || id.includes("node_modules/scheduler"))
            return "react";
        },
      },
    },
  },
  server: {
    host: "0.0.0.0",
    allowedHosts: true,
    fs: { strict: true, deny: ["**/.*"] },
  },
}));
