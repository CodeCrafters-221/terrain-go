import StatCard from "./StatCard";

const STATS = [
  { label: "Joueurs actifs", value: "2,000+" },
  { label: "Réservations/mois", value: "500+" },
  { label: "Terrains partenaires", value: "15+" },
  { label: "Augmentation revenus", value: "30%" },
];

export default function OwnersStats() {
  return (
    <section className="border-y border-white/5 bg-[#2a2016]/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {STATS.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </div>
      </div>
    </section>
  );
}
