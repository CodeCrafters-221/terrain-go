import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, X, Star, Lock, LogIn, UserPlus } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../services/supabaseClient";
import { toast } from "react-toastify";
import { generateTicket } from "../utils/ticketGenerator";
import { CheckCircle2, Download } from "lucide-react";

export default function ReservationModal({
  isOpen,
  onClose,
  stadium,
  // user = null,
}) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    date: "",
    timeSlot: "",
    duration: "1",
    playerName: "",
    phone: "",
    email: "",
    paymentMethod: "Wave",
  });
  const [step, setStep] = useState(1); // 1: Info, 2: Payment
  const [ownerProfile, setOwnerProfile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [busySlots, setBusySlots] = useState([]);
  const [workingHours, setWorkingHours] = useState([]);
  const [fieldStatus, setFieldStatus] = useState(stadium?.status || 'Disponible');
  const [lastReservation, setLastReservation] = useState(null);
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

  useEffect(() => {
    const fetchBusySlots = async () => {
      if (!formData.date || !stadium?.id) return;

      try {
        const { data, error } = await supabase
          .from('reservations')
          .select('heure_debut, heure_fin, statut')
          .eq('terrain_id', stadium.id)
          .eq('date', formData.date)
          .neq('statut', 'Annulé');

        if (error) throw error;
        setBusySlots(data || []);
      } catch (err) {
        console.error("Error fetching busy slots:", err);
      }
    };

    fetchBusySlots();
  }, [formData.date, stadium?.id]);

  // Fixed working hours for now as requested by user
  useEffect(() => {
    setWorkingHours([{ heure_debut: "06:00", heure_fin: "23:59" }]);
  }, []);

  useEffect(() => {
    const fetchFieldStatus = async () => {
      if (!stadium?.id) return;
      try {
        const { data, error } = await supabase
          .from('fields')
          .select('actif')
          .eq('id', stadium.id)
          .single();

        if (error) {
          console.error("Supabase Error (fields):", error);
          throw error;
        }
        setFieldStatus(data.actif ? 'Disponible' : 'Indisponible');
      } catch (err) {
        console.error("Error fetching field status:", err);
      }
    };
    fetchFieldStatus();
  }, [stadium?.id]);

  const allTimeSlots = [
    "00:00", "01:00", "02:00", "03:00", "04:00", "05:00", "06:00", "07:00",
    "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00",
    "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00",
  ];

  const availableSlots = allTimeSlots.filter(slot => {
    // 1. Must be within working hours for this day
    // Default to 08:00 - 23:00 if no working hours defined in tables
    const displayHours = workingHours.length > 0 ? workingHours : [{ heure_debut: "08:00", heure_fin: "23:00" }];

    const isInWorkingHours = displayHours.some(wh => {
      const whStart = wh.heure_debut.substring(0, 5);
      const whEnd = wh.heure_fin.substring(0, 5);
      return slot >= whStart && slot < whEnd;
    });

    if (!isInWorkingHours) return false;

    // 2. Must not be a busy slot
    const isBusy = busySlots.some(busy => {
      const busyStart = busy.heure_debut.substring(0, 5);
      const busyEnd = busy.heure_fin.substring(0, 5);
      return slot >= busyStart && slot < busyEnd;
    });

    return !isBusy;
  });

  // Fetch owner profile for payment number
  useEffect(() => {
    const fetchOwnerProfile = async () => {
      if (!stadium?.proprietaire_id || !isOpen) return;
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('phone, name')
          .eq('id', stadium.proprietaire_id)
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
    const [hours, minutes] = startTime.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    date.setTime(date.getTime() + durationHours * 60 * 60 * 1000);
    return date.toTimeString().split(' ')[0].substring(0, 5);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (!formData.date || !formData.timeSlot || !formData.playerName || !formData.phone) {
        throw new Error("Veuillez remplir les champs obligatoires (*)");
      }

      if (step === 1) {
        setStep(2);
        setIsSubmitting(false);
        return;
      }

      // Check if it's a demo terrain
      if (stadium.id.toString().startsWith("default-")) {
        throw new Error("Ce terrain est un exemple de démonstration. Pour effectuer une vraie réservation, veuillez choisir un terrain dans la page 'Trouver un terrain'.");
      }

      const endTime = calculateEndTime(formData.timeSlot, parseFloat(formData.duration));

      const reservationData = {
        utilisateur_id: user?.id,
        terrain_id: stadium.id,
        date: formData.date,
        heure_debut: formData.timeSlot,
        heure_fin: endTime,
        prix_total: calculateTotal(),
        nom_client: formData.playerName,
        telephone_client: formData.phone,
        statut: 'En attente de paiement'
      };

      console.log("SENDING RESERVATION:", reservationData);

      const { data: insertedData, error: insertError } = await supabase
        .from('reservations')
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
        setError("Impossible de réserver ce terrain d'exemple. Veuillez utiliser la recherche pour trouver un vrai terrain.");
      } else {
        setError(err.message || "Une erreur est survenue lors de la réservation.");
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
        <div className="bg-[#2e2318] rounded-2xl max-w-md w-full border border-[#493622] shadow-2xl relative overflow-hidden">
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
            <p className="text-[#cbad90] text-base mb-8 leading-relaxed">
              En tant que <span className="text-white font-semibold">propriétaire</span>,
              vous ne pouvez pas effectuer de réservation sur la plateforme.
              Cette fonctionnalité est réservée aux clients.
            </p>

            <button
              onClick={onClose}
              className="w-full bg-[#342618] text-white font-bold py-3.5 rounded-xl hover:bg-[#3d2d1d] border border-[#493622] transition-all"
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
        <div className="bg-[#2e2318] rounded-2xl max-w-md w-full border border-[#493622] shadow-2xl relative overflow-hidden">
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
            <p className="text-[#cbad90] text-sm sm:text-base mb-6 sm:mb-8 leading-relaxed">
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
                className="flex items-center justify-center gap-2 w-full bg-transparent border-2 border-[#493622] text-white font-bold py-3 sm:py-3.5 rounded-xl hover:bg-[#342618] hover:border-primary/30 transition-all text-sm sm:text-base"
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
      <div className="bg-[#2e2318] rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col border border-[#493622] shadow-2xl">
        {/* 3. HEADER : Reste FIXE (flex-none) */}
        <div className="flex-none bg-[#2e2318] border-b border-[#493622] p-4 sm:p-6 flex justify-between items-center rounded-t-2xl z-10">
          <div>
            <h2 className="text-white text-xl sm:text-2xl font-bold truncate max-w-[200px] sm:max-w-none">
              {stadium.city}
            </h2>
            <div className="text-[#cbad90] text-xs sm:text-sm flex items-center mt-1">
              <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 flex-shrink-0" />
              <span className="truncate">{stadium.location}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-primary transition-colors bg-[#342618] sm:bg-transparent p-2 rounded-full sm:p-0"
            aria-label="Fermer"
          >
            <X className="w-5 h-5 sm:w-8 sm:h-8" />
          </button>
        </div>

        {/* 4. CONTENU : DÉFILE (flex-1 overflow-y-auto) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {fieldStatus === 'Indisponible' ? (
            <div className="flex flex-col items-center justify-center h-full py-12 text-center">
              <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
                <Lock className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-white text-xl font-bold mb-2">Terrain Indisponible</h3>
              <p className="text-[#cbad90] max-w-xs mx-auto">
                Ce terrain a été temporairement mis hors ligne par le propriétaire.
                Veuillez réessayer plus tard ou choisir un autre terrain.
              </p>
              <button
                onClick={onClose}
                className="mt-8 px-8 py-3 bg-[#342618] text-white rounded-xl border border-[#493622] hover:bg-[#3d2d1d] font-bold transition-all"
              >
                Fermer
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
              {step === 1 ? (
                <>
                  {/* Card détails Terrain */}
                  <div className="bg-[#342618] rounded-xl p-3 sm:p-4 flex flex-row justify-between items-center border border-[#493622]/50 gap-2">
                    <div className="space-y-1.5 sm:space-y-2">
                      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                        <span className="text-[#cbad90] text-[10px] sm:text-sm font-medium bg-[#2e2318] px-2 py-1 rounded whitespace-nowrap">
                          {stadium.totalPlayers}
                        </span>
                        <span className="hidden sm:inline text-gray-500">•</span>
                        <span className="text-[#cbad90] text-[10px] sm:text-sm font-medium bg-[#2e2318] px-2 py-1 rounded whitespace-nowrap">
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
                        className="w-full px-3 py-2.5 sm:px-4 sm:py-3 rounded-lg bg-[#342618] text-white text-sm sm:text-base border border-[#493622] focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-white text-sm sm:text-base font-semibold mb-2">
                        Heure <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="timeSlot"
                        value={formData.timeSlot}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2.5 sm:px-4 sm:py-3 rounded-lg bg-[#342618] text-white text-sm sm:text-base border border-[#493622] focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all appearance-none"
                      >
                        <option value="" className="bg-[#2e2318]">
                          --:--
                        </option>
                        {availableSlots.map((slot) => (
                          <option key={slot} value={slot} className="bg-[#2e2318]">
                            {slot}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Durée */}
                  <div>
                    <label className="block text-white text-sm sm:text-base font-semibold mb-2">
                      Durée <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-4 gap-2 sm:gap-3">
                      {durations.map((dur) => (
                        <button
                          key={dur.value}
                          type="button"
                          onClick={() =>
                            setFormData((prev) => ({ ...prev, duration: dur.value }))
                          }
                          className={`py-2 sm:py-3 px-1 sm:px-4 rounded-lg font-semibold text-xs sm:text-base transition-all border ${formData.duration === dur.value
                            ? "bg-primary text-black border-primary"
                            : "bg-[#342618] text-white border-[#493622] hover:border-primary/50"
                            }`}
                        >
                          {dur.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Infos Perso */}
                  <div className="space-y-4 pt-2">
                    <h3 className="text-white font-bold text-base sm:text-lg border-b border-[#493622] pb-2">
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
                          className="w-full px-3 py-2.5 sm:px-4 sm:py-3 rounded-lg bg-[#342618] text-white text-sm sm:text-base border border-[#493622] focus:border-primary focus:outline-none placeholder-gray-500"
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
                          className="w-full px-3 py-2.5 sm:px-4 sm:py-3 rounded-lg bg-[#342618] text-white text-sm sm:text-base border border-[#493622] focus:border-primary focus:outline-none placeholder-gray-500"
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
                        className="w-full px-3 py-2.5 sm:px-4 sm:py-3 rounded-lg bg-[#342618] text-white text-sm sm:text-base border border-[#493622] focus:border-primary focus:outline-none placeholder-gray-500"
                      />
                    </div>
                  </div>
                </>
              ) : step === 2 ? (
                <div className="space-y-6 py-4 animate-in slide-in-from-right-4 duration-300">
                  <div className="text-center">
                    <h3 className="text-white text-xl font-bold mb-2">Dernière étape : Paiement</h3>
                    <p className="text-[#cbad90] text-sm">Choisissez votre mode de paiement préféré</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, paymentMethod: "Wave" }))}
                      className={`p-4 rounded-2xl flex flex-col items-center gap-3 transition-all border-2 ${formData.paymentMethod === "Wave"
                        ? "bg-[#1e40af]/20 border-[#3b82f6] shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                        : "bg-[#342618] border-[#493622] hover:border-[#3b82f6]/50"
                        }`}
                    >
                      <div className="w-12 h-12 bg-[#3b82f6] rounded-full flex items-center justify-center">
                        <span className="text-white font-black text-xl italic">W</span>
                      </div>
                      <span className="text-white font-bold">Wave</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, paymentMethod: "Orange Money" }))}
                      className={`p-4 rounded-2xl flex flex-col items-center gap-3 transition-all border-2 ${formData.paymentMethod === "Orange Money"
                        ? "bg-[#ea580c]/20 border-[#f97316] shadow-[0_0_15px_rgba(249,115,22,0.3)]"
                        : "bg-[#342618] border-[#493622] hover:border-[#f97316]/50"
                        }`}
                    >
                      <div className="w-12 h-12 bg-[#f97316] rounded-full flex items-center justify-center">
                        <span className="text-white font-black text-xl italic">O</span>
                      </div>
                      <span className="text-white font-bold">Orange Money</span>
                    </button>
                  </div>

                  <div className="bg-[#231a10] border border-primary/20 rounded-2xl p-6 space-y-4">
                    <div className="flex flex-col items-center text-center gap-2">
                      <p className="text-[#cbad90] text-sm font-medium">Envoyez exactement</p>
                      <p className="text-primary text-3xl font-black">{(calculateTotal() || 0).toLocaleString()} CFA</p>
                    </div>

                    <div className="h-px bg-[#493622] w-full"></div>

                    <div className="flex flex-col gap-2">
                      <p className="text-white/60 text-xs text-center uppercase tracking-widest font-bold">Numéro de transfert</p>
                      <div className="bg-[#342618] rounded-xl p-4 flex items-center justify-center gap-3 border border-[#493622]">
                        <span className="text-white text-2xl font-black tracking-wider">
                          {ownerProfile?.phone || "Non renseigné"}
                        </span>
                      </div>
                      <p className="text-[#cbad90] text-[10px] text-center italic mt-1">
                        Destinataire : <span className="text-white not-italic font-bold">{ownerProfile?.name || "Propriétaire"}</span>
                      </p>
                    </div>

                    <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex items-start gap-3">
                      <div className="size-5 rounded-full bg-primary flex items-center justify-center shrink-0 mt-0.5">
                        <X className="size-3 text-black rotate-45" />
                      </div>
                      <p className="text-[#cbad90] text-xs leading-relaxed">
                        Une fois le transfert effectué, cliquez sur <strong>"Confirmer la réservation"</strong>. Le propriétaire validera votre créneau dès réception.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center animate-in zoom-in-95 duration-300">
                  <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 className="w-12 h-12 text-green-500" />
                  </div>
                  <h3 className="text-white text-2xl font-bold mb-2">Demande de réservation envoyée !</h3>
                  <p className="text-[#cbad90] max-w-sm mx-auto mb-8">
                    Votre demande pour <span className="text-white font-bold">{stadium.city}</span> a bien été enregistrée avec le statut <span className="text-primary font-bold">En attente de paiement</span>.
                    <br /><br />
                    Dès que le propriétaire confirmera la réception de votre transfert <span className="text-white font-bold">{formData.paymentMethod}</span>, votre ticket sera mis à jour.
                  </p>

                  <div className="flex flex-col gap-3 w-full max-w-md">
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        setStep(1);
                        navigate("/profile");
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
                      className="text-[#cbad90] text-sm font-bold py-2 hover:text-white transition-all underline"
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
                <div className="border-t border-[#493622] pt-4 sm:pt-6 space-y-4 pb-2">
                  {step === 1 && (
                    <div className="flex justify-between items-center">
                      <span className="text-white text-base sm:text-lg">Total</span>
                      <span className="text-primary text-2xl sm:text-3xl font-bold">
                        {(calculateTotal() || 0).toLocaleString()} F
                      </span>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={step === 1 ? onClose : () => setStep(1)}
                      className="flex-1 py-3 sm:py-3.5 px-4 rounded-xl border border-[#493622] text-white text-sm sm:text-base font-bold hover:bg-[#342618] transition-colors"
                    >
                      {step === 1 ? "Annuler" : "Retour"}
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 py-3 sm:py-3.5 px-4 rounded-xl bg-primary text-black text-sm sm:text-base font-bold hover:bg-primary/90 disabled:opacity-50 transition-colors shadow-lg shadow-primary/20 whitespace-nowrap"
                    >
                      {isSubmitting ? "En cours..." : (step === 1 ? "Suivant : Paiement" : "Confirmer la réservation")}
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
