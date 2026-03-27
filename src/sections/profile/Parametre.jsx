import { useAuth } from "../../context/AuthContext";
import {
  User as UserIcon,
  Lock,
  ChevronRight,
  LogOut,
  Bell,
} from "lucide-react";
import { supabase } from "../../services/supabaseClient";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const Parametre = () => {
  const { user, profile } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    ville: "",
  });
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // New states for password change
  const [showPasswordChangeForm, setShowPasswordChangeForm] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [passwordErrors, setPasswordErrors] = useState({});
  const [isPasswordUpdating, setIsPasswordUpdating] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Effacer l'erreur du champ en cours de modification
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handlePasswordChangeSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = {};

    if (!newPassword) {
      validationErrors.newPassword = "Le nouveau mot de passe est requis.";
    } else if (newPassword.length < 6) {
      validationErrors.newPassword =
        "Le mot de passe doit contenir au moins 6 caractères.";
    }

    if (!confirmNewPassword) {
      validationErrors.confirmNewPassword =
        "La confirmation du mot de passe est requise.";
    } else if (newPassword !== confirmNewPassword) {
      validationErrors.confirmNewPassword =
        "Les mots de passe ne correspondent pas.";
    }

    setPasswordErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setIsPasswordUpdating(true);
    try {
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;
      toast.success("Mot de passe mis à jour avec succès !");
      setNewPassword("");
      setConfirmNewPassword("");
      setShowPasswordChangeForm(false);
    } catch (err) {
      console.error("Error updating password:", err);
      toast.error(
        err.message || "Erreur lors de la mise à jour du mot de passe.",
      );
    } finally {
      setIsPasswordUpdating(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = {};

    if (formData.name == "") {
      validationErrors.name = "Le champ nom est requis !";
    }

    if (formData.email == "") {
      validationErrors.email = "Le champ email est requis !";
    }

    if (formData.ville == "") {
      validationErrors.ville = "Le champ ville est requis !";
    }

    const phoneRegex = /^(221|00221|\+221)?(77|78|75|70|76)[0-9]{7}$/;
    if (formData.phone == "") {
      validationErrors.phone = "Le téléphone est requis";
    } else if (!phoneRegex.test(formData.phone)) {
      validationErrors.phone = "Format numéro invalide";
    }

    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    try {
      setIsLoading(true);

      const { error } = await supabase
        .from("profiles")
        .update({
          name: formData.name,
          phone: formData.phone,
          ville: formData.ville,
        })
        .eq("id", user.id)
        .select();

      if (error) throw error;

      if (formData.email !== user.email) {
        const { error: authError } = await supabase.auth.updateUser({
          email: formData.email,
        });

        if (authError) throw authError;
      }

      toast.success("Profil modifiée !");
    } catch (err) {
      console.error(err);
      toast.error(err || "Erreur serveur !");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (profile && user) {
      setFormData({
        name: profile?.name || "",
        email: user?.email || "",
        phone: profile?.phone || "",
        ville: profile?.ville || "",
      });
    }
  }, [profile, user]);

  // Fonction utilitaire pour formater la date de modification
  const formatLastModified = (dateString) => {
    if (!dateString) return "Date inconnue";
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "aujourd'hui";
    if (diffDays < 30) return `il y a ${diffDays} jours`;
    const diffMonths = Math.floor(diffDays / 30);
    return `il y a ${diffMonths} mois`;
  };

  const inputClasses =
    "w-full min-w-0 bg-background-dark border border-surface-highlight rounded-xl px-4 py-3 text-base md:text-sm text-white placeholder:text-text-secondary/70 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors";

  return (
    <>
      <div
        className="flex flex-col gap-6 pt-6 border-t border-surface-highlight"
        id="parametres"
      >
        <h2 className="text-white text-2xl font-bold leading-tight">
          Mes Informations
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 md:gap-8">
          {/* Personal Info Form */}
          <div className="lg:col-span-2 bg-surface-dark p-4 sm:p-6 rounded-2xl border border-surface-highlight">
            <h3 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
              <UserIcon className="w-5 h-5 text-primary" />
              Informations Personnelles
            </h3>
            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6"
            >
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-text-secondary">
                  Nom complet
                </label>
                <input
                  className={`${inputClasses} ${errors.name ? "border-red-500" : "border-surface-highlight"}`}
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                />
                {errors.name && (
                  <span className="text-red-500 text-xs">{errors.name}</span>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-text-secondary">
                  Email
                </label>
                <input
                  className={`${inputClasses} ${errors.email ? "border-red-500" : "border-surface-highlight"}`}
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
                {errors.email && (
                  <span className="text-red-500 text-xs">{errors.email}</span>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-text-secondary">
                  Téléphone
                </label>
                <input
                  className={`${inputClasses} ${errors.phone ? "border-red-500" : "border-surface-highlight"}`}
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
                {errors.phone && (
                  <span className="text-red-500 text-xs">{errors.phone}</span>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-text-secondary">
                  Ville
                </label>
                <input
                  className={`${inputClasses} ${errors.ville ? "border-red-500" : "border-surface-highlight"}`}
                  type="text"
                  name="ville"
                  value={formData.ville}
                  onChange={handleInputChange}
                />
                {errors.ville && (
                  <span className="text-red-500 text-xs">{errors.ville}</span>
                )}
              </div>
              <div className="mt-2 md:mt-6 md:col-span-2 flex justify-stretch md:justify-end">
                <button
                  type="submit"
                  className="w-full md:w-auto bg-surface-highlight hover:bg-primary hover:text-background-dark text-white font-bold py-3 px-6 rounded-full transition-colors shadow-lg"
                >
                  {isLoading ? "Modification..." : "Modifier mon profil"}
                </button>
              </div>
            </form>
          </div>
          {/* Side Settings (Password & Notifications) */}
          <div className="flex flex-col gap-6">
            {/* Security */}
            <div className="bg-surface-dark p-4 sm:p-6 rounded-2xl border border-surface-highlight">
              <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                <Lock className="w-5 h-5 text-primary" />
                Sécurité
              </h3>
              <button
                onClick={() =>
                  setShowPasswordChangeForm(!showPasswordChangeForm)
                }
                className="w-full flex items-center justify-between p-3 rounded-xl bg-background-dark hover:bg-surface-highlight/50 transition-colors border border-surface-highlight group mb-2"
              >
                <div className="text-left">
                  <p className="text-white text-sm font-medium">Mot de passe</p>
                  <p className="text-text-secondary text-xs">
                    Dernière modif. {formatLastModified(user?.updated_at)}
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-text-secondary group-hover:text-white" />
              </button>

              {showPasswordChangeForm && (
                <form
                  onSubmit={handlePasswordChangeSubmit}
                  className="mt-4 space-y-3 animate-in fade-in slide-in-from-top-2 duration-300"
                >
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-text-secondary">
                      Nouveau mot de passe
                    </label>
                    <input
                      type="password"
                      className={`${inputClasses} ${passwordErrors.newPassword ? "border-red-500" : "border-surface-highlight"}`}
                      value={newPassword}
                      onChange={(e) => {
                        setNewPassword(e.target.value);
                        setPasswordErrors((prev) => ({
                          ...prev,
                          newPassword: "",
                        }));
                      }}
                    />
                    {passwordErrors.newPassword && (
                      <span className="text-red-500 text-xs">
                        {passwordErrors.newPassword}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-text-secondary">
                      Confirmer le mot de passe
                    </label>
                    <input
                      type="password"
                      className={`${inputClasses} ${passwordErrors.confirmNewPassword ? "border-red-500" : "border-surface-highlight"}`}
                      value={confirmNewPassword}
                      onChange={(e) => {
                        setConfirmNewPassword(e.target.value);
                        setPasswordErrors((prev) => ({
                          ...prev,
                          confirmNewPassword: "",
                        }));
                      }}
                    />
                    {passwordErrors.confirmNewPassword && (
                      <span className="text-red-500 text-xs">
                        {passwordErrors.confirmNewPassword}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowPasswordChangeForm(false)}
                      className="flex-1 py-2 px-4 rounded-full border border-surface-highlight text-text-secondary hover:bg-surface-highlight/50 transition-colors text-sm font-medium"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      disabled={isPasswordUpdating}
                      className="flex-1 py-4 px-4 rounded-full bg-primary text-background-dark font-bold hover:bg-primary/90 transition-colors text-sm disabled:opacity-50"
                    >
                      {isPasswordUpdating ? "Mise à jour..." : "Valider"}
                    </button>
                  </div>
                </form>
              )}

              <button
                onClick={handleLogout}
                className="w-full text-red-400 hover:text-red-300 text-sm font-medium py-2 text-left mt-2 flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Se déconnecter
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Parametre;
