
import { Link } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

const NavSearch = () => {
     const { user } = useAuth();
  return (
    <>
      <header className="fixed w-full top-0 z-150 bg-background-dark/95 backdrop-blur-md border-b border-surface-highlight px-4 lg:px-10 py-3">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-white">
            <div className="size-8 text-primary">
              <span className="material-symbols-outlined text-4xl">
                sports_soccer
              </span>
            </div>
            <h2 className="text-white text-xl font-bold leading-tight tracking-[-0.015em] hidden sm:block">
              Dakar Foot
            </h2>
          </div>
          <nav className="hidden md:flex flex-1 justify-center gap-8">
            <a
              className="text-white text-sm font-medium leading-normal hover:text-primary transition-colors"
              href="#"
            >
              Rechercher
            </a>
            <a
              className="text-text-secondary text-sm font-medium leading-normal hover:text-white transition-colors"
              href="#"
            >
              Mes Réservations
            </a>
            <a
              className="text-text-secondary text-sm font-medium leading-normal hover:text-white transition-colors"
              href="#"
            >
              Devenir Partenaire
            </a>
          </nav>
          <div className="flex items-center gap-4">
            {user ? (
              <Link to="/profile">
                <div
                  className="bg-center bg-no-repeat bg-cover rounded-full size-10 border-2 border-surface-dark"
                  data-alt="User profile avatar showing a smiling person"
                  style={{
                    backgroundImage:
                      'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBBdJyWt6KYLxUW18PxDybaPnYFQpsJrnXs29RH-Yjla5XXFbCa2a88Mr74ljGOR6_MAMJp5hDAenWB2pg_pFvFmtCf3yS5bttebeUmIJ46QYZZ16U6_0MfLsEPkWFGhwhu0rJqHHDXrEvzkwpmKmFGK8RH9Xt36a7uKyOrUtVEz_9RsBgST1SVrmN5QQUY7tM4vbvRfC1vynGbVZAiTlwpBjK9b99AgzZ4GIJc_cP8YbQhKNzLwOFk7jUTPvT8ZHh4VhI26lwVqw")',
                  }}
                ></div>
              </Link>
            ) : (
              <Link
                to="/auth/login"
                className="hidden sm:flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-6 bg-primary hover:bg-orange-600 transition-colors text-background-dark text-sm font-bold leading-normal tracking-[0.015em]"
              >
                <span className="truncate">Connexion</span>
              </Link>
            )}
            <button className="md:hidden text-white">
              <span className="material-symbols-outlined">menu</span>
            </button>
          </div>
        </div>
      </header>
    </>
  );
};

export default NavSearch;
