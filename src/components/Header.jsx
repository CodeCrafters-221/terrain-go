import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Trophy, Menu as MenuIcon, X as XIcon } from "lucide-react";

export default function Header() {
  const { user, profile } = useAuth();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // 👇 Detecter un scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={`
        fixed top-0 left-0 w-full z-50 transition-all duration-300
        ${
          scrolled
            ? "bg-background-dark/95 backdrop-blur border-b border-white/10 shadow-lg"
            : "bg-transparent"
        }
      `}
      >
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

              {user ? (
                profile?.role === "owner" ? (
                  <Link
                    className="text-white font-bold bg-primary/20 border border-primary/30 px-4 py-1.5 rounded-full hover:bg-primary hover:text-black transition-all text-sm"
                    to="/dashboard"
                  >
                    Mon Dashboard
                  </Link>
                ) : (
                  <Link
                    className="text-white/90 hover:text-primary text-sm font-medium transition-colors relative group py-2"
                    to="/owners"
                  >
                    Devenir partenaire
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                )
              ) : (
                <Link
                  className="text-white/90 hover:text-primary text-sm font-medium transition-colors relative group py-2"
                  to="/owners"
                >
                  Pour les propriétaires
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
                </Link>
              )}
            </nav>

            {/* Desktop Auth */}
            <div className="hidden lg:flex items-center gap-4">
              {user ? (
                <Link
                  to={
                    profile?.role === "owner" ? "/dashboard/compte" : "/compte"
                  }
                  className="flex items-center gap-2 text-white hover:text-primary transition-colors font-medium border border-white/10 rounded-full pl-1 pr-4 py-1 hover:bg-white/5"
                >
                  <img
                    src={
                      profile?.image ||
                      "https://imgs.search.brave.com/SU6DjXUVoDrdq7vpMSVNfbUFdVDH5Po5Tp5hxoZmMRg/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9jZG4u/dmVjdG9yc3RvY2su/Y29tL2kvNTAwcC84/Mi8wOC9tYWxlLWFu/ZC1mZW1hbGUtcHJv/ZmlsZS1zaWxob3Vl/dHRlcy12ZWN0b3It/Mzg1NzgyMDguanBn"
                    }
                    className="size-12 object-cover rounded-full"
                  />
                  <span>{profile?.name || "Sans Nom"}</span>
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="bg-primary hover:bg-[#d96f0b] text-background-dark font-bold text-sm px-6 py-2.5 rounded-full transition-all shadow-[0_0_15px_rgba(242,127,13,0.3)] hover:shadow-[0_0_20px_rgba(242,127,13,0.5)] transform hover:-translate-y-0.5"
                >
                  Se connecter
                </Link>
              )}
            </div>

            {/* Mobile toggle */}
            <button
              className="lg:hidden p-2 text-white hover:bg-white/10 rounded-full transition-colors z-50 relative"
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

        {/* Mobile menu */}
        <div
          className={`fixed inset-0 bg-background-dark z-40 lg:hidden transition-all duration-300 flex flex-col pt-24 px-6 gap-8 ${
            isMenuOpen
              ? "opacity-100 visible"
              : "opacity-0 invisible pointer-events-none"
          }`}
        >
          {/* navigation mobile conservée */}
        </div>
      </header>
    </>
  );
}
