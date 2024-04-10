import { createContext, useContext, useEffect, useState } from "react";
import supabaseClient from "../supabaseClient";
import { useNavigate, useLocation } from "react-router-dom";

const supabase = supabaseClient();
const UserInfoContext = createContext({});

export const useUserInfo = () => useContext(UserInfoContext);

const UserInfoProvider = ({ children }) => {
    const [userInfo, setUserInfo] = useState({});
    const [loading, setLoading] = useState(true);

    const location = useLocation()

    const fetchUserInfo = async () => {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        const { data, error } = await supabase
            .from('users')
            .select('dailyValues')
            .eq('id', user.id)
        if (error) {
            console.log('Error:', error);
        } else {
            setUserInfo(data[0].dailyValues);
        }
        setLoading(false);
    };
    
    useEffect(() => {
        const fetchUserInfo = async () => {
            setLoading(true);
            const { data: { user } } = await supabase.auth.getUser();
            if(user){
                const { data, error } = await supabase
                .from('users')
                .select('dailyValues')
                .eq('id', user.id)
                if (error) {
                    console.log('Error:', error);
                } else {
                    setUserInfo(data[0].dailyValues);
                }
            }
            setLoading(false);
        };


        fetchUserInfo();
    }, [supabase, location]);

    return (
        <UserInfoContext.Provider value={{ userInfo }}>
            {children}
        </UserInfoContext.Provider>
    );
}

export default UserInfoProvider;