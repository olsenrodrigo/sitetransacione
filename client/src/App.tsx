import { lazy, Suspense, useEffect } from "react";
import { Switch, Route } from "wouter";
import Layout from "@/components/site/Layout";
import Home from "@/pages/Home";
import { organizacaoLd } from "@/lib/seo";

/* A home entra no bundle inicial; as demais rotas carregam sob demanda. */
const ComoFunciona = lazy(() => import("@/pages/ComoFunciona"));
const Federal = lazy(() => import("@/pages/Federal"));
const Estadual = lazy(() => import("@/pages/Estadual"));
const Tecnologia = lazy(() => import("@/pages/Tecnologia"));
const Parceiros = lazy(() => import("@/pages/Parceiros"));
const QuemSomos = lazy(() => import("@/pages/QuemSomos"));
const Conteudo = lazy(() => import("@/pages/Conteudo"));
const Artigo = lazy(() => import("@/pages/Artigo"));
const Diagnostico = lazy(() => import("@/pages/Diagnostico"));
const Legal = lazy(() => import("@/pages/Legal"));
const NaoEncontrado = lazy(() => import("@/pages/NaoEncontrado"));

function Carregando() {
  return (
    <div className="secao container-t" aria-live="polite" aria-busy="true">
      <div className="h-4 w-32 rounded bg-osso-2" />
      <div className="mt-6 h-10 w-2/3 max-w-lg rounded bg-osso-2" />
      <div className="mt-4 h-4 w-full max-w-xl rounded bg-osso-2" />
    </div>
  );
}

export default function App() {
  /* Dados estruturados da organização — presentes em todas as páginas. */
  useEffect(() => {
    if (document.getElementById("ld-organizacao")) return;
    const s = document.createElement("script");
    s.type = "application/ld+json";
    s.id = "ld-organizacao";
    s.textContent = JSON.stringify(organizacaoLd());
    document.head.appendChild(s);
  }, []);

  return (
    <Layout>
      <Suspense fallback={<Carregando />}>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/como-funciona" component={ComoFunciona} />
          <Route path="/transacao-federal" component={Federal} />
          <Route path="/transacao-estadual" component={Estadual} />
          <Route path="/tecnologia" component={Tecnologia} />
          <Route path="/parceiros" component={Parceiros} />
          <Route path="/quem-somos" component={QuemSomos} />
          <Route path="/conteudo" component={Conteudo} />
          <Route path="/conteudo/:slug" component={Artigo} />
          <Route path="/diagnostico" component={Diagnostico} />
          <Route path="/privacidade">{() => <Legal doc="privacidade" />}</Route>
          <Route path="/termos">{() => <Legal doc="termos" />}</Route>
          <Route path="/cookies">{() => <Legal doc="cookies" />}</Route>
          <Route component={NaoEncontrado} />
        </Switch>
      </Suspense>
    </Layout>
  );
}
