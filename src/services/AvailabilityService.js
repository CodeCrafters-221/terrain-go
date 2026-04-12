import { supabase } from "./supabaseClient";
import {
  toMinutes,
  getDayOfWeek,
  getDayName,
  getDayShortName,
  getCurrentDateTimeInfo,
  TIME_CONSTANTS,
} from "../utils/dateTime";

/**
 * Service de gestion des disponibilités (table `disponibilite`)
 *
 * Table schema:
 *   id          - UUID (auto)
 *   field_id    - UUID (FK vers fields)
 *   day_of_week - integer (0=Dimanche, 1=Lundi, ..., 6=Samedi)
 *   start_time  - time (ex: "08:00:00")
 *   end_time    - time (ex: "22:00:00")
 */
export const AvailabilityService = {
  // Helper to get day of week (0-6) from "YYYY-MM-DD"
  getDayOfWeek(dateString) {
    const parts = dateString.split("-");
    if (parts.length !== 3) return -1;
    const date = new Date(
      parseInt(parts[0], 10),
      parseInt(parts[1], 10) - 1,
      parseInt(parts[2], 10),
    );
    return date.getDay();
  },

  // ─── FETCH disponibilités d'un terrain ───
  async getFieldAvailability(fieldId) {
    const { data, error } = await supabase
      .from("disponibilite")
      .select("*")
      .eq("field_id", fieldId)
      .order("day_of_week", { ascending: true })
      .order("start_time", { ascending: true });

    if (error) throw error;
    return data || [];
  },

  // ─── SET disponibilités d'un terrain (bulk insert après suppression) ───
  async setFieldAvailability(fieldId, availabilities) {
    // 1. Supprimer l'ancienne disponibilité
    const { error: deleteError } = await supabase
      .from("disponibilite")
      .delete()
      .eq("field_id", fieldId);

    if (deleteError) throw deleteError;

    // 2. Insérer les nouvelles disponibilités
    if (availabilities.length === 0) return [];

    const rows = availabilities.map((a) => ({
      field_id: fieldId,
      day_of_week: a.day_of_week,
      start_time: a.start_time,
      end_time: a.end_time,
    }));

    const { data, error: insertError } = await supabase
      .from("disponibilite")
      .insert(rows)
      .select();

    if (insertError) throw insertError;
    return data;
  },

  // ─── GET disponibilité pour un terrain à une date précise ───
  async getAvailabilityForDate(fieldId, dateString) {
    const dayOfWeek = this.getDayOfWeek(dateString);
    if (dayOfWeek === -1) return [];

    console.log(`📅 getAvailabilityForDate: ${dateString} -> day ${dayOfWeek}`);

    try {
      const { data, error } = await supabase
        .from("disponibilite")
        .select("start_time, end_time")
        .eq("field_id", fieldId)
        .eq("day_of_week", dayOfWeek);

      if (error) {
        if (error.code === "22P02") {
          console.warn(`⚠️ Format UUID invalide pour field_id: ${fieldId}`);
          return [];
        }
        throw error;
      }
      return data || [];
    } catch (err) {
      console.error("❌ Erreur getAvailabilityForDate:", err);
      return [];
    }
  },

  // ─── Vérifier si un terrain a des disponibilités définies ───
  async hasDefinedAvailability(fieldId) {
    const isUuid =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        fieldId,
      );
    const isNumeric = /^\d+$/.test(fieldId);
    if (!isUuid && !isNumeric) return false;

    try {
      const { data, error } = await supabase
        .from("disponibilite")
        .select("id")
        .eq("field_id", fieldId)
        .limit(1);

      if (error) {
        if (error.code === "22P02") return false; // Invalid UUID
        throw error;
      }
      return data && data.length > 0;
    } catch (err) {
      console.warn("⚠️ hasDefinedAvailability error:", err.message || err);
      return false;
    }
  },

  // ─── HELPER : Convert "HH:MM" to minutes from start of day ───
  toMinutes(timeStr) {
    if (!timeStr) return 0;
    const [h, m] = timeStr.split(":").map(Number);
    // Handle midnight as 24:00 for end times in comparisons
    return h * 60 + (m || 0);
  },

  // ─── GET créneaux libres pour un terrain à une date précise ───
  async getAvailableSlots(fieldId, dateString, durationHours = 1) {
    const EXPIRATION_LIMIT_MINUTES = 20;
    const BUFFER_TIME_MINUTES = 10;

    const DEFAULT_HOURS = [{ start_time: "08:00:00", end_time: "00:00:00" }];
    let availability = []; // On part d'un terrain FERMÉ par défaut pour les vrais terrains

    const isUuid =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        fieldId,
      );
    const isNumeric = /^\d+$/.test(fieldId);
    const isReal = isUuid || isNumeric;

    if (isReal) {
      try {
        const hasDefined = await this.hasDefinedAvailability(fieldId);

        if (hasDefined) {
          const dayAvailability = await this.getAvailabilityForDate(
            fieldId,
            dateString,
          );
          if (dayAvailability && dayAvailability.length > 0) {
            availability = dayAvailability;
          } else {
            // EXPLICITEMENT FERMÉ : Le terrain a des horaires, mais rien pour ce jour
            return [];
          }
        } else {
          // FALLBACK : Terrain sans aucune config -> on ouvre par défaut
          availability = DEFAULT_HOURS;
        }
      } catch (err) {
        console.error("❌ Crash checking availability, assuming closed:", err);
        return [];
      }
    } else {
      // Demo / Mock (IDs type 'default-1', 'p1'...)
      availability = DEFAULT_HOURS;
    }

    // --- Déterminer si c'est aujourd'hui pour bloquer les créneaux passés ---
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const todayStr = `${year}-${month}-${day}`;
    const currentMins = now.getHours() * 60 + now.getMinutes();

    let reservations = [];
    let subscriptions = [];

    try {
      const targetDayOfWeek = this.getDayOfWeek(dateString);

      const reservationsQuery = supabase
        .from("reservations")
        .select("start_time, end_time, status, created_at")
        .eq("field_id", fieldId)
        .eq("date", dateString)
        .neq("status", "Annulé")
        .neq("status", "Expiré");

      const subscriptionsQuery = supabase
        .from("subscriptions")
        .select("start_time, end_time, start_date, end_date")
        .eq("field_id", fieldId)
        .eq("day_of_week", targetDayOfWeek)
        .in("status", ["active", "Confirmé", "En attente de paiement", "Payé"])
        .lte("start_date", dateString)
        .gte("end_date", dateString);

      // Execute both queries
      const [resResult, subResult] = await Promise.all([
        reservationsQuery,
        subscriptionsQuery,
      ]);

      if (resResult.error) {
        console.error("❌ Error fetching reservations:", resResult.error);
      } else {
        reservations = resResult.data || [];
        // Filter out expired pending reservations
        reservations = reservations.filter((res) => {
          if (res.status === "En attente de paiement") {
            const createdMs = new Date(res.created_at).getTime();
            const minutesSinceCreation = (now.getTime() - createdMs) / (1000 * 60);
            return minutesSinceCreation < EXPIRATION_LIMIT_MINUTES;
          }
          return true;
        });
      }

      if (subResult.error) {
        console.error("❌ Error fetching subscriptions:", subResult.error);
      } else {
        subscriptions = subResult.data || [];
      }
    } catch (err) {
      console.error("Error fetching availability data:", err);
    }

    // --- Fusionner les plages d'ouverture pour le jour J ---
    const mergedAvailability = [];
    if (availability.length > 0) {
      const sorted = [...availability].sort(
        (a, b) => this.toMinutes(a.start_time) - this.toMinutes(b.start_time),
      );

      let current = { ...sorted[0] };
      for (let i = 1; i < sorted.length; i++) {
        const next = sorted[i];
        if (this.toMinutes(next.start_time) <= this.toMinutes(current.end_time)) {
          // Fusionner les plages qui se chevauchent
          current.end_time = next.end_time;
        } else {
          mergedAvailability.push(current);
          current = { ...next };
        }
      }
      mergedAvailability.push(current);
    }

    // --- Générer les créneaux disponibles ---
    const availableSlots = [];
    const durationMins = durationHours * 60;

    for (const slot of mergedAvailability) {
      const slotStartMins = this.toMinutes(slot.start_time);
      const slotEndMins = this.toMinutes(slot.end_time);

      // Pour chaque plage d'ouverture, générer des créneaux de 1h
      for (
        let startMins = slotStartMins;
        startMins + durationMins <= slotEndMins;
        startMins += 60
      ) {
        const endMins = startMins + durationMins;

        // Vérifier si c'est aujourd'hui et si le créneau n'est pas déjà passé
        if (dateString === todayStr) {
          if (endMins <= currentMins + BUFFER_TIME_MINUTES) {
            continue; // Créneau passé
          }
        }

        // Vérifier les conflits avec les réservations existantes
        const hasReservationConflict = reservations.some((res) => {
          const resStart = this.toMinutes(res.start_time);
          const resEnd = this.toMinutes(res.end_time);
          return !(endMins <= resStart || startMins >= resEnd);
        });

        // Vérifier les conflits avec les abonnements
        const hasSubscriptionConflict = subscriptions.some((sub) => {
          const subStart = this.toMinutes(sub.start_time);
          const subEnd = this.toMinutes(sub.end_time);
          return !(endMins <= subStart || startMins >= subEnd);
        });

        if (!hasReservationConflict && !hasSubscriptionConflict) {
          const startTime = `${String(Math.floor(startMins / 60)).padStart(2, "0")}:${String(startMins % 60).padStart(2, "0")}`;
          const endTime = `${String(Math.floor(endMins / 60)).padStart(2, "0")}:${String(endMins % 60).padStart(2, "0")}`;

          availableSlots.push({
            start_time: startTime,
            end_time: endTime,
            duration: durationHours,
          });
        }
      }
    }

    return availableSlots;
  },

  // ─── HELPER : Validation d'ID ───
  _isValidId(id) {
    if (!id) return false;
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
    const isNumeric = /^\d+$/.test(id);
    return isUuid || isNumeric;
  },
};
        (a, b) => toMinutes(a.start_time) - toMinutes(b.start_time),
      );
      let current = {
        start: toMinutes(sorted[0].start_time),
        end: toMinutes(sorted[0].end_time),
      };
      if (current.end === 0 || current.end <= current.start) current.end = 1440;

      for (let i = 1; i < sorted.length; i++) {
        const nextStart = toMinutes(sorted[i].start_time);
        let nextEnd = toMinutes(sorted[i].end_time);
        if (nextEnd === 0 || nextEnd <= nextStart) nextEnd = 1440;

        if (nextStart <= current.end) {
          current.end = Math.max(current.end, nextEnd);
        } else {
          mergedAvailability.push(current);
          current = { start: nextStart, end: nextEnd };
        }
      }
      mergedAvailability.push(current);
    }

    // --- Générer tous les créneaux possibles (toutes les 60 min) ---
    const allSlots = [];
    for (const range of mergedAvailability) {
      for (let m = range.start; m < range.end; m += 60) {
        const h = Math.floor(m / 60);
        const mins = m % 60;
        allSlots.push(
          `${String(h).padStart(2, "0")}:${String(mins).padStart(2, "0")}`,
        );
      }
    }

    const durationMins = Math.round(parseFloat(durationHours) * 60);

    return allSlots.map((slot) => {
      const slotMins = toMinutes(slot);
      const slotEndMins = slotMins + durationMins;

      // 1. Passé
      let isPast = false;
      if (dateString === todayStr) {
        isPast = slotMins < currentMins;
      } else if (dateString < todayStr) {
        isPast = true;
      }

      const isWithinHours = mergedAvailability.some(
        (range) => slotMins >= range.start && slotEndMins <= range.end,
      );
      const isReserved = this._checkConflict(slotMins, slotEndMins, [
        ...reservations,
        ...subscriptions,
      ]);

      return {
        time: slot,
        available: !isReserved && !isPast && isWithinHours,
      };
    });
  },

  // ─── VÉRIFIER chevauchement avant réservation ───
  async checkOverlap(fieldId, dateString, startTime, endTime) {
    const { todayStr, currentMins } = getCurrentDateTimeInfo();

    if (dateString < todayStr) {
      return { available: false, reason: "La date choisie est déjà passée." };
    }

    const startM = toMinutes(startTime);
    if (dateString === todayStr && startM < currentMins) {
      return { available: false, reason: "Ce créneau horaire est déjà passé." };
    }

    const isReal = this._isValidId(fieldId);

    let availability = [];
    let hasDefined = false;

    if (isReal) {
      try {
        hasDefined = await this.hasDefinedAvailability(fieldId);
        if (hasDefined) {
          availability = await this.getAvailabilityForDate(fieldId, dateString);
          if (availability.length === 0) {
            return {
              available: false,
              reason: "Le terrain est fermé ce jour-là.",
            };
          }
        } else {
          // Fallback pour terrains non configurés
          availability = [{ start_time: "08:00", end_time: "00:00" }];
        }
      } catch (err) {
        return {
          available: false,
          reason: "Erreur lors de la vérification des disponibilités.",
        };
      }
    } else {
      // Demo
      availability = [{ start_time: "08:00", end_time: "00:00" }];
    }

    let endM = toMinutes(endTime);
    if (endM <= startM) endM += 1440;

    const mergedAvail = this._mergeRanges(availability);

    const isWithinHours = mergedAvail.some(
      (range) => startM >= range.start && endM <= range.end,
    );

    if (!isWithinHours) {
      return {
        available: false,
        reason: "Le créneau demandé dépasse les heures d'ouverture.",
      };
    }

    const { reservations, subscriptions } = await this._fetchBusySlots(
      fieldId,
      dateString,
    );
    const overlap = this._checkConflict(startM, endM, [
      ...reservations,
      ...subscriptions,
    ]);

    return overlap
      ? {
          available: false,
          reason:
            "Ce créneau (ou une partie) est déjà réservé ou nécessite un délai de préparation.",
        }
      : { available: true, reason: null };
  },

  /**
   * Validation privée du format d'ID (UUID ou Numeric)
   */
  _isValidId(id) {
    if (!id) return false;
    const isUuid =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        id,
      );
    const isNumeric = /^\d+$/.test(id);
    return isUuid || isNumeric;
  },

  /**
   * Fusionne des plages horaires qui se chevauchent
   */
  _mergeRanges(ranges) {
    if (!ranges.length) return [];
    const sorted = [...ranges].sort(
      (a, b) => toMinutes(a.start_time) - toMinutes(b.start_time),
    );
    const merged = [];
    let current = {
      start: toMinutes(sorted[0].start_time),
      end: toMinutes(sorted[0].end_time),
    };
    if (current.end === 0 || current.end <= current.start) current.end = 1440;

    for (let i = 1; i < sorted.length; i++) {
      const nextStart = toMinutes(sorted[i].start_time);
      let nextEnd = toMinutes(sorted[i].end_time);
      if (nextEnd === 0 || nextEnd <= nextStart) nextEnd = 1440;
      if (nextStart <= current.end)
        current.end = Math.max(current.end, nextEnd);
      else {
        merged.push(current);
        current = { start: nextStart, end: nextEnd };
      }
    }
    merged.push(current);
    return merged;
  },

  /**
   * Récupère les réservations et abonnements pour une date donnée
   */
  async _fetchBusySlots(fieldId, dateString) {
    const { nowMs } = getCurrentDateTimeInfo();
    const targetDayOfWeek = getDayOfWeek(dateString);

    const [resResponse, subResponse] = await Promise.all([
      supabase
        .from("reservations")
        .select("start_time, end_time, status, created_at")
        .eq("field_id", fieldId)
        .eq("date", dateString)
        .neq("status", "Annulé")
        .neq("status", "Expiré"),
      supabase
        .from("subscriptions")
        .select("start_time, end_time, start_date, end_date")
        .eq("field_id", fieldId)
        .eq("day_of_week", targetDayOfWeek)
        .in("status", ["active", "Confirmé", "En attente de paiement", "Payé"])
        .lte("start_date", dateString)
        .gte("end_date", dateString),
    ]);

    const reservations = (resResponse.data || []).filter((res) => {
      if (res.status === "En attente de paiement") {
        const createdMs = new Date(res.created_at).getTime();
        return (
          (nowMs - createdMs) / 60000 < TIME_CONSTANTS.EXPIRATION_LIMIT_MINUTES
        );
      }
      return true;
    });

    return { reservations, subscriptions: subResponse.data || [] };
  },

  /**
   * Vérifie si un créneau entre en conflit avec une liste de réservations existantes
   */
  _checkConflict(startM, endM, busySlots) {
    return busySlots.some((item) => {
      const rStart = toMinutes(item.start_time);
      let rEnd = toMinutes(item.end_time);
      if (rEnd === 0 || rEnd <= rStart) rEnd = 1440;
      const rEndWithBuffer = rEnd + TIME_CONSTANTS.BUFFER_TIME_MINUTES;
      return startM < rEndWithBuffer && endM > rStart;
    });
  },
