import { useState, useEffect } from 'react';

import { useNavigate } from 'react-router-dom';
import supabaseClient  from '../supabaseClient';
import { useAuth } from '../context/AuthProvider';
import toast from 'react-hot-toast';

function CalorieCalc() {
    const navigate = useNavigate();
    const supabase = supabaseClient();
    const {user} = useAuth()

    const [formData, setFormData] = useState({
        dailyCalories: 2000, // Default or previously saved value
        dailyCarbs: 275,
        dailyFat: 60,
        dailyProtein: 50
    });

    const [results, setResults] = useState({});
    const [modalOpen, setModalOpen] = useState(false);
    const [combinedModalOpen, setCombinedModalOpen] = useState(false);
    const [caloriesModalOpen, setCaloriesModalOpen] = useState(false);
    const [macronutrientsModalOpen, setMacronutrientsModalOpen] = useState(false);
    const [actionType, setActionType] = useState(''); // 'calories' or 'macros'

    const [age, setAge] = useState(25);
    const [gender, setGender] = useState('male');
    const [heightFeet, setHeightFeet] = useState(5);
    const [heightInches, setHeightInches] = useState(10);
    const [weight, setWeight] = useState(165);
    const [activityLevel, setActivityLevel] = useState('moderate');
    const [goal, setGoal] = useState('maintain');

    const handleSubmit = (e) => {
        e.preventDefault();
    
        const heightInInches = parseInt(heightFeet * 12) + parseInt(heightInches);
        const heightInCentimeters = heightInInches * 2.54;
        const kilograms = weight * 0.453592;
    
        const heightFactor = heightInCentimeters * 6.25;
        const weightFactor = kilograms * 10;
    
        // Calculate BMR using Mifflin-St Jeor Equation
        const bmr = gender === 'male'
            ? weightFactor + heightFactor - (5 * age) + 5
            : weightFactor + heightFactor - (5 * age) - 161;
    
        // Adjust for activity level
        const activityFactors = {
            basal: 1,
            sedentary: 1.19978187098,
            light: 1.37505121057,
            moderate: 1.46479393084,
            active: 1.54971825002,
            veryActive: 1.72498758961,
            extraActive: 1.90025692919,
        };
        const maintenanceCalories = bmr * activityFactors[activityLevel];
        let selectedCalories;
    
        // Calories for weight loss and gain
        if (goal === 'maintain') {
            selectedCalories = Math.round(maintenanceCalories);
        } else if (goal === 'mild_loss') {
            selectedCalories = Math.round(maintenanceCalories - 250);
        } else if (goal === 'weight_loss') {
            selectedCalories = Math.round(maintenanceCalories - 500);
        } else if (goal === 'mild_gain') {
            selectedCalories = Math.round(maintenanceCalories + 250);
        } else if (goal === 'weight_gain') {
            selectedCalories = Math.round(maintenanceCalories + 500);
        }
    
        // Macronutrient percentages based on goal
        const macronutrientPercentages = {
            maintain: { carbs: 0.45, protein: 0.25, fat: 0.30 },
            mild_loss: { carbs: 0.40, protein: 0.35, fat: 0.25 },
            weight_loss: { carbs: 0.30, protein: 0.40, fat: 0.30 },
            mild_gain: { carbs: 0.55, protein: 0.20, fat: 0.25 },
            weight_gain: { carbs: 0.60, protein: 0.20, fat: 0.20 },
        };
        const { carbs, protein, fat } = macronutrientPercentages[goal];
    
        // Calculate macronutrients
        const tdee = selectedCalories; // Use selected calories for macronutrient calculations
        setResults({
            calories: selectedCalories,
            carbs: Math.round((tdee * carbs) / 4),       // 4 calories per gram of carbs
            protein: Math.round((tdee * protein) / 4),   // 4 calories per gram of protein
            fat: Math.round((tdee * fat) / 9),           // 9 calories per gram of fat
        });
    
        if (actionType === 'calories') {
            setCaloriesModalOpen(true);
        } else if (actionType === 'macros') {
            setMacronutrientsModalOpen(true);
        } else if (actionType === 'both') {
            setCaloriesModalOpen(false);
            setMacronutrientsModalOpen(false);
            setCombinedModalOpen(true);
        }
    };
    

    const updateCaloriesAndClose = async (calories) => {
        try {
            // Fetch the current user data
            const { data, error: fetchError } = await supabase
            .from('users')
            .select('dailyValues')
            .eq('id', user.id);

            if (fetchError) {
                throw fetchError;
            }

            // Extract the current protein, carbs, and fat values
            const currentProtein = data[0]?.dailyValues?.dailyProtein;
            const currentCarbs = data[0]?.dailyValues?.dailyCarbs;
            const currentFat = data[0]?.dailyValues?.dailyFat;

            // Create the updated form data object with the new calories value and current protein, carbs, and fat values
            const updatedFormData = {
                ...formData,
                dailyCalories: calories, // Update dailyCalories with the selected value
                dailyProtein: currentProtein,
                dailyCarbs: currentCarbs,
                dailyFat: currentFat
            };
            
            const { error } = await supabase
                .from('users')
                .upsert([{ id: user.id, dailyValues: updatedFormData }]);
    
            if (error) throw error;
    
            setFormData(updatedFormData); // Update the component's state
            toast.success('Daily calories updated successfully');
            setCaloriesModalOpen(false); // Assuming you have a modal open state
            setTimeout(() => {
                navigate('/dashboard');
            }, 1000); // Navigate after update
        } catch (error) {
            console.error('Error updating daily calories:', error);
            toast.error('Error updating daily calories');
        }
    };
    
    const updateCaloriesAndMacros = async (calories, carbs, fat, protein) => {
        try {
            // Combine calories and macronutrient updates
            const updatedFormData = {
                ...formData,
                dailyCalories: calories,
                dailyCarbs: carbs,
                dailyFat: fat,
                dailyProtein: protein
            };
    
            // Perform a single upsert with all updated values
            const { error } = await supabase
                .from('users')
                .upsert([{ id: user.id, dailyValues: updatedFormData }]);
    
            if (error) throw error;
    
            setFormData(updatedFormData);
            toast.success('Daily values updated successfully');
        } catch (error) {
            console.error('Error updating daily values:', error);
            toast.error('Failed to update daily values');
        }
    };
    
    const updateMacrosAndClose = async (carbs, fat, protein) => {
        try {
            // Fetch the current user data
            const { data, error: fetchError } = await supabase
                .from('users')
                .select('dailyValues')
                .eq('id', user.id);
    
            if (fetchError) {
                throw fetchError;
            }
    
            // Extract the current dailyCalories value
            const currentCalories = data[0]?.dailyValues?.dailyCalories;
    
            // Create the updated form data object with the new macronutrient values and current calories
            const updatedFormData = {
                ...formData,
                dailyCarbs: carbs,
                dailyFat: fat,
                dailyProtein: protein,
                dailyCalories: currentCalories // Keep the current dailyCalories value
            };
    
            // Upsert the updated form data into the database
            const { error } = await supabase
                .from('users')
                .upsert([{ id: user.id, dailyValues: updatedFormData }]);
    
            if (error) {
                throw error;
            }
    
            // Update the component's state
            setFormData(updatedFormData);
            toast.success('Daily macronutrients updated successfully');
            setMacronutrientsModalOpen(false); // Assuming you have a modal open state
            setTimeout(() => {
                navigate('/dashboard');
            }, 1000); // Navigate after update
        } catch (error) {
            console.error('Error updating daily macronutrients:', error);
            toast.error('Error updating daily macronutrients');
        }
    };    
    
    return (
        <div>
            <div className="card px-10 py-5 border-2 shadow-md">
                <div className="flex justify-center items-center">
                    <h1 className="text-3xl font-bold text-primary mb-5 text-center">Calorie Calculator</h1>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="form-control mb-5">
                        <label className="text-gray-500 mb-1">Age</label>
                        <input 
                            type="number" 
                            id="age" 
                            value={age} 
                            onChange={(e) => setAge(e.target.value)} 
                            min="15" 
                            max="80" 
                            className="input input-bordered"
                        />
                    </div>

                    <div className="form-control mb-5">
                        <label className="text-gray-500 mb-1">Gender</label>
                        <select 
                            id="gender" 
                            value={gender} 
                            onChange={(e) => setGender(e.target.value)} 
                            className="select select-bordered"
                        >
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </select>
                    </div>

                    <div className="form-control mb-5">
                        <label className="text-gray-500 mb-1">Height (feet)</label>
                        <input 
                            type="number" 
                            id="heightFeet" 
                            value={heightFeet} 
                            onChange={(e) => setHeightFeet(e.target.value)} 
                            min="3" 
                            max="8" 
                            className="input input-bordered"
                        />
                    </div>

                    <div className="form-control mb-5">
                        <label className="text-gray-500 mb-1">Height (inches)</label>
                        <input 
                            type="number" 
                            id="heightInches" 
                            value={heightInches} 
                            onChange={(e) => setHeightInches(e.target.value)} 
                            min="0" 
                            max="11" 
                            className="input input-bordered"
                        />
                    </div>

                    <div className="form-control mb-5">
                        <label className="text-gray-500 mb-1">Weight (lbs)</label>
                        <input 
                            type="number" 
                            id="weight" 
                            value={weight} 
                            onChange={(e) => setWeight(e.target.value)} 
                            min="50" 
                            max="500" 
                            className="input input-bordered"
                        />
                    </div>

                    <div className="form-control mb-5">
                        <label className="text-gray-500 mb-1">Activity Level</label>
                        <select 
                            id="activityLevel" 
                            value={activityLevel} 
                            onChange={(e) => setActivityLevel(e.target.value)} 
                            className="select select-bordered"
                        >
                            <option value="basal">Basal Metabolic Rate (BMR)</option>
                            <option value="sedentary">Sedentary: little or no exercise</option>
                            <option value="light">Light: exercise 1-3 times/week</option>
                            <option value="moderate">Moderate: exercise 4-5 times/week</option>
                            <option value="active">Active: daily exercise or intense exercise 3-4 times/week</option>
                            <option value="very-active">Very Active: intense exercise 6-7 times/week</option>
                            <option value="extra-active">Extra Active: very intense exercise daily, or physical job</option>
                        </select>
                    </div>

                    <div className="form-control mb-5">
                        <label className="text-gray-500 mb-1">Your Goal</label>
                        <select 
                            id="goal" 
                            value={goal} 
                            onChange={(e) => setGoal(e.target.value)} 
                            className="select select-bordered"
                        >
                            <option value="maintain">Maintaight weight</option>
                            <option value="mild_loss">Mild weight loss of 0.5 lb (0.25 kg) per week</option>
                            <option value="weight_loss">Weight loss of 1 lb (0.5 kg) per week</option>
                            <option value="mild_gain">Mild weight gain of 0.5 lb (0.25 kg) per week</option>
                            <option value="weight_gain">Weight gain of 1 lb (0.5 kg) per week</option>
                        </select>
                    </div>
                    
                    {/* <button 
                        type="submit" 
                        className="btn btn-primary w-full mt-5 text-white"
                        onClick={() => setActionType('calories')}
                    >
                        Calculate Calories
                    </button>
                        
                    <button 
                        type="submit" 
                        className="btn btn-secondary w-full mt-5 text-white"
                        onClick={() => setActionType('macros')}
                    >
                        Calculate Macronutrients
                    </button> */}
                    <button 
                        type="submit" 
                        className="btn btn-primary w-full mt-5 text-white"
                        onClick={() => setActionType('both')}
                    >
                        Calculate
                    </button>

                    <button onClick={() => navigate(-1)} className="btn btn-secondary  mt-5 text-white w-full"> Back </button>

                </form>
            </div>
            {/* Calories Modal */}
            {caloriesModalOpen && (
                <dialog id="my_modal_2" className="modal" open>
                    <div className="modal-box">
                        <h3 className="font-bold text-lg text-center">Calorie Calculation Results</h3>
                        {goal === 'maintain' && (
                            <button className="btn btn-primary w-full mb-2 text-white" onClick={() => updateCaloriesAndClose(results.maintainWeight)}>Maintain Weight: {results.calories} Calories/day</button>
                        )}
                        {goal === 'mild_loss' && (
                            <button className="btn btn-primary w-full mb-2 text-white" onClick={() => updateCaloriesAndClose(results.mildWeightLoss)}>Mild Weight Loss: {results.calories} Calories/day</button>
                        )}
                        {goal === 'weight_loss' && (
                            <button className="btn btn-primary w-full mb-2 text-white" onClick={() => updateCaloriesAndClose(results.weightLoss)}>Weight Loss: {results.calories} Calories/day</button>
                        )}
                        {goal === 'mild_gain' && (
                            <button className="btn btn-primary w-full mb-2 text-white" onClick={() => updateCaloriesAndClose(results.mildWeightGain)}>Mild Weight Gain: {results.calories} Calories/day</button>
                        )}
                        {goal === 'weight_gain' && (
                            <button className="btn btn-primary w-full mb-2 text-white" onClick={() => updateCaloriesAndClose(results.weightGain)}>Weight Gain: {results.calories} Calories/day</button>
                        )}
                    </div>
                    <form method="dialog" className="modal-backdrop">
                        <button onClick={() => setCaloriesModalOpen(false)}>Close</button>
                    </form>
                </dialog>
            )}
            {/* Macronutrients Modal */}
            {macronutrientsModalOpen && (
                <dialog id="my_modal_2" className="modal" open>
                    <div className="modal-box">
                        <h3 className="font-bold text-lg text-center">Macronutrient Calculation Results</h3>
                        <div className="btn btn-secondary w-full mb-2 text-white" onClick={() => updateMacrosAndClose(results.carbs, results.fat, results.protein)}>
                            Carbs: {results.carbs}, Protein: {results.protein}, Fat: {results.fat} (g)
                        </div>
                    </div>
                    <form method="dialog" className="modal-backdrop">
                        <button onClick={() => setMacronutrientsModalOpen(false)}>Close</button>
                    </form>
                </dialog>
            )}
            {/* Combined Modal for Calories and Macronutrients */}
{/* Combined Modal for Calories and Macronutrients */}
{combinedModalOpen && (
    <dialog className="modal" open>
        <div className="modal-box">
            <h3 className="font-bold text-lg text-center">Calories and Macronutrient Calculation Results</h3>
            <p className="mb-2">Calories: {results.calories} Calories/day</p>
            <p className="mb-2 mt-4">Macronutrients:</p>
            <ul>
                <li>Carbs: {results.carbs} g</li>
                <li>Protein: {results.protein} g</li>
                <li>Fat: {results.fat} g</li>
            </ul>
            <button 
                className="btn btn-primary w-full mt-5 text-white"
                onClick={async () => {
                    await updateCaloriesAndMacros(results.calories, results.carbs, results.fat, results.protein);
                    
                    setCombinedModalOpen(false); // Close modal
                    setTimeout(() => {
                        navigate('/dashboard');
                    }, 1000); // Optional: Navigate after update
                }}
            >
                Update
            </button>
        </div>
        <form method="dialog" className="modal-backdrop">
            <button onClick={() => setCombinedModalOpen(false)}>Close</button>
        </form>
    </dialog>
)}


        </div>
    );
}

export default CalorieCalc;
