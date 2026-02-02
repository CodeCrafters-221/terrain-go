import React, { useState, useEffect } from "react";
import { X, Check } from "lucide-react";
import { TerrainService } from "../../services/TerrainService";

export default function OwnerReservationModal({
    isOpen,
    onClose,
    onSubmit
}) {
    const [terrains, setTerrains] = useState([]);
    const [formData, setFormData] = useState({
        terrainId: "",
        date: "",
        startTime: "",
        duration: "1",
        price: "",
        clientName: "",
        clientPhone: ""
    });
    const [loading, setLoading] = useState(false);

    // Load available terrains for the user
    useEffect(() => {
        if (isOpen) {
            TerrainService.getAllTerrains().then(data => {
                setTerrains(data);
                if (data.length > 0 && !formData.terrainId) {
                    setFormData(prev => ({ ...prev, terrainId: data[0].id, price: data[0].price }));
                }
            });
            // Reset date/time if needed or set defaults
        }
    }, [isOpen]);

    // Auto-calculate price when duration or terrain changes
    useEffect(() => {
        if (formData.terrainId) {
            const selectedTerrain = terrains.find(t => t.id === formData.terrainId);
            if (selectedTerrain) {
                const price = selectedTerrain.price || 0;
                const total = price * parseFloat(formData.duration);
                setFormData(prev => ({ ...prev, price: total }));
            }
        }
    }, [formData.terrainId, formData.duration, terrains]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Calculate End Time
        const [h, m] = formData.startTime.split(':').map(Number);
        const durationHours = parseFloat(formData.duration);
        const endH = (h + Math.floor(durationHours)) % 24; // Handle midnight wrap
        const endM = m + (durationHours % 1) * 60;
        // Simple formatting
        const endTime = `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`;

        try {
            await onSubmit({
                ...formData,
                endTime
            });
            onClose();
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-[#2e2318] rounded-2xl w-full max-w-lg flex flex-col border border-[#493622] shadow-2xl max-h-[90vh]">
                <div className="flex-none bg-[#2e2318] border-b border-[#493622] p-6 flex justify-between items-center rounded-t-2xl z-10">
                    <h2 className="text-white text-xl font-bold">Nouvelle Réservation (Manuel)</h2>
                    <button onClick={onClose} className="text-white hover:text-primary transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Terrain */}
                        <div>
                            <label className="block text-white text-sm font-semibold mb-2">Terrain</label>
                            <select
                                name="terrainId"
                                value={formData.terrainId}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl bg-[#342618] text-white border border-[#493622] focus:border-[#f27f0d] focus:outline-none"
                            >
                                {terrains.map(t => (
                                    <option key={t.id} value={t.id}>{t.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Date & Time */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-white text-sm font-semibold mb-2">Date</label>
                                <input
                                    type="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 rounded-xl bg-[#342618] text-white border border-[#493622] focus:border-[#f27f0d] focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-white text-sm font-semibold mb-2">Heure Début</label>
                                <input
                                    type="time"
                                    name="startTime"
                                    value={formData.startTime}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 rounded-xl bg-[#342618] text-white border border-[#493622] focus:border-[#f27f0d] focus:outline-none"
                                />
                            </div>
                        </div>

                        {/* Duration */}
                        <div>
                            <label className="block text-white text-sm font-semibold mb-2">Durée</label>
                            <div className="flex gap-2">
                                {[1, 1.5, 2, 3].map(d => (
                                    <button
                                        type="button"
                                        key={d}
                                        onClick={() => setFormData(prev => ({ ...prev, duration: d }))}
                                        className={`flex-1 py-2 rounded-lg border font-medium transition-colors ${parseFloat(formData.duration) === d
                                                ? "bg-[#f27f0d] text-[#231a10] border-[#f27f0d]"
                                                : "bg-transparent text-[#cbad90] border-[#493622] hover:border-[#f27f0d]"
                                            }`}
                                    >
                                        {d}h
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Client Info */}
                        <div className="pt-4 border-t border-[#493622]">
                            <h3 className="text-white font-bold mb-3">Informations Client</h3>
                            <div className="space-y-3">
                                <input
                                    type="text"
                                    name="clientName"
                                    value={formData.clientName}
                                    onChange={handleChange}
                                    placeholder="Nom du client"
                                    required
                                    className="w-full px-4 py-3 rounded-xl bg-[#342618] text-white border border-[#493622] focus:border-[#f27f0d] focus:outline-none"
                                />
                                <input
                                    type="tel"
                                    name="clientPhone"
                                    value={formData.clientPhone}
                                    onChange={handleChange}
                                    placeholder="Téléphone"
                                    required
                                    className="w-full px-4 py-3 rounded-xl bg-[#342618] text-white border border-[#493622] focus:border-[#f27f0d] focus:outline-none"
                                />
                            </div>
                        </div>

                        {/* Price Display */}
                        <div className="flex justify-between items-center pt-4">
                            <span className="text-[#cbad90]">Prix Total</span>
                            <span className="text-2xl font-bold text-[#f27f0d]">{Number(formData.price).toLocaleString()} F</span>
                        </div>

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
                                {loading ? "..." : "Confirmer"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
