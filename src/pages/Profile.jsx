import RightArrow from "../components/RightArrow";
import { useNavigate } from "react-router-dom";
function Profile() {
    const navigate = useNavigate();
    
    return (
        <div>
            <h1 className="text-primary font-bold text-3xl">Profile</h1>
            <button 
                className="btn btn-ghost mt-5 text-lg"
                onClick={() => navigate('/user-info')}
            >
                Update Daily Values <RightArrow />
            </button>
        </div>
    );
}

export default Profile;