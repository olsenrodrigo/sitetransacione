import { renderToString } from "react-dom/server";
import { Router } from "wouter";
import App from "./App";

// A mesma árvore é hidratada no navegador. Todas as rotas são síncronas:
// nenhum shell de Suspense ou bloco oculto depende de scripts para aparecer.
export function render(path: string): string {
  const html = renderToString(<Router ssrPath={path}><App /></Router>);
  if (!html.includes("<h1") || /<!--\$(?:\?|!)-->/.test(html)) {
    throw new Error(`Pré-renderização incompleta: ${path}`);
  }
  return html;
}
