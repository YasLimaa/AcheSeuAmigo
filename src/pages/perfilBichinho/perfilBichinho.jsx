import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { carregarDados, registrarAdocao } from "../../services/gerenciadorEntidades";
import "./perfilBichinho.css";

/* Componente de perfil do bichinho */
function PerfilBichinho() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [animal, setAnimal] = useState(null);
  const [tutor, setTutor] = useState(null);
  const [usuarioLogado, setUsuarioLogado] = useState(null);
  const [dadosApp, setDadosApp] = useState(null);
  const [interesseEnviado, setInteresseEnviado] = useState(false);

  /* Efeito para carregar os dados do bichinho ao montar o componente */
  useEffect(() => {
    window.scrollTo(0, 0);

    const dados = carregarDados();
    setDadosApp(dados);

    const petEncontrado = dados.animais.find((a) => Number(a.id) === Number(id));
    setAnimal(petEncontrado);

    if (petEncontrado) {
      const tutorEncontrado = dados.usuarios.find((u) => Number(u.id) === Number(petEncontrado.tutorId));
      setTutor(tutorEncontrado);
    }

    const usuarioSalvo = localStorage.getItem("usuario_logado");
    if (usuarioSalvo) {
      setUsuarioLogado(JSON.parse(usuarioSalvo));
    }
  }, [id]);

  /* Verifica se os dados do bichinho estão carregados */
  if (!animal || !dadosApp) {
    return (
      <div className="perfil-container loading">
        <p>Carregando dados do bichinho...</p>
      </div>
    );
  }
 
  /* Determina se o bichinho é do usuário logado e se o usuário já expressou interesse */
  const ehMeuPet = usuarioLogado && Number(animal.tutorId) === Number(usuarioLogado.id);
  const jaTenhoInteresse = usuarioLogado && dadosApp.adocoes.some(
    (adocao) =>
      Number(adocao.animalId) === Number(animal.id) &&
      Number(adocao.adotanteId) === Number(usuarioLogado.id)
  );

  /* Função para lidar com o interesse em adotar o bichinho */
  const handleInteresse = () => {
    if (!usuarioLogado) {
      navigate("/login");
      return;
    }

    if (jaTenhoInteresse) {
      setInteresseEnviado(true);
      return;
    }

    const dadosAtualizados = registrarAdocao(dadosApp, animal.id, usuarioLogado.id);
    setDadosApp(dadosAtualizados);
    setInteresseEnviado(true);
  };

  /* Determina a fonte da imagem do bichinho */
  let imagemSrc = animal.imagem ? animal.imagem : "img/default.jpg";
  if (animal.imagem && !animal.imagem.startsWith("data:") && !animal.imagem.startsWith("http") && !animal.imagem.startsWith("/")) {
    imagemSrc = `/${animal.imagem}`;
  }

  /* Retorno visual */
  return (
    <main className="perfil-container">
      <div className="perfil-content">
        <div className="perfil-image-wrapper">
          <span className="status-badge disponivel">Disponível</span>
          <img
            src={imagemSrc}
            alt={animal.nome}
            onError={(e) => { e.target.src = "https://placehold.co/600x600?text=Pet"; }}
          />
        </div>

        <div className="perfil-info">
          <h1>{animal.nome}</h1>
          <p className="subtitle">{animal.especie} - {animal.raca}</p>

          {tutor ? (
            <p className="tutor-location">
              Tutor(a): <Link to={ehMeuPet ? "/perfil" : `/perfil?tutorId=${tutor.id}`}>{tutor.nome}</Link>
            </p>
          ) : (
            <p className="tutor-location">Tutor: não encontrado</p>
          )}

          <div className="traits-grid">
            <div className="trait-box">
              <span>Idade</span>
              <strong>{animal.idade || "N/A"}</strong>
            </div>
            <div className="trait-box">
              <span>Gênero</span>
              <strong>{animal.genero || "N/A"}</strong>
            </div>
            <div className="trait-box">
              <span>Porte</span>
              <strong>{animal.porte || "N/A"}</strong>
            </div>
          </div>

          <div className="extra-tags">
            <span className="tag">🛡️ Vacinado</span>
            <span className="tag">✔️ Castrado</span>
          </div>

          <div className="about-section">
            <h2>Sobre {animal.nome}</h2>
            <p>{animal.personalidade || "Nenhuma informação adicional sobre o bichinho no momento."}</p>
          </div>

          {(!usuarioLogado || !ehMeuPet) && (
            <button className="btn-adopt" onClick={handleInteresse} disabled={jaTenhoInteresse}>
              {jaTenhoInteresse ? "Pedido de adoção já enviado" : `♡ Adotar ${animal.nome}`}
            </button>
          )}

          {(interesseEnviado || jaTenhoInteresse) && (
            <div style={{
              backgroundColor: "#e6f0e3",
              color: "#2c3e2e",
              padding: "12px 15px",
              borderRadius: "10px",
              marginTop: "15px",
              border: "1px solid #9ebca4",
              fontSize: "0.9rem",
              textAlign: "left"
            }}>
              🎉 <strong>{jaTenhoInteresse ? "Interesse registrado com sucesso!" : "Você  já demonstrou interesse neste pet." }</strong><br />
              {tutor?.nome || "responsável"} receberá o seu pedido de adoção.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default PerfilBichinho;