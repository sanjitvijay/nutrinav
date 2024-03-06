import { useNavigate } from 'react-router-dom';

function SignIn() {
    const navigate = useNavigate();

    
    return (
        <div className="flex justify-center items-center h-screen">
            <form className="flex flex-col">
                <label htmlFor="username" className="mb-2">Email:</label>
                <input type="text" id="username" name="username" className="border border-black mb-2" />

                <label htmlFor="password" className="mb-2">Password:</label>
                <input type="password" id="password" name="password" className="border border-black mb-2" />

                <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Sign In</button>

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
