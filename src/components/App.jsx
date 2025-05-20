// App.jsx
import "../../pages/index.css";

import { useState, useEffect } from "react";
import {
  Routes,
  Route,
  useNavigate,
  Navigate,
  useLocation,
} from "react-router-dom";
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
  const location = useLocation();

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

    if (!token && !["/signin", "/signup"].includes(location.pathname)) {
      navigate("/signin");
      return;
    }

    const loadInitialData = async () => {
      try {
        // 1. Verificar token primero
        const tokenData = await auth.checkToken(token);
        if (!tokenData?.data?.email) {
          throw new Error("Token inválido");
        }

        // 2. Establecer estado de autenticación
        setEmail(tokenData.data.email);
        setIsLoggedIn(true);

        // 3. Obtener datos del usuario y tarjetas
        const [userInfo, cardsData] = await Promise.all([
          api.getUserInfo(),
          api.getCardList(),
        ]);

        setCurrentUser(userInfo);
        setCards(cardsData);

        // 4. Redirigir si viene de páginas de auth
        if (["/signin", "/signup"].includes(location.pathname)) {
          navigate("/");
        }
      } catch (error) {
        console.error("Initial load error:", error);
        handleLogout();
      }
    };

    if (token) {
      loadInitialData();
    }
  }, [navigate, location.pathname]);

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

  const handleAddPlaceSubmit = async (data) => {
    try {
      const newCard = await api.addCard(data);
      setCards([newCard, ...cards]);
      handleClosePopup();
    } catch (error) {
      console.error("Error añadiendo tarjeta:", error);
      throw error;
    }
  };

  const handleUpdateAvatar = async (data) => {
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

  const handleUpdateUser = async (data) => {
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

      // 1. Limpiar cualquier token previo
      localStorage.removeItem("jwt");

      // 2. Hacer login para obtener nuevo token
      const loginData = await auth.login(email, password);
      localStorage.setItem("jwt", loginData.token);

      if (!loginData?.token) {
        throw new Error("No se recibió token en la respuesta");
      }

      // 3. Guardar el nuevo token
      localStorage.setItem("jwt", loginData.token);

      // 4. Verificar el token con el endpoint /users/me
      const tokenData = await auth.checkToken(loginData.token);
      if (!tokenData?.data?.email) {
        throw new Error("Token verification failed");
      }

      // 5. Establecer el estado de autenticación
      setEmail(tokenData.data.email);
      setIsLoggedIn(true);

      // 6. Obtener los datos del usuario y las tarjetas
      const [userInfo, cardsData] = await Promise.all([
        api.getUserInfo(),
        api.getCardList(),
      ]);

      setCurrentUser(userInfo);
      setCards(cardsData);

      // 7. Redirigir al home
      navigate("/");
    } catch (err) {
      console.error("Login error:", err);

      // Limpiar estado y token inválido
      localStorage.removeItem("jwt");
      setIsLoggedIn(false);
      setEmail("");

      let errorMessage = "Error al iniciar sesión";
      if (err.message.includes("401")) {
        errorMessage = "Credenciales inválidas";
      } else if (
        err.message.includes("403") ||
        err.message.includes("Invalid Token")
      ) {
        errorMessage = "Token inválido o expirado. Intente nuevamente.";
      } else if (err.message.includes("Failed to fetch")) {
        errorMessage = "Error de conexión con el servidor";
      }

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
      setError(null);
      const registerData = await auth.register(email, password);
      return registerData;
    } catch (err) {
      console.error("Error en registro:", err);
      throw err; // Propaga el error con el mensaje original
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
