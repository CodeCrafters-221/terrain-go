import React, { useState } from "react";
import StadiumCard from "../components/StadiumCard";
import ReservationModal from "../components/ReservationModal";
import Cta2 from "../components/Cta2";
import firstStadiumCard from "../assets/features3.png";
import secondStadiumCard from "../assets/features4.png";
import thirdStadiumCard from "../assets/features5.png";
<<<<<<< HEAD
import { Link } from "react-router";
=======

>>>>>>> dev
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
<<<<<<< HEAD
      {/* Card part 1 */}
      <div className="font-lexend flex flex-col gap-4">
        <h1 className="text-white text-3xl md:text-4xl font-bold leading-tight tracking-tight">
          Pour les joueurs et les propriétaires
        </h1>
        <p className="text-orange-200 font-semibold text-lg max-w-2xl">
          Que vous cherchiez un match ou que vous gériez un complexe, nous avons
          les outils qu'il vous faut.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 ">
        <div className=" m-w-120   overflow-hidden rounded-3xl bg-[#2e2318] border border-[#493622] hover:border-primary/50 transition-all duration-300">
          <div className="card1"></div>
          <div className="relative z-20 p-8 -mt-20">
            <div className="inline-flex items-center justify-center size-14 rounded-full bg-primary mb-6 shadow-lg shadow-primary/20">
              <span class="material-symbols-outlined text-3xl">
                sports_soccer
              </span>
            </div>
            <h2 className="text-white text-2xl font-bold mb-3">
              Pour les Joueurs
            </h2>
            <p className="text-gray-300 leading-relaxed mb-3">
              Trouvez le terrain parfait près de chez vous. Consultez les
              disponibilités en temps réel, réservez et payez en toute sécurité.
            </p>
            <div className="card-actions justify-start">
              <Link to="/search" className="inline-flex items-center justify-center rounded-full h-12 px-6 bg-white hover:bg-gray-100 text-[#231a10] text-sm font-bold transition-colors">
                Réserver un terrain
              </Link>
            </div>
          </div>
        </div>
        <div className=" m-w-120 overflow-hidden rounded-3xl bg-[#2e2318] border border-[#493622] hover:border-primary/50 transition-all duration-300">
          <div className="card2 "></div>

          <div className="relative z-20 p-8 -mt-20">
            <div className="inline-flex items-center justify-center size-14 rounded-full bg-[#342618] mb-6 shadow-lg shadow-primary/20">
              <span class="material-symbols-outlined text-3xl text-primary">
                storefront
              </span>
            </div>
            <h2 className=" text-white text-2xl font-bold mb-3 ">
              Pour les Propriétaires
            </h2>
            <p className="text-gray-300 leading-relaxed mb-3">
              Maximisez votre taux d'occupation. Un tableau de bord simple pour
              gérer votre planning, vos tarifs et vos clients.
            </p>
            <div className="card-actions justify-start">
              <Link to="/auth/register" className="inline-flex items-center justify-center rounded-full h-12 px-6 border border-white/30 hover:bg-white/10 text-white text-sm font-bold transition-colors backdrop-blur-sm">
                Devenir partenaire
              </Link>
            </div>
          </div>
        </div>
      </div>
      {/* Card part 2 */}
      <div className="flex justify-between mt-20">
        <h1 className="text-white text-2xl md:text-3xl font-lexend font-bold ">
          Terrains en vedette à Dakar
        </h1>
        <Link
          to="/search"
          className="hidden md:flex items-center text-primary font-medium hover:text-orange-400 text-sm"
        >
          Voir tout{" "}
          <span className="material-symbols-outlined ml-1 text-lg">
            arrow_forward
          </span>
        </Link>
      </div>

      <div className="flex justify-center items-center gap-4 py-8">
        {/* stadiums details */}
        <StadiumCard
          city={"Dakar Sacré-Cœur"}
          price={25000}
          location={"Sacré-Cœur 3, Dakar"}
          totalPlayers={"5 vs 5"}
          fieldStadium={"Synthetique"}
          notes={"4.8"}
          image={firstStadiumCard}
        />
        <StadiumCard
          city={"Temple Du Foot"}
          price={30000}
          location={"Point E, Dakar"}
          totalPlayers={"7 vs 7"}
          fieldStadium={"Gazon"}
          notes={"4.9"}
          image={secondStadiumCard}
        />
        <StadiumCard
          city={"Terrain Jaraf"}
          price={35000}
          location={"Medina, Dakar"}
          totalPlayers={"8 vs 8"}
          fieldStadium={"Synthetique"}
          notes={"4.8"}
          image={thirdStadiumCard}
        />
=======
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
>>>>>>> dev
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
