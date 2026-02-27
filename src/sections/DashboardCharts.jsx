import React from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    AreaChart, Area
} from 'recharts';
import { useDashboard } from '../context/DashboardContext';

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-[#231a10] border border-[#493622] p-3 rounded-lg shadow-xl">
                <p className="text-[#cbad90] text-xs font-bold uppercase mb-1">{label}</p>
                <p className="text-white text-lg font-bold">
                    {payload[0].value.toLocaleString()}
                    <span className="text-sm font-normal text-[#cbad90] ml-1">
                        {payload[0].name === 'revenue' ? 'CFA' : 'joueurs'}
                    </span>
                </p>
            </div>
        );
    }
    return null;
};

const DashboardCharts = () => {
    const { stats, isLoadingReservations } = useDashboard();

    if (isLoadingReservations) {
        return <div className="h-[400px] flex items-center justify-center text-primary">Chargement des données...</div>;
    }

    const attendanceData = stats.attendanceData || [];
    const revenueData = stats.weeklyRevenueData || [];
    const weeklyTotal = stats.weeklyRevenue || 0;
    const playersTotal = attendanceData.reduce((acc, curr) => acc + curr.players, 0);

    return (
        <div className="bg-[#2c241b] rounded-2xl border border-[#493622] p-6">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="text-white text-xl font-bold">Analyses de Performance</h3>
                    <p className="text-[#cbad90] text-sm mt-1">Données basées sur les 30 derniers jours</p>
                </div>
                <select className="bg-[#493622] text-[#cbad90] text-xs font-bold rounded-xl px-4 py-2 border border-white/5 outline-none focus:ring-2 focus:ring-[#f27f0d] transition-all">
                    <option>Cette semaine</option>
                    <option>Ce mois</option>
                </select>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Attendance Chart */}
                <div className="flex flex-col gap-6">
                    <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                            <span className="text-[#cbad90] text-xs font-bold uppercase tracking-wider">Fréquentation</span>
                            <h4 className="text-white text-2xl md:text-3xl font-black mt-1">245 <span className="text-sm font-medium text-[#cbad90]">joueurs</span></h4>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-[#0bda16]/10 border border-[#0bda16]/20 rounded-full">
                            <span className="material-symbols-outlined text-[16px] text-[#0bda16]">trending_up</span>
                            <span className="text-[#0bda16] text-xs font-bold">+12%</span>
                        </div>
                    </div>

                    <div className="h-[220px] w-full min-h-[220px]">
                        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                            <BarChart data={attendanceData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#493622" />
                                <XAxis
                                    dataKey="name"
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
                                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(242, 127, 13, 0.05)' }} />
                                <Bar
                                    dataKey="players"
                                    fill="#f27f0d"
                                    radius={[4, 4, 0, 0]}
                                    barSize={24}
                                    animationDuration={1500}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Revenue Area Chart */}
                <div className="flex flex-col gap-6">
                    <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                            <span className="text-[#cbad90] text-xs font-bold uppercase tracking-wider">Revenus Estimés</span>
                            <h4 className="text-white text-2xl md:text-3xl font-black mt-1">{(weeklyTotal / 1000).toFixed(0)}K <span className="text-sm font-medium text-[#cbad90]">CFA</span></h4>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-[#0bda16]/10 border border-[#0bda16]/20 rounded-full">
                            <span className="material-symbols-outlined text-[16px] text-[#0bda16]">trending_up</span>
                            <span className="text-[#0bda16] text-xs font-bold">+8%</span>
                        </div>
                    </div>

                    <div className="h-[220px] w-full min-h-[220px]">
                        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                            <AreaChart data={revenueData} margin={{ top: 10, right: 5, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#f27f0d" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#f27f0d" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#493622" />
                                <XAxis
                                    dataKey="name"
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
                                <Tooltip content={<CustomTooltip />} />
                                <Area
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="#f27f0d"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorRevenue)"
                                    animationDuration={2000}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardCharts;
