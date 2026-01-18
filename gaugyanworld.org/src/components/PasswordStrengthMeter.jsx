import React, { useState } from 'react';
import { calculatePasswordStrength } from '../utils/validation';

/**
 * Password strength meter component
 */
const PasswordStrengthMeter = ({ password }) => {
    const { strength, score } = calculatePasswordStrength(password);

    const getColor = () => {
        switch (strength) {
            case 'weak':
                return '#ef4444'; // red
            case 'medium':
                return '#f59e0b'; // orange
            case 'strong':
                return '#10b981'; // green
            case 'very-strong':
                return '#059669'; // dark green
            default:
                return '#d1d5db'; // gray
        }
    };

    const getWidth = () => {
        return `${(score / 5) * 100}%`;
    };

    const requirements = [
        { label: 'At least 12 characters', met: password.length >= 12 },
        { label: 'Uppercase letter (A-Z)', met: /[A-Z]/.test(password) },
        { label: 'Lowercase letter (a-z)', met: /[a-z]/.test(password) },
        { label: 'Number (0-9)', met: /[0-9]/.test(password) },
        { label: 'Special character (!@#$%^&*)', met: /[^A-Za-z0-9]/.test(password) },
    ];

    if (!password) return null;

    return (
        <div className="password-strength-meter" style={{ marginTop: '8px' }}>
            {/* Strength bar */}
            <div
                style={{
                    width: '100%',
                    height: '6px',
                    backgroundColor: '#e5e7eb',
                    borderRadius: '3px',
                    overflow: 'hidden',
                }}
            >
                <div
                    style={{
                        width: getWidth(),
                        height: '100%',
                        backgroundColor: getColor(),
                        transition: 'all 0.3s ease',
                    }}
                />
            </div>

            {/* Strength label */}
            <div
                style={{
                    marginTop: '4px',
                    fontSize: '12px',
                    fontWeight: '500',
                    color: getColor(),
                    textTransform: 'capitalize',
                }}
            >
                {strength.replace('-', ' ')}
            </div>

            {/* Requirements checklist */}
            <div style={{ marginTop: '8px', fontSize: '12px' }}>
                {requirements.map((req, index) => (
                    <div
                        key={req.label}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            marginBottom: '4px',
                            color: req.met ? '#10b981' : '#6b7280',
                        }}
                    >
                        <span style={{ marginRight: '6px' }}>
                            {req.met ? '✓' : '○'}
                        </span>
                        <span>{req.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PasswordStrengthMeter;
