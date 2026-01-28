import { useState, useEffect } from "react";
import Cta from "../components/Cta";
import {
  LandPlot,
  Users,
  CalendarCheck,
  PartyPopper,
  MapPin,
  Search,
} from "lucide-react";

export default function Hero() {
  const [isVisible, setIsVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  // Animation au chargement
  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Villes disponibles
  const cities = [
    "Dakar",
    "Pikine",
    "Guédiawaye",
    "Rufisque",
    "Thiès",
    "Mbour",
  ];

  // Statistiques en temps réel
  const stats = [
    {
      icon: <LandPlot className="w-8 h-8 text-primary" />,
      value: "50+",
      label: "Terrains disponibles",
    },
    {
      icon: <Users className="w-8 h-8 text-primary" />,
      value: "2000+",
      label: "Joueurs actifs",
    },
    {
      icon: <CalendarCheck className="w-8 h-8 text-primary" />,
      value: "500+",
      label: "Réservations/mois",
    },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Recherche:", { searchQuery, selectedCity });
    // Rediriger vers la page de résultats ou filtrer les terrains
    // navigate(`/terrains?city=${selectedCity}&search=${searchQuery}`);
  };

  return (
    <div className="heroSection relative overflow-hidden">
      {/* Effet de fond animé */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />

      <div
        className={`relative flex flex-col items-center justify-center min-h-150 lg:min-h-175 w-full px-5 py-10 lg:px-40 mt-10 transition-all duration-1000 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        {/* Badge "Nouveau" */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6 animate-pulse">
          <PartyPopper className="text-primary w-4 h-4" />
          <span className="text-primary text-sm font-semibold">
            Nouveau à Dakar - Réservez maintenant !
          </span>
        </div>

        {/* Titre principal avec animation */}
        <h1
          className={`text-white text-4xl text-center font-black leading-tight tracking-[-0.033em] md:text-5xl lg:text-6xl max-w-3xl mx-auto p-4 transition-all duration-700 delay-200 ${
            isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
          }`}
        >
          Le Meilleur Terrain.
          <br />
          <span className="text-primary relative">
            Votre Meilleur Match.
            {/* Soulignement animé */}
            <span className="absolute bottom-0 left-0 w-full h-1 bg-primary/30 blur-sm" />
          </span>
        </h1>

        {/* Sous-titre */}
        <h2
          className={`text-gray-200 text-center tracking-tight text-base font-lexend leading-normal md:text-xl max-w-2xl mx-auto transition-all duration-700 delay-300 ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          La première plateforme de réservation de terrains de football à Dakar.
          Réservez votre créneau en quelques secondes.
        </h2>

        {/* Barre de recherche améliorée */}
        <form
          onSubmit={handleSearch}
          className={`w-full max-w-3xl mt-8 transition-all duration-700 delay-400 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          }`}
        >
          <div className="flex flex-col md:flex-row gap-3 bg-[#2e2318] p-3 rounded-2xl border border-[#493622] shadow-2xl">
            {/* Sélection de ville */}
            <div className="flex items-center gap-3 flex-1 px-4 py-3 bg-[#342618] rounded-xl">
              <MapPin className="text-primary w-5 h-5" />
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="flex-1 bg-transparent text-white outline-none cursor-pointer"
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

            {/* Barre de recherche */}
            <div className="flex items-center gap-3 flex-1 px-4 py-3 bg-[#342618] rounded-xl">
              <Search className="text-primary w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Nom du terrain, quartier..."
                className="flex-1 bg-transparent text-white outline-none cursor-pointer"
              />
            </div>
          </div>
        </form>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-[#342618] rounded-2xl p-4 flex flex-col items-center justify-center"
            >
              {stat.icon}
              <p className="text-white text-lg font-semibold mt-2">
                {stat.value}
              </p>
              <p className="text-gray-400 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        {/* <Cta /> */}
      </div>
    </div>
  );
}
