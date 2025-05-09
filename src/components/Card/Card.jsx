// Card.jsx
import React from "react";
import { useContext } from "react";
import { CurrentUserContext } from "../../contexts/CurrentUserContext";
import trashIcon from "../../../images/trashButton.png";
import likeActive from "../../../images/likeActive.jpg";
import likeInactive from "../../../images/like.jpg";

export default function Card({ card, onImageClick, onCardDelete, onCardLike }) {
  const currentUser = useContext(CurrentUserContext);

  const isOwn = card.owner?._id === currentUser?._id;
  const isLiked = card.isLiked || false;

  const handleLikeClick = () => {
    onCardLike(card, !isLiked);
  };

  const handleDeleteClick = () => {
    onCardDelete(card);
  };

  // Función para manejar clic en la imagen
  const handleImageClick = () => {
    onImageClick(card);
  };

  return (
    <li className="element__card">
      {isOwn && (
        <button
          className="element__trash"
          type="button"
          onClick={handleDeleteClick} // <-- Conecta el onClick
        >
          <img
            className="element__trash-remove"
            src={trashIcon}
            alt="Botón de eliminar"
          />
        </button>
      )}

      <img
        src={card.link}
        alt={card.name}
        className="element__card-image"
        onClick={handleImageClick}
      />
      <div className="element__content">
        <p className="content__text">{card.name}</p>
        <button
          className={`content__like ${isLiked ? "content__like--active" : ""}`}
          aria-label="Me gusta"
          onClick={handleLikeClick}
        >
          <img
            src={isLiked ? likeActive : likeInactive}
            alt="Botón de me gusta"
          />
        </button>
      </div>
    </li>
  );
}
