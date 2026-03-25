import { supabase } from "./supabaseClient";

export const ReservationService = {
    // --- FETCH ALL (OWNER VIEW) ---
    async getOwnerReservations() {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Non connecté");

        // Fetch reservations linked to terrains owned by this user
        const { data, error } = await supabase
            .from("reservations")
            .select(`
        *,
        fields!inner (
          id, 
          name, 
          proprietaire_id
        )
      `)
            .eq("fields.proprietaire_id", user.id)
            .order("date", { ascending: false })
            .order("start_time", { ascending: true });

        if (error) throw error;

        return data.map(r => ({
            id: r.id,
            date: r.date,
            startTime: r.start_time,
            endTime: r.end_time,
            price: r.total_price,
            status: r.status || "Confirmé",
            terrainName: r.fields?.name || "Terrain Inconnu",
            clientName: "Client App",
            clientPhone: "-",
            isManual: !r.user_id,
            reservationType: r.reservation_type || "single"
        }));
    },

    // --- FETCH ALL (CLIENT VIEW) ---
    async getUserReservations() {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Non connecté");

        // Requête simplifiée : on récupère d'abord les réservations
        const { data, error } = await supabase
            .from("reservations")
            .select(`
                *,
                fields (
                    id,
                    name,
                    adress,
                    field_images (url_image)
                )
            `)
            .eq("user_id", user.id)
            .order("date", { ascending: false });

        if (error) {
            console.error("Supabase Error (UserReservations):", error);
            throw error;
        }

        return data.map(r => {
            const terrain = r.fields || {};
            const images = terrain.field_images || [];
            return {
                id: r.id,
                field_id: r.field_id,
                date: r.date,
                startTime: r.start_time,
                endTime: r.end_time,
                price: r.total_price,
                status: r.status || "En attente de paiement",
                terrainName: terrain.name || "Terrain inconnu",
                location: terrain.adress || "Lieu non renseigné",
                image: images.length > 0 ? images[0].url_image : null,
                fields: terrain,
                reservationType: r.reservation_type || "single"
            };
        });
    },

    // --- CREATE (MANUAL BY OWNER) ---
    async createManualReservation(data) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Non connecté");

        // Data: { terrainId, date, startTime, endTime, price, clientName, clientPhone }
        const { error } = await supabase
            .from("reservations")
            .insert({
                field_id: data.terrainId,
                date: data.date,
                start_time: data.startTime,
                end_time: data.endTime,
                total_price: data.price,
                status: "Confirmé"
            });

        if (error) throw error;
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
                status: 'En attente de paiement',
                payment_method: data.payment_method
            })
            .select();
        if (error) throw error;
        return (insertedData || [])[0];
    },

    async getOwnerSubscriptions(ownerId) {
        const { data, error } = await supabase
            .from("subscriptions")
            .select(`
                *,
                fields (name)
            `)
            .eq("user_id", ownerId)
            .order("created_at", { ascending: false });

        if (error) throw error;
        return (data || []).map(s => ({
            id: s.id,
            clientName: s.client_name,
            clientPhone: s.client_phone,
            fieldName: s.fields?.name,
            fieldId: s.field_id,
            dayOfWeek: s.day_of_week,
            startTime: s.start_time,
            endTime: s.end_time,
            startDate: s.start_date,
            endDate: s.end_date,
            amount: s.total_amount,
            status: s.status,
            createdAt: s.created_at,
            reservationType: 'subscription'
        }));
    },

    async cancelSubscription(id) {
        const { error } = await supabase
            .from("subscriptions")
            .update({ status: 'cancelled' })
            .eq("id", id);
        if (error) throw error;
    }
};

