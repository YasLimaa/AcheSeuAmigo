import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { carregarDados } from "../../services/gerenciadorEntidades";
import AnimalCard from "../../components/animalCard/animalCard";
import "./home.css";
 
/* Imagens do carrossel */
const imagensCarrossel = [
  { src: "/img/zeus.jpg", alt: "Zeus" },
  { src: "/img/oliver.jpg", alt: "Oliver" },
  { src: "/img/lola.jpg", alt: "Lola" },
  { src: "/img/tom.jpg", alt: "Tom" },
  { src: "/img/pompom.jpg", alt: "Pompom" }
];

/* Exibe o carrossel e a galeria de pets */
function Home() {
  const [animais, setAnimais] = useState([]);
  const [indexAtual, setIndexAtual] = useState(0);
  const galeriaRef = useRef(null);
  const location = useLocation();

  const [buscaTexto, setBuscaTexto] = useState("");
  const [especieSelecionada, setEspecieSelecionada] = useState("Todos");

  /* Carrega os dados dos animais ao montar o componente */
  useEffect(() => {
    const dados = carregarDados();
    setAnimais(dados.animais || []);
  }, []);

  /* Rola para a galeria de pets ao carregar a página */
  useEffect(() => {
    if (location.state?.scrollPets) {
      setTimeout(() => {
        galeriaRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [location]);

  /* Temporizador do carrossel */ 
  useEffect(() => {
    const intervalo = setInterval(() => {
      setIndexAtual((prev) => (prev + 1) % imagensCarrossel.length);
    }, 3000);
    return () => clearInterval(intervalo);
  }, []);

  /* Função para rolar para a galeria de pets */
  const rolarParaGaleria = () => {
    galeriaRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  /* Função para ir para a imagem anterior do carrossel */
  const irAnterior = () => {
    setIndexAtual((prev) => (prev - 1 + imagensCarrossel.length) % imagensCarrossel.length);
  };

  /* Função para ir para a imagem seguinte do carrossel */
  const irProximo = () => {
    setIndexAtual((prev) => (prev + 1) % imagensCarrossel.length);
  };

  /* Filtra os animais com base no texto de busca e na espécie selecionada */
  const animaisFiltrados = animais.filter((animal) => {
    const correspondeTexto = 
      animal.nome.toLowerCase().includes(buscaTexto.toLowerCase()) ||
      animal.raca.toLowerCase().includes(buscaTexto.toLowerCase());

    const correspondeEspecie = 
      especieSelecionada === "Todos" || 
      animal.especie.toLowerCase() === especieSelecionada.toLowerCase();

    return correspondeTexto && correspondeEspecie;
  });

  /* Retorno visual */
  return (
    <div className="fundo-patinhas">
      <section className="hero">
        <div className="hero-content">
          <span className="tag">Não compre, Adote!</span>
          <h1>Encontre seu<br /><span>Companheiro</span> Perfeito</h1>
          <p>Todo animal merece um lar. Conheça os pets que estão esperando por uma família.</p>
          <div className="hero-buttons">
            <button className="btn-primary" onClick={rolarParaGaleria}>Ver Bichinhos</button>
          </div>
        </div>

        <div className="carrossel">
          <button className="carrossel-btn carrossel-prev" onClick={irAnterior}>&#8249;</button>
          <div className="carrossel-imagem">
            {imagensCarrossel.map((img, i) => (
              <img
                key={img.alt}
                src={img.src}
                alt={img.alt}
                className={`carrossel-slide ${i === indexAtual ? "ativo" : ""}`}
              />
            ))}
          </div>
          <button className="carrossel-btn carrossel-next" onClick={irProximo}>&#8250;</button>
          <div className="carrossel-dots">
            {imagensCarrossel.map((_, i) => (
              <button
                key={i}
                className={`dot ${i === indexAtual ? "dot-ativo" : ""}`}
                onClick={() => setIndexAtual(i)}
              />
            ))}
          </div>
        </div>
      </section>

      <div className="pets-gallery" ref={galeriaRef}>
        <h2>Conheça Nossos Pets</h2>
        
        <div className="filtro-container">
          <input 
            type="text" 
            placeholder="🔍 Busque por nome ou raça..." 
            value={buscaTexto}
            onChange={(e) => setBuscaTexto(e.target.value)}
            className="filtro-input-texto"
          />
          
          <select
            value={especieSelecionada}
            onChange={(e) => setEspecieSelecionada(e.target.value)}
            className="filtro-select-especie"
          >
            <option value="Todos">Todas as Espécies</option>
            <option value="Cachorro">Cachorro</option>
            <option value="Gato">Gato</option>
            <option value="Passaro">Pássaro</option>
            <option value="Hamster">Hamster</option>
            <option value="Jabuti">Jabuti</option>
          </select>
        </div>

        <div className="pet-grid">
          {animaisFiltrados.length === 0 ? (
            <p className="msg-vazia-filtros">
              Nenhum pet encontrado com os filtros selecionados. 🐾
            </p>
          ) : (
            animaisFiltrados.map((a) => <AnimalCard key={a.id} animal={a} />)
          )}
        </div>
      </div>

      <section className="cta">
        <h2>Pronto para Mudar uma Vida?</h2>
        <button className="btn-white" onClick={rolarParaGaleria}>Iniciar Adoção</button>
      </section>
    </div>
  );
}

export default Home;