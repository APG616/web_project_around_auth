// App.jsx
import "../../pages/index.css";

import { useState, useEffect, useCallback } from "react";
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
  const [loading, setLoading] = useState(true);
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

  const loadData = useCallback(async () => {
    try {
      const [userInfo, cardsData] = await Promise.all([
        api.getUserInfo().catch(() => ({})), // Fallback para info de usuario
        api.getCardList(), // Ya incluye su propio fallback
      ]);

      setCurrentUser(userInfo);
      setCards(cardsData);
    } catch (error) {
      console.error("Error cargando datos:", error);
      if (error.message.includes("401")) {
        handleLogout();
      }
    }
  }, []);

  const loadUserData = useCallback(async () => {
    try {
      const [userInfo, cardsData] = await Promise.all([
        api.getUserInfo(),
        api.getCardList(),
      ]);
      setCurrentUser(userInfo);
      setCards(cardsData);
    } catch (error) {
      console.error("Error loading data:", error);
      if (error.message.includes("401")) {
        handleLogout();
      }
    }
  }, []);

  const checkAuth = useCallback(async () => {
    const token = localStorage.getItem("jwt");
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const tokenData = await auth.checkToken(token);
      if (!tokenData?.data) throw new Error("Token inválido");

      const [userInfo, cardsData] = await Promise.all([
        api.getUserInfo().catch((e) => {
          console.error("Error obteniendo info usuario:", e);
          return {};
        }),
        api.getCardList().catch((e) => {
          console.error("Error obteniendo tarjetas:", e);
          return [];
        }),
      ]);

      setEmail(tokenData.data.email);
      setCurrentUser(userInfo);
      setCards(cardsData);
      setIsLoggedIn(true);
      navigate("/");
    } catch (err) {
      console.error("Error de autenticación:", err);
      handleLogout();
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (isLoggedIn) {
      loadUserData();
    }
  }, [isLoggedIn, loadUserData]);

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
        // Manejo específico de error 404
        if (error.message.includes("404")) {
          console.error("Endpoint no encontrado, verificando URL base");
        }
        // Si es error de autenticación, hacer logout
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
        throw error; // Propaga el error para manejarlo en NewCard
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

  const handleLogin = async (email, password) => {
    try {
      setError(null);
      const data = await auth.login(email, password);

      if (!data?.token) throw new Error("No se recibió token");

      localStorage.setItem("jwt", data.token);
      await checkAuth(); // Re-verificar autenticación con el nuevo token
    } catch (err) {
      console.error("Error en login:", err);
      setError(err.message || "Error al iniciar sesión");
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

      // Auto-login después de registro exitoso
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

  if (loading) {
    return <div className="loading">Cargando...</div>;
  }

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
