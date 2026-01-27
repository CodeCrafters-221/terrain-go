
import { Link } from "react-router-dom";
const HeaderProfile = () => {
  return (
    <>
      <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-surface-highlight bg-background-dark px-4 py-3 lg:px-10 fixed w-full top-0 z-50">
        <div className="flex items-center gap-4 lg:gap-8">
          <div className="flex items-center gap-2 lg:gap-4 text-white ">
            <span class="material-symbols-outlined  text-primary inline-block">
              sports_soccer
            </span>

            <h2 className="text-white text-xl font-bold leading-tight tracking-[-0.015em] hidden sm:block">
              Footbooking
            </h2>
          </div>
          {/* Search Bar */}
          <label className="hidden md:flex flex-col min-w-40 h-10 max-w-64">
            <div className="flex w-full flex-1 items-stretch rounded-xl h-full group">
              <div className="text-text-secondary flex border-none bg-surface-highlight items-center justify-center pl-4 rounded-l-xl border-r-0 group-focus-within:text-primary transition-colors">
                <span className="material-symbols-outlined text-[20px]">
                  search
                </span>
              </div>
              <input
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-white focus:outline-0 focus:ring-0 border-none bg-surface-highlight focus:border-none h-full placeholder:text-text-secondary px-4 rounded-l-none border-l-0 pl-2 text-sm font-normal leading-normal transition-all"
                placeholder="Rechercher un terrain..."
                defaultValue=""
              />
            </div>
          </label>
        </div>
        <div className="flex flex-1 justify-end items-center gap-4 lg:gap-8">
          <nav className="hidden lg:flex items-center gap-9">
            <Link
              className="text-white hover:text-primary transition-colors text-sm font-medium leading-normal"
              to={"/"}
            >
              Accueil
            </Link>
            <Link
              className="text-white hover:text-primary transition-colors text-sm font-medium leading-normal"
              href="#"
            >
              Terrains
            </Link>
            <a
              className="text-white hover:text-primary transition-colors text-sm font-medium leading-normal"
              href="#"
            >
              Communauté
            </a>
          </nav>
          <button className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-6 bg-primary hover:bg-[#d96f0b] transition-colors text-background-dark text-sm font-bold leading-normal tracking-[0.015em] shadow-[0_0_15px_rgba(242,127,13,0.3)]">
            <span className="truncate">Réserver</span>
          </button>
        </div>
      </header>
    </>
  );
};

export default HeaderProfile;
