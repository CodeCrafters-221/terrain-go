import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SignupModal from "./SignupModal";

export default function Cta2() {
  const navigate = useNavigate();
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);

  const handleCreateAccount = () => {
    setIsSignupModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsSignupModalOpen(false);
  };

  const handleSignupSuccess = () => {
    setIsSignupModalOpen(false);
    // Rediriger vers le tableau de bord ou la page d'accueil après succès
    navigate("/dashboard");
  };

  return (
    <>
      <div className="relative rounded-[3rem] overflow-hidden bg-primary/10 border border-primary/20 p-8 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8 mt-16 mb-8">
        {/* Contenu texte */}
        <div className="flex flex-col gap-4 max-w-xl text-center md:text-left z-10">
          <h2 className="text-white text-3xl md:text-4xl font-black leading-tight">
            Prêt pour le coup d'envoi ?
          </h2>
          <p className="text-gray-300 text-lg">
            Rejoignez la plus grande communauté de footballeurs à Dakar. Créez
            votre compte gratuitement.
          </p>

          {/* Statistiques rapides avec SVG pour éviter les dépendances de polices */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center md:justify-start">
            <div className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-primary flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-sm text-gray-300">
                Inscription gratuite
              </span>
            </div>
            <div className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-primary flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-sm text-gray-300">
                Réservation en 30 secondes
              </span>
            </div>
          </div>
        </div>

        {/* Boutons d'action */}
        <div className="flex flex-col sm:flex-row gap-4 z-10 w-full md:w-auto">
          <button
            type="button"
            onClick={handleCreateAccount}
            className="flex items-center justify-center rounded-full h-14 px-8 bg-primary hover:bg-primary/90 text-black text-base font-bold transition-all cursor-pointer shadow-lg shadow-primary/50 hover:shadow-primary/70 active:scale-95 w-full sm:w-auto"
          >
            Créer un compte
          </button>

          {/* Bouton secondaire (conservé en commentaire au cas où vous voudriez le réactiver) */}
          {/* <button
            type="button"
            onClick={() => navigate("/terrains")}
            className="flex items-center justify-center rounded-full h-14 px-8 bg-transparent border-2 border-white/20 hover:bg-white/10 text-white text-base font-bold transition-all cursor-pointer w-full sm:w-auto"
          >
            Explorer les terrains
          </button> */}
        </div>

        {/* Effets de fond animés */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/20 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none animate-pulse delay-700"></div>
      </div>

      {/* Modal de création de compte */}
      <SignupModal
        isOpen={isSignupModalOpen}
        onClose={handleCloseModal}
        onSuccess={handleSignupSuccess}
      />
    </>
  );
}
