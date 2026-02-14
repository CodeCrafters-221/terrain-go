import React from 'react';

const DashboardCharts = () => {
    return (
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
                            {/* Gradient Definition */}
                            <defs>
                                <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                                    <stop offset="0%" stopColor="#f27f0d" stopOpacity="0.3"></stop>
                                    <stop offset="100%" stopColor="#f27f0d" stopOpacity="0"></stop>
                                </linearGradient>
                            </defs>
                            {/* Area Path */}
                            <path d="M0,50 L0,35 C10,35 10,20 20,25 C30,30 30,40 40,35 C50,30 50,10 60,15 C70,20 70,30 80,25 C90,20 90,5 100,10 L100,50 Z" fill="url(#chartGradient)"></path>
                            {/* Line Path */}
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
    );
};

export default DashboardCharts;
