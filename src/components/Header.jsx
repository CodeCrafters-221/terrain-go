import { Link, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../services/supabaseClient";

export default function Header() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();

    navigate("/");
  }

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

          {
            user ?
              <>
                <Link to="/profile">Profil</Link>
                <button onClick={handleLogout}>Logout</button>
              </>
              :
              <Link to="/login"
                onClick={() => { }}
                className="bg-primary rounded-full font-montserrat font-semibold text-text text-lg px-4 py-2 cursor-pointer hover:bg-primary/90 transition-colors"
              >
                Se connecter
              </Link>
          }

        </div>
      </div>
    </>
  );
}
