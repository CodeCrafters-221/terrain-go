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
        const parts = dateString.split("-");
        if (parts.length !== 3) return [];

        const year = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1; // 0-11
        const day = parseInt(parts[2], 10);

        const date = new Date(year, month, day);
        const dayOfWeek = date.getDay(); // 0=Dimanche, 1=Lundi, etc.

        console.log(`📅 getAvailabilityForDate: ${dateString} -> day ${dayOfWeek}`);

        try {
            const { data, error } = await supabase
                .from("disponibilite")
                .select("start_time, end_time")
                .eq("field_id", fieldId)
                .eq("day_of_week", dayOfWeek);

            if (error) {
                if (error.code === '22P02') {
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
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(fieldId);
        const isNumeric = /^\d+$/.test(fieldId);
        if (!isUuid && !isNumeric) return false;

        try {
            const { data, error } = await supabase
                .from("disponibilite")
                .select("id")
                .eq("field_id", fieldId)
                .limit(1);

            if (error) {
                if (error.code === '22P02') return false; // Invalid UUID
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
        const [h, m] = timeStr.split(':').map(Number);
        // Handle midnight as 24:00 for end times in comparisons
        return h * 60 + (m || 0);
    },

    // ─── GET créneaux libres pour un terrain à une date précise ───
    async getAvailableSlots(fieldId, dateString, durationHours = 1) {
        console.log("🔍 getAvailableSlots start:", { fieldId, dateString });

        const EXPIRATION_LIMIT_MINUTES = 20;
        const BUFFER_TIME_MINUTES = 10;

        const DEFAULT_HOURS = [{ start_time: "08:00:00", end_time: "23:00:00" }];
        let availability = []; // On part d'un terrain FERMÉ par défaut pour les vrais terrains

        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(fieldId);
        const isNumeric = /^\d+$/.test(fieldId);
        const isReal = isUuid || isNumeric;

        if (isReal) {
            try {
                const hasDefined = await this.hasDefinedAvailability(fieldId);
                console.log(`🏗️ hasDefinedAvailability for ${fieldId}:`, hasDefined);

                if (hasDefined) {
                    const dayAvailability = await this.getAvailabilityForDate(fieldId, dateString);
                    if (dayAvailability && dayAvailability.length > 0) {
                        availability = dayAvailability;
                    } else {
                        // EXPLICITEMENT FERMÉ : Le terrain a des horaires, mais rien pour ce jour
                        console.log("🚫 Terrain fermé ce jour-là (défini mais vide)");
                        return [];
                    }
                } else {
                    // FALLBACK : Terrain sans aucune config -> on ouvre par défaut
                    console.log("⚠️ Fallback DEFAULT_HOURS (non configuré)");
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
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const todayStr = `${year}-${month}-${day}`;
        const currentMins = now.getHours() * 60 + now.getMinutes();

        let reservations = [];
        try {
            const { data, error } = await supabase
                .from("reservations")
                .select("start_time, end_time, status, created_at")
                .eq("field_id", fieldId)
                .eq("date", dateString)
                .neq("status", "Annulé")
                .neq("status", "Expiré");

            if (!error) {
                // LOGIQUE 1 : Filtrer les réservations expirées (En attente + > 20 min)
                const nowMs = new Date().getTime();
                reservations = (data || []).filter(res => {
                    if (res.status === "En attente de paiement") {
                        const createdMs = new Date(res.created_at).getTime();
                        const diffMins = (nowMs - createdMs) / (1000 * 60);
                        return diffMins < EXPIRATION_LIMIT_MINUTES;
                    }
                    return true;
                });
            }
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

        const durationMins = Math.round(parseFloat(durationHours) * 60);

        return allSlots.map(slot => {
            const slotMins = this.toMinutes(slot);
            const slotEndMins = slotMins + durationMins;

            // 1. Vérifier si c'est dans le passé (pour aujourd'hui)
            let isPast = false;
            if (dateString === todayStr) {
                isPast = slotMins < currentMins;
            } else if (dateString < todayStr) {
                isPast = true;
            }

            // 2. Vérifier si ça sort des heures d'ouverture (LOGIQUE 2)
            const isWithinHours = availability.some(avail => {
                const aStart = this.toMinutes(avail.start_time);
                let aEnd = this.toMinutes(avail.end_time);
                if (aEnd === 0 || aEnd <= aStart) aEnd = 1440;
                return slotMins >= aStart && slotEndMins <= aEnd;
            });

            // 3. Vérifier si c'est réservé (LOGIQUE 2 & 4 avec Buffer)
            const isReserved = reservations.some(res => {
                const rStart = this.toMinutes(res.start_time);
                let rEnd = this.toMinutes(res.end_time);

                if (rEnd === 0 && res.end_time.startsWith("00")) rEnd = 1440;
                if (rEnd <= rStart) rEnd += 1440;

                // LOGIQUE 4 : Ajouter un buffer de 10 min après chaque réservation
                const rEndWithBuffer = rEnd + BUFFER_TIME_MINUTES;

                // Check overlap between [slotMins, slotEndMins] and [rStart, rEndWithBuffer]
                return slotMins < rEndWithBuffer && slotEndMins > rStart;
            });

            return {
                time: slot,
                available: !isReserved && !isPast && isWithinHours
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
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const todayStr = `${year}-${month}-${day}`;
        const currentMins = now.getHours() * 60 + now.getMinutes();

        if (dateString < todayStr) {
            return { available: false, reason: "La date choisie est déjà passée." };
        }

        const startM = this.toMinutes(startTime);
        if (dateString === todayStr && startM < currentMins) {
            return { available: false, reason: "Ce créneau horaire est déjà passé." };
        }

        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(fieldId);
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
                        return { available: false, reason: "Le terrain est fermé ce jour-là." };
                    }
                } else {
                    // Fallback pour terrains non configurés
                    availability = [{ start_time: "08:00", end_time: "23:00" }];
                }
            } catch (err) {
                return { available: false, reason: "Erreur lors de la vérification des disponibilités." };
            }
        } else {
            // Demo
            availability = [{ start_time: "08:00", end_time: "23:00" }];
        }

        let endM = this.toMinutes(endTime);
        if (endM <= startM) endM += 1440;

        const isWithinHours = availability.some(avail => {
            const aStart = this.toMinutes(avail.start_time);
            let aEnd = this.toMinutes(avail.end_time);
            if (aEnd === 0 || aEnd <= aStart) aEnd = 1440;
            return startM >= aStart && endM <= aEnd;
        });

        if (!isWithinHours) {
            return { available: false, reason: "Le créneau demandé (comprenant la durée) dépasse les heures d'ouverture." };
        }

        const { data, error } = await supabase
            .from("reservations")
            .select("id, start_time, end_time, status, created_at")
            .eq("field_id", fieldId)
            .eq("date", dateString)
            .neq("status", "Annulé")
            .neq("status", "Expiré");

        if (error) throw error;

        // LOGIQUE 1 : Filtrer les expirés
        const nowMs = new Date().getTime();
        const activeReservations = (data || []).filter(res => {
            if (res.status === "En attente de paiement") {
                const createdMs = new Date(res.created_at).getTime();
                const diffMins = (nowMs - createdMs) / (1000 * 60);
                return diffMins < EXPIRATION_LIMIT_MINUTES;
            }
            return true;
        });

        const overlap = activeReservations.some(res => {
            const rStart = this.toMinutes(res.start_time);
            let rEnd = this.toMinutes(res.end_time);
            if (rEnd === 0 || rEnd <= rStart) rEnd = 1440;

            // LOGIQUE 4 : Buffer
            const rEndWithBuffer = rEnd + BUFFER_TIME_MINUTES;

            return startM < rEndWithBuffer && endM > rStart;
        });

        return overlap
            ? { available: false, reason: "Ce créneau (ou une partie) est déjà réservé ou nécessite un délai de préparation." }
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
