import { supabase } from "./supabaseClient";

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

        const rows = availabilities.map(a => ({
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
        // dateString format attendu: "YYYY-MM-DD"
        // On parse manuellement pour éviter les décalages de fuseau horaire
        const parts = dateString.split("-");
        if (parts.length !== 3) return [];

        const year = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1; // 0-11
        const day = parseInt(parts[2], 10);

        const date = new Date(year, month, day);
        const dayOfWeek = date.getDay(); // 0=Dimanche, 1=Lundi, etc.

        console.log(`📅 Calcul du jour pour ${dateString}: ${this.getDayName(dayOfWeek)} (${dayOfWeek})`);

        const { data, error } = await supabase
            .from("disponibilite")
            .select("start_time, end_time")
            .eq("field_id", fieldId)
            .eq("day_of_week", dayOfWeek);

        if (error) throw error;
        return data || [];
    },

    // ─── Vérifier si un terrain a des disponibilités définies ───
    async hasDefinedAvailability(fieldId) {
        try {
            const { data, error } = await supabase
                .from("disponibilite")
                .select("id")
                .eq("field_id", fieldId)
                .limit(1);

            if (error) {
                console.warn("⚠️ hasDefinedAvailability error:", error.message);
                return false; // En cas d'erreur → considérer comme non défini → fallback
            }
            return data && data.length > 0;
        } catch (err) {
            console.warn("⚠️ hasDefinedAvailability exception:", err);
            return false;
        }
    },

    // ─── HELPER : Convert "HH:MM" to minutes from start of day ───
    toMinutes(timeStr) {
        if (!timeStr) return 0;
        const [h, m] = timeStr.split(':').map(Number);
        // Handle midnight as 24:00 for end times in comparisons
        return h * 60 + (m || 0);
    },

    // ─── GET créneaux libres pour un terrain à une date précise ───
    async getAvailableSlots(fieldId, dateString) {
        console.log("🔍 getAvailableSlots called:", { fieldId, dateString });

        const DEFAULT_HOURS = [{ start_time: "08:00:00", end_time: "23:00:00" }];
        let availability = DEFAULT_HOURS;

        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(fieldId);

        if (isUuid) {
            try {
                const hasDefined = await this.hasDefinedAvailability(fieldId);
                if (hasDefined) {
                    const dayAvailability = await this.getAvailabilityForDate(fieldId, dateString);
                    if (dayAvailability && dayAvailability.length > 0) {
                        availability = dayAvailability;
                    } else {
                        return [];
                    }
                }
            } catch (err) {
                console.warn("⚠️ Error checking availability:", err);
            }
        }

        let reservations = [];
        try {
            const { data, error } = await supabase
                .from("reservations")
                .select("start_time, end_time, status")
                .eq("field_id", fieldId)
                .eq("date", dateString)
                .neq("status", "Annulé")
                .neq("status", "Expiré");

            if (!error) reservations = data || [];
        } catch (err) { }

        const allSlots = [];
        for (const avail of availability) {
            const startH = parseInt(avail.start_time.split(':')[0], 10);
            let endH = parseInt(avail.end_time.split(':')[0], 10);
            if (endH === 0) endH = 24;

            for (let h = startH; h < endH; h++) {
                allSlots.push(`${String(h).padStart(2, "0")}:00`);
            }
        }

        return allSlots.map(slot => {
            const slotMins = this.toMinutes(slot);
            const isReserved = reservations.some(res => {
                const startMins = this.toMinutes(res.start_time);
                let endMins = this.toMinutes(res.end_time);

                // Si end_time est "00:00", on le traite comme 1440 mins (24h)
                if (endMins === 0 && res.end_time.startsWith("00")) endMins = 1440;
                // Si end < start, c'est que ça traverse minuit
                if (endMins <= startMins) endMins += 1440;

                return slotMins >= startMins && slotMins < endMins;
            });

            return { time: slot, available: !isReserved };
        });
    },

    // ─── VÉRIFIER chevauchement avant réservation ───
    async checkOverlap(fieldId, dateString, startTime, endTime) {
        const hasDefined = await this.hasDefinedAvailability(fieldId);
        let availability = hasDefined
            ? await this.getAvailabilityForDate(fieldId, dateString)
            : [{ start_time: "08:00", end_time: "23:00" }];

        if (hasDefined && availability.length === 0) {
            return { available: false, reason: "Le terrain est fermé ce jour-là." };
        }

        const startM = this.toMinutes(startTime);
        let endM = this.toMinutes(endTime);
        if (endM <= startM) endM += 1440;

        const isWithinHours = availability.some(avail => {
            const aStart = this.toMinutes(avail.start_time);
            let aEnd = this.toMinutes(avail.end_time);
            if (aEnd === 0 || aEnd <= aStart) aEnd = 1440;
            return startM >= aStart && endM <= aEnd;
        });

        if (!isWithinHours) {
            return { available: false, reason: "Le créneau demandé est hors des heures d'ouverture." };
        }

        const { data: existing, error } = await supabase
            .from("reservations")
            .select("id, start_time, end_time")
            .eq("field_id", fieldId)
            .eq("date", dateString)
            .neq("status", "Annulé")
            .neq("status", "Expiré");

        if (error) throw error;

        const overlap = (existing || []).some(res => {
            const rStart = this.toMinutes(res.start_time);
            let rEnd = this.toMinutes(res.end_time);
            if (rEnd === 0 || rEnd <= rStart) rEnd = 1440;

            return startM < rEnd && endM > rStart;
        });

        return overlap
            ? { available: false, reason: "Ce créneau est déjà réservé." }
            : { available: true, reason: null };
    },

    // ─── HELPER : Noms des jours ───
    getDayName(dayOfWeek) {
        const days = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
        return days[dayOfWeek] || "Inconnu";
    },

    getDayShortName(dayOfWeek) {
        const days = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
        return days[dayOfWeek] || "?";
    },
};
