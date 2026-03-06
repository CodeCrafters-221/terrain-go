import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../services/supabaseClient";
import { useAuth } from "./AuthContext";
import { toast } from "react-toastify";

const DashboardContext = createContext();

export const useDashboard = () => useContext(DashboardContext);

export const DashboardProvider = ({ children }) => {
  const { user } = useAuth();
  const [fields, setFields] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [isLoadingFields, setIsLoadingFields] = useState(true);
  const [isLoadingReservations, setIsLoadingReservations] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const [archivedIds, setArchivedIds] = useState([]);

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
          price: field.price_per_hour
            ? `${field.price_per_hour} CFA/h`
            : "0 CFA/h",
          hours: field.opening_hours || "08:00 - 00:00",
          status: "Disponible",
        };
      });

      setFields(mappedFields);
    } catch (error) {
      console.error("Error fetching fields:", error.message);
    } finally {
      setIsLoadingFields(false);
    }
  };

  // --- NOTIFICATIONS ---
  const processNotifications = (reservs) => {
    const activeNotifs = reservs
      .filter(
        (r) => r.status === "En attente de paiement" || r.status === "Payé",
      )
      .map((r) => ({
        id: r.id,
        title: "Nouvelle réservation",
        message: `${r.clientName} a réservé ${r.fieldName}`,
        time: r.time,
        date: r.date,
        status: r.status,
        type: "reservation",
        original: r,
      }));

    setNotifications(activeNotifs);
    setUnreadCount(activeNotifs.length);
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
        .order("created_at", { ascending: false });

      if (error) throw error;

      const mappedReservations = data.map((r) => {
        const clientName = r.client_name || "Client Inconnu";
        const clientPhone = r.client_phone || "-";
        const initials = clientName
          .split(" ")
          .map((n) => n[0])
          .join("")
          .substring(0, 2)
          .toUpperCase();
        return {
          id: r.id,
          clientName,
          clientPhone,
          fieldId: r.field_id,
          fieldName: r.fields?.name || "Terrain inconnu",
          date: new Date(r.date).toLocaleDateString("fr-FR", {
            day: "numeric",
            month: "short",
            year: "numeric",
          }),
          time: `${(r.start_time || "").substring(0, 5)} - ${(r.end_time || "").substring(0, 5)}`,
          status: r.status,
          amount: r.total_price,
          paymentMethod: r.payment_method || "Non spécifié",
          initials,
          createdAt: r.created_at,
        };
      });

      setReservations(mappedReservations);
      processNotifications(mappedReservations);
    } catch (error) {
      console.error("Error fetching reservations:", error.message);
    } finally {
      setIsLoadingReservations(false);
    }
  };

  // --- REALTIME SUBSCRIPTION ---
  useEffect(() => {
    if (!user) return;

    const subscription = supabase
      .channel("reservations-owner-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "reservations",
        },
        async (payload) => {
          console.log("Realtime change detected:", payload);
          await fetchReservations();
          if (payload.eventType === "INSERT") {
            toast.info("Une nouvelle réservation vient d'arriver !");
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [user]);

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
        parseInt(String(newFieldData.price).replace(/[^0-9]/g, "")) || 0;
      const insertPayload = {
        proprietaire_id: user.id,
        name: newFieldData.name,
        description: newFieldData.description,
        adress: newFieldData.location,
        pelouse: newFieldData.type,
        opening_hours: newFieldData.hours,
        price_per_hour: numericPrice,
      };

      const { data: fieldData, error: fieldError } = await supabase
        .from("fields")
        .insert([insertPayload])
        .select()
        .single();

      if (fieldError) throw fieldError;

      if (newFieldData.image && fieldData?.id) {
        await supabase.from("field_images").insert([
          {
            terrain_id: fieldData.id,
            url_image: newFieldData.image,
          },
        ]);
      }

      await fetchFields();
      return fieldData;
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
      console.log(`Updating reservation ${id} to status: ${status}`);
      const { data, error } = await supabase
        .from("reservations")
        .update({ status: status })
        .eq("id", id)
        .select();

      if (error) {
        console.error("Supabase error details:", JSON.stringify(error));
        throw error;
      }

      if (!data || data.length === 0) {
        console.warn("No rows were updated. This may be a RLS policy issue.");
        throw new Error(
          "La mise à jour a échoué. Vérifiez les permissions (RLS).",
        );
      }

      await fetchReservations();
      return true;
    } catch (error) {
      console.error("Error updating reservation status:", error.message);
      throw error;
    }
  };

  const addManualReservation = async (data) => {
    try {
      const { error } = await supabase.from("reservations").insert({
        field_id: data.fieldId,
        date: data.date,
        start_time: data.startTime,
        end_time: data.endTime,
        total_price: data.amount || 0,
        status: "Confirmé",
      });

      if (error) throw error;
      await fetchReservations();
      return true;
    } catch (error) {
      console.error("Error adding manual reservation:", error.message);
      throw error;
    }
  };

  const toggleFieldStatus = async (fieldId) => {
    console.warn(
      "La fonctionnalité de désactivation n'est pas encore disponible en base de données.",
    );
    toast.info("La désactivation des terrains sera bientôt disponible.");
  };

  // --- MODAL FUNCTIONS ---
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
    );
    startOfWeek.setHours(0, 0, 0, 0);

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

      return { name: day, players: count * 10 };
    });

    const weeklyRevenueData = [4, 3, 2, 1].map((weeksAgo) => {
      const start = new Date();
      start.setDate(now.getDate() - weeksAgo * 7);
      const end = new Date();
      end.setDate(now.getDate() - (weeksAgo - 1) * 7);

      const weeklyTotal = reservations.reduce((acc, r) => {
        const rDate = new Date(r.date.split(" ").reverse().join("-"));
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

    const distribution = fields
      .map((f) => {
        const count = reservations.filter((r) => r.fieldId === f.id).length;
        return { name: f.name, value: count };
      })
      .filter((d) => d.value > 0);

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

  // --- PERSISTENT ARCHIVING ---
  useEffect(() => {
    if (user) {
      const storageKey = `archived_reservations_${user.id}`;
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        try {
          setArchivedIds(JSON.parse(saved).map((id) => String(id)));
        } catch (e) {
          setArchivedIds([]);
        }
      } else {
        setArchivedIds([]);
      }
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      const storageKey = `archived_reservations_${user.id}`;
      localStorage.setItem(storageKey, JSON.stringify(archivedIds));
    }
  }, [archivedIds, user]);

  const toggleArchiveReservation = (id) => {
    const idStr = String(id);
    setArchivedIds((prev) => {
      const isArchived = prev.includes(idStr);
      return isArchived
        ? prev.filter((hid) => String(hid) !== idStr)
        : [...prev, idStr];
    });
  };

  const stats = getStats();

  const Value = {
    fields,
    reservations,
    stats,
    notifications,
    unreadCount,
    archivedIds,
    toggleArchiveReservation,
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
    <DashboardContext.Provider value={Value}>
      {children}
    </DashboardContext.Provider>
  );
};
