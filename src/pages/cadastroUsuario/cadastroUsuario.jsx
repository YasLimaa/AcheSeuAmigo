import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { carregarDados, cadastrarUsuario } from "../../services/gerenciadorEntidades";
import "./cadastroUsuario.css";

/* Estados iniciais do componente */
function CadastroUsuario() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nome: "",
    idade: "",
    estado: "",
    endereco: "",
    email: "",
    telefone: "",
    senha: ""
  });

  const [cadastradoComSucesso, setCadastradoComSucesso] = useState(false);

  /* Função para lidar com mudanças nos campos do formulário */
  const handleChange = (e) => {
  const { name, value } = e.target;
  
  if (name === "telefone") {
    const apenasNumeros = value.replace(/\D/g, "");
    setForm({ ...form, [name]: apenasNumeros });
  } else {
    setForm({ ...form, [name]: value });
  }
};

  /* Função para lidar com o envio do formulário */
  const handleSalvar = (e) => {
    e.preventDefault();
    
    const dadosAtuais = carregarDados();
    cadastrarUsuario(dadosAtuais, form);
    
    setCadastradoComSucesso(true);

    setForm({ /* Limpa o formulário após o cadastro */
      nome: "",
      idade: "",
      cidade: "",
      estado: "",
      endereco: "",
      email: "",
      telefone: "",
      senha: ""
    });
 
    /* Redireciona para a página de login após 3 segundos */
    setTimeout(() => {
      navigate("/login");
    }, 3000);
  };
 
  /* Retorno visual */
  return (
    <main className="cadastro-user-layout">
      <div className="card-cadastro">
        
        <div className="cadastro-header">
          <h1>Crie sua conta</h1>
          <p>Junte-se à nossa comunidade e ajude pets a encontrarem um lar</p>
        </div>

        {cadastradoComSucesso && (
          <div style={{
            backgroundColor: "#e6f0e3",
            color: "#2c3e2e",
            padding: "15px",
            borderRadius: "12px",
            marginBottom: "20px",
            border: "1px solid #9ebca4",
            fontSize: "0.95rem",
            textAlign: "center",
            fontWeight: "500"
          }}>
            🎉 <strong>Usuário cadastrado com sucesso!</strong><br />
            Você está sendo redirecionado para a página de login...
          </div>
        )}

        <form onSubmit={handleSalvar} className="form-cadastro">
          <div className="input-group">
            <label>Nome Completo *</label>
            <input 
              name="nome" 
              placeholder="Seu nome" 
              value={form.nome}
              onChange={handleChange} 
              required 
            />
          </div>

          <div className="form-row">
            <div className="input-group">
              <label>Idade *</label>
              <input 
                name="idade" 
                type="number" 
                placeholder="Sua idade"
                value={form.idade} 
                onChange={handleChange} 
                required 
              />
            </div>

            <div className="input-group">
              <label>Telefone *</label>
              <input 
                name="telefone" 
                placeholder="(00) 00000-0000" 
                value={form.telefone}
                onChange={handleChange}
                maxLength="11"
                required 
              />
            </div>
          </div>

          <div className="input-group">
            <label>Cidade *</label>
            <input 
              type="text"
              name="cidade" 
              value={form.cidade} 
              onChange={handleChange} 
              placeholder="Ex: Campinas"
              required 
            />
          </div>

          <div className="input-group">
            <label>Estado *</label>
            <select 
              name="estado" 
              value={form.estado} 
              onChange={handleChange} 
              required
              className="cadastro-select"
            >
              <option value="">Selecione</option>
              <option value="AC">AC</option>
              <option value="AL">AL</option>
              <option value="AP">AP</option>
              <option value="AM">AM</option>
              <option value="BA">BA</option>
              <option value="CE">CE</option>
              <option value="DF">DF</option>
              <option value="ES">ES</option>
              <option value="GO">GO</option>
              <option value="MA">MA</option>
              <option value="MT">MT</option>
              <option value="MS">MS</option>
              <option value="MG">MG</option>
              <option value="PA">PA</option>
              <option value="PB">PB</option>
              <option value="PR">PR</option>
              <option value="PE">PE</option>
              <option value="PI">PI</option>
              <option value="RJ">RJ</option>
              <option value="RN">RN</option>
              <option value="RS">RS</option>
              <option value="RO">RO</option>
              <option value="RR">RR</option>
              <option value="SC">SC</option>
              <option value="SP">SP</option>
              <option value="SE">SE</option>
              <option value="TO">TO</option>
            </select>
          </div>

          <div className="input-group">
            <label>Endereço *</label>
            <input 
              name="endereco" 
              placeholder="Rua, Número, Bairro"
              value={form.endereco} 
              onChange={handleChange}
              required 
            />
          </div>

          <div className="input-group">
            <label>E-mail *</label>
            <input 
              name="email" 
              type="email"
              placeholder="voce@exemplo.com" 
              value={form.email}
              onChange={handleChange} 
              required 
            />
          </div>

          <div className="input-group">
            <label>Senha *</label>
            <input 
              name="senha" 
              type="password" 
              placeholder="........"
              value={form.senha} 
              onChange={handleChange} 
              required 
            />
          </div>

          <button type="submit" className="btn-cadastrar">
            Cadastrar
          </button>

          <p className="link-login">
            Já tem uma conta? <span onClick={() => navigate("/login")}>Faça login</span>
          </p>
        </form>
      </div>
    </main>
  );
}

export default CadastroUsuario;