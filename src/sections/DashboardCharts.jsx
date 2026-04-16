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
  } = useDashboard();

  const [timeRange, setTimeRange] = useState("week");
  const [revenueType, setRevenueType] = useState("all");

  const chartData = useMemo(() => {
    const days = timeRange === "week" ? 7 : 30;
    const data = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

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

    (reservations || []).forEach((res) => {
      const status = (res.status || "").toLowerCase();
      if (["annulé", "expired", "expiré", "refusé"].includes(status)) return;

      const date = normalizeDate(res.date);
      if (!date) return;

      const entry = data.find((d) => d.date === date);
      if (entry) entry.players += 1;

      if (!isPaidStatus(status) || !entry) return;

      const amount = parseAmount(res);

      if (isSubscription(res)) {
        entry.abonnement += amount;
      } else {
        entry.matchUnique += amount;
      }
    });

    (subscriptions || []).forEach((sub) => {
      if (!isPaidStatus(sub.status)) return;

      const date = normalizeDate(
        sub.start_date || sub.startDate || sub.created_at || sub.createdAt,
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
  }, [reservations, subscriptions, timeRange]);

  const totals = useMemo(() => {
    let single = 0;
    let sub = 0;

    reservations.forEach((r) => {
      if (isPaidStatus(r?.status)) {
        const amt = parseAmount(r);
        if (isSubscription(r)) sub += amt;
        else single += amt;
      }
    });

    subscriptions.forEach((s) => {
      if (isPaidStatus(s?.status)) {
        sub += parseAmount(s);
      }
    });

    return {
      single,
      subscription: sub,
      all: single + sub,
    };
  }, [reservations, subscriptions]);

  if (isLoadingReservations) {
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
    <div className="bg-[#2c241b] rounded-2xl border border-[#493622] p-6 h-full flex flex-col">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-white text-xl font-black">
          Performance Financière
        </h3>

        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="bg-[#231a10] text-[#cbad90] text-xs px-3 py-2 rounded-lg border border-[#493622]"
        >
          <option value="week">7 jours</option>
          <option value="month">30 jours</option>
        </select>
      </div>

      {/* TOTAL */}
      <div className="mb-6">
        <h4 className="text-white text-4xl font-black">
          {totalRevenue.toLocaleString()} FCFA
        </h4>
      </div>

      {/* CHART */}
      <div className="flex-1 min-h-[300px]">
        <Suspense fallback={<div className="text-white">Chargement...</div>}>
          <RechartsAreaChart
            data={chartData}
            isLoading={isLoadingReservations}
          />
        </Suspense>
      </div>
    </div>
  );
};

export default DashboardCharts;
