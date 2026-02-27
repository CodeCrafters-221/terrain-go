import React from 'react';
import {
    PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip,
    BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';

import { useDashboard } from '../../context/DashboardContext';

const COLORS = ['#f27f0d', '#cbad90', '#493622', '#7d5a37', '#a67c52'];

const Statistics = () => {
    const { stats, isLoadingReservations } = useDashboard();

    if (isLoadingReservations) {
        return <div className="h-[400px] flex items-center justify-center text-primary">Chargement des analyses...</div>;
    }

    const fieldDistributionData = stats.fieldDistributionData || [];
    const hourlyAffluenceData = stats.hourlyAffluenceData || [];
    const weeklyRevenue = stats.weeklyRevenue || 0;
    const activeReservations = stats.activeReservations || 0;
    const occupancyRate = stats.occupancyRate || "0%";
    return (
        <div className="flex flex-col gap-10">
            <div className="flex flex-col">
                <h2 className="text-white text-2xl md:text-3xl font-black tracking-tight leading-tight">Analyse Approfondie</h2>
                <p className="text-[#cbad90] text-xs md:text-sm mt-1">Gérez la croissance de votre complexe sportif</p>
            </div>

            {/* Top Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-[#2c241b] p-6 rounded-3xl border border-[#493622] flex flex-col gap-2">
                    <span className="text-[#cbad90] text-xs font-bold uppercase tracking-widest">Revenu Mensuel</span>
                    <div className="flex items-end gap-2">
                        <h3 className="text-3xl font-black text-white leading-none">{(weeklyRevenue / 1000000).toFixed(1)}M</h3>
                        <span className="text-[#cbad90] text-sm mb-0.5">CFA</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[#0bda16] text-xs font-bold mt-2">
                        <span className="material-symbols-outlined text-[16px]">trending_up</span>
                        +12% vs. mois dernier
                    </div>
                </div>
                <div className="bg-[#2c241b] p-6 rounded-3xl border border-[#493622] flex flex-col gap-2">
                    <span className="text-[#cbad90] text-xs font-bold uppercase tracking-widest">Heures Réservées</span>
                    <div className="flex items-end gap-2">
                        <h3 className="text-3xl font-black text-white leading-none">{activeReservations}</h3>
                        <span className="text-[#cbad90] text-sm mb-0.5">heures</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[#0bda16] text-xs font-bold mt-2">
                        <span className="material-symbols-outlined text-[16px]">trending_up</span>
                        +5% vs. mois dernier
                    </div>
                </div>
                <div className="bg-[#2c241b] p-6 rounded-3xl border border-[#493622] flex flex-col gap-2">
                    <span className="text-[#cbad90] text-xs font-bold uppercase tracking-widest">Nouveaux Clients</span>
                    <div className="flex items-end gap-2">
                        <h3 className="text-3xl font-black text-white leading-none">45</h3>
                        <span className="text-[#cbad90] text-sm mb-0.5">joueurs</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[#cbad90] text-xs font-bold mt-2">
                        <span className="material-symbols-outlined text-[16px]">remove</span>
                        Stable
                    </div>
                </div>
                <div className="bg-[#2c241b] p-6 rounded-3xl border border-[#493622] flex flex-col gap-2">
                    <span className="text-[#cbad90] text-xs font-bold uppercase tracking-widest">Taux Moyen</span>
                    <div className="flex items-end gap-2">
                        <h3 className="text-3xl font-black text-white leading-none">{occupancyRate}</h3>
                    </div>
                    <div className="flex items-center gap-1.5 text-[#0bda16] text-xs font-bold mt-2">
                        <span className="material-symbols-outlined text-[16px]">trending_up</span>
                        Excellent
                    </div>
                </div>
            </div>

            {/* Detailed Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-[#2c241b] rounded-3xl border border-[#493622] p-8">
                    <h3 className="text-white text-lg font-bold mb-8">Répartition des Réservations</h3>
                    <div className="h-[300px] w-full min-h-[300px]">
                        <ResponsiveContainer width="99%" height="100%">
                            <PieChart>
                                <Pie
                                    data={fieldDistributionData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {fieldDistributionData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ background: '#231a10', border: '1px solid #493622', borderRadius: '12px' }}
                                    itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                                />
                                <Legend
                                    verticalAlign="bottom"
                                    height={36}
                                    formatter={(value) => <span className="text-[#cbad90] text-xs font-bold">{value}</span>}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-[#2c241b] rounded-3xl border border-[#493622] p-8">
                    <h3 className="text-white text-lg font-bold mb-8">Affluence par Créneau Horaire</h3>
                    <div className="h-[300px] w-full min-h-[300px]">
                        <ResponsiveContainer width="99%" height="100%">
                            <BarChart data={hourlyAffluenceData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#493622" />
                                <XAxis
                                    dataKey="hour"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#cbad90', fontSize: 12, fontWeight: 600 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#cbad90', fontSize: 10 }}
                                />
                                <Tooltip
                                    cursor={{ fill: 'rgba(242, 127, 13, 0.05)' }}
                                    contentStyle={{ background: '#231a10', border: '1px solid #493622', borderRadius: '12px' }}
                                    itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                                />
                                <Bar
                                    dataKey="count"
                                    fill="#f27f0d"
                                    radius={[4, 4, 0, 0]}
                                    barSize={20}
                                    animationDuration={1500}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Statistics;
