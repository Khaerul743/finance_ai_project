import React from 'react';

const Select = ({ value, onChange, options, className = '' }) => {
    return (
        <select
            value={value}
            onChange={onChange}
            className={`bg-gray-800 text-white rounded-lg px-4 py-2 border border-gray-700 
                     focus:outline-none focus:border-green-500 transition-colors duration-300 ${className}`}
        >
            {options.map((option) => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
    );
};

export default Select; 