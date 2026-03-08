import { Link } from "react-router-dom";
import { CheckCircle2, ArrowRight } from "lucide-react";
import DashboardPreview from "./DashboardPreview";

const PREVIEW_ITEMS = [
  "Ajoutez et modifiez vos terrains en quelques clics",
  "Validez ou refusez les réservations instantanément",
  "Consultez l'historique complet de vos transactions",
  "Support technique dédié disponible 7j/7",
];

export default function OwnersPreview() {
  return (
    <section className="py-24 bg-[#2e2318] border-y border-white/5 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
          {/* LEFT CONTENT */}
          <div className="mb-12 lg:mb-0">
            <h3 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
              Gérez votre business <br />
              <span className="text-primary">en toute simplicité</span>
            </h3>

            <ul className="space-y-6">
              {PREVIEW_ITEMS.map((item) => (
                <li key={item} className="flex items-start gap-4 group">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary transition-colors">
                    <CheckCircle2 className="w-5 h-5 text-primary group-hover:text-black transition-colors" />
                  </div>

                  <span className="text-lg text-gray-300 pt-0.5">{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-10">
              <Link
                to="/register"
                className="inline-flex items-center font-bold text-primary hover:text-white transition-colors border-b-2 border-primary hover:border-white pb-1"
              >
                Créer mon compte propriétaire
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* RIGHT DASHBOARD MOCK */}
          <DashboardPreview />
        </div>
      </div>
    </section>
  );
}
