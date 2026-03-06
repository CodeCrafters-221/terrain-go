import { useState } from "react";
import { supabase } from "../services/supabaseClient";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

export default function CreateFieldDetails() {
    const { terrains } = useAuth();
    const terrainId = terrains?.id;

    // States
    const [images, setImages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);


    const addImage = (file) => {
        if (!file) return;
        setImages((prev) => [...prev, file]);
    };

    const removeImage = (index) => {
        setImages(images.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (images.length === 0) {
            toast.error("Ajoutez au moins une image");
            return;
        }

        try {
            setIsLoading(true);

            /* 1️⃣ UPLOAD DES IMAGES */
            for (const img of images) {
                const filePath = `fields/${terrainId}/${Date.now()}-${img.name}`;

                const { error: uploadError } = await supabase.storage
                    .from("fields")
                    .upload(filePath, img);

                if (uploadError) throw uploadError;

                const { data } = supabase.storage
                    .from("fields")
                    .getPublicUrl(filePath);

                await supabase.from("field_images").insert({
                    field_id: terrainId,
                    image_url: data.publicUrl,
                });
            }

            toast.success("Images ajoutées avec succès !");
            setImages([]);
        } catch (err) {
            console.error(err);
            toast.error("Erreur lors de l'enregistrement");
        } finally {
            setIsLoading(false);
        }
    };

    const inputClasses =
        "w-full px-4 py-3 rounded-lg border bg-transparent text-white focus:outline-none focus:border-primary";

    return (
        <div className="bg-[#2e2318] rounded-2xl max-w-4xl mx-auto p-8">
            <h2 className="text-white text-xl font-semibold mb-6">
                Images du terrain
            </h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                {/* ================= IMAGES ================= */}
                <div>
                    <label className="text-white text-sm">Images du terrain</label>

                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => addImage(e.target.files[0])}
                        className="mt-2 text-white"
                    />

                    <div className="flex gap-3 flex-wrap mt-3">
                        {images.map((img, i) => (
                            <div key={i} className="relative">
                                <img
                                    src={URL.createObjectURL(img)}
                                    className="w-24 h-24 object-cover rounded"
                                />
                                <button
                                    type="button"
                                    onClick={() => removeImage(i)}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 rounded-full"
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ================= SUBMIT ================= */}
                <button
                    type="submit"
                    disabled={isLoading}
                    className="bg-primary text-black py-3 rounded-lg font-semibold disabled:opacity-50"
                >
                    {isLoading ? "Enregistrement..." : "Enregistrer"}
                </button>
            </form>
        </div>
    );
}
