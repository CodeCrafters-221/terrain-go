import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../services/supabaseClient";
import {
  Trophy,
  Menu as MenuIcon,
  X as XIcon,
  User as UserIcon,
  LogOut as LogOutIcon,
} from "lucide-react";

export default function Header() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
    setIsMenuOpen(false);
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
              <a
                className="text-white/90 hover:text-primary text-sm font-medium transition-colors relative group py-2"
                href="#"
              >
                Pour les propriétaires
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
              </a>
            </nav>

            {/* Desktop Auth Actions */}
            <div className="hidden lg:flex items-center gap-4">
              {user ? (
                <div className="flex items-center gap-4">
                  <Link
                    to="/profile"
                    className="flex items-center gap-2 text-white hover:text-primary transition-colors font-medium border border-white/10 rounded-full pl-1 pr-4 py-1 hover:bg-white/5"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                      <UserIcon className="w-5 h-5" />
                    </div>
                    <span>{profile?.name}</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-text-secondary hover:text-white transition-colors"
                    title="Se déconnecter"
                  >
                    <LogOutIcon className="w-5 h-5" />
                  </button>
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
            <a
              className="text-white text-2xl font-bold hover:text-primary transition-colors flex items-center gap-3 w-full justify-center p-2"
              href="#"
              onClick={() => setIsMenuOpen(false)}
            >
              Pour les propriétaires
            </a>
          </nav>

          <div className="mt-auto mb-10 w-full flex flex-col gap-4">
            {user ? (
              <>
                <Link
                  to="/profile"
                  className="w-full bg-surface-highlight hover:bg-surface-highlight/80 text-white font-bold text-lg h-14 rounded-2xl flex items-center justify-center gap-2 transition-all"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <UserIcon className="w-6 h-6" />
                  {profile?.name}
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-text-secondary hover:text-white font-medium py-4 transition-colors flex items-center justify-center gap-2"
                >
                  <LogOutIcon className="w-6 h-6" />
                  Se déconnecter
                </button>
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
