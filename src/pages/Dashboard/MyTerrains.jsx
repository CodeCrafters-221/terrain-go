import React, { useState, useEffect } from 'react';
import TerrainCard from '../../components/Dashboard/TerrainCard';
import TerrainModal from '../../components/Dashboard/TerrainModal';
import { TerrainService } from '../../services/TerrainService';
import { toast } from 'react-toastify';

const MyTerrains = () => {
    const [terrains, setTerrains] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTerrain, setEditingTerrain] = useState(null);

    // Initial Fetch
    useEffect(() => {
        loadTerrains();
    }, []);

    const loadTerrains = async () => {
        try {
            setLoading(true);
            const data = await TerrainService.getAllTerrains();
            setTerrains(data);
        } catch (error) {
            console.error(error);
            toast.error("Erreur lors du chargement des terrains");
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = () => {
        setEditingTerrain(null);
        setIsModalOpen(true);
    };

    const handleEdit = (terrain) => {
        setEditingTerrain(terrain);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer ce terrain ?")) {
            try {
                await TerrainService.deleteTerrain(id);
                setTerrains(terrains.filter(t => t.id !== id));
                toast.success("Terrain supprimé avec succès");
            } catch (error) {
                console.error(error);
                toast.error("Erreur lors de la suppression");
            }
        }
    };

    const handleSave = async (terrainData, imageFile) => {
        try {
            if (editingTerrain) {
                await TerrainService.updateTerrain(editingTerrain.id, terrainData, imageFile);
                toast.success("Terrain modifié avec succès");
            } else {
                await TerrainService.createTerrain(terrainData, imageFile);
                toast.success("Terrain créé avec succès");
            }
            await loadTerrains(); // Refresh list to get updated data with images
            setIsModalOpen(false);
        } catch (error) {
            console.error("Save Error:", error);
            toast.error(`Erreur: ${error.message || "Impossible d'enregistrer"}`);
        }
    };

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-white text-3xl font-bold">Mes Terrains</h1>
                    <p className="text-[#cbad90] text-sm mt-1">Gérez vos installations sportives et leurs disponibilités.</p>
                </div>
                <button
                    onClick={handleAdd}
                    className="flex items-center justify-center gap-2 rounded-full h-12 px-6 bg-[#f27f0d] text-[#231a10] text-sm font-bold shadow-[0_0_15px_rgba(242,127,13,0.3)] hover:shadow-[0_0_20px_rgba(242,127,13,0.5)] transition-all cursor-pointer"
                >
                    <span className="material-symbols-outlined text-[20px]">add</span>
                    Ajouter un Terrain
                </button>
            </div>

            {/* Grid */}
            {loading ? (
                <div className="text-white text-center py-20">Chargement des terrains...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {terrains.map(terrain => (
                        <TerrainCard
                            key={terrain.id}
                            terrain={terrain}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    ))}

                    {/* Add Card Placeholder */}
                    <button
                        onClick={handleAdd}
                        className="rounded-2xl border-2 border-dashed border-[#493622] hover:border-[#f27f0d] hover:bg-[#2c241b]/50 transition-all flex flex-col items-center justify-center gap-4 min-h-[350px] group cursor-pointer"
                    >
                        <div className="size-16 rounded-full bg-[#231a10] border border-[#493622] flex items-center justify-center group-hover:bg-[#f27f0d] group-hover:text-[#231a10] transition-colors">
                            <span className="material-symbols-outlined text-3xl text-[#cbad90] group-hover:text-[#231a10]">add</span>
                        </div>
                        <p className="text-[#cbad90] font-medium group-hover:text-white">Ajouter un nouveau terrain</p>
                    </button>
                </div>
            )}

            <TerrainModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleSave}
                terrainToEdit={editingTerrain}
            />
        </div>
    );
};

export default MyTerrains;
