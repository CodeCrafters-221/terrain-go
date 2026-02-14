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
            .order("heure_debut", { ascending: true });

        if (error) throw error;

        return data.map(r => ({
            id: r.id,
            date: r.date,
            startTime: r.heure_debut,
            endTime: r.heure_fin,
            price: r.prix_total,
            status: r.statut || "Confirmé",
            terrainName: r.fields?.name || "Terrain Inconnu",
            // Fallback logic for client name
            clientName: r.nom_client || (r.utilisateur_id ? "Client App" : "Client Inconnu"),
            clientPhone: r.telephone_client || "-",
            isManual: !r.utilisateur_id // True if not linked to a user account
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
            .eq("utilisateur_id", user.id)
            .order("date", { ascending: false });

        if (error) {
            console.error("Supabase Error (UserReservations):", error);
            throw error;
        }

        return data.map(r => {
            // Sécurité : on vérifie si fields existe, sinon on met des valeurs par défaut
            const terrain = r.fields || {};
            const images = terrain.field_images || [];

            return {
                id: r.id,
                date: r.date,
                startTime: r.heure_debut,
                endTime: r.heure_fin,
                price: r.prix_total,
                status: r.statut || "En attente de paiement",
                terrainName: terrain.name || "Terrain inconnu",
                location: terrain.adress || "Lieu non renseigné",
                image: images.length > 0 ? images[0].url_image : null
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
                terrain_id: data.terrainId,
                date: data.date,
                heure_debut: data.startTime,
                heure_fin: data.endTime,
                prix_total: data.price,
                statut: "Confirmé", // Manuel = Confirmé direct
                nom_client: data.clientName,
                telephone_client: data.clientPhone
                // utilisateur_id is NULL for manual entries
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

