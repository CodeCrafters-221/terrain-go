import { supabase } from "./supabaseClient";

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

    if (error) throw error;

    return data.map((t) => ({
      id: t.id,
      name: t.name,
      location: t.adress,
      price: t.price_per_hour,
      ...parseDescription(t.description),
      image: t.field_images?.[0]?.url_image || null,
      status: "Disponible",
      proprietaire_id: t.proprietaire_id,
    }));
  },

  // --- CREATE ---
  async createTerrain(terrainData, imageFile) {
    // 0. Check User
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user)
      throw new Error("Vous n'êtes pas connecté. Veuillez vous reconnecter.");

    // 1. Upload Image
    let imageUrl = null;
    if (imageFile) {
      try {
        imageUrl = await uploadTerrainImage(imageFile);
      } catch (e) {
        console.error("Storage Error:", e);
        throw new Error(
          "Erreur upload image: Vérifiez que le bucket 'terrain-images' existe et que les politiques de sécurité (RLS) sont actives.",
        );
      }
    } else if (terrainData.image && terrainData.image.startsWith("http")) {
      imageUrl = terrainData.image;
    }

    // 2. Insert Terrain
    const descriptionJson = terrainData.description || "";

    // Check if profile exists implicitly by catching FK error
    const { data: terrain, error } = await supabase
      .from("fields")
      .insert({
        name: terrainData.name,
        adress: terrainData.location,
        price_per_hour: parseFloat(terrainData.price),
        description: descriptionJson,
        pelouse: terrainData.type,
        capacity: terrainData.capacity,
        proprietaire_id: user.id,
      })
      .select()
      .single();

    if (error) {
      console.error("Insert Terrain Error:", error);
      // Catch Foreign Key Violation (Missing Profile)
      if (error.code === "23503") {
        throw new Error(
          "Profil introuvable. Avez-vous créé votre profil utilisateur ?",
        );
      }
      // Catch RLS Violation
      if (error.code === "42501") {
        throw new Error(
          "Permission refusée (RLS). Vérifiez que vous êtes bien connecté avec un profil valide.",
        );
      }
      throw new Error(error.message);
    }

    // 3. Insert Image Record
    if (imageUrl) {
      const { error: imgError } = await supabase.from("field_images").insert({
        terrain_id: terrain.id,
        url_image: imageUrl,
      });

      if (imgError) console.error("Insert Image Record Error:", imgError);
    }

    return terrain;
  },

  // --- UPDATE ---
  async updateTerrain(id, terrainData, imageFile) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Vous n'êtes pas connecté.");

    // 1. Upload new image if any
    let imageUrl = null;
    if (imageFile) {
      imageUrl = await uploadTerrainImage(imageFile);
    }

    // 2. Update Terrain
    const { error } = await supabase
      .from("fields")
      .update({
        name: terrainData.name,
        adress: terrainData.location,
        price_per_hour: parseFloat(terrainData.price),
        description: terrainData.description,
        pelouse: terrainData.type,
        capacity: terrainData.capacity,
      })
      .eq("id", id)
      .eq("proprietaire_id", user.id);

    if (error) throw error;

    // 3. Update Image
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
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const { error } = await supabase
      .from("fields")
      .delete()
      .eq("id", id)
      .eq("proprietaire_id", user?.id);

    if (error) throw error;
  },
};

// --- Helper Functions ---
async function uploadTerrainImage(file) {
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

function parseDescription(desc) {
  try {
    const parsed =
      typeof desc === "string" && desc.startsWith("{")
        ? JSON.parse(desc)
        : { desc };
    return parsed || { type: "N/A", surface: "N/A", hours: "N/A" };
  } catch (e) {
    return { type: "N/A", surface: "N/A", hours: "N/A" };
  }
}
