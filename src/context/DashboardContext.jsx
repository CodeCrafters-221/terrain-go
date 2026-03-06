import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../services/supabaseClient";
import { useAuth } from "./AuthContext";

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
        .from("fields")
        .select(
          `
                    *,
                    field_images (url_image)
                `,
        )
        .eq("proprietaire_id", user.id);

      if (error) throw error;

      const mappedFields = data.map((field) => {
        const imagesList = field.field_images || [];
        const mainImage =
          imagesList.length > 0 ? imagesList[0].url_image : null;

        return {
          ...field,
          type: field.pelouse,
          location: field.adress,
          image: mainImage || "https://placehold.co/600x400?text=No+Image",
          price: field.price ? `${field.price} CFA/h` : "0 CFA/h",
          hours: field.opening_hours || "08:00 - 00:00",
          status: field.actif ? "Disponible" : "Indisponible",
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
        .from("reservations")
        .select(
          `
                    *,
                    fields!inner (name, proprietaire_id)
                `,
        )
        .eq("fields.proprietaire_id", user.id)
        .order("date", { ascending: false });

      if (error) throw error;

      const mappedReservations = data.map((r) => ({
        id: r.id,
        clientName: r.nom_client || "Client Inconnu",
        clientPhone: r.telephone_client || "Non renseigné",
        fieldId: r.terrain_id,
        fieldName: r.fields?.name || "Terrain inconnu",
        date: new Date(r.date).toLocaleDateString("fr-FR", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
        time: `${r.heure_debut.substring(0, 5)} - ${r.heure_fin.substring(0, 5)}`,
        status: r.statut,
        amount: r.prix_total,
        paymentMethod: r.methode_paiement,
        initials: (r.nom_client || "CI")
          .split(" ")
          .map((n) => n[0])
          .join("")
          .substring(0, 2)
          .toUpperCase(),
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
      const numericPrice =
        parseInt(newFieldData.price.replace(/[^0-9]/g, "")) || 0;
      const { data: fieldData, error: fieldError } = await supabase
        .from("fields")
        .insert([
          {
            proprietaire_id: user.id,
            name: newFieldData.name,
            description: newFieldData.description,
            adress: newFieldData.location,
            pelouse: newFieldData.type,
            price: numericPrice,
            opening_hours: newFieldData.hours,
          },
        ])
        .select()
        .single();

      if (fieldError) throw fieldError;

      if (newFieldData.image) {
        await supabase.from("field_images").insert([
          {
            terrain_id: fieldData.id,
            url_image: newFieldData.image,
          },
        ]);
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
      await supabase.from("field_images").delete().eq("terrain_id", id);
      const { error } = await supabase.from("fields").delete().eq("id", id);
      if (error) throw error;
      setFields(fields.filter((f) => f.id !== id));
    } catch (error) {
      console.error("Error deleting field:", error.message);
      throw error;
    }
  };

  const updateField = async (id, updatedAttributes) => {
    try {
      const numericPrice = updatedAttributes.price
        ? parseInt(updatedAttributes.price.replace(/[^0-9]/g, ""))
        : undefined;
      const dbPayload = {};
      if (updatedAttributes.name) dbPayload.name = updatedAttributes.name;
      if (updatedAttributes.description)
        dbPayload.description = updatedAttributes.description;
      if (updatedAttributes.location)
        dbPayload.adress = updatedAttributes.location;
      if (updatedAttributes.type) dbPayload.pelouse = updatedAttributes.type;
      if (updatedAttributes.hours)
        dbPayload.opening_hours = updatedAttributes.hours;
      if (numericPrice !== undefined) dbPayload.price = numericPrice;

      const { error } = await supabase
        .from("fields")
        .update(dbPayload)
        .eq("id", id);
      if (error) throw error;

      if (updatedAttributes.image) {
        await supabase.from("field_images").delete().eq("terrain_id", id);
        await supabase
          .from("field_images")
          .insert({ terrain_id: id, url_image: updatedAttributes.image });
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
        .from("reservations")
        .update({ statut: status })
        .eq("id", id);

      if (error) throw error;
      await fetchReservations();
    } catch (error) {
      console.error("Error updating reservation status:", error.message);
    }
  };

  const addManualReservation = async (data) => {
    try {
      const { error } = await supabase.from("reservations").insert({
        terrain_id: data.fieldId,
        date: data.date,
        heure_debut: data.startTime,
        heure_fin: data.endTime,
        prix_total: data.amount || 0,
        nom_client: data.clientName || "Réservation Manuelle",
        telephone_client: data.clientPhone || "-",
        statut: "Confirmé",
      });

      if (error) throw error;
      await fetchReservations();
      return true;
    } catch (error) {
      console.error("Error adding manual reservation:", error.message);
      throw error;
    }
  };

  const toggleFieldStatus = async (fieldId, currentStatus) => {
    try {
      const newStatus = currentStatus === "Disponible" ? false : true;
      const { error } = await supabase
        .from("fields")
        .update({ actif: newStatus })
        .eq("id", fieldId);

      if (error) throw error;
      await fetchFields();
    } catch (error) {
      console.error("Error toggling field status:", error.message);
    }
  };

  // --- MODAL STATE ---
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingField, setEditingField] = useState(null);

  const openCreateModal = () => setIsCreateModalOpen(true);
  const closeCreateModal = () => setIsCreateModalOpen(false);
  const openEditModal = (field) => {
    setEditingField(field);
    setIsEditModalOpen(true);
  };
  const closeEditModal = () => {
    setEditingField(null);
    setIsEditModalOpen(false);
  };

  // --- STATS & DATA PROCESSING ---
  const getStats = () => {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(
      now.getDate() - now.getDay() + (now.getDay() === 0 ? -6 : 1),
    ); // Lundi
    startOfWeek.setHours(0, 0, 0, 0);

    // 1. Attendance Data (7 derniers jours)
    const days = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
    const attendanceData = days.map((day, index) => {
      const dayDate = new Date(startOfWeek);
      dayDate.setDate(startOfWeek.getDate() + index);
      const dateStr = dayDate.toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });

      const count = reservations.filter(
        (r) => r.date === dateStr && r.status !== "Annulé",
      ).length;

      return { name: day, players: count * 10 }; // On estime 10 joueurs par réservation
    });

    // 2. Revenue Data (4 dernières semaines)
    const weeklyRevenueData = [4, 3, 2, 1].map((weeksAgo) => {
      const start = new Date();
      start.setDate(now.getDate() - weeksAgo * 7);
      const end = new Date();
      end.setDate(now.getDate() - (weeksAgo - 1) * 7);

      const weeklyTotal = reservations.reduce((acc, r) => {
        const rDate = new Date(r.date.split(" ").reverse().join("-")); // Simple conversion pour le calcul
        if (
          rDate >= start &&
          rDate < end &&
          (r.status === "Payé" || r.status === "Confirmé")
        ) {
          return acc + (r.amount || 0);
        }
        return acc;
      }, 0);

      return { name: `Sem ${5 - weeksAgo}`, revenue: weeklyTotal };
    });

    // 3. Field Distribution (Pie Chart)
    const distribution = fields
      .map((f) => {
        const count = reservations.filter((r) => r.fieldId === f.id).length;
        return { name: f.name, value: count };
      })
      .filter((d) => d.value > 0);

    // 4. Hourly Affluence
    const hours = ["16h", "17h", "18h", "19h", "20h", "21h", "22h"];
    const hourlyData = hours.map((h) => {
      const count = reservations.filter(
        (r) => r.time.startsWith(h.substring(0, 2)) && r.status !== "Annulé",
      ).length;
      return { hour: h, count: count };
    });

    return {
      totalFields: fields.length,
      activeReservations: reservations.filter((r) => r.status !== "Annulé")
        .length,
      weeklyRevenue: reservations.reduce(
        (acc, curr) =>
          acc +
          (curr.status === "Payé" || curr.status === "Confirmé"
            ? curr.amount
            : 0),
        0,
      ),
      occupancyRate:
        fields.length > 0
          ? `${Math.min(100, Math.round((reservations.length / (fields.length * 5)) * 100))}%`
          : "0%",
      attendanceData,
      weeklyRevenueData,
      fieldDistributionData: distribution,
      hourlyAffluenceData: hourlyData,
    };
  };

  const stats = getStats();

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
    addManualReservation,
    toggleFieldStatus,
    fetchFields,
    fetchReservations,
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};
