import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../services/supabaseClient";
import { toast } from "react-toastify";
import {
  Trophy,
  Menu as MenuIcon,
  X as XIcon,
  User as UserIcon,
  LogOut,
  ChevronRight,
  Search,
} from "lucide-react";

export default function Header() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Erreur lors de la déconnexion");
    } else {
      toast.success("À bientôt !");
      navigate("/");
    }
  };


  return (
    <>
      <header className="fixed w-full top-0 z-999 bg-[#231a10] border-b border-white/5 transition-all duration-300">
        <div className="max-w-350 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <Trophy
                className="w-10 h-10 text-primary transition-transform group-hover:rotate-12"
                strokeWidth={1.5}
              />
              <h2 className="text-2xl font-display font-bold text-white tracking-wide group-hover:text-primary/90 transition-colors">
                Footbooking
              </h2>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              <Link
                className="text-white/90 hover:text-primary text-sm font-medium transition-colors relative group py-2"
                to="/"
              >
                Accueil
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link
                className="text-white/90 hover:text-primary text-sm font-medium transition-colors relative group py-2"
                to="/search"
              >
                Trouver un terrain
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
              </Link>
              {profile?.role === "owner" ? (
                <Link
                  className="text-white font-bold bg-primary/20 border border-primary/30 px-4 py-1.5 rounded-full hover:bg-primary hover:text-black transition-all text-sm"
                  to="/dashboard"
                >
                  Mon Dashboard
                </Link>
              ) : (
                <Link
                  className="text-white/90 hover:text-primary text-sm font-medium transition-colors relative group py-2"
                  to="/dashboard"
                >
                  Pour les propriétaires
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
                </Link>
              )}
            </nav>

            {/* Desktop Auth Actions */}
            <div className="hidden lg:flex items-center gap-4">
              {user ? (
                <div className="flex items-center gap-4">
                  <Link
                    to={profile?.role === "owner" ? "/dashboard" : "/profile"}
                    className="flex items-center gap-2 text-white hover:text-primary transition-colors font-medium border border-white/10 rounded-full pl-1 pr-4 py-1 hover:bg-white/5"
                  >
                    <img
                      src={profile?.image || "https://imgs.search.brave.com/SU6DjXUVoDrdq7vpMSVNfbUFdVDH5Po5Tp5hxoZmMRg/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9jZG4u/dmVjdG9yc3RvY2su/Y29tL2kvNTAwcC84/Mi8wOC9tYWxlLWFu/ZC1mZW1hbGUtcHJv/ZmlsZS1zaWxob3Vl/dHRlcy12ZWN0b3It/Mzg1NzgyMDguanBn"}
                      className="size-12 object-cover rounded-full"
                    />
                    <span>{profile?.name || "Sans Nom"}</span>
                  </Link>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="bg-primary hover:bg-[#d96f0b] text-background-dark font-bold text-sm px-6 py-2.5 rounded-full transition-all shadow-[0_0_15px_rgba(242,127,13,0.3)] hover:shadow-[0_0_20px_rgba(242,127,13,0.5)] transform hover:-translate-y-0.5"
                >
                  Se connecter
                </Link>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className="lg:hidden p-2 text-white hover:bg-white/10 rounded-full transition-colors z-1000 relative"
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
          className={`fixed inset-0 bg-[#231a10] z-999 lg:hidden transition-all duration-300 flex flex-col pt-24 px-6 gap-8 ${isMenuOpen
            ? "opacity-100 visible"
            : "opacity-0 invisible pointer-events-none"
            }`}
        >
          <nav className="flex flex-col gap-6 items-center w-full">
            <Link
              className="text-white text-2xl font-bold hover:text-primary transition-colors flex items-center gap-3 w-full justify-center p-2"
              to="/"
              onClick={() => setIsMenuOpen(false)}
            >
              Accueil
            </Link>
            <Link
              className="text-white text-2xl font-bold hover:text-primary transition-colors flex items-center gap-3 w-full justify-center p-2"
              to="/search"
              onClick={() => setIsMenuOpen(false)}
            >
              Trouver un terrain
            </Link>
            {profile?.role === "owner" ? (
              <Link
                className="text-primary text-2xl font-bold transition-colors flex items-center gap-3 w-full justify-center p-2"
                to="/dashboard"
                onClick={() => setIsMenuOpen(false)}
              >
                Mon Dashboard
              </Link>
            ) : (
              <Link
                className="text-white text-2xl font-bold hover:text-primary transition-colors flex items-center gap-3 w-full justify-center p-2"
                to="/dashboard"
                onClick={() => setIsMenuOpen(false)}
              >
                Pour les propriétaires
              </Link>
            )}
          </nav>

          <div className="mt-auto mb-10 w-full flex flex-col gap-4">
            {user ? (
              <>
                <Link
                  to={profile?.role === "owner" ? "/dashboard" : "/profile"}
                  className="w-full bg-surface-highlight hover:bg-surface-highlight/80 text-white font-bold text-lg h-14 rounded-2xl flex items-center justify-center gap-2 transition-all"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <UserIcon className="w-6 h-6" />
                  {profile?.name || "Profil"}
                </Link>
              </>
            ) : (
              <Link
                to="/login"
                className="w-full bg-primary hover:bg-[#d96f0b] text-background-dark font-bold text-lg h-14 rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 transition-all"
                onClick={() => setIsMenuOpen(false)}
              >
                Se connecter
              </Link>
            )}
          </div>
        </div>

      </header>
    </>
  );
}
