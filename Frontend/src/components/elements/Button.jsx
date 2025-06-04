import React from 'react';

const Button = ({ onClick, children, icon: Icon, variant = 'primary', className = '' }) => {
    const baseStyle = "inline-flex items-center px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95";
    
    const variants = {
        primary: "bg-green-500 text-white hover:bg-green-600 hover:shadow-lg hover:shadow-green-500/20",
        secondary: "bg-gray-700 text-white hover:bg-gray-600 hover:shadow-lg hover:shadow-purple-500/20",
    };

    return (
        <button 
            onClick={onClick}
            className={`${baseStyle} ${variants[variant]} ${className}`}
        >
            {Icon && <Icon className="h-5 w-5 mr-2" />}
            {children}
        </button>
    );
};

export default Button; 