import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import supabaseClient  from '../supabaseClient';

function SignIn() {
    const navigate = useNavigate();
    const supabase = supabaseClient();

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const{ email, password } = formData;

    const onChange = e => {
        setFormData((prevState) => ({
            ...prevState, [e.target.id]: e.target.value
        }));
    }

    const onSubmit = async (e) => {
        e.preventDefault()

        console.log('Email:', email);
        console.log('Password:', password)

        try{
            await supabase.auth.signInWithPassword({
                email,
                password,
            })

            console.log('User signed in successfully')
            navigate('/dashboard')
        } catch (error) {
            console.log('Error:', error)
        }
    }

    const forgotPassword = async () => {
        const { data, error } = await supabase.auth
        .resetPasswordForEmail('user@email.com')
    }
    
    return (
        <div className="flex justify-center items-center h-screen">
            <form className="flex flex-col">

                <label className="mb-2">Email:</label>
                <input
                    type="text" 
                    id="email" 
                    value={email}
                    className="input input-sm border-black border-1"
                    onChange={onChange}
                />

                <label className="mb-2">Password:</label>
                <input 
                    type="text" 
                    id="password" 
                    value={password}
                    className="input input-sm border-black border-1 mb-3"
                    onChange={onChange}
                />

                <button 
                    type="submit" 
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    onClick={onSubmit}
                >
                    Sign In
                </button>

                <div className="flex justify-between mt-4">
                    <button className="text-blue-500 hover:underline mr-5">Forgot Password</button>
                    <button 
                        className="text-blue-500 hover:underline"
                        onClick={()=>navigate('/sign-up')}
                    >
                        Sign Up Instead
                    </button>
                </div>
            </form>
            
        </div>
    );
}

export default SignIn;
