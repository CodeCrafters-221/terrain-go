import React, { useState } from "react";
import { useDashboard } from "../../context/DashboardContext";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
  User,
  MapPin,
} from "lucide-react";

const CalendarMatch = () => {
  const { reservations, subscriptions } = useDashboard();
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Formatter pour la date affichée
  const formatDate = (date) => {
    return new Intl.DateTimeFormat("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date);
  };

  const dailyReservations = (() => {
    const selectedDateStr = selectedDate.toDateString();
    const selectedDayOfWeek = selectedDate.getDay();

    // 1. Réservations uniques (Uniquement celles confirmées/payées)
    const singleMatches = (reservations || [])
      .filter((res) => {
        const resDate = new Date(res.date);
        const status = (res.status || "").toLowerCase();
        const isConfirmed = ["payé", "confirmé", "active", "success"].includes(
          status,
        );

        return (
          resDate.toDateString() === selectedDateStr &&
          res.reservationType !== "subscription" &&
          isConfirmed
        );
      })
      .map((res) => ({ ...res, matchType: "single" }));

    // 2. Abonnements qui tombent ce jour-là (Uniquement ceux confirmés/payés)
    const subscriptionMatches = (subscriptions || [])
      .filter((sub) => {
        const status = (sub.status || "").toLowerCase();
        const isConfirmed = ["payé", "confirmé", "active", "success"].includes(
          status,
        );

        if (!isConfirmed) return false;

        const start = new Date(sub.startDate);
        const end = new Date(sub.endDate);

        // Normalisation des dates pour comparaison (sans l'heure)
        const d = new Date(selectedDate);
        d.setHours(0, 0, 0, 0);
        const s = new Date(sub.startDate);
        s.setHours(0, 0, 0, 0);
        const e = new Date(sub.endDate);
        e.setHours(0, 0, 0, 0);

        const withinRange = d >= s && d <= e;
        const subDay =
          sub.day_of_week !== undefined ? sub.day_of_week : start.getDay();

        return withinRange && selectedDayOfWeek === subDay;
      })
      .map((sub) => ({
        ...sub,
        matchType: "subscription",
      }));

    return [...singleMatches, ...subscriptionMatches].sort((a, b) =>
      (a.time || "").localeCompare(b.time || ""),
    );
  })();

  const changeDate = (days) => {
    const next = new Date(selectedDate);
    next.setDate(selectedDate.getDate() + days);
    setSelectedDate(next);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header Calendrier */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-[#2c241b] p-6 rounded-2xl border border-[#493622] gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-xl">
            <CalendarIcon className="text-primary w-6 h-6" />
          </div>
          <div>
            <h2 className="text-white text-xl font-bold">
              Calendrier des Matchs
            </h2>
            <p className="text-[#cbad90] text-sm">
              Consultez les réservations et matchs prévus pour chaque jour.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-[#231a10] p-2 rounded-full border border-[#493622]">
          <button
            onClick={() => changeDate(-1)}
            className="p-2 hover:bg-primary/20 hover:text-primary text-[#cbad90] rounded-full transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-white font-bold px-4 min-w-[180px] text-center">
            {formatDate(selectedDate)}
          </span>
          <button
            onClick={() => changeDate(1)}
            className="p-2 hover:bg-primary/20 hover:text-primary text-[#cbad90] rounded-full transition-all"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Liste des créneaux */}
      <div className="grid grid-cols-1 gap-4">
        {dailyReservations.length > 0 ? (
          dailyReservations.map((booking) => (
            <div
              key={booking.id}
              className="group bg-[#2c241b] border border-[#493622] hover:border-primary/50 p-4 md:p-5 rounded-2xl transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6 shadow-lg hover:shadow-primary/5"
            >
              <div className="flex items-start md:items-center gap-4 md:gap-6 w-full md:w-auto">
                {/* Heure */}
                <div className="flex flex-col items-center justify-center bg-[#231a10] border border-[#493622] rounded-xl w-24 h-16 md:w-30 md:h-20 shrink-0 group-hover:border-primary/30 transition-colors">
                  <Clock className="w-4 h-4 md:w-5 md:h-5 text-primary mb-1" />
                  <span className="text-white font-black text-sm md:text-md">
                    {booking.time}
                  </span>
                </div>

                {/* Infos Client */}
                <div className="flex flex-col gap-1.5 md:gap-2 text-left flex-1 min-w-0">
                  <div className="flex items-center justify-between md:justify-start gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <User className="w-4 h-4 text-primary shrink-0" />
                      <h3 className="text-white font-bold text-base md:text-lg truncate">
                        {booking.clientName}
                      </h3>
                    </div>
                    {/* Badge Statut Mobile */}
                    <div className="md:hidden">
                      <StatusBadge status={booking.status} />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-[#cbad90] text-xs md:text-sm">
                      <MapPin className="w-3.5 h-3.5 md:w-4 md:h-4 shrink-0" />
                      <span className="truncate">{booking.fieldName}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-[#5d452b] text-[10px] font-mono">
                        ID: {booking.id.toString().substring(0, 8)}
                      </p>
                      {booking.matchType === "subscription" && (
                        <div className="md:hidden">
                          <SubscriptionBadge />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Desktop Status & Type */}
              <div className="hidden md:flex flex-col items-end gap-2 shrink-0">
                <StatusBadge status={booking.status} />
                {booking.matchType === "subscription" && <SubscriptionBadge />}
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-[#2c241b]/50 rounded-3xl border border-dashed border-[#493622]">
            <div className="size-16 rounded-full bg-[#493622]/30 flex items-center justify-center mb-4">
              <CalendarIcon className="w-8 h-8 text-[#5d452b]" />
            </div>
            <h3 className="text-white font-bold text-lg">Aucun match prévu</h3>
            <p className="text-[#cbad90] text-sm mt-1">
              Il n'y a pas de réservation pour ce jour.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// Composants Badges internes pour un code plus propre et maintenable
const StatusBadge = ({ status }) => {
  const s = (status || "").toLowerCase();
  const isActive = ["payé", "confirmé", "active", "success"].includes(s);
  const isCancelled = s === "annulé";

  return (
    <span
      className={`px-2.5 md:px-4 py-1 rounded-full text-[8px] md:text-[10px] font-black uppercase tracking-wider border shrink-0 ${
        isActive
          ? "bg-green-500/10 text-green-500 border-green-500/20"
          : isCancelled
            ? "bg-red-500/10 text-red-500 border-red-500/20"
            : "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20"
      }`}
    >
      {s === "active" ? "Confirmé" : status}
    </span>
  );
};

const SubscriptionBadge = () => (
  <span className="bg-primary/20 text-primary text-[8px] md:text-[9px] px-2 py-0.5 rounded font-black uppercase border border-primary/30 flex items-center gap-1 shrink-0">
    <span className="material-symbols-outlined text-[10px] md:text-[12px]">
      autorenew
    </span>
    Abonnement
  </span>
);

export default CalendarMatch;
