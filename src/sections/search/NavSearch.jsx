import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  Trophy,
  Menu as MenuIcon,
  X as XIcon,
  Search,
  Calendar,
  Handshake,
} from "lucide-react";

const NavSearch = () => {
  const { user, profile } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const defaultAvatar = "https://imgs.search.brave.com/SU6DjXUVoDrdq7vpMSVNfbUFdVDH5Po5Tp5hxoZmMRg/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9jZG4u/dmVjdG9yc3RvY2su/Y29tL2kvNTAwcC84/Mi8wOC9tYWxlLWFu/ZC1mZW1hbGUtcHJv/ZmlsZS1zaWxob3Vl/dHRlcy12ZWN0b3It/Mzg1NzgyMDguanBn";

  return (
    <>
      <header className="fixed w-full top-0 z-[200] bg-background-dark/95 backdrop-blur-md border-b border-surface-highlight px-4 lg:px-10 py-3 transition-all duration-300">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 lg:gap-4 text-white ">
            <Trophy className="text-primary w-8 h-8" strokeWidth={1.5} />

            <h2 className="text-white text-xl font-bold leading-tight tracking-[-0.015em] hidden sm:block font-display">
              Footbooking
            </h2>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex flex-1 justify-center gap-8">
            <a
              className="text-white text-sm font-medium leading-normal hover:text-primary transition-colors relative group"
              href="#"
            >
              Rechercher
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
            </a>
            <Link
              className="text-text-secondary text-sm font-medium leading-normal hover:text-white transition-colors relative group"
              to="/profile#reservations"
            >
              Mes Réservations
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
            </Link>
            <a
              className="text-text-secondary text-sm font-medium leading-normal hover:text-white transition-colors relative group"
              href="#"
            >
              Devenir Partenaire
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
            </a>
          </nav>

          <div className="flex items-center gap-4">
            {user ? (
              <Link to={profile?.role === "owner" ? "/dashboard" : "/profile"}>
                <div
                  className="bg-center bg-no-repeat bg-cover rounded-full size-10 border-2 border-surface-highlight hover:border-primary transition-colors cursor-pointer"
                  style={{
                    backgroundImage: `url("${profile?.image || defaultAvatar}")`,
                  }}
                ></div>
              </Link>
            ) : (
              <Link
                to="/auth/login"
                className="hidden sm:flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-6 bg-primary hover:bg-orange-600 transition-all text-background-dark text-sm font-bold leading-normal tracking-[0.015em] shadow-lg shadow-primary/20"
              >
                <span className="truncate">Connexion</span>
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden text-white p-1 rounded-full hover:bg-white/10 transition-colors z-[300] relative"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <XIcon className="w-8 h-8" />
              ) : (
                <MenuIcon className="w-8 h-8" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <div
          className={`fixed inset-0 bg-[#231a10] backdrop-blur-xl z-[250] md:hidden transition-all duration-300 flex flex-col justify-center items-center gap-8 ${isMenuOpen
            ? "opacity-100 visible top-[60px]"
            : "opacity-0 invisible -top-full"
            }`}
          style={{ height: "calc(100vh - 60px)" }}
        >
          <nav className="flex flex-col items-center gap-8 w-full max-w-xs">
            <a
              className="text-white text-2xl font-bold hover:text-primary transition-colors flex items-center gap-3 w-full justify-center p-4 rounded-2xl hover:bg-white/5 active:bg-white/10"
              href="#"
              onClick={() => setIsMenuOpen(false)}
            >
              <Search className="w-6 h-6" />
              Rechercher
            </a>
            <Link
              className="text-text-secondary text-xl font-medium hover:text-white transition-colors flex items-center gap-3 w-full justify-center p-4 rounded-2xl hover:bg-white/5"
              to="/profile#reservations"
              onClick={() => setIsMenuOpen(false)}
            >
              <Calendar className="w-6 h-6" />
              Mes Réservations
            </Link>
            <a
              className="text-text-secondary text-xl font-medium hover:text-white transition-colors flex items-center gap-3 w-full justify-center p-4 rounded-2xl hover:bg-white/5"
              href="#"
              onClick={() => setIsMenuOpen(false)}
            >
              <Handshake className="w-6 h-6" />
              Devenir Partenaire
            </a>

            {!user && (
              <Link
                to="/auth/login"
                className="w-full flex items-center justify-center h-14 bg-primary text-background-dark text-lg font-bold rounded-xl shadow-xl shadow-primary/20 mt-4 active:scale-95 transition-transform"
                onClick={() => setIsMenuOpen(false)}
              >
                Connexion
              </Link>
            )}
          </nav>
        </div>
      </header>
    </>
  );
};

export default NavSearch;
