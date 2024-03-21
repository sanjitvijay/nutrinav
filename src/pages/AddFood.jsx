import supabaseClient from "../supabaseClient";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ItemCard from "../components/ItemCard";
function AddFood() {
    const supabase = supabaseClient()
    const navigate = useNavigate()

    const [menu, setMenu] = useState([])
    const [diningHall, setDiningHall] = useState('Bursley')

    const fetchMenu = async () => {
        const { data, error } = await supabase
            .from(diningHall)
            .select('*')
        if (error) {
            console.log('Error:', error)
        } else {
            setMenu(data)
        }
    }

    const onChange = (e) => {
        setDiningHall(e.target.value)
    }
    return (
        <div>
            <div className="flex justify-between items-center">
                
                <div>
                    <select 
                        className="mr-5"
                        onChange={onChange}>
                        <option value="Bursley">Bursley</option>
                        <option value="East Quad">East Quad</option>
                        <option value="Markley">Markely</option>
                        <option value="Mosher-Jordan">Mosher-Jordan</option>
                        <option value="North Quad">North Quad</option>
                        <option value="South Quad">South Quad</option>
                        <option value="Twigs at Oxford">Twigs at Oxford</option>
                    </select>

                    <button 
                        className="bg-blue-500 hover:bg-blue-700 hover:shadow-lg text-white font-bold py-2 px-4 rounded mb-5"
                        onClick={fetchMenu}
                    >
                        Fetch Menu
                    </button>
                </div>

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