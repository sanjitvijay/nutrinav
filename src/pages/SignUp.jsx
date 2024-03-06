import { useNavigate } from "react-router-dom"; 

const SignUp = () => {
    const navigate = useNavigate();
    return (
        <div className="flex justify-center items-center h-screen">
            <form className="flex flex-col">
                <label className="mb-2">Email:</label>
                <input type="text" id="email" name="email" className="border border-black mb-2" />

                <label className="mb-2">Username:</label>
                <input type="text" id="username" name="username" className="border border-black mb-2" />

                <label className="mb-2">Password:</label>
                <input type="password" id="password" name="password" className="border border-black mb-2" />

                <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Sign Up</button>

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
};

export default SignUp;
