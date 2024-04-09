import { createContext, useContext, useEffect, useState } from "react";
import supabaseClient from "../supabaseClient";
import { useNavigate } from "react-router-dom";

const supabase = supabaseClient();
const AuthContext = createContext({});


export const useAuth = () => useContext(AuthContext);

const login = (email, password) => 
    supabase.auth.signInWithPassword({ email, password });

const signUp = (email, password) => supabase.auth.signUp({ email, password });

const logout = () => supabase.auth.signOut();

const forgotPassword = (email) => supabase.auth.resetPasswordForEmail(email);

const updatePassword = (updatedPassword) => supabase.auth.updateUser({password: updatedPassword})

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [auth, setAuth] = useState(false);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        const getUser = async () => {
            const {data}= await supabase.auth.getUser();
            const {user: currentUser} = data;
            setUser(currentUser ?? null);
            setLoading(false);
        }
        getUser();

        const { data } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === "SIGNED_IN") {
                setUser(session.user);
                setAuth(true);
                navigate("/dashboard");
            }
            if (event === "SIGNED_OUT") {
                setUser(null);
                setAuth(false);
                navigate("/");
            }
            if(event === "PASSWORD_RECOVERY"){
                navigate("/forgot-password")
                setUser(session.user);
                setAuth(false)
            }
            if(event === "USER_UPDATED"){
                setUser(null)
            }
        });
        return () => {
            data.subscription.unsubscribe();
        };
    }, []);
    
    return (
        <AuthContext.Provider 
            value={{ 
                user, 
                auth, 
                logout, 
                login,
                forgotPassword,
                updatePassword
            }}
        >
            {!loading && children}
        </AuthContext.Provider>
    );
};
      

export default AuthProvider;
