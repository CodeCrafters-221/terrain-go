import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useDashboard } from '../../context/DashboardContext';
import { toast } from 'react-toastify';

const Revenues = () => {
    const { reservations, subscriptions, stats, isLoadingReservations, isLoadingSubscriptions } = useDashboard();
    const [filterStatus, setFilterStatus] = useState('Tous');
    const [visibleCount, setVisibleCount] = useState(10);

    if (isLoadingReservations || isLoadingSubscriptions) {
        return <div className="h-[400px] flex items-center justify-center text-primary font-bold">Chargement des transactions...</div>;
    }

    const revenueTrend = stats.weeklyRevenueData || [];

    // Mapping keys correctly to match DashboardContext (name/revenue)
    const chartData = revenueTrend.map(d => ({
        label: d.name,
        amount: d.revenue
    }));

    const mappedReservations = (reservations || [])
        .filter(r => r.status !== 'Annulé' && r.reservationType !== 'subscription')
        .map(r => ({
            id: `#${String(r.id).substring(0, 4)}`,
            date: r.date,
            client: r.clientName,
            desc: `Match Unique ${r.fieldName}`,
            method: r.paymentMethod || 'Non spécifié',
            icon: r.paymentMethod === 'Wave' ? 'account_balance_wallet' : 'smartphone',
            numericAmount: r.amount || 0,
            amountText: `+ ${(r.amount || 0).toLocaleString()}`,
            status: r.status === 'Payé' ? 'Réussi' : (r.status === 'Confirmé' ? 'Réussi' : 'En attente'),
            isSubscription: false,
            createdAt: r.createdAt
        }));

    const mappedSubscriptions = (subscriptions || [])
        .filter(s => s.status !== 'Annulé')
        .map(s => ({
            id: `#${String(s.id).substring(0, 4)}`,
            date: new Date(s.createdAt).toLocaleDateString('fr-FR'),
            client: s.clientName,
            desc: `Abo Mensuel ${s.fieldName}`,
            method: s.paymentMethod || 'Non spécifié',
            icon: 'autorenew',
            numericAmount: s.amount || 0,
            amountText: `+ ${(s.amount || 0).toLocaleString()}`,
            status: (s.status === 'Confirmé' || s.status === 'active' || s.status === 'Payé') ? 'Réussi' : 'En attente',
            isSubscription: true,
            createdAt: s.createdAt
        }));

    const allTransactions = [...mappedReservations, ...mappedSubscriptions]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const filteredTransactions = filterStatus === 'Tous'
        ? allTransactions
        : allTransactions.filter(tx => tx.status === 'Réussi');

    const paginatedTransactions = filteredTransactions.slice(0, visibleCount);

    const handleExportCSV = () => {
        if (allTransactions.length === 0) {
            toast.warn("Aucune donnée à exporter");
            return;
        }

        const headers = ["ID", "Date", "Client", "Description", "Méthode", "Montant (CFA)", "Statut"];
        // Use semicolon separator for French Excel compatibility
        const rows = allTransactions.map(tx => [
            `"${tx.id}"`,
            `"${tx.date}"`,
            `"${tx.client}"`,
            `"${tx.desc}"`,
            `"${tx.method}"`,
            tx.numericAmount,
            `"${tx.status}"`
        ]);

        // Add BOM \uFEFF for proper UTF-8 decoding in Excel
        const csvContent = "\uFEFF"
            + headers.join(";") + "\n"
            + rows.map(e => e.join(";")).join("\n");

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `rapport_finances_${new Date().toLocaleDateString('fr-FR').replace(/\//g, '-')}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        toast.success("Rapport exporté avec succès !");
    };

    return (
        <div className="flex flex-col gap-6 md:gap-10 pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex flex-col">
                    <h2 className="text-white text-2xl md:text-3xl font-black tracking-tight">Finances & Transactions</h2>
                    <p className="text-[#cbad90] text-sm mt-1">Suivez vos flux de trésorerie en temps réel</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <button
                        onClick={() => {
                            setFilterStatus(filterStatus === 'Tous' ? 'Réussi' : 'Tous');
                            setVisibleCount(10);
                        }}
                        className={`flex items-center gap-2 px-4 md:px-6 py-2 md:py-2.5 rounded-full font-bold text-xs md:text-sm transition-all border ${filterStatus === 'Réussi'
                            ? 'bg-[#f27f0d]/10 text-[#f27f0d] border-[#f27f0d]/30'
                            : 'bg-[#493622] text-white border-white/5 hover:bg-white/10'
                            }`}
                    >
                        <span className="material-symbols-outlined text-sm md:text-base">filter_list</span>
                        {filterStatus === 'Tous' ? 'Tout' : 'Réussis'}
                    </button>
                    <button
                        onClick={handleExportCSV}
                        className="bg-[#f27f0d] text-[#231a10] px-4 md:px-8 py-2 md:py-2.5 rounded-full font-black text-xs md:text-sm hover:shadow-[0_0_20px_rgba(242,127,13,0.3)] hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                    >
                        <span className="material-symbols-outlined text-sm md:text-base">download</span>
                        <span className="hidden sm:inline">Exporter (CSV)</span>
                        <span className="sm:hidden">Exporter</span>
                    </button>
                </div>
            </div>

            {/* Financial Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[#2c241b] p-6 rounded-3xl border border-[#493622] flex flex-col gap-2 shadow-lg">
                    <span className="text-[#cbad90] text-xs font-bold uppercase tracking-widest">Revenus Matches</span>
                    <div className="flex items-end gap-2">
                        <span className="text-white text-3xl font-black">{(stats.weeklyRevenue || 0).toLocaleString()}</span>
                        <span className="text-primary text-xs font-bold mb-1">CFA</span>
                    </div>
                </div>
                <div className="bg-[#2c241b] p-6 rounded-3xl border border-[#493622] flex flex-col gap-2 shadow-lg">
                    <div className="flex justify-between items-start">
                        <span className="text-[#cbad90] text-xs font-bold uppercase tracking-widest">Revenus Abonnements</span>
                        <span className="bg-primary/20 text-primary text-[10px] px-2 py-0.5 rounded font-black">MENSUEL</span>
                    </div>
                    <div className="flex items-end gap-2">
                        <span className="text-white text-3xl font-black">{(stats.subscriptionRevenue || 0).toLocaleString()}</span>
                        <span className="text-primary text-xs font-bold mb-1">CFA</span>
                    </div>
                </div>
                <div className="bg-[#f27f0d] p-6 rounded-3xl shadow-[0_0_30px_rgba(242,127,13,0.2)] flex flex-col gap-2">
                    <span className="text-[#231a10] text-xs font-black uppercase tracking-widest">Total Trésorerie</span>
                    <div className="flex items-end gap-2">
                        <span className="text-[#231a10] text-3xl font-black">{( (stats.weeklyRevenue || 0) + (stats.subscriptionRevenue || 0) ).toLocaleString()}</span>
                        <span className="text-[#342618] text-xs font-bold mb-1 uppercase">CFA</span>
                    </div>
                </div>
            </div>

            {/* Revenue Trend Chart */}
            <div className="bg-[#2c241b] rounded-3xl border border-[#493622] p-4 md:p-8 shadow-xl">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 md:mb-8">
                    <div className="flex flex-col">
                        <h3 className="text-white text-lg font-bold">Croissance du Revenu</h3>
                        <p className="text-[#cbad90] text-[10px] uppercase tracking-widest font-bold opacity-60">4 dernières semaines</p>
                    </div>
                    <div className="flex items-center gap-2 text-[#0bda16] font-bold bg-[#0bda16]/10 px-3 md:px-4 py-1.5 md:py-2 rounded-full border border-[#0bda16]/20 text-xs md:text-base w-fit">
                        <span className="material-symbols-outlined text-[16px] md:text-[18px]">trending_up</span>
                        Performance positive
                    </div>
                </div>
                <div className="h-[250px] md:h-[300px] w-full min-h-[250px] md:min-h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
                            <defs>
                                <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#f27f0d" stopOpacity={0.4} />
                                    <stop offset="95%" stopColor="#f27f0d" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#493622" opacity={0.3} />
                            <XAxis
                                dataKey="label"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#cbad90', fontSize: 11, fontWeight: 700 }}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#cbad90', fontSize: 10, fontWeight: 600 }}
                                tickFormatter={(val) => `${(val / 1000).toLocaleString()}k`}
                            />
                            <Tooltip
                                contentStyle={{ background: '#231a10', border: '1px solid #493622', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}
                                cursor={{ stroke: '#f27f0d', strokeWidth: 2, strokeDasharray: '5 5' }}
                                itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                                labelStyle={{ color: '#f27f0d', marginBottom: '4px', fontWeight: 'black' }}
                                formatter={(val) => [`${(val || 0).toLocaleString()} CFA`, 'Revenu']}
                            />
                            <Area
                                type="monotone"
                                dataKey="amount"
                                stroke="#f27f0d"
                                strokeWidth={4}
                                fillOpacity={1}
                                fill="url(#revenueFill)"
                                animationDuration={1500}
                                dot={{ fill: '#f27f0d', strokeWidth: 2, r: 4, stroke: '#231a10' }}
                                activeDot={{ r: 6, strokeWidth: 0, fill: '#fff' }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="bg-[#2c241b] rounded-3xl border border-[#493622] overflow-hidden shadow-2xl">
                <div className="p-4 md:p-8 border-b border-[#493622] flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#231a10]/50">
                    <h3 className="text-white text-lg md:text-xl font-bold">Historique des Transactions</h3>
                    <div className="flex items-center gap-2">
                        <span className="size-2 rounded-full bg-[#f27f0d] animate-pulse"></span>
                        <span className="text-[#cbad90] text-xs md:text-sm font-medium">
                            {paginatedTransactions.length} affichées sur {filteredTransactions.length}
                        </span>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[#231a10]/80 text-[#cbad90] text-[10px] md:text-[11px] font-black uppercase tracking-wider border-b border-[#493622]">
                                <th className="px-4 md:px-8 py-4 md:py-5 min-w-[120px]">Date & ID</th>
                                <th className="px-4 md:px-8 py-4 md:py-5 min-w-[180px]">Client / Détails</th>
                                <th className="px-4 md:px-8 py-4 md:py-5 min-w-[120px]">Méthode</th>
                                <th className="px-4 md:px-8 py-4 md:py-5 min-w-[120px]">Montant</th>
                                <th className="px-4 md:px-8 py-4 md:py-5 text-right min-w-[100px]">Statut</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#493622]/30">
                            {paginatedTransactions.length > 0 ? (
                                paginatedTransactions.map((tx, i) => (
                                    <tr key={i} className="hover:bg-[#493622]/20 transition-all group">
                                        <td className="px-4 md:px-8 py-4 md:py-6">
                                            <div className="flex flex-col">
                                                <span className="text-white text-xs md:text-sm font-bold">{tx.date}</span>
                                                <span className="text-[#cbad90] text-[9px] md:text-[10px] font-bold mt-0.5 tracking-wider uppercase opacity-60">{tx.id}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 md:px-8 py-4 md:py-6">
                                            <div className="flex flex-col">
                                                <span className="text-white text-xs md:text-sm font-black group-hover:text-[#f27f0d] transition-colors">{tx.client}</span>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-[#cbad90] text-[10px] md:text-xs font-medium">{tx.desc}</span>
                                                    {tx.isSubscription && (
                                                        <span className="bg-primary/10 text-primary text-[8px] px-1.5 py-0.5 rounded font-black uppercase">Abo</span>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 md:px-8 py-4 md:py-6">
                                            <div className="flex items-center gap-2 px-2 md:px-3 py-1 md:py-1.5 bg-[#231a10] rounded-xl border border-white/5 w-fit">
                                                <span className="material-symbols-outlined text-[16px] md:text-[18px] text-[#f27f0d]">{tx.icon}</span>
                                                <span className="text-white text-[10px] md:text-xs font-bold">{tx.method}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 md:px-8 py-4 md:py-6">
                                            <div className="flex flex-col">
                                                <span className="text-white text-sm md:text-lg font-black font-mono">{tx.amountText}</span>
                                                <span className="text-[9px] md:text-[10px] font-bold text-[#cbad90] uppercase tracking-tighter">CFA XOF</span>
                                            </div>
                                        </td>
                                        <td className="px-4 md:px-8 py-4 md:py-6 text-right">
                                            <span className={`inline-flex items-center gap-1 px-2 md:px-4 py-1 md:py-1.5 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-wider border ${tx.status === 'Réussi' ? 'bg-[#0bda16]/10 text-[#0bda16] border-[#0bda16]/20' :
                                                tx.status === 'En attente' ? 'bg-[#f27f0d]/10 text-[#f27f0d] border-[#f27f0d]/20' :
                                                    'bg-red-500/10 text-red-500 border-red-500/20'
                                                }`}>
                                                <span className={`size-1 md:size-1.5 rounded-full ${tx.status === 'Réussi' ? 'bg-[#0bda16]' :
                                                    tx.status === 'En attente' ? 'bg-[#f27f0d]' :
                                                        'bg-red-500'
                                                    } ${tx.status === 'En attente' ? 'animate-pulse' : ''}`}></span>
                                                {tx.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-8 py-20 text-center text-[#cbad90] italic">
                                        Aucune transaction ne correspond à ce filtre.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {(filteredTransactions.length > visibleCount || visibleCount > 10) && (
                    <div className="p-6 bg-[#231a10]/40 border-t border-[#493622] flex justify-center gap-6">
                        {filteredTransactions.length > visibleCount && (
                            <button
                                onClick={() => setVisibleCount(prev => prev + 10)}
                                className="text-[#f27f0d] text-xs font-black uppercase tracking-widest hover:tracking-[0.3em] transition-all flex items-center gap-2"
                            >
                                Charger plus
                                <span className="material-symbols-outlined text-sm">arrow_downward</span>
                            </button>
                        )}
                        {visibleCount > 10 && (
                            <button
                                onClick={() => setVisibleCount(10)}
                                className="text-[#cbad90] hover:text-white text-xs font-black uppercase tracking-widest hover:tracking-[0.3em] transition-all flex items-center gap-2"
                            >
                                <span className="material-symbols-outlined text-sm">arrow_upward</span>
                                Voir moins
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Revenues;
