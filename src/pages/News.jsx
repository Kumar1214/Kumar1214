import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, User, ArrowRight, Globe } from 'lucide-react';
import api from '../utils/api';

import { useData } from '../context/useData';

const News = () => {
    // We can't strictly use useData for pagination if we want incremental loading unless we update the context.
    // For now, let's fetch news locally for pagination support or stick to useData for initial and only paginated for external.
    // Actually, useData pulls ALL news. For pagination, we might need a separate state if we want to fetch more from API.
    // Given the task, let's stick to useData for internal (as it seems to fetch all) but filtered, OR refactor to fetch from API.
    // Refactor to fetch from API is better for "Load More".

    const navigate = useNavigate();
    const [internalNews, setInternalNews] = useState([]);
    const [externalNews, setExternalNews] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('all');

    const [internalPage, setInternalPage] = useState(1);
    const [externalPage, setExternalPage] = useState(1);
    const [hasMoreInternal, setHasMoreInternal] = useState(true);
    const [hasMoreExternal, setHasMoreExternal] = useState(true);
    const [loadingInternal, setLoadingInternal] = useState(false);
    const [loadingExternal, setLoadingExternal] = useState(false);

    const categories = ['All', 'Gaushala', 'Events', 'Research', 'Community'];
    const ITEMS_PER_PAGE = 9;

    // Fetch Internal News
    const fetchInternalPredictions = async (page, reset = false) => {
        setLoadingInternal(true);
        try {
            const res = await api.get('/news', {
                params: {
                    page,
                    limit: ITEMS_PER_PAGE,
                    category: selectedCategory !== 'all' ? selectedCategory : undefined
                }
            });

            if (res.data.success) {
                const newArticles = res.data.data;
                setInternalNews(prev => reset ? newArticles : [...prev, ...newArticles]);
                // If we got fewer items than limit, no more pages
                setHasMoreInternal(newArticles.length === ITEMS_PER_PAGE);
            }
        } catch (error) {
            console.error("Failed to fetch internal news", error);
        } finally {
            setLoadingInternal(false);
        }
    };

    // Fetch External News
    const fetchExternal = async (page, reset = false) => {
        setLoadingExternal(true);
        try {
            const res = await api.get('/news/external', {
                params: {
                    page,
                    pageSize: 6 // Smaller batch for external
                }
            });
            console.log('External News Response:', res.data); // Debug
            if (res.data && res.data.articles) {
                const newArticles = res.data.articles;
                setExternalNews(prev => reset ? newArticles : [...prev, ...newArticles]);
                setHasMoreExternal(newArticles.length === 6);
            } else {
                setHasMoreExternal(false);
            }
        } catch (error) {
            console.error("Failed to fetch external news", error);
        } finally {
            setLoadingExternal(false);
        }
    };

    // Initial Load & Category Change
    React.useEffect(() => {
        setInternalPage(1);
        setInternalNews([]);
        fetchInternalPredictions(1, true);
    }, [selectedCategory]);

    // Initial Load for External
    React.useEffect(() => {
        fetchExternal(1, true);
    }, []);

    const handleLoadMoreInternal = () => {
        const nextPage = internalPage + 1;
        setInternalPage(nextPage);
        fetchInternalPredictions(nextPage);
    };

    const handleLoadMoreExternal = () => {
        const nextPage = externalPage + 1;
        setExternalPage(nextPage);
        fetchExternal(nextPage);
    };

    const featuredArticle = internalNews.find(article => article.featured) || internalNews[0];

    return (
        <div>
            {/* Hero Section */}
            <div style={{
                backgroundColor: 'var(--color-primary)',
                color: 'white',
                padding: '3rem 0',
                textAlign: 'center'
            }}>
                <div className="container">
                    <h1 style={{ fontSize: '2.5rem', marginBottom: 'var(--spacing-sm)' }}>GauNewz</h1>
                    <p style={{ fontSize: '1.1rem', opacity: 0.9 }}>
                        Latest updates on cow welfare, research, and community initiatives
                    </p>
                </div>
            </div>

            <div className="container mt-lg">

                {/* Featured Article */}
                {featuredArticle && (
                    <div
                        onClick={() => navigate(`/news/${featuredArticle.id}`)}
                        className="card"
                        style={{
                            marginBottom: 'var(--spacing-3xl)',
                            overflow: 'hidden',
                            cursor: 'pointer',
                            transition: 'transform 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-xl)' }}>
                            <div style={{ height: '400px', overflow: 'hidden' }}>
                                <img
                                    src={featuredArticle.featuredImage || featuredArticle.image}
                                    alt={featuredArticle.title}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            </div>
                            <div style={{ padding: 'var(--spacing-xl)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                <span style={{
                                    display: 'inline-block',
                                    backgroundColor: 'var(--color-primary)',
                                    color: 'white',
                                    padding: '4px 12px',
                                    borderRadius: 'var(--radius-full)',
                                    fontSize: '0.85rem',
                                    fontWeight: 600,
                                    marginBottom: 'var(--spacing-md)',
                                    width: 'fit-content'
                                }}>
                                    FEATURED
                                </span>
                                <h2 style={{ fontSize: '2rem', marginBottom: 'var(--spacing-md)', lineHeight: 1.3 }}>
                                    {featuredArticle.title}
                                </h2>
                                <p style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--spacing-lg)', lineHeight: 1.6 }}>
                                    {featuredArticle.excerpt}
                                </p>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-lg)', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <User size={16} /> {featuredArticle.author}
                                    </span>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <Calendar size={16} /> {featuredArticle.publishDate || featuredArticle.date}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Category Filter */}
                <div style={{
                    display: 'flex',
                    gap: 'var(--spacing-md)',
                    marginBottom: 'var(--spacing-2xl)',
                    flexWrap: 'wrap'
                }}>
                    {categories.map(category => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category.toLowerCase())}
                            style={{
                                padding: '8px 20px',
                                borderRadius: 'var(--radius-full)',
                                border: 'none',
                                backgroundColor: selectedCategory === category.toLowerCase() ? 'var(--color-primary)' : '#F3F4F6',
                                color: selectedCategory === category.toLowerCase() ? 'white' : 'var(--color-text-main)',
                                cursor: 'pointer',
                                fontWeight: 600,
                                transition: 'all 0.2s'
                            }}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {/* News Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                    gap: 'var(--spacing-xl)',
                    marginBottom: 'var(--spacing-3xl)'
                }}>
                    {internalNews.filter(article => article.id !== featuredArticle?.id).map(article => (
                        <div
                            key={article.id}
                            onClick={() => navigate(`/news/${article.id}`)}
                            className="card"
                            style={{
                                overflow: 'hidden',
                                cursor: 'pointer',
                                transition: 'transform 0.2s'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                        >
                            <div style={{ height: '200px', overflow: 'hidden' }}>
                                <img
                                    src={article.featuredImage || article.image}
                                    alt={article.title}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            </div>
                            <div style={{ padding: 'var(--spacing-lg)' }}>
                                <span style={{
                                    color: 'var(--color-primary)',
                                    fontSize: '0.85rem',
                                    fontWeight: 600,
                                    marginBottom: '8px',
                                    display: 'block'
                                }}>
                                    {article.category}
                                </span>
                                <h3 style={{ fontSize: '1.25rem', marginBottom: 'var(--spacing-sm)', lineHeight: 1.4 }}>
                                    {article.title}
                                </h3>
                                <p style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--spacing-md)', lineHeight: 1.6 }}>
                                    {article.excerpt}
                                </p>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    fontSize: '0.85rem',
                                    color: 'var(--color-text-muted)',
                                    paddingTop: 'var(--spacing-md)',
                                    borderTop: '1px solid #E5E7EB'
                                }}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <Calendar size={14} /> {article.publishDate || article.date}
                                    </span>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--color-primary)', fontWeight: 600 }}>
                                        Read More <ArrowRight size={14} />
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Internal News Load More */}
                {hasMoreInternal && (
                    <div className="flex justify-center mb-16">
                        <button
                            onClick={handleLoadMoreInternal}
                            disabled={loadingInternal}
                            className="px-6 py-2 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
                        >
                            {loadingInternal ? 'Loading...' : 'Load More News'}
                        </button>
                    </div>
                )}

                {/* External News Section */}
                <div className="mb-16">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                        <Globe size={24} className="text-orange-500" />
                        Global Headlines
                        <span className="text-sm font-normal text-gray-500 ml-2">(Powered by Event Registry)</span>
                    </h2>

                    {externalNews.length > 0 ? (
                        <>
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                                gap: 'var(--spacing-xl)'
                            }}>
                                {externalNews.map((article, index) => (
                                    <a
                                        key={index}
                                        href={article.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="card hover:shadow-lg transition-all block text-inherit no-underline"
                                        style={{ overflow: 'hidden' }}
                                    >
                                        {article.urlToImage && (
                                            <div style={{ height: '180px', overflow: 'hidden' }}>
                                                <img
                                                    src={article.urlToImage}
                                                    alt={article.title}
                                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                    onError={(e) => e.target.style.display = 'none'}
                                                />
                                            </div>
                                        )}
                                        <div className="p-4">
                                            <h3 className="font-semibold text-lg mb-2 line-clamp-2">{article.title}</h3>
                                            <p className="text-sm text-gray-600 line-clamp-3 mb-4">{article.description}</p>
                                            <div className="flex justify-between items-center text-xs text-gray-500">
                                                <span>{article.source?.name}</span>
                                                <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </a>
                                ))}
                            </div>

                            {/* External News Load More */}
                            {hasMoreExternal && (
                                <div className="flex justify-center mt-8">
                                    <button
                                        onClick={handleLoadMoreExternal}
                                        disabled={loadingExternal}
                                        className="px-6 py-2 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-colors"
                                    >
                                        {loadingExternal ? 'Loading...' : 'Load More Global News'}
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            {loadingExternal ? 'Loading global headlines...' : 'No global headlines available at the moment.'}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default News;
