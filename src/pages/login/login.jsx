import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { carregarDados, login } from "../../services/gerenciadorEntidades";
import "./login.css";

/* Componente de login */
function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const [mensagemErro, setMensagemErro] = useState("");

  /* Função para lidar com o login */
  const handleLogin = (e) => {
    e.preventDefault();
    setMensagemErro(""); 

    const dados = carregarDados();
    const emailFormatado = email.trim().toLowerCase();
    const usuario = login(dados, emailFormatado, senha);

    if (usuario) {
      localStorage.setItem("usuario_logado", JSON.stringify(usuario));
      navigate("/perfil");
      window.location.reload();
    } else {
      setMensagemErro("E-mail ou senha incorretos. Por favor, tente novamente.");
    }
  };

  /* Retorno visual */
  return (
    <main className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Bem-vindo de volta!</h1>
          <p>Faça login para continuar buscando seu novo amigo.</p>
        </div>

        {mensagemErro && (
          <div style={{
            backgroundColor: "#fce8e6", 
            color: "#c5221f", 
            padding: "12px 15px",
            borderRadius: "12px",
            marginBottom: "20px",
            border: "1px solid #fad2cf",
            fontSize: "0.9rem",
            textAlign: "center",
            fontWeight: "500",
            lineHeight: "1.4"
          }}>
            {mensagemErro}
          </div>
        )}

        <form onSubmit={handleLogin} className="login-form">
          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="login-input"
            required
          />
          
          <input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className="login-input"
            required
          />

          <button type="submit" className="btn-login">
            Entrar
          </button>
        </form>

        <p className="register-link">
          Não tem uma conta?{" "}
          <Link to="/cadastro">
            Cadastre-se aqui
          </Link>
        </p>
      </div>
    </main>
  );
}

export default Login;