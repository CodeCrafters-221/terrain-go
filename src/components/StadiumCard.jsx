import React, { useState } from "react";
import { Heart, MapPin, Star } from "lucide-react";
// import PropTypes from "prop-types";

export default function StadiumCard({
  id,
  city,
  location,
  price,
  totalPlayers,
  notes,
  fieldStadium,
  image,
  onReserve,
  onFavorite,
  isFavorite = false,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleReserve = async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (onReserve) {
        await onReserve(id);
      }
    } catch (err) {
      setError("Erreur lors de la réservation");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFavorite = () => {
    if (onFavorite) {
      onFavorite(id);
    }
  };

  return (
    <div className="w-76">
      {/* Image avec bouton favori */}
      <figure className="relative">
        <img
          src={image}
          alt={`Terrain ${city}`}
          className="object-cover h-60 w-full rounded-2xl"
          onError={(e) => {
            e.target.src = "/placeholder-stadium.jpg";
          }}
        />
        <button
          onClick={handleFavorite}
          className="absolute top-3 right-3 p-2 bg-black/50 rounded-full hover:bg-primary transition-colors group"
          aria-label="Ajouter aux favoris"
        >
          <Heart
            className={`w-5 h-5 transition-colors ${
              isFavorite ? "fill-white text-white" : "text-white"
            }`}
          />
        </button>
      </figure>

      <div className="flex flex-col gap-4 p-2">
        {/* Titre et prix */}
        <div className="flex justify-between items-center gap-2">
          <h3 className="text-white text-lg font-bold hover:text-primary transition-colors">
            {city}
          </h3>
          <span className="text-primary font-bold">
            {price} FCFA <span className="text-white font-normal">/h</span>
          </span>
        </div>

        {/* Localisation */}
        <div className="flex items-start">
          <MapPin className="text-[#cbad90] w-5 h-5 mr-3" />
          <p className="text-[#cbad90]">{location}</p>
        </div>

        {/* Détails */}
        <div className="card-details flex justify-between gap-4 items-center">
          <Badge label={totalPlayers} />
          <Badge label={fieldStadium} />
          <RatingBadge rating={notes} />
        </div>

        {/* Erreur */}
        {error && <p className="text-red-500 text-sm">{error}</p>}

        {/* Bouton réservation */}
        <button
          onClick={handleReserve}
          disabled={isLoading}
          className="w-full bg-primary text-black font-bold py-2 rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-all"
        >
          {isLoading ? "Chargement..." : "Réserver"}
        </button>
      </div>
    </div>
  );
}

// Composant Badge réutilisable
function Badge({ label }) {
  return (
    <div className="text-[10px] uppercase font-bold tracking-wider px-2 py-1 bg-[#342618] text-[#cbad90] rounded-2xl">
      {label}
    </div>
  );
}

// Composant Rating réutilisable
function RatingBadge({ rating }) {
  return (
    <div className="bg-black/40 backdrop-blur-md px-2 py-1 rounded-4xl tracking-wider text-white text-[10px] font-bold flex items-center">
      <Star className="text-primary w-3.5 h-3.5 mr-1 fill-current" />
      {rating}
    </div>
  );
}
