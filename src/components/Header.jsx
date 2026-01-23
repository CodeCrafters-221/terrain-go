import { useState } from "react";
import { Link } from "react-router";
import Login from "../pages/Auth/Login";
import { toast } from "react-toastify";

export default function Header() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const handleLogin = () => {
    setIsLoginModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsLoginModalOpen(false);
  };

  const handleLoginSuccess = () => {
    setIsLoginModalOpen(false);
  };

  const handleLoginError = (error) => {
    toast.error(error)
  }

  return (
    <>
      <div className="header">
        <div className="flex items-center gap-2">
          <span class="material-symbols-outlined text-3xl text-primary">
            sports_soccer
          </span>
          <h2 className="text-3xl  text-white font-lexend  tracking-wider font-bold">
            Footbooking
          </h2>
        </div>
        <div className=" navigation md:flex">
          <a
            className="text-white hover:text-primary transition-colors text-lg font-Archivo black font-medium leading-normal"
            href="/"
          >
            Accueil
          </a>
          <Link
            className="text-white hover:text-primary transition-colors text-lg font-Archivo black font-medium leading-normal"
            to="/search"
          >
            Trouver un terrain
          </Link>
          <a
            className="text-white hover:text-primary transition-colors text-lg font-Archivo black font-medium leading-normal"
            href="#"
          >
            Pour les propriétaires
          </a>

          <button onClick={handleLogin} className="bg-primary rounded-full font-montserrat font-semibold text-text text-lg px-4 py-2 cursor-pointer">
            Se connecter
          </button>
        </div>

      </div>
      {/* Modal de création de compte */}
      <Login
        isOpen={isLoginModalOpen}
        onClose={handleCloseModal}
        onSuccess={handleLoginSuccess}
        onError={handleLoginError}
      />
    </>
  );
}
