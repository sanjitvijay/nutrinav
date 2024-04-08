import { MdOutlineVisibility } from "react-icons/md";
import { MdOutlineVisibilityOff } from "react-icons/md";
import { useState } from 'react';
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthProvider";
import { useNavigate } from 'react-router-dom';

function ForgotPassword() {
    const [showPassword, setShowPassword] = useState(false);
    const {updatePassword} = useAuth()
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        password: '',
    });

    const {password} = formData;

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
        const {error} = await updatePassword(password)
        if(error) {
            toast.error('Error updating password')
            console.log(error)
        } else {
            toast.success('Password updated successfully')
            setTimeout(() => {navigate('/sign-in')}, 1000)
        }
    }
    return (
        <div className="flex justify-center items-center">
            <div className="card px-10 py-5 border-2 shadow-md">
                <h1 className="text-3xl font-bold text-primary mb-5 text-center">Forgot Password</h1>
                <form>
                <div className="form-control">
                        <label className="input input-bordered flex items-center gap-2">
                            <div className='flex gap-2 items-center'>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70"><path fillRule="evenodd" d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z" clipRule="evenodd" /></svg>                            
                                <input 
                                        type={showPassword ? 'text' : 'password'} 
                                        id="password" 
                                        value={password} 
                                        onChange={onChange}  
                                        placeholder="Updated Password" 
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

                        <button 
                            type="submit" 
                            className="btn btn-primary w-full mt-5 text-white"
                            onClick={onSubmit}
                        >
                            Reset Password
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ForgotPassword;