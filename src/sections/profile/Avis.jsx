
const Avis = () => {
  return (
    <>
      <div
        className="flex flex-col gap-6 pt-6 border-t border-surface-highlight"
        id="avis"
      >
        <h2 className="text-white text-2xl font-bold leading-tight">
          Mes Avis
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Pending Review Box */}
          <div className="rounded-2xl bg-linear-to-br from-surface-dark to-surface-highlight p-6 border border-primary/30 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
            <div className="flex flex-col gap-4 relative z-10">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-primary/20 p-2 rounded-full text-primary">
                  <span className="material-symbols-outlined">rate_review</span>
                </div>
                <h3 className="text-white font-bold text-lg">
                  Avis en attente
                </h3>
              </div>
              <p className="text-text-secondary text-sm">
                Comment s'est passé votre match au
                <strong>Terrain Almadies</strong> le 05 Oct ?
              </p>
              <div className="flex gap-2 my-2">
                <span className="material-symbols-outlined text-text-secondary hover:text-primary cursor-pointer text-2xl">
                  star
                </span>
                <span className="material-symbols-outlined text-text-secondary hover:text-primary cursor-pointer text-2xl">
                  star
                </span>
                <span className="material-symbols-outlined text-text-secondary hover:text-primary cursor-pointer text-2xl">
                  star
                </span>
                <span className="material-symbols-outlined text-text-secondary hover:text-primary cursor-pointer text-2xl">
                  star
                </span>
                <span className="material-symbols-outlined text-text-secondary hover:text-primary cursor-pointer text-2xl">
                  star
                </span>
              </div>
              <textarea
                className="w-full bg-background-dark/50 border border-surface-highlight rounded-lg p-3 text-white text-sm focus:border-primary focus:ring-0 resize-none h-24"
                placeholder="Écrivez votre avis ici..."
              ></textarea>
              <button className="w-full bg-primary hover:bg-[#d96f0b] text-background-dark font-bold py-2 rounded-full mt-2 transition-colors">
                Publier
              </button>
            </div>
          </div>
          {/* Past Review Item */}
          <div className="rounded-2xl bg-surface-dark p-6 border border-surface-highlight flex flex-col gap-4">
            <div className="flex justify-between items-start">
              <div className="flex gap-3">
                <div className="h-10 w-10 rounded-full bg-surface-highlight flex items-center justify-center text-white font-bold">
                  T
                </div>
                <div>
                  <h4 className="text-white font-bold">
                    Terrain Corniche Ouest
                  </h4>
                  <p className="text-xs text-text-secondary">
                    Publié le 28 Sept
                  </p>
                </div>
              </div>
              <div className="flex text-primary">
                <span className="material-symbols-outlined text-[18px] fill-current">
                  star
                </span>
                <span className="material-symbols-outlined text-[18px] fill-current">
                  star
                </span>
                <span className="material-symbols-outlined text-[18px] fill-current">
                  star
                </span>
                <span className="material-symbols-outlined text-[18px] fill-current">
                  star
                </span>
                <span className="material-symbols-outlined text-[18px] fill-current text-surface-highlight">
                  star
                </span>
              </div>
            </div>
            <p className="text-text-secondary text-sm italic">
              "Super terrain, la pelouse est bien entretenue et l'éclairage est
              top pour les matchs le soir. Je recommande !"
            </p>
            <div className="mt-auto flex justify-end">
              <button className="text-text-secondary hover:text-white text-xs font-medium underline decoration-surface-highlight underline-offset-4">
                Modifier
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Avis;
