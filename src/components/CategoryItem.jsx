import React from 'react';
import { Link } from 'react-router-dom';

const CategoryItem = ({ image, label, to }) => {
    return (
        <Link to={to} style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 'var(--spacing-sm)',
            minWidth: '100px'
        }}>
            <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                overflow: 'hidden',
                border: '2px solid transparent',
                transition: 'border-color 0.2s',
                backgroundColor: '#f3f4f6'
            }}
                className="category-image-container"
            >
                <img
                    src={image}
                    alt={label}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
            </div>
            <span style={{
                fontSize: '0.9rem',
                fontWeight: 500,
                color: 'var(--color-text-main)',
                textAlign: 'center'
            }}>
                {label}
            </span>
            <style>{`
        .category-image-container:hover {
          border-color: var(--color-primary) !important;
        }
      `}</style>
        </Link>
    );
};

export default CategoryItem;
