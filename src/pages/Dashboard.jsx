import supabaseClient from "../supabaseClient";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {format, set} from 'date-fns'
import { useAuth } from "../context/AuthProvider";
function Dashboard() {
    const supabase = supabaseClient()
    const navigate = useNavigate()

    const [userData, setUserData]= useState({})
    const {calories, total_fat, total_carbohydrate, protein} = userData
    const [loading, setLoading] = useState(true)

    
    const [day, setDay] = useState('')
    const [date, setDate] = useState('')

    const [userName, setUserName] = useState('')

    useEffect(() => {
        const fetchUserData = async () => {
            setLoading(true)
            const { data: { user } } = await supabase.auth.getUser()
            const { data, error } = await supabase
                .from('users')
                .select('*')
                .eq('id', user.id)
            if (error) {
                console.log('Error:', error)
            } else {
                setUserData(data[0].nutrition)
                setUserName(data[0].username.toUpperCase())
            }
            setTimeout(() => {setLoading(false)}, 500)
        }

        
        fetchUserData()
        const getDate = new Date()
        const day = format(getDate, 'EEEE')
        const date = format(getDate, 'MMMM do')
        setDay(day)
        setDate(date)
    }, [supabase])

    return (
        <div>
            <div className="flex justify-between items-center mb-5">
            {loading ? (<div className="skeleton h-24 w-24 rounded-full"/>) :
                <div className="avatar placeholder ">
                    <div className="bg-base-200 rounded-full w-24 border-2 border-primary shadow-lg items-center flex justify-center">
                        <span className="text-5xl font-bold text-secondary">{userName[0]}</span>
                    </div>
                </div> 
            }
            <div className="prose">
                    <h1 className="text-secondary text-4xl text-right"> {day}, <br/> {date} </h1>
                </div>
            </div>


            <div className="card border-2 p-2 mb-5 shadow-lg">
                {loading ? (<div className="skeleton h-48 w-full"></div>) : 
                (   
                    <>
                        <h2 className="text-3xl font-bold mb-2 text-primary">Calories</h2>
                        <div className="flex justify-between items-center">
                            <div className="radial-progress text-primary text-center" style={{"--value":((2000-calories)/2000) * 100, "--size" : "8rem", "--thickness" : "12px", boxShadow: 'inset 0 0 0 12px #e5e7eb'}} 
                                role="progressbar">
                                <div>
                                    <span className="text-lg text-secondary font-bold">{2000-calories}</span><br/>
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
                    </>
                )}
                
            </div>

            <div className="card p-2 border-2 mb-5 shadow-lg">
                {loading ? (<div className="skeleton h-32 w-full"></div>) : (
                    <>
                    <h2 className="text-3xl font-bold mb-2 text-primary">Macros</h2>
                    <div className="flex justify-between items-center">
                        <div className="flex flex-col justify-center">
                            <div className="radial-progress text-primary text-center" style={{"--value": (total_carbohydrate/275) * 100,"--size" : "6rem", "--thickness" : "8px", boxShadow: 'inset 0 0 0 8px #e5e7eb'}} 
                                role="progressbar">
                                <div>
                                    <span className="text-lg text-secondary font-bold">{total_carbohydrate}g</span><br/>
                                    <span className="text-xs ">Carbs</span>
                                </div>
                            </div>
                            <p className="text-center text-base-400 text-xs mt-2">275g total</p>
                        </div>
                        
    
                        <div>
                            <div className="radial-progress text-primary text-center border-2" style={{"--value":(total_fat/78) * 100, "--size" : "6rem", "--thickness" : "8px", boxShadow: 'inset 0 0 0 8px #e5e7eb'}} 
                                role="progressbar">
                                <div>
                                    <span className="text-lg text-secondary font-bold">{total_fat}g</span><br/>
                                    <span className="text-xs ">Fat</span>
                                </div>
                            </div>
                            <p className="text-center text-base-400 text-xs mt-2">78g total</p>
                        </div>
                        
    
                        <div>
                            <div className="radial-progress text-primary text-center " style={{"--value":(protein/50) * 100, "--size" : "6rem", "--thickness" : "8px", boxShadow: 'inset 0 0 0 8px #e5e7eb'}} 
                                role="progressbar">
                                <div>
                                    <span className="text-lg text-secondary font-bold">{protein}g</span><br/>
                                    <span className="text-xs ">Protein</span>
                                </div>
                            </div>
                            <p className="text-center text-base-400 text-xs mt-2">50g total</p>
                        </div>
                        
                    </div>
                    </>
                )}
                
            </div>
        </div>
    );
}

export default Dashboard;