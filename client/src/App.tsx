import { useEffect } from "react";
import { Switch, Route } from "wouter";
import Layout from "@/components/site/Layout";
import Home from "@/pages/Home";
import { organizacaoLd } from "@/lib/seo";

// HTML já contém a rota inteira; interações não dependem de chunks sob demanda.
import ComoFunciona from "@/pages/ComoFunciona";
import Federal from "@/pages/Federal";
import Estadual from "@/pages/Estadual";
import Precatorios from "@/pages/Precatorios";
import Tecnologia from "@/pages/Tecnologia";
import Parceiros from "@/pages/Parceiros";
import QuemSomos from "@/pages/QuemSomos";
import Conteudo from "@/pages/Conteudo";
import Artigo from "@/pages/Artigo";
import Diagnostico from "@/pages/Diagnostico";
import Legal from "@/pages/Legal";
import NaoEncontrado from "@/pages/NaoEncontrado";

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
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/como-funciona" component={ComoFunciona} />
          <Route path="/transacao-federal" component={Federal} />
          <Route path="/transacao-estadual" component={Estadual} />
          <Route path="/precatorios" component={Precatorios} />
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
    </Layout>
  );
}
