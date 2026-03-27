import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../services/supabaseClient";
import { toast } from "react-toastify";
import mainLogo from "../../assets/img/mainLogo.png";
import { useAuth } from "../../context/AuthContext";

import {
  Trophy,
  Search,
  Menu as MenuIcon,
  X as XIcon,
  LogOut as LogOutIcon,
  Home,
  LandPlot,
  Users,
  CalendarPlus,
} from "lucide-react";

const HeaderProfile = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const defaultAvatar =
    "https://imgs.search.brave.com/SU6DjXUVoDrdq7vpMSVNfbUFdVDH5Po5Tp5hxoZmMRg/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9jZG4u/dmVjdG9yc3RvY2su/Y29tL2kvNTAwcC84/Mi8wOC9tYWxlLWFu/ZC1mZW1hbGUtcHJv/ZmlsZS1zaWxob3Vl/dHRlcy12ZWN0b3It/Mzg1NzgyMDguanBn";

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      toast.success("Déconnexion réussie");
      navigate("/");
      setIsMenuOpen(false);
    } catch (err) {
      console.error("Error signing out:", err);
      toast.error("Erreur lors de la déconnexion");
    }
  };

  return (
    <>
      <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-surface-highlight bg-[#231a10] px-4 py-3 lg:px-10  w-full top-0 z-50 transition-all duration-300 h-[104px]">
        <div className="flex items-center gap-4 lg:gap-8">
          <Link to="/" className="flex items-center gap-3 group border-none">
            <h2 className="text-2xl font-display font-bold text-white tracking-wide group-hover:text-primary/90 transition-colors">
              {mainLogo ? (
                <img
                  src={mainLogo}
                  alt="Logo"
                  className="h-34 object-contain "
                />
              ) : (
                "Footbooking"
              )}
            </h2>
          </Link>
          {/* Search Bar Desktop */}
          {/* <label className="hidden lg:flex flex-col min-w-40 h-10 max-w-64">
            <div className="flex w-full flex-1 items-stretch rounded-xl h-full group">
              <div className="text-text-secondary flex border-none bg-surface-highlight items-center justify-center pl-4 rounded-l-xl border-r-0 group-focus-within:text-primary transition-colors">
                <Search className="w-5 h-5" />
              </div>
              <input
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-white focus:outline-0 focus:ring-1 focus:ring-primary/50 border-none bg-surface-highlight focus:border-none h-full placeholder:text-text-secondary px-4 rounded-l-none border-l-0 pl-2 text-sm font-normal leading-normal transition-all"
                placeholder="Rechercher un terrain..."
                defaultValue=""
              />
            </div>
          </label> */}
        </div>

        <div className="flex flex-1 justify-end items-center gap-4 lg:gap-8">
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-9">
            <Link
              className="text-white hover:text-primary transition-colors text-sm font-medium leading-normal relative group"
              to={"/"}
            >
              Accueil
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
            </Link>
            <Link
              className="text-white hover:text-primary transition-colors text-sm font-medium leading-normal relative group"
              to={"/search"}
            >
              Terrains
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
            </Link>
            <a
              className="text-white hover:text-primary transition-colors text-sm font-medium leading-normal relative group"
              href="#"
            >
              Communauté
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
            </a>
          </nav>

          <button
            onClick={handleLogout}
            className="hidden lg:flex items-center justify-center text-text-secondary hover:text-white transition-colors"
            title="Se déconnecter"
          >
            <LogOutIcon className="w-5 h-5" />
          </button>
          {/* <button className="hidden sm:flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-6 bg-primary hover:bg-[#d96f0b] transition-all text-background-dark text-sm font-bold leading-normal tracking-[0.015em] shadow-[0_0_15px_rgba(242,127,13,0.3)] hover:shadow-[0_0_20px_rgba(242,127,13,0.5)] active:scale-95">
            <span className="truncate">Réserver</span>
          </button> */}
          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden text-white p-2 rounded-full hover:bg-white/10 transition-colors z-1000 relative"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <XIcon className="w-8 h-8" />
            ) : (
              <MenuIcon className="w-8 h-8" />
            )}
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        <div
          className={`fixed inset-0 bg-[#231a10] z-999 lg:hidden transition-all duration-300 flex flex-col pt-24 px-6 gap-8 ${
            isMenuOpen
              ? "opacity-100 visible"
              : "opacity-0 invisible pointer-events-none"
          }`}
        >
          {/* Mobile Search */}
          <div className="flex w-full items-center rounded-xl h-12 bg-surface-highlight border border-transparent focus-within:border-primary transition-colors">
            <div className="text-text-secondary flex items-center justify-center pl-4">
              <Search className="w-5 h-5" />
            </div>
            <input
              className="flex-1 bg-transparent text-white focus:outline-none h-full px-3 placeholder:text-text-secondary text-base"
              placeholder="Rechercher..."
            />
          </div>

          <nav className="flex flex-col gap-6">
            <Link
              className="text-white text-xl font-bold hover:text-primary transition-colors flex items-center gap-4 p-2"
              to={"/"}
              onClick={() => setIsMenuOpen(false)}
            >
              <Home className="w-6 h-6" />
              Accueil
            </Link>
            <Link
              className="text-white text-xl font-bold hover:text-primary transition-colors flex items-center gap-4 p-2"
              to={"/search"}
              onClick={() => setIsMenuOpen(false)}
            >
              <LandPlot className="w-6 h-6" />
              Terrains
            </Link>
            <a
              className="text-white text-xl font-bold hover:text-primary transition-colors flex items-center gap-4 p-2"
              href="#"
              onClick={() => setIsMenuOpen(false)}
            >
              <Users className="w-6 h-6" />
              Communauté
            </a>
            <Link
              className="text-white text-xl font-bold hover:text-primary transition-colors flex items-center gap-4 p-2 w-full text-left"
              to={profile?.role === "owner" ? "/dashboard/compte" : "/compte"}
              onClick={() => setIsMenuOpen(false)}
            >
              <div
                className="bg-center bg-no-repeat bg-cover rounded-full size-6 border border-white"
                style={{
                  backgroundImage: `url("${profile?.image || defaultAvatar}")`,
                }}
              ></div>
              Mon Profil
            </Link>
            <button
              className="text-[#ef4444] text-xl font-bold hover:text-[#dc2626] transition-colors flex items-center gap-4 p-2 w-full text-left"
              onClick={handleLogout}
            >
              <LogOutIcon className="w-6 h-6" />
              Déconnexion
            </button>
          </nav>

          <button
            className="w-full mt-auto mb-8 h-14 rounded-xl bg-primary text-background-dark text-lg font-bold shadow-lg shadow-primary/20 flex items-center justify-center gap-2 active:scale-95 transition-transform"
            onClick={() => setIsMenuOpen(false)}
          >
            <CalendarPlus className="w-6 h-6" />
            Réserver un terrain
          </button>
        </div>
      </header>
    </>
  );
};

export default HeaderProfile;
