import { supabase } from "./supabaseClient";
import { sanitizeString, sanitizePhone, getSafeErrorMessage } from "../utils/security";
import { isValidFieldId, isPastDate, isValidTimeRange, isValidAmount } from "../utils/validation";

/** Supabase error logger */
const logSupabaseError = (context, error) => {
  console.error(`❌ [ReservationService] ${context}`);
  console.error("  message :", error?.message);
  console.error("  details :", error?.details);
  console.error("  hint    :", error?.hint);
  console.error("  code    :", error?.code);
};

export const ReservationService = {
  // ─── Auth helper ────────────────────────────────────────────────────────────
  async _getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) {
      throw new Error("Session expirée de l'utilisateur.");
    }
    return user;
  },

  /** Format "HH:MM - HH:MM" from nullable time strings */
  _formatTimeRange(start, end) {
    const s = typeof start === "string" ? start.slice(0, 5) : "--:--";
    const e = typeof end === "string" ? end.slice(0, 5) : "--:--";
    return `${s} - ${e}`;
  },

  // ─── FETCH (OWNER VIEW) ────────────────────────────────────────────────────
  async getOwnerReservations() {
    const user = await this._getCurrentUser();

    const { data, error } = await supabase
      .from("reservations")
      .select(`
        *, 
        fields!inner (id, name, proprietaire_id)
      `)
      .eq("fields.proprietaire_id", user.id)
      .order("date", { ascending: false })
      .order("start_time", { ascending: true });

    if (error) {
      logSupabaseError("getOwnerReservations", error);
      throw new Error(getSafeErrorMessage(error));
    }

    // Enrichissement manuel car la relation SQL peut manquer
    const enrichedData = await this._enrichWithProfiles(data ?? []);
    return enrichedData.map((r) => this._mapReservation(r, "owner"));
  },

  // ─── FETCH (CLIENT VIEW) ───────────────────────────────────────────────────
  async getUserReservations() {
    const user = await this._getCurrentUser();

    const { data, error } = await supabase
      .from("reservations")
      .select(`*, fields (id, name, adress, field_images (url_image))`)
      .eq("user_id", user.id)
      .order("date", { ascending: false });

    if (error) {
      logSupabaseError("getUserReservations", error);
      throw new Error(getSafeErrorMessage(error));
    }

    return (data ?? []).map((r) => this._mapReservation(r, "client"));
  },

  // ─── CREATE — ONLINE (user via app) ────────────────────────────────────────
  async createOnlineReservation(data) {
    const user = await this._getCurrentUser();

    if (!isValidFieldId(data.field_id)) throw new Error("ID du terrain invalide.");
    if (isPastDate(data.date)) throw new Error("La date ne peut pas être dans le passé.");
    if (!isValidTimeRange(data.start_time, data.end_time)) throw new Error("Plage horaire invalide.");
    
    const price = Number(data.total_price);
    if (!isValidAmount(price)) throw new Error("Montant invalide.");

    const payload = {
      field_id: data.field_id,
      user_id: user.id,
      date: data.date,
      start_time: data.start_time,
      end_time: data.end_time,
      total_price: price,
      status: "En attente",
      client_name: null,
      client_phone: null,
      payment_method: "En ligne",
      reservation_type: data.reservation_type || "single",
      subscription_id: data.subscription_id ?? null,
    };

    const { data: inserted, error } = await supabase
      .from("reservations")
      .insert([payload])
      .select()
      .single();

    if (error) {
      logSupabaseError("createOnlineReservation", error);
      throw new Error(getSafeErrorMessage(error));
    }

    return inserted;
  },

  // ─── CREATE — ONSITE (manual entry by field owner) ─────────────────────────
  async createOnsiteReservation(data) {
    const user = await this._getCurrentUser();

    if (!isValidFieldId(data.field_id)) throw new Error("ID terrain invalide.");
    if (isPastDate(data.date)) throw new Error("Date invalide.");
    if (!isValidTimeRange(data.start_time, data.end_time)) throw new Error("Heures invalides.");
    if (!data.client_name?.trim()) throw new Error("Nom client requis.");
    if (!data.client_phone?.trim()) throw new Error("Téléphone client requis.");

    const price = Number(data.total_price);

    const { data: fieldCheck } = await supabase
      .from("fields")
      .select("id")
      .eq("id", data.field_id)
      .eq("proprietaire_id", user.id)
      .single();

    if (!fieldCheck) {
      throw new Error("Action non autorisée : vous n'êtes pas propriétaire.");
    }

    const payload = {
      field_id: data.field_id,
      user_id: null,
      date: data.date,
      start_time: data.start_time,
      end_time: data.end_time,
      total_price: price,
      status: "Confirmé",
      client_name: sanitizeString(data.client_name),
      client_phone: sanitizePhone(data.client_phone),
      payment_method: "Espèces",
      reservation_type: data.reservation_type || "onsite",
      subscription_id: data.subscription_id ?? null,
    };

    const { data: inserted, error } = await supabase
      .from("reservations")
      .insert([payload])
      .select()
      .single();

    if (error) {
      logSupabaseError("createOnsiteReservation", error);
      throw new Error(getSafeErrorMessage(error));
    }

    return inserted;
  },

  // ─── UPDATE STATUS ─────────────────────────────────────────────────────────
  async updateStatus(id, status) {
    await this._getCurrentUser();

    const { data, error } = await supabase
      .from("reservations")
      .update({ status })
      .eq("id", id)
      .select("*, fields(name)")
      .single();

    if (error) {
      logSupabaseError("updateStatus", error);
      throw new Error(getSafeErrorMessage(error));
    }

    if (status === "Payé" || status === "Confirmé") {
      await this._triggerPaymentNotification(data);
    }

    return data;
  },

  async updateSubscriptionStatus(id, status) {
    await this._getCurrentUser();

    const { data, error } = await supabase
      .from("subscriptions")
      .update({ status })
      .eq("id", id)
      .select("*, fields(name)")
      .single();

    if (error) {
      logSupabaseError("updateSubscriptionStatus", error);
      throw new Error(getSafeErrorMessage(error));
    }

    return data;
  },

  async _triggerPaymentNotification(reservation) {
    try {
// console.log(`✉️ Notification : Réservation ${reservation.id} → ${reservation.fields?.name}`);
    } catch (err) {
      console.error("Erreur notification:", err);
    }
  },

  // ─── SUBSCRIPTIONS ─────────────────────────────────────────────────────────
  async createSubscription(data) {
    const user = await this._getCurrentUser();

    if (!isValidFieldId(data.field_id)) throw new Error("ID terrain invalide.");

    const payload = {
      user_id: data.user_id || user.id,
      field_id: data.field_id,
      client_name: sanitizeString(data.client_name),
      client_phone: sanitizePhone(data.client_phone),
      day_of_week: data.day_of_week,
      start_time: data.start_time,
      end_time: data.end_time,
      start_date: data.start_date,
      end_date: data.end_date,
      total_amount: Number(data.total_amount ?? 0),
      status: data.status || "En attente",
      payment_method: data.payment_method ?? "Espèces",
    };

    const { data: inserted, error } = await supabase
      .from("subscriptions")
      .insert(payload)
      .select()
      .single();

    if (error) {
      logSupabaseError("createSubscription", error);
      throw new Error(getSafeErrorMessage(error));
    }

    return inserted;
  },

  async getOwnerSubscriptions(ownerId) {
    const { data, error } = await supabase
      .from("subscriptions")
      .select(`
        *, 
        fields!inner (name, proprietaire_id)
      `)
      .eq("fields.proprietaire_id", ownerId)
      .order("created_at", { ascending: false });

    if (error) {
      logSupabaseError("getOwnerSubscriptions", error);
      throw new Error(getSafeErrorMessage(error));
    }

    const enrichedData = await this._enrichWithProfiles(data ?? []);
    return enrichedData.map((s) => this._mapSubscription(s));
  },

  async cancelSubscription(id) {
    await this._getCurrentUser();
    const { error } = await supabase
      .from("subscriptions")
      .update({ status: "Annulé" })
      .eq("id", id);
    if (error) {
      logSupabaseError("cancelSubscription", error);
      throw new Error(getSafeErrorMessage(error));
    }
  },

  // ─── MAPPERS ───────────────────────────────────────────────────────────────
  _mapReservation(r, viewType) {
    const terrain = r.fields ?? {};
    const images = terrain.field_images ?? [];

    return {
      id: r.id,
      field_id: r.field_id,
      date: r.date,
      startTime: r.start_time ?? null,
      endTime: r.end_time ?? null,
      time: this._formatTimeRange(r.start_time, r.end_time),
      price: Number(r.total_price ?? 0),
      status: r.status ?? (viewType === "owner" ? "En attente" : "En attente de paiement"),
      terrainName: terrain.name ?? "Terrain inconnu",
      location: terrain.adress ?? "Lieu non renseigné",
      image: images.length > 0 ? images[0].url_image : null,
      clientName: viewType === "owner" 
        ? (r.client_name || r.profiles?.name || "Client App") 
        : "Moi",
      clientPhone: r.client_phone || r.profiles?.phone || "-",
      isManual: r.user_id === null,
      reservationType: r.reservation_type ?? "single",
      paymentMethod: r.payment_method ?? "Non spécifié",
      createdAt: r.created_at,
      subscriptionId: r.subscription_id,
    };
  },

  _mapSubscription(s) {
    return {
      id: s.id,
      clientName: s.client_name || s.profiles?.name || "Client inconnu",
      clientPhone: s.client_phone || s.profiles?.phone || "-",
      fieldName: s.fields?.name ?? "Terrain inconnu",
      fieldId: s.field_id,
      dayOfWeek: s.day_of_week,
      startTime: s.start_time ?? null,
      endTime: s.end_time ?? null,
      time: this._formatTimeRange(s.start_time, s.end_time),
      startDate: s.start_date,
      endDate: s.end_date,
      price: Number(s.total_amount ?? 0),
      status: s.status ?? "En attente",
      paymentMethod: s.payment_method ?? "Non spécifié",
      createdAt: s.created_at,
      reservationType: "subscription",
    };
  },

  /** Enrichir les données avec les profils des clients (User IDs) */
  async _enrichWithProfiles(items) {
    if (!items?.length) return items;

    const userIds = [...new Set(items.map(i => i.user_id).filter(id => id))];
    if (userIds.length === 0) return items;

    try {
      const { data: profiles, error } = await supabase
        .from("profiles")
        .select("id, name, phone")
        .in("id", userIds);

      if (error) throw error;

      const profileMap = (profiles || []).reduce((acc, p) => {
        acc[p.id] = p;
        return acc;
      }, {});

      return items.map(item => ({
        ...item,
        profiles: item.user_id ? profileMap[item.user_id] : null
      }));
    } catch (err) {
      console.warn("⚠️ Impossible d'enrichir avec les profils:", err.message);
      return items;
    }
  }
};
