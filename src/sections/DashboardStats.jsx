import React from 'react';
import { useDashboard } from '../context/DashboardContext';

const DashboardStats = () => {
    const { stats } = useDashboard();

    return (
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Stat Card 1 */}
            <div className="flex flex-col gap-2 rounded-2xl p-6 bg-[#2c241b] border border-[#493622] hover:border-[#f27f0d]/30 transition-colors">
                <div className="flex items-center justify-between">
                    <p className="text-[#cbad90] text-sm font-medium">Total Terrains</p>
                    <span className="material-symbols-outlined text-[#f27f0d]">stadium</span>
                </div>
                <div className="flex items-end gap-2">
                    <p className="text-white text-3xl font-bold">{stats.totalFields}</p>
                    <p className="text-[#0bda16] text-xs font-medium mb-1.5 flex items-center">
                        <span className="material-symbols-outlined text-[14px]">trending_up</span>
                        +1 ce mois
                    </p>
                </div>
            </div>

            {/* Stat Card 2 */}
            <div className="flex flex-col gap-2 rounded-2xl p-6 bg-[#2c241b] border border-[#493622] hover:border-[#f27f0d]/30 transition-colors">
                <div className="flex items-center justify-between">
                    <p className="text-[#cbad90] text-sm font-medium">Réservations Actives</p>
                    <span className="material-symbols-outlined text-[#f27f0d]">event_available</span>
                </div>
                <div className="flex items-end gap-2">
                    <p className="text-white text-3xl font-bold">{stats.activeReservations}</p>
                    <p className="text-[#0bda16] text-xs font-medium mb-1.5 flex items-center">
                        <span className="material-symbols-outlined text-[14px]">trending_up</span>
                        +15% sem.
                    </p>
                </div>
            </div>

            {/* Stat Card 3 */}
            <div className="flex flex-col gap-2 rounded-2xl p-6 bg-[#2c241b] border border-[#493622] hover:border-[#f27f0d]/30 transition-colors">
                <div className="flex items-center justify-between">
                    <p className="text-[#cbad90] text-sm font-medium">Revenus Hebdo</p>
                    <span className="material-symbols-outlined text-[#f27f0d]">account_balance_wallet</span>
                </div>
                <div className="flex items-end gap-2">
                    <p className="text-white text-3xl font-bold">{(stats.weeklyRevenue / 1000).toFixed(0)}k <span className="text-lg font-normal text-[#cbad90]">CFA</span></p>
                    <p className="text-[#0bda16] text-xs font-medium mb-1.5 flex items-center">
                        <span className="material-symbols-outlined text-[14px]">trending_up</span>
                        +8%
                    </p>
                </div>
            </div>

            {/* Stat Card 4 */}
            <div className="flex flex-col gap-2 rounded-2xl p-6 bg-[#2c241b] border border-[#493622] hover:border-[#f27f0d]/30 transition-colors">
                <div className="flex items-center justify-between">
                    <p className="text-[#cbad90] text-sm font-medium">Taux d'occupation</p>
                    <span className="material-symbols-outlined text-[#f27f0d]">monitoring</span>
                </div>
                <div className="flex items-end gap-2">
                    <p className="text-white text-3xl font-bold">{stats.occupancyRate}</p>
                    <p className="text-[#cbad90] text-xs font-medium mb-1.5">Stable</p>
                </div>
            </div>
        </section>
    );
};

export default DashboardStats;
