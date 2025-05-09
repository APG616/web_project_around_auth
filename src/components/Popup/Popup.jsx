// Popup.jsx
export default function Popup({ isOpen, onClose, title, children }) {
  return (
    <>
      <div className={`popup ${isOpen ? "popup_open" : ""}`}>
        <div className="popup__content">
          <button
            aria-label="Close modal"
            className="popup__close"
            type="button"
            onClick={onClose}
          >
            <img src="../../images/closeIcon.jpg" alt="Cerrar" />
          </button>
          <h3 className="popup__title">{title}</h3>
          {children}
        </div>
      </div>
    </>
  );
}
