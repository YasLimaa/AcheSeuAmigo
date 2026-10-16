import React, { useState } from "react";
import "./faleConosco.css";

/* Estados iniciais do componente */
function FaleConosco() {
  const [form, setForm] = useState({
    nome: "",
    email: "",
    assunto: "",
    mensagem: ""
  });

  const [enviadoComSucesso, setEnviadoComSucesso] = useState(false);
  const [nomeAdotante, setNomeAdotante] = useState("");

  /* Função para lidar com mudanças nos campos do formulário */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  /* Função para lidar com o envio do formulário */
  const handleEnviar = (e) => {
    e.preventDefault();

    if (!form.nome.trim() || !form.email.trim() || !form.mensagem.trim()) {
      return; 
    }

    setNomeAdotante(form.nome);
    setEnviadoComSucesso(true);

    setForm({ /* Limpa os campos do formulário após o envio */
      nome: "",
      email: "",
      assunto: "",
      mensagem: ""
    });

    setTimeout(() => { /* Limpa a mensagem de sucesso após 5 segundos */
      setEnviadoComSucesso(false);
    }, 5000);
  };

  /* Retorno visual */
  return (
    <main className="contato-layout">
      <section className="contato-hero">
        <h1>Fale Conosco</h1>
        <p>Tem alguma dúvida ou quer se envolver? Adoraríamos ouvir de você!</p>
      </section>

      <section className="contato-conteudo">
        <div className="contato-info-col">
          <h2>Entre em Contato</h2>
          
          <div className="info-card">
            <div className="info-icone verde-claro"></div>
            <div className="info-textos">
              <span className="info-label">E-MAIL</span>
              <strong>contato@acheseuamigo.com.br</strong>
              <p>Respondemos em até 24 horas</p>
            </div>
          </div>

          <div className="info-card">
            <div className="info-icone amarelo-claro"></div>
            <div className="info-textos">
              <span className="info-label">ENDEREÇO</span>
              <strong>Abrigo Principal</strong>
              <p>Rua Rua das Palmeiras, 1415 - São Paulo, SP</p>
            </div>
          </div>
        </div>

        <div className="contato-form-col">
          <div className="form-card">
            <h2>Envie uma Mensagem</h2>

            {enviadoComSucesso && (
              <div style={{
                backgroundColor: "#e6f0e3", 
                color: "#2c3e2e",
                padding: "15px",
                borderRadius: "10px",
                marginBottom: "20px",
                border: "1px solid #9ebca4",
                fontSize: "0.95rem",
                textAlign: "left",
                lineHeight: "1.5"
              }}>
                <strong>Obrigado pelo contato, {nomeAdotante}!</strong><br />
                Sua mensagem foi enviada com sucesso. Nossa equipe entrará em contato em até 24 horas.
              </div>
            )}

            <form className="form-contato" onSubmit={handleEnviar}>
              <div className="form-linha">
                <div className="form-grupo">
                  <label>Seu Nome *</label>
                  <input 
                    type="text" 
                    name="nome"
                    placeholder="ex: João da Silva" 
                    value={form.nome}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="form-grupo">
                  <label>E-mail *</label>
                  <input 
                    type="email" 
                    name="email"
                    placeholder="ex: voce@exemplo.com" 
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-grupo">
                <label>Assunto</label>
                <input 
                  type="text" 
                  name="assunto"
                  placeholder="Como posso ajudar?" 
                  value={form.assunto}
                  onChange={handleChange}
                />
              </div>

              <div className="form-grupo">
                <label>Mensagem *</label>
                <textarea 
                  name="mensagem"
                  placeholder="Escreva sua mensagem aqui..." 
                  rows="4"
                  value={form.mensagem}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>

              <button type="submit" className="btn-enviar-msg">
                Enviar Mensagem
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}

export default FaleConosco;