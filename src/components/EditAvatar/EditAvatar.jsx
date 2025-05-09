// EditAvatar.jsx
import { useRef } from "react";
export default function EditAvatar({ onUpdateAvatar, onClose }) {
  const avatarRef = useRef();

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdateAvatar({
      avatar: avatarRef.current.value,
    }).then(() => {
      onClose(); // Cierra el popup después de actualizar
    });
  };

  return (
    <form
      className="popup__content"
      id="update-avatar-form"
      onSubmit={handleSubmit}
      noValidate
    >
      <label className="form__fieldset">
        <input
          id="avatar-url"
          name="avatar"
          type="url"
          className="popup__input"
          placeholder="Enlace a la imagen"
          ref={avatarRef}
          required
        />
      </label>
      <button type="submit" className="form__submit-button">
        Guardar
      </button>
    </form>
  );
}
