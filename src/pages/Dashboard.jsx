import supabaseClient from "../supabaseClient";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
function Dashboard() {
    const supabase = supabaseClient()
    const navigate = useNavigate()

    const [calories, setCalories] = useState(null)
    const [caloriesRemaining, setCaloriesRemaining] = useState(null)

    useEffect(() => {
        const fetchCalories = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            const { data, error } = await supabase
                .from('users')
                .select('calories')
                .eq('id', user.id)
            if (error) {
                console.log('Error:', error)
            } else {
                setCalories(data[0].calories)
                setCaloriesRemaining(2000 - data[0].calories)
            }
        }

        fetchCalories()
    }, [supabase])
    return (
        <div className="flex justify-between items-center">
            <div>
                <h1 className="text-3xl font-bold"> Calories Consumed:</h1>
                <h2 className="text-2xl mb-10">{calories} Calories</h2>

                <h1 className="text-3xl font-bold"> Calories Remaining:</h1>
                <h2 className="text-2xl">{caloriesRemaining} Calories</h2>    
            </div>

            <div>
                <button 
                    className="bg-blue-500 hover:bg-blue-700 hover:shadow-lg text-white font-bold py-2 px-4 rounded mb-5"
                    onClick={()=>navigate('/add-food')}
                >
                    Add Food
                </button>
            </div>
        </div>
    );
}

export default Dashboard;