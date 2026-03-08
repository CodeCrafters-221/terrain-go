import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function OwnersHero() {
  return (
    <section className="pt-32 pb-24 px-4 lg:pt-40 lg:pb-32 sm:px-6 lg:px-8 relative w-full overflow-hidden">
      <div className="absolute -top-16 -left-16 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -right-16 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-7xl mx-auto relative z-10 text-center">
        <div className="inline-flex items-center justify-center gap-3 px-4 py-2 rounded-full bg-white/5 border mb-8">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-sm font-medium text-gray-300">
            La plateforme n°1 pour les gérants à Dakar
          </span>
        </div>

        <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-tight">
          Boostez la rentabilité de <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-400">
            vos terrains de foot
          </span>
        </h1>

        <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
          Fini les appels manqués et les cahiers de réservation. Footbooking
          digitalise votre complexe.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/register"
            className="w-full sm:w-auto bg-primary hover:bg-[#d96f0b] text-background-dark font-bold text-lg px-8 py-4 rounded-full flex items-center justify-center gap-2"
          >
            Devenir Partenaire
            <ArrowRight className="w-5 h-5" />
          </Link>

          <a
            href="#features"
            className="w-full sm:w-auto px-8 py-4 rounded-full border border-white/10 hover:bg-white/5 font-bold text-lg text-center"
          >
            Découvrir les avantages
          </a>
        </div>
      </div>
    </section>
  );
}
