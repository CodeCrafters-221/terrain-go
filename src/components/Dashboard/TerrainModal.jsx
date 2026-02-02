import React, { useState, useEffect } from "react";
import { X, Upload, Check } from "lucide-react";

export default function TerrainModal({
    isOpen,
    onClose,
    onSubmit,
    terrainToEdit = null,
}) {
    const [formData, setFormData] = useState({
        name: "",
        location: "",
        type: "5 vs 5",
        surface: "Gazon synthétique",
        price: "",
        hours: "08:00 - 00:00",
        image: "",
        status: "Disponible"
    });
    const [imageFile, setImageFile] = useState(null);
    const [preview, setPreview] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (terrainToEdit) {
            setFormData(terrainToEdit);
            setPreview(terrainToEdit.image || "");
        } else {
            // Reset form
            setFormData({
                name: "",
                location: "",
                type: "5 vs 5",
                surface: "Gazon synthétique",
                price: "",
                hours: "08:00 - 00:00",
                image: "",
                status: "Disponible"
            });
            setPreview("");
            setImageFile(null);
        }
    }, [terrainToEdit, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setPreview(URL.createObjectURL(file));
            // Optional: Clear URL input
            setFormData(prev => ({ ...prev, image: "" }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onSubmit(formData, imageFile);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-[#2e2318] rounded-2xl w-full max-w-lg flex flex-col border border-[#493622] shadow-2xl max-h-[90vh]">
                {/* Header */}
                <div className="flex-none bg-[#2e2318] border-b border-[#493622] p-6 flex justify-between items-center rounded-t-2xl z-10">
                    <h2 className="text-white text-xl font-bold">
                        {terrainToEdit ? "Modifier le Terrain" : "Ajouter un Terrain"}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-white hover:text-primary transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Image Preview / Upload */}
                        <div className="w-full h-40 bg-[#342618] rounded-xl border-2 border-dashed border-[#493622] flex flex-col items-center justify-center relative overflow-hidden group hover:border-[#f27f0d] transition-colors cursor-pointer">
                            {preview ? (
                                <img src={preview} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
                            ) : (
                                <>
                                    <Upload className="w-8 h-8 text-[#cbad90] mb-2 group-hover:text-[#f27f0d]" />
                                    <p className="text-[#cbad90] text-sm group-hover:text-white">Glisser une photo ou cliquer</p>
                                </>
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                            />
                        </div>

                        {/* URL Input Fallback */}
                        <div>
                            <input
                                type="text"
                                name="image"
                                value={formData.image}
                                onChange={(e) => {
                                    handleChange(e);
                                    setPreview(e.target.value);
                                    setImageFile(null); // Clear file if typing URL
                                }}
                                placeholder="Ou coller une URL d'image directe..."
                                className="w-full bg-black/20 text-white text-xs p-2 rounded-lg border border-[#493622] focus:border-[#f27f0d] outline-none"
                            />
                        </div>

                        {/* Basic Info */}
                        <div>
                            <label className="block text-white text-sm font-semibold mb-2">Nom du terrain</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 rounded-xl bg-[#342618] text-white border border-[#493622] focus:border-[#f27f0d] focus:outline-none"
                                placeholder="Ex: Terrain Almadies 1"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-white text-sm font-semibold mb-2">Type</label>
                                <select
                                    name="type"
                                    value={formData.type}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl bg-[#342618] text-white border border-[#493622] focus:border-[#f27f0d] focus:outline-none"
                                >
                                    <option>5 vs 5</option>
                                    <option>7 vs 7</option>
                                    <option>11 vs 11</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-white text-sm font-semibold mb-2">Surface</label>
                                <select
                                    name="surface"
                                    value={formData.surface}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl bg-[#342618] text-white border border-[#493622] focus:border-[#f27f0d] focus:outline-none"
                                >
                                    <option>Gazon synthétique</option>
                                    <option>Gazon naturel</option>
                                    <option>Gazon hybride</option>
                                    <option>Parquet / Salle</option>
                                    <option>Sable</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-white text-sm font-semibold mb-2">Localisation</label>
                            <input
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 rounded-xl bg-[#342618] text-white border border-[#493622] focus:border-[#f27f0d] focus:outline-none"
                                placeholder="Ex: Almadies, Zone A"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-white text-sm font-semibold mb-2">Prix / Heure (CFA)</label>
                                <input
                                    type="text"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 rounded-xl bg-[#342618] text-white border border-[#493622] focus:border-[#f27f0d] focus:outline-none"
                                    placeholder="Ex: 35000"
                                />
                            </div>
                            <div>
                                <label className="block text-white text-sm font-semibold mb-2">Horaires</label>
                                <input
                                    type="text"
                                    name="hours"
                                    value={formData.hours}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl bg-[#342618] text-white border border-[#493622] focus:border-[#f27f0d] focus:outline-none"
                                    placeholder="Ex: 08:00 - 02:00"
                                />
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="flex gap-3 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 py-3 rounded-xl border border-[#493622] text-white font-bold hover:bg-[#342618] transition-colors"
                            >
                                Annuler
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 py-3 rounded-xl bg-[#f27f0d] text-[#231a10] font-bold hover:shadow-[0_0_15px_rgba(242,127,13,0.3)] disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                            >
                                <Check className="w-5 h-5" />
                                {loading ? "Enregistrement..." : (terrainToEdit ? "Enregistrer" : "Créer le terrain")}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
