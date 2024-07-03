import RightArrow from "../components/RightArrow";
import { useNavigate } from "react-router-dom";
function Profile() {
    const navigate = useNavigate();
    
    return (
        <div>
            <div>
                <h1 className="text-primary font-bold text-3xl">Profile</h1>
                <button 
                    className="btn btn-primary mt-5 text-lg"
                    onClick={() => navigate('/user-info')}
                >
                    Update Daily Values <RightArrow />
                </button>
            </div>
            <div>
                <button 
                    className="btn btn-primary mt-5 text-lg"
                    onClick={() => navigate('/calorie-calc')}
                >
                    Maintenance Calorie Calculator <RightArrow />
                </button>
            </div>
            <div>
                <button 
                    className="btn btn-primary mt-5 text-lg"
                    onClick={() => navigate('/scanner')}
                >
                    Scanner <RightArrow />
                </button>
            </div>
        </div>
    );
}

export default Profile;
