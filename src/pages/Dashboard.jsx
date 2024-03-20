import supabaseClient from "../supabaseClient";
import { useEffect } from "react";
import { useState } from "react";
import ItemCard from "../components/ItemCard";
function Dashboard() {
    const supabase = supabaseClient();
    const [menu, setMenu] = useState([]);

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
            <button className="bg-blue-500 hover:bg-blue-700 hover:shadow-lg text-white font-bold py-2 px-4 rounded mb-5"
            onClick={fetchMenu}>Fetch Menu</button>
            <div className="grid grid-cols-3 gap-4">
                {menu.map((item) => (
                    <ItemCard key={item.id} item={item} />
                ))}
            </div>
        </div>
    );
}

export default Dashboard;