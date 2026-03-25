import { Link } from "react-router-dom";

export default function OwnersCTA() {
  return (
    <section className="py-24 px-4 text-center">
      <div className="max-w-3xl mx-auto bg-gradient-to-b from-[#2e2318] to-[#231a10] border border-white/10 rounded-3xl p-10 md:p-16 relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Prêt à remplir votre terrain ?
        </h2>

        <p className="text-gray-400 text-lg mb-10 max-w-xl mx-auto">
          Rejoignez le réseau Footbooking dès aujourd'hui. L'inscription est
          gratuite et ne prend que 2 minutes.
        </p>

        <Link
          to="/register"
          className="inline-block bg-primary hover:bg-[#d96f0b] text-background-dark font-bold text-lg px-10 py-4 rounded-full transition-all shadow-lg shadow-primary/20 transform hover:scale-105"
        >
          Inscrire mon terrain
        </Link>
      </div>
    </section>
  );
}
