import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

import { useDashboard } from '../../context/DashboardContext';

const Revenues = () => {
    const { reservations, stats, isLoadingReservations } = useDashboard();

    if (isLoadingReservations) {
        return <div className="h-[400px] flex items-center justify-center text-primary">Chargement des transactions...</div>;
    }

    const revenueTrend = stats.weeklyRevenueData || [];
    const transactions = (reservations || []).slice(0, 10).map(r => ({
        id: `#${String(r.id).substring(0, 4)}`,
        date: r.date,
        client: r.clientName,
        desc: `Réservation ${r.fieldName}`,
        method: r.paymentMethod || 'Non spécifié',
        icon: r.paymentMethod === 'Wave' ? 'account_balance_wallet' : 'smartphone',
        amount: `+ ${(r.amount || 0).toLocaleString()}`,
        status: r.status === 'Payé' ? 'Réussi' : (r.status === 'Confirmé' ? 'Réussi' : (r.status === 'Annulé' ? 'Annulé' : 'En attente'))
    }));
    return (
        <div className="flex flex-col gap-10">
            <div className="flex items-center justify-between">
                <div className="flex flex-col">
                    <h2 className="text-white text-3xl font-black tracking-tight">Finances & Transactions</h2>
                    <p className="text-[#cbad90] text-sm mt-1">Suivez vos flux de trésorerie en temps réel</p>
                </div>
                <div className="flex gap-4">
                    <button className="bg-surface-highlight text-white px-6 py-2.5 rounded-full font-bold text-sm hover:bg-white/10 transition-all border border-white/5">
                        Filtrer
                    </button>
                    <button className="bg-[#f27f0d] text-[#231a10] px-8 py-2.5 rounded-full font-black text-sm hover:shadow-[0_0_20px_rgba(242,127,13,0.3)] transition-all">
                        Exporter (CSV)
                    </button>
                </div>
            </div>

            {/* Revenue Trend Chart */}
            <div className="bg-[#2c241b] rounded-3xl border border-[#493622] p-8">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-white text-lg font-bold">Croissance du Revenu</h3>
                    <div className="flex items-center gap-2 text-[#0bda16] font-bold">
                        <span className="material-symbols-outlined">trending_up</span>
                        +24% ce semestre
                    </div>
                </div>
                <div className="h-[250px] w-full min-h-[250px]">
                    <ResponsiveContainer width="99%" height="100%">
                        <AreaChart data={revenueTrend} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                            <defs>
                                <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#f27f0d" stopOpacity={0.2} />
                                    <stop offset="95%" stopColor="#f27f0d" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#493622" />
                            <XAxis
                                dataKey="month"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#cbad90', fontSize: 12, fontWeight: 600 }}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#cbad90', fontSize: 10 }}
                                tickFormatter={(val) => `${val / 1000000}M`}
                            />
                            <Tooltip
                                contentStyle={{ background: '#231a10', border: '1px solid #493622', borderRadius: '12px' }}
                                itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                                formatter={(val) => [`${val.toLocaleString()} CFA`, 'Revenu']}
                            />
                            <Area
                                type="monotone"
                                dataKey="amount"
                                stroke="#f27f0d"
                                strokeWidth={4}
                                fillOpacity={1}
                                fill="url(#revenueFill)"
                                animationDuration={2500}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="bg-[#2c241b] rounded-3xl border border-[#493622] overflow-hidden shadow-2xl">
                <div className="p-8 border-b border-[#493622] flex items-center justify-between">
                    <h3 className="text-white text-xl font-bold">Derniers Encaissements</h3>
                    <span className="text-[#cbad90] text-sm font-medium">Affichage des 5 dernières transactions</span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[#231a10]/50 text-[#cbad90] text-[11px] font-black uppercase tracking-[0.2em]">
                                <th className="px-8 py-4">Date & ID</th>
                                <th className="px-8 py-4">Client / Description</th>
                                <th className="px-8 py-4">Méthode</th>
                                <th className="px-8 py-4">Montant</th>
                                <th className="px-8 py-4 text-right">Statut</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#493622]/30">
                            {transactions.map((tx, i) => (
                                <tr key={i} className="hover:bg-[#493622]/20 transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col">
                                            <span className="text-white text-sm font-bold">{tx.date}</span>
                                            <span className="text-[#cbad90] text-[10px] font-bold mt-0.5">{tx.id}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col">
                                            <span className="text-white text-sm font-black group-hover:text-[#f27f0d] transition-colors">{tx.client}</span>
                                            <span className="text-[#cbad90] text-xs mt-0.5">{tx.desc}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2.5 px-3 py-1.5 bg-[#231a10] rounded-xl border border-white/5 w-fit">
                                            <span className="material-symbols-outlined text-[18px] text-[#f27f0d]">{tx.icon}</span>
                                            <span className="text-white text-xs font-bold">{tx.method}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="text-white text-lg font-black font-mono">{tx.amount} <small className="text-[10px] font-bold ml-1 text-[#cbad90]">CFA</small></span>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${tx.status === 'Réussi' ? 'bg-[#0bda16]/10 text-[#0bda16] border-[#0bda16]/20' :
                                            tx.status === 'En attente' ? 'bg-[#f27f0d]/10 text-[#f27f0d] border-[#f27f0d]/20' :
                                                'bg-red-500/10 text-red-500 border-red-500/20'
                                            }`}>
                                            <span className={`size-1.5 rounded-full ${tx.status === 'Réussi' ? 'bg-[#0bda16]' :
                                                tx.status === 'En attente' ? 'bg-[#f27f0d]' :
                                                    'bg-red-500'
                                                } animate-pulse`}></span>
                                            {tx.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="p-6 bg-[#231a10]/20 border-t border-[#493622]">
                    <button className="w-full text-[#cbad90] text-xs font-black uppercase tracking-widest hover:text-white transition-colors">
                        Charger plus de transactions
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Revenues;
