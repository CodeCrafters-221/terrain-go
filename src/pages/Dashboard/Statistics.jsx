import React, { useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

import { useDashboard } from "../../context/DashboardContext";

// 🔥 HELPERS ROBUSTES (Cohérence avec le reste du dashboard)
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
  // Inclure tous les statuts ayant générés du revenu
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

  // 📊 CALCUL DES ANALYSES RÉELLES
  const realStats = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    let monthlyRevenue = 0;
    // Inclure toutes les réservations sauf celles annulées
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

    // 1. Revenu Mensuel (Cumul Matchs + Abonnements du mois en cours)
    activeRes.forEach((r) => {
      const dateStr = r.originalDate || r.createdAt;
      if (dateStr) {
        const d = new Date(dateStr);
        if (
          !isNaN(d.getTime()) &&
          d.getMonth() === currentMonth &&
          d.getFullYear() === currentYear
        ) {
          const amount = parseAmount(r);
          if (amount > 0) {
            monthlyRevenue += amount;
          }
        }
      }
    });
    paidSubs.forEach((s) => {
      const dateStr = s.startDate || s.createdAt;
      if (dateStr) {
        const d = new Date(dateStr);
        if (
          !isNaN(d.getTime()) &&
          d.getMonth() === currentMonth &&
          d.getFullYear() === currentYear
        ) {
          const amount = parseAmount(s);
          if (amount > 0) {
            monthlyRevenue += amount;
          }
        }
      }
    });

    // 2. Clients Uniques
    const clientSet = new Set();
    reservations.forEach((r) => clientSet.add(r.clientName || r.userId));
    subscriptions.forEach((s) => clientSet.add(s.clientName || s.userId));

    // 3. Répartition par terrain (Pie Chart)
    const distribution = {};
    activeRes.forEach((r) => {
      const name = r.fieldName || "Inconnu";
      distribution[name] = (distribution[name] || 0) + 1;
    });
    const fieldDistributionData = Object.keys(distribution).map((name) => ({
      name,
      value: distribution[name],
    }));

    // 4. Affluence par créneau (Bar Chart)
    const hoursMap = {};
    // Initialiser les créneaux de 08h à 23h
    for (let i = 8; i <= 23; i++)
      hoursMap[`${i.toString().padStart(2, "0")}:00`] = 0;

    activeRes.forEach((r) => {
      const time = r.time || r.startTime || "";
      const hour = time.split(":")[0];
      if (hour && hoursMap[`${hour}:00`] !== undefined) {
        hoursMap[`${hour}:00`]++;
      }
    });
    const hourlyAffluenceData = Object.keys(hoursMap).map((hour) => ({
      hour,
      count: hoursMap[hour],
    }));

    // 5. Taux d'occupation
    const totalSlotsPossible = (fields.length || 1) * 10 * 30; // 10 créneaux/jour sur 30 jours
    const occupancyValue = (activeRes.length / totalSlotsPossible) * 100;
    const occupancy = !isNaN(occupancyValue)
      ? Math.min(100, occupancyValue).toFixed(1)
      : "0";

    return {
      monthlyRevenue: isNaN(monthlyRevenue) ? 0 : monthlyRevenue,
      activeReservations: activeRes.length || 0,
      totalClients: clientSet.size || 0,
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
    if (typeof val !== "number" || isNaN(val) || !isFinite(val)) {
      return "0";
    }
    if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M`;
    if (val >= 1000) return `${(val / 1000).toFixed(1)}K`;
    return Math.round(val).toString();
  };

  return (
    <div className="flex flex-col gap-10 pb-10">
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <h2 className="text-white text-2xl md:text-3xl font-black tracking-tight leading-tight">
            Analyse Approfondie
          </h2>
          <span className="size-2 rounded-full bg-[#0bda16] animate-pulse mt-1"></span>
        </div>
        <p className="text-[#cbad90] text-xs md:text-sm mt-1 font-medium italic">
          Données calculées en direct sur l'activité de votre établissement
        </p>
      </div>

      {/* Top Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
        <div className="bg-[#2c241b] p-6 rounded-3xl border border-[#493622] flex flex-col gap-2 hover:border-primary/30 transition-all group">
          <span className="text-[#cbad90] text-xs font-bold uppercase tracking-widest">
            Revenu Mensuel
          </span>
          <div className="flex items-end gap-2">
            <h3 className="text-3xl font-black text-white leading-none group-hover:text-primary transition-colors">
              {formatCurrency(realStats.monthlyRevenue)}
            </h3>
            <span className="text-[#cbad90] text-sm mb-0.5">CFA</span>
          </div>
          <div className="flex items-center gap-1.5 text-[#0bda16] text-xs font-bold mt-2">
            <span className="material-symbols-outlined text-[16px]">
              trending_up
            </span>
            Performance du mois
          </div>
        </div>
        <div className="bg-[#2c241b] p-6 rounded-3xl border border-[#493622] flex flex-col gap-2 hover:border-primary/30 transition-all group">
          <span className="text-[#cbad90] text-xs font-bold uppercase tracking-widest">
            Réservations
          </span>
          <div className="flex items-end gap-2">
            <h3 className="text-3xl font-black text-white leading-none group-hover:text-primary transition-colors">
              {realStats.activeReservations}
            </h3>
            <span className="text-[#cbad90] text-sm mb-0.5">actives</span>
          </div>
          <div className="flex items-center gap-1.5 text-[#0bda16] text-xs font-bold mt-2">
            <span className="material-symbols-outlined text-[16px]">
              trending_up
            </span>
            {realStats.activeReservations > 0 ? "Flux positif" : "En attente"}
          </div>
        </div>
        <div className="bg-[#2c241b] p-6 rounded-3xl border border-[#493622] flex flex-col gap-2 hover:border-primary/30 transition-all group">
          <span className="text-[#cbad90] text-xs font-bold uppercase tracking-widest">
            Clients Uniques
          </span>
          <div className="flex items-end gap-2">
            <h3 className="text-3xl font-black text-white leading-none group-hover:text-primary transition-colors">
              {realStats.totalClients}
            </h3>
            <span className="text-[#cbad90] text-sm mb-0.5">joueurs</span>
          </div>
          <div className="flex items-center gap-1.5 text-[#cbad90] text-xs font-bold mt-2">
            <span className="material-symbols-outlined text-[16px]">group</span>
            Base de données
          </div>
        </div>
        <div className="bg-[#2c241b] p-6 rounded-3xl border border-[#493622] flex flex-col gap-2 hover:border-primary/30 transition-all group">
          <span className="text-[#cbad90] text-xs font-bold uppercase tracking-widest">
            Taux Moyen
          </span>
          <div className="flex items-end gap-2">
            <h3 className="text-3xl font-black text-white leading-none group-hover:text-primary transition-colors">
              {realStats.occupancyRate}
            </h3>
          </div>
          <div className="flex items-center gap-1.5 text-[#0bda16] text-xs font-bold mt-2">
            <span className="material-symbols-outlined text-[16px]">
              trending_up
            </span>
            {parseInt(realStats.occupancyRate) > 30
              ? "Très bon"
              : "En croissance"}
          </div>
        </div>
      </div>

      {/* Detailed Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-[#2c241b] rounded-3xl border border-[#493622] p-8 shadow-xl">
          <h3 className="text-white text-xl font-black mb-8 italic">
            Répartition par Terrain
          </h3>
          <div className="h-[300px] w-full relative">
            <ResponsiveContainer width="99%" height="100%">
              <PieChart>
                <Pie
                  data={realStats.fieldDistributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {realStats.fieldDistributionData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  formatter={(value) => (
                    <span className="text-[#cbad90] text-xs font-bold uppercase tracking-wider">
                      {value}
                    </span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[#2c241b] rounded-3xl border border-[#493622] p-8 shadow-xl">
          <h3 className="text-white text-xl font-black mb-8 italic">
            Affluence par Créneau
          </h3>
          <div className="h-[300px] w-full relative">
            <ResponsiveContainer width="99%" height="100%">
              <BarChart
                data={realStats.hourlyAffluenceData}
                margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#493622"
                />
                <XAxis
                  dataKey="hour"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#cbad90", fontSize: 10, fontWeight: 700 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#cbad90", fontSize: 10 }}
                />
                <Tooltip
                  cursor={{ fill: "rgba(242, 127, 13, 0.05)" }}
                  content={<CustomTooltip />}
                />
                <Bar
                  dataKey="count"
                  fill="#f27f0d"
                  radius={[4, 4, 0, 0]}
                  barSize={16}
                  animationDuration={2000}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
