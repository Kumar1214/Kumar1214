import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const CategorySlider = ({ categories }) => {
    const scrollRef = useRef(null);

    const scroll = (direction) => {
        if (scrollRef.current) {
            const { current } = scrollRef;
            const scrollAmount = 300;
            if (direction === 'left') {
                current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
            } else {
                current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            }
        }
    };

    return (
        <div style={{ position: 'relative', marginBottom: 'var(--spacing-3xl)' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: 'var(--spacing-lg)', fontWeight: 600 }}>Shop by Category</h2>

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
                        boxShadow: 'var(--shadow-md)'
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
                        scrollBehavior: 'smooth',
                        padding: '10px 0',
                        scrollbarWidth: 'none', // Firefox
                        msOverflowStyle: 'none' // IE/Edge
                    }}
                    className="hide-scrollbar"
                >
                    {categories.map(cat => (
                        <Link
                            to={`/category/${cat.id}`}
                            key={cat.id}
                            style={{
                                minWidth: '200px',
                                flex: '0 0 auto',
                                textDecoration: 'none',
                                color: 'inherit'
                            }}
                        >
                            <div style={{
                                backgroundColor: 'white',
                                borderRadius: 'var(--radius-md)',
                                padding: 'var(--spacing-lg)',
                                textAlign: 'center',
                                border: '1px solid #E5E7EB',
                                transition: 'transform 0.2s, box-shadow 0.2s',
                                cursor: 'pointer',
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '12px'
                            }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.transform = 'translateY(-4px)';
                                    e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = 'none';
                                }}
                            >
                                <div style={{ fontSize: '3rem' }}>{cat.icon}</div>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>{cat.name}</h3>
                                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>{cat.description}</p>
                            </div>
                        </Link>
                    ))}
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
                        boxShadow: 'var(--shadow-md)'
                    }}
                >
                    <ChevronRight size={24} />
                </button>
            </div>
            <style>{`
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </div>
    );
};

export default CategorySlider;
