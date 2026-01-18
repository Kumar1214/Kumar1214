import React from 'react';

const Button = ({
    children,
    variant = 'primary',
    type = 'button',
    fullWidth = false,
    onClick,
    disabled = false,
    className = ''
}) => {
    const baseClass = 'btn';
    const variantClass = `btn-${variant}`;
    const widthClass = fullWidth ? 'w-full' : '';

    return (
        <button
            type={type}
            className={`${baseClass} ${variantClass} ${widthClass} ${className}`}
            onClick={onClick}
            disabled={disabled}
            style={{ opacity: disabled ? 0.7 : 1, cursor: disabled ? 'not-allowed' : 'pointer' }}
        >
            {children}
        </button>
    );
};

export default Button;
