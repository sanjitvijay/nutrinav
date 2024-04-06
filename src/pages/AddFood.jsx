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

    const [caloriesRemaining, setCaloriesRemaining] = useState(null)

    const [menu, setMenu] = useState([])
    const [diningHall, setDiningHall] = useState('Bursley')

    const [breakfast, setBreakfast] = useState([])
    const [brunch, setBrunch] = useState([])
    const [lunch, setLunch] = useState([])
    const [dinner, setDinner] = useState([])

    const [showBreakfast, setShowBreakfast] = useState(false)
    const [showBrunch, setShowBrunch] = useState(false)
    const [showLunch, setShowLunch] = useState(false)
    const [showDinner, setShowDinner] = useState(false)
    const MealTimes = {
        BREAKFAST: 'is_breakfast',
        BRUNCH: 'is_brunch',
        LUNCH: 'is_lunch',
        DINNER: 'is_dinner'
    }

    useEffect(()=>{
        const fetchCalories = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            const { data, error } = await supabase
                .from('users')
                .select('calories')
                .eq('id', user.id)
            if (error) {
                console.log('Error:', error)
            } else {
                setCaloriesRemaining(2000 - data[0].calories)
            }
        }

        fetchCalories()
        fetchMenu(MealTimes.BREAKFAST)
        fetchMenu(MealTimes.BRUNCH)
        fetchMenu(MealTimes.LUNCH)
        fetchMenu(MealTimes.DINNER)
    },[diningHall])
    
    const fetchMenu = async (mealTime) => {
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
            setMenu(data)
        }
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
            
            <div>
                <button className="flex items-center mt-5" onClick={() => setShowBreakfast(!showBreakfast)}>
                    <h1 className="text-primary font-bold text-3xl">Breakfast</h1>
                    <ToggleIcon toggle={showBreakfast}/>
                </button>
                <div className="divider -mt-1"></div> 
                {showBreakfast && <MenuDisplay menu={breakfast} time={'breakfast'}/>}
            </div>

            <div>
                <button className="flex items-center mt-5" onClick={() => setShowLunch(!showLunch)}>
                    <h1 className="text-primary font-bold text-3xl">Lunch</h1>
                    <ToggleIcon toggle={showLunch}/>
                    
                </button>
                <div className="divider -mt-1"></div> 
                {showLunch && <MenuDisplay menu={lunch} time={'lunch'}/>}
            </div>

            <div>
                <button className="flex items-center mt-5" onClick={() => setShowDinner(!showDinner)}>
                    <h1 className="text-primary font-bold text-3xl">Dinner</h1>   
                    <ToggleIcon toggle={showDinner}/>
                </button>
                <div className="divider -mt-1"></div> 
                {showDinner && <MenuDisplay menu={dinner} time={'dinner'}/>}
            </div>
        </div>
    );
}

export default AddFood;