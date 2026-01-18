import React from 'react';
import Button from './Button';

const HeroSection = () => {
    return (
        <section style={{
            backgroundColor: '#FFF7ED', // Light orange/cream background
            color: 'var(--color-text-main)',
            padding: 'var(--spacing-2xl) 0',
            position: 'relative',
            overflow: 'hidden'
        }}>
            <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', zIndex: 1 }}>
                <div style={{ maxWidth: '500px' }}>
                    <span style={{
                        color: 'var(--color-primary)',
                        fontWeight: 600,
                        letterSpacing: '0.05em',
                        display: 'block',
                        marginBottom: 'var(--spacing-sm)'
                    }}>
                        PURE & AUTHENTIC
                    </span>
                    <h1 style={{
                        fontSize: '3.5rem',
                        lineHeight: 1.1,
                        marginBottom: 'var(--spacing-md)',
                        fontWeight: 800,
                        color: '#431407' // Dark brown for contrast
                    }}>
                        Organic A2 Ghee.
                    </h1>
                    <p style={{
                        fontSize: '1.25rem',
                        color: '#78350F',
                        marginBottom: 'var(--spacing-xl)'
                    }}>
                        Experience the purity of traditional Bilona method.
                    </p>
                    <Button variant="primary" style={{ padding: '1rem 2.5rem' }}>
                        Shop Now
                    </Button>
                </div>

                {/* Placeholder for Hero Image */}
                <div className="hidden-mobile" style={{
                    width: '400px',
                    height: '400px',
                    background: 'radial-gradient(circle, #FED7AA 0%, transparent 70%)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <img
                        src="https://images.unsplash.com/photo-1631451095765-2c91616fc9e6?auto=format&fit=crop&q=80&w=800"
                        alt="Organic Ghee"
                        style={{ width: '90%', filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.15))', borderRadius: '20px' }}
                    />
                </div>
            </div>

            {/* Background Decorative Elements */}
            <div style={{
                position: 'absolute',
                top: '-10%',
                right: '-5%',
                width: '600px',
                height: '600px',
                background: 'radial-gradient(circle, rgba(255,107,0,0.05) 0%, transparent 70%)',
                borderRadius: '50%',
                zIndex: 0
            }}></div>
        </section>
    );
};

export default HeroSection;
