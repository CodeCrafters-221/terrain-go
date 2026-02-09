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
    /* CHANGEMENTS ICI : 
       1. w-full : Prend toute la largeur de la colonne parente
       2. max-w-... : Empêche la carte d'être trop large sur mobile
       3. suppression de 'grid' : On utilise flex-col pour une carte verticale standard
       4. bg-[#2e2318] : Ajouté ici pour que toute la carte ait le fond, pas juste le texte
       5. rounded-2xl et overflow-hidden : Appliqués au conteneur principal
    */
    <div className="w-full max-w-[350px] md:max-w-none mx-auto flex flex-col bg-[#2e2318] rounded-2xl overflow-hidden shadow-lg border border-[#493622] hover:border-primary/50 transition-all duration-300">
      {/* Image : Hauteur adaptative (h-48 sur mobile, h-60 sur desktop) */}
      <figure className="relative h-48 sm:h-56 md:h-60 flex-shrink-0">
        <img
          src={image}
          alt={`Terrain ${city}`}
          className="object-cover w-full h-full transition-transform duration-500 hover:scale-105"
          onError={(e) => {
            e.target.src = "/placeholder-stadium.jpg";
          }}
        />
        <button
          onClick={handleFavorite}
          className="absolute top-3 right-3 p-2 bg-black/50 rounded-full hover:bg-primary transition-colors group z-10"
          aria-label="Ajouter aux favoris"
        >
          <Heart
            className={`w-5 h-5 transition-colors ${
              isFavorite ? "fill-white text-white" : "text-white"
            }`}
          />
        </button>
      </figure>

      <div className="flex flex-col gap-3 p-4 flex-grow">
        {/* Titre et prix */}
        <div className="flex justify-between items-start gap-2">
          <h3 className="text-white text-lg font-bold hover:text-primary transition-colors leading-tight">
            {city}
          </h3>
          <div className="text-right shrink-0">
            <span className="text-primary font-bold ">{price} CFA</span>
            <span className="text-white text-xs font-normal">/h</span>
          </div>
        </div>

        {/* Localisation */}
        <div className="flex items-center">
          <MapPin className="text-[#cbad90] w-4 h-4 mr-2 flex-shrink-0" />
          <p className="text-[#cbad90] text-sm truncate">{location}</p>
        </div>

        {/* Détails : Flex wrap pour que les badges ne débordent pas sur petit écran */}
        <div className="card-details flex flex-wrap gap-2 items-center justify-between mt-auto pt-2">
          <div className="flex gap-2">
            <Badge label={totalPlayers} />
            <Badge label={fieldStadium} />
          </div>
          <RatingBadge rating={notes} />
        </div>

        {/* Erreur */}
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        {/* Bouton réservation */}
        <button
          onClick={handleReserve}
          disabled={isLoading}
          className="w-full mt-2 bg-primary text-black font-bold py-3 rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-all active:scale-[0.98]"
        >
          {isLoading ? "Chargement..." : "Réserver"}
        </button>
      </div>
    </div>
  );
}

// Composant Badge réutilisable (inchangé)
function Badge({ label }) {
  return (
    <div className="text-[10px] uppercase font-bold tracking-wider px-2 py-1 bg-[#342618] text-[#cbad90] rounded-2xl border border-[#493622]">
      {label}
    </div>
  );
}

// Composant Rating réutilisable (inchangé)
function RatingBadge({ rating }) {
  return (
    <div className="bg-black/40 backdrop-blur-md px-2 py-1 rounded-4xl tracking-wider text-white text-[10px] font-bold flex items-center">
      <Star className="text-primary w-3.5 h-3.5 mr-1 fill-current" />
      {rating}
    </div>
  );
}
