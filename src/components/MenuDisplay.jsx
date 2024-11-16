import React from 'react';
import ItemCard from './ItemCard';

function MenuDisplay({ menu, time }) {
  return (
    <div>
      {Object.keys(menu).map((subheader) => (
        <div key={subheader}>
          <h2 className="text-xl font-bold mt-4">{subheader}</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {menu[subheader].map((item) => (
              <ItemCard key={item.id} item={item} time={time} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default MenuDisplay;