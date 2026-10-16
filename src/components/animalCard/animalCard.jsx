import React from "react";
import { Link } from "react-router-dom";
import "./animalCard.css";

function AnimalCard({ animal }) {
  const imagemSrc = animal.imagem ? animal.imagem : "img/default.jpg";

  return (
    <div className="animal-card">
      <div className="animal-card-img-wrapper">
        <img
          src={imagemSrc}
          alt={animal.nome}
          className="animal-card-img"
          onError={(e) => { e.target.src = "https://placehold.co/240x160?text=Pet"; }}
        />
      </div>
      <div className="animal-card-body">
        <h3 className="animal-card-nome">{animal.nome}</h3>
        <p><strong>Espécie:</strong> {animal.especie}</p>
        <p><strong>Raça:</strong> {animal.raca}</p>
        <Link to={`/bichinho/${animal.id}`} className="animal-card-btn">
          Ver Perfil
        </Link>
      </div>
    </div>
  );
}

export default AnimalCard;