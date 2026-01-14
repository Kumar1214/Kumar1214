import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Star, ShoppingCart, Heart, Minus, Plus, Share2,
    Truck, ShieldCheck, RefreshCw
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import Button from '../components/Button';
import RatingStars from '../components/RatingStars';
import ProductSlider from '../components/ProductSlider';
import { contentService } from '../services/api';
import SEO from '../components/SEO';
import { useData } from '../context/DataContext';
import EngagementBar from '../components/engagement/EngagementBar';

const ProductDetail = () => {
    const { id } = useParams(); // Note: might be string or ID
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const { toggleWishlist, isInWishlist } = useWishlist();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [selectedVariation, setSelectedVariation] = useState(null);
    const [activeTab, setActiveTab] = useState('description');
    const { trackEngagement } = useData();

    // Review form state (optimistic UI for now or just visual)
    // const [reviewRating, setReviewRating] = useState(5);
    // const [reviewComment, setReviewComment] = useState('');

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            try {
                const response = await contentService.getProductById(id);
                if (response.data.success) {
                    const foundProduct = response.data.data;

                    // Track view
                    if (foundProduct) {
                        trackEngagement('ecommerce', foundProduct.id, 'view');
                    }

                    // Normalize images...
                    if (foundProduct.images) {
                        if (typeof foundProduct.images === 'string') {
                            try {
                                const parsed = JSON.parse(foundProduct.images);
                                foundProduct.images = Array.isArray(parsed) ? parsed : [foundProduct.images];
                            } catch {
                                foundProduct.images = [foundProduct.images];
                            }
                        } else if (!Array.isArray(foundProduct.images)) {
                            foundProduct.images = [];
                        }
                    } else {
                        foundProduct.images = [];
                    }

                    // Normalize reviews
                    if (!Array.isArray(foundProduct.reviews)) {
                        foundProduct.reviews = [];
                    }

                    setProduct(foundProduct);
                    if (foundProduct.variations && foundProduct.variations.length > 0) {
                        setSelectedVariation(foundProduct.variations[0]);
                    }
                    setSelectedImage(0);
                    setQuantity(1);
                }
            } catch (error) {
                console.error("Error fetching product:", error);
            } finally {
                setLoading(false);
                window.scrollTo(0, 0);
            }
        };

        fetchProduct();
    }, [id]);

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: product.name,
                text: product.description,
                url: window.location.href,
            }).then(() => {
                trackEngagement('ecommerce', product.id, 'share', 'web-native');
            }).catch(console.error);
        } else {
            const url = window.location.href;
            navigator.clipboard.writeText(url);
            alert('Link copied to clipboard!');
            trackEngagement('ecommerce', product.id, 'share', 'copy-link');
        }
    };

    const handleWishlist = () => {
        toggleWishlist(product);
        trackEngagement('ecommerce', product.id, 'bookmark');
    };

    if (loading) {
        return <div className="container mt-lg" style={{ textAlign: 'center', padding: '4rem' }}>Loading product details...</div>;
    }

    if (!product) {
        return (
            <div className="container mt-lg" style={{ textAlign: 'center', padding: '4rem' }}>
                <h2>Product Not Found</h2>
                <Button onClick={() => navigate('/shop')} style={{ marginTop: '1rem' }}>Back to Shop</Button>
            </div>
        );
    }

    // Handlers
    const handleAddToCart = () => {
        addToCart(product, selectedVariation, quantity);
    };

    const currentPrice = selectedVariation ? selectedVariation.price : product.price;
    const currentStock = selectedVariation ? selectedVariation.stock : product.stock;
    const isOutOfStock = currentStock === 0;

    // Helper for image URLs
    const getImageUrl = (imagePath) => {
        if (!imagePath) return 'https://via.placeholder.com/600';

        let path = imagePath;
        if (typeof imagePath === 'string' && imagePath.startsWith('[')) {
            try {
                const parsed = JSON.parse(imagePath);
                path = parsed[0] || path;
            } catch {
                // keep path as is
            }
        }

        if (path.startsWith('http')) return path;

        const apiBase = import.meta.env.VITE_API_URL || 'https://api.gaugyanworld.org';

        return `${apiBase}${path}`;
    };

    return (
        <div className="container mt-lg" style={{ paddingBottom: '4rem' }}>
            <SEO
                title={product.name}
                description={product.description}
                image={getImageUrl(product.images?.[0])}
                url={`/shop/${product.id}`}
                type="product"
            />
            {/* Breadcrumb */}
            <div style={{ marginBottom: '1rem', color: '#6B7280', fontSize: '0.9rem' }}>
                <span style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>Home</span> /
                <span style={{ cursor: 'pointer', margin: '0 5px' }} onClick={() => navigate('/shop')}>Shop</span> /
                <span style={{ color: '#1F2937', fontWeight: 500, marginLeft: '5px' }}>{product.name}</span>
            </div>

            <div className="grid-product-gallery">

                {/* Image Gallery */}
                <div>
                    <div style={{
                        width: '100%',
                        aspectRatio: '1',
                        borderRadius: '16px',
                        overflow: 'hidden',
                        marginBottom: '1rem',
                        border: '1px solid #E5E7EB',
                        position: 'relative',
                        backgroundColor: '#F9FAFB'
                    }}>
                        <img
                            src={getImageUrl(product.images?.[selectedImage])}
                            alt={product.name}
                            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                        />
                    </div>

                    {/* Thumbnails */}
                    {product.images && product.images.length > 1 && (
                        <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                            {product.images.map((img, idx) => (
                                <div
                                    key={idx}
                                    onClick={() => setSelectedImage(idx)}
                                    style={{
                                        width: '80px',
                                        height: '80px',
                                        borderRadius: '8px',
                                        overflow: 'hidden',
                                        cursor: 'pointer',
                                        border: selectedImage === idx ? '2px solid #F97316' : '1px solid #E5E7EB',
                                        flexShrink: 0
                                    }}
                                >
                                    <img src={getImageUrl(img)} alt={`Thumbnail ${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Product Info */}
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem', color: '#1F2937' }}>
                        {product.name}
                    </h1>

                    {/* Rating & Vendor */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <RatingStars rating={product.rating || 0} size={18} />
                            <span style={{ color: '#6B7280', fontSize: '0.9rem', marginLeft: '4px' }}>
                                ({product.numReviews || 0} reviews)
                            </span>
                        </div>
                        <span style={{ color: '#E5E7EB' }}>|</span>
                        <div style={{ fontSize: '0.9rem', color: '#6B7280' }}>
                            {/* Assuming vendor name is populated or available */}
                            Sold by: <span style={{ color: '#F97316', fontWeight: 600 }}>{product.vendor?.displayName || 'Gaugyan'}</span>
                        </div>
                    </div>

                    {/* Price */}
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem', marginBottom: '1.5rem' }}>
                        <span style={{ fontSize: '2.5rem', fontWeight: 700, color: '#F97316' }}>
                            ₹{currentPrice}
                        </span>
                        {product.originalPrice && product.originalPrice > currentPrice && (
                            <>
                                <span style={{ fontSize: '1.25rem', textDecoration: 'line-through', color: '#9CA3AF' }}>
                                    ₹{product.originalPrice}
                                </span>
                                <span style={{
                                    color: '#10B981',
                                    fontWeight: 700,
                                    backgroundColor: '#D1FAE5',
                                    padding: '4px 10px',
                                    borderRadius: '6px',
                                    fontSize: '0.9rem'
                                }}>
                                    {Math.round(((product.originalPrice - currentPrice) / product.originalPrice) * 100)}% OFF
                                </span>
                            </>
                        )}
                    </div>

                    <p style={{ color: '#4B5563', lineHeight: 1.6, marginBottom: '2rem', fontSize: '1.05rem' }}>
                        {product.description}
                    </p>

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
                        {/* Quantity */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            border: '1px solid #E5E7EB',
                            borderRadius: '8px',
                            backgroundColor: 'white'
                        }}>
                            <button
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                disabled={isOutOfStock}
                                style={{ padding: '12px 16px', background: 'none', border: 'none', cursor: isOutOfStock ? 'not-allowed' : 'pointer' }}
                            >
                                <Minus size={18} color={quantity === 1 ? '#D1D5DB' : '#374151'} />
                            </button>
                            <span style={{ padding: '0 12px', fontWeight: 600, minWidth: '40px', textAlign: 'center' }}>
                                {quantity}
                            </span>
                            <button
                                onClick={() => setQuantity(quantity + 1)}
                                disabled={isOutOfStock}
                                style={{ padding: '12px 16px', background: 'none', border: 'none', cursor: isOutOfStock ? 'not-allowed' : 'pointer' }}
                            >
                                <Plus size={18} color="#374151" />
                            </button>
                        </div>

                        {/* Add to Cart */}
                        <button
                            onClick={handleAddToCart}
                            disabled={isOutOfStock}
                            style={{
                                flex: 1,
                                minWidth: '200px',
                                padding: '12px 24px',
                                backgroundColor: isOutOfStock ? '#E5E7EB' : '#F97316',
                                color: isOutOfStock ? '#9CA3AF' : 'white',
                                border: 'none',
                                borderRadius: '8px',
                                fontWeight: 700,
                                fontSize: '1.1rem',
                                cursor: isOutOfStock ? 'not-allowed' : 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '10px',
                                transition: 'background-color 0.2s'
                            }}
                        >
                            <ShoppingCart size={22} />
                            {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                        </button>
                    </div>

                    <EngagementBar
                        views={product.viewCount || 0}
                        shares={product.shareCount || 0}
                        bookmarks={product.bookmarkCount || 0}
                        isBookmarked={isInWishlist(product.id)}
                        onShare={handleShare}
                        onBookmark={handleWishlist}
                    />

                    {/* Trust Badges */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: '1rem',
                        padding: '1.5rem',
                        backgroundColor: '#F9FAFB',
                        borderRadius: '12px',
                        border: '1px solid #E5E7EB'
                    }}>
                        <div style={{ textAlign: 'center' }}>
                            <Truck size={24} color="#F97316" style={{ marginBottom: '8px' }} />
                            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#374151' }}>Fast Delivery</div>
                        </div>
                        <div style={{ textAlign: 'center', borderLeft: '1px solid #E5E7EB', borderRight: '1px solid #E5E7EB' }}>
                            <ShieldCheck size={24} color="#F97316" style={{ marginBottom: '8px' }} />
                            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#374151' }}>Secure Payment</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <RefreshCw size={24} color="#F97316" style={{ marginBottom: '8px' }} />
                            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#374151' }}>Easy Returns</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs: Description & Reviews */}
            <div style={{ marginTop: '4rem' }}>
                <div style={{ display: 'flex', borderBottom: '1px solid #E5E7EB', marginBottom: '2rem' }}>
                    <button
                        onClick={() => setActiveTab('description')}
                        style={{
                            padding: '1rem 2rem',
                            border: 'none',
                            background: 'none',
                            fontSize: '1.1rem',
                            fontWeight: 600,
                            color: activeTab === 'description' ? '#F97316' : '#6B7280',
                            borderBottom: activeTab === 'description' ? '3px solid #F97316' : '3px solid transparent',
                            cursor: 'pointer',
                        }}
                    >
                        Description
                    </button>
                    <button
                        onClick={() => setActiveTab('reviews')}
                        style={{
                            padding: '1rem 2rem',
                            border: 'none',
                            background: 'none',
                            fontSize: '1.1rem',
                            fontWeight: 600,
                            color: activeTab === 'reviews' ? '#F97316' : '#6B7280',
                            borderBottom: activeTab === 'reviews' ? '3px solid #F97316' : '3px solid transparent',
                            cursor: 'pointer',
                        }}
                    >
                        Reviews ({product.reviews?.length || 0})
                    </button>
                </div>

                {activeTab === 'description' ? (
                    <div style={{ color: '#4B5563', lineHeight: 1.8, fontSize: '1.05rem' }}>
                        <p style={{ marginBottom: '1.5rem' }}>{product.description}</p>
                    </div>
                ) : (
                    <div>
                        {/* Review Display (Simplified) */}
                        {product.reviews && product.reviews.length > 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                {product.reviews.map((review, idx) => (
                                    <div key={idx} style={{ padding: '1.5rem', backgroundColor: 'white', borderRadius: '12px', border: '1px solid #E5E7EB' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                            <div style={{ fontWeight: 600, color: '#1F2937' }}>{review.user?.displayName || 'User'}</div>
                                            <div style={{ color: '#6B7280', fontSize: '0.9rem' }}>{new Date(review.date).toLocaleDateString()}</div>
                                        </div>
                                        <div style={{ marginBottom: '0.75rem' }}>
                                            <RatingStars rating={review.rating} size={16} />
                                        </div>
                                        <p style={{ color: '#4B5563' }}>{review.comment}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '2rem', color: '#6B7280' }}>
                                No reviews yet.
                            </div>
                        )}
                    </div>
                )}
            </div>
            {/* Related Products */}
            {product && product.category && (
                <div style={{ marginTop: '4rem' }}>
                    <h3 className="text-xl font-bold mb-6 text-gray-800">You Might Also Like</h3>
                    <RelatedProducts category={product.category} excludeId={product.id} />
                </div>
            )}
        </div>
    );
};

// Internal Component for Related Products
const RelatedProducts = ({ category, excludeId }) => {
    const [related, setRelated] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRelated = async () => {
            // In a real app, strict filtering by category.
            // Here we reuse getProducts with limit
            try {
                const res = await contentService.getProducts({ category, limit: 5 });
                if (res.data.success) {
                    let list = res.data.data;
                    if (Array.isArray(list)) {
                        list = list.filter(p => p.id !== excludeId).slice(0, 4);
                        setRelated(list);
                    }
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchRelated();
    }, [category, excludeId]);

    if (loading) return <div className="animate-pulse h-64 bg-gray-100 rounded-xl"></div>;
    if (related.length === 0) return null;

    return <ProductSlider products={related} title="" />;
};

export default ProductDetail;
