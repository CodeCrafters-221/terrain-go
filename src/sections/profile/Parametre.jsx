import { useAuth } from "../../context/AuthContext";
import {
  User as UserIcon,
  Lock,
  ChevronRight,
  LogOut,
  Bell,
} from "lucide-react";

const Parametre = () => {
  const { user } = useAuth();
  return (
    <>
      <div
        className="flex flex-col gap-6 pt-6 border-t border-surface-highlight"
        id="parametres"
      >
        <h2 className="text-white text-2xl font-bold leading-tight">
          Paramètres du compte
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Personal Info Form */}
          <div className="lg:col-span-2 bg-surface-dark p-6 rounded-2xl border border-surface-highlight">
            <h3 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
              <UserIcon className="w-5 h-5 text-primary" />
              Informations Personnelles
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-text-secondary">
                  Nom complet
                </label>
                <input
                  className="bg-background-dark border border-surface-highlight rounded-xl px-4 py-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
                  type="text"
                  defaultValue="Saturo Gojo"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-text-secondary">
                  Email
                </label>
                <input
                  className="bg-background-dark border border-surface-highlight rounded-xl px-4 py-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
                  type="email"
                  defaultValue={user.email}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-text-secondary">
                  Téléphone
                </label>
                <input
                  className="bg-background-dark border border-surface-highlight rounded-xl px-4 py-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
                  type="tel"
                  defaultValue="+221 77 123 45 67"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-text-secondary">
                  Ville
                </label>
                <input
                  className="bg-background-dark border border-surface-highlight rounded-xl px-4 py-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
                  type="text"
                  defaultValue="Dakar"
                />
              </div>
            </div>
            <div className="mt-8 flex justify-end">
              <button className="bg-surface-highlight hover:bg-primary hover:text-background-dark text-white font-bold py-2.5 px-6 rounded-full transition-colors shadow-lg">
                Enregistrer les modifications
              </button>
            </div>
          </div>
          {/* Side Settings (Password & Notifications) */}
          <div className="flex flex-col gap-6">
            {/* Security */}
            <div className="bg-surface-dark p-6 rounded-2xl border border-surface-highlight">
              <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                <Lock className="w-5 h-5 text-primary" />
                Sécurité
              </h3>
              <button className="w-full flex items-center justify-between p-3 rounded-xl bg-background-dark hover:bg-surface-highlight/50 transition-colors border border-surface-highlight group mb-2">
                <div className="text-left">
                  <p className="text-white text-sm font-medium">Mot de passe</p>
                  <p className="text-text-secondary text-xs">
                    Dernière modif. il y a 3 mois
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-text-secondary group-hover:text-white" />
              </button>
              <button className="w-full text-red-400 hover:text-red-300 text-sm font-medium py-2 text-left mt-2 flex items-center gap-2">
                <LogOut className="w-4 h-4" />
                Se déconnecter
              </button>
            </div>
            {/* Notifications */}
            <div className="bg-surface-dark p-6 rounded-2xl border border-surface-highlight flex-1">
              <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                <Bell className="w-5 h-5 text-primary" />
                Notifications
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-text-secondary text-sm">
                    Rappels SMS
                  </span>
                  <button className="w-11 h-6 bg-primary rounded-full relative transition-colors focus:outline-none ring-2 ring-offset-2 ring-offset-background-dark ring-primary">
                    <span className="absolute right-1 top-1 bg-white w-4 h-4 rounded-full transition-transform"></span>
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text-secondary text-sm">
                    Emails Promo
                  </span>
                  <button className="w-11 h-6 bg-surface-highlight rounded-full relative transition-colors focus:outline-none ring-2 ring-offset-2 ring-offset-background-dark ring-transparent">
                    <span className="absolute left-1 top-1 bg-gray-400 w-4 h-4 rounded-full transition-transform"></span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Parametre;
