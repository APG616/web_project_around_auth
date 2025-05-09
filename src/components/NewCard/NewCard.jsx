// NewCard.jsx
import { useState } from "react";

export default function NewCard({ onAddPlaceSubmit, onClose }) {
  const [name, setName] = useState("");
  const [link, setLink] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddPlaceSubmit({ name, link })
      .then(() => {
        setName("");
        setLink("");
        onClose(); // Cierra el popup después de agregar
      })
      .catch((error) => console.error("Error adding card:", error));
  };

  return (
    <form className="popup__content" onSubmit={handleSubmit} noValidate>
      <label className="form__fieldset">
        <input
          type="text"
          className="popup__input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Título"
          required
          minLength="1"
          maxLength="30"
        />
      </label>
      <label className="form__fieldset">
        <input
          type="url"
          className="popup__input"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          placeholder="Enlace a la imagen"
          required
        />
      </label>
      <button type="submit" className="form__submit-button">
        Guardar
      </button>
    </form>
  );
}
