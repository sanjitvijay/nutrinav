import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import supabaseClient  from '../supabaseClient';
import { MdOutlineVisibility } from "react-icons/md";
import { MdOutlineVisibilityOff } from "react-icons/md";
import { useAuth } from '../context/AuthProvider';
import toast from 'react-hot-toast';

function SignUp() {
    const navigate = useNavigate();
    const supabase = supabaseClient();

    const [formData, setFormData] = useState({
        email: '',
        username: '',
        password: ''
    });

    const{ email, username, password } = formData;

    const [showPassword, setShowPassword] = useState(false);


    const onChange = e => {
        setFormData((prevState) => ({
            ...prevState, [e.target.id]: e.target.value
        }));
    }

    const onSubmit = async (e) => {
        e.preventDefault()

        if(password.length < 6) {
            toast.error('Password should be at least 6 characters long')
            return
        }
        const{error} = await supabase.auth.signUp({
            email,
            password
        })

        const{error2} = await supabase
        .from('users')
        .insert({username,email})

        if(error || error2) {
            toast.error('Error signing up')
        }
        else{
            navigate('/dashboard')
        }
    }

    return (
        <div className="flex justify-center items-center">
        <div className="card px-10 py-5 border-2 shadow-md">
            <h1 className="text-3xl font-bold text-primary mb-5 text-center">Sign Up</h1>
            <form onSubmit={onSubmit}>
                <div className="form-control mb-5">
                    <label className="input input-bordered flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70"><path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" /><path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" /></svg>
                        <input 
                            type="email" 
                            id="email" 
                            value={email} 
                            onChange={onChange}  
                            placeholder="Email" 
                        />
                    </label>
                </div>

                <div className="form-control mb-5">
                    <label className="input input-bordered flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70"><path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" /></svg>                        <input 
                            type="text" 
                            id="username" 
                            value={username} 
                            onChange={onChange}  
                            placeholder="Username" 
                        />
                    </label>
                </div>

                <div className="form-control">
                    <label className="input input-bordered flex items-center gap-2">
                        <div className='flex gap-2 items-center'>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70"><path fillRule="evenodd" d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z" clipRule="evenodd" /></svg>                            
                            <input 
                                    type={showPassword ? 'text' : 'password'} 
                                    id="password" 
                                    value={password} 
                                    onChange={onChange}  
                                    placeholder="Password" 
                            />
                        </div>

                        <button 
                            onClick={()=>setShowPassword((prevState)=>!prevState)}
                        >
                            {showPassword ?
                            <MdOutlineVisibility size={20} color='#5c5c5c'/>
                            : <MdOutlineVisibilityOff size={20} color='#5c5c5c'/>}
                        </button>
                    </label>
                </div>

                <button 
                    type="submit" 
                    className="btn btn-primary w-full mt-5 text-white"
                    onClick={onSubmit}
                >
                    Sign Up
                </button>
            </form>

            <div className="flex justify-center mt-5">
                <button 
                    className="btn btn-ghost btn-sm"
                    onClick={()=>navigate('/sign-in')}
                >
                    Sign In
                </button>  
            </div>
        </div>
    </div>
    );
}

export default SignUp;
