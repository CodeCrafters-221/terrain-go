import React, { useState, useEffect } from 'react';
import { ReservationService } from '../../services/ReservationService';
import { toast } from 'react-toastify';
import { Calendar, Timer, User, MapPin } from 'lucide-react';

import OwnerReservationModal from '../../components/Dashboard/OwnerReservationModal';

const Reservations = () => {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        loadReservations();
    }, []);

    const loadReservations = async () => {
        try {
            setLoading(true);
            const data = await ReservationService.getOwnerReservations();
            setReservations(data);
        } catch (error) {
            console.error(error);
            // toast.error("Erreur chargement réservations");
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (data) => {
        try {
            await ReservationService.createManualReservation(data);
            toast.success("Réservation ajoutée !");
            loadReservations();
        } catch (error) {
            console.error(error);
            toast.error("Erreur création réservation");
        }
    };

    const handleCancel = async (id) => {
        if (window.confirm("Voulez-vous vraiment annuler cette réservation ?")) {
            try {
                await ReservationService.cancelReservation(id);
                setReservations(prev => prev.filter(r => r.id !== id));
                toast.success("Réservation annulée");
            } catch (e) {
                toast.error("Erreur lors de l'annulation");
            }
        }
    };

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-white text-3xl font-bold">Réservations</h1>
                    <p className="text-[#cbad90] text-sm mt-1">Suivez les matchs à venir et l'historique.</p>
                </div>
                <button
                    className="bg-[#f27f0d] text-[#231a10] px-6 py-3 rounded-full font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2 cursor-pointer"
                    onClick={() => setIsModalOpen(true)}
                >
                    <span className="material-symbols-outlined">add</span>
                    Nouvelle Réservation
                </button>
            </div>

            {loading ? (
                <div className="text-white text-center py-20">Chargement...</div>
            ) : reservations.length === 0 ? (
                <div className="text-center py-20 bg-[#2c241b] rounded-2xl border border-[#493622]">
                    <div className="size-16 bg-[#231a10] rounded-full flex items-center justify-center mx-auto mb-4 text-[#cbad90]">
                        <Calendar size={32} />
                    </div>
                    <h3 className="text-white text-xl font-bold">Aucune réservation</h3>
                    <p className="text-[#cbad90] mt-2">Votre calendrier est vide pour le moment.</p>
                </div>
            ) : (
                <div className="bg-[#2c241b] rounded-2xl border border-[#493622] overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-[#493622] text-[#cbad90] text-sm uppercase tracking-wider">
                                    <th className="p-4 font-semibold">Date & Heure</th>
                                    <th className="p-4 font-semibold">Terrain</th>
                                    <th className="p-4 font-semibold">Client</th>
                                    <th className="p-4 font-semibold">Statut</th>
                                    <th className="p-4 font-semibold text-right">Prix</th>
                                    <th className="p-4 font-semibold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#493622]">
                                {reservations.map((res) => (
                                    <tr key={res.id} className="text-white hover:bg-[#342618] transition-colors group">
                                        <td className="p-4">
                                            <div className="flex flex-col">
                                                <span className="font-bold flex items-center gap-2">
                                                    <Calendar size={14} className="text-[#f27f0d]" />
                                                    {new Date(res.date).toLocaleDateString()}
                                                </span>
                                                <span className="text-sm text-[#cbad90] flex items-center gap-2 mt-1">
                                                    <Timer size={14} />
                                                    {res.startTime?.slice(0, 5)} - {res.endTime?.slice(0, 5)}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                <MapPin size={16} className="text-[#cbad90]" />
                                                <span>{res.terrainName}</span>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex flex-col">
                                                <span className="font-medium flex items-center gap-2">
                                                    <User size={16} className={res.isManual ? "text-blue-400" : "text-[#f27f0d]"} />
                                                    {res.clientName}
                                                </span>
                                                <span className="text-xs text-[#cbad90]">{res.clientPhone}</span>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${res.status === 'Confirmé' ? 'bg-green-500/20 text-green-500' :
                                                res.status === 'Annulé' ? 'bg-red-500/20 text-red-500' :
                                                    'bg-yellow-500/20 text-yellow-500'
                                                }`}>
                                                {res.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right font-bold font-mono text-[#f27f0d]">
                                            {res.price?.toLocaleString()} F
                                        </td>
                                        <td className="p-4 text-right">
                                            <button
                                                onClick={() => handleCancel(res.id)}
                                                className="text-red-400 hover:text-red-300 hover:bg-red-900/20 p-2 rounded transition-colors"
                                                title="Annuler"
                                            >
                                                <span className="material-symbols-outlined text-[20px]">block</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            <OwnerReservationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleCreate}
            />
        </div>
    );
};

export default Reservations;
