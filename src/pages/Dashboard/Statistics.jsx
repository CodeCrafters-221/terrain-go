import React from 'react';

const Statistics = () => {
    return (
        <div className="flex flex-col gap-8">
            <h2 className="text-white text-3xl font-bold">Statistiques Détaillées</h2>

            {/* Top Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[#2c241b] p-6 rounded-2xl border border-[#493622]">
                    <p className="text-[#cbad90] text-sm">Revenu Mensuel</p>
                    <h3 className="text-3xl font-bold text-white mt-2">4.2M CFA</h3>
                    <p className="text-green-500 text-sm mt-1">+12% vs. mois dernier</p>
                </div>
                <div className="bg-[#2c241b] p-6 rounded-2xl border border-[#493622]">
                    <p className="text-[#cbad90] text-sm">Heures Réservées</p>
                    <h3 className="text-3xl font-bold text-white mt-2">342 h</h3>
                    <p className="text-green-500 text-sm mt-1">+5% vs. mois dernier</p>
                </div>
                <div className="bg-[#2c241b] p-6 rounded-2xl border border-[#493622]">
                    <p className="text-[#cbad90] text-sm">Nouveaux Clients</p>
                    <h3 className="text-3xl font-bold text-white mt-2">45</h3>
                    <p className="text-yellow-500 text-sm mt-1">Stable</p>
                </div>
            </div>

            {/* Detailed Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-[#2c241b] rounded-2xl border border-[#493622] p-6 h-[400px]">
                    <h3 className="text-white text-lg font-bold mb-6">Répartition par Terrain</h3>
                    <div className="flex items-center justify-center h-[300px] text-[#cbad90]">
                        Placeholder pour Pie Chart
                        {/* You would use Recharts PieChart here */}
                    </div>
                </div>
                <div className="bg-[#2c241b] rounded-2xl border border-[#493622] p-6 h-[400px]">
                    <h3 className="text-white text-lg font-bold mb-6">Affluence par Heure</h3>
                    <div className="flex items-center justify-center h-[300px] text-[#cbad90]">
                        Placeholder pour Heatmap/Bar Chart
                        {/* You would use Recharts BarChart here */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Statistics;
