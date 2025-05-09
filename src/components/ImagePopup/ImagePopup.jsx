// ImagePopup.jsx
import React from "react";

export default function ImagePopup({ onClose, card }) {
  // Si no hay una tarjeta seleccionada, no se renderiza el popup
  if (!card) {
    return null;
  }

  return (
    <div className="popup popup_open">
      <div className="popup__content popup__content_image">
        {/* Imagen de la tarjeta */}
        <img src={card.link} alt={card.name} className="image__photo" />

        {/* Descripción o pie de imagen */}
        <p className="image__caption">{card.name}</p>

        {/* Botón para cerrar el popup */}
        <button
          className="popup__close-image"
          type="button"
          id="close-image"
          onClick={onClose}
        >
          <img src="../images/closeIcon.jpg" alt="Cerrar popup" />
        </button>
      </div>
    </div>
  );
}
