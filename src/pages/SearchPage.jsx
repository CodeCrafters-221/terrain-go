import { useState, useMemo } from "react";
import NavSearch from "../sections/search/NavSearch";
import CardSearch from "../sections/search/CardSearch";
import Pagination from "../sections/search/Pagination";
import FilterSidebar from "../sections/search/FilterSidebar";

const initialTerrains = [
  {
    id: 1,
    name: "Five Star Almadies",
    location: "Almadies, Dakar",
    type: "5x5",
    price: 25000,
    rating: 4.8,
    reviews: 120,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDJyCPuvAPVIKcSLBSEdOMFL38okIhGumyFxHkp9sOCoG-JLXnxAjOjIyNBlVDzxdtHRnFNKW8j6WVHCDRnsx3naFwFW5VXtccX6A9ryHFg-L5pZ47TVQVXWZZsRieCw6GF6Pt2sK014Yi6Eu0rwwQt04PcnKlqLK0_kk8TKH66NYlcDI6WKF5NVvGPl5N90UrW_6loXUOxhy2p28ZMWxxFk4MfM-qWMaHkKjZisoz90EQhmOcPEvmb5u0bYZ8yygbJFPXb0FPeuA",
    isAvailable: true,
  },
  {
    id: 2,
    name: "Stade Mermoz",
    location: "Mermoz, Dakar",
    type: "7x7",
    price: 40000,
    rating: 4.5,
    reviews: 85,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB0Wb84szBkwmR5OvfD5uJ2tICIw3GDBnLW2faRr6V0W5tW7aLn0QZPOSbTmJ7307Xt-jrL1I34D_tFyHUqKLcoQJtO1Ya0-YTtiKsuIwWkdrHZLg-1ywHtH1rTXUqRTmCyo6yOwgNbRs-qFnqc1IanMIxVZtTuiAdAtztUP7yA7tJ3FqSjG375-qfM99hoaa4zjfKL6IJK_IyOlpZIcgPM8Uk85ckZ1zTP_OXvEY3mgSchLrfqjzNuNLMuC4HYmjJvGvsSTzDeZw",
    isAvailable: false,
  },
  {
    id: 3,
    name: "Urban Soccer Point E",
    location: "Point E, Dakar",
    type: "Futsal",
    price: 30000,
    rating: 4.9,
    reviews: 210,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA94FxhHE4pcG8ffC_8eUfxeZPnM9GFhZPsnxbDm_vKpaDhw3MjBNjoKpIa7EYiKyvtt0Mp17DA9Tm_xumwuKs4zodThFr0t6jPF9ZUoR_xaq_bAZmnnNa-nH31SZ6bRvf6iNPUZh5EPx0Eh240wBeWRehx42j9AOnmP6KVv7nYfV0mXQ1ciAB9paDvV8x5baUX487v74uw7vwb9rheqahoj6xpMJbNG2JfsVnsAip7nBfa8tVJeO7oizsaw5gZ9G-afxj7puz8Vg",
    isAvailable: true,
  },
  {
    id: 4,
    name: "Sacré-Cœur Arena",
    location: "Sacré-Cœur 3, Dakar",
    type: "5x5",
    price: 20000,
    rating: 4.2,
    reviews: 45,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDN06CLCs3ezYW-NPMha2qXhIlF1CvldedIJOIfQQn-0igc48Ph3jYbDOa1zpFCmuym39TwepFgkqqU874VpAL2TJzEq9C8iNanusM46o8-JZpFGotQuRNLpLsX0OuHtqaaaI4jRo96vINN5xSoqBRXbJp8_jGXGvBcSJHykKn_UKnm4EnvKUhhjIfec5g9UQqgtXUl92dxCBERebuG2yqNSEF4uU0ODuHpyYIAWM1fcvl27SoO_CCKfX65WQyPtOPH9pVkFXzObQ",
    isAvailable: true,
  },
  {
    id: 5,
    name: "Stade Léopold S. Senghor",
    location: "Parcelles Assainies, Dakar",
    type: "11x11",
    price: 75000,
    rating: 4.7,
    reviews: 302,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD6r0K4GTN9PNktFdDG3vqP2-h9eMEiyXWkJ9e9fbAoOJrM5miq1CmXZSoFNGsVo274xDpHUpJ3wsZOkPP8W9zi9IlGEOxeGG4G7QicL9_x3kJdYRxjJSCpdrM9WvyXXhTQqazC2rnhhwbaIZCLWUwIDM2coiZdk4wE_zPaaXyoxYhgRXPLlmGYy3-lcsBWLa-RsVffWTWMjAP3rhzAcYz17v1MAnTFhla4nOWJf4YikbRxi7NKOHR08bvdTQeTbvFAmkFx_jli-w",
    isAvailable: false,
  },
  {
    id: 6,
    name: "Olympique Ngor",
    location: "Ngor, Dakar",
    type: "7x7",
    price: 35000,
    rating: 4.6,
    reviews: 92,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDy-AEaIEtnTsDPpunuRR1lvS9Eep78iemMHaYtjAKy5WDo1xHo-LqDhe6jpuR-jGkFJH6ckRTD-VYrHHUa0RMSASB1LhMC3BM_BbW9EtcsnNGNCWuhzn7l8lIvN2uAZd5Vo6if0Be98FF7nsErVwi3NX5Gx7qOjziKoiCjW0zFU01o5F6G7kSz9SaXCxwzDHLjSEE_DsQpB3d_b0BOxUxocdD6MgJ8ikFjanKDGdu8PLlrrjOkXHGNcySh_wO3yeXtpzZ_zQp75A",
    isAvailable: true,
  },
];

