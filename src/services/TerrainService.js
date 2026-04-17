import { supabase } from "./supabaseClient";
import { getSafeErrorMessage, sanitizeString } from "../utils/security";

export const TerrainService = {
  // --- FETCH ---
  async getAllTerrains() {
    const { data, error } = await supabase
      .from("fields")
      .select(
        `
        id,
        name,
        adress,
        price_per_hour,
        description,
        proprietaire_id,
        field_images (url_image)
      `,
      )
      .order("created_at", { ascending: false });

    if (error) throw new Error(getSafeErrorMessage(error));

    return data.map((t) => ({
      id: t.id,
      name: t.name,
      location: t.adress,
      price: t.price_per_hour,
      ...this._parseDescription(t.description),
      image: t.field_images?.[0]?.url_image || null,
      status: "Disponible",
      proprietaire_id: t.proprietaire_id,
    }));
  },

  // --- CREATE ---
  async createTerrain(terrainData, imageFile) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Vous n'êtes pas connecté.");

    // 1. Upload Image
    let imageUrl = null;
    if (imageFile) {
      try {
        imageUrl = await uploadTerrainImage(imageFile);
      } catch (e) {
        console.error("Storage Error:", e);
        throw new Error("Erreur lors de l'envoi de l'image.");
      }
    } else if (terrainData.image && terrainData.image.startsWith("http")) {
      imageUrl = terrainData.image;
    }

    const descriptionJson = terrainData.description || "";

    const { data: terrain, error } = await supabase
      .from("fields")
      .insert({
        name: sanitizeString(terrainData.name),
        adress: sanitizeString(terrainData.location),
        price_per_hour: parseFloat(terrainData.price),
        description: descriptionJson,
        pelouse: terrainData.type,
        capacity: terrainData.capacity,
        proprietaire_id: user.id, // Provient de la session
      })
      .select()
      .single();

    if (error) throw new Error(getSafeErrorMessage(error));

    if (error) throw new Error(getSafeErrorMessage(error));
 
    // 2. Insert Multiple Images if present
    const imagesToInsert = [];
    if (imageUrl) {
      imagesToInsert.push({ terrain_id: terrain.id, url_image: imageUrl });
    }
    if (terrainData.images && Array.from(terrainData.images).length > 0) {
      terrainData.images.forEach(imgUrl => {
        if (imgUrl !== imageUrl) { // Avoid duplicates
          imagesToInsert.push({ terrain_id: terrain.id, url_image: imgUrl });
        }
      });
    }

    if (imagesToInsert.length > 0) {
      const { error: imgError } = await supabase.from("field_images").insert(imagesToInsert);
      if (imgError) console.error("Insert Image Record Error:", imgError);
    }
 
    return terrain;
  },

  // --- UPDATE ---
  async updateTerrain(id, terrainData, imageFile) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Vous n'êtes pas connecté.");

    let imageUrl = null;
    if (imageFile) {
      imageUrl = await uploadTerrainImage(imageFile);
    }

    const { error } = await supabase
      .from("fields")
      .update({
        name: sanitizeString(terrainData.name),
        adress: sanitizeString(terrainData.location),
        price_per_hour: parseFloat(terrainData.price),
        description: terrainData.description,
        pelouse: terrainData.type,
        capacity: terrainData.capacity,
      })
      .eq("id", id)
      .eq("proprietaire_id", user.id); // Sécurité additionnelle avant RLS

    if (error) throw new Error(getSafeErrorMessage(error));

    if (imageUrl) {
      await supabase.from("field_images").delete().eq("terrain_id", id);
      await supabase.from("field_images").insert({
        terrain_id: id,
        url_image: imageUrl,
      });
    }
  },

  // --- DELETE ---
  async deleteTerrain(id) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Non authentifié.");

    // Nettoyage défensif des données liées (si CASCADE n'est pas configuré en base)
    const tables = [
      { name: "field_images", col: "terrain_id" },
      { name: "disponibilite", col: "field_id" },
      { name: "reservations", col: "field_id" },
      { name: "subscriptions", col: "field_id" },
      { name: "avis", col: "terrain_id" }
    ];

    for (const table of tables) {
      await supabase.from(table.name).delete().eq(table.col, id);
    }

    const { error } = await supabase
      .from("fields")
      .delete()
      .eq("id", id)
      .eq("proprietaire_id", user.id);

    if (error) throw new Error(getSafeErrorMessage(error));
  },

  _parseDescription(desc) {
    try {
      const parsed =
        typeof desc === "string" && desc.startsWith("{")
          ? JSON.parse(desc)
          : { desc };
      return parsed || { type: "N/A", surface: "N/A", hours: "N/A" };
    } catch (e) {
      return { type: "N/A", surface: "N/A", hours: "N/A" };
    }
  },


  async saveFieldImages(fieldId, imageUrls) {
    if (!imageUrls || imageUrls.length === 0) return;
    const records = imageUrls.map(url => ({ terrain_id: fieldId, url_image: url }));
    const { error } = await supabase.from("field_images").insert(records);
    if (error) throw error;
  },

  async deleteFieldImage(fieldId, imageUrl) {
    // 1. Delete from DB
    const { error: dbError } = await supabase
      .from("field_images")
      .delete()
      .match({ terrain_id: fieldId, url_image: imageUrl });
    
    if (dbError) throw dbError;

    // 2. Delete from Storage if it's our bucket
    if (imageUrl.includes("terrain-images")) {
      const fileName = imageUrl.split("/").pop();
      const { error: storageError } = await supabase.storage
        .from("terrain-images")
        .remove([fileName]);
      if (storageError) console.error("Storage delete error:", storageError);
    }
  }
};

export async function uploadTerrainImage(file) {
  const fileExt = file.name.split(".").pop() || "jpg";
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

  const { error } = await supabase.storage
    .from("terrain-images")
    .upload(fileName, file);

  if (error) throw error;

  const {
    data: { publicUrl },
  } = supabase.storage.from("terrain-images").getPublicUrl(fileName);

  return publicUrl;
}
