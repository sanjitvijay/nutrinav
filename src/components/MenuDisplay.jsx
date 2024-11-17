// MenuDisplay.jsx
import React from 'react';
import ItemCard from './ItemCard';

function MenuDisplay({ menu, time, searchQuery }) {
    const filteredMenu = {};

    Object.keys(menu).forEach((subheader) => {
        const items = menu[subheader].filter((item) =>
            item.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        if (items.length > 0) {
            filteredMenu[subheader] = items;
        }
    });

    if (Object.keys(filteredMenu).length === 0) {
        return <p className="mt-4 text-gray-500">No items match your search.</p>;
    }

    return (
        <div>
            {Object.keys(filteredMenu).map((subheader) => (
                <div key={subheader}>
                    <h2 className="text-xl font-bold mt-4">{subheader}</h2>
                    <div className="grid grid-cols-1 gap-4">
                        {filteredMenu[subheader].map((item) => (
                            <ItemCard key={item.id} item={item} time={time} />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default MenuDisplay;
