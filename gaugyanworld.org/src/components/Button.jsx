import React from 'react';
import PropTypes from 'prop-types';

/**
 * @typedef {Object} ButtonProps
 * @property {React.ReactNode} children
 * @property {'primary' | 'secondary' | 'danger' | 'ghost'} [variant]
 * @property {'button' | 'submit' | 'reset'} [type]
 * @property {boolean} [fullWidth]
 * @property {() => void} [onClick]
 * @property {boolean} [disabled]
 * @property {string} [className]
 * @property {React.CSSProperties} [style]
 */

/**
 * Reusable Button component
 * @param {ButtonProps & React.ButtonHTMLAttributes<HTMLButtonElement>} props
 */
const Button = ({
    children,
    variant = 'primary',
    type = 'button',
    fullWidth = false,
    onClick,
    disabled = false,
    className = '',
    style = {},
    ...props
}) => {
    const baseClass = 'btn';
    const variantClass = `btn-${variant}`;
    const widthClass = fullWidth ? 'w-full' : '';

    return (
        <button
            type={type}
            className={`${baseClass} ${variantClass} ${widthClass} ${className}`.trim()}
            onClick={onClick}
            disabled={disabled}
            style={{
                opacity: disabled ? 0.7 : 1,
                cursor: disabled ? 'not-allowed' : 'pointer',
                ...style
            }}
            {...props}
        >
            {children}
        </button>
    );
};

Button.propTypes = {
    children: PropTypes.node.isRequired,
    variant: PropTypes.string,
    type: PropTypes.oneOf(['button', 'submit', 'reset']),
    fullWidth: PropTypes.bool,
    onClick: PropTypes.func,
    disabled: PropTypes.bool,
    className: PropTypes.string,
    style: PropTypes.object
};

export default Button;
