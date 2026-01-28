import React from "react";
import TabNavigation from "../sections/TabNavigation";
import { MapPin, Pencil } from "lucide-react";

export default function AboutUser() {
  return (
    <div>
      <div className="bg-[#2e2216] rounded-2xl  flex justify-between items-center p-8 w-full  mt-20">
        <div>
          <div className="flex gap-4">
            <div className="userBgImg rounded-full bg-amber-950 h-30 w-30 border-amber-950 flex justify-center items-center"></div>
            <div className="flex flex-col justify-center gap-1">
              <h1 className="text-white text-2xl md:text-[32px] font-bold leading-tight tracking-[-0.015em]">
                User Name
              </h1>
              <div className="flex items-center gap-2 text-orange-300">
                <MapPin className="w-[18px] h-[18px]" />
                <p className="text-base font-normal">Dakar, Sénégal</p>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary ring-1 ring-inset ring-primary/20">
                  Joueur Régulier
                </span>
                <span className="inline-flex items-center rounded-md bg-surface-highlight px-2 py-1 text-xs font-medium text-orange-300 ring-1 ring-inset ring-white/10">
                  15 Matchs joués
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="">
          <button className="flex items-center justify-center gap-2 rounded-full h-10 px-6 bg-[#4a3723] hover:bg-[#5a432b] text-white text-sm font-bold transition-all w-full md:w-auto cursor-pointer">
            <Pencil className="w-[18px] h-[18px]" />
            Modifier le profil
          </button>
        </div>
      </div>
      <div>
        <TabNavigation />
      </div>
    </div>
  );
}
