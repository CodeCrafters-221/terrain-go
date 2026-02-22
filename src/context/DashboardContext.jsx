import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { useAuth } from './AuthContext';

const DashboardContext = createContext();

export const useDashboard = () => useContext(DashboardContext);

export const DashboardProvider = ({ children }) => {
    const { user } = useAuth();
    const [fields, setFields] = useState([]);
    const [reservations, setReservations] = useState([]);
    const [isLoadingFields, setIsLoadingFields] = useState(true);
    const [isLoadingReservations, setIsLoadingReservations] = useState(false);

    // --- FETCH FIELDS ---
    const fetchFields = async () => {
        if (!user) return;
        setIsLoadingFields(true);
        try {
            const { data, error } = await supabase
                .from('fields')
                .select(`
                    *,
                    field_images (url_image)
                `)
                .eq('proprietaire_id', user.id);

            if (error) throw error;

            const mappedFields = data.map(field => {
                const imagesList = field.field_images || [];
                const mainImage = imagesList.length > 0 ? imagesList[0].url_image : null;

                return {
                    ...field,
                    type: field.pelouse,
                    location: field.adress,
                    image: mainImage || "https://placehold.co/600x400?text=No+Image",
                    price: field.price ? `${field.price} CFA/h` : "0 CFA/h",
                    hours: field.opening_hours || "08:00 - 00:00"
                };
            });

            setFields(mappedFields);
        } catch (error) {
            console.error("Error fetching fields:", error.message);
        } finally {
            setIsLoadingFields(false);
        }
    };

    // --- FETCH RESERVATIONS ---
    const fetchReservations = async () => {
        if (!user) return;
        setIsLoadingReservations(true);
        try {
            const { data, error } = await supabase
                .from('reservations')
                .select(`
                    *,
                    fields!inner (name, proprietaire_id)
                `)
                .eq('fields.proprietaire_id', user.id)
                .order('date', { ascending: false });

            if (error) throw error;

            const mappedReservations = data.map(r => ({
                id: r.id,
                clientName: r.nom_client || "Client Inconnu",
                clientPhone: r.telephone_client || "Non renseigné",
                fieldId: r.terrain_id,
                fieldName: r.fields?.name || "Terrain inconnu",
                date: new Date(r.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }),
                time: `${r.heure_debut.substring(0, 5)} - ${r.heure_fin.substring(0, 5)}`,
                status: r.statut,
                amount: r.prix_total,
                initials: (r.nom_client || "CI").split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
            }));

            setReservations(mappedReservations);
        } catch (error) {
            console.error("Error fetching reservations:", error.message);
        } finally {
            setIsLoadingReservations(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchFields();
            fetchReservations();
        }
    }, [user]);

    // --- FIELD ACTIONS ---
    const addField = async (newFieldData) => {
        try {
            const numericPrice = parseInt(newFieldData.price.replace(/[^0-9]/g, '')) || 0;
            const { data: fieldData, error: fieldError } = await supabase
                .from('fields')
                .insert([{
                    proprietaire_id: user.id,
                    name: newFieldData.name,
                    description: newFieldData.description,
                    adress: newFieldData.location,
                    pelouse: newFieldData.type,
                    price: numericPrice,
                    opening_hours: newFieldData.hours
                }])
                .select()
                .single();

            if (fieldError) throw fieldError;

            if (newFieldData.image) {
                await supabase.from('field_images').insert([{
                    terrain_id: fieldData.id,
                    url_image: newFieldData.image
                }]);
            }

            await fetchFields();
            return true;
        } catch (error) {
            console.error("Error adding field:", error.message);
            throw error;
        }
    };

    const deleteField = async (id) => {
        try {
            await supabase.from('field_images').delete().eq('terrain_id', id);
            const { error } = await supabase.from('fields').delete().eq('id', id);
            if (error) throw error;
            setFields(fields.filter(f => f.id !== id));
        } catch (error) {
            console.error("Error deleting field:", error.message);
            throw error;
        }
    };

    const updateField = async (id, updatedAttributes) => {
        try {
            const numericPrice = updatedAttributes.price ? parseInt(updatedAttributes.price.replace(/[^0-9]/g, '')) : undefined;
            const dbPayload = {};
            if (updatedAttributes.name) dbPayload.name = updatedAttributes.name;
            if (updatedAttributes.description) dbPayload.description = updatedAttributes.description;
            if (updatedAttributes.location) dbPayload.adress = updatedAttributes.location;
            if (updatedAttributes.type) dbPayload.pelouse = updatedAttributes.type;
            if (updatedAttributes.hours) dbPayload.opening_hours = updatedAttributes.hours;
            if (numericPrice !== undefined) dbPayload.price = numericPrice;

            const { error } = await supabase.from('fields').update(dbPayload).eq('id', id);
            if (error) throw error;

            if (updatedAttributes.image) {
                await supabase.from('field_images').delete().eq('terrain_id', id);
                await supabase.from('field_images').insert({ terrain_id: id, url_image: updatedAttributes.image });
            }

            await fetchFields();
            return true;
        } catch (error) {
            console.error("Error updating field:", error.message);
            throw error;
        }
    };

    // --- RESERVATION ACTIONS ---
    const updateReservationStatus = async (id, status) => {
        try {
            const { error } = await supabase
                .from('reservations')
                .update({ statut: status })
                .eq('id', id);

            if (error) throw error;
            await fetchReservations();
        } catch (error) {
            console.error("Error updating reservation status:", error.message);
        }
    };

    // --- MODAL STATE ---
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingField, setEditingField] = useState(null);

    const openCreateModal = () => setIsCreateModalOpen(true);
    const closeCreateModal = () => setIsCreateModalOpen(false);
    const openEditModal = (field) => { setEditingField(field); setIsEditModalOpen(true); };
    const closeEditModal = () => { setEditingField(null); setIsEditModalOpen(false); };

    // --- STATS ---
    const stats = {
        totalFields: fields.length,
        activeReservations: reservations.filter(r => r.status !== 'Annulé').length,
        weeklyRevenue: reservations.reduce((acc, curr) => acc + (curr.status === 'Payé' || curr.status === 'Confirmé' ? curr.amount : 0), 0),
        occupancyRate: "85%"
    };

    const value = {
        fields,
        reservations,
        stats,
        isLoadingFields,
        isLoadingReservations,
        isCreateModalOpen,
        openCreateModal,
        closeCreateModal,
        isEditModalOpen,
        editingField,
        openEditModal,
        closeEditModal,
        addField,
        deleteField,
        updateField,
        updateReservationStatus,
        fetchFields,
        fetchReservations
    };

    return (
        <DashboardContext.Provider value={value}>
            {children}
        </DashboardContext.Provider>
    );
};
