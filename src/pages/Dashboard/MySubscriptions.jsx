import React, { useState, useMemo } from "react";
import { useDashboard } from "../../context/DashboardContext";
import { generateTicket } from "../../utils/ticketGenerator";

// Helper local pour normalisation
const normalizeStatus = (status) => (status || "").toLowerCase();

const getStatusColor = (status) => {
  const s = normalizeStatus(status);
  if (s === "payé" || s === "confirmé" || s === "active" || s === "success")
    return "text-green-500 bg-green-500/10 border-green-500/20";
  if (s === "annulé") return "text-red-500 bg-red-500/10 border-red-500/20";
  return "text-yellow-500 bg-yellow-500/10 border-yellow-500/20";
};

const MySubscriptions = () => {
  const {
    subscriptions = [],
    isLoadingSubscriptions,
    updateSubscriptionStatus,
    archivedIds = [],
    toggleArchiveReservation,
  } = useDashboard();
  const [fieldFilter, setFieldFilter] = useState("Tous les terrains");
  const [statusFilter, setStatusFilter] = useState("Tous les statuts");
  const [showArchived, setShowArchived] = useState(false);
  const [loadingAction, setLoadingAction] = useState(null);
  const [toast, setToast] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const filteredSubscriptions = useMemo(() => {
    return subscriptions.filter((r) => {
      const matchesField =
        fieldFilter === "Tous les terrains" || r?.fieldName === fieldFilter;
      const matchesStatus =
        statusFilter === "Tous les statuts" ||
        normalizeStatus(r?.status) === normalizeStatus(statusFilter);
      const isArchived = archivedIds.includes(String(r?.id));

      if (showArchived) return matchesField && matchesStatus && isArchived;
      return matchesField && matchesStatus && !isArchived;
    });
  }, [subscriptions, fieldFilter, statusFilter, showArchived, archivedIds]);

  const totalPages = Math.ceil(filteredSubscriptions.length / itemsPerPage);
  const paginatedSubscriptions = useMemo(() => {
    return filteredSubscriptions.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage,
    );
  }, [filteredSubscriptions, currentPage]);

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
      showToast("success", `Abonnement mis à jour : ${newStatus}`);
    } catch (error) {
      showToast("error", `Échec : ${error.message}`);
    } finally {
      setLoadingAction(null);
    }
  };

  if (isLoadingSubscriptions) {
    return (
      <div className="h-[400px] flex flex-col items-center justify-center gap-4">
        <div className="size-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
        <p className="text-primary font-bold text-sm uppercase tracking-widest">
          Chargement des abonnements...
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 md:gap-8 relative pb-20">
      {/* Toast notification */}
      {toast && (
        <div
          className={`fixed top-4 md:top-6 right-4 md:right-6 z-[100] px-4 md:px-5 py-2.5 md:py-3 rounded-xl shadow-lg text-xs md:text-sm font-bold flex items-center gap-2 transition-all animate-slide-in ${
            toast.type === "success"
              ? "bg-green-500/90 text-white"
              : "bg-red-500/90 text-white"
          }`}
        >
          <span className="material-symbols-outlined text-[16px] md:text-[18px]">
            {toast.type === "success" ? "check_circle" : "error"}
          </span>
          {toast.message}
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#f27f0d]/10 rounded-lg">
              <span className="material-symbols-outlined text-[#f27f0d] text-2xl">
                autorenew
              </span>
            </div>
            <h2 className="text-white text-2xl md:text-3xl font-bold">
              Mes Abonnements
            </h2>
          </div>
          <p className="text-[#cbad90] text-xs md:text-sm mt-1">
            Gérez vos clients réguliers et leurs créneaux hebdomadaires
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={fieldFilter}
            onChange={(e) => {
              setFieldFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-[#2c241b] text-[#cbad90] border border-[#493622] rounded-lg px-3 md:px-4 py-2 text-sm outline-none focus:border-[#f27f0d] flex-1 md:flex-none"
          >
            <option>Tous les terrains</option>
            {[
              ...new Set(
                subscriptions.map((r) => r?.fieldName).filter(Boolean),
              ),
            ].map((name) => (
              <option key={name}>{name}</option>
            ))}
          </select>

          <button
            onClick={() => {
              setShowArchived(!showArchived);
              setCurrentPage(1);
            }}
            className={`px-3 md:px-4 py-2 rounded-lg transition-all flex items-center justify-center gap-2 font-bold text-xs md:text-sm h-9 md:h-10 ${
              showArchived
                ? "bg-[rgba(242,127,13,0.2)] text-[#f27f0d] border border-[#f27f0d]/30"
                : "bg-[#493622] text-white hover:bg-[#5d452b]"
            }`}
          >
            <span className="material-symbols-outlined text-[18px] md:text-[20px]">
              {showArchived ? "visibility" : "archive"}
            </span>
            <span className="hidden sm:inline">
              {showArchived ? "Actifs" : "Archives"}
            </span>
          </button>
        </div>
      </div>

      {/* Liste des Abonnements en Grille (Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {paginatedSubscriptions.length === 0 ? (
          <div className="col-span-full py-20 bg-[#2c241b]/50 border-2 border-dashed border-[#493622] rounded-3xl flex flex-col items-center justify-center text-center px-6">
            <div className="size-20 rounded-full bg-[#493622]/40 flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-4xl text-[#5d452b]">
                autorenew
              </span>
            </div>
            <h3 className="text-white font-bold text-xl">Aucun abonnement</h3>
            <p className="text-[#cbad90] mt-1">
              Gérez vos clients fidèles et leurs revenus récurrents.
            </p>
          </div>
        ) : (
          paginatedSubscriptions.map((booking) => {
            const status = normalizeStatus(booking.status);
            const isActive = ["payé", "confirmé", "active"].includes(status);
            const isLoading = loadingAction === booking.id;

            return (
              <div
                key={booking.id}
                className={`bg-[#2c241b] rounded-3xl border border-[#493622] hover:border-primary/50 transition-all group overflow-hidden ${isLoading ? "opacity-50 pointer-events-none" : ""}`}
              >
                <div className="p-6 flex flex-col gap-5">
                  {/* Header Card */}
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-black text-lg border border-primary/20">
                        {booking.clientName?.substring(0, 2).toUpperCase()}
                      </div>
                      <div className="flex flex-col">
                        <h4 className="text-white font-bold leading-tight group-hover:text-primary transition-colors">
                          {booking.clientName}
                        </h4>
                        <p className="text-[#cbad90] text-xs opacity-70">
                          {booking.clientPhone}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border ${getStatusColor(booking.status)}`}
                    >
                      {booking.status}
                    </span>
                  </div>

                  {/* Infos Terrain/Temps */}
                  <div className="bg-[#231a10]/50 rounded-2xl p-4 flex flex-col gap-3 border border-[#493622]/50">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-primary text-lg">
                        stadium
                      </span>
                      <p className="text-white text-sm font-medium">
                        {booking.fieldName}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-primary text-lg">
                        schedule
                      </span>
                      <div>
                        <p className="text-white text-sm font-bold uppercase tracking-wider leading-none">
                          Hebdomadaire
                        </p>
                        <p className="text-[#cbad90] text-xs mt-1">
                          {booking.time}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Dates de validité */}
                  <p className="text-[10px] text-[#cbad90] font-bold uppercase tracking-widest px-1">
                    Valide du{" "}
                    {booking.startDate
                      ? new Date(booking.startDate).toLocaleDateString()
                      : "..."}{" "}
                    au{" "}
                    {booking.endDate
                      ? new Date(booking.endDate).toLocaleDateString()
                      : "..."}
                  </p>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-2">
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
                    {status !== "annulé" &&
                      !archivedIds.includes(String(booking.id)) && (
                        <button
                          onClick={() =>
                            handleStatusChange(booking.id, "Annulé")
                          }
                          className="px-4 py-2 bg-red-500/10 text-red-500 text-[11px] font-black uppercase tracking-wider rounded-xl border border-red-500/20 hover:bg-red-500 hover:text-white transition-all active:scale-95"
                        >
                          Annuler
                        </button>
                      )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-6 mt-4">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="size-12 rounded-xl border border-[#493622] bg-[#2c241b] text-white flex items-center justify-center hover:border-primary disabled:opacity-30 transition-all shadow-lg"
          >
            <span className="material-symbols-outlined">chevron_left</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-primary font-black text-lg">
              {currentPage}
            </span>
            <span className="text-[#cbad90] font-bold text-xs uppercase tracking-widest">
              / {totalPages}
            </span>
          </div>

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="size-12 rounded-xl border border-[#493622] bg-[#2c241b] text-white flex items-center justify-center hover:border-primary disabled:opacity-30 transition-all shadow-lg"
          >
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        </div>
      )}
    </div>
  );
};

// Helper Components
const StatusTag = ({ status }) => (
  <span
    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] md:text-xs font-bold border ${
      status === "Payé" || status === "Confirmé"
        ? "bg-green-500/10 text-green-500 border-green-500/20"
        : status === "Annulé"
          ? "bg-red-500/10 text-red-500 border-red-500/20"
          : "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
    }`}
  >
    <span
      className={`size-1.5 rounded-full ${status === "Payé" || status === "Confirmé" ? "bg-green-500" : status === "Annulé" ? "bg-red-500" : "bg-yellow-500"}`}
    ></span>
    {status}
  </span>
);

const ActionButtons = ({
  booking,
  isLoading,
  onStatusChange,
  onDownload,
  onArchive,
  archivedIds,
}) => (
  <>
    {!isLoading &&
      (booking.status === "Payé" ||
        booking.status === "Confirmé" ||
        booking.status === "active") && (
        <button
          onClick={() => onDownload(booking)}
          className="size-8 flex items-center justify-center rounded-lg bg-[#493622] hover:bg-primary/20 text-[#cbad90] hover:text-primary transition-colors"
          title="Télécharger le contrat/ticket"
        >
          <span className="material-symbols-outlined text-[18px] md:text-[20px]">
            download
          </span>
        </button>
      )}
    {!isLoading && booking.status === "En attente de paiement" && (
      <button
        onClick={() => onStatusChange(booking.id, "Confirmé")}
        className="size-8 flex items-center justify-center rounded-lg bg-green-500/10 hover:bg-green-500/20 text-green-500 transition-all shadow-lg border border-green-500/30"
        title="Confirmer l'abonnement"
      >
        <span className="material-symbols-outlined text-[18px] md:text-[20px]">
          check_circle
        </span>
      </button>
    )}
    <button
      onClick={() => onArchive(booking.id)}
      className={`size-8 flex items-center justify-center rounded-lg transition-all ${
        archivedIds.includes(String(booking.id))
          ? "bg-[#f27f0d]/20 text-[#f27f0d]"
          : "bg-[#493622] hover:bg-[#5d452b] text-[#cbad90] hover:text-white"
      }`}
    >
      <span className="material-symbols-outlined text-[18px] md:text-[20px]">
        {archivedIds.includes(String(booking.id))
          ? "visibility"
          : "visibility_off"}
      </span>
    </button>
  </>
);

export default MySubscriptions;
