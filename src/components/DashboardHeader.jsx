import React from 'react';

const DashboardHeader = () => {
    return (
        <header className="w-full px-8 py-6 sticky top-0 z-10 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-sm border-b border-[#493622]">
            <div className="flex flex-wrap items-center justify-between gap-4 max-w-[1400px] mx-auto">
                <div className="flex flex-col gap-1">
                    <h2 className="text-white text-3xl font-black tracking-tight">Vue d'ensemble</h2>
                    <p className="text-[#cbad90] text-sm">Bienvenue, Mamadou Diop</p>
                </div>
                <div className="flex items-center gap-4">
                    <button className="flex items-center justify-center size-10 rounded-full bg-[#493622] text-white hover:bg-[#5d452b] transition-colors relative cursor-pointer">
                        <span className="material-symbols-outlined">notifications</span>
                        <span className="absolute top-2 right-2 size-2 bg-[#f27f0d] rounded-full border border-[#231a10]"></span>
                    </button>
                    <button className="flex cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-full h-10 px-6 bg-[#f27f0d] text-[#231a10] text-sm font-bold shadow-[0_0_15px_rgba(242,127,13,0.3)] hover:shadow-[0_0_20px_rgba(242,127,13,0.5)] transition-all">
                        <span className="material-symbols-outlined text-[20px]">add</span>
                        <span className="truncate">Ajouter Terrain</span>
                    </button>
                </div>
            </div>
        </header>
    );
};

export default DashboardHeader;
