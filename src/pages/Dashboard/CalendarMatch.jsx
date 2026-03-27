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

    // 1. Réservations uniques (on exclut les entrées liées aux abonnements pour éviter les doublons
    // car on va générer les occurrences d'abonnement dynamiquement plus bas)
    const singleMatches = (reservations || [])
      .filter((res) => {
        const resDate = new Date(res.date);
        return (
          resDate.toDateString() === selectedDateStr &&
          res.reservationType !== "subscription"
        );
      })
      .map((res) => ({ ...res, matchType: "single" }));

    // 2. Abonnements qui tombent ce jour-là
    const subscriptionMatches = (subscriptions || [])
      .filter((sub) => {
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
              className="group bg-[#2c241b] border border-[#493622] hover:border-primary/50 p-5 rounded-2xl transition-all flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg hover:shadow-primary/5"
            >
              <div className="flex flex-col md:flex-row items-center gap-6 w-full md:w-auto">
                {/* Heure */}
                <div className="flex flex-col items-center justify-center bg-[#231a10] border border-[#493622] rounded-xl w-30 h-20 shrink-0 group-hover:border-primary/30 transition-colors">
                  <Clock className="w-5 h-5 text-primary mb-1" />
                  <span className="text-white font-black text-md">
                    {booking.time}
                  </span>
                </div>

                {/* Infos Client */}
                <div className="flex flex-col gap-2 text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start gap-2">
                    <User className="w-4 h-4 text-primary" />
                    <h3 className="text-white font-bold text-lg">
                      {booking.clientName}
                    </h3>
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-center md:justify-start gap-2 text-[#cbad90] text-sm">
                      <MapPin className="w-4 h-4" />
                      <span>{booking.fieldName}</span>
                    </div>
                    <p className="text-[#5d452b] text-xs font-mono">
                      {booking.id}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 w-full md:w-auto justify-center">
                <div className="flex flex-col items-end gap-2">
                  <span
                    className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      booking.status === "Payé" ||
                      booking.status === "Confirmé" ||
                      booking.status === "active"
                        ? "bg-green-500/10 text-green-500 border border-green-500/20"
                        : booking.status === "Annulé"
                          ? "bg-red-500/10 text-red-500 border border-red-500/20"
                          : "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20"
                    }`}
                  >
                    {booking.status === "active" ? "Confirmé" : booking.status}
                  </span>

                  {booking.matchType === "subscription" && (
                    <span className="bg-primary/20 text-primary text-[9px] px-2 py-0.5 rounded font-black uppercase border border-primary/30 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[12px]">
                        autorenew
                      </span>
                      Abonnement
                    </span>
                  )}
                </div>
                <button className="size-10 flex items-center justify-center rounded-xl bg-[#493622] text-white hover:bg-primary hover:text-background-dark transition-all cursor-pointer">
                  <span className="material-symbols-outlined text-[20px]">
                    more_vert
                  </span>
                </button>
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

export default CalendarMatch;
