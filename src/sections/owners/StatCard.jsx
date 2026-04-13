export default function StatCard({ value, label }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-3xl md:text-4xl font-black">{value}</span>

      <span className="text-sm text-gray-400">{label}</span>
    </div>
  );
}
