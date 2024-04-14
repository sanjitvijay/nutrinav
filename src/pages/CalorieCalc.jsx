import { useState } from 'react';

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
    
        const heightFactor = heightInCentimeters * 6.25;
    
        const kilograms = weight * 0.453592;
    
        const weightFactor = kilograms * 10;

        // Calculate BMR using Mifflin-St Jeor Equation
        const bmr = gender === 'male'
            ? (weightFactor) + (heightFactor) - (5 * age) + 5
            : (weightFactor) + (heightFactor) - (5 * age) - 161;

        let maintenanceCalories = bmr;
        let tdee = bmr;
        console.log(maintenanceCalories);
    
        // Adjust for activity level
        if (activityLevel === 'basal') {
            maintenanceCalories *= 1;
            tdee = bmr * 1;
        } else if (activityLevel === 'sedentary') {
            maintenanceCalories *= 1.19978187098;
            tdee = bmr * 1.19978187098;
        } else if (activityLevel === 'light') {
            maintenanceCalories *= 1.37505121057;
            tdee = bmr * 1.37505121057;
        } else if (activityLevel === 'moderate') {
            maintenanceCalories *= 1.46479393084;
            tdee = bmr * 1.46479393084;
        } else if (activityLevel === 'active') {
            maintenanceCalories *= 1.54971825002;
            tdee = bmr * 1.54971825002;
        } else if (activityLevel === 'very-active') {
            maintenanceCalories *= 1.72498758961;
            tdee = bmr * 1.72498758961;
        } else if (activityLevel === 'extra-active') {
            maintenanceCalories *= 1.90025692919;
            tdee = bmr * 1.90025692919;
        }



        // Calories for weight loss and gain
        const mildWeightLossCalories = maintenanceCalories - 250;
        const weightLossCalories = maintenanceCalories - 500;
        const mildWeightGainCalories = maintenanceCalories + 250;
        const weightGainCalories = maintenanceCalories + 500;

        let carbPercentage = 0.45;
        let proteinPercentage = 0.25;
        let fatPercentage = 0.30;

        if (goal === 'maintain') {
            carbPercentage = 0.45;
            proteinPercentage = 0.25;
            fatPercentage = 0.30;
        } else if (goal === 'mild_loss') {
            carbPercentage = 0.40; // Adjusted for mild weight loss
            proteinPercentage = 0.35; // Adjusted for mild weight loss
            fatPercentage = 0.25; // Adjusted for mild weight loss
        } else if (goal === 'weight_loss') {
            carbPercentage = 0.30; // Adjusted for weight loss
            proteinPercentage = 0.40; // Adjusted for weight loss
            fatPercentage = 0.30; // Adjusted for weight loss
        } else if (goal === 'mild_gain') {
            carbPercentage = 0.55; // Adjusted for mild weight gain
            proteinPercentage = 0.20; // Adjusted for mild weight gain
            fatPercentage = 0.25; // Adjusted for mild weight gain
        } else if (goal === 'weight_gain') {
            carbPercentage = 0.60; // Adjusted for weight gain
            proteinPercentage = 0.20; // Adjusted for weight gain
            fatPercentage = 0.20; // Adjusted for weight gain
        }
    
        // Update state with results
        setResults({
            maintainWeight: Math.round(maintenanceCalories),
            mildWeightLoss: Math.round(mildWeightLossCalories),
            weightLoss: Math.round(weightLossCalories),
            mildWeightGain: Math.round(mildWeightGainCalories),
            weightGain: Math.round(weightGainCalories),
            carbs: Math.round(tdee * carbPercentage / 4), // 4 calories per gram of carbohydrates
            protein: Math.round(tdee * proteinPercentage / 4), // 4 calories per gram of protein
            fat: Math.round(tdee * fatPercentage / 9) // 9 calories per gram of fat
        });

        if (actionType === 'calories') {
            setCaloriesModalOpen(true);
        } else if (actionType === 'macros') {
            setMacronutrientsModalOpen(true);
        }
    };

    const updateCaloriesAndClose = async (calories) => {
        const updatedFormData = {
            ...formData,
            dailyCalories: calories, // Update dailyCalories with the selected value
        };
    
        try {
            const { error } = await supabase
                .from('users')
                .upsert([{ id: user.id, dailyValues: updatedFormData }]);
    
            if (error) throw error;
    
            setFormData(updatedFormData); // Update the component's state
            toast.success('Daily calories updated successfully');
            setModalOpen(false); // Assuming you have a modal open state
            setTimeout(() => {
                navigate('/dashboard');
            }, 1000); // Navigate after update
        } catch (error) {
            console.error('Error updating daily calories:', error);
            toast.error('Error updating daily calories');
        }
    };
    
    const updateMacrosAndClose = async (carbs, fat, protein) => {
        const updatedFormData = {
            ...formData,
            dailyCarbs: carbs,
            dailyFat: fat,
            dailyProtein: protein
        };
    
        try {
            const { error } = await supabase
                .from('users')
                .upsert([{ id: user.id, dailyValues: updatedFormData }]);
    
            if (error) throw error;
    
            setFormData(updatedFormData); // Update the component's state
            toast.success('Daily macronutrients updated successfully');
            setMacronutrientsModalOpen(false); // Assuming you have a modal open state
            setTimeout(() => {
                navigate('/dashboard');
            }, 1000); // Navigate after update
        } catch (error) {
            console.error('Error updating daily maconutrients:', error);
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
                    
                    <button 
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
                    </button>
                </form>
            </div>
            {/* Calories Modal */}
            {caloriesModalOpen && (
                <dialog id="my_modal_2" className="modal" open>
                    <div className="modal-box">
                        <h3 className="font-bold text-lg text-center">Calorie Calculation Results</h3>
                        {goal === 'maintain' && (
                            <button className="btn btn-primary w-full mb-2 text-white" onClick={() => updateCaloriesAndClose(results.maintainWeight)}>Maintain Weight: {results.maintainWeight} Calories/day</button>
                        )}
                        {goal === 'mild_loss' && (
                            <button className="btn btn-primary w-full mb-2 text-white" onClick={() => updateCaloriesAndClose(results.mildWeightLoss)}>Mild Weight Loss: {results.mildWeightLoss} Calories/day</button>
                        )}
                        {goal === 'weight_loss' && (
                            <button className="btn btn-primary w-full mb-2 text-white" onClick={() => updateCaloriesAndClose(results.weightLoss)}>Weight Loss: {results.weightLoss} Calories/day</button>
                        )}
                        {goal === 'mild_gain' && (
                            <button className="btn btn-primary w-full mb-2 text-white" onClick={() => updateCaloriesAndClose(results.mildWeightGain)}>Mild Weight Gain: {results.mildWeightGain} Calories/day</button>
                        )}
                        {goal === 'weight_gain' && (
                            <button className="btn btn-primary w-full mb-2 text-white" onClick={() => updateCaloriesAndClose(results.weightGain)}>Weight Gain: {results.weightGain} Calories/day</button>
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
        </div>
    );
}

export default CalorieCalc;
