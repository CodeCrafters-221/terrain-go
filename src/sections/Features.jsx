import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import StadiumCard from "../components/StadiumCard";
import ReservationModal from "../components/ReservationModal";
import Cta2 from "../components/Cta2";

// Import images
import firstStadiumCard from "../assets/features3.png";
import secondStadiumCard from "../assets/features4.png";
import thirdStadiumCard from "../assets/features5.png";

export default function Features() {
  const [searchParams] = useSearchParams();
  const [favorites, setFavorites] = useState([]);
  const [filteredStadiums, setFilteredStadiums] = useState([]);

  // États Modales
  const [isReservationOpen, setIsReservationOpen] = useState(false);
  const [selectedStadium, setSelectedStadium] = useState(null);

  // États d'authentification (Connectés à Supabase)

  const stadiums = [
    {
      id: 1,
      city: "Dakar Sacré-Cœur",
      price: 25000,
      location: "Sacré-Cœur 3, Dakar",
      totalPlayers: "5 vs 5",
      fieldStadium: "Synthétique",
      notes: "4.8",
      image: firstStadiumCard,
    },
    {
      id: 2,
      city: "Temple Du Foot",
      price: 30000,
      location: "Point E, Dakar",
      totalPlayers: "7 vs 7",
      fieldStadium: "Gazon",
      notes: "4.9",
      image: secondStadiumCard,
    },
    {
      id: 3,
      city: "Terrain Jaraf",
      price: 35000,
      location: "Medina, Dakar",
      totalPlayers: "8 vs 8",
      fieldStadium: "Synthétique",
      notes: "4.8",
      image: thirdStadiumCard,
    },
  ];

  // --- LOGIQUE DE FILTRAGE ---
  useEffect(() => {
    const query = searchParams.get("q")?.toLowerCase() || "";
    const city = searchParams.get("city") || "";

    const results = stadiums.filter((stadium) => {
      const matchText =
        stadium.city.toLowerCase().includes(query) ||
        stadium.location.toLowerCase().includes(query);
      const matchCity = city ? stadium.location.includes(city) : true;
      return matchText && matchCity;
    });

    setFilteredStadiums(results);
  }, [searchParams]);

  // --- HANDLERS ---
  const handleReserve = (stadiumId) => {
    const stadium = stadiums.find((s) => s.id === stadiumId);
    setSelectedStadium(stadium);
    setIsReservationOpen(true);
  };

  const handleCloseReservation = () => {
    setIsReservationOpen(false);
    setTimeout(() => setSelectedStadium(null), 300);
  };

  const handleFavorite = (stadiumId) => {
    setFavorites((prev) =>
      prev.includes(stadiumId)
        ? prev.filter((id) => id !== stadiumId)
        : [...prev, stadiumId],
    );
  };

  return (
    <>
      <div
        id="stadiums-list"
        className="featuresSection container mx-auto px-4 py-8 scroll-mt-24"
      >
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4 px-2">
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-white leading-tight">
              {searchParams.get("q") || searchParams.get("city")
                ? `Résultats de recherche (${filteredStadiums.length})`
                : "Terrains à la une"}
            </h2>
            <p className="text-gray-400 mt-2">
              {searchParams.get("q") || searchParams.get("city")
                ? "Voici les terrains correspondant à vos critères"
                : "Les terrains les plus populaires de la semaine"}
            </p>
          </div>

          {(searchParams.get("q") || searchParams.get("city")) && (
            <Link
              to="/"
              className="text-primary hover:underline text-sm font-semibold"
            >
              Tout afficher
            </Link>
          )}
        </div>

        {/* LISTE FILTRÉE */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStadiums.length > 0 ? (
            filteredStadiums.map((stadium) => (
              <StadiumCard
                key={stadium.id}
                id={stadium.id}
                city={stadium.city}
                price={stadium.price}
                location={stadium.location}
                totalPlayers={stadium.totalPlayers}
                fieldStadium={stadium.fieldStadium}
                notes={stadium.notes}
                image={stadium.image}
                onReserve={handleReserve}
                onFavorite={handleFavorite}
                isFavorite={favorites.includes(stadium.id)}
              />
            ))
          ) : (
            <div className="w-full text-center py-12 bg-[#2e2318] rounded-2xl border border-[#493622] col-span-full">
              <span className="material-symbols-outlined text-4xl text-gray-500 mb-2">
                sentiment_dissatisfied
              </span>
              <p className="text-white text-lg">
                Aucun terrain ne correspond à votre recherche.
              </p>
              <Link
                to="/"
                className="text-primary hover:underline mt-2 inline-block"
              >
                Voir tous les terrains
              </Link>
            </div>
          )}
        </div>

        <div className="mt-16">
          <Cta2 />
        </div>

        {/* --- MODAL DE RÉSERVATION --- */}
        {/* Plus besoin de passer onLogin ou onRegister car le modal utilise navigate() maintenant */}
      </div>
      <ReservationModal
        isOpen={isReservationOpen}
        onClose={handleCloseReservation}
        stadium={selectedStadium}
      />
    </>
  );
}
