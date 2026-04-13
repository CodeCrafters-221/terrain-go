import React, { useMemo } from "react";
import { useDashboard } from "../context/DashboardContext";
import { parseAmount, isPaidStatus, isSubscription } from "../utils/dateTime";

const DashboardStats = () => {
  const { fields = [], reservations = [], subscriptions = [] } = useDashboard();

  // Calculs en temps réel
  const realStats = useMemo(() => {
    const now = new Date();
    const todayStr = now.toLocaleDateString("en-CA");

    const totalFields = fields.length;
    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);
    last7Days.setHours(0, 0, 0, 0);

    const prev7Days = new Date(last7Days);
    prev7Days.setDate(prev7Days.getDate() - 7);

    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // 1. Nouveaux terrains ce mois-ci
    const fieldsThisMonth = fields.filter((f) => {
      const created = new Date(f.created_at || f.createdAt);
      return created >= firstDayOfMonth;
    }).length;

    // 2. Calcul du revenu hebdomadaire (Matchs + Abonnements) et croissance
    let weeklyRevenue = 0;
    let prevWeeklyRevenue = 0;

    // Revenus des réservations uniques payées ces 7 derniers jours
    reservations.forEach((res) => {
      if (!isPaidStatus(res.status) || isSubscription(res)) return;
      const resDate = new Date(res.originalDate || res.createdAt);
      if (isNaN(resDate.getTime())) return;
      const amt = parseAmount(res);
      if (resDate >= last7Days) weeklyRevenue += amt;
      else if (resDate >= prev7Days) prevWeeklyRevenue += amt;
    });

    // Revenus des abonnements payés ces 7 derniers jours
    subscriptions.forEach((sub) => {
      if (!isPaidStatus(sub.status)) return;
      const subDate = new Date(
        sub.startDate || sub.start_date || sub.createdAt,
      );
      if (isNaN(subDate.getTime())) return;
      const amt = parseAmount(sub);
      if (subDate >= last7Days) weeklyRevenue += amt;
      else if (subDate >= prev7Days) prevWeeklyRevenue += amt;
    });

    const revenueGrowth =
      prevWeeklyRevenue === 0
        ? weeklyRevenue > 0
          ? 100
          : 0
        : Math.round(
            ((weeklyRevenue - prevWeeklyRevenue) / prevWeeklyRevenue) * 100,
          );

    // 3. Réservations Actives & Volume du jour
    const activeResCount = reservations.filter((r) =>
      isPaidStatus(r.status),
    ).length;

    const matchesToday = reservations.filter((r) => {
      const dateStr = r.originalDate || r.createdAt;
      if (!dateStr) return false;
      const rDate = new Date(dateStr);
      if (isNaN(rDate.getTime())) return false;
      return (
        isPaidStatus(r.status) && rDate.toLocaleDateString("en-CA") === todayStr
      );
    }).length;

    // Taux d'occupation simplifié (basé sur le volume de réservations vs capacité théorique)
    const theoreticalMax = totalFields * 10 * 7;
    const recentResCount = reservations.filter((r) => {
      const dateStr = r.originalDate || r.createdAt;
      if (!dateStr) return false;
      const resDate = new Date(dateStr);
      return !isNaN(resDate.getTime()) && resDate >= last7Days;
    }).length;

    const occupancy =
      theoreticalMax > 0
        ? Math.min(100, (recentResCount / theoreticalMax) * 100).toFixed(1)
        : 0;

    return {
      totalFields,
      fieldsThisMonth,
      activeReservations: activeResCount,
      matchesToday,
      weeklyRevenue,
      revenueGrowth,
      occupancyRate: `${occupancy}%`,
    };
  }, [fields, reservations, subscriptions]);

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Stat Card 1 */}
      <div className="flex flex-col gap-2 rounded-2xl p-6 bg-[#2c241b] border border-[#493622] hover:border-[#f27f0d]/30 transition-colors">
        <div className="flex items-center justify-between">
          <p className="text-[#cbad90] text-sm font-medium">Total Terrains</p>
          <span className="material-symbols-outlined text-[#f27f0d]">
            stadium
          </span>
        </div>
        <div className="flex items-end gap-2">
          <p className="text-white text-2xl md:text-3xl font-bold">
            {realStats.totalFields}
          </p>
          <p className="text-[#0bda16] text-xs font-medium mb-1.5 flex items-center">
            <span className="material-symbols-outlined text-[14px]">
              trending_up
            </span>
            +{realStats.fieldsThisMonth} ce mois
          </p>
        </div>
      </div>

      {/* Stat Card 2 */}
      <div className="flex flex-col gap-2 rounded-2xl p-6 bg-[#2c241b] border border-[#493622] hover:border-[#f27f0d]/30 transition-colors">
        <div className="flex items-center justify-between">
          <p className="text-[#cbad90] text-sm font-medium">
            Réservations Actives
          </p>
          <span className="material-symbols-outlined text-[#f27f0d]">
            event_available
          </span>
        </div>
        <div className="flex items-end gap-2">
          <p className="text-white text-2xl md:text-3xl font-bold">
            {realStats.activeReservations}
          </p>
          <p className="text-[#0bda16] text-xs font-medium mb-1.5 flex items-center">
            <span className="material-symbols-outlined text-[14px]">
              trending_up
            </span>
            {realStats.matchesToday} aujourd'hui
          </p>
        </div>
      </div>

      {/* Stat Card 3 */}
      <div className="flex flex-col gap-2 rounded-2xl p-6 bg-[#2c241b] border border-[#493622] hover:border-[#f27f0d]/30 transition-colors">
        <div className="flex items-center justify-between">
          <p className="text-[#cbad90] text-sm font-medium">Revenus Hebdo</p>
          <span className="material-symbols-outlined text-[#f27f0d]">
            account_balance_wallet
          </span>
        </div>
        <div className="flex items-end gap-2">
          <p className="text-white text-2xl md:text-3xl font-bold">
            {(realStats.weeklyRevenue / 1000).toFixed(1)}k{" "}
            <span className="text-base md:text-lg font-normal text-[#cbad90]">
              CFA
            </span>
          </p>
          <p
            className={`${realStats.revenueGrowth >= 0 ? "text-[#0bda16]" : "text-red-500"} text-xs font-medium mb-1.5 flex items-center`}
          >
            <span className="material-symbols-outlined text-[14px]">
              {realStats.revenueGrowth >= 0 ? "trending_up" : "trending_down"}
            </span>
            {realStats.revenueGrowth >= 0 ? "+" : ""}
            {realStats.revenueGrowth}%
          </p>
        </div>
      </div>

      {/* Stat Card 4 */}
      <div className="flex flex-col gap-2 rounded-2xl p-6 bg-[#2c241b] border border-[#493622] hover:border-[#f27f0d]/30 transition-colors">
        <div className="flex items-center justify-between">
          <p className="text-[#cbad90] text-sm font-medium">
            Taux d'occupation
          </p>
          <span className="material-symbols-outlined text-[#f27f0d]">
            monitoring
          </span>
        </div>
        <div className="flex items-end gap-2">
          <p className="text-white text-2xl md:text-3xl font-bold">
            {realStats.occupancyRate}
          </p>
          <p className="text-[#cbad90] text-xs font-medium mb-1.5 italic">
            Mesure réelle
          </p>
        </div>
      </div>
    </section>
  );
};

export default DashboardStats;
