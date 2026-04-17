import React, { useMemo, Suspense } from "react";
import { useDashboard } from "../../context/DashboardContext";

// ✅ FIX : lazy par composant (ET PAS objet)
const RechartsPieChart = React.lazy(() =>
  import("../../sections/RechartsComponents").then((module) => ({
    default: module.RechartsPieChart,
  })),
);

const RechartsBarChartStats = React.lazy(() =>
  import("../../sections/RechartsComponents").then((module) => ({
    default: module.RechartsBarChartStats,
  })),
);

// 🔥 HELPERS (inchangés)
const parseAmount = (item) => {
  if (!item) return 0;
  const val = item?.amount ?? item?.total_price ?? item?.total_amount ?? 0;
  if (val === null || val === undefined || val === "") return 0;
  if (typeof val === "string") {
    const parsed = parseInt(val.replace(/[^0-9.-]/g, "")) || 0;
    return isNaN(parsed) || parsed < 0 ? 0 : parsed;
  }
  const numVal = Number(val);
  return isNaN(numVal) || numVal < 0 ? 0 : numVal;
};

const isPaidStatus = (status) => {
  if (!status) return false;
  const statusLower = String(status).toLowerCase().trim();
  return [
    "payé",
    "paid",
    "confirmé",
    "confirmed",
    "active",
    "success",
  ].includes(statusLower);
};

const COLORS = ["#f27f0d", "#cbad90", "#493622", "#7d5a37", "#a67c52"];

const CustomTooltip = ({ active, payload, label }) => {
  if (
    active &&
    payload &&
    payload.length &&
    payload[0]?.value !== undefined &&
    payload[0]?.value !== null
  ) {
    return (
      <div className="bg-[#231a10] border border-[#493622] p-3 rounded-xl shadow-2xl">
        <p className="text-white text-xs font-black uppercase mb-1">
          {label || payload[0]?.name || "N/A"}
        </p>
        <p className="text-primary text-lg font-black">
          {payload[0].value?.toLocaleString() || "0"}
          <span className="text-[10px] text-[#cbad90] ml-1 font-normal uppercase">
            {payload[0]?.unit || (payload[0]?.name === "count" ? "Matchs" : "")}
          </span>
        </p>
      </div>
    );
  }
  return null;
};

const Statistics = () => {
  const {
    reservations = [],
    subscriptions = [],
    fields = [],
    isLoadingReservations,
    isLoadingSubscriptions,
  } = useDashboard();

  const realStats = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    let monthlyRevenue = 0;

    const activeRes = reservations.filter((r) => {
      const statusLower = String(r.status || "")
        .toLowerCase()
        .trim();
      return (
        !statusLower.includes("annulé") && !statusLower.includes("canceled")
      );
    });

    const paidSubs = subscriptions.filter((s) => {
      const statusLower = String(s.status || "")
        .toLowerCase()
        .trim();
      return (
        !statusLower.includes("annulé") && !statusLower.includes("canceled")
      );
    });

    activeRes.forEach((r) => {
      const d = new Date(r.originalDate || r.createdAt);
      if (
        !isNaN(d) &&
        d.getMonth() === currentMonth &&
        d.getFullYear() === currentYear
      ) {
        monthlyRevenue += parseAmount(r);
      }
    });

    paidSubs.forEach((s) => {
      const d = new Date(s.startDate || s.createdAt);
      if (
        !isNaN(d) &&
        d.getMonth() === currentMonth &&
        d.getFullYear() === currentYear
      ) {
        monthlyRevenue += parseAmount(s);
      }
    });

    const clientSet = new Set();
    reservations.forEach((r) => clientSet.add(r.clientName || r.userId));
    subscriptions.forEach((s) => clientSet.add(s.clientName || s.userId));

    const distribution = {};
    activeRes.forEach((r) => {
      const name = r.fieldName || "Inconnu";
      distribution[name] = (distribution[name] || 0) + 1;
    });

    const fieldDistributionData = Object.keys(distribution).map((name) => ({
      name,
      value: distribution[name],
    }));

    const hoursMap = {};
    for (let i = 8; i <= 23; i++) {
      hoursMap[`${i.toString().padStart(2, "0")}:00`] = 0;
    }

    activeRes.forEach((r) => {
      const hour = (r.time || r.startTime || "").split(":")[0];
      if (hour && hoursMap[`${hour}:00`] !== undefined) {
        hoursMap[`${hour}:00`]++;
      }
    });

    const hourlyAffluenceData = Object.keys(hoursMap).map((hour) => ({
      hour,
      count: hoursMap[hour],
    }));

    const totalSlotsPossible = (fields.length || 1) * 10 * 30;
    const occupancy = Math.min(
      100,
      (activeRes.length / totalSlotsPossible) * 100,
    ).toFixed(1);

    return {
      monthlyRevenue,
      activeReservations: activeRes.length + paidSubs.length,
      totalClients: clientSet.size,
      occupancyRate: `${occupancy}%`,
      fieldDistributionData,
      hourlyAffluenceData,
    };
  }, [reservations, subscriptions, fields]);

  if (isLoadingReservations || isLoadingSubscriptions) {
    return (
      <div className="h-[400px] flex flex-col items-center justify-center gap-4">
        <div className="size-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
        <p className="text-primary font-bold text-sm uppercase tracking-widest text-center">
          Génération de vos rapports de performance...
        </p>
      </div>
    );
  }

  const formatCurrency = (val) => {
    if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M`;
    if (val >= 1000) return `${(val / 1000).toFixed(1)}K`;
    return Math.round(val).toString();
  };

  return (
    <div className="flex flex-col gap-6 md:gap-10 pb-10">
      {/* HEADER */}
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <h2 className="text-white text-2xl md:text-3xl font-black italic">
            Analyse Approfondie
          </h2>
          <span className="size-2 rounded-full bg-[#0bda16] animate-pulse"></span>
        </div>
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        <div className="bg-[#2c241b] rounded-3xl border border-[#493622] p-4 sm:p-8">
          <h3 className="text-white text-lg md:text-xl font-black mb-4 md:mb-8 italic">
            Répartition par Terrain
          </h3>

          <Suspense fallback={<div className="text-center py-10 text-[#cbad90]">Chargement du graphique...</div>}>
            <RechartsPieChart
              data={realStats.fieldDistributionData}
              isLoading={false}
            />
          </Suspense>
        </div>

        <div className="bg-[#2c241b] rounded-3xl border border-[#493622] p-4 sm:p-8">
          <h3 className="text-white text-lg md:text-xl font-black mb-4 md:mb-8 italic">
            Affluence par Créneau
          </h3>

          <Suspense fallback={<div className="text-center py-10 text-[#cbad90]">Chargement du graphique...</div>}>
            <RechartsBarChartStats
              data={realStats.hourlyAffluenceData}
              isLoading={false}
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
