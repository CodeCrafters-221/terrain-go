import { supabase } from "./supabaseClient";

export const ReviewService = {
  /**
   * Récupère tous les avis pour un terrain spécifique
   * @param {string} terrainId - L'ID du terrain
   * @returns {Promise<Array>} - Liste des avis avec les infos du profil utilisateur
   */
  async getTerrainReviews(terrainId) {
    const { data, error } = await supabase
      .from("avis")
      .select(
        `
        *,
        profiles (name, image)
      `,
      )
      .eq("terrain_id", terrainId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  },

  /**
   * Ajoute un nouvel avis
   * @param {Object} reviewData - Les données de l'avis
   * @returns {Promise<Object>} - L'avis créé
   */
  async addReview(reviewData) {
    // reviewData: { utilisateur_id, note, commentaire, terrain_id }
    const { data, error } = await supabase
      .from("avis")
      .insert([reviewData])
      .select()
      .single();

    if (error) {
      console.error("Supabase Review Insert Error:", {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint,
      });
      throw error;
    }
    return data;
  },

  /**
   * Calcule la note moyenne pour un terrain
   * @param {string} terrainId
   */
  async getAverageRating(terrainId) {
    const { data, error } = await supabase
      .from("avis")
      .select("note")
      .eq("terrain_id", terrainId);

    if (error) throw error;
    if (!data || data.length === 0) return { average: 0, count: 0 };

    const sum = data.reduce((acc, curr) => acc + curr.note, 0);
    return {
      average: (sum / data.length).toFixed(1),
      count: data.length,
    };
  },

  /**
   * Récupère les avis d'un utilisateur
   * @param {string} userId
   */
  async getUserReviews(userId) {
    const { data, error } = await supabase
      .from("avis")
      .select(
        `
                *,
                fields (name)
            `,
      )
      .eq("utilisateur_id", userId)
      .order("created_at", { ascending: false });

    return { data, error };
  },
};
