import supabaseClient from "../supabaseClient";
import { IoMdAddCircle } from "react-icons/io";
import { IoMdCheckmarkCircle } from "react-icons/io";
import { useState } from "react";
import { useUserInfo } from "../context/UserInfoProvider";
import { useAuth } from "../context/AuthProvider";
function ItemCard({item, time}) {
    const supabase = supabaseClient()

    const {name, nutrition_facts} = item 
    const {calories, total_fat, total_carbohydrate, protein} = nutrition_facts

    const { userInfo } = useUserInfo();
    const {dailyFat, dailyCarbs, dailyProtein, dailyCalories} = userInfo

    const [addLoading, setAddLoading] = useState(false)

    const {user} = useAuth()

    const updateValues = async () => {
        setAddLoading(true)
        //const {data: {user}} = await supabase.auth.getUser() 
        const userId = user.id
        if(userId !== null){
            const {data, error} = await supabase
            .from('users')
            .select('nutrition, log')
            .eq('id', userId)

            if(error){
                console.log(error)
            }
            else {
                let prev = data[0].nutrition
                for (let key in prev) {
                    prev[key] = String(Number(prev[key]) + Number(nutrition_facts[key]))
                }
                const { error } = await supabase
                    .from('users')
                    .upsert([{ id: userId, nutrition: prev }]);
                if (error) {
                    console.log(error);
                }
            }
            let prevLog = data[0].log
            let changed = false

            prevLog = prevLog.map(logItem => {
            if (logItem.name === name) {
                // Double the nutrition values of the matching logItem
                changed = true
                const changedNutritionFacts = Object.fromEntries(
                    Object.entries(logItem.nutrition_facts).map(([key, value]) => [key, String(Number(value) + Number(nutrition_facts[key]))])
                );
                const updatedServings = logItem.servings + 1;
                return { ...logItem, nutrition_facts: changedNutritionFacts, servings: updatedServings};
            } else {
                // Return the logItem unchanged
                return logItem;
            }
            });

            if(!changed){
                const servings = 1
                const logItem = {nutrition_facts, name, time , servings}
                prevLog.push(logItem)
            }
            
            try{
                await supabase
                .from('users')
                .upsert([{ id: userId, log: prevLog }]);
            } catch (error) {
                console.log(error)
            }
        }
        setAddLoading(false)
    }
    
    return (
        <div className="flex justify-between bg-white hover:shadow-md rounded-lg p-2 items-center border-2 cursor-pointer">
            <div className="w-full">
                <h2 className="font-bold text-primary mb-1">{name}</h2>
                

                <div className="flex justify-between">
                    <div>
                        <div className="radial-progress text-primary text-center" style={{"--value":((calories)/dailyCalories) * 100, "--size" : "3rem", "--thickness" : "4px", boxShadow: 'inset 0 0 0 4px #e5e7eb'}} 
                            role="progressbar">
                            <div>
                                <span className="text-lg text-secondary font-bold">{calories}</span>
                            </div>
                        </div>
                        <p className="text-center text-base-400 text-xs">Calories</p>
                    </div>
                    <div>
                        <div className="radial-progress text-primary text-center " style={{"--value": (total_carbohydrate/dailyCarbs) * 100, "--size" : "3rem", "--thickness" : "4px", boxShadow: 'inset 0 0 0 4px #e5e7eb'}} 
                            role="progressbar">
                            <div>
                                <span className="text-lg text-secondary font-bold">{total_carbohydrate}g</span>
                            </div>
                        </div>
                        <p className="text-center text-base-400 text-xs">Carbs</p>
                    </div>
                    <div>
                        <div className="radial-progress text-primary text-center " style={{"--value": (total_fat/dailyFat) * 100, "--size" : "3rem", "--thickness" : "4px", boxShadow: 'inset 0 0 0 4px #e5e7eb'}} 
                            role="progressbar">
                            <div>
                                <span className="text-lg text-secondary font-bold">{total_fat}g</span>
                            </div>
                        </div>
                        <p className="text-center text-base-400 text-xs">Fats</p>
                    </div>
                    <div className="mr-8">
                        <div className="radial-progress text-primary text-center " style={{"--value":(protein/dailyProtein) * 100, "--size" : "3rem", "--thickness" : "4px", boxShadow: 'inset 0 0 0 4px #e5e7eb'}} 
                            role="progressbar">
                            <div>
                                <span className="text-lg text-secondary font-bold">{protein}g</span>
                            </div>
                        </div>
                        <p className="text-center text-base-400 text-xs">Protein</p>
                    </div>
                </div>
            </div>
            <button 
                onClick={updateValues}
            >
                {addLoading ? 
                    (<IoMdCheckmarkCircle size={50} color="oklch(var(--s))"/>) : 
                    (<IoMdAddCircle size={50} color="oklch(var(--s))"/>)}
                
            </button>
        </div>
    );
}

export default ItemCard;