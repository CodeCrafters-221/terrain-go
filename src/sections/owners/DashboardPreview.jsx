export default function DashboardPreview() {
  return (
    <div className="relative">
      <div className="absolute-inset-4 bg-primary/20 rounded-3xl blur-2xl"></div>

      <div className="relative bg-[#231a10] border border-white/10 rounded-2xl shadow-2xl p-6 transform rotate-1 hover:rotate-0 transition-all duration-500">
        {/* Fake Header */}
        <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>

          <div className="text-xs text-gray-500 font-mono">
            Dashboard Propriétaire
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1 bg-[#2e2318] p-4 rounded-xl border border-white/5">
              <p className="text-gray-400 text-xs">Revenus (Semaine)</p>

              <p className="text-2xl font-bold text-white mt-1">250.000 F</p>
            </div>

            <div className="flex-1 bg-[#2e2318] p-4 rounded-xl border border-white/5">
              <p className="text-gray-400 text-xs">Réservations</p>

              <p className="text-2xl font-bold text-primary mt-1">12</p>
            </div>
          </div>

          <div className="bg-[#2e2318] p-4 rounded-xl border border-white/5">
            <div className="flex justify-between items-center mb-3">
              <span className="font-bold text-sm">Dernières demandes</span>

              <span className="text-xs text-primary cursor-pointer">
                Voir tout
              </span>
            </div>

            {[1, 2, 3].map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-between py-2 border-b border-white/5 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/10"></div>

                  <div>
                    <p className="text-sm font-bold">Moussa Diop</p>

                    <p className="text-xs text-gray-500">Aujourd'hui, 18h</p>
                  </div>
                </div>

                <span className="px-2 py-1 bg-green-500/10 text-green-500 text-xs rounded">
                  Payé
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
