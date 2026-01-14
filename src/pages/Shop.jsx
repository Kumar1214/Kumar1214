import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import BannerSlider from '../components/BannerSlider';
import ProductSlider from '../components/ProductSlider'; // Might need update if it expects data prop
import RatingStars from '../components/RatingStars';
import {
    Package, MapPin, Heart, Search,
    ChevronDown, ChevronLeft, ChevronRight, ShoppingCart, Filter, Star, X
} from 'lucide-react';
import { contentService } from '../services/api';

const CATEGORIES = [
    { id: 'cat1', name: 'Puja Items', icon: '🕉️' },
    { id: 'cat2', name: 'Ayurvedic Products', icon: '🌿' },
    { id: 'cat3', name: 'Organic Food', icon: '🌾' },
    { id: 'cat4', name: 'Cow Products', icon: '🐄' },
    { id: 'cat5', name: 'Books', icon: '📚' },
    { id: 'cat6', name: 'Handicrafts', icon: '🎨' },
    { id: 'cat7', name: 'Clothing', icon: '👕' }
];

const Shop = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const { addToCart } = useCart();
    const { toggleWishlist, isInWishlist } = useWishlist();

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalProducts, setTotalProducts] = useState(0);
    const [showMobileFilters, setShowMobileFilters] = useState(false);

    const [pageCount, setPageCount] = useState(1);

    // Params from URL
    const categoryParam = searchParams.get('category') || 'all';
    const searchParam = searchParams.get('search') || '';
    const pageParam = parseInt(searchParams.get('page') || '1');
    const sortParam = searchParams.get('sort') || 'newest';
    const minPriceParam = searchParams.get('minPrice') || '';
    const maxPriceParam = searchParams.get('maxPrice') || '';
    const ratingParam = searchParams.get('rating') || '';

    const [sortBy, setSortBy] = useState(sortParam);
    const [searchQuery, setSearchQuery] = useState(searchParam);
    const [priceRange, setPriceRange] = useState({ min: minPriceParam || 0, max: maxPriceParam || 10000 });
    const [activeRating, setActiveRating] = useState(ratingParam);

    // Fetch Products
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const params = {
                    page: pageParam,
                    limit: 12,
                    sort: sortBy,
                    ...(categoryParam !== 'all' && { category: categoryParam }),
                    ...(searchParam && { search: searchParam }),
                    ...(priceRange.min > 0 && { minPrice: priceRange.min }),
                    ...(priceRange.max < 10000 && { maxPrice: priceRange.max }), // Only send if less than max default
                    ...(activeRating && { rating: activeRating }) // Assuming backend supports 'rating' filter (>= value)
                };

                // Remove undefined keys
                Object.keys(params).forEach(key => params[key] === undefined && delete params[key]);

                const response = await contentService.getProducts(params);
                if (response.data.success) {
                    const fetchedProducts = response.data.data;
                    const safeProducts = Array.isArray(fetchedProducts) ? fetchedProducts.map(p => ({
                        ...p,
                        images: (() => {
                            try {
                                return typeof p.images === 'string' ? JSON.parse(p.images) : (p.images || []);
                            } catch {
                                return [];
                            }
                        })()
                    })) : [];
                    setProducts(safeProducts);
                    setTotalProducts(response.data.total || 0);
                    setPageCount(response.data.totalPages || 1);
                }
            } catch (error) {
                console.error("Error fetching products:", error);
                // Fallback dummy
                setProducts([
                    { id: 'dummy-p1', name: 'Premium Incense Sticks (Demo)', category: 'Puja Items', price: 299, originalPrice: 399, rating: 4.8, images: ['https://images.unsplash.com/photo-1603956488746-1216dbee9874?auto=format&fit=crop&q=80&w=400'], stock: 100 },
                    { id: 'dummy-p2', name: 'Organic Cow Ghee (Demo)', category: 'Organic', price: 1200, originalPrice: 1500, rating: 5, images: ['https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e5?auto=format&fit=crop&q=80&w=400'], stock: 50 },
                ]);
            } finally {
                setLoading(false);
            }
        };

        // Debounce fetching if price changes rapidly? For now rely on dependencies
        // But better to trigger fetch on "Apply" or debounce priceRange
        // Let's add a debounced effect or simple timeout for slider
        const timer = setTimeout(() => {
            fetchProducts();
        }, 300);
        return () => clearTimeout(timer);

    }, [categoryParam, searchParam, pageParam, sortBy, priceRange, activeRating]);

    // Update URL helper
    const updateParams = (updates) => {
        const current = Object.fromEntries([...searchParams]);
        Object.keys(updates).forEach(key => {
            if (updates[key] !== null && updates[key] !== undefined && updates[key] !== '') {
                current[key] = updates[key];
            } else {
                delete current[key];
            }
        });
        if (updates.category || updates.search) current.page = '1';
        setSearchParams(current);
    };

    const handleCategoryChange = (cat) => {
        updateParams({ category: cat === 'all' ? null : cat });
    };

    const handleSearch = (e) => {
        e.preventDefault();
        updateParams({ search: searchQuery });
    };

    const handleSortChange = (e) => {
        const val = e.target.value;
        setSortBy(val);
        updateParams({ sort: val });
    };

    const handlePriceChange = (e) => {
        const { name, value } = e.target;
        setPriceRange(prev => ({ ...prev, [name]: Number(value) }));
        // Don't update URL immediately on slider drag, maybe just on mouseUp?
        // Ideally we update state, and effect triggers. 
        // For production app, use 'onChange' for state and 'onMouseUp' for URL sync/fetch if strictly needed.
    };

    // For now we just sync state, and let effect handle fetch. URL param sync is optional but good for sharing.
    // Let's simplify and just rely on internal state for filtering in this session, 
    // or update params on "Apply"

    const handleRatingChange = (rating) => {
        const newVal = activeRating === rating.toString() ? null : rating.toString();
        setActiveRating(newVal);
        updateParams({ rating: newVal });
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pageCount) {
            updateParams({ page: newPage.toString() });
            window.scrollTo(0, 0);
        }
    };

    const handleAddToCart = (e, product) => {
        e.stopPropagation();
        addToCart(product);
    };

    const handleToggleWishlist = (e, product) => {
        e.stopPropagation();
        toggleWishlist(product);
    };

    // Derived state for slider (using separate effect or just static/random for now if no "featured" endpoint)
    // For simplicity, just use the first few loaded products or fetch specific ones later
    const sliderProducts = products.slice(0, 8);

    // Helper for image URLs
    const getImageUrl = (imagePath) => {
        if (!imagePath) return 'https://via.placeholder.com/300';

        let path = imagePath;
        // Handle if imagePath is a stringified array (edge case)
        if (typeof imagePath === 'string' && imagePath.startsWith('[')) {
            try {
                const parsed = JSON.parse(imagePath);
                path = parsed[0] || path;
            } catch {
                // keep path as is
            }
        }

        if (path.startsWith('http')) return path;

        // Use the same API URL logic as api.js
        const apiBase = import.meta.env.VITE_API_URL || 'https://api.gaugyanworld.org';

        return `${apiBase}${path}`;
    };

    return (
        <div style={{ backgroundColor: '#F9FAFB', minHeight: '100vh' }}>
            {/* Banner Slider */}
            <BannerSlider placement="shop" />

            <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>

                {/* Featured Slider - Only show on main shop page without filters */}
                {categoryParam === 'all' && !searchParam && (
                    // Note: You might want a separate fetch for "Featured" to ensure it's always populated independently of current filters
                    <ProductSlider products={sliderProducts} title="Featured Collections" />
                )}

                {/* Shop Header & Filters */}
                {/* Main Content Layout */}
                {/* Main Content Layout */}
                <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start', position: 'relative' }}>

                    {/* Mobile Filter Overlay */}
                    {showMobileFilters && (
                        <div
                            className="lg:hidden"
                            onClick={() => setShowMobileFilters(false)}
                            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 40 }}
                        />
                    )}

                    {/* Sidebar Filters */}
                    <aside
                        className={`shop-sidebar ${showMobileFilters ? 'mobile-visible' : ''}`}
                        style={{
                            width: '260px',
                            flexShrink: 0,
                            backgroundColor: 'white',
                            padding: '1.5rem',
                            borderRadius: '12px',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                            height: 'fit-content',
                            // Mobile specific inline styles override by class, but we need base styles here
                        }}
                    >
                        <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid #E5E7EB', paddingBottom: '1rem' }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                Filters
                                <button className="lg:hidden" onClick={() => setShowMobileFilters(false)} style={{ background: 'none', border: 'none' }}><X size={20} /></button>
                                <Filter size={18} className="hidden lg:block text-gray-400" />
                            </h3>
                            {/* Clear All */}
                            <button onClick={() => {
                                updateParams({ category: null, minPrice: null, maxPrice: null, search: null, rating: null, page: '1' });
                                setPriceRange({ min: 0, max: 10000 });
                                setActiveRating(null);
                            }} style={{ fontSize: '0.85rem', color: '#1F5B6B', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>CLEAR ALL</button>
                        </div>

                        {/* Categories */}
                        <div style={{ marginBottom: '2rem' }}>
                            <h4 style={{ fontSize: '0.9rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '1rem', color: '#4B5563' }}>Categories</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.95rem' }}>
                                    <input type="radio" name="category" checked={categoryParam === 'all'} onChange={() => handleCategoryChange('all')} style={{ accentColor: '#1F5B6B' }} />
                                    All Products
                                </label>
                                {CATEGORIES.map(cat => (
                                    <label key={cat.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.95rem' }}>
                                        <input type="radio" name="category" checked={categoryParam === cat.name} onChange={() => handleCategoryChange(cat.name)} style={{ accentColor: '#1F5B6B' }} />
                                        {cat.name}
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Price Range */}
                        <div style={{ marginBottom: '2rem' }}>
                            <h4 style={{ fontSize: '0.9rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '1rem', color: '#4B5563' }}>Price Range</h4>
                            <div className="flex flex-col gap-4">
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>₹{priceRange.min}</span>
                                    <span>₹{priceRange.max}</span>
                                </div>
                                <input
                                    type="range"
                                    min="0" max="10000" step="100"
                                    name="max"
                                    value={priceRange.max}
                                    onChange={handlePriceChange}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-teal-700"
                                />
                                <div className="flex gap-2">
                                    <input
                                        type="number"
                                        name="min" value={priceRange.min} onChange={handlePriceChange}
                                        className="w-full text-xs border rounded p-1" placeholder="Min"
                                    />
                                    <span className="text-gray-400">-</span>
                                    <input
                                        type="number"
                                        name="max" value={priceRange.max} onChange={handlePriceChange}
                                        className="w-full text-xs border rounded p-1" placeholder="Max"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Ratings */}
                        <div>
                            <h4 style={{ fontSize: '0.9rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '1rem', color: '#4B5563' }}>Customer Ratings</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                {[4, 3, 2, 1].map(star => (
                                    <label key={star} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem' }}>
                                        <input
                                            type="checkbox"
                                            checked={activeRating === star.toString()}
                                            onChange={() => handleRatingChange(star)}
                                            style={{ accentColor: '#1F5B6B' }}
                                        />
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            {star} <Star size={14} fill="#F97316" color="#F97316" style={{ margin: '0 2px' }} /> & above
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </aside>

                    {/* Right Side: Search + Grid */}
                    <div style={{ flex: 1 }}>
                        {/* Mobile Category Pills (Visible on mobile only) */}
                        <div className="lg:hidden" style={{ overflowX: 'auto', paddingBottom: '1rem', marginBottom: '1rem', display: 'flex', gap: '0.5rem' }}>
                            {CATEGORIES.map(cat => (
                                <button key={cat.id} onClick={() => handleCategoryChange(cat.name)} style={{ whiteSpace: 'nowrap', padding: '0.5rem 1rem', borderRadius: '20px', border: categoryParam === cat.name ? '1px solid #1F5B6B' : '1px solid #E5E7EB', color: categoryParam === cat.name ? '#1F5B6B' : '#374151', backgroundColor: categoryParam === cat.name ? '#F0F9FB' : 'white', fontSize: '0.85rem' }}>
                                    {cat.name}
                                </button>
                            ))}
                        </div>

                        {/* Toolbar */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', backgroundColor: 'white', padding: '1rem', borderRadius: '8px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', flexWrap: 'wrap', gap: '1rem' }}>
                            <form onSubmit={handleSearch} style={{ flex: 1, minWidth: '200px', position: 'relative' }}>
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    style={{ width: '100%', padding: '0.5rem 2.5rem 0.5rem 1rem', borderRadius: '6px', border: '1px solid #D1D5DB', fontSize: '0.9rem' }}
                                />
                                <button type="submit" style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer' }}>
                                    <Search size={16} className="text-gray-400" />
                                </button>
                            </form>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <span style={{ fontWeight: 600, color: '#1F2937', fontSize: '0.9rem', whiteSpace: 'nowrap' }}>{totalProducts} Items</span>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <select value={sortBy} onChange={handleSortChange} style={{ border: '1px solid #E5E7EB', borderRadius: '6px', padding: '0.4rem', fontSize: '0.9rem', color: '#374151', cursor: 'pointer', outline: 'none' }}>
                                        <option value="popularity">Popularity</option>
                                        <option value="price_asc">Price: Low to High</option>
                                        <option value="price_desc">Price: High to Low</option>
                                        <option value="newest">Newest First</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Product Grid */}
                        {loading ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                {[1, 2, 3, 4, 5, 6].map(n => (
                                    <div key={n} style={{ height: '350px', backgroundColor: '#E5E7EB', borderRadius: '8px' }} className="animate-pulse"></div>
                                ))}
                            </div>
                        ) : products.length > 0 ? (
                            <>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
                                    {products.map(product => (
                                        <div
                                            key={product.id || product.id}
                                            onClick={() => navigate(`/product/${product.id || product.id}`)}
                                            style={{ backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden', border: '1px solid #F3F4F6', transition: 'box-shadow 0.2s', cursor: 'pointer', position: 'relative' }}
                                            className="hover:shadow-lg"
                                        >
                                            <div style={{ position: 'relative', width: '100%', aspectRatio: '4/5', backgroundColor: '#F9FAFB' }}>
                                                <img src={getImageUrl(product.images?.[0])} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '1rem' }} />
                                                <button onClick={(e) => handleToggleWishlist(e, product)} style={{ position: 'absolute', top: '10px', right: '10px', background: 'white', borderRadius: '50%', padding: '6px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: 'none', cursor: 'pointer' }}>
                                                    <Heart size={18} color={isInWishlist(product.id || product.id) ? '#EF4444' : '#9CA3AF'} fill={isInWishlist(product.id || product.id) ? '#EF4444' : 'none'} />
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
                                                    <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#111827' }}>₹{product.price}</span>
                                                    {product.originalPrice > product.price && (
                                                        <>
                                                            <span style={{ fontSize: '0.85rem', textDecoration: 'line-through', color: '#9CA3AF' }}>₹{product.originalPrice}</span>
                                                            <span style={{ fontSize: '0.85rem', color: '#16A34A', fontWeight: 700 }}>
                                                                {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% off
                                                            </span>
                                                        </>
                                                    )}
                                                </div>
                                                <button
                                                    onClick={(e) => handleAddToCart(e, product)}
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
                                        </div>
                                    ))}
                                </div>

                                {/* Pagination (Simplified) */}
                                {pageCount > 1 && (
                                    <div className="flex justify-center gap-2 mt-8">
                                        <button disabled={pageParam === 1} onClick={() => handlePageChange(pageParam - 1)} className="px-4 py-2 border rounded hover:bg-gray-50 disabled:opacity-50">Previous</button>
                                        <span className="px-4 py-2 bg-primary text-white rounded">{pageParam}</span>
                                        <button disabled={pageParam === pageCount} onClick={() => handlePageChange(pageParam + 1)} className="px-4 py-2 border rounded hover:bg-gray-50 disabled:opacity-50">Next</button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-lg">
                                <Package size={48} className="text-gray-300 mb-4" />
                                <h3 className="text-lg font-semibold text-gray-900">No products found</h3>
                                <p className="text-gray-500">Try changing filters or search terms</p>
                            </div>
                        )}
                    </div>
                </div>

                <style>{`
                    @media (min-width: 1024px) {
                        .shop-sidebar { display: block; }
                    }
                    @media (max-width: 1023px) {
                        .shop-sidebar {
                            position: fixed;
                            top: 0;
                            left: 0;
                            height: 100vh !important;
                            z-index: 50;
                            transform: translateX(-100%);
                            transition: transform 0.3s ease-in-out;
                            overflow-y: auto;
                            width: 280px !important;
                            border-radius: 0 !important;
                        }
                        .shop-sidebar.mobile-visible {
                            transform: translateX(0);
                        }
                    }
                `}</style>
            </div>
        </div>
    );
};

export default Shop;

