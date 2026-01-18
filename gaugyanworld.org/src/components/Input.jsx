import React from 'react';

const Input = ({
    label,
    type = 'text',
    id,
    name,
    placeholder,
    value,
    onChange,
    required = false,
    error
}) => {
    return (
        <div className="input-group">
            {label && (
                <label htmlFor={id} className="label">
                    {label} {required && <span style={{ color: 'red' }}>*</span>}
                </label>
            )}
            <input
                type={type}
                id={id}
                name={name}
                className="input"
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                required={required}
                style={{ borderColor: error ? 'red' : undefined }}
            />
            {error && <p style={{ color: 'red', fontSize: '0.875rem', marginTop: '0.25rem' }}>{error}</p>}
        </div>
    );
};

export default Input;
