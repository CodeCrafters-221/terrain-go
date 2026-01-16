import React from "react";

export default function Cta2() {
  return (
    <div class="relative rounded-[3rem] overflow-hidden bg-primary/10 border border-primary/20 p-8 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8 mt-15">
      <div class="flex flex-col gap-4 max-w-xl text-center md:text-left z-10">
        <h2 class="text-white text-3xl md:text-4xl font-black leading-tight">
          Prêt pour le coup d'envoi ?
        </h2>
        <p class="text-gray-300 text-lg">
          Rejoignez la plus grande communauté de footballeurs à Dakar. Créez
          votre compte gratuitement.
        </p>
      </div>
      <div class="flex flex-col sm:flex-row gap-4 z-10">
        <button class="flex items-center justify-center rounded-full h-14 px-8 bg-transparent border-2 border-white/20 hover:bg-primary/20 text-white text-base font-bold transition-all cursor-pointer">
          Créer un compte
        </button>
      </div>

      <div class="absolute -top-24 -right-24 w-64 h-64 bg-primary/20 rounded-full blur-3xl pointer-events-none"></div>
      <div class="absolute -bottom-24 -left-24 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
    </div>
  );
}
