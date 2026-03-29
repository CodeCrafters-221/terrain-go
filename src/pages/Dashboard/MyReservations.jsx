import React, { useState, useMemo } from "react";
import { useDashboard } from "../../context/DashboardContext";
import { generateTicket } from "../../utils/ticketGenerator";

const normalizeStatus = (status) => (status || "").toLowerCase();
const getStatusColor = (status) => {
  const s = normalizeStatus(status);
  if (s === "payé" || s === "confirmé" || s === "active")
    return "text-green-500 bg-green-500/10 border-green-500/20";
  if (s === "annulé") return "text-red-500 bg-red-500/10 border-red-500/20";
  return "text-yellow-500 bg-yellow-500/10 border-yellow-500/20";
};

const MyReservations = () => {
  const {
    subscriptions = [],
    isLoadingSubscriptions,
    updateSubscriptionStatus,
    archivedIds = [],
    toggleArchiveReservation,
  } = useDashboard();

  const [fieldFilter, setFieldFilter] = useState("Tous les terrains");
  const [showArchived, setShowArchived] = useState(false);
  const [loadingAction, setLoadingAction] = useState(null);
  const [toast, setToast] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const filteredSubscriptions = useMemo(() => {
    return subscriptions.filter((r) => {
      const matchesField =
        fieldFilter === "Tous les terrains" || r.fieldName === fieldFilter;
      const isArchived = archivedIds.includes(String(r.id));

      return showArchived
        ? matchesField && isArchived
        : matchesField && !isArchived;
    });
  }, [subscriptions, fieldFilter, showArchived, archivedIds]);

  const totalPages = Math.ceil(filteredSubscriptions.length / itemsPerPage);
  const paginatedSubscriptions = useMemo(() => {
    return filteredSubscriptions.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage,
    );
  }, [filteredSubscriptions, currentPage]);

  const handleDownloadTicket = (booking) => generateTicket(booking);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const handleStatusChange = async (id, status) => {
    setLoadingAction(id);
    try {
      await updateSubscriptionStatus(id, status);
      showToast("success", `Mis à jour : ${status}`);
    } catch (e) {
      showToast("error", e.message);
    } finally {
      setLoadingAction(null);
    }
  };

  if (isLoadingSubscriptions) {
    return (
      <div className="h-[400px] flex flex-col items-center justify-center gap-4">
        <div className="size-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
        <p className="text-primary font-bold text-sm uppercase tracking-widest">
          Chargement des réservations...
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 pb-20 relative">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-6 right-6 z-[100] px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-right-10 duration-300 ${
            toast.type === "success"
              ? "bg-green-600 text-white"
              : "bg-red-600 text-white"
          }`}
        >
          <span className="material-symbols-outlined">
            {toast.type === "success" ? "check_circle" : "error"}
          </span>
          <p className="text-sm font-bold">{toast.message}</p>
        </div>
      )}

      {/* Header & Filtres */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex flex-col">
          <h2 className="text-white text-3xl font-black italic tracking-tight">
            Mes Réservations
          </h2>
          <p className="text-[#cbad90] text-sm mt-1">
            Gérez vos créneaux et accueillez vos joueurs
          </p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={fieldFilter}
            onChange={(e) => {
              setFieldFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-[#2c241b] text-[#cbad90] border border-[#493622] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary flex-1 md:flex-none transition-all"
          >
            <option>Tous les terrains</option>
            {[...new Set(subscriptions.map((r) => r.fieldName))].map((name) => (
              <option key={name}>{name}</option>
            ))}
          </select>
          <button
            onClick={() => {
              setShowArchived(!showArchived);
              setCurrentPage(1);
            }}
            className={`size-11 flex items-center justify-center rounded-xl border transition-all ${
              showArchived
                ? "bg-primary text-[#231a10] border-primary"
                : "bg-[#2c241b] text-[#cbad90] border-[#493622] hover:border-primary/50"
            }`}
            title={showArchived ? "Voir les actives" : "Voir les archives"}
          >
            <span className="material-symbols-outlined">
              {showArchived ? "visibility" : "inventory_2"}
            </span>
          </button>
        </div>
      </div>

      {/* Liste des Réservations */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {paginatedSubscriptions.length === 0 ? (
          <div className="col-span-full py-20 bg-[#2c241b]/50 border-2 border-dashed border-[#493622] rounded-3xl flex flex-col items-center justify-center text-center px-6">
            <div className="size-20 rounded-full bg-[#493622]/40 flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-4xl text-[#5d452b]">
                event_busy
              </span>
            </div>
            <h3 className="text-white font-bold text-xl">Aucune réservation</h3>
            <p className="text-[#cbad90] mt-1">
              Vous n'avez pas de réservations correspondant à ces critères.
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
                        <p className="text-[#cbad90] text-[11px] font-mono opacity-60">
                          ID: {booking.id.toString().substring(0, 8)}
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
                      <p className="text-white text-sm font-medium">
                        {booking.time || "Créneau non défini"}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex gap-2">
                      {isActive && (
                        <button
                          onClick={() => handleDownloadTicket(booking)}
                          className="size-10 flex items-center justify-center rounded-xl bg-[#493622] text-[#cbad90] hover:text-white hover:bg-primary transition-all"
                          title="Télécharger le ticket"
                        >
                          <span className="material-symbols-outlined text-[20px]">
                            download
                          </span>
                        </button>
                      )}
                      <button
                        onClick={() => toggleArchiveReservation(booking.id)}
                        className={`size-10 flex items-center justify-center rounded-xl transition-all ${
                          archivedIds.includes(String(booking.id))
                            ? "bg-primary text-[#231a10]"
                            : "bg-[#493622] text-[#cbad90] hover:bg-[#5d452b] hover:text-white"
                        }`}
                        title="Archiver / Désarchiver"
                      >
                        <span className="material-symbols-outlined text-[20px]">
                          {archivedIds.includes(String(booking.id))
                            ? "visibility"
                            : "archive"}
                        </span>
                      </button>
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

export default MyReservations;
