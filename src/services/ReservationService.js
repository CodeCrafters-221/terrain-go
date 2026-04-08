import { supabase } from "./supabaseClient";

export const ReservationService = {
  async _getCurrentUser() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Accès refusé. Veuillez vous connecter.");
    return user;
  },

  // --- FETCH ALL (OWNER VIEW) ---
  async getOwnerReservations() {
    const user = await this._getCurrentUser();

    // Fetch reservations linked to terrains owned by this user
    const { data, error } = await supabase
      .from("reservations")
      .select(
        `
        *,
        fields!inner (
          id, 
          name, 
          proprietaire_id
        )
      `,
      )
      .eq("fields.proprietaire_id", user.id)
      .order("date", { ascending: false })
      .order("start_time", { ascending: true });

    if (error) throw error;

    return data.map((r) => this._mapReservation(r, "owner"));
  },

  // --- FETCH ALL (CLIENT VIEW) ---
  async getUserReservations() {
    const user = await this._getCurrentUser();

    // Requête simplifiée : on récupère d'abord les réservations
    const { data, error } = await supabase
      .from("reservations")
      .select(
        `
                *,
                fields (
                    id,
                    name,
                    adress,
                    field_images (url_image)
                )
            `,
      )
      .eq("user_id", user.id)
      .order("date", { ascending: false });

    if (error) {
      console.error("Supabase Error (UserReservations):", error);
      throw error;
    }

    return data.map((r) => this._mapReservation(r, "client"));
  },

  // --- CREATE (MANUAL BY OWNER) ---
  async createManualReservation(data) {
    await this._getCurrentUser();

    // Data: { terrainId, date, startTime, endTime, price, clientName, clientPhone }
    const { error } = await supabase.from("reservations").insert({
      field_id: data.terrainId,
      date: data.date,
      start_time: data.startTime,
      end_time: data.endTime,
      total_price: data.price,
      client_name: data.clientName,
      client_phone: data.clientPhone,
      status: "Confirmé",
    });

    if (error) throw error;
  },

  // --- UPDATE STATUS & NOTIFY ---
  async updateStatus(id, status) {
    const { data, error } = await supabase
      .from("reservations")
      .update({ status })
      .eq("id", id)
      .select("*, fields(name)")
      .single();

    if (error) throw error;

    // Automatisation : Déclenchement si payé
    if (status === "Payé" || status === "Confirmé") {
      await this._triggerPaymentNotification(data);
    }

    return data;
  },

  async _triggerPaymentNotification(reservation) {
    try {
      // Option A: Appel à une Supabase Edge Function (Recommandé)
      // await supabase.functions.invoke('send-confirmation-email', { body: { reservationId: reservation.id } });

      console.log(
        `✉️ Notification automatique : Réservation ${reservation.id} payée pour le terrain ${reservation.fields?.name}`,
      );
    } catch (err) {
      console.error("Erreur lors de l'envoi de la notification:", err);
    }
  },

  // --- SUBSCRIPTIONS (Abonnements) ---
  async createSubscription(data) {
    const { data: insertedData, error } = await supabase
      .from("subscriptions")
      .insert({
        user_id: data.user_id,
        field_id: data.field_id,
        client_name: data.client_name,
        client_phone: data.client_phone,
        day_of_week: data.day_of_week,
        start_time: data.start_time,
        end_time: data.end_time,
        start_date: data.start_date,
        end_date: data.end_date,
        total_amount: data.total_amount,
        status: "En attente de paiement",
        payment_method: data.payment_method,
      })
      .select();
    if (error) throw error;
    return (insertedData || [])[0];
  },

  async getOwnerSubscriptions(ownerId) {
    const { data, error } = await supabase
      .from("subscriptions")
      .select(`*, fields!inner (name, proprietaire_id)`)
      .eq("fields.proprietaire_id", ownerId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return (data || []).map((s) => this._mapSubscription(s));
  },

  async cancelSubscription(id) {
    const { error } = await supabase
      .from("subscriptions")
      .update({ status: "cancelled" })
      .eq("id", id);
    if (error) throw error;
  },

  /**
   * Mapper privé pour uniformiser les données
   */
  _mapReservation(r, viewType) {
    const terrain = r.fields || {};
    const images = terrain.field_images || [];

    return {
      id: r.id,
      field_id: r.field_id,
      date: r.date,
      startTime: r.start_time,
      endTime: r.end_time,
      time: `${r.start_time?.slice(0, 5)} - ${r.end_time?.slice(0, 5)}`,
      price: r.total_price,
      status:
        r.status ||
        (viewType === "owner" ? "Confirmé" : "En attente de paiement"),
      terrainName: terrain.name || "Terrain inconnu",
      location: terrain.adress || "Lieu non renseigné",
      image: images.length > 0 ? images[0].url_image : null,
      clientName: viewType === "owner" ? r.client_name || "Client App" : "Moi",
      isManual: !r.user_id,
      reservationType: r.reservation_type || "single",
      createdAt: r.created_at,
    };
  },

  /**
   * Mapper privé pour uniformiser les abonnements
   */
  _mapSubscription(s) {
    return {
      id: s.id,
      clientName: s.client_name || "Client App",
      clientPhone: s.client_phone || "-",
      fieldName: s.fields?.name || "Terrain inconnu",
      fieldId: s.field_id,
      dayOfWeek: s.day_of_week,
      startTime: s.start_time,
      endTime: s.end_time,
      time: `${s.start_time?.slice(0, 5)} - ${s.end_time?.slice(0, 5)}`,
      startDate: s.start_date,
      endDate: s.end_date,
      price: s.total_amount,
      status: s.status || "En attente",
      createdAt: s.created_at,
      reservationType: "subscription",
    };
  },
};
