import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Si vous utilisez le router
import LoginModal from "./LoginModal";
import SignupModal from "./SignupModal";

export default function Header() {
  const navigate = useNavigate();

  // États pour gérer la visibilité des modales
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);

  // --- Fonctions de gestion ---

  const openLogin = () => {
    setIsSignupOpen(false); // Ferme l'inscription si ouverte
    setIsLoginOpen(true); // Ouvre la connexion
  };

  const openSignup = () => {
    setIsLoginOpen(false); // Ferme la connexion si ouverte
    setIsSignupOpen(true); // Ouvre l'inscription
  };

  const closeAll = () => {
    setIsLoginOpen(false);
    setIsSignupOpen(false);
  };

  const handleSuccess = () => {
    closeAll();
    navigate("/dashboard"); // Redirection après succès
  };

  return (
    <>
      <div className="header">
        <div className="flex items-center gap-2">
          {/* Note: 'class' corrigé en 'className' pour React */}
          <span className="material-symbols-outlined text-3xl text-primary">
            sports_soccer
          </span>
          <h2 className="text-3xl text-white font-lexend tracking-wider font-bold">
            Footbooking
          </h2>
        </div>

        <div className="navigation md:flex">
          <a
            className="text-white hover:text-primary transition-colors text-lg font-Archivo black font-medium leading-normal"
            href="#"
          >
            Accueil
          </a>
          <a
            className="text-white hover:text-primary transition-colors text-lg font-Archivo black font-medium leading-normal"
            href="#"
          >
            Trouver un terrain
          </a>
          <a
            className="text-white hover:text-primary transition-colors text-lg font-Archivo black font-medium leading-normal"
            href="#"
          >
            Pour les propriétaires
          </a>

          <button
            onClick={openLogin}
            className="bg-primary rounded-full font-montserrat font-semibold text-text text-lg px-4 py-2 cursor-pointer hover:bg-primary/90 transition-colors"
          >
            Se connecter
          </button>
        </div>
      </div>

      {/* --- Intégration des Modales --- */}

      {/* Modal de Connexion */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onSuccess={handleSuccess}
        onSwitchToSignup={openSignup} // Permet de passer à l'inscription depuis le login
      />

      {/* Modal d'Inscription */}
      <SignupModal
        isOpen={isSignupOpen}
        onClose={() => setIsSignupOpen(false)}
        onSuccess={handleSuccess}
      />
    </>
  );
}
