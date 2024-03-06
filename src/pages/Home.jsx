import { useNavigate } from "react-router-dom";

function Home() {
    const navigate = useNavigate();

    return (
        <div>   
            <div className="p-5 hover:shadow-xl">
                <button 
                    onClick={()=>navigate('/sign-in')}
                >
                    Sign In
                </button>
            </div>

            <div className="p-5 hover:shadow-xl">
                <button>Sign Up</button>
            </div>
        </div>

    );
}

export default Home;
