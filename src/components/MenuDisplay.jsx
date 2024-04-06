import ItemCard from "./ItemCard"

function MenuDisplay({menu, time}){
    return(
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {menu.map((item) => (
            <ItemCard key={item.name} item={item} time={time}/>
        ))}
        </div>
    );
    
}

export default MenuDisplay