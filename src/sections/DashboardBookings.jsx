import React, { useState } from "react";
import { useDashboard } from "../context/DashboardContext";
import { useNavigate } from "react-router-dom";

const DashboardBookings = () => {
  const { reservations } = useDashboard();
  const navigate = useNavigate();
  const [filterStatus, setFilterStatus] = useState("All"); // All, Pending, Confirmed

  const getFilteredReservations = () => {
    let filtered = reservations;
    if (filterStatus === "Pending") {
      filtered = reservations.filter(
        (r) => r.status === "En attente de paiement",
      );
    } else if (filterStatus === "Confirmed") {
      filtered = reservations.filter(
        (r) => r.status === "Confirmé" || r.status === "Payé",
      );
    }
    return filtered.slice(0, 5);
  };

  const displayReservations = getFilteredReservations();

  const cycleFilter = () => {
    const statuses = ["All", "Pending", "Confirmed"];
    const currentIndex = statuses.indexOf(filterStatus);
    setFilterStatus(statuses[(currentIndex + 1) % statuses.length]);
  };

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
          className={`size-8 flex items-center justify-center rounded-full transition-all ${filterStatus !== "All" ? "bg-[#f27f0d] text-[#231a10]" : "hover:bg-[#493622] text-[#cbad90]"}`}
          title="Changer le filtre"
        >
          <span className="material-symbols-outlined">filter_list</span>
        </button>
      </div>
      <div className="flex flex-col p-2 overflow-y-auto max-h-[600px] custom-scrollbar">
        {displayReservations.map((booking) => (
          <div
            key={booking.id}
            className="p-4 hover:bg-[#493622]/50 rounded-xl transition-colors cursor-pointer group"
          >
            <div className="flex items-start gap-4">
              <div className="flex flex-col items-center justify-center bg-[#493622] text-[#f27f0d] rounded-xl w-14 h-14 shrink-0">
                <span className="text-xs font-bold uppercase">
                  {new Date(booking.originalDate)
                    .toLocaleDateString("fr-FR", { month: "short" })
                    .replace(".", "")}
                </span>
                <span className="text-xl font-bold">
                  {new Date(booking.originalDate).getDate()}
                </span>
              </div>
              <div className="flex flex-col flex-1 gap-1">
                <div className="flex justify-between items-start">
                  <h4 className="text-white font-medium text-sm">
                    {booking.clientName}
                  </h4>
                  <span className="text-[#f27f0d] text-xs font-bold px-2 py-0.5 rounded bg-[#f27f0d]/10">
                    {booking.time}
                  </span>
                </div>
                <p className="text-[#cbad90] text-xs">{booking.fieldName}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span
                    className={`size-2 rounded-full ${booking.status === "Payé" || booking.status === "Confirmé" ? "bg-green-500" : "bg-yellow-500"}`}
                  ></span>
                  <span
                    className={`text-xs font-medium ${booking.status === "Payé" || booking.status === "Confirmé" ? "text-green-500" : "text-yellow-500"}`}
                  >
                    {booking.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
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
