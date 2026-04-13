import {
  TrendingUp,
  CalendarCheck,
  ShieldCheck,
  Users,
  Smartphone,
  BarChart3,
} from "lucide-react";

import FeatureCard from "./FeatureCard";

const FEATURES = [
  {
    icon: CalendarCheck,
    title: "Gestion Automatisée",
    desc: "Dites adieu aux doubles réservations.",
  },
  {
    icon: TrendingUp,
    title: "Visibilité Maximale",
    desc: "Exposez votre terrain à des milliers de joueurs.",
  },
  {
    icon: ShieldCheck,
    title: "Paiements Sécurisés",
    desc: "Recevez vos paiements via Wave ou Orange Money.",
  },
  {
    icon: BarChart3,
    title: "Dashboard Détaillé",
    desc: "Suivez vos revenus et statistiques.",
  },
  {
    icon: Users,
    title: "Fidélisation Client",
    desc: "Créez une communauté autour de votre terrain.",
  },
  {
    icon: Smartphone,
    title: "100% Mobile",
    desc: "Gérez votre complexe depuis votre téléphone.",
  },
];

export default function OwnersFeatures() {
  return (
    <section
      id="features"
      className="py-24 px-8 sm:px-4 lg:px-24 bg-[#1a130c]"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-primary font-bold uppercase text-sm sm:text-2xl mb-3">
            Pourquoi nous rejoindre ?
          </h2>

          <h3 className="text-3xl md:text-4xl sm:text-2xl  font-bold">
            Une suite d'outils conçue pour vous
          </h3>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {FEATURES.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
}
