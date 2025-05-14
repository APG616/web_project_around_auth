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
  const [error, setError] = useState(null);

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
    // Manejo de errores global
    const handleUnhandledRejection = (event) => {
      console.error("Unhandled rejection:", event.reason);
      if (event.reason.message.includes("Failed to fetch")) {
        setError("Error de conexión con el servidor");
        setIsInfoTooltipOpen(true);
        setIsSuccess(false);
      }
    };

    window.addEventListener("unhandledrejection", handleUnhandledRejection);

    return () => {
      window.removeEventListener(
        "unhandledrejection",
        handleUnhandledRejection
      );
    };
  }, []);

  // Efecto para verificar autenticación y cargar datos al montar
  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (!token) return;

    const checkAuthAndLoadData = async () => {
      try {
        const tokenData = await auth.checkToken(token);
        if (!tokenData?.data) throw new Error("Token inválido");

        const [userInfo, cardsData] = await Promise.all([
          api.getUserInfo(),
          api.getCardList(),
        ]);

        setEmail(tokenData.data.email);
        setCurrentUser(userInfo);
        setCards(cardsData);
        setIsLoggedIn(true);
        navigate("/");
      } catch (error) {
        console.error("Error de autenticación:", error);
        handleLogout();
      }
    };

    checkAuthAndLoadData();
  }, [navigate]);

  // Efecto para recargar datos cuando cambia el estado de autenticación
  useEffect(() => {
    if (!isLoggedIn) return;

    const fetchData = async () => {
      try {
        const [userInfo, cardsData] = await Promise.all([
          api.getUserInfo(),
          api.getCardList(),
        ]);
        setCurrentUser(userInfo);
        setCards(cardsData);
      } catch (error) {
        console.error("Error fetching data:", error);
        if (error.message.includes("401")) {
          handleLogout();
        }
      }
    };

    fetchData();
  }, [isLoggedIn]);

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
      console.error("Error actualizando like:", error);
    }
  };

  const handleCardDelete = async (card) => {
    try {
      await api.deleteCard(card._id);
      setCards((prev) => prev.filter((c) => c._id !== card._id));
    } catch (error) {
      console.error("Error eliminando tarjeta:", error);
    }
  };

  const handleAddPlaceSubmit = (data) => {
    return api
      .addCard(data)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        handleClosePopup();
      })
      .catch((error) => {
        console.error("Error añadiendo tarjeta:", error);
        throw error;
      });
  };

  const handleUpdateAvatar = (data) => {
    return api
      .setUserAvatar(data)
      .then((newData) => {
        setCurrentUser(newData);
        handleClosePopup();
        return newData;
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

  const handleLogin = async (email, password) => {
    try {
      setError(null);
      const data = await auth.login(email, password);

      if (!data?.token) throw new Error("No se recibió token");

      localStorage.setItem("jwt", data.token);

      // Cargar datos después de login exitoso
      const tokenData = await auth.checkToken(data.token);
      const [userInfo, cardsData] = await Promise.all([
        api.getUserInfo(),
        api.getCardList(),
      ]);

      setEmail(tokenData.data.email);
      setCurrentUser(userInfo);
      setCards(cardsData);
      setIsLoggedIn(true);
      navigate("/");
    } catch (err) {
      console.error("Error en login:", err);
      const errorMessage = err.message.includes("Failed to fetch")
        ? "Error de conexión con el servidor"
        : err.message || "Error al iniciar sesión";

      setError(errorMessage);
      setIsInfoTooltipOpen(true);
      setIsSuccess(false);
      throw err;
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
      const registerData = await auth.register(email, password);

      if (registerData) {
        await handleLogin(email, password);
        setIsInfoTooltipOpen(true);
        setIsSuccess(true);
      }
    } catch (err) {
      console.error("Error en registro:", err);
      setIsInfoTooltipOpen(true);
      setIsSuccess(false);
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

        {popup.type === "edit-avatar" && (
          <Popup
            isOpen={popup.isOpen}
            onClose={handleClosePopup}
            title={popup.title}
          >
            <EditAvatar onUpdateAvatar={handleUpdateAvatar} />
          </Popup>
        )}

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
