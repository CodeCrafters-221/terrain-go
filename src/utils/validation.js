/**
 * Utilitaires de validation pour l'application
 */

/**
 * Valide si une date est dans le passé
 * @param {string} dateStr - Date au format YYYY-MM-DD
 * @returns {boolean}
 */
export const isPastDate = (dateStr) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const date = new Date(dateStr);
  return date < today;
};

/**
 * Valide si un créneau horaire est cohérent
 * @param {string} start - Heure de début (HH:MM)
 * @param {string} end - Heure de fin (HH:MM)
 * @returns {boolean}
 */
export const isValidTimeRange = (start, end) => {
  if (!start || !end) return false;
  return start < end;
};

/**
 * Valide un montant
 * @param {number|string} amount
 * @returns {boolean}
 */
export const isValidAmount = (amount) => {
  const val = Number(amount);
  return !isNaN(val) && val >= 0;
};

/**
 * Valide un UUID
 * @param {string} uuid
 * @returns {boolean}
 */
export const isValidUUID = (uuid) => {
  const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return regex.test(uuid);
};

/**
 * Valide un ID terrain (UUID ou BigInt)
 * @param {string|number} id
 * @returns {boolean}
 */
export const isValidFieldId = (id) => {
  const s = String(id ?? "").trim();
  if (!s) return false;
  const isNumeric = /^\d+$/.test(s);
  return isNumeric || isValidUUID(s);
};
