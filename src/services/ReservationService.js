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
            isManual: !r.user_id
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
                fields: terrain
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

    // --- DELETE/CANCEL ---
    async cancelReservation(id) {
        const { error } = await supabase
            .from("reservations")
            .delete() // Start with delete for simplicity, or update status to 'Cancelled'
            .eq("id", id);

        if (error) throw error;
    }
};

