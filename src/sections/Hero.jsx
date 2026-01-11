import React from "react";
import Cta from "../components/Cta";
export default function Hero() {
  return (
    <div className="heroSection">

      <div className="relative flex flex-col items-center justify-center min-h-150 lg:min-h-175 w-full px-5 py-10 lg:px-40">
     <h1 className="text-white text-4xl text-center font-black leading-tight tracking-[-0.033em] md:text-5xl lg:text-6xl max-w-3xl mx-auto">
        Le Meilleur Terrain.
        <br />
        <span className="text-primary">Votre Meilleur Match.</span>
      </h1>
      <h2 className="text-gray-200 text-center  text-base font-lexend leading-normal md:text-xl max-w-1/2 mx-auto">
        La première plateforme de réservation de terrains de football à Dakar.
        Réservez votre créneau en quelques secondes.
      </h2>
      
     <div>
    <Cta/>
      </div>
      </div>
      </div>
  );
}
