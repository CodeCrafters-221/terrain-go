import React, { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { useDashboard } from "../context/DashboardContext";

// 🔥 SAFE HELPERS
const normalizeDate = (dateInput) => {
  if (!dateInput) return "";
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return "";
  // Utilisation de en-CA pour obtenir YYYY-MM-DD local sans timezone shift
  return d.toLocaleDateString("en-CA");
};

const parseAmount = (item) => {
  const val = item?.amount ?? item?.total_price ?? item?.total_amount ?? 0;
  if (typeof val === "string") {
    return parseInt(val.replace(/[^0-9]/g, "")) || 0;
  }
  return Number(val) || 0;
};

const normalizeStatus = (status) => (status || "").toLowerCase();
const isPaidStatus = (status) =>
  ["payé", "confirmé", "active", "success"].includes(normalizeStatus(status));

const isSubscription = (res) =>
  !!(
    res?.subscription_id ||
    res?.reservation_type === "subscription" ||
    res?.reservationType === "subscription"
  );

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#231a10] border border-[#493622] p-4 rounded-xl shadow-2xl">
        <p className="text-[#cbad90] text-xs font-bold uppercase mb-1">
          {label}
        </p>
        <div className="flex flex-col gap-1.5">
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center gap-2">
              <div
                className="size-2 rounded-full"
                style={{ backgroundColor: entry.color }}
              ></div>
              <p className="text-white text-sm font-bold">
                <span className="text-[#cbad90] font-medium mr-1">
                  {entry.dataKey === "singleRevenue"
                    ? "Matchs Uniques:"
                    : entry.dataKey === "subRevenue"
                      ? "Abonnements:"
                      : "Fréquentation:"}
                </span>
                {entry.value.toLocaleString()}
                <span className="text-[10px] font-normal text-[#cbad90] ml-1">
                  {entry.dataKey.includes("Revenue") ? "CFA" : "rés."}
                </span>
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

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

    // 1. INIT DAYS
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
        singleRevenue: 0,
        subRevenue: 0,
        revenue: 0,
      });
    }

    // 2. AGGREGATE RESERVATIONS
    (reservations || []).forEach((res) => {
      const status = normalizeStatus(res.status);
      if (["annulé", "expired", "expiré", "refusé"].includes(status)) return;

      const date = normalizeDate(res.date);
      if (!date) return;

      const entry = data.find((d) => d.date === date);

      // On incrémente la fréquentation même si pas encore payé (réservation faite)
      if (entry) entry.players += 1;

      if (!isPaidStatus(status)) return;
      if (!entry) return; // Hors fenêtre

      const amount = parseAmount(res);

      if (isSubscription(res)) {
        entry.subRevenue += amount;
      } else {
        entry.singleRevenue += amount;
      }
    });

    // 3. AGGREGATE SUBSCRIPTIONS
    (subscriptions || []).forEach((sub) => {
      if (!isPaidStatus(sub.status)) return;

      const date = normalizeDate(
        sub.start_date || sub.startDate || sub.created_at || sub.createdAt,
      );

      if (!date) return;

      const entry = data.find((d) => d.date === date);
      if (!entry) return;

      entry.subRevenue += parseAmount(sub);
    });

    // 4. TOTALS
    data.forEach((d) => {
      d.revenue = d.singleRevenue + d.subRevenue;
    });

    return data;
  }, [reservations, subscriptions, timeRange]);

  // 🔥 CALCUL DES TOTAUX GLOBAUX (Source de vérité indépendante de la fenêtre du chart)
  const totals = useMemo(() => {
    let single = 0;
    let sub = 0;

    reservations.forEach((r) => {
      if (isPaidStatus(r?.status)) {
        const amt = parseAmount(r);
        if (isSubscription(r)) {
          sub += amt;
        } else {
          single += amt;
        }
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

  const totalPlayers = chartData.reduce((a, c) => a + c.players, 0);

  return (
    <div className="bg-[#2c241b] rounded-2xl border border-[#493622] p-6 h-full flex flex-col">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div className="flex flex-col">
          <h3 className="text-white text-xl font-black">
            Performance Financière
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[10px] text-[#cbad90] font-bold uppercase tracking-widest">
              Revenus cumulés
            </span>
            <div className="size-1.5 rounded-full bg-[#0bda16] animate-pulse"></div>
          </div>
        </div>

        <div className="flex gap-2">
          <select
            value={revenueType}
            onChange={(e) => setRevenueType(e.target.value)}
            className="bg-[#231a10] text-[#cbad90] text-[10px] font-bold uppercase px-4 py-2 rounded-lg border border-[#493622] outline-none focus:border-primary transition-all cursor-pointer"
          >
            <option value="all">Tout</option>
            <option value="single">Matchs</option>
            <option value="sub">Abonnements</option>
          </select>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="bg-[#231a10] text-[#cbad90] text-[10px] font-bold uppercase px-4 py-2 rounded-lg border border-[#493622] outline-none focus:border-primary transition-all cursor-pointer"
          >
            <option value="week">7 jours</option>
            <option value="month">30 jours</option>
          </select>
        </div>
      </div>

      <div className="mb-8">
        <div className="flex items-baseline gap-2">
          <h4 className="text-white text-4xl font-black tracking-tighter">
            {totalRevenue.toLocaleString()}
          </h4>
          <span className="text-[#f27f0d] font-bold text-sm uppercase">
            FCFA
          </span>
        </div>
        <p className="text-[#cbad90] text-xs mt-1 font-medium italic">
          Basé sur les transactions confirmées
        </p>
      </div>

      <div className="flex-1 w-full relative min-h-[220px]">
        <ResponsiveContainer width="99%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorSingle" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f27f0d" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#f27f0d" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorSub" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#493622"
            />
            <XAxis
              dataKey="name"
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
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="singleRevenue"
              stroke="#f27f0d"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorSingle)"
              animationDuration={1500}
            />
            <Area
              type="monotone"
              dataKey="subRevenue"
              stroke="#3b82f6"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorSub)"
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DashboardCharts;
