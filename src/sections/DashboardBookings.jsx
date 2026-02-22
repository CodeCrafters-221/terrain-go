import React from 'react';
import { useDashboard } from '../context/DashboardContext';

const DashboardBookings = () => {
    const { reservations } = useDashboard();

    // Show only first 4 reservations
    const displayReservations = reservations.slice(0, 4);

    return (
        <div className="bg-[#2c241b] rounded-2xl border border-[#493622] h-full flex flex-col">
            <div className="p-6 border-b border-[#493622] flex items-center justify-between">
                <h3 className="text-white text-lg font-bold">Prochaines Réservations</h3>
                <button className="size-8 flex items-center justify-center rounded-full hover:bg-[#493622] text-[#cbad90] transition-colors">
                    <span className="material-symbols-outlined">filter_list</span>
                </button>
            </div>
            <div className="flex flex-col p-2 overflow-y-auto max-h-[600px] custom-scrollbar">
                {displayReservations.map((booking) => (
                    <div key={booking.id} className="p-4 hover:bg-[#493622]/50 rounded-xl transition-colors cursor-pointer group">
                        <div className="flex items-start gap-4">
                            <div className="flex flex-col items-center justify-center bg-[#493622] text-[#f27f0d] rounded-xl w-14 h-14 shrink-0">
                                <span className="text-xs font-bold uppercase">{booking.date.split(' ')[0]}</span>
                                <span className="text-xl font-bold">{booking.date.split(' ')[0] === 'Auj' ? '18' : '19'}</span>
                                {/* Using mock date logic for simple display or just display day */}
                            </div>
                            <div className="flex flex-col flex-1 gap-1">
                                <div className="flex justify-between items-start">
                                    <h4 className="text-white font-medium text-sm">{booking.clientName}</h4>
                                    <span className="text-[#f27f0d] text-xs font-bold px-2 py-0.5 rounded bg-[#f27f0d]/10">{booking.time.split(' - ')[0]}</span>
                                </div>
                                <p className="text-[#cbad90] text-xs">{booking.fieldName}</p>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className={`size-2 rounded-full ${booking.status === 'Payé' || booking.status === 'Confirmé' ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
                                    <span className={`text-xs font-medium ${booking.status === 'Payé' || booking.status === 'Confirmé' ? 'text-green-500' : 'text-yellow-500'}`}>{booking.status}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                <div className="p-4 mt-2">
                    <button className="w-full py-3 rounded-full border border-[#493622] text-[#cbad90] text-sm font-medium hover:bg-[#493622] hover:text-white transition-colors">
                        Voir le calendrier complet
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DashboardBookings;
