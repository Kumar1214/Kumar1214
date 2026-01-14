import React from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingCart, Heart } from 'lucide-react';
import Button from './Button';
import { getImageUrl } from '../utils/imageHelper';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import toast from 'react-hot-toast';

const ProductCard = ({ id, image, title, price, originalPrice, rating, reviews, isSale, vendor }) => {
    const { addToCart } = useCart();
    const { toggleWishlist, isInWishlist } = useWishlist();
    const [imageLoaded, setImageLoaded] = React.useState(false);

    const isWishlisted = isInWishlist(id);

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart({ id, image, title, price, originalPrice, vendor }); // Pass necessary product details
        toast.success('Added to Cart');
    };

    const handleToggleWishlist = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            // Reconstruct the product object to pass to context
            const product = { id, image, title, price, originalPrice, vendor };
            await toggleWishlist(product);
            // Visual feedback handled by isWishlisted state update from context
        } catch (error) {
            console.error('Wishlist toggle failed', error);
        }
    };

    return (
        <div className="card" style={{
            padding: 'var(--spacing-md)',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            height: '100%'
        }}>
            {/* Sale Badge */}
            {isSale && (
                <span style={{
                    position: 'absolute',
                    top: '10px',
                    left: '10px',
                    backgroundColor: '#EF4444',
                    color: 'white',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                    zIndex: 1
                }}>
                    SALE
                </span>
            )}

            {/* Wishlist Button */}
            <button
                onClick={handleToggleWishlist}
                style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    padding: '6px',
                    backgroundColor: 'white',
                    borderRadius: '50%',
                    boxShadow: 'var(--shadow-sm)',
                    zIndex: 10,
                    color: isWishlisted ? '#EF4444' : '#9CA3AF',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                }}>
                <Heart size={18} fill={isWishlisted ? "currentColor" : "none"} />
            </button>

            {/* Image */}
            <div style={{
                width: '100%',
                aspectRatio: '1',
                marginBottom: 'var(--spacing-md)',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                backgroundColor: '#f3f4f6', // Lighter background for skeleton feel
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative'
            }}>
                {/* Skeleton Loader / Blur Placeholder */}
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundColor: '#e5e7eb',
                    filter: 'blur(10px)',
                    opacity: imageLoaded ? 0 : 1,
                    transition: 'opacity 0.5s ease-out',
                    zIndex: 1
                }} />

                <img
                    src={getImageUrl(image)}
                    alt={title}
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.3s ease, opacity 0.5s ease-in',
                        opacity: imageLoaded ? 1 : 0,
                        zIndex: 2
                    }}
                    onLoad={() => setImageLoaded(true)}
                    onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                />
            </div>

            {/* Content */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <Link to={`/product/${id}`} style={{
                    fontWeight: 600,
                    marginBottom: 'var(--spacing-xs)',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    minHeight: '48px'
                }}>
                    {title}
                </Link>

                {/* Rating */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: 'var(--spacing-sm)' }}>
                    <div style={{ display: 'flex', color: '#FBBF24' }}>
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} size={14} fill={i < Math.floor(rating) ? "currentColor" : "none"} stroke="currentColor" />
                        ))}
                    </div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>({reviews})</span>
                </div>

                {/* Price */}
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: 'var(--spacing-md)' }}>
                    <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-primary)' }}>
                        ₹{price}
                    </span>
                    {originalPrice && (
                        <span style={{ fontSize: '0.9rem', textDecoration: 'line-through', color: 'var(--color-text-muted)' }}>
                            ₹{originalPrice}
                        </span>
                    )}
                </div>

                {/* Add to Cart */}
                <Button fullWidth onClick={handleAddToCart} style={{ marginTop: 'auto', gap: '8px' }}>
                    <ShoppingCart size={18} /> Add
                </Button>
            </div>
        </div>
    );
};

export default ProductCard;
