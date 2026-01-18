import React from 'react';
import Button from './Button';

const CTABanner = () => {
    return (
        <div style={{
            backgroundImage: 'linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(https://images.unsplash.com/photo-1505935428862-770b6f24f629?auto=format&fit=crop&q=80&w=1200)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--spacing-3xl)',
            textAlign: 'center',
            color: 'white',
            marginBottom: 'var(--spacing-3xl)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '300px'
        }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: 'var(--spacing-md)', fontWeight: 700 }}>
                Support Our Gaushalas
            </h2>
            <p style={{ fontSize: '1.2rem', marginBottom: 'var(--spacing-xl)', maxWidth: '700px', opacity: 0.9 }}>
                Every purchase directly contributes to the welfare of cows. Buy pure, organic products and make a difference today.
            </p>
            <Button size="lg" style={{ backgroundColor: '#10B981', border: 'none' }}>
                Shop for a Cause
            </Button>
        </div>
    );
};

export default CTABanner;
