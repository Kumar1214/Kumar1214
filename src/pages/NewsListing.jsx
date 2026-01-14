import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { contentService } from '../services/api';
import { getImageUrl } from '../utils/imageHelper';
import { Search, TrendingUp, Newspaper, Calendar, User, Eye, Tag } from 'lucide-react';

const NewsListing = () => {
    const navigate = useNavigate();
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const response = await contentService.getNews();
                let data = Array.isArray(response.data) ? response.data : response.data.data;

                setNews(data || []);
            } catch (error) {
                console.error("Error fetching news:", error);
                // setNews([]); // Ensure empty array on error, removed dummy data
            } finally {
                setLoading(false);
            }
        };
        fetchNews();
    }, []);

    // Derive categories
    const categoriesSet = new Set(news.map(n => n.category).filter(Boolean));
    const newsCategories = Array.from(categoriesSet).map(name => ({
        id: name.toLowerCase().replace(/\s+/g, '-'),
        name: name,
        icon: <Tag size={16} />
    }));


    // Filter news by category and search
    const filteredNews = news.filter(article => {
        const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
        const tags = Array.isArray(article.tags) ? article.tags : (typeof article.tags === 'string' ? article.tags.split(',') : []);
        const matchesSearch = searchQuery === '' ||
            article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            article.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesCategory && matchesSearch && (article.status === 'published' || article.status === 'active');
    });

    // Get featured article (most recent published or featured)
    const featuredArticle = filteredNews.find(n => n.featured) || (filteredNews.length > 0 ? filteredNews[0] : null);

    // Get remaining articles (exclude featured one)
    const regularArticles = filteredNews.filter(n => n.id !== featuredArticle?.id && n.id !== featuredArticle?.id);

    if (loading) {
        return <div className="p-8 text-center">Loading news and updates...</div>;
    }

    return (
        <div>
            {/* Hero Section */}
            <div style={{
                background: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
                color: 'white',
                padding: '4rem 0',
                textAlign: 'center'
            }}>
                <div className="container">
                    <Newspaper size={48} style={{ margin: '0 auto var(--spacing-md)' }} />
                    <h1 style={{ fontSize: '3rem', marginBottom: 'var(--spacing-md)' }}>News & Updates</h1>
                    <p style={{ fontSize: '1.25rem', marginBottom: 'var(--spacing-xl)', opacity: 0.9 }}>
                        Stay informed with the latest news, events, and insights from the spiritual world
                    </p>
                    <div style={{ maxWidth: '600px', margin: '0 auto', position: 'relative' }}>
                        <input
                            type="text"
                            placeholder="Search news articles..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '16px 50px 16px 20px',
                                borderRadius: 'var(--radius-full)',
                                border: 'none',
                                fontSize: '1rem'
                            }}
                        />
                        <Search
                            size={20}
                            style={{
                                position: 'absolute',
                                right: '20px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                color: 'var(--color-text-muted)'
                            }}
                        />
                    </div>
                </div>
            </div>

            <div className="container mt-lg">

                {/* Quick Stats */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: 'var(--spacing-lg)',
                    marginBottom: 'var(--spacing-3xl)'
                }}>
                    <div className="card" style={{ padding: 'var(--spacing-lg)', textAlign: 'center' }}>
                        <div style={{ fontSize: '2.5rem', fontWeight: 700, color: '#3B82F6' }}>{news.filter(n => n.status === 'published' || n.status === 'active').length}+</div>
                        <div style={{ color: 'var(--color-text-muted)' }}>Published Articles</div>
                    </div>
                    <div className="card" style={{ padding: 'var(--spacing-lg)', textAlign: 'center' }}>
                        <div style={{ fontSize: '2.5rem', fontWeight: 700, color: '#3B82F6' }}>{newsCategories.length}</div>
                        <div style={{ color: 'var(--color-text-muted)' }}>Categories</div>
                    </div>
                    <div className="card" style={{ padding: 'var(--spacing-lg)', textAlign: 'center' }}>
                        <div style={{ fontSize: '2.5rem', fontWeight: 700, color: '#3B82F6' }}>
                            {news.reduce((sum, n) => sum + (n.views || 0), 0).toLocaleString()}+
                        </div>
                        <div style={{ color: 'var(--color-text-muted)' }}>Total Views</div>
                    </div>
                </div>

                {/* Category Filter */}
                <div style={{
                    display: 'flex',
                    gap: 'var(--spacing-md)',
                    marginBottom: 'var(--spacing-2xl)',
                    flexWrap: 'wrap',
                    justifyContent: 'center'
                }}>
                    <button
                        onClick={() => setSelectedCategory('all')}
                        style={{
                            padding: '10px 24px',
                            borderRadius: 'var(--radius-full)',
                            border: 'none',
                            backgroundColor: selectedCategory === 'all' ? '#3B82F6' : '#F3F4F6',
                            color: selectedCategory === 'all' ? 'white' : 'var(--color-text-main)',
                            cursor: 'pointer',
                            fontWeight: 600,
                            transition: 'all 0.2s'
                        }}
                    >
                        All News
                    </button>
                    {newsCategories.map(category => (
                        <button
                            key={category.id}
                            onClick={() => setSelectedCategory(category.name)}
                            style={{
                                padding: '10px 24px',
                                borderRadius: 'var(--radius-full)',
                                border: 'none',
                                backgroundColor: selectedCategory === category.name ? '#3B82F6' : '#F3F4F6',
                                color: selectedCategory === category.name ? 'white' : 'var(--color-text-main)',
                                cursor: 'pointer',
                                fontWeight: 600,
                                transition: 'all 0.2s',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px'
                            }}
                        >
                            <span>{category.icon}</span>
                            <span>{category.name}</span>
                        </button>
                    ))}
                </div>

                {/* Featured Article */}
                {featuredArticle && (
                    <div style={{ marginBottom: 'var(--spacing-3xl)' }}>
                        <h2 style={{ fontSize: '1.75rem', marginBottom: 'var(--spacing-lg)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <TrendingUp size={28} /> Featured Story
                        </h2>
                        <div
                            onClick={() => navigate(`/news/${featuredArticle.id || featuredArticle.id}`)}
                            className="card"
                            style={{
                                overflow: 'hidden',
                                cursor: 'pointer',
                                transition: 'transform 0.2s'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                        >
                            <div className="featured-grid">
                                <div style={{ height: '300px', overflow: 'hidden' }}>
                                    <img
                                        src={getImageUrl(featuredArticle.featuredImage)}
                                        alt={featuredArticle.title}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                </div>
                                <div style={{ padding: 'var(--spacing-xl)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-sm)' }}>
                                        <span style={{
                                            padding: '4px 12px',
                                            backgroundColor: '#DBEAFE',
                                            color: '#1E40AF',
                                            borderRadius: 'var(--radius-full)',
                                            fontSize: '0.85rem',
                                            fontWeight: 600
                                        }}>
                                            {featuredArticle.category}
                                        </span>
                                        <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <Calendar size={14} /> {featuredArticle.publishDate ? new Date(featuredArticle.publishDate).toLocaleDateString() : 'Recently'}
                                        </span>
                                    </div>
                                    <h3 style={{ fontSize: '2rem', marginBottom: 'var(--spacing-sm)' }}>{featuredArticle.title}</h3>
                                    <p style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--spacing-lg)', lineHeight: 1.6 }}>
                                        {featuredArticle.excerpt}
                                    </p>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-lg)', color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <User size={16} /> {featuredArticle.author}
                                        </span>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <Eye size={16} /> {featuredArticle.views?.toLocaleString() || 0} views
                                        </span>
                                    </div>
                                    {(() => {
                                        const tags = Array.isArray(featuredArticle.tags) ? featuredArticle.tags : (typeof featuredArticle.tags === 'string' ? featuredArticle.tags.split(',') : []);
                                        return tags.length > 0 && (
                                            <div style={{ display: 'flex', gap: '8px', marginTop: 'var(--spacing-md)', flexWrap: 'wrap' }}>
                                                {tags.map((tag, idx) => (
                                                    <span key={idx} style={{
                                                        padding: '2px 10px',
                                                        backgroundColor: '#F3F4F6',
                                                        color: '#6B7280',
                                                        borderRadius: 'var(--radius-full)',
                                                        fontSize: '0.75rem'
                                                    }}>
                                                        #{tag.trim()}
                                                    </span>
                                                ))}
                                            </div>
                                        );
                                    })()}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* All Articles Grid */}
                <h2 style={{ fontSize: '1.75rem', marginBottom: 'var(--spacing-lg)' }}>
                    {selectedCategory === 'all' ? 'Latest News' : `${selectedCategory} News`}
                </h2>

                {filteredNews.length === 0 ? (
                    <div className="card" style={{ padding: 'var(--spacing-3xl)', textAlign: 'center' }}>
                        <Newspaper size={48} style={{ margin: '0 auto var(--spacing-md)', color: '#D1D5DB' }} />
                        <h3 style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--spacing-sm)' }}>No articles found</h3>
                        <p style={{ color: 'var(--color-text-muted)' }}>Try adjusting your filters or search query</p>
                    </div>
                ) : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                        gap: 'var(--spacing-lg)',
                        marginBottom: 'var(--spacing-3xl)'
                    }}>
                        {regularArticles.map(article => (
                            <div
                                key={article.id || article.id}
                                onClick={() => navigate(`/news/${article.id || article.id}`)}
                                className="card"
                                style={{
                                    overflow: 'hidden',
                                    cursor: 'pointer',
                                    transition: 'transform 0.2s',
                                    display: 'flex',
                                    flexDirection: 'column'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                            >
                                <div style={{ position: 'relative', height: '200px', overflow: 'hidden' }}>
                                    <img
                                        src={getImageUrl(article.featuredImage)}
                                        alt={article.title}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                    <div style={{
                                        position: 'absolute',
                                        top: '12px',
                                        left: '12px',
                                        padding: '4px 12px',
                                        backgroundColor: 'rgba(59, 130, 246, 0.9)',
                                        color: 'white',
                                        borderRadius: 'var(--radius-full)',
                                        fontSize: '0.85rem',
                                        fontWeight: 600
                                    }}>
                                        {article.category}
                                    </div>
                                </div>
                                <div style={{ padding: 'var(--spacing-lg)', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: 'var(--spacing-sm)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <Calendar size={14} /> {article.publishDate ? new Date(article.publishDate).toLocaleDateString() : 'Recently'}
                                    </div>
                                    <h3 style={{ fontSize: '1.25rem', marginBottom: 'var(--spacing-sm)', lineHeight: 1.4 }}>{article.title}</h3>
                                    <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: 'var(--spacing-md)', lineHeight: 1.5, flex: 1 }}>
                                        {article.excerpt}
                                    </p>
                                    <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: 'var(--spacing-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <User size={14} /> {article.author}
                                        </span>
                                        <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <Eye size={14} /> {article.views?.toLocaleString() || 0}
                                        </span>
                                    </div>
                                    {(() => {
                                        const tags = Array.isArray(article.tags) ? article.tags : (typeof article.tags === 'string' ? article.tags.split(',') : []);
                                        return tags.length > 0 && (
                                            <div style={{ display: 'flex', gap: '6px', marginTop: 'var(--spacing-sm)', flexWrap: 'wrap' }}>
                                                {tags.slice(0, 3).map((tag, idx) => (
                                                    <span key={idx} style={{
                                                        padding: '2px 8px',
                                                        backgroundColor: '#F3F4F6',
                                                        color: '#6B7280',
                                                        borderRadius: 'var(--radius-full)',
                                                        fontSize: '0.7rem'
                                                    }}>
                                                        #{tag.trim()}
                                                    </span>
                                                ))}
                                            </div>
                                        );
                                    })()}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

            </div>
        </div>
    );
};

export default NewsListing;
