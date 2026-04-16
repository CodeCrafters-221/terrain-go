import React, { useState, useMemo } from "react";
import { useDashboard } from "../../context/DashboardContext";
import { toast } from "react-toastify";

// 🔥 HELPERS ROBUSTES (Synchronisés avec DashboardCharts)
const parseAmount = (item) => {
  const val = item?.amount ?? item?.total_price ?? item?.total_amount ?? 0;
  if (typeof val === "string") {
    return parseInt(val.replace(/[^0-9]/g, "")) || 0;
  }
  return Number(val) || 0;
};

const normalizeDate = (dateInput) => {
  if (!dateInput) return "Date Inconnue";
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return "Date Invalide";
  return d.toLocaleDateString("en-CA");
};

const getStatusColor = (status) => {
  const s = (status || "").toLowerCase();
  if (s === "payé" || s === "confirmé" || s === "active" || s === "success")
    return "text-green-500 bg-green-500/10 border-green-500/20";
  if (s === "annulé") return "text-red-500 bg-red-500/10 border-red-500/20";
  return "text-yellow-500 bg-yellow-500/10 border-yellow-500/20";
};

const isPaidStatus = (status) =>
  ["payé", "confirmé", "active", "success"].includes(
    (status || "").toLowerCase(),
  );

// Fonction pour formater le montant avec espaces
const formatAmount = (amount) => {
  return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
};
const filterTransactionsByPeriod = (transactions, period) => {
  if (period === "all") return transactions;

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  return transactions.filter((tx) => {
    const txDate = new Date(tx.date);
    if (isNaN(txDate.getTime())) return false;

    switch (period) {
      case "day":
        return txDate >= today;
      case "week": {
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay());
        return txDate >= weekStart;
      }
      case "month": {
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        return txDate >= monthStart;
      }
      default:
        return true;
    }
  });
};

