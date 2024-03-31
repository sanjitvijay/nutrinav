import { useNavigate } from "react-router-dom";

function Home() {
    const navigate = useNavigate();

    return (
        <div>   
            <button 
                className="btn btn-primary text-white mr-10"
                onClick={()=>navigate('/sign-in')}
            >
                Sign In
            </button>
            

            <button 
                className="btn btn-secondary text-white mr-10"
                onClick={()=>navigate('/sign-up')}
            >
                Sign Up
            </button>
        </div>

    );
}

export default Home;
