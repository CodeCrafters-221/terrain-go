import React from 'react';

const TerrainCard = ({ terrain, onEdit, onDelete }) => {
    return (
        <div className="bg-[#2c241b] rounded-2xl overflow-hidden group border border-[#493622] hover:border-[#f27f0d] transition-all flex flex-col h-full">
            <div className="h-48 bg-cover bg-center relative" style={{ backgroundImage: `url('${terrain.image}')` }}>
                <div className={`absolute top-3 right-3 text-[#231a10] text-xs font-bold px-3 py-1 rounded-full shadow-sm ${terrain.status === 'Disponible' ? 'bg-[#0bda16]' : 'bg-[#f27f0d]'}`}>
                    {terrain.status}
                </div>
                <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-lg flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">location_on</span>
                    {terrain.location}
                </div>
            </div>
            <div className="p-4 flex flex-col gap-3 flex-1">
                <div className="flex justify-between items-start">
                    <div>
                        <h4 className="text-white font-bold text-lg">{terrain.name}</h4>
                        <p className="text-[#cbad90] text-sm">{terrain.type} • {terrain.surface}</p>
                    </div>
                </div>

                <div className="flex items-center gap-4 mt-auto border-t border-[#493622] pt-3">
                    <div className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[#f27f0d] text-[18px]">schedule</span>
                        <span className="text-xs text-[#cbad90]">{terrain.hours}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[#f27f0d] text-[18px]">attach_money</span>
                        <span className="text-xs text-[#cbad90]">{terrain.price} CFA/h</span>
                    </div>
                </div>

                {/* Actions for Owner */}
                <div className="flex gap-2 mt-2">
                    <button
                        onClick={() => onEdit(terrain)}
                        className="flex-1 py-2 rounded-lg bg-[#493622] text-[#cbad90] hover:text-white hover:bg-[#5d452b] text-sm font-medium transition-colors flex items-center justify-center gap-2"
                    >
                        <span className="material-symbols-outlined text-[18px]">edit</span>
                        Modifier
                    </button>
                    <button
                        onClick={() => onDelete(terrain.id)}
                        className="flex-1 py-2 rounded-lg border border-[#493622] text-red-400 hover:bg-red-500/10 text-sm font-medium transition-colors flex items-center justify-center gap-2"
                    >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                        Supprimer
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TerrainCard;
