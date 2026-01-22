import React, { useState } from "react";

export default function ReservationModal({ isOpen, onClose, stadium }) {
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

  // Créneaux horaires disponibles
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

  // Durées disponibles
  const durations = [
    { value: "1", label: "1 heure" },
    { value: "1.5", label: "1h30" },
    { value: "2", label: "2 heures" },
    { value: "3", label: "3 heures" },
  ];

  // Gérer les changements dans le formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Calculer le prix total
  const calculateTotal = () => {
    if (!stadium) return 0;
    return stadium.price * parseFloat(formData.duration);
  };

  // Soumettre la réservation
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Validation basique
      if (
        !formData.date ||
        !formData.timeSlot ||
        !formData.playerName ||
        !formData.phone
      ) {
        throw new Error("Veuillez remplir tous les champs obligatoires");
      }

      // Simuler un appel API
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Ici, vous feriez un vrai appel API
      // const response = await fetch('/api/reservations', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     stadiumId: stadium.id,
      //     ...formData,
      //     totalPrice: calculateTotal()
      //   })
      // });

      console.log("Réservation confirmée:", {
        stadium: stadium.city,
        ...formData,
        total: calculateTotal(),
      });

      alert(
        `Réservation confirmée pour ${stadium.city} !\nTotal: ${calculateTotal()} FCFA`,
      );
      onClose();

      // Réinitialiser le formulaire
      setFormData({
        date: "",
        timeSlot: "",
        duration: "1",
        playerName: "",
        phone: "",
        email: "",
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Ne rien afficher si le modal est fermé
  if (!isOpen || !stadium) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-[#2e2318] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-[#493622]">
        {/* Header */}
        <div className="sticky top-0 bg-[#2e2318] border-b border-[#493622] p-6 flex justify-between items-center">
          <div>
            <h2 className="text-white text-2xl font-bold">{stadium.city}</h2>
            <p className="text-[#cbad90] text-sm flex items-center mt-1">
              <span className="material-symbols-outlined text-sm mr-1">
                explore_nearby
              </span>
              {stadium.location}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-primary transition-colors"
            aria-label="Fermer"
          >
            <span className="material-symbols-outlined text-3xl">close</span>
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Informations du terrain */}
          <div className="bg-[#342618] rounded-xl p-4 flex justify-between items-center">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-[#cbad90] text-sm">
                  {stadium.totalPlayers}
                </span>
                <span className="text-gray-500">•</span>
                <span className="text-[#cbad90] text-sm">
                  {stadium.fieldStadium}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <span className="material-symbols-outlined text-primary text-sm">
                  star
                </span>
                <span className="text-white font-semibold">
                  {stadium.notes}
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-primary text-2xl font-bold">
                {stadium.price} FCFA
              </p>
              <p className="text-gray-400 text-sm">par heure</p>
            </div>
          </div>

          {/* Date et heure */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-white font-semibold mb-2">
                Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                min={new Date().toISOString().split("T")}
                required
                className="w-full px-4 py-3 rounded-lg bg-[#342618] text-white border border-[#493622] focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-white font-semibold mb-2">
                Créneau horaire <span className="text-red-500">*</span>
              </label>
              <select
                name="timeSlot"
                value={formData.timeSlot}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg bg-[#342618] text-white border border-[#493622] focus:border-primary focus:outline-none"
              >
                <option value="">Sélectionner</option>
                {timeSlots.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Durée */}
          <div>
            <label className="block text-white font-semibold mb-2">
              Durée <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {durations.map((dur) => (
                <button
                  key={dur.value}
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, duration: dur.value }))
                  }
                  className={`py-3 px-4 rounded-lg font-semibold transition-all ${
                    formData.duration === dur.value
                      ? "bg-primary text-black"
                      : "bg-[#342618] text-white hover:bg-[#493622]"
                  }`}
                >
                  {dur.label}
                </button>
              ))}
            </div>
          </div>

          {/* Informations personnelles */}
          <div className="space-y-4">
            <h3 className="text-white font-bold text-lg">Vos informations</h3>

            <div>
              <label className="block text-white font-semibold mb-2">
                Nom complet <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="playerName"
                value={formData.playerName}
                onChange={handleChange}
                placeholder="Ex: Moussa Diop"
                required
                className="w-full px-4 py-3 rounded-lg bg-[#342618] text-white border border-[#493622] focus:border-primary focus:outline-none placeholder-gray-500"
              />
            </div>

            <div>
              <label className="block text-white font-semibold mb-2">
                Téléphone <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Ex: +221 77 123 45 67"
                required
                className="w-full px-4 py-3 rounded-lg bg-[#342618] text-white border border-[#493622] focus:border-primary focus:outline-none placeholder-gray-500"
              />
            </div>

            <div>
              <label className="block text-white font-semibold mb-2">
                Email (optionnel)
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Ex: moussa@example.com"
                className="w-full px-4 py-3 rounded-lg bg-[#342618] text-white border border-[#493622] focus:border-primary focus:outline-none placeholder-gray-500"
              />
            </div>
          </div>

          {/* Erreur */}
          {error && (
            <div className="bg-red-500/10 border border-red-500 rounded-lg p-4">
              <p className="text-red-500 text-sm">{error}</p>
            </div>
          )}

          {/* Total et boutons */}
          <div className="border-t border-[#493622] pt-6 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-white text-lg">Total à payer</span>
              <span className="text-primary text-3xl font-bold">
                {calculateTotal().toLocaleString()} FCFA
              </span>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 px-6 rounded-lg border border-white/30 text-white font-bold hover:bg-white/10 transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-3 px-6 rounded-lg bg-primary text-black font-bold hover:bg-primary/90 disabled:opacity-50 transition-colors"
              >
                {isSubmitting ? "Confirmation..." : "Confirmer la réservation"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
