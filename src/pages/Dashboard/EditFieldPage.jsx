import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDashboard } from '../../context/DashboardContext';
import { toast } from 'react-toastify';

const EditFieldPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { fields, updateField } = useDashboard();

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

    // Initialize form with existing data
    useEffect(() => {
        const fieldToEdit = fields.find(f => f.id === parseInt(id) || f.id === id);
        if (fieldToEdit) {
            // Extract numeric price for input
            const priceValue = fieldToEdit.price.replace(/[^0-9]/g, '');
            setFormData({
                ...fieldToEdit,
                price: priceValue
            });
        } else {
            toast.error("Terrain non trouvé");
            navigate('/dashboard/terrains');
        }
    }, [id, fields, navigate]);

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

        // Simulate API delay
        setTimeout(() => {
            // Format data for Context
            const updatedField = {
                ...formData,
                price: `${formData.price} CFA/h` // Re-format price
            };

            updateField(id, updatedField);
            toast.success("Terrain modifié avec succès !");
            navigate('/dashboard/terrains');
        }, 1000);
    };

    const inputClasses = "w-full px-4 py-3 rounded-lg border border-[#493622] bg-[#231a10] text-[#cbad90] placeholder-[#5d452b] focus:outline-none focus:border-[#f27f0d] transition-colors";
    const labelClasses = "text-white text-sm font-medium mb-1 block";

    return (
        <div className="flex flex-col gap-8 max-w-3xl mx-auto w-full">
            <h2 className="text-white text-3xl font-bold">Modifier le Terrain</h2>

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

                    {/* Submit Button */}
                    <div className="flex justify-end gap-4 mt-4">
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
                            {isLoading ? "Enregistrement..." : "Enregistrer les modifications"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditFieldPage;
