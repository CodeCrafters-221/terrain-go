import React, { useState, useEffect } from 'react';
import { useDashboard } from '../context/DashboardContext';
import { toast } from 'react-toastify';
import { supabase } from '../services/supabaseClient';
import { AvailabilityService } from '../services/AvailabilityService';

const DAYS = [
    { value: 1, label: "Lundi" },
    { value: 2, label: "Mardi" },
    { value: 3, label: "Mercredi" },
    { value: 4, label: "Jeudi" },
    { value: 5, label: "Vendredi" },
    { value: 6, label: "Samedi" },
    { value: 0, label: "Dimanche" },
];

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

    // Availability schedule state
    const [schedule, setSchedule] = useState(
        DAYS.map(d => ({
            day_of_week: d.value,
            label: d.label,
            enabled: false,
            start_time: "08:00",
            end_time: "22:00",
        }))
    );

    const [isLoading, setIsLoading] = useState(false);
    const [uploading, setUploading] = useState(false);

    const updateScheduleDay = (index, field, value) => {
        setSchedule(prev => {
            const updated = [...prev];
            updated[index] = { ...updated[index], [field]: value };
            return updated;
        });
    };

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

    // Initialize form and fetch availability
    useEffect(() => {
        if (editingField) {
            let priceValue = editingField.price;
            if (typeof editingField.price === 'string') {
                priceValue = editingField.price.replace(/[^0-9]/g, '');
            }

            setFormData({
                ...editingField,
                price: priceValue
            });

            // Fetch existing availability
            const fetchAvailability = async () => {
                try {
                    const availabilities = await AvailabilityService.getFieldAvailability(editingField.id);

                    // Map existing availabilities to our schedule state
                    setSchedule(prev => prev.map(day => {
                        const found = availabilities.find(a => a.day_of_week === day.day_of_week);
                        if (found) {
                            return {
                                ...day,
                                enabled: true,
                                start_time: found.start_time.substring(0, 5),
                                end_time: found.end_time.substring(0, 5)
                            };
                        }
                        return { ...day, enabled: false };
                    }));
                } catch (error) {
                    console.error("Erreur chargement disponibilités:", error);
                }
            };

            fetchAvailability();
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

        // Check if at least 1 day is enabled
        const enabledDays = schedule.filter(d => d.enabled);
        if (enabledDays.length === 0) {
            toast.error("Veuillez activer au moins un jour de disponibilité.");
            setIsLoading(false);
            return;
        }

        try {
            // Générer un résumé des horaires
            const activeDays = schedule.filter(d => d.enabled);
            let hoursSummary = "Fermé";
            if (activeDays.length > 0) {
                hoursSummary = `${activeDays[0].start_time} - ${activeDays[0].end_time}`;
            }

            // Format data for Context
            const updatedField = {
                ...formData,
                hours: hoursSummary,
                price: `${formData.price} CFA/h` // Re-format price
            };

            await updateField(editingField.id, updatedField);

            // Update availabilities
            const availabilities = enabledDays.map(d => ({
                day_of_week: d.day_of_week,
                start_time: d.start_time,
                end_time: d.end_time,
            }));

            await AvailabilityService.setFieldAvailability(editingField.id, availabilities);

            toast.success("Terrain et disponibilités modifiés avec succès !");
            closeEditModal();
        } catch (error) {
            console.error("Erreur modification:", error);
            toast.error("Une erreur est survenue lors de la modification.");
        } finally {
            setIsLoading(false);
        }
    };

    const inputClasses = "w-full px-4 py-3 rounded-lg border border-[#493622] bg-[#231a10] text-[#cbad90] placeholder-[#5d452b] focus:outline-none focus:border-[#f27f0d] transition-colors";
    const labelClasses = "text-white text-sm font-medium mb-1 block";

    if (!isEditModalOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-[#2c241b] rounded-2xl border border-[#493622] w-full max-w-2xl max-h-[90vh] overflow-y-auto relative shadow-[0_0_40px_rgba(0,0,0,0.5)]">

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-[#493622] sticky top-0 bg-[#2c241b] z-10">
                    <div className="flex flex-col">
                        <h2 className="text-white text-2xl font-bold">Modifier le Terrain</h2>
                        <p className="text-[#cbad90] text-xs">Mettez à jour les informations et disponibilités</p>
                    </div>
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
                                rows="3"
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

                        {/* ═══ SECTION DISPONIBILITÉS ═══ */}
                        <div className="border-t border-[#493622] pt-6">
                            <h3 className="text-white text-lg font-bold mb-1">📅 Disponibilités</h3>
                            <p className="text-[#cbad90] text-xs mb-4">Définissez les jours et heures d'ouverture du terrain.</p>

                            <div className="space-y-3">
                                {schedule.map((day, index) => (
                                    <div
                                        key={day.day_of_week}
                                        className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${day.enabled
                                            ? "bg-[#231a10] border-[#f27f0d]/40"
                                            : "bg-[#231a10]/50 border-[#493622]/50 opacity-60"
                                            }`}
                                    >
                                        {/* Toggle */}
                                        <button
                                            type="button"
                                            onClick={() => updateScheduleDay(index, 'enabled', !day.enabled)}
                                            className={`w-10 h-6 rounded-full relative transition-all flex-shrink-0 ${day.enabled ? 'bg-[#f27f0d]' : 'bg-[#493622]'
                                                }`}
                                        >
                                            <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${day.enabled ? 'translate-x-4' : 'translate-x-0.5'
                                                }`} />
                                        </button>

                                        {/* Day name */}
                                        <span className={`text-sm font-semibold w-20 flex-shrink-0 ${day.enabled ? 'text-white' : 'text-[#5d452b]'
                                            }`}>
                                            {day.label}
                                        </span>

                                        {/* Time inputs */}
                                        {day.enabled && (
                                            <div className="flex items-center gap-2 flex-1">
                                                <input
                                                    type="time"
                                                    value={day.start_time}
                                                    onChange={(e) => updateScheduleDay(index, 'start_time', e.target.value)}
                                                    className="px-2 py-1.5 rounded-lg bg-[#342618] text-white text-sm border border-[#493622] focus:border-[#f27f0d] focus:outline-none w-28"
                                                />
                                                <span className="text-[#cbad90] text-xs">à</span>
                                                <input
                                                    type="time"
                                                    value={day.end_time}
                                                    onChange={(e) => updateScheduleDay(index, 'end_time', e.target.value)}
                                                    className="px-2 py-1.5 rounded-lg bg-[#342618] text-white text-sm border border-[#493622] focus:border-[#f27f0d] focus:outline-none w-28"
                                                />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-end gap-4 mt-2 pt-4 border-t border-[#493622]">
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

