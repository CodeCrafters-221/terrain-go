import React from "react";
import Cta from "../components/Cta";
import Features from "./Features";

export default function Hero() {
  return (
    <div className="heroSection">
      <div className="relative flex flex-col items-center justify-center min-h-150 lg:min-h-175 w-full px-5 py-10 lg:px-40 mt-10">
        <h1 className="text-white text-4xl text-center font-black leading-tight tracking-[-0.033em] md:text-5xl lg:text-6xl max-w-3xl mx-auto p-4">
          Le Meilleur Terrain.
          <br />
          <span className="text-primary">Votre Meilleur Match.</span>
        </h1>
        <h2 className="text-gray-200 text-center tracking-tight text-base font-lexend leading-normal md:text-xl max-w-2xl mx-auto ">
          La première plateforme de réservation de terrains de football à Dakar.
          Réservez votre créneau en quelques secondes.
        </h2>

        <div className="w-200">
          {/* Composant Cta */}
          <Cta />
          <div className=" top-10 flex flex-row justify-center items-center gap-2">
            <span class="material-symbols-outlined text-primary ">
              check_circle
            </span>
            <h2 className="text-sm text-orange-100 mr-4">
              Réservation instantanée
            </h2>
            <span class="material-symbols-outlined text-primary ">
              check_circle
            </span>
            <h2 className="text-orange-100 text-sm">Paiement sécurisé</h2>
          </div>
        </div>
      </div>
    </div>
  );
}
