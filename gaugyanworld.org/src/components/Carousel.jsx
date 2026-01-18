import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Carousel = ({ children, title, linkTo }) => {
    const scrollRef = useRef(null);

    const scroll = (direction) => {
        if (scrollRef.current) {
            const { current } = scrollRef;
            const scrollAmount = 300; // Scroll by roughly one card width
            if (direction === 'left') {
                current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
            } else {
                current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            }
        }
    };

    return (
        <div style={{ marginBottom: 'var(--spacing-3xl)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-lg)' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>{title}</h2>
                {linkTo && (
                    <a href={linkTo} style={{ color: 'var(--color-primary)', textDecoration: 'none', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                        View All <ChevronRight size={16} />
                    </a>
                )}
            </div>

            <div style={{ position: 'relative' }}>
                <button
                    onClick={() => scroll('left')}
                    style={{
                        position: 'absolute',
                        left: '-20px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        zIndex: 10,
                        backgroundColor: 'white',
                        border: '1px solid #E5E7EB',
                        borderRadius: '50%',
                        width: '40px',
                        height: '40px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                        color: '#4B5563'
                    }}
                >
                    <ChevronLeft size={24} />
                </button>

                <div
                    ref={scrollRef}
                    style={{
                        display: 'flex',
                        gap: 'var(--spacing-lg)',
                        overflowX: 'auto',
                        paddingBottom: '20px',
                        scrollBehavior: 'smooth',
                        scrollbarWidth: 'none', // Firefox
                        msOverflowStyle: 'none' // IE/Edge
                    }}
                    className="no-scrollbar" // Add utility class for hiding scrollbar if available
                >
                    {/* Inline style to hide scrollbar for Webkit */}
                    <style>{`
                        .no-scrollbar::-webkit-scrollbar {
                            display: none;
                        }
                    `}</style>
                    {children}
                </div>

                <button
                    onClick={() => scroll('right')}
                    style={{
                        position: 'absolute',
                        right: '-20px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        zIndex: 10,
                        backgroundColor: 'white',
                        border: '1px solid #E5E7EB',
                        borderRadius: '50%',
                        width: '40px',
                        height: '40px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                        color: '#4B5563'
                    }}
                >
                    <ChevronRight size={24} />
                </button>
            </div>
        </div>
    );
};

export default Carousel;
