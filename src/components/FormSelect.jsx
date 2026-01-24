import React from 'react';

const FormSelect = ({ 
    label, 
    value, 
    onChange, 
    options = [], 
    placeholder = 'Selecione uma opção',
    required = false,
    colSpan = '1',
    error = null,
    disabled = false,
}) => {
    return (
        <div className={`sm:col-span-${colSpan}`}>
            {label && (
                <label className="block text-gray-700 text-sm font-bold mb-2">
                    {label}
                    {required && <span className="text-red-500">*</span>}
                </label>
            )}
            <select
                value={value}
                onChange={onChange}
                required={required}
                disabled={disabled}
                className={`border rounded w-full p-2 mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent ${
                    error ? 'border-red-500' : 'border-gray-300'
                } ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
            >
                <option value="">{placeholder}</option>
                {options.map((option) => (
                    <option key={option.id || option.value} value={option.id || option.value}>
                        {option.label || option.name || option.faixa}
                    </option>
                ))}
            </select>
            {error && <p className="text-red-500 text-xs mb-2">{error}</p>}
        </div>
    );
};

export default FormSelect;
