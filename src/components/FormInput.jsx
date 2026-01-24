import React from 'react';

const FormInput = ({ 
    label, 
    value, 
    onChange, 
    type = 'text', 
    placeholder = '', 
    required = false,
    colSpan = '1',
    error = null,
    disabled = false,
    maxLength = null,
}) => {
    return (
        <div className={`sm:col-span-${colSpan}`}>
            {label && (
                <label className="block text-gray-700 text-sm font-bold mb-2">
                    {label}
                    {required && <span className="text-red-500">*</span>}
                </label>
            )}
            <input
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                disabled={disabled}
                maxLength={maxLength}
                className={`border rounded w-full p-2 mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent ${
                    error ? 'border-red-500' : 'border-gray-300'
                } ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
            />
            {error && <p className="text-red-500 text-xs mb-2">{error}</p>}
        </div>
    );
};

export default FormInput;
