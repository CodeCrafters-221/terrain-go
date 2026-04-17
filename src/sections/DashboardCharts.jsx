import React, { useState, useMemo, Suspense } from "react";
import { useDashboard } from "../context/DashboardContext";
import {
  normalizeDate,
  parseAmount,
  isPaidStatus,
  isSubscription,
} from "../utils/dateTime";

// ✅ FIX lazy (IMPORTANT)
const RechartsAreaChart = React.lazy(() =>
  import("./RechartsComponents").then((module) => ({
    default: module.RechartsAreaChart,
  })),
);

const DashboardCharts = () => {
  const {
    reservations = [],
    subscriptions = [],
    isLoadingReservations,
    isLoadingSubscriptions,
    archivedIds = [],
    archivedSubIds = []
  } = useDashboard();

  const [timeRange, setTimeRange] = useState("week");
  const [revenueType, setRevenueType] = useState("all");

  const chartData = useMemo(() => {
    const days = timeRange === "week" ? 7 : 30;
    const data = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const filteredReservations = reservations.filter(r => !archivedIds.map(String).includes(String(r.id)));
    const filteredSubscriptions = subscriptions.filter(s => !archivedSubIds.map(String).includes(String(s.id)));

    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);

      data.push({
        date: normalizeDate(d),
        name:
          timeRange === "week"
            ? d.toLocaleDateString("fr-FR", { weekday: "short" })
            : d.getDate().toString(),
        players: 0,
        matchUnique: 0,
        abonnement: 0,
        revenue: 0,
      });
    }

    (filteredReservations || []).forEach((res) => {
      const status = (res.status || "").toLowerCase();
      if (["annulé", "expired", "expiré", "refusé"].includes(status)) return;

      const rawDate = res.originalDate || res.date;
      const date = normalizeDate(rawDate);
      if (!date) return;

      const entry = data.find((d) => d.date === date);
      if (entry) entry.players += 1;

      if (!isPaidStatus(status) || !entry) return;

      const amount = parseAmount(res);

      if (isSubscription(res)) {
        // Le revenu des abonnements est calculé via filteredSubscriptions
      } else {
        entry.matchUnique += amount;
      }
    });

    (filteredSubscriptions || []).forEach((sub) => {
      if (!isPaidStatus(sub.status)) return;

      const date = normalizeDate(
        sub.created_at || sub.createdAt || sub.start_date || sub.startDate,
      );

      if (!date) return;

      const entry = data.find((d) => d.date === date);
      if (!entry) return;

      entry.abonnement += parseAmount(sub);
    });

    data.forEach((d) => {
      d.revenue = d.matchUnique + d.abonnement;
    });

    return data;
  }, [reservations, subscriptions, timeRange, archivedIds, archivedSubIds]);

  const totals = useMemo(() => {
    const days = timeRange === "week" ? 7 : 30;
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    const cutoff = new Date(today);
    cutoff.setDate(cutoff.getDate() - days + 1);
    cutoff.setHours(0, 0, 0, 0);

    const inRange = (dateInput) => {
      if (!dateInput) return false;
      const d = new Date(dateInput);
      if (isNaN(d.getTime())) return false;
      return d >= cutoff && d <= today;
    };

    let single = 0;
    let sub = 0;

    const filteredReservations = reservations.filter(r => !archivedIds.includes(String(r.id)));
    const filteredSubscriptions = subscriptions.filter(s => !archivedSubIds.includes(String(s.id)));

    filteredReservations.forEach((r) => {
      const rawDate = r?.originalDate || r?.date;
      if (!inRange(rawDate)) return;
      if (isPaidStatus(r?.status)) {
        const amt = parseAmount(r);
        if (!isSubscription(r)) {
           single += amt;
        }
      }
    });

    filteredSubscriptions.forEach((s) => {
      const dateStr = s?.created_at || s?.createdAt || s?.start_date || s?.startDate;
      if (!inRange(dateStr)) return;
      if (isPaidStatus(s?.status)) {
        sub += parseAmount(s);
      }
    });

    return {
      single,
      subscription: sub,
      all: single + sub,
    };
  }, [reservations, subscriptions, timeRange, archivedIds, archivedSubIds]);

  if (isLoadingReservations || isLoadingSubscriptions) {
    return (
      <div className="h-[400px] flex items-center justify-center text-primary">
        <div className="flex flex-col items-center gap-4">
          <div className="size-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          <span className="text-xs font-bold uppercase tracking-widest">
            Analyse des données...
          </span>
        </div>
      </div>
    );
  }

  const totalRevenue =
    revenueType === "single"
      ? totals.single
      : revenueType === "sub"
        ? totals.subscription
        : totals.all;

  return (
    <div className="bg-[#2c241b] rounded-2xl border border-[#493622] p-4 sm:p-6 h-full flex flex-col">
      {/* HEADER */}
      <div className="flex flex-col xs:flex-row justify-between items-start xs:items-center gap-4 mb-6">
        <h3 className="text-white text-lg md:text-xl font-black">
          Performance Financière
        </h3>

        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="bg-[#231a10] text-[#cbad90] text-xs px-3 py-2 rounded-lg border border-[#493622] w-full xs:w-auto"
        >
          <option value="week">7 jours</option>
          <option value="month">30 jours</option>
        </select>
      </div>

      {/* TOTAL */}
      <div className="mb-6">
        <h4 className="text-white text-3xl sm:text-4xl font-black">
          {totalRevenue.toLocaleString()} FCFA
        </h4>
      </div>

      {/* CHART */}
      <div className="flex-1 min-h-[300px]">
        <Suspense fallback={<div className="text-white">Chargement...</div>}>
          <RechartsAreaChart
            data={chartData}
            isLoading={isLoadingReservations || isLoadingSubscriptions}
          />
        </Suspense>
      </div>
    </div>
  );
};

export default DashboardCharts;
