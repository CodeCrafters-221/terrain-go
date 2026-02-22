import React, { useState } from 'react';
import { useDashboard } from '../../context/DashboardContext';
import { generateTicket } from '../../utils/ticketGenerator';

const MyReservations = () => {
    const { reservations, updateReservationStatus } = useDashboard();
    const [filter, setFilter] = useState('Tous les terrains');

    const filteredReservations = filter === 'Tous les terrains'
        ? reservations
        : reservations.filter(r => r.fieldName === filter);

    const handleDownloadTicket = (booking) => {
        generateTicket(booking);
    };

    return (
        <div className="flex flex-col gap-8">
            <div className="flex items-center justify-between">
                <h2 className="text-white text-3xl font-bold">Mes Réservations</h2>
                <div className="flex gap-2">
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="bg-[#2c241b] text-[#cbad90] border border-[#493622] rounded-lg px-4 py-2 outline-none focus:border-[#f27f0d]"
                    >
                        <option>Tous les terrains</option>
                        <option>Terrain Almadies 1</option>
                        <option>Terrain Mermoz Pro</option>
                    </select>
                    <button className="bg-[#493622] text-white px-4 py-2 rounded-lg hover:bg-[#5d452b] transition-colors flex items-center gap-2">
                        <span className="material-symbols-outlined text-[20px]">filter_list</span>
                        Filtres
                    </button>
                </div>
            </div>

            <div className="bg-[#2c241b] rounded-2xl border border-[#493622] overflow-hidden">
                <div className="grid grid-cols-[2fr_1.5fr_1.5fr_1fr_1fr] gap-4 p-4 border-b border-[#493622] bg-[#231a10]/50 text-[#cbad90] text-sm font-bold uppercase tracking-wider">
                    <div>Client / Détails</div>
                    <div>Terrain</div>
                    <div>Date & Heure</div>
                    <div>Statut</div>
                    <div className="text-right">Action</div>
                </div>

                <div className="flex flex-col">
                    {filteredReservations.map((booking) => (
                        <div key={booking.id} className="grid grid-cols-[2fr_1.5fr_1.5fr_1fr_1fr] gap-4 p-4 items-center hover:bg-[#493622]/30 transition-colors border-b border-[#493622]/50 last:border-0">
                            <div className="flex items-center gap-3">
                                <div className="size-10 rounded-full bg-[#493622] flex items-center justify-center text-[#f27f0d] font-bold">
                                    {booking.initials}
                                </div>
                                <div>
                                    <h4 className="text-white font-medium">{booking.clientName}</h4>
                                    <p className="text-[#cbad90] text-xs">{booking.clientPhone}</p>
                                    {booking.paymentMethod && (
                                        <span className="text-[10px] bg-white/5 text-primary border border-primary/20 px-1.5 py-0.5 rounded mt-1 inline-block font-bold">
                                            {booking.paymentMethod}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="text-white text-sm">{booking.fieldName}</div>
                            <div className="text-[#cbad90] text-sm">
                                <div className="text-white font-bold">{booking.date}</div>
                                <div>{booking.time}</div>
                            </div>
                            <div>
                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${booking.status === 'Payé' || booking.status === 'Confirmé'
                                    ? 'bg-green-500/10 text-green-500 border-green-500/20'
                                    : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                                    }`}>
                                    <span className={`size-1.5 rounded-full ${booking.status === 'Payé' || booking.status === 'Confirmé' ? 'bg-green-500' : 'bg-yellow-500'
                                        }`}></span>
                                    {booking.status}
                                </span>
                            </div>
                            <div className="flex justify-end gap-2">
                                {booking.status === 'En attente de paiement' && (
                                    <button
                                        onClick={() => updateReservationStatus(booking.id, 'Confirmé')}
                                        className="bg-green-500 hover:bg-green-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                                        title="Valider la réservation"
                                    >
                                        <span className="material-symbols-outlined text-[16px]">check_circle</span>
                                        Confirmer
                                    </button>
                                )}
                                {(booking.status === 'Payé' || booking.status === 'Confirmé') && (
                                    <button
                                        onClick={() => handleDownloadTicket(booking)}
                                        className="size-8 flex items-center justify-center rounded-lg hover:bg-primary/20 text-primary transition-colors"
                                        title="Télécharger le ticket"
                                    >
                                        <span className="material-symbols-outlined text-[20px]">download</span>
                                    </button>
                                )}
                                <button className="size-8 flex items-center justify-center rounded-lg hover:bg-[#493622] text-[#cbad90] transition-colors">
                                    <span className="material-symbols-outlined text-[20px]">visibility</span>
                                </button>
                                <button
                                    onClick={() => updateReservationStatus(booking.id, 'Annulé')}
                                    className="size-8 flex items-center justify-center rounded-lg hover:bg-red-500/10 text-red-500/70 hover:text-red-500 transition-all"
                                    title="Annuler"
                                >
                                    <span className="material-symbols-outlined text-[20px]">cancel</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="p-4 border-t border-[#493622] flex justify-center">
                    <button className="text-[#f27f0d] text-sm font-bold hover:underline">Charger plus de réservations</button>
                </div>
            </div>
        </div>
    );
};

export default MyReservations;

