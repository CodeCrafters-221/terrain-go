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
 * Service de gestion des disponibilit�s (table disponibilite)
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

  // --- FETCH disponibilit�s d'un terrain ---
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

  // --- SET disponibilit�s d'un terrain (bulk insert apr�s suppression) ---
  async setFieldAvailability(fieldId, availabilities) {
    // 1. Supprimer l'ancienne disponibilit�
    const { error: deleteError } = await supabase
      .from("disponibilite")
      .delete()
      .eq("field_id", fieldId);

    if (deleteError) throw deleteError;

    // 2. Ins�rer les nouvelles disponibilit�s
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

  // --- GET disponibilit� pour un terrain � une date pr�cise ---
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
      console.error("? Erreur getAvailabilityForDate:", err);
      return [];
    }
  },

  // --- V�rifier si un terrain a des disponibilit�s d�finies ---
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
      console.warn("?? hasDefinedAvailability error:", err.message || err);
      return false;
    }
  },

  // --- HELPER : Convert "HH:MM" to minutes from start of day ---
  toMinutes(timeStr) {
    if (!timeStr) return 0;
    const [h, m] = timeStr.split(":").map(Number);
    // Handle midnight as 24:00 for end times in comparisons
    return h * 60 + (m || 0);
  },

  // --- GET cr�neaux libres pour un terrain � une date pr�cise ---
  async getAvailableSlots(fieldId, dateString, durationHours = 1) {
    const EXPIRATION_LIMIT_MINUTES = 20;
    const BUFFER_TIME_MINUTES = 10;

    const DEFAULT_HOURS = [{ start_time: "08:00:00", end_time: "00:00:00" }];
    let availability = []; // On part d'un terrain FERM� par d�faut pour les vrais terrains

    const isUuid =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
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
            // EXPLICITEMENT FERM� : Le terrain a des horaires, mais rien pour ce jour
            return [];
          }
        } else {
          // FALLBACK : Terrain sans aucune config -> on ouvre par d�faut
          availability = DEFAULT_HOURS;
        }
      } catch (err) {
        console.error("? Crash checking availability, assuming closed:", err);
        return [];
      }
    } else {
      // Demo / Mock (IDs type 'default-1', 'p1'...)
      availability = DEFAULT_HOURS;
    }

    // --- D�terminer si c'est aujourd'hui pour bloquer les cr�neaux pass�s ---
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
        .neq("status", "Annul�")
        .neq("status", "Expir�");

      const subscriptionsQuery = supabase
        .from("subscriptions")
        .select("start_time, end_time, start_date, end_date")
        .eq("field_id", fieldId)
        .eq("day_of_week", targetDayOfWeek)
        .in("status", ["active", "Confirm�", "En attente de paiement", "Pay�"])
        .lte("start_date", dateString)
        .gte("end_date", dateString);

      // Execute both queries
      const [resResult, subResult] = await Promise.all([
        reservationsQuery,
        subscriptionsQuery,
      ]);

      if (resResult.error) {
        console.error("? Error fetching reservations:", resResult.error);
      } else {
        reservations = resResult.data || [];
        // Filter out expired pending reservations
        reservations = reservations.filter((res) => {
          if (res.status === "En attente de paiement") {
            const createdMs = new Date(res.created_at).getTime();
            const minutesSinceCreation =
              (now.getTime() - createdMs) / (1000 * 60);
            return minutesSinceCreation < EXPIRATION_LIMIT_MINUTES;
          }
          return true;
        });
      }

      if (subResult.error) {
        console.error("? Error fetching subscriptions:", subResult.error);
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
        if (
          this.toMinutes(next.start_time) <= this.toMinutes(current.end_time)
        ) {
          // Fusionner les plages qui se chevauchent
          current.end_time = next.end_time;
        } else {
          mergedAvailability.push(current);
          current = { ...next };
        }
      }
      mergedAvailability.push(current);
    }

    // --- G�n�rer les cr�neaux disponibles ---
    const availableSlots = [];
    const durationMins = durationHours * 60;

    for (const slot of mergedAvailability) {
      const slotStartMins = this.toMinutes(slot.start_time);
      const slotEndMins = this.toMinutes(slot.end_time);

      // Pour chaque plage d'ouverture, g�n�rer des cr�neaux de 1h
      for (
        let startMins = slotStartMins;
        startMins + durationMins <= slotEndMins;
        startMins += 60
      ) {
        const endMins = startMins + durationMins;

        // V�rifier si c'est aujourd'hui et si le cr�neau n'est pas d�j� pass�
        if (dateString === todayStr) {
          if (endMins <= currentMins + BUFFER_TIME_MINUTES) {
            continue; // Cr�neau pass�
          }
        }

        // V�rifier les conflits avec les r�servations existantes
        const hasReservationConflict = reservations.some((res) => {
          const resStart = this.toMinutes(res.start_time);
          const resEnd = this.toMinutes(res.end_time);
          return !(endMins <= resStart || startMins >= resEnd);
        });

        // V�rifier les conflits avec les abonnements
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

  // --- HELPER : Validation d'ID ---
  _isValidId(id) {
    if (!id) return false;
    const isUuid =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        id,
      );
    const isNumeric = /^\d+$/.test(id);
    return isUuid || isNumeric;
  },
};
