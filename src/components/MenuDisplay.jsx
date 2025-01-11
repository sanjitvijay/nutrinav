// MenuDisplay.jsx
import React from 'react';
import ItemCard from './ItemCard';

function MenuDisplay({ menu, time, searchQuery, filterCriteria }) {
    const filteredMenu = {};

    Object.keys(menu).forEach((subheader) => {
        let items = menu[subheader].filter((item) =>
            item.name.toLowerCase().includes(searchQuery.toLowerCase())
        );

        // Sort items based on filterCriteria
        if (filterCriteria && filterCriteria.nutrient) {
            items.sort((a, b) => {
                const aValue = Number(a.nutrition_facts[filterCriteria.nutrient]) || 0;
                const bValue = Number(b.nutrition_facts[filterCriteria.nutrient]) || 0;

                if (filterCriteria.order === 'asc') {
                    return aValue - bValue;
                } else {
                    return bValue - aValue;
                }
            });
        }

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
