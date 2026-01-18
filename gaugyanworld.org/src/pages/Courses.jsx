import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, Filter, X, Star, Clock, Users, Award, ChevronDown, ChevronUp } from 'lucide-react';
import ModernBannerSlider from '../components/ModernBannerSlider';
import { contentService } from '../services/api';

const Courses = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchParams] = useSearchParams();

    // Filters state
    const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedLevels, setSelectedLevels] = useState([]);
    const [showFilters, setShowFilters] = useState(true);
    const [expandedSections, setExpandedSections] = useState({ category: true, level: true, rating: true });

    const categories = ['Ayurveda', 'Yoga', 'Vedic Studies', 'Language', 'Spirituality', 'Agriculture'];
    const levels = ['All Levels', 'Beginner', 'Intermediate', 'Advanced'];

    // Fetch courses from API
    useEffect(() => {
        const fetchCourses = async () => {
            setLoading(true);
            try {
                // Construct params
                const params = {
                    search: searchTerm || undefined,
                    // Note: Backend currently accepts single values for simple filtering. 
                    // For multiple, we'd need to update backend to support $in or send multiple separate requests.
                    // For now, let's send the first selected category if any, or refine backend later.
                    // Or we can rely on client side filtering if the dataset is small, but we want server side.
                    // Let's iterate: if users select multiple, we might only send one or default to all. 
                    // Ideally: backend should support ?category=a,b or ?category[]=a
                    category: selectedCategories.length > 0 ? selectedCategories[0] : undefined,
                    level: selectedLevels.length > 0 ? selectedLevels[0] : undefined,
                };

                const response = await contentService.getCourses(params);
                if (response.data.success) {
                    const fetchedCourses = response.data.data;

                    setCourses(fetchedCourses || []);
                }
            } catch (error) {
                console.error("Error fetching courses:", error);
                setCourses([
                    { id: 'dummy-c1', title: 'Introduction to Vedas (Demo)', instructor: { displayName: 'Panditji' }, rating: 4.9, numReviews: 24, price: 999, originalPrice: 1999, level: 'Beginner', duration: '5h 30m', image: 'https://images.unsplash.com/photo-1519791883288-dc8bd696e667?auto=format&fit=crop&q=80&w=400', bestseller: true },
                    { id: 'dummy-c2', title: 'Yoga for Mindfulness (Demo)', instructor: { displayName: 'Yogi Raj' }, rating: 4.7, numReviews: 18, price: 0, level: 'All Levels', duration: '2h', image: 'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?auto=format&fit=crop&q=80&w=400' }
                ]);
            } finally {
                setLoading(false);
            }
        };

        // Debounce search
        const timeoutId = setTimeout(() => {
            fetchCourses();
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [searchTerm, selectedCategories, selectedLevels]);

    const toggleSection = (section) => {
        setExpandedSections({ ...expandedSections, [section]: !expandedSections[section] });
    };

    const toggleFilter = (filterArray, setFilter, value) => {
        if (filterArray.includes(value)) {
            setFilter(filterArray.filter(item => item !== value));
        } else {
            // For now, since backend might support only single filter, we might want to restrict to single select or just take the last one.
            // But let's keep multi-select UI and just send 0th item as per logic above, or eventually upgrade backend.
            setFilter([value]); // Single select behavior for now to match backend 'category=' param simplicity

            // To support multi select: setFilter([...filterArray, value]);
        }
    };

    const clearAllFilters = () => {
        setSelectedCategories([]);
        setSelectedLevels([]);
        setSearchTerm('');
    };

    // Helper for image URLs
    const getImageUrl = (path) => {
        if (!path) return 'https://via.placeholder.com/400x225';
        if (path.startsWith('http')) return path;
        return `${import.meta.env.VITE_API_URL || 'https://gaugyanworld.org'}${path}`;
    };

    return (
        <div className="container mt-lg">
            {/* Banner Slider */}
            <ModernBannerSlider placement="courses" />

            {/* Header */}
            <div style={{ marginBottom: 'var(--spacing-xl)' }}>
                <h1 style={{ fontSize: '2rem', marginBottom: 'var(--spacing-md)' }}>All Courses</h1>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '1.05rem' }}>
                    Choose from our collection of online video courses
                </p>
            </div>

            {/* Search Bar */}
            <div style={{ position: 'relative', marginBottom: 'var(--spacing-xl)' }}>
                <input
                    type="text"
                    placeholder="Search for anything..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ width: '100%', padding: '14px 50px 14px 20px', borderRadius: 'var(--radius-md)', border: '2px solid #E5E7EB', fontSize: '1rem' }}
                />
                <Search size={20} style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
            </div>

            <div className={`grid-sidebar-layout ${!showFilters ? 'filters-hidden' : ''}`} style={!showFilters ? { gridTemplateColumns: '1fr' } : {}}>

                {/* Filter Toggle Button (Mobile) */}
                {!showFilters && (
                    <button onClick={() => setShowFilters(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', border: '1px solid #E5E7EB', backgroundColor: 'white', borderRadius: 'var(--radius-md)', cursor: 'pointer', marginBottom: 'var(--spacing-lg)', width: 'fit-content' }}>
                        <Filter size={18} /> Show Filters
                    </button>
                )}

                {/* Filters Sidebar */}
                {showFilters && (
                    <div style={{ position: 'sticky', top: '100px', height: 'fit-content' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-lg)' }}>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Filters</h3>
                            <button onClick={() => setShowFilters(false)} style={{ padding: '4px', border: 'none', background: 'none', cursor: 'pointer' }}>
                                <X size={20} />
                            </button>
                        </div>

                        {/* Category Filter */}
                        <div style={{ marginBottom: 'var(--spacing-xl)', paddingBottom: 'var(--spacing-lg)', borderBottom: '1px solid #E5E7EB' }}>
                            <button onClick={() => toggleSection('category')} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', padding: '8px 0', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '1rem' }}>
                                Category
                                {expandedSections.category ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                            </button>
                            {expandedSections.category && (
                                <div style={{ marginTop: 'var(--spacing-md)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
                                    {categories.map(cat => (
                                        <label key={cat} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: '4px 0' }}>
                                            <input
                                                type="checkbox"
                                                checked={selectedCategories.includes(cat)}
                                                onChange={() => toggleFilter(selectedCategories, setSelectedCategories, cat)}
                                                style={{ cursor: 'pointer' }}
                                            />
                                            <span>{cat}</span>
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Level Filter */}
                        <div style={{ marginBottom: 'var(--spacing-xl)', paddingBottom: 'var(--spacing-lg)', borderBottom: '1px solid #E5E7EB' }}>
                            <button onClick={() => toggleSection('level')} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', padding: '8px 0', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '1rem' }}>
                                Level
                                {expandedSections.level ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                            </button>
                            {expandedSections.level && (
                                <div style={{ marginTop: 'var(--spacing-md)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
                                    {levels.map(level => (
                                        <label key={level} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: '4px 0' }}>
                                            <input
                                                type="checkbox"
                                                checked={selectedLevels.includes(level)}
                                                onChange={() => toggleFilter(selectedLevels, setSelectedLevels, level)}
                                                style={{ cursor: 'pointer' }}
                                            />
                                            <span>{level}</span>
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Clear Filters */}
                        <button onClick={clearAllFilters} style={{ width: '100%', padding: '10px', border: '1px solid var(--color-primary)', backgroundColor: 'white', color: 'var(--color-primary)', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontWeight: 600 }}>
                            Clear All Filters
                        </button>
                    </div>
                )}

                {/* Course Results */}
                <div>
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '3rem' }}>
                            <div className="spinner" />
                            <p>Loading courses...</p>
                        </div>
                    ) : (
                        <>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-lg)' }}>
                                <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>{courses.length} results</h2>
                            </div>

                            {/* Course Grid */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--spacing-lg)' }}>
                                {courses.map(course => (
                                    <Link to={`/courses/${course.id || course.id}`} key={course.id || course.id} style={{ textDecoration: 'none', color: 'inherit' }}>
                                        <div className="card" style={{ padding: 0, overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column', transition: 'transform 0.2s, box-shadow 0.2s' }} onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.1)'; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}>
                                            {/* Course Image */}
                                            <div style={{ position: 'relative', width: '100%', paddingTop: '56.25%', overflow: 'hidden', backgroundColor: '#f3f4f6' }}>
                                                <img
                                                    src={getImageUrl(course.image)}
                                                    alt={course.title}
                                                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                                                />
                                                {course.bestseller && (
                                                    <div style={{ position: 'absolute', top: '12px', left: '12px', padding: '4px 8px', backgroundColor: '#FEF3C7', color: '#92400E', borderRadius: 'var(--radius-sm)', fontSize: '0.75rem', fontWeight: 700 }}>
                                                        Bestseller
                                                    </div>
                                                )}
                                            </div>

                                            {/* Course Info */}
                                            <div style={{ padding: 'var(--spacing-md)', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '4px', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                                    {course.title}
                                                </h3>
                                                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '8px' }}>
                                                    {course.instructor?.displayName || 'Unknown Instructor'}
                                                </p>

                                                {/* Rating */}
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                                                    <span style={{ fontWeight: 700, color: '#B45309' }}>{course.rating ? course.rating.toFixed(1) : '0.0'}</span>
                                                    <div style={{ display: 'flex', gap: '2px' }}>
                                                        {[...Array(5)].map((_, i) => (
                                                            <Star key={i} size={12} fill={i < Math.floor(course.rating || 0) ? '#F59E0B' : 'none'} color={i < Math.floor(course.rating || 0) ? '#F59E0B' : '#D1D5DB'} />
                                                        ))}
                                                    </div>
                                                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                                                        ({course.numReviews || 0})
                                                    </span>
                                                </div>

                                                {/* Meta Info */}
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)', fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '8px', flexWrap: 'wrap' }}>
                                                    {course.duration && (
                                                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                            <Clock size={12} /> {course.duration}
                                                        </span>
                                                    )}
                                                    <span>•</span>
                                                    <span>{course.level}</span>
                                                </div>

                                                {/* Price */}
                                                <div style={{ marginTop: 'auto', paddingTop: '8px' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                        {course.price === 0 ? (
                                                            <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#10B981' }}>FREE</span>
                                                        ) : (
                                                            <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#111827' }}>₹{course.price}</span>
                                                        )}
                                                        {course.originalPrice && course.originalPrice > course.price && (
                                                            <span style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', textDecoration: 'line-through' }}>₹{course.originalPrice}</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>

                            {/* Empty State */}
                            {courses.length === 0 && !loading && (
                                <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--color-text-muted)' }}>
                                    <Search size={64} style={{ margin: '0 auto var(--spacing-lg)', opacity: 0.3 }} />
                                    <h3>No courses found</h3>
                                    <p>Try adjusting your search or filters</p>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Courses;
