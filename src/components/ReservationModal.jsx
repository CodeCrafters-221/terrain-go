import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, X, Star, Lock, LogIn, UserPlus } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../services/supabaseClient";
import { AvailabilityService } from "../services/AvailabilityService";
import { ReservationService } from "../services/ReservationService";
import { toast } from "react-toastify";
import { CheckCircle2, Download } from "lucide-react";

export default function ReservationModal({
  isOpen,
  onClose,
  stadium,
  initialDate = "",
  initialTimeSlot = "",
  // user = null,
}) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    date: initialDate,
    timeSlot: initialTimeSlot,
    duration: "1",
    playerName: "",
    phone: "",
    email: "",
    paymentMethod: "Wave",
    reservationType: "single", // match unique par défaut
    subscriptionMonths: "1", // Added default 1 month
  });
  const [step, setStep] = useState(1); // 1: Info, 2: Payment
  const [ownerProfile, setOwnerProfile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [fieldStatus, setFieldStatus] = useState(
    stadium?.status || "Disponible",
  );
  const [lastReservation, setLastReservation] = useState(null);
  const [fullSchedule, setFullSchedule] = useState([]);
  const [loadingSchedule, setLoadingSchedule] = useState(false);
  // recuperer l'utilisateur
  const { user, profile } = useAuth();

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        playerName: profile?.name || "",
        phone: profile?.phone || "",
        email: user.email || "",
      }));
    }
  }, [user, profile]);

  // Reset modal when it opens or stadium changes
  useEffect(() => {
    if (isOpen) {
      setFormData((prev) => ({
        ...prev,
        date: initialDate || "",
        timeSlot: initialTimeSlot || "",
        duration: "1",
      }));
      setStep(1);
      setError(null);
      setAvailableSlots([]);
    }
  }, [isOpen, stadium?.id]);

  // Récupérer les créneaux libres depuis la table disponibilite + réservations existantes
  useEffect(() => {
    const fetchAvailableSlots = async () => {
      console.log("🔄 fetchAvailableSlots triggered:", {
        date: formData.date,
        duration: formData.duration,
      });
      if (!formData.date || !stadium?.id) {
        setAvailableSlots([]);
        setFormData((prev) => ({ ...prev, timeSlot: "" })); // Clear timeSlot when date is cleared
        return;
      }

      // Autoriser les UUIDs et les IDs numériques (bigint)
      const isUuid =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
          stadium.id,
        );
      const isNumeric = /^\d+$/.test(stadium.id);

      if (!isUuid && !isNumeric) {
        console.log("⚠️ Skipping slots fetch for demo/invalid ID:", stadium.id);
        setAvailableSlots([]);
        setLoadingSlots(false);
        return;
      }

      setLoadingSlots(true);
      setError(null);
      try {
        const slots = await AvailabilityService.getAvailableSlots(
          stadium.id,
          formData.date,
          formData.duration,
        );
        console.log("🎯 Modal received slots:", slots);
        setAvailableSlots(slots);

        // ─── CRITICAL : Reset timeSlot if it's no longer valid ───
        if (formData.timeSlot) {
          const stillValid = slots.find(
            (s) => s.time === formData.timeSlot && s.available,
          );
          if (!stillValid) {
            console.log("🧹 Clearing invalid timeSlot:", formData.timeSlot);
            setFormData((prev) => ({ ...prev, timeSlot: "" }));
          }
        }
      } catch (err) {
        console.error("Error fetching available slots:", err);
        setError("Erreur lors du chargement des créneaux: " + err.message);
        setAvailableSlots([]);
      } finally {
        setLoadingSlots(false);
      }
    };

    fetchAvailableSlots();
  }, [formData.date, formData.duration, stadium?.id]); // Added formData.duration

  useEffect(() => {
    const fetchFieldStatus = async () => {
      if (!stadium?.id) return;

      const isUuid =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
          stadium.id,
        );
      const isNumeric = /^\d+$/.test(stadium.id);
      if (!isUuid && !isNumeric) return;

      try {
        const { data, error } = await supabase
          .from("fields")
          .select("id")
          .eq("id", stadium.id)
          .single();

        if (error) {
          console.error("Supabase Error (fields):", error);
          return;
        }
        if (data) {
          setFieldStatus("Disponible");
        }
      } catch (err) {
        console.error("Error fetching field status:", err);
      }
    };
    fetchFieldStatus();
  }, [stadium?.id]);

  // availableSlots est maintenant directement alimenté par le state via AvailabilityService

  // Fetch full schedule for information
  useEffect(() => {
    const fetchFullSchedule = async () => {
      if (!stadium?.id || !isOpen) return;

      const isUuid =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
          stadium.id,
        );
      const isNumeric = /^\d+$/.test(stadium.id);
      if (!isUuid && !isNumeric) return;

      setLoadingSchedule(true);
      try {
        const data = await AvailabilityService.getFieldAvailability(stadium.id);
        setFullSchedule(data || []);
      } catch (err) {
        console.error("Error fetching full schedule:", err);
      } finally {
        setLoadingSchedule(false);
      }
    };

    fetchFullSchedule();
  }, [stadium?.id, isOpen]);

  // Fetch owner profile for payment number
  useEffect(() => {
    const fetchOwnerProfile = async () => {
      if (!stadium?.proprietaire_id || !isOpen) return;
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("phone, name")
          .eq("id", stadium.proprietaire_id)
          .single();

        if (error) throw error;
        setOwnerProfile(data);
      } catch (err) {
        console.error("Error fetching owner profile:", err);
      }
    };

    fetchOwnerProfile();
  }, [stadium?.proprietaire_id, isOpen]);

  const durations = [
    { value: "1", label: "1h" },
    { value: "1.5", label: "1h30" },
    { value: "2", label: "2h" },
    { value: "3", label: "3h" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const calculateTotal = () => {
    if (!stadium) return 0;
    return stadium.price * parseFloat(formData.duration);
  };

  const calculateEndTime = (startTime, durationHours) => {
    if (!startTime) return "";
    const [hours, minutes] = startTime.split(":").map(Number);
    const date = new Date(2000, 0, 1, hours, minutes); // Base date for consistent calculation

    // Add duration in minutes to handle decimals (like 1.5h) properly
    const durationInMinutes = Math.round(Number(durationHours) * 60);
    date.setMinutes(date.getMinutes() + durationInMinutes);

    const h = String(date.getHours()).padStart(2, "0");
    const m = String(date.getMinutes()).padStart(2, "0");
    return `${h}:${m}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (
        !formData.date ||
        !formData.timeSlot ||
        !formData.playerName ||
        !formData.phone
      ) {
        throw new Error("Veuillez remplir les champs obligatoires (*)");
      }

      if (step === 1) {
        setStep(2);
        setIsSubmitting(false);
        return;
      }

      // Check if it's a demo terrain
      if (stadium.id.toString().startsWith("default-")) {
        throw new Error(
          "Ce terrain est un exemple de démonstration. Pour effectuer une vraie réservation, veuillez choisir un terrain dans la page 'Trouver un terrain'.",
        );
      }

      const endTime = calculateEndTime(
        formData.timeSlot,
        parseFloat(formData.duration),
      );

      // ═══ VÉRIFICATION CHEVAUCHEMENT AVANT INSERTION ═══
      const uuidRegex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (uuidRegex.test(stadium.id)) {
        const overlapCheck = await AvailabilityService.checkOverlap(
          stadium.id,
          formData.date,
          formData.timeSlot,
          endTime,
        );
        if (!overlapCheck.available) {
          throw new Error(overlapCheck.reason);
        }
      }

      const reservationData = {
        user_id: user?.id,
        field_id: stadium.id,
        date: formData.date,
        start_time: formData.timeSlot,
        end_time: endTime,
        total_price: calculateTotal(),
        status: "En attente de paiement",
        payment_method: formData.paymentMethod || "Wave",
        client_name: formData.playerName,
        client_phone: formData.phone,
        reservation_type: formData.reservationType || "single",
      };

      console.log("SENDING RESERVATION:", reservationData);

      if (formData.reservationType === 'subscription') {
        const startDate = new Date(formData.date);
        const months = parseInt(formData.subscriptionMonths || "1");
        
        // Calculate the end date based on EXACTLY 4 sessions per month.
        // If there are 4 sessions, the last one is 3 weeks (21 days) after the first one.
        // Formula: (Total Sessions - 1) * 7 days
        const totalSessions = months * 4;
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + (totalSessions - 1) * 7);

        const subData = {
          user_id: user?.id,
          field_id: stadium.id,
          client_name: formData.playerName,
          client_phone: formData.phone,
          day_of_week: startDate.getDay(),
          start_time: formData.timeSlot,
          end_time: endTime,
          start_date: formData.date,
          end_date: endDate.toISOString().split('T')[0],
          total_amount: calculateTotal() * 4 * months, // Simple estimation: 4 matches per month
          payment_method: formData.paymentMethod || "Wave"
        };

        const newSub = await ReservationService.createSubscription(subData);
        if (!newSub) throw new Error("Erreur lors de la création de l'abonnement : aucune donnée retournée. Vérifiez vos politiques RLS.");

        // CREATE FIRST RESERVATION ENTRY LINKED TO THIS SUB
        await supabase.from("reservations").insert([{
          user_id: user?.id,
          field_id: stadium.id,
          date: formData.date,
          start_time: formData.timeSlot,
          end_time: endTime,
          total_price: 0, // Subscription amount is tracked in sub table
          status: "En attente de paiement",
          payment_method: formData.paymentMethod || "Wave",
          client_name: formData.playerName,
          client_phone: formData.phone,
          subscription_id: newSub.id // THIS LINKS TO THE NEW SUB
        }]);

        setStep(3);
        return;
      }

      const { data: insertedData, error: insertError } = await supabase
        .from("reservations")
        .insert([reservationData])
        .select();


      if (insertError) {
        console.error("DETAILED INSERT ERROR:", insertError);
        console.error("Error code:", insertError.code);
        console.error("Error message:", insertError.message);
        console.error("Error details:", insertError.details);
        throw insertError;
      }

      console.log("INSERT SUCCESSFUL, RECEIVED DATA:", insertedData);

      setLastReservation(insertedData[0]);
      setStep(3);
      toast.success("Réservation effectuée !");

      setFormData((prev) => ({ ...prev, date: "", timeSlot: "" }));
    } catch (err) {
      console.error("Erreur réservation:", err);
      // Special handling for the bigint error just in case
      if (err.message?.includes("invalid input syntax for type bigint")) {
        setError(
          "Impossible de réserver ce terrain d'exemple. Veuillez utiliser la recherche pour trouver un vrai terrain.",
        );
      } else {
        setError(
          err.message || "Une erreur est survenue lors de la réservation.",
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !stadium) return null;

  // --- CAS PROPRIÉTAIRE : NE PEUT PAS RÉSERVER ---
  if (user && profile?.role === "owner") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
        <div className="bg-surface-dark rounded-2xl max-w-md w-full border border-surface-highlight shadow-2xl relative overflow-hidden">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors p-1"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="p-6 sm:p-8 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-orange-500/10 rounded-full flex items-center justify-center mb-6">
              <Lock className="w-8 h-8 text-orange-500" />
            </div>

            <h2 className="text-white text-2xl font-bold mb-3">
              Action non autorisée
            </h2>
            <p className="text-text-secondary text-base mb-8 leading-relaxed">
              En tant que{" "}
              <span className="text-white font-semibold">propriétaire</span>,
              vous ne pouvez pas effectuer de réservation sur la plateforme.
              Cette fonctionnalité est réservée aux clients.
            </p>

            <button
              onClick={onClose}
              className="w-full bg-surface-dark text-white font-bold py-3.5 rounded-xl hover:bg-surface-light border border-surface-highlight transition-all"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- CAS 1 : NON CONNECTÉ ---
  if (!user) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
        <div className="bg-surface-dark rounded-2xl max-w-md w-full border border-surface-highlight shadow-2xl relative overflow-hidden">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors p-1"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="p-6 sm:p-8 flex flex-col items-center text-center">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-primary/10 rounded-full flex items-center justify-center mb-5 sm:mb-6">
              <Lock className="w-7 h-7 sm:w-8 sm:h-8 text-primary" />
            </div>

            <h2 className="text-white text-xl sm:text-2xl font-bold mb-2 sm:mb-3">
              Connexion requise
            </h2>
            <p className="text-text-secondary text-sm sm:text-base mb-6 sm:mb-8 leading-relaxed">
              Pour réserver le terrain <br className="sm:hidden" />
              <span className="text-white font-semibold">{stadium.city}</span>,
              veuillez vous identifier.
            </p>

            <div className="flex flex-col gap-3 w-full">
              <button
                onClick={() => navigate("/login")}
                className="flex items-center justify-center gap-2 w-full bg-primary text-black font-bold py-3 sm:py-3.5 rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 text-sm sm:text-base"
              >
                <LogIn className="w-5 h-5" />
                Se connecter
              </button>

              <button
                onClick={() => navigate("/register")}
                className="flex items-center justify-center gap-2 w-full bg-transparent border-2 border-surface-highlight text-white font-bold py-3 sm:py-3.5 rounded-xl hover:bg-surface-dark hover:border-primary/30 transition-all text-sm sm:text-base"
              >
                <UserPlus className="w-5 h-5" />
                Créer un compte
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- CAS 2 : CONNECTÉ (STRUCTURE CORRIGÉE) ---
  return (
    // 1. Container Principal : Flex centré avec padding
    <div className="fixed inset-0 z-50 flex top-15 items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      {/* 2. La Carte : Flex Column avec une hauteur MAX définie (85vh) */}
      <div className="bg-surface-dark rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col border border-surface-highlight shadow-2xl">
        {/* 3. HEADER : Reste FIXE (flex-none) */}
        <div className="flex-none bg-surface-dark border-b border-surface-highlight p-4 sm:p-6 flex justify-between items-center rounded-t-2xl z-10">
          <div>
            <h2 className="text-white text-xl sm:text-2xl font-bold truncate max-w-[200px] sm:max-w-none">
              {stadium.city}
            </h2>
            <div className="text-text-secondary text-xs sm:text-sm flex items-center mt-1">
              <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 flex-shrink-0" />
              <span className="truncate">{stadium.location}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-primary transition-colors bg-surface-dark sm:bg-transparent p-2 rounded-full sm:p-0"
            aria-label="Fermer"
          >
            <X className="w-5 h-5 sm:w-8 sm:h-8" />
          </button>
        </div>

        {/* 4. CONTENU : DÉFILE (flex-1 overflow-y-auto) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {fieldStatus === "Indisponible" ? (
            <div className="flex flex-col items-center justify-center h-full py-12 text-center">
              <div className="w-16 h-10 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
                <Lock className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-white text-xl font-bold mb-2">
                Terrain Indisponible
              </h3>
              <p className="text-text-secondary max-w-xs mx-auto">
                Ce terrain a été temporairement mis hors ligne par le
                propriétaire. Veuillez réessayer plus tard ou choisir un autre
                terrain.
              </p>
              <button
                onClick={onClose}
                className="mt-8 px-8 py-3 bg-surface-dark text-white rounded-xl border border-surface-highlight hover:bg-surface-light font-bold transition-all"
              >
                Fermer
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
              {step === 1 ? (
                <>
                  {/* Card détails Terrain */}
                  <div className="bg-surface-dark rounded-xl p-3 sm:p-4 flex flex-row justify-between items-center border border-surface-highlight/50 gap-2">
                    <div className="space-y-1.5 sm:space-y-2">
                      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                        <span className="text-text-secondary text-[10px] sm:text-sm font-medium bg-surface-dark px-2 py-1 rounded whitespace-nowrap">
                          {stadium.totalPlayers}
                        </span>
                        <span className="hidden sm:inline text-gray-500">
                          •
                        </span>
                        <span className="text-text-secondary text-[10px] sm:text-sm font-medium bg-surface-dark px-2 py-1 rounded whitespace-nowrap">
                          {stadium.fieldStadium}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="text-primary w-3 h-3 sm:w-4 sm:h-4 fill-current" />
                        <span className="text-white text-xs sm:text-base font-semibold">
                          {stadium.notes}
                        </span>
                      </div>
                    </div>
                    <div className="text-right flex gap-1 items-center">
                      <p className="text-primary text-lg sm:text-2xl font-bold">
                        {(stadium.price || 0).toLocaleString()} CFA
                      </p>
                      <p className="text-gray-400 text-[10px] sm:text-sm">/h</p>
                    </div>
                  </div>

                  {/* Section Horaires d'ouverture */}
                  {loadingSchedule ? (
                    <div className="bg-background-dark border border-surface-highlight/30 rounded-xl p-3 flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent"></div>
                      <p className="text-text-secondary text-sm">
                        Chargement des horaires...
                      </p>
                    </div>
                  ) : (
                    fullSchedule.length > 0 && (
                      <div className="bg-background-dark border border-surface-highlight/30 rounded-xl p-3">
                        <h4 className="text-white text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-sm text-primary">
                            schedule
                          </span>
                          Jours d'ouverture
                        </h4>
                        <div className="flex flex-wrap gap-1.5">
                          {[1, 2, 3, 4, 5, 6, 0].map((dayNum) => {
                            // Monday=1, Sunday=0
                            const dayAvail = fullSchedule.find(
                              (a) => a.day_of_week === dayNum,
                            );
                            const dayName =
                              AvailabilityService.getDayShortName(dayNum); // Assuming AvailabilityService is imported and has this method
                            return (
                              <div
                                key={dayNum}
                                className={`flex flex-col items-center min-w-[38px] sm:min-w-[45px] py-1.5 rounded-lg border transition-all ${
                                  dayAvail
                                    ? "bg-primary/5 border-primary/20"
                                    : "bg-red-500/5 border-red-500/10 opacity-40"
                                }`}
                              >
                                <span
                                  className={`text-[9px] sm:text-[10px] font-bold ${dayAvail ? "text-primary" : "text-red-400"}`}
                                >
                                  {dayName}
                                </span>
                                <span className="text-[8px] sm:text-[9px] text-text-secondary">
                                  {dayAvail
                                    ? dayAvail.start_time.substring(0, 5)
                                    : "Fermé"}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )
                  )}

                  {/* Grid Date & Heure */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white text-sm sm:text-base font-semibold mb-2">
                        Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        min={new Date().toISOString().split("T")[0]}
                        required
                        className="w-full px-3 py-2.5 sm:px-4 sm:py-3 rounded-lg bg-surface-dark text-white text-sm sm:text-base border border-surface-highlight focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-white text-sm sm:text-base font-semibold mb-3">
                        Heure <span className="text-red-500">*</span>
                      </label>

                      {loadingSlots ? (
                        <div className="flex flex-col items-center justify-center py-10 bg-surface-dark/30 rounded-xl border border-surface-highlight animate-pulse">
                          <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent mb-3"></div>
                          <p className="text-sm text-text-secondary font-medium">
                            Vérification des disponibilités...
                          </p>
                        </div>
                      ) : !formData.date ? (
                        <div className="text-center p-6 border-2 border-dashed border-surface-highlight rounded-xl bg-surface-dark/30">
                          <p className="text-text-secondary text-sm">
                            Veuillez d'abord choisir une date
                          </p>
                        </div>
                      ) : availableSlots.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-2 border-2 border-dashed border-red-500/30 rounded-2xl bg-red-500/5 animate-in fade-in duration-300">
                          <div className="size-12 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
                            <X className="size-6 text-red-500" />
                          </div>
                          <h4 className="text-white font-bold text-lg mb-1 italic">
                            Terrain indisponible
                          </h4>
                          <p className="text-red-400 text-sm text-center max-w-[200px]">
                            Le propriétaire ne propose pas de créneaux pour ce
                            jour-là.
                          </p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                          {availableSlots.map((slot) => (
                            <button
                              key={slot.time}
                              type="button"
                              disabled={!slot.available}
                              onClick={() =>
                                setFormData((prev) => ({
                                  ...prev,
                                  timeSlot: slot.time,
                                }))
                              }
                              className={`
                                relative py-2.5 rounded-lg text-sm font-bold transition-all border
                                ${
                                  !slot.available
                                    ? "bg-background-dark border-surface-highlight text-white/20 cursor-not-allowed overflow-hidden shadow-inner"
                                    : formData.timeSlot === slot.time
                                      ? "bg-primary text-black border-primary shadow-[0_0_15px_rgba(242,127,13,0.3)] scale-105 z-10"
                                      : "bg-surface-dark text-white border-surface-highlight hover:border-primary/50 hover:bg-surface-light"
                                }
                              `}
                            >
                              {slot.time}
                              {/* Ligne de barrage pour les réservés */}
                              {!slot.available && (
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                  <div className="w-full h-[1.5px] bg-red-500/40 -rotate-12"></div>
                                </div>
                              )}
                            </button>
                          ))}
                        </div>
                      )}

                      {formData.date &&
                        !loadingSlots &&
                        availableSlots.length > 0 &&
                        availableSlots.every((s) => !s.available) && (
                          <p className="text-orange-400 text-xs mt-3 flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm">
                              info
                            </span>
                            {formData.date ===
                            new Date().toISOString().split("T")[0]
                              ? "Aucun créneau disponible pour le reste de la journée (temps passé ou réservé)."
                              : "Tous les créneaux sont déjà réservés pour ce jour."}
                          </p>
                        )}
                    </div>
                  </div>

                  {/* Durée */}
                  <div className="mt-6">
                    <label className="block text-white text-sm sm:text-base font-semibold mb-2">
                      Durée <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-4 gap-2 sm:gap-3">
                      {durations.map((dur) => (
                        <button
                          key={dur.value}
                          type="button"
                          onClick={() => {
                            setFormData((prev) => ({
                              ...prev,
                              duration: dur.value,
                            }));
                          }}
                          className={`py-2 sm:py-3 px-1 sm:px-4 rounded-lg font-semibold text-xs sm:text-base transition-all border ${
                            formData.duration === dur.value
                              ? "bg-primary text-black border-primary shadow-[0_0_10px_rgba(242,127,13,0.2)]"
                              : "bg-surface-dark text-white border-surface-highlight hover:border-primary/50"
                          }`}
                        >
                          {dur.label}
                        </button>
                      ))}
                    </div>

                    {/* Récapitulatif Heure */}
                    {formData.timeSlot && (
                      <div className="mt-4 p-3 bg-primary/5 border border-primary/20 rounded-xl flex items-center justify-between">
                        <span className="text-text-secondary text-sm">
                          Créneau sélectionné :
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-white font-bold">
                            {formData.timeSlot}
                          </span>
                          <span className="material-symbols-outlined text-primary text-sm">
                            arrow_forward
                          </span>
                          <span className="text-primary font-bold">
                            {calculateEndTime(
                              formData.timeSlot,
                              formData.duration,
                            )}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Type de réservation (Abonnement vs Unique) */}
                  <div className="mt-6">
                    <label className="block text-white text-sm sm:text-base font-semibold mb-2">
                      Type de réservation <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            reservationType: "single",
                          }))
                        }
                        className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold transition-all border ${
                          formData.reservationType === "single"
                            ? "bg-primary text-black border-primary shadow-[0_0_15px_rgba(242,127,13,0.3)]"
                            : "bg-surface-dark text-text-secondary border-surface-highlight hover:border-primary/30"
                        }`}
                      >
                        <span className="material-symbols-outlined text-lg">
                          calendar_today
                        </span>
                        Match Unique
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            reservationType: "subscription",
                          }))
                        }
                        className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold transition-all border ${
                          formData.reservationType === "subscription"
                            ? "bg-primary text-black border-primary shadow-[0_0_15px_rgba(242,127,13,0.3)]"
                            : "bg-surface-dark text-text-secondary border-surface-highlight hover:border-primary/30"
                        }`}
                      >
                        <span className="material-symbols-outlined text-lg">
                          autorenew
                        </span>
                        Abonnement
                      </button>
                    </div>

                    {/* Durée de l'abonnement */}
                    {formData.reservationType === "subscription" && (
                      <div className="mt-4 animate-fade-in">
                        <label className="block text-text-secondary text-xs font-bold uppercase tracking-wider mb-3">
                          Durée de l'abonnement
                        </label>
                        <div className="grid grid-cols-4 gap-2">
                          {[
                            { label: "1 Mois", value: "1" },
                            { label: "3 Mois", value: "3" },
                            { label: "4 Mois", value: "4" },
                            { label: "5 Mois", value: "5" },
                            { label: "6 Mois", value: "6" },
                            { label: "12 Mois", value: "12" },
                          ].map((month) => (
                            <button
                              key={month.value}
                              type="button"
                              onClick={() =>
                                setFormData((prev) => ({
                                  ...prev,
                                  subscriptionMonths: month.value,
                                }))
                              }
                              className={`py-2 rounded-lg text-xs font-black transition-all border ${
                                formData.subscriptionMonths === month.value
                                  ? "bg-primary/20 text-primary border-primary"
                                  : "bg-[#2c241b] text-text-secondary border-surface-highlight"
                              }`}
                            >
                              {month.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    {formData.reservationType === "subscription" && (
                      <div className="mt-3 p-4 bg-primary/10 rounded-2xl border border-primary/30 animate-in fade-in slide-in-from-top-2 duration-300">
                        <div className="flex items-start gap-3">
                          <span className="material-symbols-outlined text-primary text-xl">
                            info
                          </span>
                          <div className="flex-1">
                            <p className="text-white text-sm font-bold mb-1">
                              Récapitulatif de l'abonnement
                            </p>
                            <ul className="text-text-secondary text-xs space-y-1">
                              <li className="flex items-center gap-2">
                                <span className="size-1 rounded-full bg-primary"></span>
                                Récurrence : <span className="text-white font-bold">1 match par semaine</span>
                              </li>
                              <li className="flex items-center gap-2">
                                <span className="size-1 rounded-full bg-primary"></span>
                                Total : <span className="text-white font-bold">{parseInt(formData.subscriptionMonths || "1") * 4} séances</span> ({parseInt(formData.subscriptionMonths || "1")} mois)
                              </li>
                              <li className="flex items-center gap-2">
                                <span className="size-1 rounded-full bg-primary"></span>
                                Fin de l'abonnement : <span className="text-white font-bold">{
                                  (() => {
                                    const d = new Date(formData.date);
                                    const months = parseInt(formData.subscriptionMonths || "1");
                                    d.setDate(d.getDate() + (months * 4 - 1) * 7);
                                    return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
                                  })()
                                }</span>
                              </li>
                              <li className="flex items-center gap-2">
                                <span className="size-1 rounded-full bg-primary"></span>
                                Montant total : <span className="text-primary font-bold">{(calculateTotal() * 4 * parseInt(formData.subscriptionMonths || "1")).toLocaleString()} CFA</span>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Infos Perso */}
                  <div className="space-y-4 pt-2">
                    <h3 className="text-white font-bold text-base sm:text-lg border-b border-surface-highlight pb-2">
                      Vos informations
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-white text-sm font-semibold mb-1.5">
                          Nom complet <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="playerName"
                          value={formData.playerName}
                          onChange={handleChange}
                          placeholder="Ex: Moussa Diop"
                          required
                          className="w-full px-3 py-2.5 sm:px-4 sm:py-3 rounded-lg bg-surface-dark text-white text-sm sm:text-base border border-surface-highlight focus:border-primary focus:outline-none placeholder-gray-500"
                        />
                      </div>

                      <div>
                        <label className="block text-white text-sm font-semibold mb-1.5">
                          Téléphone <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="Ex: 77 123 45 67"
                          required
                          className="w-full px-3 py-2.5 sm:px-4 sm:py-3 rounded-lg bg-surface-dark text-white text-sm sm:text-base border border-surface-highlight focus:border-primary focus:outline-none placeholder-gray-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-white text-sm font-semibold mb-1.5">
                        Email{" "}
                        <span className="text-gray-500 font-normal text-xs">
                          (Optionnel)
                        </span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Ex: moussa@example.com"
                        className="w-full px-3 py-2.5 sm:px-4 sm:py-3 rounded-lg bg-surface-dark text-white text-sm sm:text-base border border-surface-highlight focus:border-primary focus:outline-none placeholder-gray-500"
                      />
                    </div>
                  </div>
                </>
              ) : step === 2 ? (
                <div className="space-y-6 py-4 animate-in slide-in-from-right-4 duration-300">
                  <div className="text-center">
                    <h3 className="text-white text-xl font-bold mb-2">
                      Dernière étape : Paiement
                    </h3>
                    <p className="text-text-secondary text-sm">
                      Choisissez votre mode de paiement préféré
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          paymentMethod: "Wave",
                        }))
                      }
                      className={`p-4 rounded-2xl flex flex-col items-center gap-3 transition-all border-2 ${
                        formData.paymentMethod === "Wave"
                          ? "bg-[#1e40af]/20 border-[#3b82f6] shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                          : "bg-surface-dark border-surface-highlight hover:border-[#3b82f6]/50"
                      }`}
                    >
                      <div className="w-12 h-12 bg-[#3b82f6] rounded-full flex items-center justify-center">
                        <span className="text-white font-black text-xl italic">
                          W
                        </span>
                      </div>
                      <span className="text-white font-bold">Wave</span>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          paymentMethod: "Orange Money",
                        }))
                      }
                      className={`p-4 rounded-2xl flex flex-col items-center gap-3 transition-all border-2 ${
                        formData.paymentMethod === "Orange Money"
                          ? "bg-[#ea580c]/20 border-[#f97316] shadow-[0_0_15px_rgba(249,115,22,0.3)]"
                          : "bg-surface-dark border-surface-highlight hover:border-[#f97316]/50"
                      }`}
                    >
                      <div className="w-12 h-12 bg-[#f97316] rounded-full flex items-center justify-center">
                        <span className="text-white font-black text-xl italic">
                          O
                        </span>
                      </div>
                      <span className="text-white font-bold">Orange Money</span>
                    </button>
                  </div>

                  <div className="bg-background-dark border border-primary/20 rounded-2xl p-6 space-y-4">
                    <div className="flex flex-col items-center text-center gap-2">
                      <p className="text-text-secondary text-sm font-medium">
                        Envoyez exactement
                      </p>
                      <p className="text-primary text-3xl font-black">
                        {(calculateTotal() || 0).toLocaleString()} CFA
                      </p>
                    </div>

                    <div className="h-px bg-[#493622] w-full"></div>

                    <div className="flex flex-col gap-2">
                      <p className="text-white/60 text-xs text-center uppercase tracking-widest font-bold">
                        Numéro de transfert
                      </p>
                      <div className="bg-surface-dark rounded-xl p-4 flex items-center justify-center gap-3 border border-surface-highlight">
                        <span className="text-white text-2xl font-black tracking-wider">
                          {ownerProfile?.phone || "Non renseigné"}
                        </span>
                      </div>
                      <p className="text-text-secondary text-[10px] text-center italic mt-1">
                        Destinataire :{" "}
                        <span className="text-white not-italic font-bold">
                          {ownerProfile?.name || "Propriétaire"}
                        </span>
                      </p>
                    </div>

                    <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex items-start gap-3">
                      <div className="size-5 rounded-full bg-primary flex items-center justify-center shrink-0 mt-0.5">
                        <X className="size-3 text-black rotate-45" />
                      </div>
                      <p className="text-text-secondary text-xs leading-relaxed">
                        Une fois le transfert effectué, cliquez sur{" "}
                        <strong>"Confirmer la réservation"</strong>. Le
                        propriétaire validera votre créneau dès réception.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center animate-in zoom-in-95 duration-300">
                  <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 className="w-12 h-12 text-green-500" />
                  </div>
                  <h3 className="text-white text-2xl font-bold mb-2">
                    Demande de réservation envoyée !
                  </h3>
                  <p className="text-text-secondary max-w-sm mx-auto mb-8">
                    Votre demande pour{" "}
                    <span className="text-white font-bold">{stadium.city}</span>{" "}
                    a bien été enregistrée avec le statut{" "}
                    <span className="text-primary font-bold">
                      En attente de paiement
                    </span>
                    .
                    <br />
                    <br />
                    Dès que le propriétaire confirmera la réception de votre
                    transfert{" "}
                    <span className="text-white font-bold">
                      {formData.paymentMethod}
                    </span>
                    , votre ticket sera mis à jour.
                  </p>

                  <div className="flex flex-col gap-3 w-full max-w-md">
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        setStep(1);
                        navigate("/compte");
                      }}
                      className="flex items-center justify-center gap-2 bg-primary text-black font-bold py-3.5 rounded-xl hover:bg-primary/90 transition-all shadow-lg w-full"
                    >
                      Voir mes réservations
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        setStep(1);
                      }}
                      className="text-text-secondary text-sm font-bold py-2 hover:text-white transition-all underline"
                    >
                      Retourner à l'accueil
                    </button>
                  </div>
                </div>
              )}

              {/* Erreur */}
              {error && (
                <div className="bg-red-500/10 border border-red-500 rounded-lg p-3 sm:p-4">
                  <p className="text-red-500 text-xs sm:text-sm text-center">
                    {error}
                  </p>
                </div>
              )}

              {/* Footer Actions */}
              {step !== 3 && (
                <div className="border-t border-surface-highlight pt-4 sm:pt-6 space-y-4 pb-2">
                  {step === 1 && (
                    <div className="flex justify-between items-center">
                      <span className="text-white text-base sm:text-lg">
                        Total
                      </span>
                      <span className="text-primary text-2xl sm:text-3xl font-bold">
                        {(calculateTotal() || 0).toLocaleString()} F
                      </span>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={step === 1 ? onClose : () => setStep(1)}
                      className="flex-1 py-3 sm:py-3.5 px-4 rounded-xl border border-surface-highlight text-white text-sm sm:text-base font-bold hover:bg-surface-dark transition-colors"
                    >
                      {step === 1 ? "Annuler" : "Retour"}
                    </button>
                    <button
                      type="submit"
                      disabled={
                        isSubmitting ||
                        loadingSlots ||
                        (step === 1 &&
                          (!formData.timeSlot || availableSlots.length === 0))
                      }
                      className="flex-1 py-3 sm:py-3.5 px-4 rounded-xl bg-primary text-black text-sm sm:text-base font-bold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-primary/20 whitespace-nowrap"
                    >
                      {loadingSlots && step === 1
                        ? "Vérification..."
                        : isSubmitting
                          ? "En cours..."
                          : step === 1
                            ? "Suivant : Paiement"
                            : "Confirmer la réservation"}
                    </button>
                  </div>
                </div>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
