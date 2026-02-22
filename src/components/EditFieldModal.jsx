import React, { useState, useEffect } from 'react';
import { useDashboard } from '../context/DashboardContext';
import { toast } from 'react-toastify';
import { supabase } from '../services/supabaseClient';

const EditFieldModal = () => {
    const { updateField, closeEditModal, isEditModalOpen, editingField } = useDashboard();

    // Form State
    const [formData, setFormData] = useState({
        name: "",
        type: "",
        location: "",
        price: "",
        description: "",
        hours: "",
        image: ""
    });

    const [isLoading, setIsLoading] = useState(false);
    const [uploading, setUploading] = useState(false);

    const handleImageChange = async (e) => {
        try {
            setUploading(true);
            const file = e.target.files[0];
            if (!file) return;

            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('terrain-images')
                .upload(filePath, file);

            if (uploadError) {
                throw uploadError;
            }

            const { data } = supabase.storage
                .from('terrain-images')
                .getPublicUrl(filePath);

            setFormData({ ...formData, image: data.publicUrl });
            toast.success("Image téléchargée !");
        } catch (error) {
            console.error(error);
            toast.error("Erreur lors du téléchargement de l'image");
        } finally {
            setUploading(false);
        }
    };

    // Initialize form with existing data
    useEffect(() => {
        if (editingField) {
            // Extract numeric price for input if needed, but keeping simple for now
            // Assuming price format "25k CFA/h" -> we just want "25" or the raw number?
            // Let's try to parse it if it follows the specific format, otherwise keep as is
            // Actually, let's keep it simple: just prefill. If the input expects number, we might need to parse.
            // The previous EditFieldPage did: const priceValue = fieldToEdit.price.replace(/[^0-9]/g, '');

            let priceValue = editingField.price;
            if (typeof editingField.price === 'string') {
                priceValue = editingField.price.replace(/[^0-9]/g, '');
            }

            setFormData({
                ...editingField,
                price: priceValue
            });
        }
    }, [editingField]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        // Simple validation
        if (!formData.name || !formData.price || !formData.location) {
            toast.error("Veuillez remplir les champs obligatoires");
            setIsLoading(false);
            return;
        }

        // Format data for Context
        const updatedField = {
            ...formData,
            price: `${formData.price} CFA/h` // Re-format price
        };

        await updateField(editingField.id, updatedField);
        toast.success("Terrain modifié avec succès !");
        closeEditModal();
        setIsLoading(false);
    };

    const inputClasses = "w-full px-4 py-3 rounded-lg border border-[#493622] bg-[#231a10] text-[#cbad90] placeholder-[#5d452b] focus:outline-none focus:border-[#f27f0d] transition-colors";
    const labelClasses = "text-white text-sm font-medium mb-1 block";

    if (!isEditModalOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-[#2c241b] rounded-2xl border border-[#493622] w-full max-w-2xl max-h-[90vh] overflow-y-auto relative shadow-[0_0_40px_rgba(0,0,0,0.5)]">

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-[#493622] sticky top-0 bg-[#2c241b] z-10">
                    <h2 className="text-white text-2xl font-bold">Modifier le Terrain</h2>
                    <button onClick={closeEditModal} className="text-[#cbad90] hover:text-white transition-colors">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                {/* Body */}
                <div className="p-6">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                        {/* Name */}
                        <div>
                            <label htmlFor="name" className={labelClasses}>Nom du terrain *</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                placeholder="Ex: Terrain Almadies 2"
                                value={formData.name}
                                onChange={handleInputChange}
                                className={inputClasses}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Type */}
                            <div>
                                <label htmlFor="type" className={labelClasses}>Type de terrain</label>
                                <select
                                    id="type"
                                    name="type"
                                    value={formData.type}
                                    onChange={handleInputChange}
                                    className={inputClasses}
                                >
                                    <option value="">Choisir...</option>
                                    <option value="5 vs 5 • Gazon synthétique">5 vs 5 • Gazon synthétique</option>
                                    <option value="7 vs 7 • Gazon synthétique">7 vs 7 • Gazon synthétique</option>
                                    <option value="5 vs 5 • Gazon naturel">5 vs 5 • Gazon naturel</option>
                                    <option value="7 vs 7 • Gazon naturel">7 vs 7 • Gazon naturel</option>
                                </select>
                            </div>

                            {/* Hours - Added */}
                            <div>
                                <label htmlFor="hours" className={labelClasses}>Plage Horaire</label>
                                <input
                                    type="text"
                                    id="hours"
                                    name="hours"
                                    placeholder="Ex: 08:00 - 02:00"
                                    value={formData.hours}
                                    onChange={handleInputChange}
                                    className={inputClasses}
                                />
                            </div>



                            {/* Price */}
                            <div>
                                <label htmlFor="price" className={labelClasses}>Prix / Heure (CFA) *</label>
                                <input
                                    type="number"
                                    id="price"
                                    name="price"
                                    placeholder="Ex: 25000"
                                    value={formData.price}
                                    onChange={handleInputChange}
                                    className={inputClasses}
                                    required
                                />
                            </div>
                        </div>

                        {/* Location */}
                        <div>
                            <label htmlFor="location" className={labelClasses}>Adresse / Localisation *</label>
                            <input
                                type="text"
                                id="location"
                                name="location"
                                placeholder="Ex: Mermoz, Pyrotechnie"
                                value={formData.location}
                                onChange={handleInputChange}
                                className={inputClasses}
                                required
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label htmlFor="description" className={labelClasses}>Description</label>
                            <textarea
                                id="description"
                                name="description"
                                rows="4"
                                placeholder="Description du terrain, commodités..."
                                value={formData.description}
                                onChange={handleInputChange}
                                className={inputClasses}
                            />
                        </div>

                        {/* Image Upload */}
                        <div>
                            <label htmlFor="image" className={labelClasses}>Photo du terrain</label>

                            {formData.image && (
                                <div className="mb-2">
                                    <img src={formData.image} alt="Aperçu" className="w-full h-32 object-cover rounded-lg border border-[#493622]" />
                                </div>
                            )}

                            <input
                                type="file"
                                id="image"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="w-full text-[#cbad90] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#f27f0d] file:text-[#231a10] hover:file:bg-[#d9720b] cursor-pointer"
                            />
                            {uploading && <p className="text-sm text-[#cbad90] mt-2">Téléchargement de l'image...</p>}
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-end gap-4 mt-4 pt-4 border-t border-[#493622]">
                            <button
                                type="button"
                                onClick={closeEditModal}
                                className="px-6 py-3 rounded-xl border border-[#493622] text-[#cbad90] hover:bg-[#493622] hover:text-white transition-colors"
                            >
                                Annuler
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading || uploading}
                                className="bg-[#f27f0d] text-[#231a10] px-8 py-3 rounded-xl font-bold hover:shadow-[0_0_20px_rgba(242,127,13,0.5)] transition-all disabled:opacity-50"
                            >
                                {isLoading ? "Enregistrement..." : "Enregistrer les modifications"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditFieldModal;
