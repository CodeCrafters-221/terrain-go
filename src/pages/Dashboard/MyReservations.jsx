import React, { useState } from 'react';
import { useDashboard } from '../../context/DashboardContext';
import { generateTicket } from '../../utils/ticketGenerator';

const MyReservations = () => {
    const { reservations, updateReservationStatus, archivedIds, toggleArchiveReservation } = useDashboard();
    const [fieldFilter, setFieldFilter] = useState('Tous les terrains');
    const [statusFilter, setStatusFilter] = useState('Tous les statuts');
    const [timeFilter, setTimeFilter] = useState('À venir'); // 'Toutes', 'À venir', 'Passées'
    const [showArchived, setShowArchived] = useState(false);
    const [loadingAction, setLoadingAction] = useState(null);
    const [toast, setToast] = useState(null);
    const [visibleCount, setVisibleCount] = useState(10);

    const todayStr = new Date().toISOString().split('T')[0];
    const today = new Date(todayStr);

    const filteredReservations = reservations.filter(r => {
        const matchesField = fieldFilter === 'Tous les terrains' || r.fieldName === fieldFilter;
        const matchesStatus = statusFilter === 'Tous les statuts' || r.status === statusFilter;
        const isArchived = archivedIds.includes(String(r.id));

        const rDate = new Date(r.originalDate);
        const matchesTime =
            timeFilter === 'Toutes' ? true :
                timeFilter === 'À venir' ? rDate >= today :
                    rDate < today;

        const isSingle = r.reservationType === 'single';

        if (showArchived) return matchesField && matchesStatus && matchesTime && isArchived && isSingle;
        return matchesField && matchesStatus && matchesTime && !isArchived && isSingle;
    });

    const paginatedReservations = filteredReservations.slice(0, visibleCount);

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
            await updateReservationStatus(bookingId, newStatus);
            showToast('success', newStatus === 'Confirmé'
                ? 'Réservation confirmée!'
                : `Statut mis à jour : ${newStatus}`);
        } catch (error) {
            showToast('error', `Échec : ${error.message}`);
        } finally {
            setLoadingAction(null);
        }
    };

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
                    <h2 className="text-white text-2xl md:text-3xl font-bold">Mes Réservations</h2>
                    <p className="text-[#cbad90] text-xs md:text-sm mt-1">
                        {filteredReservations.length} réservation(s) correspond(ent) à vos filtres
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <select
                        value={timeFilter}
                        onChange={(e) => { setTimeFilter(e.target.value); setVisibleCount(10); }}
                        className="bg-[#493622] text-white border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#f27f0d]"
                    >
                        <option value="À venir">À venir</option>
                        <option value="Passées">Passées</option>
                        <option value="Toutes">Toutes</option>
                    </select>

                    <select
                        value={fieldFilter}
                        onChange={(e) => { setFieldFilter(e.target.value); setVisibleCount(10); }}
                        className="bg-[#2c241b] text-[#cbad90] border border-[#493622] rounded-lg px-3 md:px-4 py-2 text-sm outline-none focus:border-[#f27f0d] flex-1 md:flex-none"
                    >
                        <option>Tous les terrains</option>
                        {[...new Set(reservations.map(r => r.fieldName))].map(name => (
                            <option key={name}>{name}</option>
                        ))}
                    </select>

                    <select
                        value={statusFilter}
                        onChange={(e) => { setStatusFilter(e.target.value); setVisibleCount(10); }}
                        className="bg-[#2c241b] text-[#cbad90] border border-[#493622] rounded-lg px-3 md:px-4 py-2 text-sm outline-none focus:border-[#f27f0d] flex-1 md:flex-none"
                    >
                        <option>Tous les statuts</option>
                        <option>En attente de paiement</option>
                        <option>Confirmé</option>
                        <option>Payé</option>
                        <option>Annulé</option>
                    </select>

                    <button
                        onClick={() => setShowArchived(!showArchived)}
                        className={`px-3 md:px-4 py-2 rounded-lg transition-all flex items-center justify-center gap-2 font-bold text-xs md:text-sm h-9 md:h-10 ${showArchived
                            ? 'bg-[rgba(242,127,13,0.2)] text-[#f27f0d] border border-[#f27f0d]/30'
                            : 'bg-[#493622] text-white hover:bg-[#5d452b]'
                            }`}
                        title={showArchived ? "Voir les réservations actives" : "Voir les archives"}
                    >
                        <span className="material-symbols-outlined text-[18px] md:text-[20px]">
                            {showArchived ? 'visibility' : 'archive'}
                        </span>
                        <span className="hidden sm:inline">{showArchived ? 'Actives' : 'Archives'}</span>
                    </button>
                </div>
            </div>

            {/* Desktop Table View */}
            <div className="hidden lg:block bg-[#2c241b] rounded-2xl border border-[#493622] overflow-hidden">
                <div className="grid grid-cols-[1.5fr_1fr_1.2fr_1fr_1fr] gap-4 p-4 border-b border-[#493622] bg-[#231a10]/50 text-[#cbad90] text-sm font-bold uppercase tracking-wider">
                    <div>Client / Détails</div>
                    <div>Terrain</div>
                    <div>Date & Heure</div>
                    <div>Statut</div>
                    <div className="text-right">Action</div>
                </div>

                <div className="flex flex-col">
                    {paginatedReservations.length === 0 && (
                        <div className="p-8 text-center text-[#cbad90]">
                            Aucune réservation trouvée dans cette catégorie.
                        </div>
                    )}
                    {paginatedReservations.map((booking) => {
                        const isLoading = loadingAction === booking.id;
                        const isPast = new Date(booking.originalDate) < today;
                        return (
                            <div key={booking.id} className={`grid grid-cols-[1.5fr_1fr_1.2fr_1fr_1fr] gap-4 p-4 items-center hover:bg-[#493622]/30 transition-colors border-b border-[#493622]/50 last:border-0 ${isLoading ? 'opacity-50 pointer-events-none' : ''} ${isPast ? 'opacity-60 grayscale-[0.3]' : ''}`}>
                                <div className="flex items-center gap-3">
                                    <div className="size-10 rounded-full bg-[#493622] flex items-center justify-center text-[#f27f0d] font-bold shrink-0">
                                        {booking.initials}
                                    </div>
                                    <div className="min-w-0">
                                        <h4 className="text-white font-medium truncate">{booking.clientName}</h4>
                                        <p className="text-[#cbad90] text-xs">{booking.clientPhone}</p>
                                        {booking.paymentMethod && (
                                            <span className="text-[10px] bg-white/5 text-primary border border-primary/20 px-1.5 py-0.5 rounded mt-1 inline-block font-bold">
                                                {booking.paymentMethod}
                                            </span>
                                        )}
                                        {booking.reservationType === 'subscription' && (
                                            <span className="text-[10px] bg-primary/10 text-primary border border-primary/20 px-1.5 py-0.5 rounded mt-1 ml-1 inline-block font-bold uppercase">
                                                Abonnement
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="text-white text-sm truncate">{booking.fieldName}</div>
                                <div className="text-[#cbad90] text-sm">
                                    <div className="text-white font-bold">{booking.date}</div>
                                    <div>{booking.time}</div>
                                </div>
                                <div>
                                    <StatusTag status={booking.status} isPast={isPast} />
                                </div>
                                <div className="flex justify-end gap-2">
                                    <ActionButtons
                                        booking={booking}
                                        isLoading={isLoading}
                                        isPast={isPast}
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
                {paginatedReservations.length === 0 && (
                    <div className="bg-[#2c241b] rounded-2xl p-8 border border-[#493622] text-center text-[#cbad90]">
                        Aucune réservation trouvée.
                    </div>
                )}
                {paginatedReservations.map((booking) => {
                    const isLoading = loadingAction === booking.id;
                    const isPast = new Date(booking.originalDate) < today;
                    return (
                        <div key={booking.id} className={`bg-[#2c241b] rounded-2xl p-4 border border-[#493622] flex flex-col gap-4 ${isLoading ? 'opacity-50 pointer-events-none' : ''} ${isPast ? 'opacity-70 grayscale-[0.2]' : ''}`}>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="size-10 rounded-full bg-[#493622] flex items-center justify-center text-[#f27f0d] font-bold">
                                        {booking.initials}
                                    </div>
                                    <div>
                                        <h4 className="text-white font-bold">{booking.clientName}</h4>
                                        <p className="text-[#cbad90] text-xs">{booking.clientPhone}</p>
                                        {booking.reservationType === 'subscription' && (
                                            <span className="text-[8px] bg-primary/10 text-primary border border-primary/20 px-1.5 py-0.5 rounded mt-1 inline-block font-bold uppercase">
                                                Abonnement
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <StatusTag status={booking.status} isPast={isPast} />
                            </div>

                            <div className="grid grid-cols-2 gap-4 py-3 border-y border-[#493622]/50">
                                <div>
                                    <p className="text-[10px] text-[#cbad90] uppercase font-bold tracking-wider mb-1">Terrain</p>
                                    <p className="text-white text-sm font-medium">{booking.fieldName}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-[#cbad90] uppercase font-bold tracking-wider mb-1">Date & Heure</p>
                                    <p className="text-white text-sm font-bold">{booking.date}</p>
                                    <p className="text-[#cbad90] text-xs">{booking.time}</p>
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                {booking.paymentMethod && (
                                    <span className="text-[10px] bg-white/5 text-primary border border-primary/20 px-2 py-0.5 rounded font-bold uppercase tracking-tight">
                                        {booking.paymentMethod}
                                    </span>
                                )}
                                <div className="flex gap-2 ml-auto">
                                    <ActionButtons
                                        booking={booking}
                                        isLoading={isLoading}
                                        isPast={isPast}
                                        onStatusChange={handleStatusChange}
                                        onDownload={handleDownloadTicket}
                                        onArchive={toggleArchiveReservation}
                                        archivedIds={archivedIds}
                                        isMobile
                                    />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {(filteredReservations.length > visibleCount || visibleCount > 10) && (
                <div className="p-4 flex flex-wrap justify-center items-center gap-4 md:gap-6 mt-4">
                    {filteredReservations.length > visibleCount && (
                        <button
                            onClick={() => setVisibleCount(prev => prev + 10)}
                            className="text-[#f27f0d] text-sm font-bold hover:underline bg-[#f27f0d]/10 px-8 py-2.5 rounded-full border border-[#f27f0d]/20 transition-all hover:bg-[#f27f0d]/20 flex items-center gap-2"
                        >
                            <span className="material-symbols-outlined text-[18px]">add</span>
                            Charger plus
                        </button>
                    )}

                    {visibleCount > 10 && (
                        <button
                            onClick={() => setVisibleCount(10)}
                            className="text-[#cbad90] hover:text-white text-sm font-bold bg-white/5 px-8 py-2.5 rounded-full border border-white/10 transition-all flex items-center gap-2"
                        >
                            <span className="material-symbols-outlined text-[18px]">keyboard_arrow_up</span>
                            Voir moins
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

// Helper Components for cleaner code
const StatusTag = ({ status, isPast }) => {
    let label = status;
    if (isPast && (status === 'Payé' || status === 'Confirmé')) {
        label = 'Traité';
    }

    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] md:text-xs font-bold border ${status === 'Payé' || status === 'Confirmé'
            ? 'bg-green-500/10 text-green-500 border-green-500/20'
            : status === 'Annulé'
                ? 'bg-red-500/10 text-red-500 border-red-500/20'
                : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
            }`}>
            <span className={`size-1.5 rounded-full ${status === 'Payé' || status === 'Confirmé'
                ? 'bg-green-500'
                : status === 'Annulé'
                    ? 'bg-red-500'
                    : 'bg-yellow-500'
                }`}></span>
            {label}
        </span>
    );
};

const ActionButtons = ({ booking, isLoading, isPast, onStatusChange, onDownload, onArchive, archivedIds, isMobile }) => (
    <>
        {isLoading && (
            <div className="flex items-center gap-2 text-[#cbad90] text-xs">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
            </div>
        )}
        {!isLoading && !isPast && (booking.status === 'En attente de paiement' || booking.status === 'En attente') && (
            <button
                onClick={() => onStatusChange(booking.id, 'Confirmé')}
                className="bg-green-500 hover:bg-green-600 text-white text-[10px] md:text-xs font-bold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 shadow-lg border border-white/10"
                title="Valider la réservation"
            >
                <span className="material-symbols-outlined text-[16px]">check_circle</span>
                {isMobile ? 'Valider' : 'Confirmer'}
            </button>
        )}
        {(booking.status === 'Payé' || booking.status === 'Confirmé') && (
            <button
                onClick={() => onDownload(booking)}
                className="size-8 flex items-center justify-center rounded-lg bg-[#493622] hover:bg-primary/20 text-[#cbad90] hover:text-primary transition-colors"
                title="Télécharger le ticket"
            >
                <span className="material-symbols-outlined text-[18px] md:text-[20px]">download</span>
            </button>
        )}
        <button
            onClick={() => onArchive(booking.id)}
            className={`size-8 flex items-center justify-center rounded-lg transition-all ${archivedIds.includes(String(booking.id))
                ? 'bg-[#f27f0d]/20 text-[#f27f0d] shadow-[0_0_10px_rgba(242,127,13,0.1)]'
                : 'bg-[#493622] hover:bg-[#5d452b] text-[#cbad90] hover:text-white'
                }`}
            title={archivedIds.includes(String(booking.id)) ? "Désarchiver" : "Archiver / Cacher"}
        >
            <span className="material-symbols-outlined text-[18px] md:text-[20px]">
                {archivedIds.includes(String(booking.id)) ? 'visibility' : 'visibility_off'}
            </span>
        </button>
        {!isLoading && !isPast && booking.status !== 'Annulé' && !archivedIds.includes(String(booking.id)) && (
            <button
                onClick={() => onStatusChange(booking.id, 'Annulé')}
                className="size-8 flex items-center justify-center rounded-lg bg-[#493622] hover:bg-red-500/20 text-red-500/70 hover:text-red-500 transition-all"
                title="Annuler"
            >
                <span className="material-symbols-outlined text-[18px] md:text-[20px]">cancel</span>
            </button>
        )}
    </>
);

export default MyReservations;
