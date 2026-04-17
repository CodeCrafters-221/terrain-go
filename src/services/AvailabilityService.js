import { supabase } from "./supabaseClient";
import { getSafeErrorMessage } from "../utils/security";
import {
  toMinutes,
  getDayOfWeek,
  getDayName,
  getDayShortName as getDayShortNameUtil,
  getCurrentDateTimeInfo,
  TIME_CONSTANTS,
} from "../utils/dateTime";

/**
 * Service de gestion des disponibilités (table disponibilite)
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

  getDayShortName(dayOfWeek) {
    return getDayShortNameUtil(dayOfWeek);
  },

  calculateEndTime(startTime, durationHours) {
    if (!startTime) return "";
    const [hours, minutes] = startTime.split(":").map(Number);
    const date = new Date(2000, 0, 1, hours, minutes);
    const durationInMinutes = Math.round(Number(durationHours) * 60);
    date.setMinutes(date.getMinutes() + durationInMinutes);
    const h = String(date.getHours()).padStart(2, "0");
    const m = String(date.getMinutes()).padStart(2, "0");
    return `${h}:${m}`;
  },

  // --- FETCH disponibilités d'un terrain ---
  async getFieldAvailability(fieldId) {
    const { data, error } = await supabase
      .from("disponibilite")
      .select("*")
      .eq("field_id", fieldId)
      .order("day_of_week", { ascending: true })
      .order("start_time", { ascending: true });

    if (error) throw new Error(getSafeErrorMessage(error));
    return data || [];
  },

  // --- SET disponibilités d'un terrain ---
  async setFieldAvailability(fieldId, availabilities) {
    const { error: deleteError } = await supabase
      .from("disponibilite")
      .delete()
      .eq("field_id", fieldId);

    if (deleteError) throw new Error(getSafeErrorMessage(deleteError));

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

    if (insertError) throw new Error(getSafeErrorMessage(insertError));
    return data;
  },

  // --- GET disponibilité pour un terrain à une date précise ---
  async getAvailabilityForDate(fieldId, dateString) {
    const dayOfWeek = this.getDayOfWeek(dateString);
    if (dayOfWeek === -1) return [];

    try {
      const { data, error } = await supabase
        .from("disponibilite")
        .select("start_time, end_time")
        .eq("field_id", fieldId)
        .eq("day_of_week", dayOfWeek);

      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error("Error getAvailabilityForDate:", err);
      return [];
    }
  },

  // --- Vérifier si un terrain a des disponibilités définies ---
  async hasDefinedAvailability(fieldId) {
    try {
      const { data, error } = await supabase
        .from("disponibilite")
        .select("id")
        .eq("field_id", fieldId)
        .limit(1);

      if (error) return false;
      return data && data.length > 0;
    } catch (err) {
      return false;
    }
  },

  toMinutes(timeStr) {
    if (!timeStr) return 0;
    const [h, m] = timeStr.split(":").map(Number);
    const minutes = h * 60 + (m || 0);
    return minutes === 0 && timeStr.includes("00:00") ? 1440 : minutes;
  },

  // --- GET créneaux libres ---
  async getAvailableSlots(fieldId, dateString, durationHours = 1) {
    const DEFAULT_HOURS = [{ start_time: "08:00:00", end_time: "00:00:00" }];
    let availability = [];

    const hasDefined = await this.hasDefinedAvailability(fieldId);
    if (hasDefined) {
      const dayAvailability = await this.getAvailabilityForDate(fieldId, dateString);
      if (dayAvailability && dayAvailability.length > 0) {
        availability = dayAvailability;
      } else {
        return [];
      }
    } else {
      availability = DEFAULT_HOURS;
    }

    const now = new Date();
    const todayStr = now.toISOString().split("T")[0];
    const currentMins = now.getHours() * 60 + now.getMinutes();

    const [resResult, subResult] = await Promise.all([
      supabase.from("reservations").select("start_time, end_time, status").eq("field_id", fieldId).eq("date", dateString).neq("status", "Annulé").neq("status", "Expiré"),
      supabase.from("subscriptions").select("start_time, end_time").eq("field_id", fieldId).eq("day_of_week", this.getDayOfWeek(dateString)).lte("start_date", dateString).gte("end_date", dateString).in("status", ["active", "Confirmé", "En attente de paiement", "Payé"])
    ]);

    const reservations = resResult.data || [];
    const subscriptions = subResult.data || [];

    const slots = [];
    const durationMins = durationHours * 60;

    for (const range of availability) {
      const rangeStart = this.toMinutes(range.start_time);
      const rangeEnd = this.toMinutes(range.end_time);

      for (let startMins = rangeStart; startMins + durationMins <= rangeEnd; startMins += 60) {
        const endMins = startMins + durationMins;
        const timeSlot = `${String(Math.floor(startMins / 60)).padStart(2, "0")}:${String(startMins % 60).padStart(2, "0")}`;

        const isPast = dateString === todayStr && endMins <= currentMins + 10;
        const hasConflict = [...reservations, ...subscriptions].some(b => {
          const bStart = this.toMinutes(b.start_time);
          const bEnd = this.toMinutes(b.end_time);
          return !(endMins <= bStart || startMins >= bEnd);
        });

        slots.push({ time: timeSlot, available: !isPast && !hasConflict });
      }
    }
    return slots;
  },

  async checkOverlap(fieldId, date, startTime, endTime) {
    const startMins = this.toMinutes(startTime);
    const endMins = this.toMinutes(endTime);
    const dayOfWeek = this.getDayOfWeek(date);

    const [resResult, subResult] = await Promise.all([
      supabase.from("reservations").select("start_time, end_time").eq("field_id", fieldId).eq("date", date).neq("status", "Annulé").neq("status", "Expiré"),
      supabase.from("subscriptions").select("start_time, end_time").eq("field_id", fieldId).eq("day_of_week", dayOfWeek).lte("start_date", date).gte("end_date", date).in("status", ["active", "Confirmé", "En attente de paiement", "Payé"])
    ]);

    const conflicts = [...(resResult.data || []), ...(subResult.data || [])];
    for (const b of conflicts) {
      if (!(endMins <= this.toMinutes(b.start_time) || startMins >= this.toMinutes(b.end_time))) {
        return { available: false, reason: "Ce créneau chevauche une réservation ou un abonnement existant." };
      }
    }
    return { available: true };
  }
};
