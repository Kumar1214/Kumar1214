import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, User, Share2, ArrowLeft, Tag, Bookmark } from 'lucide-react';
import Button from '../components/Button';
import { contentService } from '../services/api';
import { DataContext } from '../context/DataContext';
import { useContext } from 'react';
import EngagementBar from '../components/engagement/EngagementBar';

const NewsDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { trackEngagement } = useContext(DataContext);
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [hasTrackedView, setHasTrackedView] = useState(false);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const response = await contentService.getNewsById(id);
                setArticle(response.data.data);

                // Track view once article is loaded
                if (!hasTrackedView && response.data.data) {
                    trackEngagement('news', id, 'view');
                    setHasTrackedView(true);
                }
            } catch (error) {
                console.error("Error fetching news article:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchNews();
    }, [id, trackEngagement, hasTrackedView]);

    const handleShare = async () => {
        try {
            await trackEngagement('news', id, 'share');
            // Basic share functionality
            if (navigator.share) {
                navigator.share({
                    title: article.title,
                    url: window.location.href
                });
            } else {
                alert('URL copied to clipboard!');
                navigator.clipboard.writeText(window.location.href);
            }
        } catch (err) {
            console.error("Share tracking failed:", err);
        }
    };

    const handleBookmark = async () => {
        try {
            await trackEngagement('news', id, 'bookmark');
            // Bookmark logic would go here (e.g. syncing with user profile)
        } catch (err) {
            console.error("Bookmark tracking failed:", err);
        }
    };

    if (loading) return <div className="container mt-lg" style={{ textAlign: 'center', padding: '4rem 0' }}>Loading article...</div>;

    if (!article) {
        return (
            <div className="container mt-lg" style={{ textAlign: 'center', padding: '4rem 0' }}>
                <h2>Article Not Found</h2>
                <Button onClick={() => navigate('/news')} style={{ marginTop: '1rem' }}>Back to News</Button>
            </div>
        );
    }

    return (
        <div className="container mt-lg">
            {/* Back Button */}
            <button
                onClick={() => navigate('/news')}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 16px',
                    border: '1px solid #E5E7EB',
                    backgroundColor: 'white',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    marginBottom: 'var(--spacing-xl)',
                    fontWeight: 500
                }}
            >
                <ArrowLeft size={18} />
                Back to News
            </button>

            <div style={{ maxWidth: '900px', margin: '0 auto' }}>

                {/* Category Badge */}
                {article.category && (
                    <span style={{
                        display: 'inline-block',
                        backgroundColor: 'var(--color-primary)',
                        color: 'white',
                        padding: '6px 16px',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '0.9rem',
                        fontWeight: 600,
                        marginBottom: 'var(--spacing-md)'
                    }}>
                        {article.category}
                    </span>
                )}

                {/* Title */}
                <h1 style={{ fontSize: '2.5rem', marginBottom: 'var(--spacing-lg)', lineHeight: 1.2 }}>
                    {article.title}
                </h1>

                {/* Meta Info */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--spacing-xl)',
                    marginBottom: 'var(--spacing-2xl)',
                    paddingBottom: 'var(--spacing-lg)',
                    borderBottom: '1px solid #E5E7EB'
                }}>
                    {article.author && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-text-muted)' }}>
                            <User size={18} />
                            {article.author}
                        </span>
                    )}
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-text-muted)' }}>
                        <Calendar size={18} />
                        {new Date(article.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                    <EngagementBar
                        views={article.views || 0}
                        shares={article.shares || 0}
                        bookmarks={article.bookmarks || 0}
                        onShare={handleShare}
                        onBookmark={handleBookmark}
                        className="mb-8"
                    />
                </div>

                {/* Featured Image */}
                {article.image && (
                    <div style={{
                        width: '100%',
                        height: '500px',
                        borderRadius: 'var(--radius-lg)',
                        overflow: 'hidden',
                        marginBottom: 'var(--spacing-2xl)'
                    }}>
                        <img
                            src={article.image}
                            alt={article.title}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                    </div>
                )}

                {/* Article Content */}
                <div
                    style={{
                        fontSize: '1.1rem',
                        lineHeight: 1.8,
                        color: 'var(--color-text-main)',
                        marginBottom: 'var(--spacing-3xl)',
                        whiteSpace: 'pre-wrap' // Handle newlines if it's plain text, or remove if HTML
                    }}
                    // Assuming content might be HTML from rich text editor, but default to safe render if simple string
                    dangerouslySetInnerHTML={{ __html: article.content }}
                />

                {/* Tags */}
                {article.tags && article.tags.length > 0 && (
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--spacing-md)',
                        flexWrap: 'wrap',
                        paddingTop: 'var(--spacing-lg)',
                        borderTop: '1px solid #E5E7EB',
                        marginBottom: 'var(--spacing-2xl)'
                    }}>
                        <Tag size={18} color="var(--color-text-muted)" />
                        {article.tags.map((tag, idx) => (
                            <span
                                key={idx}
                                style={{
                                    padding: '4px 12px',
                                    backgroundColor: '#F3F4F6',
                                    borderRadius: 'var(--radius-full)',
                                    fontSize: '0.9rem',
                                    color: 'var(--color-text-muted)'
                                }}
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                )}

                {/* CTA */}
                <div style={{
                    backgroundColor: '#FFF7ED',
                    padding: 'var(--spacing-xl)',
                    borderRadius: 'var(--radius-lg)',
                    textAlign: 'center',
                    marginBottom: 'var(--spacing-3xl)'
                }}>
                    <h3 style={{ fontSize: '1.5rem', marginBottom: 'var(--spacing-md)' }}>
                        Support Cow Welfare Initiatives
                    </h3>
                    <p style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--spacing-lg)' }}>
                        Join us in making a difference. Donate or volunteer at Gaushalas near you.
                    </p>
                    <Button onClick={() => navigate('/gaushala')}>
                        Find Gaushalas
                    </Button>
                </div>

            </div>
        </div>
    );
};

export default NewsDetail;
