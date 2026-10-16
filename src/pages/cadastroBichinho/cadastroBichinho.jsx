import React, { useState, useEffect } from "react";
import { carregarDados, cadastrarAnimal } from "../../services/gerenciadorEntidades";
import { useNavigate } from "react-router-dom";
import "./cadastroBichinho.css";

/*Estados iniciais do componente*/
function CadastroBichinho() {
  const navigate = useNavigate();
  const [tutorIdLogado, setTutorIdLogado] = useState(1);
  const [outraEspecie, setOutraEspecie] = useState("");

  /*Hook para carregar o ID do tutor logado ao montar o componente*/
  useEffect(() => {
    const usuarioSalvo = localStorage.getItem("usuario_logado");
    if (usuarioSalvo) {
      const user = JSON.parse(usuarioSalvo);
      setTutorIdLogado(user.id);
    }
  }, []);

  /*Estado para armazenar os dados do formulário de cadastro do pet*/
  const [form, setForm] = useState({
    nome: "",
    especie: "Cachorro",
    idade: "",
    genero: "Macho",
    raca: "",
    porte: "Pequeno",
    personalidade: "",
    imagem: ""
  });

  /*Função para atualizar o estado do formulário conforme o usuário preenche os campos*/
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  /*Função para lidar com a mudança de arquivo (imagem)*/
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm({ ...form, imagem: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  /*Função para salvar os dados do pet, validando a espécie caso seja "Outro" e depois cadastrando o pet com o tutor logado*/
  const handleSalvar = (e) => {
    e.preventDefault();
    
    let especieFinal = form.especie;
    if (form.especie === "Outro") {
      if (!outraEspecie.trim()) {
        alert("Por favor, especifique qual é a espécie do pet!");
        return;
      }
      especieFinal = outraEspecie.trim();
    }

    /*Carrega os dados atuais, cria um novo objeto de pet com o tutor logado e chama a função de cadastro*/
    const dadosAtuais = carregarDados();
    
    const novoPetComTutor = { 
      ...form, 
      especie: especieFinal,
      tutorId: tutorIdLogado 
    };

    cadastrarAnimal(dadosAtuais, novoPetComTutor);
    
    navigate("/perfil");
  };

  /*Retonro visual*/
  return (
    <main className="cadastro-layout">
      <div className="cadastro-header">
        <div>
          <h1>Cadastrar um Pet</h1>
          <p>Preencha os detalhes para listar seu pet para adoção</p>
        </div>
      </div>

      <form onSubmit={handleSalvar} className="cadastro-form">
        <div className="form-card">
          <h2>Informações Básicas</h2>
          <div className="form-grid">
            
            <div className="input-group">
              <label>Nome do Pet *</label>
              <input 
                name="nome" 
                placeholder="Ex: Buddy"
                value={form.nome} 
                onChange={handleChange} 
                required 
              />
            </div>

            <div className="input-group">
              <label>Espécie *</label>
              <select name="especie" value={form.especie} onChange={handleChange}>
                <option value="Cachorro">Cachorro</option>
                <option value="Gato">Gato</option>
                <option value="Passaro">Pássaro</option>
                <option value="Jabuti">Jabuti</option>
                <option value="Hamster">Hamster</option>
                <option value="Outro">Outro</option>
              </select>

              {form.especie === "Outro" && (
                <input 
                  type="text"
                  placeholder="Digite a espécie (Ex: Iguana, Mini Porco)"
                  value={outraEspecie}
                  onChange={(e) => setOutraEspecie(e.target.value)}
                  style={{ marginTop: "10px" }}
                  required
                />
              )}
            </div>

            <div className="input-group">
              <label>Raça *</label>
              <input 
                name="raca" 
                placeholder="Ex: Golden Retriever, SRD" 
                value={form.raca} 
                onChange={handleChange} 
                required 
              />
            </div>

            <div className="input-group">
              <label>Idade *</label>
              <input 
                name="idade" 
                placeholder="Ex: 2 anos"
                value={form.idade} 
                onChange={handleChange} 
                required
              />
            </div>

            <div className="input-group">
              <label>Gênero *</label>
              <select name="genero" value={form.genero} onChange={handleChange}>
                <option value="Macho">Macho</option>
                <option value="Fêmea">Fêmea</option>
              </select>
            </div>

            <div className="input-group">
              <label>Porte *</label>
              <select name="porte" value={form.porte} onChange={handleChange}>
                <option value="Pequeno">Pequeno</option>
                <option value="Médio">Médio</option>
                <option value="Grande">Grande</option>
              </select>
            </div>

            <div className="input-group full-width">
              <label>Personalidade / Descrição</label>
              <textarea
                name="personalidade"
                placeholder="Conte-nos sobre a personalidade do pet, hábitos e o que o torna especial..."
                value={form.personalidade}
                onChange={handleChange}
                rows="4"
              ></textarea>
            </div>

          </div>
        </div>

        <div className="form-card">
          <h2>Foto</h2>
          <div className="input-group">
            <label>Anexe uma foto do pet *</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              required
              className="input-file"
            />
          </div>
        </div>

        <div className="container-botoes-cadastro" style={{ display: "flex", gap: "15px", marginTop: "10px" }}>
          <button type="submit" className="btn-salvar-pet" style={{ flex: 2 }}>
            Salvar Pet
          </button>
          
          <button 
            type="button" 
            className="btn-sair" 
            onClick={() => navigate("/perfil")}
            style={{ 
              backgroundColor: "#e05545",
              padding: "16px 30px", 
              borderRadius: "12px", 
              fontSize: "1.1rem", 
              fontWeight: "bold",
              color: "#1f1d1d",
            }}
          >
            Cancelar
          </button>
        </div>
      </form>
    </main>
  );
}

export default CadastroBichinho;