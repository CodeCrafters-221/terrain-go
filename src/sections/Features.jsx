import React, { useState } from "react";
import StadiumCard from "../components/StadiumCard";
import ReservationModal from "../components/ReservationModal";
import Cta2 from "../components/Cta2";
import firstStadiumCard from "../assets/features3.png";
import secondStadiumCard from "../assets/features4.png";
import thirdStadiumCard from "../assets/features5.png";

export default function Features() {
  const [favorites, setFavorites] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStadium, setSelectedStadium] = useState(null);

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

  const handleReserve = (stadiumId) => {
    const stadium = stadiums.find((s) => s.id === stadiumId);
    setSelectedStadium(stadium);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedStadium(null);
  };

  const handleFavorite = (stadiumId) => {
    setFavorites((prevFavorites) => {
      if (prevFavorites.includes(stadiumId)) {
        return prevFavorites.filter((id) => id !== stadiumId);
      } else {
        return [...prevFavorites, stadiumId];
      }
    });
  };

  return (
    <div className="featuresSection">
      {/* Votre code existant... */}

      <div className="flex justify-center items-center gap-4 py-8">
        {stadiums.map((stadium) => (
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
        ))}
      </div>

      <div>
        <Cta2 />
      </div>

      {/* Modal de réservation */}
      <ReservationModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        stadium={selectedStadium}
      />
    </div>
  );
}
