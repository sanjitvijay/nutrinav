import supabaseClient from "../supabaseClient";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {format} from 'date-fns'
function Dashboard() {
    const supabase = supabaseClient()
    const navigate = useNavigate()
    const [calories, setCalories] = useState(null)
    const [caloriesRemaining, setCaloriesRemaining] = useState(null)

    const getDate = new Date()
    const [date, setDate] = useState('')
    const [year, setYear] = useState('')

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
        const day = format(getDate, 'MMMM do')
        const year = format(getDate, 'yyyy')
        setDate(day)
        setYear(year)
    }, [supabase, getDate])
    return (
        <div>
            <div className="flex justify-between items-center mb-10">
                <div className="avatar">
                    <div className="w-32 h-32 rounded-full">
                        <img src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
                    </div>
                </div>
                <div className="prose">
                    <h1 className="text-secondary text-5xl text-right"> {date}, <br/> {year} </h1>
                </div>
            </div>

            <div className="card border-2 p-3 mb-5">
                <h2 className="text-3xl font-bold mb-2 text-primary">Calories</h2>
                <div className="flex justify-between items-center">
                    <div className="radial-progress text-primary text-center" style={{"--value":(caloriesRemaining/2000) * 100, "--size" : "8rem"}} 
                        role="progressbar">
                        <div>
                            <span className="text-lg text-secondary font-bold">{caloriesRemaining}</span><br/>
                            <span className="text-xs ">remaining</span>
                        </div>
                        
                    </div>

                    <div className="mr-5">
                        <h2 className="text-2xl font-bold mb-2 text-primary">Goal:</h2>
                        <p className="text-xl font-bold text-left text-secondary">{2000} Cals</p>
                        <h2 className="text-2xl font-bold mb-2 text-primary">Food:</h2>
                        <p className="text-xl font-bold text-left text-secondary">{calories} Cals</p>
                    </div>
                </div>
            </div>

            <div className="card p-3 border-2">
                <h2 className="text-3xl font-bold mb-2 text-primary">Macros</h2>
                <div className="flex justify-between items-center">
                    <div className="radial-progress text-primary text-center" style={{"--value": 50, "--size" : "8rem"}} 
                        role="progressbar">
                        <div>
                            <span className="text-lg text-secondary font-bold">60g</span><br/>
                            <span className="text-xs ">Carbs</span>
                        </div>
                    </div>

                    <div className="radial-progress text-primary text-center border" style={{"--value":75, "--size" : "8rem"}} 
                        role="progressbar">
                        <div>
                            <span className="text-lg text-secondary font-bold">45g</span><br/>
                            <span className="text-xs ">Fat</span>
                        </div>
                    </div>

                    <div className="radial-progress text-primary text-center border-2" style={{"--value":30, "--size" : "8rem"}} 
                        role="progressbar">
                        <div>
                            <span className="text-lg text-secondary font-bold">20g</span><br/>
                            <span className="text-xs ">Protein</span>
                        </div>
                    </div>
                </div>
            </div>


        </div>
    );
}

export default Dashboard;