import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Hero() {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const stats = [
    { icon: "stadium", value: "50+", label: "Terrains" },
    { icon: "groups", value: "2000+", label: "Joueurs" },
    { icon: "event_available", value: "500+", label: "Réservations" },
  ];

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
