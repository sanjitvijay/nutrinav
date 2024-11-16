import RightArrow from "../components/RightArrow";
import { useNavigate } from "react-router-dom";
function Edit() {
    const navigate = useNavigate();
    
    return (
        <div>
            <div>
                <h1 className="text-primary font-bold text-3xl">Edit Daily Values</h1>
                <button 
                    className="btn btn-primary mt-5 text-lg text-white"
                    onClick={() => navigate('/user-info')}
                >
                    Manual Input  <RightArrow />
                </button>
            </div>
            <div>
                <button 
                    className="btn btn-primary mt-5 text-lg text-white"
                    onClick={() => navigate('/calorie-calc')}
                >
                    Automatic Calorie Calculator <RightArrow />
                </button>
            </div>
            <div>
                <button 
                    className="btn btn-secondary mt-5 text-lg text-white"
                    onClick={() => navigate(-1)} 
                > 
                    Back 
                </button>
            </div>
        </div>
    );
}

export default Edit;
