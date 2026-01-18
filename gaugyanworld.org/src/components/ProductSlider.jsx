import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getImageUrl } from '../utils/imageHelper';

const ProductSlider = ({ products = [], title = "Featured Products", autoPlayInterval = 5000 }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const navigate = useNavigate();

    const [itemsPerView, setItemsPerView] = useState(window.innerWidth < 768 ? 2 : 4);

    useEffect(() => {
        const handleResize = () => {
            setItemsPerView(window.innerWidth < 768 ? 2 : 4);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const maxIndex = Math.max(0, products.length - itemsPerView);



    useEffect(() => {
        if (!isAutoPlaying || products.length === 0) return;

        const interval = setInterval(() => {
            setCurrentIndex(prev => (prev >= maxIndex ? 0 : prev + 1));
        }, autoPlayInterval);

        return () => clearInterval(interval);
    }, [isAutoPlaying, maxIndex, autoPlayInterval, products.length]);

    const handlePrevious = () => {
        setCurrentIndex(prev => (prev === 0 ? maxIndex : prev - 1));
        setIsAutoPlaying(false);
    };

    const handleNext = () => {
        setCurrentIndex(prev => (prev >= maxIndex ? 0 : prev + 1));
        setIsAutoPlaying(false);
    };

    const handleDotClick = (index) => {
        setCurrentIndex(index);
        setIsAutoPlaying(false);
    };

    if (products.length === 0) return null;

    const visibleProducts = products.slice(currentIndex, currentIndex + itemsPerView);
    // Fill remaining slots if at the end
    if (visibleProducts.length < itemsPerView && products.length >= itemsPerView) {
        visibleProducts.push(...products.slice(0, itemsPerView - visibleProducts.length));
    }

    return (
        <div style={{ marginBottom: '3rem', position: 'relative' }}>
            {title && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#1F2937' }}>
                        {title.split(' ').map((word, i) =>
                            i === title.split(' ').length - 1 ?
                                <span key={`title-${word}-${i}`} style={{ color: '#F97316' }}>{word}</span> :
                                word + ' '
                        )}
                    </h2>
                </div>
            )}

            <div style={{ position: 'relative' }}
                onMouseEnter={() => setIsAutoPlaying(false)}
                onMouseLeave={() => setIsAutoPlaying(true)}
            >
                {/* Previous Button */}
                <button
                    onClick={handlePrevious}
                    disabled={currentIndex === 0 && products.length <= itemsPerView}
                    style={{
                        position: 'absolute',
                        left: '-20px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        zIndex: 10,
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        backgroundColor: 'white',
                        border: '2px solid #E5E7EB',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        transition: 'all 0.2s',
                        opacity: currentIndex === 0 && products.length <= itemsPerView ? 0.5 : 1
                    }}
                    onMouseEnter={(e) => {
                        if (!(currentIndex === 0 && products.length <= itemsPerView)) {
                            e.currentTarget.style.backgroundColor = '#F97316';
                            e.currentTarget.style.borderColor = '#F97316';
                            e.currentTarget.querySelector('svg').style.color = 'white';
                        }
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'white';
                        e.currentTarget.style.borderColor = '#E5E7EB';
                        e.currentTarget.querySelector('svg').style.color = '#1F2937';
                    }}
                >
                    <ChevronLeft size={20} style={{ color: '#1F2937', transition: 'color 0.2s' }} />
                </button>

                {/* Products Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: `repeat(${itemsPerView}, 1fr)`,
                    gap: '1.5rem',
                    overflow: 'hidden'
                }}>
                    {visibleProducts.map((product, index) => (
                        <div
                            key={`${product.id}-${index}`}
                            onClick={() => navigate(`/product/${product.id}`)}
                            style={{
                                backgroundColor: 'white',
                                borderRadius: '16px',
                                overflow: 'hidden',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                                cursor: 'pointer',
                                transition: 'transform 0.3s, box-shadow 0.3s',
                                animation: 'slideIn 0.5s ease-out'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-8px)';
                                e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.15)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
                            }}
                        >
                            {/* Product Image */}
                            <div style={{
                                width: '100%',
                                aspectRatio: '1',
                                backgroundColor: '#F9FAFB',
                                position: 'relative',
                                overflow: 'hidden'
                            }}>
                                <img
                                    src={getImageUrl(product.images?.[0])}
                                    alt={product.name}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover'
                                    }}
                                />
                                {/* Discount Badge */}
                                {product.originalPrice && product.price < product.originalPrice && (
                                    <div style={{
                                        position: 'absolute',
                                        top: '12px',
                                        right: '12px',
                                        backgroundColor: '#10B981',
                                        color: 'white',
                                        fontSize: '0.75rem',
                                        fontWeight: 700,
                                        padding: '4px 10px',
                                        borderRadius: '6px'
                                    }}>
                                        {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                                    </div>
                                )}
                            </div>

                            {/* Product Info */}
                            <div style={{ padding: '1rem' }}>
                                <h3 style={{
                                    fontSize: '1rem',
                                    fontWeight: 600,
                                    marginBottom: '0.5rem',
                                    color: '#1F2937',
                                    height: '40px',
                                    overflow: 'hidden',
                                    display: '-webkit-box',
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: 'vertical'
                                }}>
                                    {product.name}
                                </h3>

                                {/* Price */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <span style={{
                                        fontSize: '1.25rem',
                                        fontWeight: 700,
                                        color: '#F97316'
                                    }}>
                                        ₹{product.price}
                                    </span>
                                    {product.originalPrice && product.originalPrice > product.price && (
                                        <span style={{
                                            fontSize: '0.875rem',
                                            textDecoration: 'line-through',
                                            color: '#9CA3AF'
                                        }}>
                                            ₹{product.originalPrice}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Next Button */}
                <button
                    onClick={handleNext}
                    disabled={products.length <= itemsPerView}
                    style={{
                        position: 'absolute',
                        right: '-20px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        zIndex: 10,
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        backgroundColor: 'white',
                        border: '2px solid #E5E7EB',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        transition: 'all 0.2s',
                        opacity: products.length <= itemsPerView ? 0.5 : 1
                    }}
                    onMouseEnter={(e) => {
                        if (products.length > itemsPerView) {
                            e.currentTarget.style.backgroundColor = '#F97316';
                            e.currentTarget.style.borderColor = '#F97316';
                            e.currentTarget.querySelector('svg').style.color = 'white';
                        }
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'white';
                        e.currentTarget.style.borderColor = '#E5E7EB';
                        e.currentTarget.querySelector('svg').style.color = '#1F2937';
                    }}
                >
                    <ChevronRight size={20} style={{ color: '#1F2937', transition: 'color 0.2s' }} />
                </button>
            </div>

            {/* Dots Indicator */}
            {products.length > itemsPerView && (
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '8px',
                    marginTop: '1.5rem'
                }}>
                    {[...Array(maxIndex + 1)].map((_, index) => (
                        <button
                            key={`dot-${index}`}
                            onClick={() => handleDotClick(index)}
                            style={{
                                width: currentIndex === index ? '24px' : '8px',
                                height: '8px',
                                borderRadius: '4px',
                                backgroundColor: currentIndex === index ? '#F97316' : '#D1D5DB',
                                border: 'none',
                                cursor: 'pointer',
                                transition: 'all 0.3s'
                            }}
                        />
                    ))}
                </div>
            )}

            <style>{`
                @keyframes slideIn {
                    from {
                        opacity: 0;
                        transform: translateX(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
            `}</style>
        </div>
    );
};

export default ProductSlider;
