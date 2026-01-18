import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useData } from '../context/useData';

const BannerSlider = ({ placement }) => {
    const { banners: apiBanners } = useData();
    const [currentIndex, setCurrentIndex] = useState(0);

    // Filter sliders based on placement/location
    const banners = (apiBanners || []).filter(slider =>
        slider.isActive && (slider.placement === placement || (!slider.placement && placement === 'home'))
    ).sort((a, b) => (a.order || 0) - (b.order || 0));

    useEffect(() => {
        if (banners.length > 1) {
            const interval = setInterval(() => {
                setCurrentIndex((prev) => (prev + 1) % banners.length);
            }, 5000); // Auto-advance every 5 seconds

            return () => clearInterval(interval);
        }
    }, [banners.length]);

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % banners.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
    };

    if (!banners || banners.length === 0) return null;

    const currentBanner = banners[currentIndex];

    return (
        <div style={{
            position: 'relative',
            width: '100%',
            height: '400px',
            overflow: 'hidden',
            marginBottom: 'var(--spacing-xl)'
        }}>
            {/* Banner Content */}
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundImage: currentBanner.imageUrl ? `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${currentBanner.imageUrl})` : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundColor: currentBanner.imageUrl ? 'transparent' : '#1E3A8A', // Fallback color
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'opacity 0.5s ease-in-out'
                }}
            >
                <div className="container" style={{ textAlign: 'center', color: 'white' }}>
                    <h1 style={{
                        fontSize: '3rem',
                        fontWeight: 700,
                        marginBottom: '1rem',
                        textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
                    }}>
                        {currentBanner.title}
                    </h1>
                    {currentBanner.description && (
                        <p style={{
                            fontSize: '1.5rem',
                            marginBottom: '2rem',
                            textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
                        }}>
                            {currentBanner.description}
                        </p>
                    )}
                    {currentBanner.buttonText && (
                        <a
                            href={currentBanner.linkUrl || '#'}
                            style={{
                                display: 'inline-block',
                                padding: '1rem 2.5rem',
                                backgroundColor: '#F97316',
                                color: 'white',
                                borderRadius: '8px',
                                textDecoration: 'none',
                                fontWeight: 600,
                                fontSize: '1.1rem',
                                transition: 'transform 0.2s',
                                boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                        >
                            {currentBanner.buttonText}
                        </a>
                    )}
                </div>
            </div>

            {/* Navigation Arrows */}
            {banners.length > 1 && (
                <>
                    <button
                        onClick={prevSlide}
                        style={{
                            position: 'absolute',
                            left: '2rem',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            backgroundColor: 'rgba(255,255,255,0.9)',
                            border: 'none',
                            borderRadius: '50%',
                            width: '50px',
                            height: '50px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            transition: 'background-color 0.2s',
                            zIndex: 10
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,1)'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.9)'}
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <button
                        onClick={nextSlide}
                        style={{
                            position: 'absolute',
                            right: '2rem',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            backgroundColor: 'rgba(255,255,255,0.9)',
                            border: 'none',
                            borderRadius: '50%',
                            width: '50px',
                            height: '50px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            transition: 'background-color 0.2s',
                            zIndex: 10
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,1)'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.9)'}
                    >
                        <ChevronRight size={24} />
                    </button>
                </>
            )}

            {/* Dots Indicator */}
            {banners.length > 1 && (
                <div style={{
                    position: 'absolute',
                    bottom: '2rem',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    display: 'flex',
                    gap: '0.5rem',
                    zIndex: 10
                }}>
                    {banners.map((_, index) => (
                        <button
                            key={`dot-${index}`}
                            onClick={() => setCurrentIndex(index)}
                            style={{
                                width: currentIndex === index ? '30px' : '10px',
                                height: '10px',
                                borderRadius: '5px',
                                backgroundColor: currentIndex === index ? 'white' : 'rgba(255,255,255,0.5)',
                                border: 'none',
                                cursor: 'pointer',
                                transition: 'all 0.3s'
                            }}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default BannerSlider;
