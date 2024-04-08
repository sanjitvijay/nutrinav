import { useLocation, useNavigate } from 'react-router-dom';
import googleIcon from '../assets/googleIcon.svg';
import supabaseClient from '../supabaseClient';
import toast from 'react-hot-toast';
import { useEffect, useState } from 'react';
import { set } from 'date-fns';

function GoogleAuth() {
    const location = useLocation();
    const navigate = useNavigate();
    const supabase = supabaseClient();   

    const [data, setData] = useState(null);

    const onGoogleClick = async () => {
        const path = location.pathname; 
        if(path === '/sign-up') {

        } 
        else {
            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {  
                    redirectTo: 'http://localhost:3000/dashboard',
                }
            })
            if(error) {
                toast.error('Error signing in with Google')
            } 
            else {
                setData(data);
            }
        }
    }

    return (
        <div className="socialLogin">
            <h2>Sign {location.pathname === '/sign-up' ? 'up' : 'in'} with</h2>
            <button className="socialIconDiv" onClick={onGoogleClick}>
                <img src={googleIcon} alt="google icon"/>
            </button>
        </div>
    );
}

export default GoogleAuth;