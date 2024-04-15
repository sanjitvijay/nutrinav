import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import supabaseClient  from '../supabaseClient';
import { useAuth } from '../context/AuthProvider';
import toast from 'react-hot-toast';


function UserInfo() {
    const navigate = useNavigate();
    const supabase = supabaseClient();
    const {user} = useAuth()
    const [formData, setFormData] = useState({
        dailyCalories: 2000,
        dailyProtein: 50,
        dailyCarbs: 275,
        dailyFat: 60
    })

    const { dailyCalories, dailyProtein, dailyCarbs, dailyFat } = formData;

    useEffect(() => {
        const fetchUser = async () => {
            //const { data: { user } } = await supabase.auth.getUser()
            const { data, error } = await supabase
                .from('users')
                .select('dailyValues')
                .eq('id', user.id)
            if (error) {
                console.log('Error:', error)
            } else if(data[0].dailyValues){
                setFormData(data[0].dailyValues)
                console.log(data[0].dailyValues)
            }
        }

        fetchUser()
    },[supabase])
    const onChange = e => {
        setFormData((prevState) => ({
            ...prevState, [e.target.id]: e.target.value
        }));
    }

    const isNumber = (value) =>{
        const number = Number(value)
        return typeof number === 'number' && isFinite(number)
    }

    const onSubmit = async (e) => {
        e.preventDefault(); 

        if (!isNumber(dailyCalories)) {
            toast.error("Daily Calories must be a number");
            return;
        }

        if (!isNumber(dailyFat)) {
            toast.error("Daily Fat must be a number");
            return;
        }
        if (!isNumber(dailyCarbs)) {
            toast.error("Daily Carbs must be a number");
            return;
        }
        if (!isNumber(dailyProtein)) {
            toast.error("Daily Protein must be a number");
            return;
        }
        if(dailyCalories < 1000){
            toast.error("Daily Calories must be greater than 1000 Cals")
            return
        }

        if(dailyCalories > 9999){
            toast.error("Daily Calories must be less than 9999 Cals")
            return
        }

        if(dailyFat < 10){
            toast.error("Daily Fat must be greater than 10g")
            return
        }

        if(dailyFat > 999){
            toast.error("Daily Fat must be less than 999g")
            return
        }

        if(dailyCarbs < 100){
            toast.error("Daily Carbs must be greater than 100g")
            return 
        }

        if(dailyCarbs > 999){
            toast.error("Daily Carbs must be less than 999g")
            return 
        }

        if(dailyProtein < 10){
            toast.error("Daily Protein must be greater than 10g")
            return
        }

        if(dailyProtein > 999){
            toast.error("Daily Protein must be less than 999g")
            return
        }


        const { data: { user } } = await supabase.auth.getUser()
        const { error } = await supabase
            .from('users')
            .upsert([{ id: user.id, dailyValues: formData }])
        if (error) {
            toast.error('Error updating user info');
            console.log('Error:', error)
        } else {
            toast.success('User info updated successfully');
            setTimeout(() => {navigate('/dashboard');}, 1000)
        }
        
    }

    return (
        <div className="flex justify-center items-center">
            <div className="card px-10 py-5 border-2 shadow-md">
                <div className='flex justify-between items-center'>   
                    <h1 className="text-3xl font-bold text-primary mb-5 text-center">Enter Your Target Nutrition Goals</h1>
                </div>
                <form onSubmit={onSubmit}>
                    <div className="form-control mb-5">
                        <span className="text-gray-500 mb-1">Daily Calories</span>
                        <label className="input input-bordered flex justify-between items-center gap-2">
                            <input 
                                type="text" 
                                id="dailyCalories" 
                                value={dailyCalories} 
                                onChange={onChange}  
                            />
                            <span className="text-gray-500 mb-1">Cals</span>
                        </label>
                    </div>

                    <div className="form-control mb-5">
                        <span className="text-gray-500 mb-1">Daily Carbs</span>
                        <label className="input input-bordered flex justify-between items-center gap-2">
                            <input 
                                type="text" 
                                id="dailyCarbs" 
                                value={dailyCarbs} 
                                onChange={onChange}  
                            />
                            <span className="text-gray-500 mb-1">g</span>
                        </label>
                    </div>

                    <div className="form-control mb-5">
                        <span className="text-gray-500 mb-1">Daily Fat</span>
                        <label className="input input-bordered flex justify-between items-center gap-2">
                            <input 
                                type="text" 
                                id="dailyFat" 
                                value={dailyFat} 
                                onChange={onChange}  
                            />
                            <span className="text-gray-500 mb-1">g</span>
                        </label>
                    </div>

                    <div className="form-control mb-5">
                        <span className="text-gray-500 mb-1">Daily Protein</span>
                        <label className="input input-bordered flex justify-between items-center gap-2">
                            <input 
                                type="text" 
                                id="dailyProtein" 
                                value={dailyProtein} 
                                onChange={onChange}  
                            />
                            <span className="text-gray-500 mb-1">g</span>
                        </label>
                    </div>

                    <button 
                        type="submit" 
                        className="btn btn-primary w-full mt-5 text-white"
                        onClick={onSubmit}
                    >
                        Set Goals
                    </button>
                </form>
            </div>
        </div>
    );
}

export default UserInfo;