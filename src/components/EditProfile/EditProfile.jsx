//EditProfile.jsx
import { useState, useContext } from "react";
import { CurrentUserContext } from "../../contexts/CurrentUserContext";

export default function EditProfile({ onUpdateUser, onClose }) {
  const { currentUser } = useContext(CurrentUserContext);
  const [name, setName] = useState(currentUser.name || "");
  const [about, setAbout] = useState(currentUser.about || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdateUser({ name, about })
      .then(() => {
        onClose(); // Cierra el popup después de actualizar
      })
      .catch((err) => console.error("Error updating profile:", err));
  };

  return (
    <form className="popup__content" onSubmit={handleSubmit} noValidate>
      <label className="form__fieldset">
        <input
          type="text"
          className="popup__input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nombre"
          required
          minLength="2"
          maxLength="40"
        />
      </label>
      <label className="form__fieldset">
        <input
          type="text"
          className="popup__input"
          value={about}
          onChange={(e) => setAbout(e.target.value)}
          placeholder="Acerca de mí"
          required
          minLength="2"
          maxLength="200"
        />
      </label>
      <button type="submit" className="form__submit-button">
        Guardar
      </button>
    </form>
  );
}
