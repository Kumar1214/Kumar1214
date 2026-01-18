import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Button from './Button';

const SLIDES = [
    {
        id: 1,
        image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&q=80&w=1200',
        title: 'Pure & Organic Desi Cow Products',
        subtitle: 'Experience the goodness of A2 Ghee, Panchgavya, and more.',
        cta: 'Shop Now'
    },
    {
        id: 2,
        image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=1200',
        title: 'Spiritual Books & Literature',
        subtitle: 'Enlighten your mind with our collection of Vedic texts.',
        cta: 'Explore Books'
    },
    {
        id: 3,
        image: 'https://images.unsplash.com/photo-1599447421405-0c30789ab87f?auto=format&fit=crop&q=80&w=1200',
        title: 'Yoga Essentials',
        subtitle: 'Premium mats and accessories for your daily practice.',
        cta: 'View Collection'
    }
];

const ShopSlider = () => {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent(prev => (prev + 1) % SLIDES.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    const nextSlide = () => setCurrent(prev => (prev + 1) % SLIDES.length);
    const prevSlide = () => setCurrent(prev => (prev - 1 + SLIDES.length) % SLIDES.length);

    return (
        <div style={{ position: 'relative', height: '400px', overflow: 'hidden', borderRadius: 'var(--radius-lg)', marginBottom: 'var(--spacing-2xl)' }}>
            {SLIDES.map((slide, index) => (
                <div
                    key={slide.id}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        opacity: index === current ? 1 : 0,
                        transition: 'opacity 0.5s ease-in-out',
                        backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${slide.image})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center',
                        color: 'white'
                    }}
                >
                    <div className="container">
                        <h2 style={{ fontSize: '3rem', marginBottom: 'var(--spacing-md)', fontWeight: 700 }}>{slide.title}</h2>
                        <p style={{ fontSize: '1.25rem', marginBottom: 'var(--spacing-xl)', maxWidth: '600px', margin: '0 auto var(--spacing-xl)' }}>{slide.subtitle}</p>
                        <Button size="lg" style={{ backgroundColor: 'var(--color-primary)', border: 'none' }}>{slide.cta}</Button>
                    </div>
                </div>
            ))}

            <button onClick={prevSlide} style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%', padding: '10px', cursor: 'pointer', color: 'white' }}>
                <ChevronLeft size={32} />
            </button>
            <button onClick={nextSlide} style={{ position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%', padding: '10px', cursor: 'pointer', color: 'white' }}>
                <ChevronRight size={32} />
            </button>

            <div style={{ position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '10px' }}>
                {SLIDES.map((_, index) => (
                    <button
                        key={`dot-${index}`}
                        onClick={() => setCurrent(index)}
                        style={{
                            width: '12px',
                            height: '12px',
                            borderRadius: '50%',
                            border: 'none',
                            backgroundColor: index === current ? 'white' : 'rgba(255,255,255,0.5)',
                            cursor: 'pointer'
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

export default ShopSlider;
