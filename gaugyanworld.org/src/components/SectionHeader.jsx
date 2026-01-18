import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const SectionHeader = ({ title, linkTo, linkText = "View All" }) => {
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 'var(--spacing-lg)',
            marginTop: 'var(--spacing-2xl)'
        }}>
            <h2 style={{
                fontSize: '1.5rem',
                color: 'var(--color-text-main)',
                position: 'relative',
                paddingLeft: '1rem'
            }}>
                <span style={{
                    position: 'absolute',
                    left: 0,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '4px',
                    height: '24px',
                    backgroundColor: 'var(--color-primary)',
                    borderRadius: '2px'
                }}></span>
                {title}
            </h2>

            {linkTo && (
                <Link to={linkTo} style={{
                    display: 'flex',
                    alignItems: 'center',
                    color: 'var(--color-primary)',
                    fontWeight: 600,
                    fontSize: '0.9rem'
                }}>
                    {linkText} <ChevronRight size={16} />
                </Link>
            )}
        </div>
    );
};

export default SectionHeader;
