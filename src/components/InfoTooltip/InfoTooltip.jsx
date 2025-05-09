// InfoTooltip.jsx
import { useEffect } from 'react';

export default function InfoTooltip({ isOpen, onClose, isSuccess }) {
  useEffect(() => {
    if (!isOpen) return;
    
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  return (
    <div className={`popup ${isOpen ? 'popup_opened' : ''}`}>
      <div className="popup__container">
        <button 
          type="button" 
          className="popup__close" 
          onClick={onClose}
        />
        <div className={`popup__status ${isSuccess ? 'popup__status_success' : 'popup__status_fail'}`} />
        <h2 className="popup__title">
          {isSuccess 
            ? '¡Correcto! Ya estás registrado.' 
            : 'Uy, algo salió mal. Por favor, inténtalo de nuevo.'}
        </h2>
      </div>
    </div>
  );
}