import { useState } from "react";
import { Link } from "react-router-dom";

const HeaderProfile = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-surface-highlight bg-background-dark/95 backdrop-blur-md px-4 py-3 lg:px-10 fixed w-full top-0 z-50 transition-all duration-300">
        <div className="flex items-center gap-4 lg:gap-8">
          <Link
            to="/"
            className="flex items-center gap-2 lg:gap-4 text-white group"
          >
            <span className="material-symbols-outlined text-primary inline-block text-3xl transition-transform group-hover:scale-110">
              sports_soccer
            </span>

            <h2 className="text-white text-xl font-bold leading-tight tracking-[-0.015em] hidden sm:block font-display">
              Footbooking
            </h2>
          </Link>
          {/* Search Bar Desktop */}
          <label className="hidden lg:flex flex-col min-w-40 h-10 max-w-64">
            <div className="flex w-full flex-1 items-stretch rounded-xl h-full group">
              <div className="text-text-secondary flex border-none bg-surface-highlight items-center justify-center pl-4 rounded-l-xl border-r-0 group-focus-within:text-primary transition-colors">
                <span className="material-symbols-outlined text-[20px]">
                  search
                </span>
              </div>
              <input
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-white focus:outline-0 focus:ring-1 focus:ring-primary/50 border-none bg-surface-highlight focus:border-none h-full placeholder:text-text-secondary px-4 rounded-l-none border-l-0 pl-2 text-sm font-normal leading-normal transition-all"
                placeholder="Rechercher un terrain..."
                defaultValue=""
              />
            </div>
          </label>
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

          <button className="hidden sm:flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-6 bg-primary hover:bg-[#d96f0b] transition-all text-background-dark text-sm font-bold leading-normal tracking-[0.015em] shadow-[0_0_15px_rgba(242,127,13,0.3)] hover:shadow-[0_0_20px_rgba(242,127,13,0.5)] active:scale-95">
            <span className="truncate">Réserver</span>
          </button>

          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden text-white p-2 rounded-full hover:bg-white/10 transition-colors z-[1000] relative"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span className="material-symbols-outlined text-2xl">
              {isMenuOpen ? "close" : "menu"}
            </span>
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        <div
          className={`fixed inset-0 bg-[#231a10] z-[999] lg:hidden transition-all duration-300 flex flex-col pt-24 px-6 gap-8 ${
            isMenuOpen
              ? "opacity-100 visible"
              : "opacity-0 invisible pointer-events-none"
          }`}
        >
          {/* Mobile Search */}
          <div className="flex w-full items-center rounded-xl h-12 bg-surface-highlight border border-transparent focus-within:border-primary transition-colors">
            <div className="text-text-secondary flex items-center justify-center pl-4">
              <span className="material-symbols-outlined text-[20px]">
                search
              </span>
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
              <span className="material-symbols-outlined">home</span>
              Accueil
            </Link>
            <Link
              className="text-white text-xl font-bold hover:text-primary transition-colors flex items-center gap-4 p-2"
              to={"/search"}
              onClick={() => setIsMenuOpen(false)}
            >
              <span className="material-symbols-outlined">stadium</span>
              Terrains
            </Link>
            <a
              className="text-white text-xl font-bold hover:text-primary transition-colors flex items-center gap-4 p-2"
              href="#"
              onClick={() => setIsMenuOpen(false)}
            >
              <span className="material-symbols-outlined">groups</span>
              Communauté
            </a>
          </nav>

          <button
            className="w-full mt-auto mb-8 h-14 rounded-xl bg-primary text-background-dark text-lg font-bold shadow-lg shadow-primary/20 flex items-center justify-center gap-2 active:scale-95 transition-transform"
            onClick={() => setIsMenuOpen(false)}
          >
            <span className="material-symbols-outlined">calendar_add_on</span>
            Réserver un terrain
          </button>
        </div>
      </header>
    </>
  );
};

export default HeaderProfile;
