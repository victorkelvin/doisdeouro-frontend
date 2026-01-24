import React from 'react';

const ConditionalField = ({ 
    show = false, 
    children,
    className = '',
}) => {
    if (!show) return null;

    return (
        <div className={`mb-3 ${className}`}>
            {children}
        </div>
    );
};

export default ConditionalField;
