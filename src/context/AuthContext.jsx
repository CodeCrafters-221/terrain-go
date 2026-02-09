import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";

const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [terrains, setTerrains] = useState(null);
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

    useEffect(() => {
        const fetchTerrains = async () => {
            if(profile.role === "owner") {
                const { data, error } = await supabase.from("fields")
                .select("*")
                .eq("proprietaire_id", profile.id);

                if(!error) {
                    setTerrains(data);
                } else {
                    console.error("Erreur récuperation terrain: ", error.message);
                    setTerrains(null);
                }
            }
        }

        fetchTerrains();
    }, [profile]);

    return (
        <AuthContext.Provider value={{ user, loading, profile, terrains }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);