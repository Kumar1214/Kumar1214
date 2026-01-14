import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Button from './Button';
import { useData } from '../context/useData';

const HeroSlider = () => {
    const { banners } = useData();
    const [currentSlide, setCurrentSlide] = useState(0);

    // Filter sliders for home page top
    const slides = (banners || []).filter(banner =>
        banner.isActive && (banner.placement === 'home-top' || banner.page === 'home-top')
    ).sort((a, b) => (a.order || 0) - (b.order || 0));

    useEffect(() => {
        if (slides.length > 1) {
            const timer = setInterval(() => {
                setCurrentSlide((prev) => (prev + 1) % slides.length);
            }, 5000);
            return () => clearInterval(timer);
        }
    }, [slides.length]);

    const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
    const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

    if (!slides || slides.length === 0) return null;

    return (
        <div style={{ position: 'relative', overflow: 'hidden', height: '500px', borderRadius: 'var(--radius-lg)' }}>
            {slides.map((slide, index) => {
                const imageUrl = slide.imageUrl || slide.image;
                return (
                    <div
                        key={slide.id || slide.id}
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            opacity: index === currentSlide ? 1 : 0,
                            transition: 'opacity 0.8s ease-in-out',
                            zIndex: index === currentSlide ? 10 : 1,
                            background: imageUrl ? `linear-gradient(to right, rgba(0,0,0,0.7), rgba(0,0,0,0.3)), url(${imageUrl})` : '#1E3A8A',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            display: 'flex',
                            alignItems: 'center'
                        }}
                    >
                        <div className="container">
                            <div style={{ maxWidth: '600px', color: 'white', padding: '20px' }}>
                                <h1 style={{
                                    fontSize: '3.5rem',
                                    fontWeight: 800,
                                    marginBottom: '1rem',
                                    lineHeight: 1.2,
                                    textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                                }}>
                                    {slide.title || ''}
                                </h1>
                                <p style={{
                                    fontSize: '1.25rem',
                                    marginBottom: '2rem',
                                    opacity: 0.9,
                                    textShadow: '0 1px 2px rgba(0,0,0,0.3)'
                                }}>
                                    {slide.description || ''}
                                </p>
                                {slide.buttonText && (
                                    <Button
                                        variant="primary"
                                        size="lg"
                                        onClick={() => window.location.href = slide.linkUrl || '#'}
                                    >
                                        {slide.buttonText}
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                )
            })}

            {/* Navigation Buttons */}
            {slides.length > 1 && (
                <>
                    <button
                        onClick={prevSlide}
                        style={{
                            position: 'absolute',
                            left: '20px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            zIndex: 20,
                            backgroundColor: 'rgba(255,255,255,0.2)',
                            border: 'none',
                            borderRadius: '50%',
                            width: '48px',
                            height: '48px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            color: 'white',
                            backdropFilter: 'blur(4px)',
                            transition: 'background-color 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.4)'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)'}
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <button
                        onClick={nextSlide}
                        style={{
                            position: 'absolute',
                            right: '20px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            zIndex: 20,
                            backgroundColor: 'rgba(255,255,255,0.2)',
                            border: 'none',
                            borderRadius: '50%',
                            width: '48px',
                            height: '48px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            color: 'white',
                            backdropFilter: 'blur(4px)',
                            transition: 'background-color 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.4)'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)'}
                    >
                        <ChevronRight size={24} />
                    </button>
                </>
            )}

            {/* Dots */}
            {slides.length > 1 && (
                <div style={{
                    position: 'absolute',
                    bottom: '20px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 20,
                    display: 'flex',
                    gap: '8px'
                }}>
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentSlide(index)}
                            style={{
                                width: '10px',
                                height: '10px',
                                borderRadius: '50%',
                                border: 'none',
                                backgroundColor: index === currentSlide ? 'white' : 'rgba(255,255,255,0.5)',
                                cursor: 'pointer',
                                transition: 'background-color 0.2s'
                            }}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default HeroSlider;
