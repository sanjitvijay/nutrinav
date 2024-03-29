import supabaseClient from "../supabaseClient";

function ItemCard({item}) {
    const supabase = supabaseClient()

    const {name, nutrition_facts} = item 
    const {calories} = nutrition_facts

    const updateUserValues = async () => {
        const { data: { user } } = await supabase.auth.getUser()
        const userId = user.id
        if(userId !== null){
            const {error} = await supabase.rpc('increment_column', {
                column_name: 'calories',
                id: userId,
                increment_value: calories,
            })
            if(error){
                console.log('Error:', error)
            } 
        }
    }
    return (
        <div className="flex justify-between bg-white hover:shadow-md  rounded-lg p-4 items-center border-2">
            <div>
                <h2 className="font-bold">{name}</h2>
                <h2>Calories: {calories}</h2>
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