=======

      const [
        { data: resData, error: resError },
        { data: subData, error: subError },
      ] = await Promise.all([reservationsQuery, subscriptionsQuery]);

      if (!resError && resData) {
        const nowMs = new Date().getTime();
        reservations = resData.filter((res) => {
          if (res.status === "En attente de paiement") {
            const createdMs = new Date(res.created_at).getTime();
            return (nowMs - createdMs) / (1000 * 60) < EXPIRATION_LIMIT_MINUTES;
          }
          return true;
        });
      }

      if (!subError && subData) {
        subscriptions = subData;
      }
    } catch (err) {
      console.error("Error fetching availability data:", err);
    }

    // --- Fusionner les plages d'ouverture pour le jour J ---
    const mergedAvailability = [];
    if (availability.length > 0) {
      const sorted = [...availability].sort(
        (a, b) => this.toMinutes(a.start_time) - this.toMinutes(b.start_time),
      );
      let current = {
        start: this.toMinutes(sorted[0].start_time),
        end: this.toMinutes(sorted[0].end_time),
      };
      if (current.end === 0 || current.end <= current.start) current.end = 1440;

      for (let i = 1; i < sorted.length; i++) {
        const nextStart = this.toMinutes(sorted[i].start_time);
        let nextEnd = this.toMinutes(sorted[i].end_time);
        if (nextEnd === 0 || nextEnd <= nextStart) nextEnd = 1440;

        if (nextStart <= current.end) {
          current.end = Math.max(current.end, nextEnd);
        } else {
          mergedAvailability.push(current);
          current = { start: nextStart, end: nextEnd };
        }
      }
      mergedAvailability.push(current);
    }

    // --- Générer tous les créneaux possibles (toutes les 60 min) ---
    const allSlots = [];
    for (const range of mergedAvailability) {
      for (let m = range.start; m < range.end; m += 60) {
        const h = Math.floor(m / 60);
        const mins = m % 60;
        allSlots.push(
          `${String(h).padStart(2, "0")}:${String(mins).padStart(2, "0")}`,
        );
      }
    }

    const durationMins = Math.round(parseFloat(durationHours) * 60);

    return allSlots.map((slot) => {
      const slotMins = this.toMinutes(slot);
      const slotEndMins = slotMins + durationMins;

      // 1. Passé
      let isPast = false;
      if (dateString === todayStr) {
        isPast = slotMins < currentMins;
      } else if (dateString < todayStr) {
        isPast = true;
      }

      // 2. Horaires d'ouverture (doit tenir dans une plage fusionnée)
      const isWithinHours = mergedAvailability.some((range) => {
        return slotMins >= range.start && slotEndMins <= range.end;
      });

      // 3. Réservations ponctuelles & Abonnements & Buffer
      const isReserved = [...reservations, ...subscriptions].some((item) => {
        const rStart = this.toMinutes(item.start_time);
        let rEnd = this.toMinutes(item.end_time);
        if (rEnd === 0 || rEnd <= rStart) rEnd = 1440;

        const rEndWithBuffer = rEnd + BUFFER_TIME_MINUTES;
        return slotMins < rEndWithBuffer && slotEndMins > rStart;
      });

      return {
        time: slot,
        available: !isReserved && !isPast && isWithinHours,
      };
    });
  },

  // ─── VÉRIFIER chevauchement avant réservation ───
  async checkOverlap(fieldId, dateString, startTime, endTime) {
    const EXPIRATION_LIMIT_MINUTES = 20;
    const BUFFER_TIME_MINUTES = 10;

    // --- Vérification du temps passé ---
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const todayStr = `${year}-${month}-${day}`;
    const currentMins = now.getHours() * 60 + now.getMinutes();

    if (dateString < todayStr) {
      return { available: false, reason: "La date choisie est déjà passée." };
    }

    const startM = this.toMinutes(startTime);
    if (dateString === todayStr && startM < currentMins) {
      return { available: false, reason: "Ce créneau horaire est déjà passé." };
    }

    const isUuid =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        fieldId,
      );
    const isNumeric = /^\d+$/.test(fieldId);
    const isReal = isUuid || isNumeric;

    let availability = [];
    let hasDefined = false;

    if (isReal) {
      try {
        hasDefined = await this.hasDefinedAvailability(fieldId);
        if (hasDefined) {
          availability = await this.getAvailabilityForDate(fieldId, dateString);
          if (availability.length === 0) {
            return {
              available: false,
              reason: "Le terrain est fermé ce jour-là.",
            };
          }
        } else {
          // Fallback pour terrains non configurés
          availability = [{ start_time: "08:00", end_time: "00:00" }];
        }
      } catch (err) {
        return {
          available: false,
          reason: "Erreur lors de la vérification des disponibilités.",
        };
      }
    } else {
      // Demo
      availability = [{ start_time: "08:00", end_time: "00:00" }];
    }

    let endM = this.toMinutes(endTime);
    if (endM <= startM) endM += 1440;

    // Fusionner les plages pour le check aussi
    const mergedAvail = [];
    if (availability.length > 0) {
      const sorted = [...availability].sort(
        (a, b) => this.toMinutes(a.start_time) - this.toMinutes(b.start_time),
      );
      let curr = {
        start: this.toMinutes(sorted[0].start_time),
        end: this.toMinutes(sorted[0].end_time),
      };
      if (curr.end === 0 || curr.end <= curr.start) curr.end = 1440;
      for (let i = 1; i < sorted.length; i++) {
        const ns = this.toMinutes(sorted[i].start_time);
        let ne = this.toMinutes(sorted[i].end_time);
        if (ne === 0 || ne <= ns) ne = 1440;
        if (ns <= curr.end) curr.end = Math.max(curr.end, ne);
        else {
          mergedAvail.push(curr);
          curr = { start: ns, end: ne };
        }
      }
      mergedAvail.push(curr);
    }

    const isWithinHours = mergedAvail.some(
      (range) => startM >= range.start && endM <= range.end,
    );

    if (!isWithinHours) {
      return {
        available: false,
        reason: "Le créneau demandé dépasse les heures d'ouverture.",
      };
    }

    const targetDayOfWeek = this.getDayOfWeek(dateString);

    // 1. Check punctual reservations
    const { data: resData, error: resError } = await supabase
      .from("reservations")
      .select("id, start_time, end_time, status, created_at")
      .eq("field_id", fieldId)
      .eq("date", dateString)
      .neq("status", "Annulé")
      .neq("status", "Expiré");

    if (resError) throw resError;

    const nowMs = new Date().getTime();
    const activeReservations = (resData || []).filter((res) => {
      if (res.status === "En attente de paiement") {
        const createdMs = new Date(res.created_at).getTime();
        return (nowMs - createdMs) / (1000 * 60) < EXPIRATION_LIMIT_MINUTES;
      }
      return true;
    });

    // 2. Check active subscriptions
    const { data: subData, error: subError } = await supabase
      .from("subscriptions")
      .select("start_time, end_time, start_date, end_date")
      .eq("field_id", fieldId)
      .eq("day_of_week", targetDayOfWeek)
      .in("status", ["active", "Confirmé", "En attente de paiement", "Payé"])
      .lte("start_date", dateString)
      .gte("end_date", dateString);

    if (subError) throw subError;

    const overlap = [...activeReservations, ...subData].some((item) => {
      const rStart = this.toMinutes(item.start_time);
      let rEnd = this.toMinutes(item.end_time);
      if (rEnd === 0 || rEnd <= rStart) rEnd = 1440;

      const rEndWithBuffer = rEnd + BUFFER_TIME_MINUTES;
      return startM < rEndWithBuffer && endM > rStart;
    });

    return overlap
      ? {
          available: false,
          reason:
            "Ce créneau (ou une partie) est déjà réservé ou nécessite un délai de préparation.",
        }
      : { available: true, reason: null };
  },

  // ─── HELPER : Noms des jours ───
  getDayName(dayOfWeek) {
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
  },

  getDayShortName(dayOfWeek) {
    const days = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
    return days[dayOfWeek] || "?";
  },
>>>>>>> features/by-azizDev
};
