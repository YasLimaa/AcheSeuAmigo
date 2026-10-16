import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/header/header";
import Footer from "./components/footer/footer";

import Home from "./pages/home/home";
import Login from "./pages/login/login";
import CadastroUsuario from "./pages/cadastroUsuario/cadastroUsuario";
import PerfilUsuario from "./pages/perfilUsuario/perfilUsuario";
import CadastroBichinho from "./pages/cadastroBichinho/cadastroBichinho";
import PerfilBichinho from "./pages/perfilBichinho/perfilBichinho";
import FaleConosco from "./pages/faleConosco/faleConosco";

import bgPaws from "./background-paws.png";

function App() {
  return (
    <BrowserRouter>
      <div style={{ minHeight: "100vh", position: "relative", backgroundColor: "#fcf6d8" }}>

        {/* Camada de fundo com patinhas opacas */}
        <div style={{
          position: "fixed",
          inset: 0,
          backgroundImage: `url(${bgPaws})`,
          backgroundRepeat: "repeat",
          backgroundSize: "1100px",
          opacity: 0.25,
          zIndex: 0,
          pointerEvents: "none"
        }} />

        <div style={{ position: "relative", zIndex: 1 }}>
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/cadastro" element={<CadastroUsuario />} />
            <Route path="/perfil" element={<PerfilUsuario />} />
            <Route path="/cadastro-bichinho" element={<CadastroBichinho />} />
            <Route path="/bichinho/:id" element={<PerfilBichinho />} />
            <Route path="/fale" element={<FaleConosco />} />
          </Routes>
          <Footer />
        </div>

      </div>
    </BrowserRouter>
  );
}

export default App;