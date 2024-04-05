import supabaseClient from "../supabaseClient";
import { IoMdAddCircle } from "react-icons/io";
import { IoMdCheckmarkCircle } from "react-icons/io";
import { useState } from "react";
function ItemCard({item}) {
    const supabase = supabaseClient()

    const {name, nutrition_facts} = item 
    const {calories, total_fat, total_carbohydrate, protein} = nutrition_facts

    const [addLoading, setAddLoading] = useState(false)

    const updateValues = async () => {
        setAddLoading(true)
        const {data: {user}} = await supabase.auth.getUser() 
        const userId = user.id
        if(userId !== null){
            const {data, error} = await supabase
            .from('users')
            .select('nutrition')
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
        }
        setAddLoading(false)
    }


    
    return (
        <div className="flex justify-between bg-white hover:shadow-md rounded-lg p-2 items-center border-2 cursor-pointer">
            <div className="w-full">
                <h2 className="font-bold text-primary mb-1">{name}</h2>
                

                <div className="flex justify-between">
                    <div>
                        <div className="radial-progress text-primary text-center" style={{"--value":((calories)/2000) * 100, "--size" : "3rem", "--thickness" : "4px", boxShadow: 'inset 0 0 0 4px #e5e7eb'}} 
                            role="progressbar">
                            <div>
                                <span className="text-lg text-secondary font-bold">{calories}</span>
                            </div>
                        </div>
                        <p className="text-center text-base-400 text-xs">Calories</p>
                    </div>
                    <div>
                        <div className="radial-progress text-primary text-center " style={{"--value": (total_carbohydrate/275) * 100, "--size" : "3rem", "--thickness" : "4px", boxShadow: 'inset 0 0 0 4px #e5e7eb'}} 
                            role="progressbar">
                            <div>
                                <span className="text-lg text-secondary font-bold">{total_carbohydrate}g</span>
                            </div>
                        </div>
                        <p className="text-center text-base-400 text-xs">Carbs</p>
                    </div>
                    <div>
                        <div className="radial-progress text-primary text-center " style={{"--value": (total_carbohydrate/275) * 100, "--size" : "3rem", "--thickness" : "4px", boxShadow: 'inset 0 0 0 4px #e5e7eb'}} 
                            role="progressbar">
                            <div>
                                <span className="text-lg text-secondary font-bold">{total_fat}g</span>
                            </div>
                        </div>
                        <p className="text-center text-base-400 text-xs">Fats</p>
                    </div>
                    <div className="mr-8">
                        <div className="radial-progress text-primary text-center " style={{"--value":(protein/50) * 100, "--size" : "3rem", "--thickness" : "4px", boxShadow: 'inset 0 0 0 4px #e5e7eb'}} 
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