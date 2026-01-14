import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Eye, Share2, Bookmark, User, Calendar, Tag, ThumbsUp } from 'lucide-react';
import { contentService } from '../services/api';
import { useContext } from 'react';
import { DataContext } from '../context/DataContext';
import EngagementBar from '../components/engagement/EngagementBar';

const KnowledgebaseSingle = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { trackEngagement } = useContext(DataContext);
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [hasTrackedView, setHasTrackedView] = useState(false);
    const [relatedArticles, setRelatedArticles] = useState([]);

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                const response = await contentService.getArticleById(id);
                const data = response.data.data;
                setArticle(data);

                // Track view once article is loaded
                if (!hasTrackedView && data) {
                    trackEngagement('knowledgebase', id, 'view');
                    setHasTrackedView(true);
                }

                // Fetch related
                if (data && data.category) {
                    const relatedRes = await contentService.getArticles({ category: data.category, status: 'active' });
                    const relatedData = Array.isArray(relatedRes.data) ? relatedRes.data : relatedRes.data.data;
                    setRelatedArticles(relatedData.filter(a => (a.id || a.id) !== id).slice(0, 3));
                }
            } catch (error) {
                console.error("Error fetching article:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchArticle();
    }, [id, trackEngagement, hasTrackedView]);

    const handleShare = async () => {
        try {
            await trackEngagement('knowledgebase', id, 'share');
            if (navigator.share) {
                await navigator.share({
                    title: article.title,
                    text: article.description,
                    url: window.location.href,
                });
            } else {
                navigator.clipboard.writeText(window.location.href);
                alert('Article link copied to clipboard!');
            }
        } catch (err) {
            console.error("Failed to share article:", err);
        }
    };

    const handleBookmark = async () => {
        try {
            await trackEngagement('knowledgebase', id, 'bookmark');
        } catch (err) {
            console.error("Failed to bookmark article:", err);
        }
    };

    const handleLike = async () => {
        try {
            await trackEngagement('knowledgebase', id, 'like');
        } catch (err) {
            console.error("Failed to like article:", err);
        }
    };

    if (loading) return <div className="p-8 text-center">Loading article...</div>;

    if (!article) {
        return (
            <div className="container mt-lg" style={{ textAlign: 'center', padding: '4rem 0' }}>
                <h2>Article Not Found</h2>
                <p style={{ marginTop: '1rem', color: 'var(--color-text-muted)' }}>The article you're looking for doesn't exist.</p>
                <button onClick={() => navigate('/knowledgebase')} style={{ marginTop: '2rem', padding: '12px 24px', backgroundColor: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer' }}>
                    Back to Knowledge Base
                </button>
            </div>
        );
    }

    return (
        <div className="container mt-lg">
            <button onClick={() => navigate('/knowledgebase')} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', border: '1px solid #E5E7EB', backgroundColor: 'white', borderRadius: 'var(--radius-md)', cursor: 'pointer', marginBottom: 'var(--spacing-xl)', fontWeight: 500 }}>
                <ArrowLeft size={18} /> Back to Knowledge Base
            </button>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 'var(--spacing-2xl)' }}>

                {/* Main Content */}
                <div>
                    {/* Article Header */}
                    <div style={{ marginBottom: 'var(--spacing-2xl)' }}>
                        <span style={{ display: 'inline-block', padding: '4px 12px', backgroundColor: '#EEF2FF', color: '#4338CA', borderRadius: 'var(--radius-full)', fontSize: '0.85rem', fontWeight: 600, marginBottom: 'var(--spacing-md)' }}>
                            {article.category}
                        </span>
                        <h1 style={{ fontSize: '2.5rem', lineHeight: 1.2, marginBottom: 'var(--spacing-lg)' }}>{article.title}</h1>

                        {/* Meta Information */}
                        <div style={{ display: 'flex', gap: 'var(--spacing-xl)', flexWrap: 'wrap', paddingBottom: 'var(--spacing-lg)', borderBottom: '1px solid #E5E7EB', marginBottom: 'var(--spacing-lg)' }}>
                            {article.author && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-text-muted)' }}>
                                    <User size={16} />
                                    <span>{article.author}</span>
                                </div>
                            )}
                            {article.updatedAt && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-text-muted)' }}>
                                    <Calendar size={16} />
                                    <span>{new Date(article.updatedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                </div>
                            )}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-text-muted)' }}>
                                <Eye size={16} />
                                <span>{article.views?.toLocaleString() || 0} views</span>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <EngagementBar
                            views={article.views || 0}
                            shares={article.shares || 0}
                            bookmarks={article.bookmarks || 0}
                            onShare={handleShare}
                            onBookmark={handleBookmark}
                            className="mb-8"
                        />
                    </div>

                    {/* YouTube Video (if available) */}
                    {article.videoUrl && (
                        <div style={{ width: '100%', marginBottom: 'var(--spacing-2xl)' }}>
                            <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: 'var(--radius-lg)' }}>
                                <iframe
                                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                                    src={article.videoUrl.replace('watch?v=', 'embed/')} // Simple replacement, might need more robust logic
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    title={article.videoName || article.title}
                                ></iframe>
                            </div>
                        </div>
                    )}

                    {/* Featured Image */}
                    {article.image && (
                        <div style={{ width: '100%', height: '400px', borderRadius: 'var(--radius-lg)', overflow: 'hidden', marginBottom: 'var(--spacing-2xl)' }}>
                            <img src={article.image} alt={article.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                    )}

                    {/* Article Content */}
                    <div style={{ fontSize: '1.1rem', lineHeight: 1.8, color: 'var(--color-text-main)', whiteSpace: 'pre-wrap' }}>
                        {/* Dangerous HTML rendering removed for safety, using text for now unless user confirms safe HTML content */}
                        {article.description || article.content}
                    </div>
                </div>

                {/* Sidebar */}
                <div>
                    {/* Related Articles */}
                    {relatedArticles.length > 0 && (
                        <div className="card" style={{ padding: 'var(--spacing-lg)', position: 'sticky', top: '100px' }}>
                            <h3 style={{ fontSize: '1.1rem', marginBottom: 'var(--spacing-md)' }}>Related Articles</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                                {relatedArticles.map(related => (
                                    <div key={related.id || related.id} onClick={() => navigate(`/knowledgebase/${related.id || related.id}`)} style={{ cursor: 'pointer', paddingBottom: 'var(--spacing-md)', borderBottom: '1px solid #E5E7EB' }}>
                                        <div style={{ display: 'flex', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-sm)' }}>
                                            {related.image && (
                                                <div style={{ width: '60px', height: '60px', borderRadius: 'var(--radius-sm)', overflow: 'hidden', flexShrink: 0 }}>
                                                    <img src={related.image} alt={related.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                </div>
                                            )}
                                            <div style={{ flex: 1 }}>
                                                <h4 style={{ fontSize: '0.9rem', marginBottom: '4px', lineHeight: 1.3 }}>{related.title}</h4>
                                                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{related.category}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default KnowledgebaseSingle;
