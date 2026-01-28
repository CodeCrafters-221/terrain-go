const FilterSidebar = ({ filters, onFilterChange, isOpen, onClose }) => {
  const pitchTypes = ["5x5", "7x7", "11x11", "Futsal", "Indoor"];

  const handleTypeToggle = (type) => {
    const newTypes = filters.types.includes(type)
      ? filters.types.filter((t) => t !== type)
      : [...filters.types, type];
    onFilterChange({ ...filters, types: newTypes });
  };

  return (
    <>
      {/* Overlay for mobile drawer */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-160 lg:hidden transition-opacity duration-300 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={onClose}
      />

      <aside
        className={`
        fixed inset-y-0 left-0 w-[320px] bg-background-dark z-170 lg:transform-none transform transition-transform duration-300 cubic-[0.16,1,0.3,1] lg:static lg:z-0 lg:flex lg:flex-col lg:w-[340px] lg:shrink-0 lg:border-r lg:border-surface-highlight p-6 gap-8 overflow-y-auto h-full shadow-2xl lg:shadow-none
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-white tracking-tight">
            Filtres
          </h3>
          <div className="flex items-center gap-3">
            <button
              onClick={() =>
                onFilterChange({
                  types: [],
                  priceRange: [10000, 100000],
                  search: "",
                })
              }
              className="text-xs uppercase font-bold tracking-wider text-primary hover:text-white transition-colors"
            >
              Réinitialiser
            </button>
            <button
              onClick={onClose}
              className="lg:hidden p-1 rounded-full hover:bg-white/10 text-white transition-colors"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        </div>

        {/* Location Filter */}
        <div className="flex flex-col gap-3">
          <p className="text-white text-base font-bold">Quartier</p>
          <div className="group flex w-full items-center rounded-xl bg-surface-dark border border-surface-highlight focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/50 transition-all duration-300">
            <input
              className="flex-1 bg-transparent text-white focus:outline-none h-12 px-4 placeholder:text-text-secondary text-sm"
              placeholder="Ex: Almadies, Mermoz..."
              value={filters.search}
              onChange={(e) =>
                onFilterChange({ ...filters, search: e.target.value })
              }
            />
            <div className="flex items-center justify-center pr-4 text-text-secondary group-focus-within:text-primary transition-colors">
              <span className="material-symbols-outlined">search</span>
            </div>
          </div>
        </div>

        {/* Pitch Type Filter */}
        <div className="flex flex-col gap-3">
          <p className="text-white text-base font-bold">Type de terrain</p>
          <div className="flex flex-wrap gap-2">
            {pitchTypes.map((type) => (
              <label key={type} className="cursor-pointer group">
                <input
                  className="peer sr-only"
                  type="checkbox"
                  checked={filters.types.includes(type)}
                  onChange={() => handleTypeToggle(type)}
                />
                <span className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-surface-highlight bg-white/5 text-sm font-medium text-text-secondary peer-checked:bg-primary peer-checked:border-primary peer-checked:text-background-dark transition-all duration-300 group-hover:bg-white/10 group-active:scale-95 select-none">
                  {filters.types.includes(type) && (
                    <span className="material-symbols-outlined text-sm animate-fade-in font-bold">
                      check
                    </span>
                  )}
                  {type}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Price Filter */}
        <div className="flex flex-col gap-5">
          <div className="flex justify-between items-center">
            <p className="text-white text-base font-bold">Prix max</p>
            <span className="bg-primary/20 text-primary px-3 py-1 rounded-lg text-sm font-bold border border-primary/20">
              {filters.priceRange[1].toLocaleString()} F
            </span>
          </div>
          <div className="relative h-6 flex items-center">
            <input
              type="range"
              min="10000"
              max="100000"
              step="5000"
              value={filters.priceRange[1]}
              onChange={(e) =>
                onFilterChange({
                  ...filters,
                  priceRange: [filters.priceRange[0], parseInt(e.target.value)],
                })
              }
              className="w-full h-1.5 bg-surface-highlight rounded-lg appearance-none cursor-pointer accent-primary hover:accent-orange-400 focus:outline-none focus:ring-2 focus:ring-primary/30 rounded-full"
            />
          </div>
        </div>

        <button
          onClick={onClose}
          className="mt-auto w-full bg-white text-background-dark hover:bg-primary hover:text-white font-bold h-12 rounded-xl transition-all shadow-lg hover:shadow-primary/20 flex items-center justify-center gap-2 lg:hidden active:scale-95"
        >
          <span className="material-symbols-outlined">check_circle</span>
          Afficher{" "}
          {filters.search
            ? `résultats pour "${filters.search}"`
            : "les résultats"}
        </button>
      </aside>
    </>
  );
};

export default FilterSidebar;