const Revenues = () => {
  const { reservations = [], subscriptions = [] } = useDashboard();
  const [currentPage, setCurrentPage] = useState(1);
  const [periodFilter, setPeriodFilter] = useState("all"); // "all", "day", "week", "month"
  const itemsPerPage = 6;

  const allTransactions = useMemo(() => {
    const res = reservations.map((r) => {
      const isSub = !!(
        r?.subscription_id ||
        r?.reservation_type === "subscription" ||
        r?.reservationType === "subscription"
      );

      return {
        id: r?.id,
        client: r?.clientName || r?.userName || "Client Inconnu",
        amount: parseAmount(r),
        status: r?.status || "Inconnu",
        date: normalizeDate(r?.date || r?.created_at),
        type: isSub ? "subscription" : "match",
        field: r?.fieldName || r?.field_name || r?.terrain || "Terrain Inconnu",
      };
    });

    const subs = subscriptions.map((s) => ({
      id: s?.id,
      client: s?.clientName || "Abonné Inconnu",
      amount: parseAmount(s),
      status: s?.status || "Inconnu",
      date: normalizeDate(
        s?.createdAt || s?.created_at || s?.startDate || s?.start_date,
      ),
      type: "subscription",
      field: "Tous les terrains", // Les abonnements s'appliquent généralement à tous les terrains
    }));

    // Fusion et tri par date DESC
    return [...res, ...subs].sort((a, b) => {
      const dateA = a.date === "Date Inconnue" ? 0 : new Date(a.date).getTime();
      const dateB = b.date === "Date Inconnue" ? 0 : new Date(b.date).getTime();
      return dateB - dateA;
    });
  }, [reservations, subscriptions]);

  const transactions = useMemo(() => {
    return filterTransactionsByPeriod(allTransactions, periodFilter);
  }, [allTransactions, periodFilter]);

  // Calcul des totaux par catégorie
  const summary = useMemo(() => {
    return transactions.reduce(
      (acc, tx) => {
        if (isPaidStatus(tx.status)) {
          if (tx.type === "subscription") acc.subTotal += tx.amount;
          else acc.matchTotal += tx.amount;
        }
        return acc;
      },
      { subTotal: 0, matchTotal: 0 },
    );
  }, [transactions]);

  const totalPages = Math.ceil(transactions.length / itemsPerPage);
  const paginatedTransactions = useMemo(() => {
    return transactions.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage,
    );
  }, [transactions, currentPage]);

  const handleExportExcel = () => {
    if (!transactions?.length) return toast.warn("Aucune donnée à exporter");

    const headers = [
      "ID",
      "Client",
      "Terrain",
      "Montant (CFA)",
      "Statut",
      "Date",
      "Type de Revenu",
    ];

    const rows = transactions.map((t) => [
      t.id,
      t.client,
      t.field,
      t.amount,
      t.status,
      t.date,
      t.type === "subscription" ? "Abonnement" : "Match Unique",
    ]);

    // Construction du CSV avec virgules (format Excel standard)
    const csvContent = [headers, ...rows]
      .map((row) =>
        row
          .map((cell) => {
            // Échapper les guillemets et entourer de guillemets si nécessaire
            const cellStr = String(cell);
            if (
              cellStr.includes(",") ||
              cellStr.includes('"') ||
              cellStr.includes("\n")
            ) {
              return `"${cellStr.replace(/"/g, '""')}"`;
            }
            return cellStr;
          })
          .join(","),
      )
      .join("\n");

    const blob = new Blob(["\uFEFF" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `revenus_footbooking_${periodFilter}_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    toast.success("Fichier Excel généré avec succès");
  };

  const handleExportPDF = async () => {
    if (!transactions?.length) return toast.warn("Aucune donnée à exporter");

    try {
      const [{ default: jsPDF }, { default: autoTable }] = await Promise.all([
        import("jspdf"),
        import("jspdf-autotable"),
      ]);

      const doc = new jsPDF();

      // En-tête du document
      doc.setFontSize(14, "bold", "italic");
      doc.setTextColor(35, 26, 16); // #231a10
      const periodLabels = {
        all: "TOUTES PÉRIODES",
        day: "AUJOURD'HUI",
        week: "CETTE SEMAINE",
        month: "CE MOIS",
      };
      doc.text(
        `FOOTBOOKING - RAPPORT FINANCIER (${periodLabels[periodFilter]})
        `,
        14,
        22,
      );

      doc.setFontSize(11);
      doc.setTextColor(100);
      doc.text(
        `Généré le : ${new Date().toLocaleDateString("fr-FR")} à ${new Date().toLocaleTimeString("fr-FR")}`,
        12,
        32,
      );

      // Résumé des totaux
      doc.setFont("helvetica", "bold");
      doc.setTextColor(35, 26, 16);
      const total = formatAmount(summary.subTotal + summary.matchTotal);
      doc.text(`TOTAL DES ENCAISSEMENTS : ${total} CFA`, 14, 42);

      doc.setDrawColor(242, 127, 13); // Couleur primaire
      doc.line(14, 45, 196, 45); // Ligne de séparation

      // Génération du tableau avec autoTable
      const tableData = transactions.map((t) => [
        String(t.id ?? "N/A").substring(0, 8),
        t.client,
        t.field,
        `${formatAmount(t.amount)} CFA`,
        t.date,
        t.type === "subscription" ? "Abonnement" : "Match Unique",
        t.status.toUpperCase(),
      ]);

      autoTable(doc, {
        head: [
          ["ID", "Client", "Terrain", "Montant", "Date", "Type", "Statut"],
        ],
        body: tableData,
        startY: 55,
        theme: "striped",
        headStyles: {
          fillColor: [242, 127, 13], // Orange #f27f0d
          textColor: [255, 255, 255],
          fontSize: 10,
          fontStyle: "bold",
        },
        bodyStyles: {
          fontSize: 9,
          cellPadding: 4,
        },
        alternateRowStyles: {
          fillColor: [250, 245, 240],
        },
      });

      doc.save(
        `rapport_revenus_footbooking_${periodFilter}_${new Date().toISOString().split("T")[0]}.pdf`,
      );
      toast.success("PDF généré avec succès");
    } catch (error) {
      console.error("Erreur export PDF:", error);
      toast.error("Impossible de générer le PDF pour le moment.");
    }
  };

  return (
    <div className="flex flex-col gap-8 pb-20 relative">
      {/* Recapitulatif des Revenus */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-[#2c241b] p-6 rounded-3xl border border-[#493622] flex flex-col gap-2 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined text-6xl text-blue-400">
              autorenew
            </span>
          </div>
          <span className="text-[#cbad90] text-xs font-bold uppercase tracking-widest">
            Total Abonnements
            {periodFilter !== "all" && (
              <span className="text-primary ml-2">
                (
                {periodFilter === "day"
                  ? "Aujourd'hui"
                  : periodFilter === "week"
                    ? "Cette semaine"
                    : "Ce mois"}
                )
              </span>
            )}
          </span>
          <div className="flex items-end gap-2">
            <h3 className="text-3xl font-black text-white leading-none">
              {formatAmount(summary.subTotal)}
            </h3>
            <span className="text-primary text-sm font-bold">CFA</span>
          </div>
          <p className="text-[#cbad90] text-[10px] font-medium mt-1">
            Revenus récurrents mensuels
          </p>
        </div>

        <div className="bg-[#2c241b] p-6 rounded-3xl border border-[#493622] flex flex-col gap-2 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined text-6xl text-primary">
              sports_soccer
            </span>
          </div>
          <span className="text-[#cbad90] text-xs font-bold uppercase tracking-widest">
            Total Matchs Uniques
            {periodFilter !== "all" && (
              <span className="text-primary ml-2">
                (
                {periodFilter === "day"
                  ? "Aujourd'hui"
                  : periodFilter === "week"
                    ? "Cette semaine"
                    : "Ce mois"}
                )
              </span>
            )}
          </span>
          <div className="flex items-end gap-2">
            <h3 className="text-3xl font-black text-white leading-none">
              {formatAmount(summary.matchTotal)}
            </h3>
            <span className="text-primary text-sm font-bold">CFA</span>
          </div>
          <p className="text-[#cbad90] text-[10px] font-medium mt-1">
            Revenus des réservations ponctuelles
          </p>
        </div>
      </div>

      {/* Header avec bouton d'export */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex flex-col">
          <h2 className="text-white text-3xl font-black italic tracking-tight">
            Historique des Revenus
          </h2>
          <p className="text-[#cbad90] text-sm mt-1">
            Suivez l'ensemble de vos encaissements en temps réel
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleExportExcel}
            className="bg-green-600 text-sm text-white px-4 py-2 rounded-xl font-bold hover:shadow-[0_0_20px_rgba(34,197,94,0.4)] transition-all flex items-center justify-center gap-1 active:scale-95 shadow-lg"
          >
            <span className="material-symbols-outlined text-[20px]">
              description
            </span>
            Excel
          </button>
          <button
            onClick={handleExportPDF}
            className="bg-primary text-sm text-[#231a10] px-4 py-2 rounded-xl font-bold hover:shadow-[0_0_20px_rgba(242,127,13,0.4)] transition-all flex items-center justify-center gap-1 active:scale-95 shadow-lg"
          >
            <span className="material-symbols-outlined text-[20px]">
              picture_as_pdf
            </span>
            PDF
          </button>
        </div>
      </div>

      {/* Filtres de période */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col">
          <h3 className="text-white text-lg font-bold">Filtrer par période</h3>
          <p className="text-[#cbad90] text-sm">
            Choisissez la période pour afficher les revenus
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          {[
            { key: "all", label: "Tout", icon: "calendar_view_month" },
            { key: "day", label: "Aujourd'hui", icon: "today" },
            { key: "week", label: "Cette semaine", icon: "date_range" },
            { key: "month", label: "Ce mois", icon: "calendar_month" },
          ].map(({ key, label, icon }) => (
            <button
              key={key}
              onClick={() => setPeriodFilter(key)}
              className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-2 active:scale-95 shadow-lg ${
                periodFilter === key
                  ? "bg-primary text-[#231a10] shadow-[0_0_20px_rgba(242,127,13,0.4)]"
                  : "bg-[#2c241b] text-white border border-[#493622] hover:border-primary/50"
              }`}
            >
              <span className="material-symbols-outlined text-lg">{icon}</span>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Liste des Transactions en Grille */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {transactions.length === 0 ? (
          <div className="col-span-full py-20 bg-[#2c241b]/50 border-2 border-dashed border-[#493622] rounded-3xl flex flex-col items-center justify-center text-center px-6">
            <div className="size-20 rounded-full bg-[#493622]/40 flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-4xl text-[#5d452b]">
                payments
              </span>
            </div>
            <h3 className="text-white font-bold text-xl">Aucune transaction</h3>
            <p className="text-[#cbad90] mt-1">
              Vos revenus apparaîtront ici dès les premiers paiements.
            </p>
          </div>
        ) : (
          paginatedTransactions.map((tx) => (
            <div
              key={tx.id}
              className="group bg-[#2c241b] rounded-3xl border border-[#493622] hover:border-primary/50 transition-all overflow-hidden shadow-lg"
            >
              <div className="p-6 flex flex-col gap-5">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div
                      className={`size-12 rounded-2xl flex items-center justify-center font-black text-lg border ${
                        tx.type === "subscription"
                          ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                          : "bg-primary/10 text-primary border-primary/20"
                      }`}
                    >
                      <span className="material-symbols-outlined">
                        {tx.type === "subscription"
                          ? "autorenew"
                          : "sports_soccer"}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <h4 className="text-white font-bold leading-tight group-hover:text-primary transition-colors">
                        {tx.client}
                      </h4>
                      <p className="text-[#cbad90] text-[10px] uppercase font-black tracking-widest opacity-60 mt-0.5">
                        {tx.type === "subscription"
                          ? "Abonnement"
                          : "Match Unique"}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded-lg text-[8px] font-black uppercase tracking-wider border ${getStatusColor(tx.status)}`}
                  >
                    {tx.status}
                  </span>
                </div>

                <div className="bg-[#231a10]/50 rounded-2xl p-4 flex flex-col gap-3 border border-[#493622]/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-lg">
                        calendar_today
                      </span>
                      <p className="text-white text-sm font-medium">
                        {tx.date}
                      </p>
                    </div>
                    <p className="text-[#cbad90] text-[10px] font-mono">
                      ID: {tx.id.toString().substring(0, 8)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <p className="text-[#cbad90] text-xs font-bold uppercase tracking-widest">
                    Montant encaissé
                  </p>
                  <p className="text-white text-2xl font-black tracking-tighter">
                    {formatAmount(tx.amount)}{" "}
                    <span className="text-primary text-xs ml-0.5 uppercase">
                      CFA
                    </span>
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-6 mt-4">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="size-12 rounded-xl border border-[#493622] bg-[#2c241b] text-white flex items-center justify-center hover:border-primary disabled:opacity-30 transition-all shadow-lg"
          >
            <span className="material-symbols-outlined">chevron_left</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-primary font-black text-lg">
              {currentPage}
            </span>
            <span className="text-[#cbad90] font-bold text-xs uppercase tracking-widest">
              / {totalPages}
            </span>
          </div>

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="size-12 rounded-xl border border-[#493622] bg-[#2c241b] text-white flex items-center justify-center hover:border-primary disabled:opacity-30 transition-all shadow-lg"
          >
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default Revenues;
