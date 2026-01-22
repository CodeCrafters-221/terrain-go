import React, { useState, useEffect } from "react";

export default function SignupModal({ isOpen, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    userType: "player",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Réinitialiser le formulaire quand la modale s'ouvre/se ferme
  useEffect(() => {
    if (!isOpen) {
      setErrors({});
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        userType: "player",
      });
    }
  }, [isOpen]);

  // Gestion de la touche Échap pour fermer
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Effacer l'erreur du champ en cours de modification
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  // Fermer si on clique sur le fond (backdrop)
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = {};

    if (!formData.firstName.trim())
      validationErrors.firstName = "Le prénom est requis";
    if (!formData.lastName.trim())
      validationErrors.lastName = "Le nom est requis";

    // Validation email simple
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      validationErrors.email = "L'email est requis";
    } else if (!emailRegex.test(formData.email)) {
      validationErrors.email = "Format d'email invalide";
    }

    if (!formData.password)
      validationErrors.password = "Le mot de passe est requis";
    if (formData.password.length < 6 && formData.password)
      validationErrors.password = "6 caractères minimum";

    if (formData.password !== formData.confirmPassword) {
      validationErrors.confirmPassword =
        "Les mots de passe ne correspondent pas";
    }

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setIsLoading(true);

    try {
      // Simuler un appel API
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log("Données d'inscription:", formData);
      onSuccess();
      onClose(); // Fermer la modale après succès
    } catch (error) {
      console.error("Erreur d'inscription:", error);
      alert("Inscription échouée. Veuillez réessayer plus tard.");
    } finally {
      setIsLoading(false);
    }
  };

  // Classes communes pour les inputs pour garder le code propre
  const inputClasses = `w-full px-4 py-3 rounded-lg border bg-transparent text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div className="bg-[#2e2318] rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto relative shadow-2xl border border-[#493622]">
        {/* Bouton fermer (X) */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#cbad90] hover:text-white transition-colors"
          aria-label="Fermer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div className="p-6 sm:p-8">
          <h2 className="text-white text-2xl font-semibold text-center mb-6">
            Créer un compte
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Prénom */}
            <div className="flex flex-col gap-1">
              <label htmlFor="firstName" className="text-[#cbad90] text-sm">
                Prénom
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className={`${inputClasses} ${errors.firstName ? "border-red-500" : "border-[#493622]"}`}
              />
              {errors.firstName && (
                <span className="text-red-500 text-xs">{errors.firstName}</span>
              )}
            </div>

            {/* Nom */}
            <div className="flex flex-col gap-1">
              <label htmlFor="lastName" className="text-[#cbad90] text-sm">
                Nom
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className={`${inputClasses} ${errors.lastName ? "border-red-500" : "border-[#493622]"}`}
              />
              {errors.lastName && (
                <span className="text-red-500 text-xs">{errors.lastName}</span>
              )}
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1">
              <label htmlFor="email" className="text-[#cbad90] text-sm">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`${inputClasses} ${errors.email ? "border-red-500" : "border-[#493622]"}`}
              />
              {errors.email && (
                <span className="text-red-500 text-xs">{errors.email}</span>
              )}
            </div>

            {/* Téléphone */}
            <div className="flex flex-col gap-1">
              <label htmlFor="phone" className="text-[#cbad90] text-sm">
                Téléphone
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className={`${inputClasses} border-[#493622]`}
              />
            </div>

            {/* Mot de passe */}
            <div className="flex flex-col gap-1">
              <label htmlFor="password" className="text-[#cbad90] text-sm">
                Mot de passe
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`${inputClasses} ${errors.password ? "border-red-500" : "border-[#493622]"}`}
                />
                <button
                  type="button"
                  onClick={handleTogglePassword}
                  className="absolute top-1/2 right-3 transform -translate-y-1/2 text-[#cbad90] text-sm hover:text-white"
                >
                  {showPassword ? "Masquer" : "Afficher"}
                </button>
              </div>
              {errors.password && (
                <span className="text-red-500 text-xs">{errors.password}</span>
              )}
            </div>

            {/* Confirmer mot de passe */}
            <div className="flex flex-col gap-1">
              <label
                htmlFor="confirmPassword"
                className="text-[#cbad90] text-sm"
              >
                Confirmer le mot de passe
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={`${inputClasses} ${errors.confirmPassword ? "border-red-500" : "border-[#493622]"}`}
              />
              {errors.confirmPassword && (
                <span className="text-red-500 text-xs">
                  {errors.confirmPassword}
                </span>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-primary text-black font-semibold py-3 rounded-lg hover:bg-primary/90 transition-opacity mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? "Enregistrement..." : "S'inscrire"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
