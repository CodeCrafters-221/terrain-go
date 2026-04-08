import React, { useState, useMemo, useCallback } from "react";
import { useDashboard } from "../context/DashboardContext";
import { useNavigate } from "react-router-dom";
import { formatDisplayDate } from "../utils/dateTime";

/**
 * Sous-composant mémoïsé pour éviter les re-rendus inutiles de la liste
 */
const BookingItem = React.memo(({ booking }) => {
  const { month, day } = formatDisplayDate(
    booking.date || booking.originalDate,
  );

  const statusColors = {
    active: "text-green-500",
    Confirmé: "text-green-500",
    Payé: "text-green-500",
    Annulé: "text-red-500",
    Expiré: "text-red-500",
    default: "text-yellow-500",
  };

  const statusBg = statusColors[booking.status] || statusColors.default;
  const dotBg = statusBg.replace("text-", "bg-");

  return (
    <div className="p-4 hover:bg-[#493622]/50 rounded-xl transition-colors cursor-pointer group">
      <div className="flex items-start gap-4">
        <div className="flex flex-col items-center justify-center bg-[#493622] text-[#f27f0d] rounded-xl w-14 h-14 shrink-0">
          <span className="text-xs font-bold uppercase">{month}</span>
          <span className="text-xl font-bold">{day}</span>
        </div>
        <div className="flex flex-col flex-1 gap-1">
          <div className="flex justify-between items-start">
            <h4 className="text-white font-medium text-xs">
              {booking.clientName}
            </h4>
            <span className="text-[#f27f0d] text-xs font-bold px-1.5 py-0.5 rounded bg-[#f27f0d]/10">
              {booking.time || booking.startTime}
            </span>
          </div>
          <p className="text-[#cbad90] text-xs">
            {booking.fieldName || booking.terrainName}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <span className={`size-2 rounded-full ${dotBg}`}></span>
            <span className={`text-xs font-medium ${statusBg}`}>
              {booking.status}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
});

BookingItem.displayName = "BookingItem";

const DashboardBookings = () => {
  const { reservations } = useDashboard();
  const navigate = useNavigate();
  const [filterStatus, setFilterStatus] = useState("Tout"); // Tout, En attente, Confirmé, Annulé

  const displayReservations = useMemo(() => {
    let filtered = reservations;
    if (filterStatus === "En attente") {
      filtered = reservations.filter(
        (r) => r.status === "En attente de paiement",
      );
    } else if (filterStatus === "Confirmé") {
      filtered = reservations.filter(
        (r) =>
          r.status === "Confirmé" ||
          r.status === "Payé" ||
          r.status === "active",
      );
    } else if (filterStatus === "Annulé") {
      filtered = reservations.filter(
        (r) => r.status === "Annulé" || r.status === "Expiré",
      );
    }
    return filtered.slice(0, 5);
  }, [reservations, filterStatus]);

  const cycleFilter = useCallback(() => {
    const statuses = ["Tout", "En attente", "Confirmé", "Annulé"];
    const currentIndex = statuses.indexOf(filterStatus);
    setFilterStatus(statuses[(currentIndex + 1) % statuses.length]);
  }, [filterStatus]);

  return (
    <div className="bg-[#2c241b] rounded-2xl border border-[#493622] h-full flex flex-col">
      <div className="p-6 border-b border-[#493622] flex items-center justify-between">
        <div className="flex flex-col">
          <h3 className="text-white text-lg font-bold">
            Prochaines Réservations
          </h3>
          <span className="text-[10px] text-[#f27f0d] font-bold uppercase tracking-wider">
            Filtre : {filterStatus}
          </span>
        </div>
        <button
          onClick={cycleFilter}
          className={`size-8 flex items-center justify-center rounded-full transition-all ${
            filterStatus !== "Tout"
              ? "bg-[#f27f0d] text-[#231a10]"
              : "hover:bg-[#493622] text-[#cbad90]"
          }`}
          title="Changer le filtre"
        >
          <span className="material-symbols-outlined">filter_list</span>
        </button>
      </div>
      <div className="flex flex-col p-2 overflow-y-auto max-h-[600px] custom-scrollbar">
        {displayReservations.map((booking) => (
          <BookingItem key={booking.id} booking={booking} />
        ))}

        <div className="p-4 mt-2">
          <button
            onClick={() => navigate("/dashboard/calendar")}
            className="w-full py-3 rounded-full border border-[#493622] text-[#cbad90] text-sm font-medium hover:bg-[#493622] hover:text-white transition-colors"
          >
            Voir le calendrier complet
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardBookings;
