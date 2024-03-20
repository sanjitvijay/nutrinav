import supabaseClient from "../supabaseClient";

function ItemCard({item}) {
    const supabase = supabaseClient()

    const {name, nutrition_facts} = item 
    const {Calories} = nutrition_facts
    return (
        <div className="flex justify-between bg-white shadow-md  rounded-lg p-4 items-center">
            <div>
                <h2 className="font-bold">{name}</h2>
                <h2>Calories: {Calories}</h2>
            </div>
           <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
               Add
           </button>
        </div>
    );
}

export default ItemCard;