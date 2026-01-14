import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const FormModal = ({
    isOpen,
    onClose,
    title,
    children,
    fields,
    initialData,
    onSubmit,
    isLoading = false,
    submitText = 'Submit',
    cancelText = 'Cancel'
}) => {
    const [formData, setFormData] = useState(initialData || {});

    useEffect(() => {
        if (isOpen) {
            setFormData(initialData || {});
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (onSubmit) {
            onSubmit(formData);
        }
    };

    const handleChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const renderField = (field) => {
        const { name, label, type, required, options, placeholder } = field;
        const value = formData[name] || '';

        const inputStyle = {
            width: '100%',
            padding: '8px 12px',
            border: '1px solid #D1D5DB',
            borderRadius: '4px',
            fontSize: '14px'
        };

        switch (type) {
            case 'textarea':
                return (
                    <textarea
                        value={value}
                        onChange={(e) => handleChange(name, e.target.value)}
                        placeholder={placeholder || label}
                        required={required}
                        style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
                    />
                );

            case 'select':
                return (
                    <select
                        value={value}
                        onChange={(e) => handleChange(name, e.target.value)}
                        required={required}
                        style={inputStyle}
                    >
                        <option value="">Select {label}</option>
                        {options?.map((opt, idx) => (
                            <option key={idx} value={opt}>{opt}</option>
                        ))}
                    </select>
                );

            case 'image':
            case 'file':
                return (
                    <div>
                        <input
                            type="text"
                            value={value}
                            onChange={(e) => handleChange(name, e.target.value)}
                            placeholder={placeholder || `Enter ${label} URL`}
                            style={inputStyle}
                        />
                        {value && type === 'image' && (
                            <img
                                src={value}
                                alt="Preview"
                                style={{ marginTop: '8px', maxWidth: '200px', maxHeight: '200px', borderRadius: '4px' }}
                            />
                        )}
                    </div>
                );

            default:
                return (
                    <input
                        type={type || 'text'}
                        value={value}
                        onChange={(e) => handleChange(name, e.target.value)}
                        placeholder={placeholder || label}
                        required={required}
                        style={inputStyle}
                    />
                );
        }
    };

    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0,0,0,0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
                padding: '20px'
            }}
            onClick={onClose}
        >
            <div
                className="card"
                style={{
                    width: '100%',
                    maxWidth: '600px',
                    padding: '24px',
                    maxHeight: '90vh',
                    overflowY: 'auto',
                    position: 'relative'
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h3 style={{ margin: 0 }}>{title}</h3>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            color: '#6B7280'
                        }}
                    >
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '16px' }}>
                    {/* Render fields if provided */}
                    {fields && fields.map((field, index) => (
                        <div key={index} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            <label style={{ fontSize: '14px', fontWeight: 500, color: '#374151' }}>
                                {field.label}
                                {field.required && <span style={{ color: 'red' }}> *</span>}
                            </label>
                            {renderField(field)}
                        </div>
                    ))}

                    {/* Render children if provided (for custom forms) */}
                    {children}

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #E5E7EB' }}>
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isLoading}
                            style={{
                                padding: '8px 16px',
                                border: '1px solid #D1D5DB',
                                borderRadius: '4px',
                                background: 'white',
                                cursor: isLoading ? 'not-allowed' : 'pointer',
                                opacity: isLoading ? 0.6 : 1
                            }}
                        >
                            {cancelText}
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            style={{
                                padding: '8px 16px',
                                backgroundColor: isLoading ? '#9CA3AF' : 'var(--color-primary)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: isLoading ? 'not-allowed' : 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}
                        >
                            {isLoading && <span>⏳</span>}
                            {submitText}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default FormModal;
