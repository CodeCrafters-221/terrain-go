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
  const [subscriptions, setSubscriptions] = useState([]);
  const [isLoadingFields, setIsLoadingFields] = useState(true);
  const [isLoadingReservations, setIsLoadingReservations] = useState(true);
  const [isLoadingSubscriptions, setIsLoadingSubscriptions] = useState(true);
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
  const processNotifications = (reservs, subs = []) => {
    const resNotifs = reservs
      .filter((r) => r.status === "En attente de paiement")
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

    const subNotifs = subs
      .filter((s) => s.status === "En attente de paiement")
      .map((s) => ({
        id: s.id,
        title: "Nouvel Abonnement",
        message: `${s.clientName} s'est abonné à ${s.fieldName}`,
        time: s.time,
        date: "Hebdomadaire",
        status: s.status,
        type: "subscription",
        original: s,
      }));

    const activeNotifs = [...resNotifs, ...subNotifs].sort(
      (a, b) => new Date(b.original.createdAt) - new Date(a.original.createdAt),
    );

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
          originalDate: r.date, // ISO string 'YYYY-MM-DD'
          time: `${(r.start_time || "").substring(0, 5)} - ${(r.end_time || "").substring(0, 5)}`,
          status: r.status,
          amount: r.total_price || 0,
          paymentMethod: r.payment_method || "Non spécifié",
          initials,
          createdAt: r.created_at,
          reservationType: r.subscription_id ? "subscription" : "single",
          subscriptionId: r.subscription_id,
        };
      });

      setReservations(mappedReservations);
      processNotifications(mappedReservations, subscriptions);
    } catch (error) {
      console.error("Error fetching reservations:", error.message);
    } finally {
      setIsLoadingReservations(false);
    }
  };

  const fetchSubscriptions = async () => {
    if (!user) return;
    setIsLoadingSubscriptions(true);
    try {
      const { data, error } = await supabase
        .from("subscriptions")
        .select(
          `
          *,
          fields!inner (name, proprietaire_id)
        `,
        )
        .eq("fields.proprietaire_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      const mappedSubscriptions = data.map((s) => {
        const clientName = s.client_name || "Client Inconnu";
        const initials = clientName
          .split(" ")
          .map((n) => n[0])
          .join("")
          .substring(0, 2)
          .toUpperCase();
        return {
          id: s.id,
          clientName,
          clientPhone: s.client_phone || "-",
          fieldId: s.field_id,
          fieldName: s.fields?.name || "Terrain inconnu",
          dayOfWeek: s.day_of_week,
          time: `${(s.start_time || "").substring(0, 5)} - ${(s.end_time || "").substring(0, 5)}`,
          startDate: s.start_date,
          endDate: s.end_date,
          status: s.status,
          amount: s.total_amount || 0,
          paymentMethod: s.payment_method || "Non spécifié",
          initials,
          createdAt: s.created_at,
          reservationType: "subscription",
        };
      });

      setSubscriptions(mappedSubscriptions);
      processNotifications(reservations, mappedSubscriptions);
    } catch (error) {
      console.error("Error fetching subscriptions:", error.message);
    } finally {
      setIsLoadingSubscriptions(false);
    }
  };

  // --- REALTIME SUBSCRIPTION ---
  useEffect(() => {
    if (!user) return;

    fetchReservations();
    fetchSubscriptions();

    const channel = supabase
      .channel("dashboard-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "reservations",
        },
        async (payload) => {
          console.log("Realtime change detected for reservations:", payload);
          await fetchReservations();
          if (payload.eventType === "INSERT") {
            toast.info("Une nouvelle réservation vient d'arriver !");
          }
        },
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "subscriptions",
        },
        async (payload) => {
          console.log("Realtime change detected for subscriptions:", payload);
          await fetchSubscriptions();
          if (payload.eventType === "INSERT") {
            toast.info("Un nouvel abonnement vient d'être créé !");
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchFields();
      // fetchReservations() and fetchSubscriptions() are now called in the realtime useEffect
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

      if (
        newFieldData.images &&
        newFieldData.images.length > 0 &&
        fieldData?.id
      ) {
        const imageInserts = newFieldData.images.map((url) => ({
          terrain_id: fieldData.id,
          url_image: url,
        }));

        const { error: imagesError } = await supabase
          .from("field_images")
          .insert(imageInserts);

        if (imagesError)
          console.error("Error inserting multiple images:", imagesError);
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
      // 1. Clean up linked data (Foreign Key dependencies)
      await supabase.from("field_images").delete().eq("terrain_id", id);
      await supabase.from("disponibilite").delete().eq("field_id", id);
      await supabase.from("reservations").delete().eq("field_id", id);
      await supabase.from("subscriptions").delete().eq("field_id", id);

      // 2. Finally delete the field
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
      if (numericPrice !== undefined) dbPayload.price_per_hour = numericPrice; // Corrected field name

      const { error } = await supabase
        .from("fields")
        .update(dbPayload)
        .eq("id", id);
      if (error) throw error;

      if (updatedAttributes.image && !updatedAttributes.skipImageUpdate) {
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

  const updateSubscriptionStatus = async (id, status) => {
    try {
      console.log(`Updating subscription ${id} to status: ${status}`);
      // 1. Update the subscription itself
      const { data, error: subError } = await supabase
        .from("subscriptions")
        .update({ status: status })
        .eq("id", id)
        .select();

      if (subError) {
        console.error("Supabase error (sub):", subError);
        throw subError;
      }

      if (!data || data.length === 0) {
        throw new Error(
          "Mise à jour refusée par la base de données (Vérifiez vos RLS).",
        );
      }

      // 2. Proactively update the status of all linked reservations
      const { error: resError } = await supabase
        .from("reservations")
        .update({
          status:
            status === "Confirmé"
              ? "Confirmé"
              : status === "Annulé"
                ? "Annulé"
                : status,
        })
        .eq("subscription_id", id);

      if (resError)
        console.warn("Failed to update linked reservations:", resError.message);

      await fetchSubscriptions();
      await fetchReservations();
      return true;
    } catch (error) {
      console.error("Error updating subscription status:", error.message);
      toast.error(`Erreur : ${error.message}`);
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
        reservation_type: data.reservationType || "single",
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
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // For weekly charts
    const startOfWeek = new Date(now);
    startOfWeek.setDate(
      now.getDate() - now.getDay() + (now.getDay() === 0 ? -6 : 1),
    );
    startOfWeek.setHours(0, 0, 0, 0);

    const days = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
    const attendanceData = days.map((day, index) => {
      const dayDate = new Date(startOfWeek);
      dayDate.setDate(startOfWeek.getDate() + index);
      const dateStrIso = dayDate.toISOString().split("T")[0];

      const count = reservations.filter(
        (r) => r.originalDate === dateStrIso && r.status !== "Annulé",
      ).length;

      return { name: day, players: count * 10 };
    });

    const weeklyRevenueData = [4, 3, 2, 1].map((weeksAgo) => {
      const start = new Date();
      start.setDate(now.getDate() - weeksAgo * 7);
      const end = new Date();
      end.setDate(now.getDate() - (weeksAgo - 1) * 7);

      const weeklyTotal = reservations.reduce((acc, r) => {
        const rDate = new Date(r.originalDate);
        if (
          rDate >= start &&
          rDate < end &&
          (r.status === "Payé" || r.status === "Confirmé")
        ) {
          return acc + Number(r.amount || 0);
        }
        return acc;
      }, 0);

      return { name: `Sem ${5 - weeksAgo}`, revenue: weeklyTotal };
    });

    const distribution = fields
      .map((f) => {
        const count = reservations.filter(
          (r) => r.fieldId === f.id && r.status !== "Annulé",
        ).length;
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

    const todayStr = now.toISOString().split("T")[0];
    const todayObj = new Date(todayStr);

    const activeReservationsCount = reservations.filter(
      (r) => new Date(r.originalDate) >= todayObj && r.status !== "Annulé",
    ).length;

    const monthlyRevenue = reservations.reduce((acc, curr) => {
      const rDate = new Date(curr.originalDate);
      return (
        acc +
        (rDate >= startOfMonth &&
        (curr.status === "Payé" || curr.status === "Confirmé")
          ? Number(curr.amount || 0)
          : 0)
      );
    }, 0);

    const monthlyRevenueSubscriptions = subscriptions.reduce((acc, curr) => {
      const sDate = new Date(curr.createdAt);
      const isConfirmed = [
        "Confirmé",
        "active",
        "Payé",
        "En attente de paiement",
      ].includes(curr.status); // Adjusted to include all revenue-generating statuses
      return (
        acc +
        (sDate >= startOfMonth && isConfirmed ? Number(curr.amount || 0) : 0)
      );
    }, 0);

    const uniqueClientsCount = new Set(
      reservations
        .filter((r) => r.status !== "Annulé")
        .map((r) => r.clientName)
        .concat(subscriptions.map((s) => s.clientName)), // Include clients from subscriptions
    ).size;

    return {
      totalFields: fields.length,
      activeReservations: activeReservationsCount,
      weeklyRevenue: monthlyRevenue, // Matching the existing key to avoid breaking Statistics.jsx
      totalClients: uniqueClientsCount,
      subscriptionRevenue: monthlyRevenueSubscriptions, // Added new metric
      occupancyRate:
        fields.length > 0
          ? `${Math.min(100, Math.round((activeReservationsCount / (fields.length * 5)) * 100))}%`
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

  const uploadFieldImage = async (fieldId, file) => {
    try {
      const fileExt = file.name.split(".").pop() || "jpg";
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("terrain-images")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("terrain-images").getPublicUrl(fileName);

      const { error: dbError } = await supabase.from("field_images").insert({
        terrain_id: fieldId,
        url_image: publicUrl,
      });

      if (dbError) throw dbError;

      await fetchFields();
      return publicUrl;
    } catch (error) {
      console.error("Error uploading image:", error.message);
      throw error;
    }
  };

  const uploadMultipleFieldImages = async (fieldId, files) => {
    try {
      const uploadPromises = Array.from(files).map((file) =>
        uploadFieldImage(fieldId, file),
      );
      const urls = await Promise.all(uploadPromises);
      return urls;
    } catch (error) {
      console.error("Error uploading multiple images:", error.message);
      throw error;
    }
  };

  const deleteFieldImage = async (fieldId, imageUrl) => {
    try {
      // Extract filename from URL
      const urlParts = imageUrl.split("/");
      const fileName = urlParts[urlParts.length - 1];

      // 1. Delete from storage
      const { error: storageError } = await supabase.storage
        .from("terrain-images")
        .remove([fileName]);

      if (storageError) {
        console.warn("Storage delete error (continuing...):", storageError);
      }

      // 2. Delete from database
      const { error: dbError } = await supabase
        .from("field_images")
        .delete()
        .match({ url_image: imageUrl, terrain_id: fieldId });

      if (dbError) throw dbError;

      await fetchFields();
      return true;
    } catch (error) {
      console.error("Error deleting image:", error.message);
      throw error;
    }
  };

  const stats = getStats();

  const Value = {
    fields,
    reservations,
    subscriptions,
    stats,
    notifications,
    unreadCount,
    archivedIds,
    toggleArchiveReservation,
    isLoadingFields,
    isLoadingReservations,
    isLoadingSubscriptions,
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
    updateSubscriptionStatus,
    addManualReservation,
    toggleFieldStatus,
    fetchFields,
    fetchReservations,
    uploadFieldImage,
    uploadMultipleFieldImages,
    deleteFieldImage,
  };

  return (
    <DashboardContext.Provider value={Value}>
      {children}
    </DashboardContext.Provider>
  );
};
