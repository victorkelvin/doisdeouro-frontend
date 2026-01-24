import React from 'react';

const FormToggle = ({ 
    label, 
    value, 
    onChange, 
    required = false,
    colSpan = '1',
    disabled = false,
    description = null,
}) => {
    return (
        <div className={`sm:col-span-${colSpan} flex items-center`}>
            <div className="flex items-center h-full">
                <input
                    type="checkbox"
                    checked={value === true || value === 'true'}
                    onChange={(e) => onChange(e.target.checked)}
                    disabled={disabled}
                    className={`rounded w-4 h-4 focus:outline-none focus:ring-2 focus:ring-indigo-300 ${
                        disabled ? 'cursor-not-allowed' : 'cursor-pointer'
                    }`}
                />
                {label && (
                    <label className={`ml-2 text-gray-700 text-sm font-bold ${
                        disabled ? 'cursor-not-allowed' : 'cursor-pointer'
                    }`}>
                        {label}
                        {required && <span className="text-red-500">*</span>}
                    </label>
                )}
            </div>
            {description && <p className="text-gray-500 text-xs ml-6">{description}</p>}
        </div>
    );
};

export default FormToggle;
