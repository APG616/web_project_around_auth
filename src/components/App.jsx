// App.jsx
import "../../pages/index.css";

import { useState, useEffect, useCallback } from "react";
import {
  Routes,
  Route,
  useNavigate,
  Navigate,
  useLocation,
} from "react-router-dom";
import api from "../utils/api";
import Auth from "../utils/auth";
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
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState({});
  const [email, setEmail] = useState("");
  const [isInfoTooltipOpen, setIsInfoTooltipOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [popup, setPopup] = useState({
    isOpen: false,
    type: "",
    title: "",
    children: null,
  });
  const [error, setError] = useState("");
  const [cards, setCards] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

const handleLogin = async (email, password) => {
  try {
    const data = await api.signin(email, password);
    Auth.login(data.token);
    setEmail(email);
    setIsLoggedIn(true);
    await loadData();
    navigate("/");
  } catch (error) {
    console.error("Login error:", error);
    setError(error.message || "Error al iniciar sesión");
    setIsInfoTooltipOpen(true);
    setIsSuccess(false);
  }
};

 const handleLogout = useCallback(() => {
  Auth.logout();
  setIsLoggedIn(false);
  setCurrentUser({});
  setCards([]);
  setEmail("");
  navigate("/signin");
}, [navigate]);

  const loadData = useCallback(async () => {
  if (!isLoggedIn) return;

  try {
    const [userData, cardsData] = await Promise.all([
      api.getUserInfo(),
      api.getCardList()
    ]);
    setCurrentUser(userData);
    setCards(cardsData);
    setEmail(userData.email || "");
  } catch (error) {
    console.error("Error loading data:", error);
    if (error.message.includes("401")) {
      handleLogout();
    }
  }
}, [isLoggedIn, handleLogout]);

  // Nuevo useEffect unificado
useEffect(() => {
  const checkAuth = async () => {
    if (Auth.isLoggedIn()) {
      try {
        const isAuthenticated = await Auth.checkAuth();
        if (isAuthenticated) {
          setIsLoggedIn(true);
          await loadData(); // Carga usuario y tarjetas
        } else {
          handleLogout();
        }
      } catch (error) {
        console.error("Auth check error:", error);
        handleLogout();
      }
    }
  };
  
  checkAuth();
}, [loadData, handleLogout, Auth]); 

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
  }, [setError, setIsInfoTooltipOpen, setIsSuccess]);

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



const handleRegister = async (email, password) => {
  try {
    const response = await api.signup(email, password);
    setIsSuccess(true);
    setIsInfoTooltipOpen(true);
    navigate("/signin");
  } catch (error) {
    console.error("Registration error:", error);
    setIsSuccess(false);
    // Show more detailed error message
    setError(error.message.includes('{') 
      ? `Error de validación: ${error.message}`
      : error.message || "Error al registrar usuario. Verifica tus datos.");
    setIsInfoTooltipOpen(true);
  }
};
  const closeInfoTooltip = () => {
    setIsInfoTooltipOpen(false);
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
