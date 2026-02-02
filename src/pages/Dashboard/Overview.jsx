import React from 'react';

const Overview = () => {
    return (
        <>
            {/* KPI Stats Row */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Stat Card 1 */}
                <div className="flex flex-col gap-2 rounded-2xl p-6 bg-[#2c241b] border border-[#493622] hover:border-[#f27f0d]/30 transition-colors">
                    <div className="flex items-center justify-between">
                        <p className="text-[#cbad90] text-sm font-medium">Total Terrains</p>
                        <span className="material-symbols-outlined text-[#f27f0d]">stadium</span>
                    </div>
                    <div className="flex items-end gap-2">
                        <p className="text-white text-3xl font-bold">3</p>
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
                        <p className="text-white text-3xl font-bold">12</p>
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
                        <p className="text-white text-3xl font-bold">150k <span className="text-lg font-normal text-[#cbad90]">CFA</span></p>
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
                        <p className="text-white text-3xl font-bold">85%</p>
                        <p className="text-[#cbad90] text-xs font-medium mb-1.5">Stable</p>
                    </div>
                </div>
            </section>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Left Column (Charts & Fields) */}
                <div className="xl:col-span-2 flex flex-col gap-8">
                    {/* Charts Section */}
                    <div className="bg-[#2c241b] rounded-2xl border border-[#493622] p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-white text-lg font-bold">Statistiques de Fréquentation</h3>
                            <select className="bg-[#493622] text-[#cbad90] text-xs rounded-lg px-3 py-1.5 border-none outline-none focus:ring-1 focus:ring-[#f27f0d]">
                                <option>Cette semaine</option>
                                <option>Ce mois</option>
                            </select>
                        </div>
                        <div className="flex flex-col md:flex-row gap-8">
                            {/* Bar Chart Mockup */}
                            <div className="flex-1 flex flex-col gap-4">
                                <div className="flex items-baseline gap-2">
                                    <h4 className="text-white text-2xl font-bold">245</h4>
                                    <span className="text-[#cbad90] text-sm">Joueurs cette semaine</span>
                                </div>
                                <div className="grid grid-cols-7 h-[160px] items-end gap-2 sm:gap-4 pt-4 border-b border-[#493622]">
                                    {/* Bars */}
                                    <div className="w-full bg-[#493622] rounded-t-sm relative group h-[40%] hover:bg-[#f27f0d] transition-colors">
                                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-black text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">40%</div>
                                    </div>
                                    <div className="w-full bg-[#493622] rounded-t-sm relative group h-[60%] hover:bg-[#f27f0d] transition-colors"></div>
                                    <div className="w-full bg-[#f27f0d] rounded-t-sm relative group h-[85%]"></div>
                                    <div className="w-full bg-[#493622] rounded-t-sm relative group h-[55%] hover:bg-[#f27f0d] transition-colors"></div>
                                    <div className="w-full bg-[#493622] rounded-t-sm relative group h-[70%] hover:bg-[#f27f0d] transition-colors"></div>
                                    <div className="w-full bg-[#493622] rounded-t-sm relative group h-[90%] hover:bg-[#f27f0d] transition-colors"></div>
                                    <div className="w-full bg-[#493622] rounded-t-sm relative group h-[65%] hover:bg-[#f27f0d] transition-colors"></div>
                                </div>
                                <div className="grid grid-cols-7 text-center">
                                    <span className="text-[#cbad90] text-xs font-bold">Lun</span>
                                    <span className="text-[#cbad90] text-xs font-bold">Mar</span>
                                    <span className="text-white text-xs font-bold">Mer</span>
                                    <span className="text-[#cbad90] text-xs font-bold">Jeu</span>
                                    <span className="text-[#cbad90] text-xs font-bold">Ven</span>
                                    <span className="text-[#cbad90] text-xs font-bold">Sam</span>
                                    <span className="text-[#cbad90] text-xs font-bold">Dim</span>
                                </div>
                            </div>

                            {/* Revenue Line Chart Area */}
                            <div className="flex-1 flex flex-col gap-4">
                                <div className="flex items-baseline gap-2">
                                    <h4 className="text-white text-2xl font-bold">1.2M</h4>
                                    <span className="text-[#cbad90] text-sm">CFA (Derniers 30j)</span>
                                </div>
                                <div className="relative h-[160px] w-full pt-4">
                                    <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 50">
                                        <defs>
                                            <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                                                <stop offset="0%" stopColor="#f27f0d" stopOpacity="0.3"></stop>
                                                <stop offset="100%" stopColor="#f27f0d" stopOpacity="0"></stop>
                                            </linearGradient>
                                        </defs>
                                        <path d="M0,50 L0,35 C10,35 10,20 20,25 C30,30 30,40 40,35 C50,30 50,10 60,15 C70,20 70,30 80,25 C90,20 90,5 100,10 L100,50 Z" fill="url(#chartGradient)"></path>
                                        <path d="M0,35 C10,35 10,20 20,25 C30,30 30,40 40,35 C50,30 50,10 60,15 C70,20 70,30 80,25 C90,20 90,5 100,10" fill="none" stroke="#f27f0d" strokeLinecap="round" strokeWidth="2"></path>
                                    </svg>
                                </div>
                                <div className="flex justify-between px-2">
                                    <span className="text-[#cbad90] text-xs font-bold">Sem 1</span>
                                    <span className="text-[#cbad90] text-xs font-bold">Sem 2</span>
                                    <span className="text-[#cbad90] text-xs font-bold">Sem 3</span>
                                    <span className="text-[#cbad90] text-xs font-bold">Sem 4</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Fields List */}
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between px-2">
                            <h3 className="text-white text-xl font-bold">Mes Terrains</h3>
                            <a className="text-[#f27f0d] text-sm font-medium hover:underline" href="#">Voir tout</a>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Field Card 1 */}
                            <div className="bg-[#2c241b] rounded-2xl overflow-hidden group border border-[#493622] hover:border-[#f27f0d] transition-all">
                                <div className="h-40 bg-cover bg-center relative" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAnNGA34sSndyAJAfENjmbZRG81TkS1IJSCHEAHafu1htOaj2cazf9VkAzI4xERiSDtxWleAt9uDNrVFcRvfQi2e-ZpTSJYfagli4b3vXbzcv-rH7Q5Hg_1kWirsvM-dr52fv7Qh2gJkNCmn1sXhB7fAXoinUFHJS8fJreTbxZNS322Vr3gPJfaiK-kkfmRlO9tuQrnujBbkoXIQGn-vRNGKl3Nfod6xatgMQk7J7RS2Mq-SVffZwiNQfZH1tY4ghFAAs5v8BYF1w')" }}>
                                    <div className="absolute top-3 right-3 bg-[#0bda16] text-[#231a10] text-xs font-bold px-3 py-1 rounded-full shadow-sm">Disponible</div>
                                    <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-lg flex items-center gap-1">
                                        <span className="material-symbols-outlined text-[14px]">location_on</span>
                                        Almadies, Zone A
                                    </div>
                                </div>
                                <div className="p-4 flex flex-col gap-3">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="text-white font-bold text-lg">Terrain Almadies 1</h4>
                                            <p className="text-[#cbad90] text-sm">5 vs 5 • Gazon synthétique</p>
                                        </div>
                                        <button className="text-[#cbad90] hover:text-white p-1 rounded-full hover:bg-[#493622] transition-colors cursor-pointer">
                                            <span className="material-symbols-outlined">more_vert</span>
                                        </button>
                                    </div>
                                    <div className="flex items-center gap-4 mt-1 border-t border-[#493622] pt-3">
                                        <div className="flex items-center gap-1.5">
                                            <span className="material-symbols-outlined text-[#f27f0d] text-[18px]">schedule</span>
                                            <span className="text-xs text-[#cbad90]">08:00 - 02:00</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <span className="material-symbols-outlined text-[#f27f0d] text-[18px]">attach_money</span>
                                            <span className="text-xs text-[#cbad90]">35k CFA/h</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Field Card 2 */}
                            <div className="bg-[#2c241b] rounded-2xl overflow-hidden group border border-[#493622] hover:border-[#f27f0d] transition-all">
                                <div className="h-40 bg-cover bg-center relative" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAFkEi2qPBbnp4fWRAApkMARW8lYx9NIC4yrva9nHaYsPOlboma_LEg6OXn8Qyff1pKfUL-08zOACh-g2HPaCEq-KbDgfbcNnYnAi0SYkchyA_bjCnN4RqlYLQqoQ95VwZaHmjzFzn-si0RpnlHwZqw9vG2gObas41_8S5Wiqdpu8cLN23kn2n4hDchv3KdO2CQAJWA0Nj2IlyNmz_gZT87SSHXWuL96MIG_STqFx2Y0Tb9YKkUrZU-2EkX0zkdAfjJEJ6e_wksJw')" }}>
                                    <div className="absolute top-3 right-3 bg-[#f27f0d] text-[#231a10] text-xs font-bold px-3 py-1 rounded-full shadow-sm">Occupé</div>
                                    <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-lg flex items-center gap-1">
                                        <span className="material-symbols-outlined text-[14px]">location_on</span>
                                        Mermoz
                                    </div>
                                </div>
                                <div className="p-4 flex flex-col gap-3">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="text-white font-bold text-lg">Terrain Mermoz Pro</h4>
                                            <p className="text-[#cbad90] text-sm">7 vs 7 • Gazon Hybride</p>
                                        </div>
                                        <button className="text-[#cbad90] hover:text-white p-1 rounded-full hover:bg-[#493622] transition-colors cursor-pointer">
                                            <span className="material-symbols-outlined">more_vert</span>
                                        </button>
                                    </div>
                                    <div className="flex items-center gap-4 mt-1 border-t border-[#493622] pt-3">
                                        <div className="flex items-center gap-1.5">
                                            <span className="material-symbols-outlined text-[#f27f0d] text-[18px]">schedule</span>
                                            <span className="text-xs text-[#cbad90]">24h/24</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <span className="material-symbols-outlined text-[#f27f0d] text-[18px]">attach_money</span>
                                            <span className="text-xs text-[#cbad90]">50k CFA/h</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column (Recent Bookings) */}
                <div className="xl:col-span-1">
                    <div className="bg-[#2c241b] rounded-2xl border border-[#493622] h-full flex flex-col">
                        <div className="p-6 border-b border-[#493622] flex items-center justify-between">
                            <h3 className="text-white text-lg font-bold">Prochaines Réservations</h3>
                            <button className="size-8 flex items-center justify-center rounded-full hover:bg-[#493622] text-[#cbad90] transition-colors cursor-pointer">
                                <span className="material-symbols-outlined">filter_list</span>
                            </button>
                        </div>
                        <div className="flex flex-col p-2 overflow-y-auto max-h-[600px] custom-scrollbar">
                            {/* Booking Item 1 */}
                            <div className="p-4 hover:bg-[#493622]/50 rounded-xl transition-colors cursor-pointer group">
                                <div className="flex items-start gap-4">
                                    <div className="flex flex-col items-center justify-center bg-[#493622] text-[#f27f0d] rounded-xl w-14 h-14 shrink-0">
                                        <span className="text-xs font-bold uppercase">Auj</span>
                                        <span className="text-xl font-bold">18</span>
                                    </div>
                                    <div className="flex flex-col flex-1 gap-1">
                                        <div className="flex justify-between items-start">
                                            <h4 className="text-white font-medium text-sm">Moussa Sow</h4>
                                            <span className="text-[#f27f0d] text-xs font-bold px-2 py-0.5 rounded bg-[#f27f0d]/10">18:00</span>
                                        </div>
                                        <p className="text-[#cbad90] text-xs">Terrain Almadies 1</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="size-2 rounded-full bg-green-500"></span>
                                            <span className="text-xs text-green-500 font-medium">Confirmé • Payé</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Booking Item 2 */}
                            <div className="p-4 hover:bg-[#493622]/50 rounded-xl transition-colors cursor-pointer group">
                                <div className="flex items-start gap-4">
                                    <div className="flex flex-col items-center justify-center bg-[#493622] text-white rounded-xl w-14 h-14 shrink-0">
                                        <span className="text-xs font-bold uppercase">Auj</span>
                                        <span className="text-xl font-bold">20</span>
                                    </div>
                                    <div className="flex flex-col flex-1 gap-1">
                                        <div className="flex justify-between items-start">
                                            <h4 className="text-white font-medium text-sm">FC Renaissance</h4>
                                            <span className="text-white text-xs font-bold px-2 py-0.5 rounded bg-[#493622]">20:00</span>
                                        </div>
                                        <p className="text-[#cbad90] text-xs">Terrain Mermoz Pro</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="size-2 rounded-full bg-yellow-500"></span>
                                            <span className="text-xs text-yellow-500 font-medium">En attente paiement</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Booking Item 3 */}
                            <div className="p-4 hover:bg-[#493622]/50 rounded-xl transition-colors cursor-pointer group">
                                <div className="flex items-start gap-4">
                                    <div className="flex flex-col items-center justify-center bg-[#231a10] text-[#cbad90] rounded-xl w-14 h-14 shrink-0 border border-[#493622]">
                                        <span className="text-xs font-bold uppercase">Dem</span>
                                        <span className="text-xl font-bold">19</span>
                                    </div>
                                    <div className="flex flex-col flex-1 gap-1">
                                        <div className="flex justify-between items-start">
                                            <h4 className="text-white font-medium text-sm">Entreprise Orange</h4>
                                            <span className="text-[#cbad90] text-xs font-bold px-2 py-0.5 rounded bg-[#493622]">19:00</span>
                                        </div>
                                        <p className="text-[#cbad90] text-xs">Terrain Almadies 1</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="size-2 rounded-full bg-green-500"></span>
                                            <span className="text-xs text-green-500 font-medium">Confirmé</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Booking Item 4 */}
                            <div className="p-4 hover:bg-[#493622]/50 rounded-xl transition-colors cursor-pointer group">
                                <div className="flex items-start gap-4">
                                    <div className="flex flex-col items-center justify-center bg-[#231a10] text-[#cbad90] rounded-xl w-14 h-14 shrink-0 border border-[#493622]">
                                        <span className="text-xs font-bold uppercase">Ven</span>
                                        <span className="text-xl font-bold">21</span>
                                    </div>
                                    <div className="flex flex-col flex-1 gap-1">
                                        <div className="flex justify-between items-start">
                                            <h4 className="text-white font-medium text-sm">Groupe Amis Dakar</h4>
                                            <span className="text-[#cbad90] text-xs font-bold px-2 py-0.5 rounded bg-[#493622]">21:00</span>
                                        </div>
                                        <p className="text-[#cbad90] text-xs">Terrain Almadies 1</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="size-2 rounded-full bg-green-500"></span>
                                            <span className="text-xs text-green-500 font-medium">Confirmé</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 mt-2">
                                <button className="w-full py-3 rounded-full border border-[#493622] text-[#cbad90] text-sm font-medium hover:bg-[#493622] hover:text-white transition-colors cursor-pointer">
                                    Voir le calendrier complet
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Overview;
