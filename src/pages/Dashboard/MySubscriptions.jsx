import React, { useState } from 'react';
import { useDashboard } from '../../context/DashboardContext';
import { generateTicket } from '../../utils/ticketGenerator';

const MySubscriptions = () => {
    const { subscriptions, isLoadingSubscriptions, updateSubscriptionStatus, archivedIds, toggleArchiveReservation } = useDashboard();
    const [fieldFilter, setFieldFilter] = useState('Tous les terrains');
    const [statusFilter, setStatusFilter] = useState('Tous les statuts');
    const [showArchived, setShowArchived] = useState(false);
    const [loadingAction, setLoadingAction] = useState(null);
    const [toast, setToast] = useState(null);
    const [visibleCount, setVisibleCount] = useState(10);


    const filteredSubscriptions = subscriptions.filter(r => {
        const matchesField = fieldFilter === 'Tous les terrains' || r.fieldName === fieldFilter;
        const matchesStatus = statusFilter === 'Tous les statuts' || r.status === statusFilter;
        const isArchived = archivedIds.includes(String(r.id));

        if (showArchived) return matchesField && matchesStatus && isArchived;
        return matchesField && matchesStatus && !isArchived;
    });

    const paginatedSubscriptions = filteredSubscriptions.slice(0, visibleCount);

    const handleDownloadTicket = (booking) => {
        generateTicket(booking);
    };

    const showToast = (type, message) => {
        setToast({ type, message });
        setTimeout(() => setToast(null), 4000);
    };

    const handleStatusChange = async (bookingId, newStatus) => {
        setLoadingAction(bookingId);
        try {
            await updateSubscriptionStatus(bookingId, newStatus);
            showToast('success', `Abonnement mis à jour : ${newStatus}`);
        } catch (error) {
            showToast('error', `Échec : ${error.message}`);
        } finally {
            setLoadingAction(null);
        }
    };

    if (isLoadingSubscriptions) {
        return <div className="h-[400px] flex items-center justify-center text-primary font-bold">Chargement des abonnements...</div>;
    }

    return (
        <div className="flex flex-col gap-6 md:gap-8 relative pb-20">
            {/* Toast notification */}
            {toast && (
                <div className={`fixed top-4 md:top-6 right-4 md:right-6 z-[100] px-4 md:px-5 py-2.5 md:py-3 rounded-xl shadow-lg text-xs md:text-sm font-bold flex items-center gap-2 transition-all animate-slide-in ${toast.type === 'success'
                    ? 'bg-green-500/90 text-white'
                    : 'bg-red-500/90 text-white'
                    }`}>
                    <span className="material-symbols-outlined text-[16px] md:text-[18px]">
                        {toast.type === 'success' ? 'check_circle' : 'error'}
                    </span>
                    {toast.message}
                </div>
            )}

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex flex-col">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-[#f27f0d]/10 rounded-lg">
                            <span className="material-symbols-outlined text-[#f27f0d] text-2xl">autorenew</span>
                        </div>
                        <h2 className="text-white text-2xl md:text-3xl font-bold">Mes Abonnements</h2>
                    </div>
                    <p className="text-[#cbad90] text-xs md:text-sm mt-1">
                        Gérez vos clients réguliers et leurs créneaux hebdomadaires
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <select
                        value={fieldFilter}
                        onChange={(e) => { setFieldFilter(e.target.value); setVisibleCount(10); }}
                        className="bg-[#2c241b] text-[#cbad90] border border-[#493622] rounded-lg px-3 md:px-4 py-2 text-sm outline-none focus:border-[#f27f0d] flex-1 md:flex-none"
                    >
                        <option>Tous les terrains</option>
                        {[...new Set(subscriptions.map(r => r.fieldName))].map(name => (
                            <option key={name}>{name}</option>
                        ))}
                    </select>

                    <button
                        onClick={() => setShowArchived(!showArchived)}
                        className={`px-3 md:px-4 py-2 rounded-lg transition-all flex items-center justify-center gap-2 font-bold text-xs md:text-sm h-9 md:h-10 ${showArchived
                            ? 'bg-[rgba(242,127,13,0.2)] text-[#f27f0d] border border-[#f27f0d]/30'
                            : 'bg-[#493622] text-white hover:bg-[#5d452b]'
                            }`}
                    >
                        <span className="material-symbols-outlined text-[18px] md:text-[20px]">
                            {showArchived ? 'visibility' : 'archive'}
                        </span>
                        <span className="hidden sm:inline">{showArchived ? 'Actifs' : 'Archives'}</span>
                    </button>
                </div>
            </div>

            {/* Desktop Table View */}
            <div className="hidden lg:block bg-[#2c241b] rounded-2xl border border-[#493622] overflow-hidden shadow-xl">
                <div className="grid grid-cols-[1.5fr_1fr_1.2fr_1fr_1fr] gap-4 p-4 border-b border-[#493622] bg-[#231a10]/50 text-[#cbad90] text-sm font-bold uppercase tracking-wider">
                    <div>Client régulier</div>
                    <div>Terrain</div>
                    <div>Jour & Créneau</div>
                    <div>Statut</div>
                    <div className="text-right">Action</div>
                </div>

                <div className="flex flex-col">
                    {paginatedSubscriptions.length === 0 && (
                        <div className="p-12 text-center flex flex-col items-center gap-4">
                            <div className="size-16 rounded-full bg-[#493622]/30 flex items-center justify-center">
                                <span className="material-symbols-outlined text-4xl text-[#493622]">autorenew</span>
                            </div>
                            <p className="text-[#cbad90]">Aucun abonnement trouvé.</p>
                        </div>
                    )}
                    {paginatedSubscriptions.map((booking) => {
                        const isLoading = loadingAction === booking.id;
                        return (
                            <div key={booking.id} className={`grid grid-cols-[1.5fr_1fr_1.2fr_1fr_1fr] gap-4 p-4 items-center hover:bg-[#493622]/30 transition-colors border-b border-[#493622]/50 last:border-0 ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}>
                                <div className="flex items-center gap-3">
                                    <div className="size-10 rounded-full bg-[#f27f0d]/10 flex items-center justify-center text-[#f27f0d] font-bold shrink-0 border border-[#f27f0d]/20">
                                        {booking.initials}
                                    </div>
                                    <div className="min-w-0">
                                        <h4 className="text-white font-medium truncate">{booking.clientName}</h4>
                                        <p className="text-[#cbad90] text-xs">{booking.clientPhone}</p>
                                    </div>
                                </div>
                                <div className="text-white text-sm truncate">{booking.fieldName}</div>
                                <div className="text-[#cbad90] text-sm">
                                    <div className="text-primary font-bold">Hebdomadaire</div>
                                    <div className="text-white text-xs">{booking.time}</div>
                                    <div className="text-[10px] opacity-70 mt-1">
                                        Du {new Date(booking.startDate).toLocaleDateString()} au {new Date(booking.endDate).toLocaleDateString()}
                                    </div>
                                </div>
                                <div>
                                    <StatusTag status={booking.status} />
                                </div>
                                <div className="flex justify-end gap-2">
                                    <ActionButtons
                                        booking={booking}
                                        isLoading={isLoading}
                                        onStatusChange={handleStatusChange}
                                        onDownload={handleDownloadTicket}
                                        onArchive={toggleArchiveReservation}
                                        archivedIds={archivedIds}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Mobile/Tablet Card View */}
            <div className="lg:hidden flex flex-col gap-4">
                {paginatedSubscriptions.length === 0 && (
                    <div className="bg-[#2c241b] rounded-2xl p-8 border border-[#493622] text-center text-[#cbad90]">
                        Aucun abonnement trouvé.
                    </div>
                )}
                {paginatedSubscriptions.map((booking) => {
                    const isLoading = loadingAction === booking.id;
                    return (
                        <div key={booking.id} className={`bg-[#2c241b] rounded-2xl p-4 border border-[#493622] flex flex-col gap-4 ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="size-10 rounded-full bg-[#f27f0d]/10 flex items-center justify-center text-[#f27f0d] font-bold border border-[#f27f0d]/20">
                                        {booking.initials}
                                    </div>
                                    <div>
                                        <h4 className="text-white font-bold">{booking.clientName}</h4>
                                        <p className="text-[#cbad90] text-xs">{booking.clientPhone}</p>
                                    </div>
                                </div>
                                <StatusTag status={booking.status} />
                            </div>

                            <div className="grid grid-cols-2 gap-4 py-3 border-y border-[#493622]/50">
                                <div>
                                    <p className="text-[10px] text-[#cbad90] uppercase font-bold tracking-wider mb-1">Terrain</p>
                                    <p className="text-white text-sm font-medium">{booking.fieldName}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-[#cbad90] uppercase font-bold tracking-wider mb-1">Planning</p>
                                    <p className="text-primary text-xs font-bold uppercase">Hebdomadaire</p>
                                    <p className="text-white text-xs font-bold">{booking.time}</p>
                                </div>
                            </div>

                            <div className="flex items-center justify-end">
                                <div className="flex gap-2">
                                    <ActionButtons
                                        booking={booking}
                                        isLoading={isLoading}
                                        onStatusChange={handleStatusChange}
                                        onDownload={handleDownloadTicket}
                                        onArchive={toggleArchiveReservation}
                                        archivedIds={archivedIds}
                                    />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {filteredSubscriptions.length > visibleCount && (
                <div className="p-4 flex justify-center mt-4">
                    <button
                        onClick={() => setVisibleCount(prev => prev + 10)}
                        className="text-[#f27f0d] text-sm font-bold hover:underline bg-[#f27f0d]/10 px-8 py-2.5 rounded-full border border-[#f27f0d]/20 transition-all hover:bg-[#f27f0d]/20 flex items-center gap-2"
                    >
                        <span className="material-symbols-outlined text-[18px]">add</span>
                        Charger plus
                    </button>
                </div>
            )}
        </div>
    );
};

// Helper Components
const StatusTag = ({ status }) => (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] md:text-xs font-bold border ${status === 'Payé' || status === 'Confirmé'
        ? 'bg-green-500/10 text-green-500 border-green-500/20'
        : status === 'Annulé'
            ? 'bg-red-500/10 text-red-500 border-red-500/20'
            : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
        }`}>
        <span className={`size-1.5 rounded-full ${status === 'Payé' || status === 'Confirmé' ? 'bg-green-500' : status === 'Annulé' ? 'bg-red-500' : 'bg-yellow-500'}`}></span>
        {status}
    </span>
);

const ActionButtons = ({ booking, isLoading, onStatusChange, onDownload, onArchive, archivedIds }) => (
    <>
        {!isLoading && (booking.status === 'Payé' || booking.status === 'Confirmé' || booking.status === 'active') && (
            <button
                onClick={() => onDownload(booking)}
                className="size-8 flex items-center justify-center rounded-lg bg-[#493622] hover:bg-primary/20 text-[#cbad90] hover:text-primary transition-colors"
                title="Télécharger le contrat/ticket"
            >
                <span className="material-symbols-outlined text-[18px] md:text-[20px]">download</span>
            </button>
        )}
        {!isLoading && booking.status === 'En attente de paiement' && (
            <button
                onClick={() => onStatusChange(booking.id, 'Confirmé')}
                className="size-8 flex items-center justify-center rounded-lg bg-green-500/10 hover:bg-green-500/20 text-green-500 transition-all shadow-lg border border-green-500/30"
                title="Confirmer l'abonnement"
            >
                <span className="material-symbols-outlined text-[18px] md:text-[20px]">check_circle</span>
            </button>
        )}
        <button
            onClick={() => onArchive(booking.id)}
            className={`size-8 flex items-center justify-center rounded-lg transition-all ${archivedIds.includes(String(booking.id))
                ? 'bg-[#f27f0d]/20 text-[#f27f0d]'
                : 'bg-[#493622] hover:bg-[#5d452b] text-[#cbad90] hover:text-white'
                }`}
        >
            <span className="material-symbols-outlined text-[18px] md:text-[20px]">
                {archivedIds.includes(String(booking.id)) ? 'visibility' : 'visibility_off'}
            </span>
        </button>
        {!isLoading && booking.status !== 'Annulé' && !archivedIds.includes(String(booking.id)) && (
            <button
                onClick={() => onStatusChange(booking.id, 'Annulé')}
                className="size-8 flex items-center justify-center rounded-lg bg-[#493622] hover:bg-red-500/20 text-red-500/70 hover:text-red-500 transition-all"
                title="Annuler l'abonnement"
            >
                <span className="material-symbols-outlined text-[18px] md:text-[20px]">cancel</span>
            </button>
        )}
    </>
);

export default MySubscriptions;
