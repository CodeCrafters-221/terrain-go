import { useState, useMemo, useEffect } from "react";
import NavSearch from "../sections/search/NavSearch";
import CardSearch from "../sections/search/CardSearch";
import Pagination from "../sections/search/Pagination";
import FilterSidebar from "../sections/search/FilterSidebar";
import { ListFilter, LayoutGrid, Map } from "lucide-react";
import ReservationModal from "../components/ReservationModal";
import { supabase } from "../services/supabaseClient";

const initialTerrains = [];

const SearchPage = () => {
  const [filters, setFilters] = useState({
    search: "",
    types: [],
    priceRange: [10000, 100000],
  });
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'map'

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // Increased from 3 to show more results

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const [selectedStadium, setSelectedStadium] = useState(null);
  const [isReservationOpen, setIsReservationOpen] = useState(false);
  const [stadiums, setStadiums] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRealStadiums = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("fields")
          .select(`
            *,
            field_images (url_image)
          `);

        if (error) throw error;

        const mapped = data.map((f) => ({
          id: f.id,
          name: f.name,
          price: f.price_per_hour || f.price || 0,
          location: f.adress,
          type: f.pelouse || "5x5", // Assurez-vous que les types correspondent à ceux de FilterSidebar
          rating: 4.8,
          reviews: 120,
          image: f.field_images?.[0]?.url_image || "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80",
          isAvailable: true,
          proprietaire_id: f.proprietaire_id
        }));

        setStadiums(mapped);
      } catch (err) {
        console.error("Error fetching stadiums:", err);
      } finally {
        setIsLoading(false);
      }
    };


    fetchRealStadiums();
  }, []);


  const filteredTerrains = useMemo(() => {
    return stadiums.filter((terrain) => {
      // Filtrage par Quartier / Nom (Quartier)
      const matchesSearch =
        filters.search === "" ||
        terrain.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        terrain.location.toLowerCase().includes(filters.search.toLowerCase());

      // Filtrage par Type (recherche d'une correspondance même partielle)
      const matchesType =
        filters.types.length === 0 ||
        filters.types.some(t => terrain.type.toLowerCase().includes(t.toLowerCase()));

      // Filtrage par Prix (inférieur ou égal au prix max)
      const matchesPrice = terrain.price <= filters.priceRange[1];

      return matchesSearch && matchesType && matchesPrice;
    });
  }, [filters, stadiums]);


  const handleReserve = (terrain) => {
    setSelectedStadium({
      id: terrain.id,
      city: terrain.name,
      price: terrain.price,
      location: terrain.location,
      totalPlayers: terrain.type,
      fieldStadium: terrain.type,
      notes: terrain.rating.toString(),
      image: terrain.image,
      proprietaire_id: terrain.proprietaire_id
    });
    setIsReservationOpen(true);
  };

  // Derived Pagination Data
  const totalPages = Math.ceil(filteredTerrains.length / itemsPerPage);
  const paginatedTerrains = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredTerrains.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredTerrains, currentPage, itemsPerPage]);

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
                {filteredTerrains.length} terrain{filteredTerrains.length > 1 ? 's' : ''} disponible{filteredTerrains.length > 1 ? 's' : ''} {filters.search ? `à "${filters.search}"` : "à Dakar"}
              </p>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setIsFilterDrawerOpen(true)}
                className="flex lg:hidden flex-1 md:flex-none items-center justify-center gap-2 px-4 py-3 bg-surface-dark border border-surface-highlight rounded-xl text-white hover:border-primary transition-all font-bold shadow-lg"
              >
                <ListFilter className="w-5 h-5" />
                <span>Filtres</span>
              </button>

              <div className="hidden sm:flex items-center gap-2 bg-surface-dark p-1 rounded-lg border border-surface-highlight shrink-0">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`px-3 py-1.5 rounded-md flex items-center gap-2 transition-all ${viewMode === "grid"
                    ? "bg-white/10 text-white shadow-sm"
                    : "text-text-secondary hover:text-white"
                    }`}
                >
                  <LayoutGrid className="w-4 h-4" />
                  <span className="text-sm font-medium hidden sm:block">
                    Grille
                  </span>
                </button>
                <button
                  onClick={() => setViewMode("map")}
                  className={`px-3 py-1.5 rounded-md flex items-center gap-2 transition-all ${viewMode === "map"
                    ? "bg-white/10 text-white shadow-sm"
                    : "text-text-secondary hover:text-white"
                    }`}
                >
                  <Map className="w-4 h-4" />
                  <span className="text-sm font-medium hidden sm:block">
                    Carte
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Results Grid or Map View */}
          {viewMode === "grid" ? (
            <>
              {isLoading ? (
                <div className="flex justify-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
              ) : (
                <CardSearch terrains={paginatedTerrains} onReserve={handleReserve} />
              )}
              <div className="mt-8">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            </>
          ) : (
            <div className="flex-1 min-h-[500px] bg-surface-dark rounded-3xl border border-surface-highlight overflow-hidden relative group">
              {/* Mock Map Background */}
              <div
                className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-luminosity hover:opacity-100 transition-all duration-700"
                style={{
                  backgroundImage:
                    "url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80')",
                }}
              ></div>
              <div className="absolute inset-0 bg-linear-to-t from-background-dark via-transparent to-transparent opacity-60"></div>

              {/* Map UI Elements */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-surface-dark/90 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl max-w-md text-center transform transition-all group-hover:scale-105 duration-500">
                  <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Map className="w-10 h-10 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">
                    Vue Carte en cours d'intégration
                  </h3>
                  <p className="text-text-secondary text-base leading-relaxed mb-6">
                    Nous préparons une expérience interactive pour vous aider à
                    localiser les terrains les plus proches de vous.
                  </p>
                  <button
                    onClick={() => setViewMode("grid")}
                    className="inline-flex items-center justify-center px-8 py-3 bg-primary text-background-dark font-bold rounded-xl hover:bg-orange-600 transition-all shadow-lg shadow-primary/20"
                  >
                    Retour à la grille
                  </button>
                </div>
              </div>

              {/* Mock Pins */}
              <div className="absolute top-1/4 left-1/3 p-2 bg-primary rounded-full shadow-lg border-2 border-white animate-bounce">
                <div className="bg-black/50 text-[10px] font-bold px-2 py-1 rounded-md absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-white">
                  25 000 F
                </div>
              </div>
              <div
                className="absolute bottom-1/3 right-1/4 p-2 bg-primary rounded-full shadow-lg border-2 border-white animate-bounce"
                style={{ animationDelay: "200ms" }}
              >
                <div className="bg-black/50 text-[10px] font-bold px-2 py-1 rounded-md absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-white">
                  40 000 F
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
      <ReservationModal
        isOpen={isReservationOpen}
        onClose={() => setIsReservationOpen(false)}
        stadium={selectedStadium}
      />
    </div>
  );
};

export default SearchPage;
