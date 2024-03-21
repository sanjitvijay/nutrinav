import supabaseClient from "../supabaseClient";

function ItemCard({item}) {
    const supabase = supabaseClient()

    const {name, nutrition_facts} = item 
    const {Calories} = nutrition_facts

    const updateUserValues = async () => {
        const { data: { user } } = await supabase.auth.getUser()
        const userId = user.id
        console.log(user.id)
        if(userId !== null){
            const {data, error} = await supabase.rpc('increment_column', {
                column_name: 'calories',
                id: userId,
                increment_value: Calories,
            })
            if(error){
                console.log('Error:', error)
            } else {
                console.log('Data:', data)
                console.log("Successfully updated user values")
                
            }
        }
    }
    return (
        <div className="flex justify-between bg-white hover:shadow-md  rounded-lg p-4 items-center border-2">
            <div>
                <h2 className="font-bold">{name}</h2>
                <h2>Calories: {Calories}</h2>
            </div>
            <button 
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={updateUserValues}
            >
                Add
            </button>
        </div>
    );
}

export default ItemCard;