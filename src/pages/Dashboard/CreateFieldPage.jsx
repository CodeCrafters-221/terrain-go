import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDashboard } from '../../context/DashboardContext';
import { toast } from 'react-toastify';
import { AvailabilityService } from '../../services/AvailabilityService';

const DAYS = [
    { value: 1, label: "Lundi" },
    { value: 2, label: "Mardi" },
    { value: 3, label: "Mercredi" },
    { value: 4, label: "Jeudi" },
    { value: 5, label: "Vendredi" },
    { value: 6, label: "Samedi" },
    { value: 0, label: "Dimanche" },
];

const CreateFieldPage = () => {
    const navigate = useNavigate();
    const { addField } = useDashboard();

    // Form State
    const [formData, setFormData] = useState({
        name: "",
        type: "",
        location: "",
        price: "",
        description: "",
        hours: "08:00 - 22:00",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAnNGA34sSndyAJAfENjmbZRG81TkS1IJSCHEAHafu1htOaj2cazf9VkAzI4xERiSDtxWleAt9uDNrVFcRvfQi2e-ZpTSJYfagli4b3vXbzcv-rH7Q5Hg_1kWirsvM-dr52fv7Qh2gJkNCmn1sXhB7fAXoinUFHJS8fJreTbxZNS322Vr3gPJfaiK-kkfmRlO9tuQrnujBbkoXIQGn-vRNGKl3Nfod6xatgMQk7J7RS2Mq-SVffZwiNQfZH1tY4ghFAAs5v8BYF1w"
    });

    // Availability schedule state
    const [schedule, setSchedule] = useState(
        DAYS.map(d => ({
            day_of_week: d.value,
            label: d.label,
            enabled: d.value >= 1 && d.value <= 6, // Lundi-Samedi par défaut
            start_time: "08:00",
            end_time: "22:00",
        }))
    );

    const [isLoading, setIsLoading] = useState(false);

    const updateScheduleDay = (index, field, value) => {
        setSchedule(prev => {
            const updated = [...prev];
            updated[index] = { ...updated[index], [field]: value };
            return updated;
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        if (!formData.name || !formData.price || !formData.location) {
            toast.error("Veuillez remplir les champs obligatoires");
            setIsLoading(false);
            return;
        }

        const enabledDays = schedule.filter(d => d.enabled);
        if (enabledDays.length === 0) {
            toast.error("Veuillez activer au moins un jour de disponibilité.");
            setIsLoading(false);
            return;
        }

        try {
            // Générer un résumé des horaires
            let hoursSummary = "Fermé";
            if (enabledDays.length > 0) {
                hoursSummary = `${enabledDays[0].start_time} - ${enabledDays[0].end_time}`;
            }

            const newFieldData = {
                ...formData,
                hours: hoursSummary,
                price: `${formData.price} CFA/h`,
                status: "Disponible"
            };

            const createdField = await addField(newFieldData);

            if (createdField?.id) {
                const availabilities = enabledDays.map(d => ({
                    day_of_week: d.day_of_week,
                    start_time: d.start_time,
                    end_time: d.end_time,
                }));

                await AvailabilityService.setFieldAvailability(createdField.id, availabilities);
            }

            toast.success("Terrain créé avec ses disponibilités !");
            navigate('/dashboard/terrains');
        } catch (error) {
            console.error("Erreur création:", error);
            toast.error(error.message || "Une erreur est survenue.");
        } finally {
            setIsLoading(false);
        }
    };

    const inputClasses = "w-full px-4 py-3 rounded-lg border border-[#493622] bg-[#231a10] text-[#cbad90] placeholder-[#5d452b] focus:outline-none focus:border-[#f27f0d] transition-colors";
    const labelClasses = "text-white text-sm font-medium mb-1 block";

    return (
        <div className="flex flex-col gap-8 max-w-3xl mx-auto w-full pb-20">
            <h2 className="text-white text-3xl font-bold">Ajouter un Nouveau Terrain</h2>

            <div className="bg-[#2c241b] rounded-2xl border border-[#493622] p-8">
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
                            rows="4"
                            placeholder="Description du terrain, commodités..."
                            value={formData.description}
                            onChange={handleInputChange}
                            className={inputClasses}
                        />
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
                                    <button
                                        type="button"
                                        onClick={() => updateScheduleDay(index, 'enabled', !day.enabled)}
                                        className={`w-10 h-6 rounded-full relative transition-all flex-shrink-0 ${day.enabled ? 'bg-[#f27f0d]' : 'bg-[#493622]'
                                            }`}
                                    >
                                        <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${day.enabled ? 'translate-x-4' : 'translate-x-0.5'
                                            }`} />
                                    </button>

                                    <span className={`text-sm font-semibold w-20 flex-shrink-0 ${day.enabled ? 'text-white' : 'text-[#5d452b]'
                                        }`}>
                                        {day.label}
                                    </span>

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
                    <div className="flex justify-end gap-4 mt-6 pt-6 border-t border-[#493622]">
                        <button
                            type="button"
                            onClick={() => navigate('/dashboard/terrains')}
                            className="px-6 py-3 rounded-xl border border-[#493622] text-[#cbad90] hover:bg-[#493622] hover:text-white transition-colors"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="bg-[#f27f0d] text-[#231a10] px-8 py-3 rounded-xl font-bold hover:shadow-[0_0_20px_rgba(242,127,13,0.5)] transition-all disabled:opacity-50"
                        >
                            {isLoading ? "Création..." : "Créer le Terrain"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateFieldPage;

