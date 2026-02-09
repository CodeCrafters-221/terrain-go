import React from "react";
import { Trophy, Star, Settings } from "lucide-react";

export default function TabNavigation() {
  return (
    <div>
      <div className="sticky top-18.25 z-40 bg-background-dark/95 backdrop-blur-sm pt-2 pb-4 mb-6 border-b border-surface-highlight w-full">
        <div className="flex gap-8 overflow-x-auto hide-scrollbar">
          <a
            className="flex flex-col items-center justify-center border-b-[3px] border-primary text-white pb-3 px-2 min-w-fit cursor-pointer group"
            href="#reservations"
          >
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 group-hover:text-primary transition-colors" />
              <p className="text-sm font-bold leading-normal tracking-[0.015em]">
                Mes Réservations
              </p>
            </div>
          </a>
          <a
            className="flex flex-col items-center justify-center border-b-[3px] border-transparent hover:border-surface-highlight text-text-secondary hover:text-white pb-3 px-2 min-w-fit cursor-pointer transition-all"
            href="#avis"
          >
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5" />
              <p className="text-sm font-bold leading-normal tracking-[0.015em]">
                Mes Avis
              </p>
            </div>
          </a>
          <a
            className="flex flex-col items-center justify-center border-b-[3px] border-transparent hover:border-surface-highlight text-text-secondary hover:text-white pb-3 px-2 min-w-fit cursor-pointer transition-all"
            href="#parametres"
          >
            <div className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              <p className="text-sm font-bold leading-normal tracking-[0.015em]">
                Paramètres
              </p>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}
