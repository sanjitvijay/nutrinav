import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import supabaseClient from '../supabaseClient';

function SignUp() {
    const navigate = useNavigate();
    const supabase = supabaseClient();

    const [formData, setFormData] = useState({
        email: '',
        username: '',
        password: ''
    });

    const{ email, username, password } = formData;

    const onChange = e => {
        setFormData((prevState) => ({
            ...prevState, [e.target.id]: e.target.value
        }));
    }

    const onSubmit = async (e) => {
        e.preventDefault()

        // console.log('Email:', email);
        // console.log('Username:', username)
        // console.log('Password:', password)
        try{
            await supabase.auth.signUp({
                email,
                password
            })

            await supabase
            .from('users')
            .insert({username,email})
            
            console.log('User signed up successfully')
            navigate('/dashboard')
        } catch (error) {
            console.log('Error:', error)
        }

    }

    return (
        <div className="flex justify-center items-center h-screen">
            <form className="flex flex-col">

                <label className="mb-2">Email:</label>
                <input 
                    type="text" 
                    id="email" 
                    value={email}
                    className="border border-black mb-2"
                    onChange={onChange}
                />

                <label className="mb-2">Username:</label>
                <input 
                    type="text" 
                    id="username" 
                    value={username}
                    className="border border-black mb-2"
                    onChange={onChange}
                />

                <label className="mb-2">Password:</label>
                <input 
                    type="text" 
                    id="password" 
                    value={password}
                    className="border border-black mb-2" 
                    onChange={onChange}
                />

                <button 
                    type="submit" 
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    onClick={onSubmit}
                >
                    Sign Up
                </button>

                <div className="flex justify-center mt-4">
                    <button 
                        className="text-blue-500 hover:underline"
                        onClick={()=>navigate('/sign-in')}
                    >
                        Back to Sign In
                    </button>
                </div>
            </form>
            
        </div>
    );
}

export default SignUp;
