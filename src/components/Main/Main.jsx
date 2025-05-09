// Main.jsx
import React, { useContext, useState } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import { CurrentUserContext } from "../../../src/contexts/CurrentUserContext";
import api from "../../utils/api";
import Card from "../Card/Card";
import Popup from "../Popup/Popup";
import EditAvatar from "../EditAvatar/EditAvatar";
import NewCard from "../NewCard/NewCard";
import EditProfile from "../EditProfile/EditProfile";
import ImagePopup from "../ImagePopup/ImagePopup";

export default function Main({
  cards,
  onCardLike,
  onCardDelete,
  onOpenPopup,
  onAddPlaceSubmit,
  onUpdateAvatar,
  onUpdateUser,
}) {
  const { currentUser } = useContext(CurrentUserContext);

  const [popup, setPopup] = useState(null);
  const [selectedCard, setSelectedCard] = useState(null);

  const handleOpenPopup = (popup) => setPopup(popup);
  const handleClosePopup = () => setPopup(null);
  const handleImageClick = (card) => setSelectedCard(card);
  const handleCloseImagePopup = () => setSelectedCard(null);

  return (
    <div className="main-container">
      <section className="profile">
        <div className="profile__top-section">
          <button
            aria-label="Edit Avatar"
            className="profile__avatar-container"
            type="button"
            onClick={() =>
              onOpenPopup(
                "edit-avatar",
                "Cambiar foto de perfil",
                <EditAvatar onUpdateAvatar={onUpdateAvatar} />
              )
            }
          >
            <img
              src={currentUser.avatar}
              alt="Avatar del usuario"
              className="profile__avatar"
            />
          </button>

          <div className="profile__content">
            <div className="profile__info">
              <h1 className="profile__info-name">{currentUser.name}</h1>
              <p className="profile__info-description">{currentUser.about}</p>
            </div>
            <button
              aria-label="Edit Profile"
              className="profile__edit-button"
              type="button"
              onClick={() =>
                onOpenPopup(
                  "edit-profile",
                  "Editar perfil",
                  <EditProfile
                    onUpdateUser={onUpdateUser}
                    onClose={handleClosePopup}
                  />
                )
              }
            >
              <img
                src="../../../images/editButton.png"
                alt="Botón para editar perfil"
              />
            </button>
          </div>
        </div>

        <button
          aria-label="Add card"
          className="profile__add-button"
          type="button"
          onClick={() =>
            onOpenPopup(
              "add-card",
              "Nuevo lugar",
              <NewCard onAddPlaceSubmit={onAddPlaceSubmit} />
            )
          }
        >
          <img
            src="../../../images/addButton.png"
            alt="Botón para agregar nueva imagen"
          />
        </button>
      </section>

      <section className="cards">
        <ul className="cards__list">
          {cards?.map((card) => (
            <Card
              key={card._id}
              card={card}
              onCardLike={onCardLike}
              onCardDelete={onCardDelete}
              onImageClick={handleImageClick}
            />
          ))}
        </ul>
      </section>

      {popup && (
        <Popup onClose={handleClosePopup} title={popup.title}>
          {popup.children}
        </Popup>
      )}

      {selectedCard && (
        <ImagePopup card={selectedCard} onClose={handleCloseImagePopup} />
      )}
    </div>
  );
}
