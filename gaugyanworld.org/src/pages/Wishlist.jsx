import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, ShoppingCart, Heart, ArrowLeft } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import RatingStars from '../components/RatingStars';
import Button from '../components/Button';

const Wishlist = () => {
    const navigate = useNavigate();
    const { wishlistItems, removeFromWishlist } = useWishlist();
    const { addToCart } = useCart();

    const handleAddToCart = (item) => {
        addToCart(item);
        removeFromWishlist(item.id);
    };

    // Helper for image URLs
    const getImageUrl = (path) => {
        if (!path) return 'https://via.placeholder.com/280x220';
        if (path.startsWith('http')) return path;
        return `${import.meta.env.VITE_API_URL || 'https://gaugyanworld.org'}${path}`;
    };

    if (wishlistItems.length === 0) {
        return (
            <div className="container mt-lg" style={{ textAlign: 'center', padding: '4rem 0' }}>
                <Heart size={64} color="#D1D5DB" style={{ margin: '0 auto var(--spacing-lg)' }} />
                <h2 style={{ marginBottom: 'var(--spacing-md)' }}>Your Wishlist is Empty</h2>
                <p style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--spacing-xl)' }}>
                    Save items you love to your wishlist
                </p>
                <Button onClick={() => navigate('/shop')}>Start Shopping</Button>
            </div>
        );
    }

    return (
        <div className="container mt-lg" style={{ paddingBottom: '4rem' }}>
            <button
                onClick={() => navigate('/shop')}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: 'none',
                    border: 'none',
                    color: 'var(--color-primary)',
                    fontSize: '1rem',
                    cursor: 'pointer',
                    marginBottom: 'var(--spacing-lg)',
                    fontWeight: 600
                }}
            >
                <ArrowLeft size={20} />
                Continue Shopping
            </button>

            <div style={{ marginBottom: 'var(--spacing-2xl)' }}>
                <h1 style={{ fontSize: '2rem', marginBottom: 'var(--spacing-sm)' }}>My Wishlist</h1>
                <p style={{ color: 'var(--color-text-muted)' }}>{wishlistItems.length} items saved</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--spacing-lg)' }}>
                {wishlistItems.map(item => {
                    const inStock = item.stock > 0 || (item.variations && item.variations.some(v => v.stock > 0));

                    return (
                        <div key={item.id} className="card" style={{ position: 'relative', overflow: 'hidden', transition: 'transform 0.2s, box-shadow 0.2s' }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-4px)';
                                e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.12)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                            }}
                        >
                            {/* Remove Button */}
                            <button
                                onClick={() => removeFromWishlist(item.id)}
                                style={{
                                    position: 'absolute',
                                    top: '12px',
                                    right: '12px',
                                    padding: '8px',
                                    backgroundColor: 'white',
                                    border: 'none',
                                    borderRadius: '50%',
                                    cursor: 'pointer',
                                    boxShadow: 'var(--shadow-sm)',
                                    zIndex: 2,
                                    transition: 'all 0.2s'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'scale(1.1)';
                                    e.currentTarget.style.backgroundColor = '#FEE2E2';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'scale(1)';
                                    e.currentTarget.style.backgroundColor = 'white';
                                }}
                            >
                                <Trash2 size={18} color="#EF4444" />
                            </button>

                            {/* Product Image */}
                            <div
                                onClick={() => navigate(`/product/${item.id}`)}
                                style={{
                                    width: '100%',
                                    height: '220px',
                                    overflow: 'hidden',
                                    borderRadius: 'var(--radius-md) var(--radius-md) 0 0',
                                    marginBottom: 'var(--spacing-md)',
                                    cursor: 'pointer'
                                }}
                            >
                                <img
                                    src={getImageUrl(item.images?.[0])}
                                    alt={item.name}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }}
                                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                />
                            </div>

                            {/* Product Info */}
                            <div style={{ padding: '0 var(--spacing-md) var(--spacing-md)' }}>
                                <h3
                                    onClick={() => navigate(`/product/${item.id}`)}
                                    style={{
                                        fontSize: '1rem',
                                        marginBottom: 'var(--spacing-sm)',
                                        lineHeight: 1.4,
                                        cursor: 'pointer',
                                        height: '40px',
                                        overflow: 'hidden',
                                        display: '-webkit-box',
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: 'vertical'
                                    }}
                                >
                                    {item.name}
                                </h3>

                                {/* Rating */}
                                {item.averageRating > 0 && (
                                    <div style={{ marginBottom: '0.5rem' }}>
                                        <RatingStars rating={item.averageRating} size={16} />
                                    </div>
                                )}

                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 'var(--spacing-md)' }}>
                                    <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-primary)' }}>
                                        ₹{item.price}
                                    </span>
                                    {item.originalPrice && item.originalPrice > item.price && (
                                        <>
                                            <span style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', textDecoration: 'line-through' }}>
                                                ₹{item.originalPrice}
                                            </span>
                                            <span style={{
                                                fontSize: '0.75rem',
                                                color: '#10B981',
                                                fontWeight: 600,
                                                backgroundColor: '#D1FAE5',
                                                padding: '2px 6px',
                                                borderRadius: '4px'
                                            }}>
                                                {Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}% OFF
                                            </span>
                                        </>
                                    )}
                                </div>

                                {/* Stock Status */}
                                {!inStock && (
                                    <div style={{
                                        padding: '4px 8px',
                                        backgroundColor: '#FEE2E2',
                                        color: '#B91C1C',
                                        borderRadius: 'var(--radius-sm)',
                                        fontSize: '0.85rem',
                                        marginBottom: 'var(--spacing-md)',
                                        display: 'inline-block'
                                    }}>
                                        Out of Stock
                                    </div>
                                )}

                                {/* Actions */}
                                <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
                                    <Button
                                        onClick={() => handleAddToCart(item)}
                                        disabled={!inStock}
                                        fullWidth
                                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                                    >
                                        <ShoppingCart size={18} />
                                        {inStock ? 'Move to Cart' : 'Unavailable'}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Wishlist;
