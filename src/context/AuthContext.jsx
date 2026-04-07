import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import { supabase } from "../services/supabaseClient";

const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [terrains, setTerrains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(true);

  // Initialisation de la session utilisateur
  useEffect(() => {
    let isActive = true;

    const initSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Erreur session:", error.message);
      }
      if (isActive) {
        setUser(data?.session?.user ?? null);
        setLoading(false);
      }
    };

    initSession();

    // Écoute les changements d'authentification
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (isActive) setUser(session?.user ?? null);
    });

    return () => {
      isActive = false;
      subscription.unsubscribe();
    };
  }, []);

  // Récupère le profil utilisateur
  const refreshProfile = useCallback(async () => {
    if (!user) {
      setProfile(null);
      setProfileLoading(false);
      return;
    }
    setProfileLoading(true);
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();

    if (error) {
      console.error("Erreur Profil:", error.message);
      setProfile(null);
    } else {
      setProfile(data);
    }
    setProfileLoading(false);
  }, [user]);

  useEffect(() => {
    refreshProfile();
  }, [refreshProfile]);

  // Récupère les terrains si l'utilisateur est propriétaire
  useEffect(() => {
    let isActive = true;

    const fetchTerrains = async () => {
      if (!profile || profile.role !== "owner") {
        if (isActive) setTerrains([]);
        return;
      }
      const { data, error } = await supabase
        .from("fields")
        .select("id, name, adress, price_per_hour, pelouse, proprietaire_id")
        .eq("proprietaire_id", profile.id);

      if (error) {
        console.error("Erreur récupération terrain:", error.message);
        if (isActive) setTerrains([]);
      } else {
        if (isActive) setTerrains(data);
      }
    };

    fetchTerrains();
    return () => {
      isActive = false;
    };
  }, [profile]);

  // Memoize la valeur du contexte pour éviter des rerenders inutiles
  const contextValue = useMemo(
    () => ({
      user,
      loading,
      profile,
      profileLoading,
      terrains,
      refreshProfile,
    }),
    [user, loading, profile, profileLoading, terrains, refreshProfile],
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

// Hook personnalisé pour utiliser le contexte
export const useAuth = () => useContext(AuthContext);
