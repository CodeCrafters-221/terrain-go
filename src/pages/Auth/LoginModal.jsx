import React, { useState, useEffect } from "react";

export default function LoginModal({
  isOpen,
  onClose,
  onSuccess,
  onSwitchToSignup,
}) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Réinitialiser le formulaire à l'ouverture/fermeture
  useEffect(() => {
    if (!isOpen) {
      setErrors({});
      setFormData({ email: "", password: "" });
      setIsLoading(false);
    }
  }, [isOpen]);

  // Gestion de la touche Échap
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Effacer l'erreur du champ quand l'utilisateur tape
    if (errors[name]) setErrors({ ...errors, [name]: "" });
    if (errors.form) setErrors({ ...errors, form: "" });
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.email) newErrors.email = "L'email est requis";
    if (!formData.password) newErrors.password = "Le mot de passe est requis";

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    setIsLoading(true);

    try {
      // Simulation appel API
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // LOGIQUE DE SUCCÈS ICI
      console.log("Connexion réussie:", formData);
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Erreur de connexion:", error);
      setErrors({ form: "Email ou mot de passe incorrect" });
    } finally {
      setIsLoading(false);
    }
  };

  // Styles communs pour garder la cohérence avec SignupModal
  const inputClasses = `w-full px-4 py-3 rounded-lg border bg-transparent text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div className="bg-[#2e2318] rounded-2xl max-w-md w-full relative shadow-2xl border border-[#493622]">
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
            Bon retour !
          </h2>

          {/* Message d'erreur global (ex: mauvais mot de passe) */}
          {errors.form && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm text-center">
              {errors.form}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div className="flex flex-col gap-1">
              <label htmlFor="login-email" className="text-[#cbad90] text-sm">
                Email
              </label>
              <input
                type="email"
                id="login-email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`${inputClasses} ${errors.email ? "border-red-500" : "border-[#493622]"}`}
                placeholder="votre@email.com"
              />
              {errors.email && (
                <span className="text-red-500 text-xs">{errors.email}</span>
              )}
            </div>

            {/* Mot de passe */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-center">
                <label
                  htmlFor="login-password"
                  className="text-[#cbad90] text-sm"
                >
                  Mot de passe
                </label>
                <a
                  href="#"
                  className="text-xs text-primary hover:underline hover:text-white transition-colors"
                >
                  Mot de passe oublié ?
                </a>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="login-password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`${inputClasses} ${errors.password ? "border-red-500" : "border-[#493622]"}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-1/2 right-3 transform -translate-y-1/2 text-[#cbad90] text-sm hover:text-white"
                >
                  {showPassword ? "Masquer" : "Afficher"}
                </button>
              </div>
              {errors.password && (
                <span className="text-red-500 text-xs">{errors.password}</span>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-primary text-black font-semibold py-3 rounded-lg hover:bg-primary/90 transition-all mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? "Connexion en cours..." : "Se connecter"}
            </button>
          </form>

          {/* Lien vers inscription */}
          <div className="mt-6 text-center pt-4 border-t border-[#493622]">
            <p className="text-gray-400 text-sm">
              Pas encore de compte ?{" "}
              <button
                onClick={() => {
                  onClose();
                  if (onSwitchToSignup) onSwitchToSignup();
                }}
                className="text-primary hover:text-white hover:underline font-medium transition-colors ml-1"
              >
                Créer un compte
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
