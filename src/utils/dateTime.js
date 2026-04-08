/**
 * Utilitaires pour la gestion des dates et heures
 */

export const TIME_CONSTANTS = {
  EXPIRATION_LIMIT_MINUTES: 20,
  BUFFER_TIME_MINUTES: 10,
  DEFAULT_SLOT_DURATION: 60,
};

/**
 * Convertit "HH:MM" ou "HH:MM:SS" en minutes depuis le début de la journée
 */
export const toMinutes = (timeStr) => {
  if (!timeStr) return 0;
  const [h, m] = timeStr.split(":").map(Number);
  return h * 60 + (m || 0);
};

/**
 * Retourne l'index du jour de la semaine (0-6)
 */
export const getDayOfWeek = (dateString) => {
  const parts = dateString.split("-");
  if (parts.length !== 3) return -1;
  const date = new Date(
    parseInt(parts[0], 10),
    parseInt(parts[1], 10) - 1,
    parseInt(parts[2], 10),
  );
  return date.getDay();
};

/**
 * Retourne le nom complet du jour
 */
export const getDayName = (dayOfWeek) => {
  const days = [
    "Dimanche",
    "Lundi",
    "Mardi",
    "Mercredi",
    "Jeudi",
    "Vendredi",
    "Samedi",
  ];
  return days[dayOfWeek] || "Inconnu";
};

/**
 * Récupère la date du jour au format YYYY-MM-DD et l'heure en minutes
 */
export const getCurrentDateTimeInfo = () => {
  const now = new Date();
  const todayStr = now.toISOString().split("T")[0];
  const currentMins = now.getHours() * 60 + now.getMinutes();
  return { todayStr, currentMins, nowMs: now.getTime() };
};

/**
 * Formate une date pour l'affichage (ex: "15 Oct")
 */
export const formatDisplayDate = (dateString) => {
  if (!dateString) return { month: "---", day: "--" };
  const date = new Date(dateString);
  const month = date
    .toLocaleDateString("fr-FR", { month: "short" })
    .replace(".", "");
  const day = date.getDate();
  return { month, day };
};

/**
 * Retourne le nom court du jour (0-6)
 */
export const getDayShortName = (dayOfWeek) => {
  const days = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
  return days[dayOfWeek] || "?";
};

/**
 * Nettoie et convertit un montant en nombre (ex: "20.000 CFA" -> 20000)
 */
export const parseAmount = (item) => {
  const val =
    item?.price ?? item?.amount ?? item?.total_price ?? item?.total_amount ?? 0;
  if (typeof val === "string") return parseInt(val.replace(/[^0-9]/g, "")) || 0;
  return Number(val) || 0;
};

/**
 * Vérifie si un statut est considéré comme "payé/confirmé"
 */
export const isPaidStatus = (status) => {
  const s = (status || "").toLowerCase();
  return ["payé", "confirmé", "active", "success"].includes(s);
};

/**
 * Vérifie si un item est un abonnement
 */
export const isSubscription = (res) =>
  !!(
    res?.subscription_id ||
    res?.reservation_type === "subscription" ||
    res?.reservationType === "subscription"
  );

/**
 * Normalise une date en YYYY-MM-DD local
 */
export const normalizeDate = (dateInput) => {
  if (!dateInput) return "";
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-CA");
};
