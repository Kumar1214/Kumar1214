import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, X, Clock, Eye } from 'lucide-react';
import { contentService } from '../services/api';

const KnowledgebaseSearch = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [showFilters, setShowFilters] = useState(false);
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(false);

    const categories = ['All', 'Cow Care', 'Ayurveda', 'Yoga', 'Spirituality', 'Vedic Studies', 'Nutrition'];

    useEffect(() => {
        const fetchArticles = async () => {
            setLoading(true);
            try {
                const params = { status: 'active' }; // Only active articles
                if (searchQuery) params.search = searchQuery;
                if (selectedCategory !== 'all') params.category = selectedCategory;

                const response = await contentService.getArticles(params);
                const data = Array.isArray(response.data) ? response.data : response.data.data;
                setArticles(data || []);
            } catch (error) {
                console.error("Error fetching articles:", error);
            } finally {
                setLoading(false);
            }
        };

        const timeoutId = setTimeout(() => {
            fetchArticles();
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [searchQuery, selectedCategory]);

    return (
        <div className="container mt-lg">
            <h1 style={{ fontSize: '2rem', marginBottom: 'var(--spacing-xl)' }}>Search Knowledge Base</h1>
            <div style={{ marginBottom: 'var(--spacing-xl)' }}>
                <div style={{ position: 'relative', maxWidth: '600px' }}>
                    <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search articles..." style={{ width: '100%', padding: '14px 50px 14px 20px', borderRadius: 'var(--radius-md)', border: '2px solid #E5E7EB', fontSize: '1rem' }} />
                    <Search size={20} style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: showFilters ? '250px 1fr' : '1fr', gap: 'var(--spacing-xl)' }}>
                <button onClick={() => setShowFilters(!showFilters)} style={{ display: showFilters ? 'none' : 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', border: '1px solid #E5E7EB', backgroundColor: 'white', borderRadius: 'var(--radius-md)', cursor: 'pointer', marginBottom: 'var(--spacing-lg)', width: 'fit-content' }}>
                    <Filter size={18} /> Show Filters
                </button>

                {showFilters && (
                    <div className="card" style={{ padding: 'var(--spacing-lg)', height: 'fit-content', position: 'sticky', top: '100px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-lg)' }}>
                            <h3 style={{ fontSize: '1.25rem' }}>Filters</h3>
                            <button onClick={() => setShowFilters(false)} style={{ padding: '4px', border: 'none', background: 'none', cursor: 'pointer' }}><X size={20} /></button>
                        </div>
                        <div>
                            <h4 style={{ fontSize: '1rem', marginBottom: 'var(--spacing-md)' }}>Category</h4>
                            {categories.map(cat => (
                                <label key={cat} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginBottom: 'var(--spacing-sm)' }}>
                                    <input type="radio" name="category" checked={selectedCategory === cat.toLowerCase()} onChange={() => setSelectedCategory(cat.toLowerCase())} />
                                    {cat}
                                </label>
                            ))}
                        </div>
                        <button onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }} style={{ marginTop: 'var(--spacing-lg)', width: '100%', padding: '10px', border: '1px solid #6366F1', backgroundColor: 'white', color: '#6366F1', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontWeight: 600 }}>
                            Clear All Filters
                        </button>
                    </div>
                )}

                <div>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: 'var(--spacing-lg)' }}>{articles.length} Results</h2>
                    {loading ? (
                        <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>
                    ) : articles.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--color-text-muted)' }}>
                            <Search size={64} style={{ margin: '0 auto var(--spacing-lg)', opacity: 0.3 }} />
                            <h3>No articles found</h3>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                            {articles.map(article => (
                                <div key={article.id || article.id} onClick={() => navigate(`/knowledgebase/${article.id || article.id}`)} className="card" style={{ padding: 'var(--spacing-md)', display: 'flex', gap: 'var(--spacing-md)', cursor: 'pointer', transition: 'transform 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(4px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateX(0)'}>
                                    <div style={{ width: '100px', height: '100px', borderRadius: 'var(--radius-md)', overflow: 'hidden', flexShrink: 0 }}>
                                        <img src={article.image || 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?auto=format&fit=crop&q=80&w=200'} alt={article.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <h3 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>{article.title}</h3>
                                        <div style={{ display: 'flex', gap: 'var(--spacing-md)', fontSize: '0.85rem', color: 'var(--color-text-muted)', flexWrap: 'wrap' }}>
                                            <span style={{ padding: '2px 8px', backgroundColor: '#EEF2FF', color: '#4338CA', borderRadius: 'var(--radius-sm)', fontWeight: 600 }}>{article.category}</span>
                                            {/* Read time and views might not be in API yet, placeholders */}
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={14} />{new Date(article.createdAt).toLocaleDateString()}</span>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Eye size={14} /> {article.views || 0}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default KnowledgebaseSearch;
