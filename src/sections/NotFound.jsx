import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Home, Search } from "lucide-react";
import yellowCard from "../assets/yellowCard.png";
import mainLogo from "../assets/img/mainLogo.png";
import { useAuth } from "../context/AuthContext";

const NotFound = () => {
  const [mouse, setMouse] = useState({ x: 50, y: 50 });
  const { user, profile } = useAuth();

  // 🎯 Mouse tracking pour glow dynamique
  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      setMouse({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen flex flex-col text-white font-display relative overflow-hidden bg-[#0f0a06]">
      {/* 🎨 BACKGROUND */}
      <div className="absolute inset-0 z-0">
        {/* Dégradé principal */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a120b] via-[#0f0a06] to-black"></div>

        {/* Glow dynamique souris */}
        <div
          className="absolute w-[600px] h-[600px] rounded-full pointer-events-none blur-[140px]"
          style={{
            left: `${mouse.x}%`,
            top: `${mouse.y}%`,
            transform: "translate(-50%, -50%)",
            background: "rgba(249,115,22,0.15)",
          }}
        ></div>

        {/* Halo central animé */}
        <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] -translate-x-1/2 -translate-y-1/2 bg-primary/10 rounded-full blur-[120px] animate-pulse"></div>

        {/* Terrain ovale */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-[95%] md:w-[85%] h-[75%] rounded-[50%] border border-white/5"></div>
        </div>
      </div>

      {/* ✅ HEADER MINIMAL */}
      <header className="relative z-10 w-full flex items-center justify-between px-6 md:px-12 py-4 border-b border-white/10">
        <Link to="/">
          <img src={mainLogo} alt="Footbooking" className="h-15 md:h-16" />
        </Link>

        <Link
          to={profile?.role === "owner" ? "/dashboard" : "/"}
          className="flex items-center gap-2 px-4 py-2 bg-[#2c241b] border border-[#493622] rounded-lg hover:bg-[#342a20] transition"
        >
          {profile?.role === "owner" ? (
            <ArrowLeft size={16} />
          ) : (
            <Home size={16} />
          )}
          {profile?.role === "owner" ? "Retour en arrière" : "Accueil"}
        </Link>
      </header>

      {/* ✅ MAIN */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-6 md:px-12 py-16">
        <div className="text-center w-full max-w-2xl relative">
          {/* IMAGE + ANIMATION */}
          <div className="relative mb-10 flex justify-center">
            {/* Carton animé */}
            <div className="group w-32 h-32 md:w-44 md:h-44 rounded-full border-4 border-primary overflow-hidden shadow-xl transform transition duration-500 hover:scale-110 hover:rotate-3">
              <img
                src={yellowCard}
                alt="Arbitre carton"
                className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
              />
            </div>

            {/* Badge VAR animé */}
            <div className="absolute -top-4 bg-primary text-white text-xs font-bold px-3 py-1 rounded-md rotate-[-10deg] shadow-lg animate-bounce">
              VAR REVIEW
            </div>
          </div>

          {/* 404 background */}
          <h1 className="absolute inset-0 flex items-center justify-center text-[120px] md:text-[220px] font-black text-white/5 select-none">
            404
          </h1>

          {/* Titre */}
          <h2 className="text-4xl md:text-6xl font-black italic mb-4">
            HORS-<span className="text-primary">JEU !</span>
          </h2>

          {/* Texte */}
          <p className="text-[#cbad90] text-lg mb-10 max-w-md mx-auto">
            L’arbitre a sifflé. Tu es hors-jeu ou cette page n’existe plus.
          </p>

          {/* ✅ Boutons d'action centraux */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-20">
            <Link
              to={profile?.role === "owner" ? "/dashboard" : "/"}
              className="flex items-center justify-center gap-2 px-8 py-4 bg-primary text-[#231a10] font-bold rounded-xl hover:scale-105 transition shadow-lg"
            >
              {profile?.role === "owner" ? (
                <ArrowLeft size={18} />
              ) : (
                <Home size={18} />
              )}
              {profile?.role === "owner" ? "Retour en arrière" : "Accueil"}
            </Link>

            {(!user || profile?.role !== "owner") && (
              <Link
                to="/search"
                className="flex items-center justify-center gap-2 px-8 py-4 bg-[#2c241b] border border-[#493622] text-white font-bold rounded-xl hover:bg-[#342a20] transition"
              >
                <Search size={18} />
                Trouver un terrain
              </Link>
            )}
          </div>

          {/* Code erreur */}
          <p className="mt-12 text-xs text-gray-500 tracking-widest">
            404_OFFSIDE
          </p>
        </div>
      </main>

      {/* FOOTER MINIMAL */}
      <footer className="relative z-10 text-center text-xs text-gray-600 py-4 border-t border-white/10">
        © 2026 Footbooking
      </footer>
    </div>
  );
};

export default NotFound;