const SearchPage = () => {
  const [filters, setFilters] = useState({
    search: "",
    types: [],
    priceRange: [0, 100000],
  });
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  const filteredTerrains = useMemo(() => {
    return initialTerrains.filter((terrain) => {
      const matchesSearch =
        terrain.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        terrain.location.toLowerCase().includes(filters.search.toLowerCase());
      const matchesType =
        filters.types.length === 0 || filters.types.includes(terrain.type);
      const matchesPrice = terrain.price <= filters.priceRange[1];

      return matchesSearch && matchesType && matchesPrice;
    });
  }, [filters]);

  return (
    <div className="bg-background-dark text-white min-h-screen flex flex-col overflow-x-hidden font-display">
      {/* Top Navigation */}
      <NavSearch />

      {/* Main Layout */}
      <div className="flex flex-1 max-w-[1440px] mx-auto w-full pt-28 pb-10 sm:pt-24 px-4 sm:px-6 lg:px-8">
        {/* Sidebar Filters - Now with mobile drawer support */}
        <FilterSidebar
          filters={filters}
          onFilterChange={setFilters}
          isOpen={isFilterDrawerOpen}
          onClose={() => setIsFilterDrawerOpen(false)}
        />

        {/* Main Content (Results) */}
        <main className="flex-1 flex flex-col gap-6 w-full">
          {/* Page Header */}
          <div className="flex flex-col md:flex-row justify-between items-center md:items-end gap-4 mb-2">
            <div className="text-center md:text-left w-full md:w-auto">
              <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight mb-2">
                Trouvez votre terrain
              </h1>
              <p className="text-text-secondary text-sm">
                {filteredTerrains.length} terrains disponibles pour{" "}
                <span className="text-primary font-medium">5 Octobre</span>
              </p>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setIsFilterDrawerOpen(true)}
                className="flex lg:hidden flex-1 md:flex-none items-center justify-center gap-2 px-4 py-3 bg-surface-dark border border-surface-highlight rounded-xl text-white hover:border-primary transition-all font-bold shadow-lg"
              >
                <span className="material-symbols-outlined text-xl">
                  filter_list
                </span>
                <span>Filtres</span>
              </button>

              <div className="flex items-center gap-2 bg-surface-dark p-1 rounded-lg border border-surface-highlight shrink-0 hidden sm:flex">
                <button className="px-3 py-1.5 rounded-md bg-white/10 text-white shadow-sm flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">
                    grid_view
                  </span>
                  <span className="text-sm font-medium hidden sm:block">
                    Grille
                  </span>
                </button>
                <button className="px-3 py-1.5 rounded-md text-text-secondary hover:text-white flex items-center gap-2 transition-colors">
                  <span className="material-symbols-outlined text-sm">map</span>
                  <span className="text-sm font-medium hidden sm:block">
                    Carte
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Results Grid */}
          <CardSearch terrains={filteredTerrains} />

          {/* Pagination */}
          <div className="mt-8">
            <Pagination />
          </div>
        </main>
      </div>
    </div>
  );
};

export default SearchPage;
