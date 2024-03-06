import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function SignIn() {
    const navigate = useNavigate();

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

    const onSubmit = (e) => {
        e.preventDefault()

        console.log('Email:', email);
        console.log('Password:', password)
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
