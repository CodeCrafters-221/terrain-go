export default function FeatureCard({ icon: Icon, title, desc }) {
  return (
    <div className="bg-[#2e2318] p-8 rounded-2xl border border-white/5 hover:border-primary/30 transition-all hover:-translate-y-2 flex flex-col items-center">
      <div className="w-14 h-14 bg-background-dark rounded-xl flex items-center justify-center mb-6">
        <Icon className="w-8 h-8 text-primary" />
      </div>

      <h3 className="text-xl font-bold mb-3">{title}</h3>

      <p className="text-gray-400 text-sm text-center">{desc}</p>
    </div>
  );
}
