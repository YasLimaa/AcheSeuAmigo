import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./footer.css";

function Footer() {
  const navigate = useNavigate();

  const irParaPets = () => {
    const galeria = document.querySelector(".pets-gallery");
    if (galeria) {
      galeria.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/", { state: { scrollPets: true } });
    }
  };

  return (
    <footer className="footer">
      <div className="footer-content">

        <div className="footer-brand">
          <div className="footer-logo">
            <img src="/img/logo.png" alt="Ache Seu Amigo" className="footer-logo-img" />
          </div>
          <p className="footer-desc">
            Conectando famílias cheias de amor a pets que aguardam um lar. Porque todo animal merece um lar para sempre.
          </p>
        </div>

        <div className="footer-links">
          <h4>Links Rápidos</h4>
          <ul>
            <li>
              <button className="footer-link-btn" onClick={irParaPets}>
                Ver Pets
              </button>
            </li>
            <li><Link to="/fale">Contato</Link></li>
          </ul>
        </div>

        <div className="footer-contact">
          <h4>Contato</h4>
          <ul>
            <li>✉️ contato@acheseuamigo.com.br</li>
            <li>📞 (11) 94567-1234</li>
            <li>📍 Rua Rua das Palmeiras, 1415 – São Paulo, SP</li>
          </ul>
        </div>

      </div>

      <div className="footer-bottom">
        <span>© 2026 Ache seu Amigo. Todos os direitos reservados.</span>
        <span>Feito com amor para pets em todo lugar</span>
      </div>
    </footer>
  );
}

export default Footer;