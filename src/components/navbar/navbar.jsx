import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const usuarioSalvo = localStorage.getItem("usuario_logado");
    if (usuarioSalvo) {
      setUsuario(JSON.parse(usuarioSalvo));
    }
  }, []);

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem("usuario_logado");
    setUsuario(null);
    alert("Sessão encerrada!");
    navigate("/");
    window.location.reload();
  };

  const ativo = (path) => location.pathname === path ? "ativo" : "";

  return (
    <nav className="navbar">
      <div className="nav-container">

        <Link to="/" className="nav-logo">
          <img src="/img/logo.png" alt="Ache Seu Amigo" className="nav-logo-img" />
        </Link>

        <div className="nav-centro">
          <ul className="nav-menu">
            <li><Link to="/" className={ativo("/")}>Home</Link></li>
            <li><Link to="/fale" className={ativo("/fale")}>Fale Conosco</Link></li>
          </ul>
        </div>

        <div className="nav-botoes">
          {!usuario ? (
            <button className="btn-nav-login" onClick={() => navigate("/login")}>Login</button>
          ) : (
            <>
              <Link to="/perfil" className="btn-nav-perfil">Meu Perfil</Link>
            </>
          )}
        </div>

      </div>
    </nav>
  );
}

export default Navbar;
