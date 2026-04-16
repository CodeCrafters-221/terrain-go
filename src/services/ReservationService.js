import { supabase } from "./supabaseClient";

// ─── field_id validator (accepts numeric bigint OR uuid) ─────────────────────
const isValidFieldId = (value) => {
  const s = String(value ?? "").trim();
  if (!s) return false;
  const isNumeric = /^\d+$/.test(s);
  const isUUID =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s);
  return isNumeric || isUUID;
};

/** Format "HH:MM - HH:MM" from nullable time strings */
const formatTimeRange = (start, end) => {
  const s = typeof start === "string" ? start.slice(0, 5) : "--:--";
  const e = typeof end === "string" ? end.slice(0, 5) : "--:--";
  return `${s} - ${e}`;
};

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
      throw new Error("Session expirée ou utilisateur non connecté.");
    }
    return user;
  },

  // ─── FETCH (OWNER VIEW) ────────────────────────────────────────────────────
  async getOwnerReservations() {
    const user = await this._getCurrentUser();

    const { data, error } = await supabase
      .from("reservations")
      .select(`*, fields!inner (id, name, proprietaire_id)`)
      .eq("fields.proprietaire_id", user.id)
      .order("date", { ascending: false })
      .order("start_time", { ascending: true });

    if (error) {
      logSupabaseError("getOwnerReservations", error);
      throw error;
    }

    return (data ?? []).map((r) => this._mapReservation(r, "owner"));
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
      throw error;
    }

    return (data ?? []).map((r) => this._mapReservation(r, "client"));
  },

  // ─── CREATE — ONLINE (user via app) ────────────────────────────────────────
  /**
   * Called from ReservationModal when a client books online.
   * - user_id  : authenticated client's UUID
   * - status   : "En attente"  (owner must confirm)
   * - payment  : "En ligne"
   * - client_name / client_phone : null (fetched from profiles)
   */
  async createOnlineReservation(data) {
    const user = await this._getCurrentUser();

    // ── Validation ───────────────────────────────────────────────────────────
    if (!isValidFieldId(data.field_id)) {
      throw new Error(
        `field_id invalide ou manquant : "${data.field_id}". Attendu : un entier numérique ou un UUID.`
      );
    }
    if (!data.date || !data.start_time || !data.end_time) {
      throw new Error(
        "Validation échouée : date, start_time et end_time sont obligatoires."
      );
    }
    const price = Number(data.total_price);
    if (isNaN(price)) {
      throw new Error(`total_price invalide : "${data.total_price}".`);
    }

    // ── Payload ──────────────────────────────────────────────────────────────
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

    console.log("📤 [createOnlineReservation] Payload →", payload);

    const { data: inserted, error } = await supabase
      .from("reservations")
      .insert([payload])
      .select()
      .single();

    if (error) {
      logSupabaseError("createOnlineReservation", error);
      throw new Error(error.message);
    }

    console.log("✅ [createOnlineReservation] Inséré →", inserted);
    return inserted;
  },

  // ─── CREATE — ONSITE (manual entry by field owner) ─────────────────────────
  /**
   * Called from Dashboard > MyReservations when an owner registers a walk-in.
   * - user_id  : null  (no app account for walk-in client)
   * - status   : "Payé"  (cash paid on site)
   * - payment  : "Espèces"
   * - client_name / client_phone : required
   */
  async createOnsiteReservation(data) {
    // ── Validation ───────────────────────────────────────────────────────────
    if (!isValidFieldId(data.field_id)) {
      throw new Error(
        `field_id invalide ou manquant : "${data.field_id}". Attendu : un entier numérique ou un UUID.`
      );
    }
    if (!data.date || !data.start_time || !data.end_time) {
      throw new Error(
        "Validation échouée : date, start_time et end_time sont obligatoires."
      );
    }
    if (!data.client_name?.trim()) {
      throw new Error("Validation échouée : le nom du client est obligatoire.");
    }
    if (!data.client_phone?.trim()) {
      throw new Error(
        "Validation échouée : le téléphone du client est obligatoire."
      );
    }
    const price = Number(data.total_price);
    if (isNaN(price)) {
      throw new Error(`total_price invalide : "${data.total_price}".`);
    }

    // ── Payload ──────────────────────────────────────────────────────────────
    const payload = {
      field_id: data.field_id,
      user_id: null,
      date: data.date,
      start_time: data.start_time,
      end_time: data.end_time,
      total_price: price,
      status: "Payé",
      client_name: data.client_name.trim(),
      client_phone: data.client_phone.trim(),
      payment_method: "Espèces",
      reservation_type: "onsite",
    };

    console.log("📤 [createOnsiteReservation] Payload →", payload);

    const { data: inserted, error } = await supabase
      .from("reservations")
      .insert([payload])
      .select()
      .single();

    if (error) {
      logSupabaseError("createOnsiteReservation", error);
      throw new Error(error.message);
    }

    console.log("✅ [createOnsiteReservation] Inséré →", inserted);
    return inserted;
  },

  // ─── UPDATE STATUS ─────────────────────────────────────────────────────────
  async updateStatus(id, status) {
    const { data, error } = await supabase
      .from("reservations")
      .update({ status })
      .eq("id", id)
      .select("*, fields(name)")
      .single();

    if (error) {
      logSupabaseError("updateStatus", error);
      throw error;
    }

    if (status === "Payé" || status === "Confirmé") {
      await this._triggerPaymentNotification(data);
    }

    return data;
  },

  async _triggerPaymentNotification(reservation) {
    try {
      console.log(
        `✉️ Notification : Réservation ${reservation.id} → ${reservation.fields?.name}`
      );
    } catch (err) {
      console.error("Erreur notification:", err);
    }
  },

  // ─── SUBSCRIPTIONS ─────────────────────────────────────────────────────────
  async createSubscription(data) {
    const payload = {
      user_id: data.user_id ?? null,
      field_id: data.field_id,
      client_name: data.client_name ?? null,
      client_phone: data.client_phone ?? null,
      day_of_week: data.day_of_week,
      start_time: data.start_time,
      end_time: data.end_time,
      start_date: data.start_date,
      end_date: data.end_date,
      total_amount: Number(data.total_amount ?? 0),
      status: "En attente de paiement",
      payment_method: data.payment_method ?? "Espèces",
    };

    console.log("📤 [createSubscription] Payload →", payload);

    const { data: inserted, error } = await supabase
      .from("subscriptions")
      .insert(payload)
      .select()
      .single();

    if (error) {
      logSupabaseError("createSubscription", error);
      throw error;
    }

    return inserted;
  },

  async getOwnerSubscriptions(ownerId) {
    const { data, error } = await supabase
      .from("subscriptions")
      .select(`*, fields!inner (name, proprietaire_id)`)
      .eq("fields.proprietaire_id", ownerId)
      .order("created_at", { ascending: false });

    if (error) {
      logSupabaseError("getOwnerSubscriptions", error);
      throw error;
    }
    return (data ?? []).map((s) => this._mapSubscription(s));
  },

  async cancelSubscription(id) {
    const { error } = await supabase
      .from("subscriptions")
      .update({ status: "Annulé" })
      .eq("id", id);
    if (error) {
      logSupabaseError("cancelSubscription", error);
      throw error;
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
      time: formatTimeRange(r.start_time, r.end_time),
      price: Number(r.total_price ?? 0),
      status: r.status ?? (viewType === "owner" ? "En attente" : "En attente de paiement"),
      terrainName: terrain.name ?? "Terrain inconnu",
      location: terrain.adress ?? "Lieu non renseigné",
      image: images.length > 0 ? images[0].url_image : null,
      clientName:
        viewType === "owner"
          ? r.client_name ?? "Client App"
          : "Moi",
      clientPhone: r.client_phone ?? "-",
      isManual: r.user_id === null,
      reservationType: r.reservation_type ?? "single",
      paymentMethod: r.payment_method ?? "Non spécifié",
      createdAt: r.created_at,
    };
  },

  _mapSubscription(s) {
    return {
      id: s.id,
      clientName: s.client_name ?? "Client inconnu",
      clientPhone: s.client_phone ?? "-",
      fieldName: s.fields?.name ?? "Terrain inconnu",
      fieldId: s.field_id,
      dayOfWeek: s.day_of_week,
      startTime: s.start_time ?? null,
      endTime: s.end_time ?? null,
      time: formatTimeRange(s.start_time, s.end_time),
      startDate: s.start_date,
      endDate: s.end_date,
      price: Number(s.total_amount ?? 0),
      status: s.status ?? "En attente",
      paymentMethod: s.payment_method ?? "Non spécifié",
      createdAt: s.created_at,
      reservationType: "subscription",
    };
  },
};
