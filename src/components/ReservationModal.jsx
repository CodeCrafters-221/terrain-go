import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, X, Star, Lock, LogIn, UserPlus } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../services/supabaseClient";
import { toast } from "react-toastify";

export default function ReservationModal({ isOpen, onClose, stadium }) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    date: "",
    timeSlot: "",
    duration: "1",
    playerName: "",
    phone: "",
    email: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

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

  const timeSlots = [
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
    "19:00",
    "20:00",
    "21:00",
    "22:00",
  ];

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // 1. Validation basique
      if (
        !formData.date ||
        !formData.timeSlot ||
        !formData.playerName ||
        !formData.phone
      ) {
        throw new Error("Veuillez remplir les champs obligatoires (*)");
      }

      // 2. Gestion terrain démo (Ton code existant)
      if (stadium.id.toString().startsWith("default-")) {
        throw new Error(
          "Ce terrain est une démo. Veuillez choisir un vrai terrain.",
        );
      }

      // 3. APPEL SÉCURISÉ VIA RPC (C'est l'amélioration majeure)
      // Au lieu de faire un insert direct, on appelle la fonction SQL qui vérifie les conflits
      console.log("Envoi réservation via RPC...");

      const { data, error: rpcError } = await supabase.rpc(
        "create_reservation",
        {
          p_field_id: parseInt(stadium.id), // On s'assure que c'est bien un entier pour le BIGINT
          p_user_id: user.id,
          p_date: formData.date,
          p_start_time: formData.timeSlot,
          p_duration_hours: parseFloat(formData.duration),
          p_total_price: calculateTotal(),
        },
      );

      if (rpcError) {
        console.error("Erreur RPC:", rpcError);
        throw rpcError;
      }

      // 4. Gestion de la réponse logique de la base de données
      // La fonction RPC renvoie un JSON { success: true/false, message: "..." }
      if (data && !data.success) {
        throw new Error(data.message || "Ce créneau n'est plus disponible.");
      }

      console.log("Réservation réussie :", data);
      toast.success("Réservation confirmée avec succès !");

      onClose();
      // Reset partiel
      setFormData((prev) => ({ ...prev, date: "", timeSlot: "" }));
    } catch (err) {
      console.error("Erreur réservation:", err);
      // Gestion d'erreur améliorée
      if (err.message?.includes("invalid input syntax")) {
        setError("Erreur technique (ID invalide). Contactez le support.");
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

  // --- CAS PROPRIÉTAIRE ---
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
              Les{" "}
              <span className="text-white font-semibold">propriétaires</span> ne
              peuvent pas effectuer de réservation.
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

  // --- CAS NON CONNECTÉ ---
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
              Pour réserver{" "}
              <span className="text-white font-semibold">{stadium.city}</span>,
              veuillez vous identifier.
            </p>
            <div className="flex flex-col gap-3 w-full">
              <button
                onClick={() => navigate("/login")}
                className="flex items-center justify-center gap-2 w-full bg-primary text-black font-bold py-3 sm:py-3.5 rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 text-sm sm:text-base"
              >
                <LogIn className="w-5 h-5" /> Se connecter
              </button>
              <button
                onClick={() => navigate("/register")}
                className="flex items-center justify-center gap-2 w-full bg-transparent border-2 border-[#493622] text-white font-bold py-3 sm:py-3.5 rounded-xl hover:bg-[#342618] hover:border-primary/30 transition-all text-sm sm:text-base"
              >
                <UserPlus className="w-5 h-5" /> Créer un compte
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- FORMULAIRE DE RÉSERVATION ---
  return (
    <div className="fixed inset-0 z-50 flex top-15 items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#2e2318] rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col border border-[#493622] shadow-2xl">
        {/* Header Fixe */}
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
          >
            <X className="w-5 h-5 sm:w-8 sm:h-8" />
          </button>
        </div>

        {/* Contenu Scrollable */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
            {/* Info Terrain */}
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
              <div className="text-right flex flex-col sm:flex-row sm:items-baseline gap-1">
                <p className="text-primary text-lg sm:text-2xl font-bold">
                  {(stadium.price || 0).toLocaleString()} F
                </p>
                <p className="text-gray-400 text-[10px] sm:text-sm">/h</p>
              </div>
            </div>

            {/* Inputs Date & Heure */}
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
                  {timeSlots.map((slot) => (
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
                    className={`py-2 sm:py-3 px-1 sm:px-4 rounded-lg font-semibold text-xs sm:text-base transition-all border ${
                      formData.duration === dur.value
                        ? "bg-primary text-black border-primary"
                        : "bg-[#342618] text-white border-[#493622] hover:border-primary/50"
                    }`}
                  >
                    {dur.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Infos Utilisateur */}
            <div className="space-y-4 pt-2">
              <h3 className="text-white font-bold text-base sm:text-lg border-b border-[#493622] pb-2">
                Vos informations
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white text-sm font-semibold mb-1.5">
                    Nom complet
                  </label>
                  <input
                    type="text"
                    name="playerName"
                    value={formData.playerName}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2.5 sm:px-4 sm:py-3 rounded-lg bg-[#342618] text-white text-sm sm:text-base border border-[#493622] focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-white text-sm font-semibold mb-1.5">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2.5 sm:px-4 sm:py-3 rounded-lg bg-[#342618] text-white text-sm sm:text-base border border-[#493622] focus:border-primary focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Erreur */}
            {error && (
              <div className="bg-red-500/10 border border-red-500 rounded-lg p-3 sm:p-4">
                <p className="text-red-500 text-xs sm:text-sm text-center">
                  {error}
                </p>
              </div>
            )}

            {/* Footer Total & Actions */}
            <div className="border-t border-[#493622] pt-4 sm:pt-6 space-y-4 pb-2">
              <div className="flex justify-between items-center">
                <span className="text-white text-base sm:text-lg">Total</span>
                <span className="text-primary text-2xl sm:text-3xl font-bold">
                  {calculateTotal().toLocaleString()} F
                </span>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3 sm:py-3.5 px-4 rounded-xl border border-[#493622] text-white text-sm sm:text-base font-bold hover:bg-[#342618] transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3 sm:py-3.5 px-4 rounded-xl bg-primary text-black text-sm sm:text-base font-bold hover:bg-primary/90 disabled:opacity-50 transition-colors shadow-lg shadow-primary/20 whitespace-nowrap"
                >
                  {isSubmitting ? "En cours..." : "Confirmer"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
