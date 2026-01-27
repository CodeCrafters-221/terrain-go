import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Hero() {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const cities = [
    "Dakar",
    "Pikine",
    "Guédiawaye",
    "Rufisque",
    "Thiès",
    "Mbour",
  ];

  const stats = [
    { icon: "stadium", value: "50+", label: "Terrains" },
    { icon: "groups", value: "2000+", label: "Joueurs" },
    { icon: "event_available", value: "500+", label: "Réservations" },
  ];

  const handleSearch = (e) => {
    e.preventDefault();

    // 1. Construire les paramètres de recherche
    const params = new URLSearchParams();
    if (searchQuery) params.append("q", searchQuery);
    if (selectedCity) params.append("city", selectedCity);

    // 2. Mettre à jour l'URL sans recharger la page
    navigate(`/?${params.toString()}`, { replace: true });

    // 3. Scroller doucement vers la section des résultats
    const featuresSection = document.getElementById("stadiums-list");
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="heroSection relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />

      <div
        className={`relative flex flex-col items-center justify-center min-h-[85vh] w-full px-5 py-10 lg:px-40 mt-10 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
      >
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6 animate-pulse">
          <span className="material-symbols-outlined text-primary text-sm">
            celebration
          </span>
          <span className="text-primary text-sm font-semibold">
            Nouveau à Dakar - Réservez maintenant !
          </span>
        </div>

        {/* Titre */}
        <h1
          className={`text-white text-4xl text-center font-black leading-tight tracking-[-0.033em] md:text-5xl lg:text-6xl max-w-3xl mx-auto p-4 transition-all duration-700 delay-200 ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
        >
          Le Meilleur Terrain.
          <br />
          <span className="text-primary relative">
            Votre Meilleur Match.
            <span className="absolute bottom-0 left-0 w-full h-1 bg-primary/30 blur-sm" />
          </span>
        </h1>

        <h2
          className={`text-gray-200 text-center tracking-tight text-base font-lexend leading-normal md:text-xl max-w-2xl mx-auto transition-all duration-700 delay-300 ${isVisible ? "opacity-100" : "opacity-0"}`}
        >
          La première plateforme de réservation de terrains de football à Dakar.
        </h2>

        {/* Barre de recherche */}
        <form
          onSubmit={handleSearch}
          className={`w-full max-w-3xl mt-8 transition-all duration-700 delay-400 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}
        >
          <div className="flex flex-col md:flex-row gap-3 bg-[#2e2318] p-3 rounded-2xl border border-[#493622] shadow-2xl">
            {/* Ville */}
            <div className="flex items-center gap-3 flex-1 px-4 py-3 bg-[#342618] rounded-xl border border-transparent focus-within:border-primary/50 transition-colors">
              <span className="material-symbols-outlined text-primary">
                location_on
              </span>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="flex-1 bg-transparent text-white outline-none cursor-pointer placeholder-gray-400 w-full"
              >
                <option value="" className="bg-[#342618]">
                  Toutes les villes
                </option>
                {cities.map((city) => (
                  <option key={city} value={city} className="bg-[#342618]">
                    {city}
                  </option>
                ))}
              </select>
            </div>

            {/* Recherche Texte */}
            <div className="flex items-center gap-3 flex-1 px-4 py-3 bg-[#342618] rounded-xl border border-transparent focus-within:border-primary/50 transition-colors">
              <span className="material-symbols-outlined text-primary">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Nom, quartier..."
                className="flex-1 bg-transparent text-white outline-none placeholder-gray-400 w-full"
              />
            </div>

            {/* Bouton */}
            <button
              type="submit"
              className="bg-primary hover:bg-primary/90 text-black font-bold py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
            >
              <span className="hidden md:inline">Rechercher</span>
              <span className="material-symbols-outlined md:hidden">
                search
              </span>
            </button>
          </div>
        </form>
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mt-8 w-full max-w-3xl">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-[#342618]/80 backdrop-blur-sm border border-[#493622] rounded-2xl p-3 md:p-4 flex flex-col items-center justify-center"
            >
              <span className="material-symbols-outlined text-primary text-2xl md:text-3xl mb-1">
                {stat.icon}
              </span>
              <p className="text-white text-base md:text-lg font-bold">
                {stat.value}
              </p>
              <p className="text-gray-400 text-xs md:text-sm text-center">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
