import React from 'react';

const FormGrid = ({ 
    children, 
    cols = { base: 1, sm: 2, md: 3, lg: 3 },
    gap = 4,
}) => {
    const gridClass = `grid gap-${gap} grid-cols-${cols.base} sm:grid-cols-${cols.sm} md:grid-cols-${cols.md} lg:grid-cols-${cols.lg}`;
    
    // Tailwind não permite classes dinâmicas, então usamos inline styles quando necessário
    const style = {
        display: 'grid',
        gridTemplateColumns: `repeat(auto-fit, minmax(250px, 1fr))`,
        gap: `${gap * 4}px`,
    };

    return (
        <div className={gridClass} style={style}>
            {children}
        </div>
    );
};

export default FormGrid;
