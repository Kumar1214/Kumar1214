import React, { useState, useEffect } from 'react';
import { Search, Filter, X, BookOpen, Video, Music, Podcast, ShoppingCart, Users, Heart, Calendar } from 'lucide-react';

const AdvancedSearch = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activeFilters, setActiveFilters] = useState([]);
    const [showFilters, setShowFilters] = useState(false);
    
    const [filters, setFilters] = useState({
        contentType: 'all',
        dateRange: { start: '', end: '' },
        category: 'all',
        status: 'all',
        sortBy: 'relevance'
    });

    // Mock data for demonstration - in a real implementation, this would come from API
    const mockData = [
        // Courses
        { id: 1, type: 'course', title: 'Complete Ayurveda Masterclass', category: 'Ayurveda', status: 'published', date: '2024-11-25', instructor: 'Dr. Rajesh Sharma', rating: 4.8, students: 45230 },
        { id: 2, type: 'course', title: 'Yoga for Complete Beginners', category: 'Yoga', status: 'published', date: '2024-10-15', instructor: 'Priya Desai', rating: 4.9, students: 89456 },
        
        // Products
        { id: 101, type: 'product', title: 'Organic Turmeric Powder', category: 'Ayurvedic Products', status: 'published', date: '2024-11-20', price: 299, stock: 150 },
        { id: 102, type: 'product', title: 'Premium Yoga Mat', category: 'Yoga Equipment', status: 'published', date: '2024-11-18', price: 1299, stock: 75 },
        
        // Music
        { id: 201, type: 'music', title: 'Krishna Flute Meditation', category: 'Classical', status: 'published', date: '2024-01-15', artist: 'Pandit Hariprasad Chaurasia', plays: 125000 },
        { id: 202, type: 'music', title: 'Om Chanting', category: 'Meditation', status: 'published', date: '2024-02-20', artist: 'Swami Anand', plays: 89000 },
        
        // Podcasts
        { id: 301, type: 'podcast', title: 'The Science of Ayurveda', category: 'Wellness', status: 'published', date: '2024-11-20', host: 'Dr. Rajesh Sharma', plays: 12500 },
        { id: 302, type: 'podcast', title: 'Meditation for Beginners', category: 'Mindful Living', status: 'published', date: '2024-11-18', host: 'Swami Anand', plays: 18900 },
        
        // Knowledgebase
        { id: 401, type: 'knowledgebase', title: 'गौज्ञान की मूल अवधारणा और सामाजिक उद्देश्य', category: 'Social Welfare', status: 'active', date: '2024-11-20', views: 12000, helpful: 450 },
        { id: 402, type: 'knowledgebase', title: 'Basic Yoga Poses for Beginners', category: 'Yoga and Fitness', status: 'active', date: '2024-11-22', views: 15600, helpful: 678 },
        
        // Cows
        { id: 501, type: 'cow', title: 'Gauri (Gir Breed)', category: 'Adoption', status: 'adopted', date: '2024-01-15', breed: 'Gir', age: 5, monthlyCost: 2500 },
        { id: 502, type: 'cow', title: 'Sundari (Sahiwal Breed)', category: 'Adoption', status: 'available', date: '2024-03-10', breed: 'Sahiwal', age: 3, monthlyCost: 3000 },
        
        // Gaushalas
        { id: 601, type: 'gaushala', title: 'Shri Krishna Gaushala', category: 'Organization', status: 'active', date: '2010-01-01', city: 'Mumbai', state: 'Maharashtra', cows: 250 },
        { id: 602, type: 'gaushala', title: 'Ganga Tier Gaushala', category: 'Organization', status: 'active', date: '2015-01-01', city: 'Varanasi', state: 'Uttar Pradesh', cows: 150 }
    ];

    const contentTypeIcons = {
        course: BookOpen,
        product: ShoppingCart,
        music: Music,
        podcast: Podcast,
        knowledgebase: BookOpen,
        cow: Heart,
        gaushala: Users
    };

    const contentTypeLabels = {
        course: 'Course',
        product: 'Product',
        music: 'Music',
        podcast: 'Podcast',
        knowledgebase: 'Knowledgebase',
        cow: 'Cow',
        gaushala: 'Gaushala'
    };

    const handleSearch = async () => {
        if (!searchTerm.trim() && activeFilters.length === 0) {
            setSearchResults([]);
            return;
        }

        setLoading(true);
        
        // Simulate API delay
        setTimeout(() => {
            let results = [...mockData];
            
            // Apply search term filter
            if (searchTerm.trim()) {
                const term = searchTerm.toLowerCase();
                results = results.filter(item => 
                    item.title.toLowerCase().includes(term) ||
                    (item.category && item.category.toLowerCase().includes(term)) ||
                    (item.instructor && item.instructor.toLowerCase().includes(term)) ||
                    (item.artist && item.artist.toLowerCase().includes(term)) ||
                    (item.host && item.host.toLowerCase().includes(term))
                );
            }
            
            // Apply content type filter
            if (filters.contentType !== 'all') {
                results = results.filter(item => item.type === filters.contentType);
            }
            
            // Apply category filter
            if (filters.category !== 'all') {
                results = results.filter(item => item.category === filters.category);
            }
            
            // Apply status filter
            if (filters.status !== 'all') {
                results = results.filter(item => item.status === filters.status);
            }
            
            // Apply date range filter
            if (filters.dateRange.start || filters.dateRange.end) {
                results = results.filter(item => {
                    const itemDate = new Date(item.date);
                    const startDate = filters.dateRange.start ? new Date(filters.dateRange.start) : null;
                    const endDate = filters.dateRange.end ? new Date(filters.dateRange.end) : null;
                    
                    if (startDate && itemDate < startDate) return false;
                    if (endDate && itemDate > endDate) return false;
                    return true;
                });
            }
            
            // Apply sorting
            if (filters.sortBy === 'dateNewest') {
                results.sort((a, b) => new Date(b.date) - new Date(a.date));
            } else if (filters.sortBy === 'dateOldest') {
                results.sort((a, b) => new Date(a.date) - new Date(b.date));
            } else if (filters.sortBy === 'title') {
                results.sort((a, b) => a.title.localeCompare(b.title));
            }
            
            setSearchResults(results);
            setLoading(false);
        }, 500);
    };

    const clearFilters = () => {
        setFilters({
            contentType: 'all',
            dateRange: { start: '', end: '' },
            category: 'all',
            status: 'all',
            sortBy: 'relevance'
        });
        setActiveFilters([]);
    };

    const applyFilters = () => {
        const active = [];
        if (filters.contentType !== 'all') active.push(`Type: ${contentTypeLabels[filters.contentType]}`);
        if (filters.category !== 'all') active.push(`Category: ${filters.category}`);
        if (filters.status !== 'all') active.push(`Status: ${filters.status}`);
        if (filters.dateRange.start) active.push(`From: ${filters.dateRange.start}`);
        if (filters.dateRange.end) active.push(`To: ${filters.dateRange.end}`);
        
        setActiveFilters(active);
        handleSearch();
        setShowFilters(false);
    };

    useEffect(() => {
        if (searchTerm.trim() || activeFilters.length > 0) {
            handleSearch();
        } else {
            setSearchResults([]);
        }
    }, [searchTerm]);

    return (
        <div>
            {/* Search Header */}
            <div style={{ marginBottom: '30px' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1F2937', marginBottom: '16px' }}>
                    Advanced Search
                </h2>
                <p style={{ color: '#6B7280', marginBottom: '24px' }}>
                    Search across all content types, courses, products, music, podcasts, knowledgebase articles, cows, and gaushalas.
                </p>
                
                {/* Search Bar */}
                <div style={{ position: 'relative', maxWidth: '600px', marginBottom: '20px' }}>
                    <Search size={20} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search across all content..."
                        style={{
                            width: '100%',
                            padding: '12px 12px 12px 40px',
                            border: '1px solid #D1D5DB',
                            borderRadius: '8px',
                            fontSize: '1rem',
                            outline: 'none'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#F97316'}
                        onBlur={(e) => e.target.style.borderColor = '#D1D5DB'}
                    />
                </div>
                
                {/* Active Filters */}
                {activeFilters.length > 0 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '20px' }}>
                        <span style={{ fontSize: '0.9rem', color: '#6B7280' }}>Active filters:</span>
                        {activeFilters.map((filter, index) => (
                            <span 
                                key={index}
                                style={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    gap: '6px', 
                                    padding: '4px 10px', 
                                    backgroundColor: '#F3F4F6', 
                                    borderRadius: '16px', 
                                    fontSize: '0.85rem' 
                                }}
                            >
                                {filter}
                                <button 
                                    onClick={() => {
                                        // In a real implementation, we would remove specific filter
                                        clearFilters();
                                    }}
                                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px' }}
                                >
                                    <X size={14} />
                                </button>
                            </span>
                        ))}
                        <button 
                            onClick={clearFilters}
                            style={{ 
                                background: 'none', 
                                border: 'none', 
                                color: '#F97316', 
                                textDecoration: 'underline', 
                                cursor: 'pointer', 
                                fontSize: '0.85rem' 
                            }}
                        >
                            Clear all
                        </button>
                    </div>
                )}
                
                {/* Filter Toggle Button */}
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '10px 16px',
                        backgroundColor: 'white',
                        color: '#374151',
                        border: '1px solid #D1D5DB',
                        borderRadius: '6px',
                        fontWeight: 500,
                        fontSize: '0.9rem',
                        cursor: 'pointer'
                    }}
                >
                    <Filter size={16} />
                    Advanced Filters
                </button>
            </div>
            
            {/* Advanced Filters Panel */}
            {showFilters && (
                <div style={{ 
                    backgroundColor: 'white', 
                    borderRadius: '8px', 
                    padding: '24px', 
                    marginBottom: '30px', 
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                    border: '1px solid #E5E7EB'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Filter Options</h3>
                        <button 
                            onClick={() => setShowFilters(false)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                        >
                            <X size={20} />
                        </button>
                    </div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '24px' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 500 }}>Content Type</label>
                            <select
                                value={filters.contentType}
                                onChange={(e) => setFilters({ ...filters, contentType: e.target.value })}
                                style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #D1D5DB' }}
                            >
                                <option value="all">All Content Types</option>
                                <option value="course">Courses</option>
                                <option value="product">Products</option>
                                <option value="music">Music</option>
                                <option value="podcast">Podcasts</option>
                                <option value="knowledgebase">Knowledgebase</option>
                                <option value="cow">Cows</option>
                                <option value="gaushala">Gaushalas</option>
                            </select>
                        </div>
                        
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 500 }}>Category</label>
                            <select
                                value={filters.category}
                                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                                style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #D1D5DB' }}
                            >
                                <option value="all">All Categories</option>
                                <option value="Ayurveda">Ayurveda</option>
                                <option value="Yoga">Yoga</option>
                                <option value="Ayurvedic Products">Ayurvedic Products</option>
                                <option value="Yoga Equipment">Yoga Equipment</option>
                                <option value="Classical">Classical Music</option>
                                <option value="Meditation">Meditation</option>
                                <option value="Wellness">Wellness</option>
                                <option value="Social Welfare">Social Welfare</option>
                                <option value="Adoption">Adoption</option>
                                <option value="Organization">Organization</option>
                            </select>
                        </div>
                        
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 500 }}>Status</label>
                            <select
                                value={filters.status}
                                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                                style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #D1D5DB' }}
                            >
                                <option value="all">All Statuses</option>
                                <option value="published">Published</option>
                                <option value="active">Active</option>
                                <option value="draft">Draft</option>
                                <option value="pending">Pending</option>
                                <option value="adopted">Adopted</option>
                                <option value="available">Available</option>
                            </select>
                        </div>
                        
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 500 }}>Sort By</label>
                            <select
                                value={filters.sortBy}
                                onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                                style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #D1D5DB' }}
                            >
                                <option value="relevance">Relevance</option>
                                <option value="dateNewest">Date: Newest First</option>
                                <option value="dateOldest">Date: Oldest First</option>
                                <option value="title">Title A-Z</option>
                            </select>
                        </div>
                        
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 500 }}>Date Range</label>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                <input
                                    type="date"
                                    value={filters.dateRange.start}
                                    onChange={(e) => setFilters({ 
                                        ...filters, 
                                        dateRange: { ...filters.dateRange, start: e.target.value } 
                                    })}
                                    style={{ padding: '10px', borderRadius: '4px', border: '1px solid #D1D5DB' }}
                                />
                                <input
                                    type="date"
                                    value={filters.dateRange.end}
                                    onChange={(e) => setFilters({ 
                                        ...filters, 
                                        dateRange: { ...filters.dateRange, end: e.target.value } 
                                    })}
                                    style={{ padding: '10px', borderRadius: '4px', border: '1px solid #D1D5DB' }}
                                />
                            </div>
                        </div>
                    </div>
                    
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                        <button
                            onClick={clearFilters}
                            style={{
                                padding: '10px 20px',
                                backgroundColor: 'white',
                                color: '#374151',
                                border: '1px solid #D1D5DB',
                                borderRadius: '6px',
                                fontWeight: 500,
                                cursor: 'pointer'
                            }}
                        >
                            Reset
                        </button>
                        <button
                            onClick={applyFilters}
                            style={{
                                padding: '10px 20px',
                                backgroundColor: '#F97316',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                fontWeight: 500,
                                cursor: 'pointer'
                            }}
                        >
                            Apply Filters
                        </button>
                    </div>
                </div>
            )}
            
            {/* Search Results */}
            <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '20px' }}>
                    Search Results ({searchResults.length})
                </h3>
                
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '40px' }}>
                        <div style={{ 
                            width: '40px', 
                            height: '40px', 
                            border: '4px solid #F3F4F6', 
                            borderTop: '4px solid #F97316', 
                            borderRadius: '50%', 
                            animation: 'spin 1s linear infinite',
                            margin: '0 auto 16px'
                        }}></div>
                        <p>Searching...</p>
                    </div>
                ) : searchResults.length === 0 ? (
                    <div style={{ 
                        textAlign: 'center', 
                        padding: '60px 20px', 
                        backgroundColor: 'white', 
                        borderRadius: '8px', 
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}>
                        <Search size={48} style={{ opacity: 0.5, margin: '0 auto 16px', color: '#9CA3AF' }} />
                        <p style={{ color: '#9CA3AF', fontSize: '1.125rem' }}>
                            {searchTerm ? 'No results found. Try different keywords.' : 'Enter a search term to begin.'}
                        </p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gap: '16px' }}>
                        {searchResults.map(item => {
                            const IconComponent = contentTypeIcons[item.type] || BookOpen;
                            return (
                                <div 
                                    key={`${item.type}-${item.id}`}
                                    style={{ 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        padding: '20px', 
                                        backgroundColor: 'white', 
                                        borderRadius: '8px', 
                                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                        transition: 'transform 0.2s, box-shadow 0.2s'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-2px)';
                                        e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                                    }}
                                >
                                    <div style={{ 
                                        padding: '12px', 
                                        borderRadius: '8px', 
                                        backgroundColor: '#F9FAFB',
                                        marginRight: '16px'
                                    }}>
                                        <IconComponent size={24} style={{ color: '#F97316' }} />
                                    </div>
                                    
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                                            <h4 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#1F2937' }}>
                                                {item.title}
                                            </h4>
                                            <span style={{ 
                                                padding: '4px 12px', 
                                                borderRadius: '16px', 
                                                fontSize: '0.75rem', 
                                                fontWeight: 500,
                                                backgroundColor: '#F3F4F6',
                                                color: '#6B7280'
                                            }}>
                                                {contentTypeLabels[item.type]}
                                            </span>
                                        </div>
                                        
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: '#6B7280', fontSize: '0.9rem', flexWrap: 'wrap' }}>
                                            {item.category && (
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#F97316' }}></span>
                                                    {item.category}
                                                </span>
                                            )}
                                            
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                <Calendar size={14} />
                                                {new Date(item.date).toLocaleDateString()}
                                            </span>
                                            
                                            {item.status && (
                                                <span style={{ 
                                                    padding: '2px 8px', 
                                                    borderRadius: '12px', 
                                                    fontSize: '0.75rem',
                                                    backgroundColor: item.status === 'published' || item.status === 'active' ? '#D1FAE5' : 
                                                                  item.status === 'draft' ? '#FEF3C7' : 
                                                                  item.status === 'pending' ? '#E0E7FF' : 
                                                                  item.status === 'adopted' ? '#DDD6FE' : 
                                                                  item.status === 'available' ? '#D1FAE5' : '#F3F4F6',
                                                    color: item.status === 'published' || item.status === 'active' ? '#065F46' : 
                                                           item.status === 'draft' ? '#92400E' : 
                                                           item.status === 'pending' ? '#3730A3' : 
                                                           item.status === 'adopted' ? '#5B21B6' : 
                                                           item.status === 'available' ? '#065F46' : '#6B7280'
                                                }}>
                                                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                                                </span>
                                            )}
                                        </div>
                                        
                                        <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '20px', fontSize: '0.9rem', color: '#6B7280' }}>
                                            {item.rating !== undefined && (
                                                <span>⭐ {item.rating} ({item.students?.toLocaleString() || 0} students)</span>
                                            )}
                                            {item.price !== undefined && (
                                                <span>₹{item.price?.toLocaleString()} (Stock: {item.stock})</span>
                                            )}
                                            {item.plays !== undefined && (
                                                <span>{item.plays?.toLocaleString() || 0} plays</span>
                                            )}
                                            {item.views !== undefined && (
                                                <span>{item.views?.toLocaleString() || 0} views</span>
                                            )}
                                            {item.breed !== undefined && (
                                                <span>{item.breed}, {item.age} years old</span>
                                            )}
                                            {item.cows !== undefined && (
                                                <span>{item.cows} cows</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdvancedSearch;