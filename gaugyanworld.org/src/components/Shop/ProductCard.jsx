import React, { memo } from 'react';
import { Heart, ShoppingCart, Star } from 'lucide-react';

const ProductCard = memo(({ product, isInWishlist, onToggleWishlist, onAddToCart, onNavigate, formatPrice }) => {
    return (
        <button
            onClick={() => onNavigate(product.id)}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onNavigate(product.id);
                }
            }}
            style={{ backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden', border: '1px solid #F3F4F6', transition: 'box-shadow 0.2s', cursor: 'pointer', position: 'relative', padding: 0, textAlign: 'left', width: '100%' }}
            className="hover:shadow-lg"
        >
            <div style={{ position: 'relative', width: '100%', aspectRatio: '4/5', backgroundColor: '#F9FAFB' }}>
                <img src={product.displayImage} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '1rem' }} />
                <button
                    onClick={(e) => { e.stopPropagation(); onToggleWishlist(e, product); }}
                    aria-label="Toggle Wishlist"
                    style={{ position: 'absolute', top: '10px', right: '10px', background: 'white', borderRadius: '50%', padding: '6px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: 'none', cursor: 'pointer' }}
                >
                    <Heart size={18} color={isInWishlist ? '#EF4444' : '#9CA3AF'} fill={isInWishlist ? '#EF4444' : 'none'} />
                </button>
            </div>

            <div style={{ padding: '1rem' }}>
                <div style={{ fontSize: '0.8rem', color: '#9CA3AF', marginBottom: '4px' }}>
                    {product.vendor?.displayName ? `Sold by ${product.vendor.displayName}` : product.vendorName || 'Gaugyan Store'}
                </div>
                <h3 style={{ fontSize: '1rem', fontWeight: 500, color: '#111827', marginBottom: '8px', lineHeight: '1.4', height: '44px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                    {product.name}
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <div style={{ backgroundColor: '#16A34A', color: 'white', fontSize: '0.75rem', fontWeight: 700, padding: '2px 6px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '2px' }}>
                        {product.rating || 4.2} <Star size={10} fill="white" />
                    </div>
                    <span style={{ fontSize: '0.8rem', color: '#9CA3AF' }}>({product.numReviews || 12})</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                    <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#111827' }}>{formatPrice(product.price)}</span>
                    {product.originalPrice > product.price && (
                        <>
                            <span style={{ fontSize: '0.85rem', textDecoration: 'line-through', color: '#9CA3AF' }}>{formatPrice(product.originalPrice)}</span>
                            <span style={{ fontSize: '0.85rem', color: '#16A34A', fontWeight: 700 }}>
                                {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% off
                            </span>
                        </>
                    )}
                </div>
                <button
                    onClick={(e) => { e.stopPropagation(); onAddToCart(e, product); }}
                    style={{
                        width: '100%',
                        marginTop: '1rem',
                        padding: '0.5rem',
                        backgroundColor: '#1F5B6B',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#164551'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#1F5B6B'}
                >
                    <ShoppingCart size={16} />
                    Add to Cart
                </button>
            </div>
        </button>
    );
});

import PropTypes from 'prop-types';

ProductCard.propTypes = {
    product: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        name: PropTypes.string,
        displayImage: PropTypes.string,
        price: PropTypes.number,
        originalPrice: PropTypes.number,
        rating: PropTypes.number,
        numReviews: PropTypes.number,
        vendor: PropTypes.shape({ displayName: PropTypes.string }),
        vendorName: PropTypes.string,
    }).isRequired,
    isInWishlist: PropTypes.bool,
    onToggleWishlist: PropTypes.func,
    onAddToCart: PropTypes.func,
    onNavigate: PropTypes.func,
    formatPrice: PropTypes.func
};

export default ProductCard;
