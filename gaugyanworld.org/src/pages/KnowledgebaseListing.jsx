import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Search, Clock, Eye } from 'lucide-react';
import { contentService } from '../services/api';
import { getImageUrl } from '../utils/imageHelper';

const KnowledgebaseListing = () => {
    const navigate = useNavigate();
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const response = await contentService.getArticles();
                // Handle response structure (articles might be in response.data or response.data.data)
                const data = Array.isArray(response.data) ? response.data : response.data.data;
                setArticles(data || []);
            } catch (error) {
                console.error("Error fetching articles:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchArticles();
    }, []);

    // Derive categories from fetched articles
    const uniqueCategories = [...new Set(articles.map(a => a.category).filter(Boolean))];
    const categories = ['All', ...uniqueCategories];

    // Filter articles
    const filteredArticles = articles.filter(article => {
        const matchesCategory = selectedCategory === 'all' ||
            (article.category && article.category.toLowerCase() === selectedCategory.toLowerCase());
        const matchesSearch = searchQuery === '' ||
            article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (article.description && article.description.toLowerCase().includes(searchQuery.toLowerCase()));

        return (article.status === 'active' || article.status === 'published') && matchesCategory && matchesSearch;
    });

    // Find featured article
    const featuredArticle = filteredArticles.find(a => a.featured) || filteredArticles[0];

    if (loading) {
        return <div className="p-8 text-center">Loading knowledge base...</div>;
    }

    return (
        <div>
            <div style={{ background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)', color: 'white', padding: '3rem 0', textAlign: 'center' }}>
                <div className="container">
                    <BookOpen size={48} style={{ margin: '0 auto var(--spacing-md)' }} />
                    <h1 style={{ fontSize: '2.5rem', marginBottom: 'var(--spacing-md)' }}>Knowledge Base</h1>
                    <p style={{ fontSize: '1.1rem', marginBottom: 'var(--spacing-xl)', opacity: 0.9 }}>Comprehensive guides and articles on cow care, wellness, and spirituality</p>
                    <div style={{ maxWidth: '600px', margin: '0 auto', position: 'relative' }}>
                        <input
                            type="text"
                            placeholder="Search articles..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{ width: '100%', padding: '16px 50px 16px 20px', borderRadius: 'var(--radius-full)', border: 'none', fontSize: '1rem' }}
                        />
                        <Search size={20} style={{ position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                    </div>
                </div>
            </div>

            <div className="container mt-lg">
                <div style={{ display: 'flex', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-2xl)', flexWrap: 'wrap', justifyContent: 'center' }}>
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat.toLowerCase())}
                            style={{
                                padding: '10px 24px',
                                borderRadius: 'var(--radius-full)',
                                border: 'none',
                                backgroundColor: selectedCategory === cat.toLowerCase() ? '#6366F1' : '#F3F4F6',
                                color: selectedCategory === cat.toLowerCase() ? 'white' : 'var(--color-text-main)',
                                cursor: 'pointer',
                                fontWeight: 600,
                                transition: 'all 0.2s'
                            }}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {featuredArticle && filteredArticles.length > 0 && (
                    <div style={{ marginBottom: 'var(--spacing-3xl)' }}>
                        <h2 style={{ fontSize: '1.75rem', marginBottom: 'var(--spacing-lg)' }}>Featured Article</h2>
                        <div
                            onClick={() => navigate(`/knowledgebase/${featuredArticle.id || featuredArticle.id}`)}
                            className="card"
                            style={{ overflow: 'hidden', cursor: 'pointer', transition: 'transform 0.2s' }}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                        >
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--spacing-xl)' }}>
                                <div style={{ height: '300px', overflow: 'hidden' }}>
                                    <img
                                        src={getImageUrl(featuredArticle.image || featuredArticle.coverImage)}
                                        alt={featuredArticle.title}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                </div>
                                <div style={{ padding: 'var(--spacing-xl)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                    <span style={{ fontSize: '0.85rem', color: '#6366F1', fontWeight: 600, marginBottom: 'var(--spacing-sm)' }}>
                                        {featuredArticle.category || 'General'}
                                    </span>
                                    <h3 style={{ fontSize: '2rem', marginBottom: 'var(--spacing-md)' }}>{featuredArticle.title}</h3>
                                    <p style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--spacing-lg)', lineHeight: 1.6 }}>
                                        {featuredArticle.description || featuredArticle.excerpt || (featuredArticle.content && featuredArticle.content.substring(0, 150) + '...')}
                                    </p>
                                    <div style={{ display: 'flex', gap: 'var(--spacing-xl)', color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={16} /> {featuredArticle.readTime || '5 min'}</span>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Eye size={16} /> {featuredArticle.views || 0} views</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <h2 style={{ fontSize: '1.75rem', marginBottom: 'var(--spacing-lg)' }}>All Articles</h2>
                {filteredArticles.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">No articles found.</div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 'var(--spacing-lg)', marginBottom: 'var(--spacing-3xl)' }}>
                        {filteredArticles.map(article => (
                            <div
                                key={article.id || article.id}
                                onClick={() => navigate(`/knowledgebase/${article.id || article.id}`)}
                                className="card"
                                style={{ overflow: 'hidden', cursor: 'pointer', transition: 'transform 0.2s' }}
                                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                            >
                                <div style={{ height: '180px', overflow: 'hidden' }}>
                                    <img
                                        src={getImageUrl(article.image || article.coverImage)}
                                        alt={article.title}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                </div>
                                <div style={{ padding: 'var(--spacing-lg)' }}>
                                    <span style={{ fontSize: '0.85rem', color: '#6366F1', fontWeight: 600 }}>{article.category || 'General'}</span>
                                    <h3 style={{ fontSize: '1.25rem', marginTop: '4px', marginBottom: 'var(--spacing-sm)' }}>{article.title}</h3>
                                    <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: 'var(--spacing-md)', lineHeight: 1.5 }}>
                                        {article.description || article.excerpt || (article.content && article.content.substring(0, 100) + '...')}
                                    </p>
                                    <div style={{ display: 'flex', gap: 'var(--spacing-md)', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={14} /> {article.readTime || '5 min'}</span>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Eye size={14} /> {article.views || 0}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default KnowledgebaseListing;
