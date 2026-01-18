import React from "react";

export default function Header() {
  return (
    <div className="header">
      <div className="flex items-center gap-2">
        <span class="material-symbols-outlined !text-3xl text-primary">
          sports_soccer
        </span>
        <h2 className="text-3xl  text-white font-lexend  tracking-wider font-bold">
          Footbooking
        </h2>
      </div>
      <div className=" navigation  md:flex">
        <a
          className="text-white hover:text-primary transition-colors text-lg font-Archivo black font-medium leading-normal"
          href="#"
        >
          Accueil
        </a>
        <a
          className="text-white hover:text-primary transition-colors text-lg font-Archivo black font-medium leading-normal"
          href="#"
        >
          Trouver un terrain
        </a>
        <a
          className="text-white hover:text-primary transition-colors text-lg font-Archivo black font-medium leading-normal"
          href="#"
        >
          Pour les propriétaires
        </a>

        <button className="bg-primary rounded-full font-montserrat font-semibold text-text text-lg px-4 py-2 cursor-pointer">
          Se connecter
        </button>
      </div>
    </div>
  );
}
