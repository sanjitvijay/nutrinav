import { useState } from "react";
import toast from "react-hot-toast";
import supabaseClient from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
function ManualEntryForm() {
    const supabase = supabaseClient();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const {user}= useAuth()

    const [formData, setFormData] = useState({
        name: '',
        servings: 1,
        nutrition_facts: {
            calories: 0,
            total_carbohydrate: 0,
            total_fat: 0,
            protein: 0,
            saturated_fat: 0,
            iron: 0,
            sodium: 0,
            sugars: 0,
            calcium: 0,
            vitamin_a: 0,
            vitamin_c: 0,
            cholesterol: 0,
            dietary_fiber: 0,
        },
    })

    const [time, setTime] = useState('breakfast')

    const {name, servings} = formData;

    const foodInformation = {
        iron: 'mg',
        sodium: 'mg',
        sugars: 'g',
        calcium: 'mg',
        protein: 'g',
        calories: 'Cals',
        total_fat: 'g',
        vitamin_a: 'mg',
        vitamin_c: 'mg',
        cholesterol: 'mg',
        dietary_fiber: 'g',
        saturated_fat: 'g',
        total_carbohydrate: 'g'
    };   

    const onSubmit = async (e) => {
        e.preventDefault();

        if(name === ''){
            toast.error('Name is required')
            return
        }
        if(servings < 1){
            toast.error('Servings must be greater than 0')
            return
        }
        if(formData.nutrition_facts.calories <= 0){
            toast.error('Calories must be greater than 0')
            return
        }

        //const{data: {user}} = await supabase.auth.getUser();
        setLoading(true)
        const {data, error} = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)

        if(error){
            toast.error('Error fetching user data')
        }
        else{
            // Update user nutrition
            const newNutritionFacts = Object.fromEntries(
                Object.entries(formData.nutrition_facts).map(([key, value]) => [key, value * formData.servings])
            )

            let prev = data[0].nutrition
            for (let key in prev) {
                prev[key] = String(Number(prev[key]) + Number(newNutritionFacts[key]))
            }

            const {error: error2} = await supabase
            .from('users')
            .upsert([{id: user.id, nutrition: prev}])

            // Update user log
            let prevLog = data[0].log
            let changed = false

            prevLog = prevLog.map(logItem => {
                if (logItem.name === name && logItem.time === time) {
                    // Double the nutrition values of the matching logItem
                    changed = true
                    const changedNutritionFacts = Object.fromEntries(
                        Object.entries(logItem.nutrition_facts).map(([key, value]) => [key, String(Number(value) + Number(newNutritionFacts[key]))])
                    );
                    const updatedServings = String(Number(logItem.servings) + Number(servings));
                    return { ...logItem, nutrition_facts: changedNutritionFacts, servings: updatedServings};
                } else {
                    // Return the logItem unchanged
                    return logItem;
                }
            });

            if(!changed){
                const logItem = {nutrition_facts: newNutritionFacts, name, time, servings}
                prevLog.push(logItem)
            }

           
            const {error: error3} = await supabase
                .from('users')
                .upsert([{ id: user.id, log: prevLog }]);
            
            if(error3){
                toast.error("Error adding to log")
            }
            else{
                navigate('/dashboard')
                toast.success("Added to log")
                setLoading(false)
            }
        }
    }

    const onNutritionChange = (e) => {
        const { id, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            nutrition_facts: {
                ...prevState.nutrition_facts,
                [id]: value
            }
        }));
    };

    const onChange = e => {
        setFormData((prevState) => ({
            ...prevState, [e.target.id]: e.target.value
        }));
    }
    
    function capitalizeWords(str) {
        return str.replace(/\b\w/g, function (char) {
            return char.toUpperCase();
        });
    }
    
    return (
        <div className="card border-2 bg-white p-3 shadow-lg">
            <h1 className="text-3xl font-bold text-primary mb-5 text-center">Enter Food Information</h1>
            <form onSubmit={onSubmit}>
                <div className="form-control mb-5">
                    <span className="text-gray-500 mb-1">Food Name</span>
                    <label className="input input-bordered flex justify-between items-center gap-2">
                        <input 
                            type="text" 
                            id="name" 
                            value={name} 
                            onChange={onChange}
                            placeholder="Enter Food Name"  
                        />
                    </label>
                </div>

                <div className="form-control mb-5">
                    <span className="text-gray-500 mb-1">Meal Time</span>
                        <select 
                            id="time" 
                            value={time} 
                            onChange={(e) => setTime(e.target.value)}
                            className="select select-bordered w-full"
                        >
                            <option value="breakfast">Breakfast</option>
                            <option value="brunch">Brunch</option>
                            <option value="lunch">Lunch</option>
                            <option value="dinner">Dinner</option>
                        </select>
                </div>

                <div className="form-control mb-5">
                    <span className="text-gray-500 mb-1">Servings</span>
                    <label className="input input-bordered flex justify-between items-center gap-2">
                        <input
                            type="text"
                            id="servings"
                            value={servings}
                            onChange={onChange}
                        />
                    </label>
                </div>
                {Object.keys(formData.nutrition_facts).map((key, index) => (
                    <div key={index} className="form-control mb-5">
                        <span className="text-gray-500 mb-1">{capitalizeWords(key).replace(/_/g, ' ')}</span>
                        <label className="input input-bordered flex justify-between items-center gap-2">
                            <input 
                                type="text" 
                                id={key} 
                                value={formData.nutrition_facts[key]} 
                                onChange={onNutritionChange}  
                            />
                            <span className="text-gray-500 mb-1">{foodInformation[key]}</span>
                        </label>
                    </div>
                ))}

                <div className="flex justify-center">
                    <button 
                        type="submit" 
                        className="btn btn-primary mt-3 text-white"
                        onClick={onSubmit}
                        disabled={loading}
                    >
                        Add Food
                    </button>
                </div>
            </form>            
        </div>
    );
}

export default ManualEntryForm;