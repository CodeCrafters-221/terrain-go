import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom"; // Import useSearchParams
import StadiumCard from "../components/StadiumCard";
import ReservationModal from "../components/ReservationModal";
import LoginModal from "../pages/Auth/Login";
import SignupModal from "../pages/Auth/Register";
import Cta2 from "../components/Cta2";

// Import images
import firstStadiumCard from "../assets/features3.png";
import secondStadiumCard from "../assets/features4.png";
import thirdStadiumCard from "../assets/features5.png";

export default function Features() {
  const [searchParams] = useSearchParams(); // Hook pour lire l'URL
  const [favorites, setFavorites] = useState([]);
  const [filteredStadiums, setFilteredStadiums] = useState([]); // État pour les terrains filtrés

  // États Modales
  const [isReservationOpen, setIsReservationOpen] = useState(false);
  const [selectedStadium, setSelectedStadium] = useState(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

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
      // Recherche textuelle sur le nom de la ville ou la localisation
      const matchText =
        stadium.city.toLowerCase().includes(query) ||
        stadium.location.toLowerCase().includes(query);

      // Recherche exacte sur la ville sélectionnée (si une ville est choisie)
      const matchCity = city ? stadium.location.includes(city) : true;

      return matchText && matchCity;
    });

    setFilteredStadiums(results);
  }, [searchParams]); // Se relance à chaque changement d'URL

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

  const handleLoginSuccess = () => {
    setIsLoginOpen(false);
    setIsLoggedIn(true);
    setCurrentUser({
      firstName: "Moussa",
      lastName: "Diop",
      email: "moussa@test.com",
      phone: "770000000",
    });
    if (selectedStadium) setIsReservationOpen(true);
  };

  return (
    // AJOUT DE L'ID POUR LE SCROLL
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

        {/* Bouton pour réinitialiser la recherche si active */}
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
      <div className="flex  justify-center md:justify-start items-center gap-6 min-h-[300px]">
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
          <div className="w-full text-center py-12 bg-[#2e2318] rounded-2xl border border-[#493622]">
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

      {/* --- MODALES (Inchangées) --- */}
      <ReservationModal
        isOpen={isReservationOpen}
        onClose={handleCloseReservation}
        stadium={selectedStadium}
        isLoggedIn={isLoggedIn}
        currentUser={currentUser}
        onLoginClick={() => {
          setIsReservationOpen(false);
          setIsLoginOpen(true);
        }}
        onSignupClick={() => {
          setIsReservationOpen(false);
          setIsSignupOpen(true);
        }}
      />

      {/* <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onSuccess={handleLoginSuccess}
        onSwitchToSignup={() => {
          setIsLoginOpen(false);
          setIsSignupOpen(true);
        }}
      /> */}

      {/* <SignupModal
        isOpen={isSignupOpen}
        onClose={() => setIsSignupOpen(false)}
        onSuccess={() => {
          setIsSignupOpen(false);
          setIsLoggedIn(true);
          if (selectedStadium) setIsReservationOpen(true);
        }}
      /> */}
    </div>
  );
}
