import supabaseClient from "../supabaseClient";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ItemCard from "../components/ItemCard";
import CustomDropdown from "../components/CustomDropdown";
import MenuDisplay from "../components/MenuDisplay";
import ToggleIcon from "../components/ToggleIcon";

function AddFood() {
    const supabase = supabaseClient()
    const navigate = useNavigate()

    const [diningHall, setDiningHall] = useState('Bursley')

    const [breakfast, setBreakfast] = useState([])
    const [brunch, setBrunch] = useState([])
    const [lunch, setLunch] = useState([])
    const [dinner, setDinner] = useState([])

    const [showBreakfast, setShowBreakfast] = useState(false)
    const [showBrunch, setShowBrunch] = useState(false)
    const [showLunch, setShowLunch] = useState(false)
    const [showDinner, setShowDinner] = useState(false)

    const [loading, setLoading] = useState(false)

    const MealTimes = {
        BREAKFAST: 'is_breakfast',
        BRUNCH: 'is_brunch',
        LUNCH: 'is_lunch',
        DINNER: 'is_dinner'
    }

    useEffect(()=>{
        fetchMenu(MealTimes.BREAKFAST)
        fetchMenu(MealTimes.BRUNCH)
        fetchMenu(MealTimes.LUNCH)
        fetchMenu(MealTimes.DINNER)
    },[diningHall])
    
    const fetchMenu = async (mealTime) => {
        setLoading(true)
        let mealCondition = ''
        switch(mealTime){
            case MealTimes.BREAKFAST: 
                mealCondition = MealTimes.BREAKFAST
                break;
            case MealTimes.BRUNCH: 
                mealCondition = MealTimes.BRUNCH
                break;
            case MealTimes.LUNCH: 
                mealCondition = MealTimes.LUNCH
                break;
            default: 
                mealCondition = MealTimes.DINNER
        }

        const { data, error } = await supabase
            .from(diningHall)
            .select('*')
            .eq(mealCondition, true)

        if (error) {
            console.log('Error:', error)
        } else {
            switch(mealTime){
                case MealTimes.BREAKFAST: 
                    setBreakfast(data)
                    break;
                case MealTimes.BRUNCH: 
                    setBrunch(data)
                    break;
                case MealTimes.LUNCH: 
                    setLunch(data)
                    break;
                default: 
                    setDinner(data)
            }
        }
        setTimeout(() => {
            setLoading(false)
        }, 500); 
    }

    const onChange = (option) => {
        setDiningHall(option)
    }
    return (
        <div className="pb-5">
            <div className="flex justify-center">
                <CustomDropdown 
                    options={['Bursley', 'East Quad', 'Markley', 'Mosher-Jordan', 'North Quad', 'South Quad', 'Twigs at Oxford']} 
                    onChange={onChange}
                />
            </div>
            {loading ? 
                <div className="flex justify-center mt-3">
                    <span className="loading loading-spinner loading-lg text-secondary"></span>
                </div> 
                : 
                <>
                    {breakfast.length !== 0 && 
                        <div>
                            <button className="flex items-center mt-5" onClick={() => setShowBreakfast(!showBreakfast)}>
                                <h1 className="text-primary font-bold text-3xl">Breakfast</h1>
                                <ToggleIcon toggle={showBreakfast}/>
                            </button>
                            <div className="divider -mt-1"></div> 
                            {showBreakfast && <MenuDisplay menu={breakfast} time={'breakfast'}/>}
                        </div>
                    }

                    {brunch.length !== 0 && 
                        <div>
                            <button className="flex items-center mt-5" onClick={() => setShowBrunch(!showBrunch)}>
                                <h1 className="text-primary font-bold text-3xl">Brunch</h1>
                                <ToggleIcon toggle={showBrunch}/>
                            </button>
                            <div className="divider -mt-1"></div> 
                            {showBrunch && <MenuDisplay menu={brunch} time={'brunch'}/>}
                        </div>
                    }

                    {lunch.length !== 0 && 
                        <div>
                            <button className="flex items-center mt-5" onClick={() => setShowLunch(!showLunch)}>
                                <h1 className="text-primary font-bold text-3xl">Lunch</h1>
                                <ToggleIcon toggle={showLunch}/>
                                
                            </button>
                            <div className="divider -mt-1"></div> 
                            {showLunch && <MenuDisplay menu={lunch} time={'lunch'}/>}
                        </div>
                    }

                    {dinner.length !== 0 && 
                        <div>
                            <button className="flex items-center mt-5" onClick={() => setShowDinner(!showDinner)}>
                                <h1 className="text-primary font-bold text-3xl">Dinner</h1>   
                                <ToggleIcon toggle={showDinner}/>
                            </button>
                            <div className="divider -mt-1"></div> 
                            {showDinner && <MenuDisplay menu={dinner} time={'dinner'}/>}
                        </div>
                    }

                    <div className="flex justify-center">
                        <button 
                            className="btn btn-primary text-white"
                            onClick={() => navigate('/manual-entry')}
                        >
                            Manual Entry
                        </button>
                    </div>
                </>
            }
        </div>
    );
}

export default AddFood;