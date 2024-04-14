import { useNavigate } from "react-router-dom";
import NutriNavHomePage from '../assets/HomePage.jpeg';
import RightArrow from "../components/RightArrow";
import { useEffect } from "react";
import { useAuth } from "../context/AuthProvider";
function Home() {
    const navigate = useNavigate();
    const {user}= useAuth()

    useEffect(()=>{
        if(user){
            navigate('/dashboard')
        }
    })
    return (
        <div> 
            <div className="px-9">
                <h2 className="text-3xl font-bold text-primary text-center">Eat Smart, Track Anywhere: <span className="text-secondary">Your Campus Food Diary</span> </h2>
                <p className="text-lg text-neutral mt-5 text-center font-semibold">Record your dining hall meals & meet your dietary needs.</p>
            </div>

            <div className="flex justify-center mt-5 mb-5">
                <button 
                    className="btn btn-primary rounded-full text-white w-full max-w-xl"
                    onClick={()=>navigate('/sign-up')}
                > 
                    <span className="text-lg">Sign Up Today </span> <RightArrow/>
                </button>
            </div>

            <div className="flex justify-center mt-3 mb-5">
                <button 
                    className="btn btn-secondary rounded-full text-white w-full max-w-xl"
                    onClick={()=>navigate('/sign-in')}
                > 
                    <span className="text-lg">Sign In </span> <RightArrow/>
                </button>
            </div>

            

            <div className="flex justify-center">
                <img className="shadow-xl rounded-3xl" src={NutriNavHomePage} alt="HomePage"/>
            </div>
        </div>

    );
}

export default Home;
