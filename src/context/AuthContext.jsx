import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";

const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initSession = async () => {
            const { data } = await supabase.auth.getSession();
            setUser(data.session?.user ?? null);
            setLoading(false);
        };

        initSession();

        const { data: { subscription } } =
            supabase.auth.onAuthStateChange((_event, session) => {
                setUser(session?.user ?? null);
            })

        return () => subscription.unsubscribe();
    }, []);

    useEffect(() => {
        const fetchProfiles = async () => {
            if (!user) {
                setProfile(null);
                return;
            }

            const { data, error } = await supabase.from("profiles")
                .select("*")
                .eq("id", user.id)
                .maybeSingle();

            if (!error) {
                setProfile(data);
            } else {
                console.error("Erreur Profil: ", error.message);
                setProfile(null);
            }
        }

        fetchProfiles();
    }, [user]);

    return (
        <AuthContext.Provider value={{ user, loading, profile }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);