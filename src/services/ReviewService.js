import { supabase } from "./supabaseClient";
import { sanitizeString, getSafeErrorMessage } from "../utils/security";

export const ReviewService = {
  /**
   * Récupère tous les avis pour un terrain spécifique
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

    if (error) throw new Error(getSafeErrorMessage(error));
    return data || [];
  },

  /**
   * Ajoute un nouvel avis
   */
  async addReview(reviewData) {
    // On récupère l'ID utilisateur depuis la session pour éviter l'usurpation
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) throw new Error("Vous devez être connecté pour laisser un avis.");

    const payload = {
      utilisateur_id: user.id,
      terrain_id: reviewData.terrain_id,
      note: Math.min(5, Math.max(1, Number(reviewData.note))),
      commentaire: sanitizeString(reviewData.commentaire),
    };

    const { data, error } = await supabase
      .from("avis")
      .insert([payload])
      .select()
      .single();

    if (error) {
      console.error("Supabase Review Insert Error:", error);
      throw new Error(getSafeErrorMessage(error));
    }
    return data;
  },

  /**
   * Calcule la note moyenne pour un terrain
   */
  async getAverageRating(terrainId) {
    const { data, error } = await supabase
      .from("avis")
      .select("note")
      .eq("terrain_id", terrainId);

    if (error) throw new Error(getSafeErrorMessage(error));
    if (!data || data.length === 0) return { average: 0, count: 0 };

    const sum = data.reduce((acc, curr) => acc + curr.note, 0);
    return {
      average: (sum / data.length).toFixed(1),
      count: data.length,
    };
  },

  /**
   * Récupère les avis d'un utilisateur
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

    if (error) throw new Error(getSafeErrorMessage(error));
    return { data, error: null };
  },
};
