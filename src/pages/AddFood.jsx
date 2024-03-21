import supabaseClient from "../supabaseClient";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ItemCard from "../components/ItemCard";
function AddFood() {
    const supabase = supabaseClient()
    const navigate = useNavigate()

    const [menu, setMenu] = useState([])

    const fetchMenu = async () => {
        const { data, error } = await supabase
            .from('Bursley')
            .select('*')
        if (error) {
            console.log('Error:', error)
        } else {
            setMenu(data)
        }
    }
    return (
        <div>
            <div className="flex justify-between items-center">
                <button 
                    className="bg-blue-500 hover:bg-blue-700 hover:shadow-lg text-white font-bold py-2 px-4 rounded mb-5"
                    onClick={fetchMenu}
                >
                    Fetch Menu
                </button>

                <button 
                    className="bg-blue-500 hover:bg-blue-700 hover:shadow-lg text-white font-bold py-2 px-4 rounded mb-5"
                    onClick={()=>navigate('/dashboard')}
                >
                    Back to Dashboard
                </button>
                
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {menu.map((item) => (
                    <ItemCard key={item.name} item={item} />
                ))}
            </div>
        </div>
    );
}

export default AddFood;