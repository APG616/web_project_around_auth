// App.jsx
import "../../pages/index.css";

import { useState, useEffect } from "react";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import api from "../utils/api";
import * as auth from "../utils/auth";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import Footer from "./Footer/Footer";
import Header from "./Header/Header";
import Main from "./Main/Main";
import Popup from "./Popup/Popup";
import EditAvatar from "./EditAvatar/EditAvatar";
import EditProfile from "./EditProfile/EditProfile";
import NewCard from "./NewCard/NewCard";
import Login from "./Auth/Login/Login";
import Register from "./Auth/Register/Register";
import ProtectedRoute from "./Auth/ProtectedRoute";
import InfoTooltip from "./InfoTooltip/InfoTooltip";

export default function App() {
  const [currentUser, setCurrentUser] = useState({});
  const [cards, setCards] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const [isInfoTooltipOpen, setIsInfoTooltipOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const closeInfoTooltip = () => setIsInfoTooltipOpen(false);

  const [popup, setPopup] = useState({
    isOpen: false,
    type: "",
    title: "",
    children: null,
  });

  useEffect(() => {
    api
      .getUserInfo()
      .then(setCurrentUser)
      .catch((error) => {
        console.error("Error fetching user info:", error);
        // Opcional: manejar el error (ej. redirigir a login)
      });

    api
      .getCardList()
      .then(setCards)
      .catch((error) => {
        console.error("Error fetching cards:", error);
        setCards([]); // Establece un array vacío como fallback
      });
  }, [currentUser._id]);

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (!token) return;

    const authenticate = async () => {
      try {
        // 1. Primero verifica el token
        const tokenData = await auth.checkToken(token);

        if (!tokenData.data) {
          throw new Error("Token inválido");
        }

        // 2. Si el token es válido, obtén los datos del usuario
        const [userInfo, cardsData] = await Promise.all([
          api.getUserInfo().catch(() => ({})),
          api.getCardList().catch(() => []),
        ]);

        setEmail(tokenData.data.email);
        setCurrentUser(userInfo);
        setCards(cardsData);
        setIsLoggedIn(true);
        navigate("/");
      } catch (err) {
        console.error("Error de autenticación:", err);
        handleLogout(); // Limpia el token inválido
      }
    };

    authenticate();
  }, [navigate]);

  function handleOpenPopup(type, title, children) {
    setPopup({
      isOpen: true,
      type,
      title,
      children,
    });
  }

  const handleClosePopup = () => {
    setPopup({
      isOpen: false,
      type: "",
      title: "",
      children: null,
    });
  };

  const handleUpdateAvatar = (data) => {
    return api
      .setUserAvatar(data)
      .then((newData) => {
        setCurrentUser(newData);
        handleClosePopup();
        return newData; // Para poder encadenar then() en EditAvatar
      })
      .catch((error) => {
        console.error("Error updating avatar:", error);
        throw error;
      });
  };

  const handleUpdateUser = (data) => {
    return api
      .setUserInfo(data)
      .then((newData) => {
        setCurrentUser(newData);
        handleClosePopup();
        return newData;
      })
      .catch((error) => {
        console.error("Error updating profile:", error);
        throw error;
      });
  };

  const handleAddPlaceSubmit = (data) => {
    api
      .addCard(data)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        handleClosePopup();
      })
      .catch((error) => console.error(error));
  };

  const handleCardLike = async (card, isLiked) => {
    try {
      const updatedCard = await api.changeLikeCardStatus(card._id, isLiked);
      setCards((prev) =>
        prev.map((c) =>
          c._id === card._id
            ? { ...c, isLiked: !c.isLiked, likes: updatedCard.likes }
            : c
        )
      );
    } catch (error) {
      console.error("Error updating like:", error);
    }
  };

  const handleCardDelete = async (card) => {
    try {
      await api.deleteCard(card._id);
      setCards((prev) => prev.filter((c) => c._id !== card._id));
    } catch (error) {
      console.error("Error deleting card:", error);
    }
  };

  const handleLogin = async (email, password) => {
    try {
      const data = await auth.login(email, password);

      if (!data?.token) {
        throw new Error("No token received");
      }

      localStorage.setItem("jwt", data.token);
      setEmail(email);
      setIsLoggedIn(true);

      return data;
    } catch (err) {
      console.error("Login error:", err);
      throw err; // Propaga el error para que Login.jsx lo maneje
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    setIsLoggedIn(false);
    setEmail("");
    navigate("/signin");
  };

  const handleRegister = async (email, password) => {
    try {
      const data = await auth.register(email, password);

      // Auto-login después del registro exitoso
      if (data) {
        return handleLogin(email, password);
      }

      return data;
    } catch (err) {
      console.error("Registration error:", err);
      throw err;
    }
  };

  return (
    <CurrentUserContext.Provider value={{ currentUser, setCurrentUser }}>
      <div className="page__content">
        <Header
          isLoggedIn={isLoggedIn}
          userEmail={email}
          onLogout={handleLogout}
        />
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <Main
                  cards={cards}
                  onCardLike={handleCardLike}
                  onCardDelete={handleCardDelete}
                  onOpenPopup={handleOpenPopup}
                  onAddPlaceSubmit={handleAddPlaceSubmit}
                  onUpdateAvatar={handleUpdateAvatar}
                  onUpdateUser={handleUpdateUser}
                />
              </ProtectedRoute>
            }
          />
          <Route path="/signin" element={<Login onLogin={handleLogin} />} />
          <Route
            path="/signup"
            element={<Register onRegister={handleRegister} />}
          />
          <Route
            path="*"
            element={<Navigate to={isLoggedIn ? "/" : "/signin"} />}
          />
        </Routes>
        <Footer />
        {popup.type === "add-card" && (
          <Popup
            isOpen={popup.isOpen}
            onClose={handleClosePopup}
            title={popup.title}
          >
            <NewCard onAddPlaceSubmit={handleAddPlaceSubmit} />
          </Popup>
        )}

        {/* Popup para editar avatar */}
        {popup.type === "edit-avatar" && (
          <Popup
            isOpen={popup.isOpen}
            onClose={handleClosePopup}
            title={popup.title}
          >
            <EditAvatar onUpdateAvatar={handleUpdateAvatar} />
          </Popup>
        )}

        {/* Popup para editar perfil */}
        {popup.type === "edit-profile" && (
          <Popup
            isOpen={popup.isOpen}
            onClose={handleClosePopup}
            title={popup.title}
          >
            <EditProfile
              onUpdateUser={handleUpdateUser}
              onClose={handleClosePopup}
            />
          </Popup>
        )}
        <InfoTooltip
          isOpen={isInfoTooltipOpen}
          onClose={closeInfoTooltip}
          isSuccess={isSuccess}
        />
      </div>
    </CurrentUserContext.Provider>
  );
}
