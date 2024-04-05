import React, { useState } from 'react';
import ToggleIcon from './ToggleIcon';
const CustomDropdown = ({ options, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState(options[0]);

    const handleSelect = (option) => {
        setSelectedOption(option);
        setIsOpen(false);
        onChange(option);
    };

    return (
        <div className="relative inline-block text-left w-48">
            <div>
                <button type="button" className="inline-flex items-center justify-center w-full px-4 py-2 bg-white font-medium text-gray-700 border-2 rounded-lg" id="options-menu" aria-haspopup="true" aria-expanded="true" onClick={() => setIsOpen(!isOpen)}>
                    <h3 className='font-bold text-xl text-secondary'>{selectedOption}</h3>
                    <ToggleIcon toggle={isOpen}/>
                    
                </button>
            </div>

            {isOpen && (
                <div className="origin-top-right absolute left-1/2 transform -translate-x-1/2 card bg-white border-2 w-full mt-2 py-2 z-10">
                    <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                        {options.map((option, index) => (
                            <button key={index} onClick={() => handleSelect(option)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full hover:text-gray-900" role="menuitem">{option}</button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomDropdown;