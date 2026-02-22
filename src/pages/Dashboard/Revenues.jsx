import React from 'react';

const Revenues = () => {
    return (
        <div className="flex flex-col gap-8">
            <div className="flex items-center justify-between">
                <h2 className="text-white text-3xl font-bold">Revenus & Transactions</h2>
                <button className="bg-[#f27f0d] text-[#231a10] px-6 py-2 rounded-full font-bold text-sm hover:shadow-lg transition-all">
                    Exporter CSV
                </button>
            </div>

            <div className="bg-[#2c241b] rounded-2xl border border-[#493622] overflow-hidden">
                <div className="p-6 border-b border-[#493622]">
                    <h3 className="text-white text-lg font-bold">Historique des Transactions</h3>
                </div>

                <div className="grid grid-cols-[1fr_2fr_1fr_1fr_1fr] gap-4 p-4 border-b border-[#493622] bg-[#231a10]/50 text-[#cbad90] text-sm font-bold uppercase tracking-wider">
                    <div>Date</div>
                    <div>Description</div>
                    <div>Méthode</div>
                    <div>Montant</div>
                    <div className="text-right">Statut</div>
                </div>

                <div className="flex flex-col">
                    {/* Transaction 1 */}
                    <div className="grid grid-cols-[1fr_2fr_1fr_1fr_1fr] gap-4 p-4 items-center hover:bg-[#493622]/30 transition-colors border-b border-[#493622]/50">
                        <div className="text-white text-sm">18 Fév, 14:30</div>
                        <div className="text-white text-sm font-medium">Réservation #8291 - Moussa Sow</div>
                        <div className="text-[#cbad90] text-sm flex items-center gap-2">
                            <span className="material-symbols-outlined text-[18px]">credit_card</span>
                            Carte Bancaire
                        </div>
                        <div className="text-white font-bold font-mono">+ 35 000 CFA</div>
                        <div className="text-right">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500/10 text-green-500 text-xs font-bold border border-green-500/20">
                                Réussi
                            </span>
                        </div>
                    </div>

                    {/* Transaction 2 */}
                    <div className="grid grid-cols-[1fr_2fr_1fr_1fr_1fr] gap-4 p-4 items-center hover:bg-[#493622]/30 transition-colors border-b border-[#493622]/50">
                        <div className="text-white text-sm">18 Fév, 10:15</div>
                        <div className="text-white text-sm font-medium">Réservation #8290 - FC Renaissance</div>
                        <div className="text-[#cbad90] text-sm flex items-center gap-2">
                            <span className="material-symbols-outlined text-[18px]">smartphone</span>
                            Orange Money
                        </div>
                        <div className="text-white font-bold font-mono">+ 50 000 CFA</div>
                        <div className="text-right">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-yellow-500/10 text-yellow-500 text-xs font-bold border border-yellow-500/20">
                                En attente
                            </span>
                        </div>
                    </div>

                    {/* Transaction 3 */}
                    <div className="grid grid-cols-[1fr_2fr_1fr_1fr_1fr] gap-4 p-4 items-center hover:bg-[#493622]/30 transition-colors">
                        <div className="text-white text-sm">17 Fév, 19:45</div>
                        <div className="text-white text-sm font-medium">Réservation #8288 - Entreprise Orange</div>
                        <div className="text-[#cbad90] text-sm flex items-center gap-2">
                            <span className="material-symbols-outlined text-[18px]">account_balance</span>
                            Virement
                        </div>
                        <div className="text-white font-bold font-mono">+ 70 000 CFA</div>
                        <div className="text-right">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500/10 text-green-500 text-xs font-bold border border-green-500/20">
                                Réussi
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Revenues;
