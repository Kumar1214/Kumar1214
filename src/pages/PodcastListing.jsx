import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Search, TrendingUp, Mic, Clock } from 'lucide-react';
import { contentService } from '../services/api';

const PodcastListing = () => {
    const navigate = useNavigate();
    const [podcasts, setPodcasts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('All');

    useEffect(() => {
        const fetchPodcasts = async () => {
            try {
                const response = await contentService.getPodcasts();
                let data = Array.isArray(response.data) ? response.data : response.data.data;

                setPodcasts(data || []);
            } catch (error) {
                console.error("Error fetching podcasts:", error);
                setPodcasts([
                    {
                        id: 'dummy-p1',
                        title: 'Vedic Stories (Demo)',
                        host: 'Acharya Vinod',
                        category: 'Storytelling',
                        description: 'Ancient stories from the Vedas explained simply.',
                        episodes: 12,
                        playCount: 3000,
                        status: 'active',
                        coverArt: 'https://images.unsplash.com/photo-1478737270239-2f63b86236b9?auto=format&fit=crop&q=80&w=400',
                        featured: true
                    },
                    {
                        id: 'dummy-p2',
                        title: 'Modern Spirituality (Demo)',
                        host: 'Maya Devi',
                        category: 'Spirituality',
                        description: 'Bridging the gap between ancient wisdom and modern life.',
                        episodes: 8,
                        playCount: 1500,
                        status: 'active',
                        coverArt: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&q=80&w=400'
                    }
                ]);
            } finally {
                setLoading(false);
            }
        };
        fetchPodcasts();
    }, []);

    const categories = ['All', ...new Set(podcasts.map(p => p.category).filter(Boolean))];

    const filteredPodcasts = podcasts.filter(podcast => {
        const isApproved = podcast.status === 'approved' || podcast.status === 'active' || podcast.status === 'published';
        const podcastCategory = podcast.category || 'Uncategorized';
        const matchesCategory = selectedCategory === 'All' || podcastCategory.toLowerCase() === selectedCategory.toLowerCase();
        return isApproved && matchesCategory;
    });

    if (loading) {
        return <div className="p-8 text-center">Loading sacred podcasts...</div>;
    }

    return (
        <div>
            {/* Hero Section */}
            <div style={{
                background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                color: 'white',
                padding: '4rem 0',
                textAlign: 'center'
            }}>
                <div className="container">
                    <Mic size={48} style={{ margin: '0 auto var(--spacing-md)' }} />
                    <h1 style={{ fontSize: '3rem', marginBottom: 'var(--spacing-md)' }}>Sacred Podcasts</h1>
                    <p style={{ fontSize: '1.25rem', marginBottom: 'var(--spacing-xl)', opacity: 0.9 }}>
                        Listen to inspiring conversations, spiritual teachings, and cultural stories
                    </p>
                    <div style={{ maxWidth: '600px', margin: '0 auto', position: 'relative' }}>
                        <input
                            type="text"
                            placeholder="Search podcasts, hosts, or topics..."
                            onClick={() => navigate('/podcast/search')}
                            style={{
                                width: '100%',
                                padding: '16px 50px 16px 20px',
                                borderRadius: 'var(--radius-full)',
                                border: 'none',
                                fontSize: '1rem',
                                cursor: 'pointer'
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
                        <div style={{ fontSize: '2.5rem', fontWeight: 700, color: '#10B981' }}>{podcasts.length}</div>
                        <div style={{ color: 'var(--color-text-muted)' }}>Podcast Series</div>
                    </div>
                    <div className="card" style={{ padding: 'var(--spacing-lg)', textAlign: 'center' }}>
                        <div style={{ fontSize: '2.5rem', fontWeight: 700, color: '#10B981' }}>
                            {podcasts.reduce((acc, p) => acc + (p.episodes || 1), 0)}+
                        </div>
                        <div style={{ color: 'var(--color-text-muted)' }}>Episodes</div>
                    </div>
                    <div className="card" style={{ padding: 'var(--spacing-lg)', textAlign: 'center' }}>
                        <div style={{ fontSize: '2.5rem', fontWeight: 700, color: '#10B981' }}>
                            {podcasts.reduce((acc, p) => acc + (p.playCount || 0), 0).toLocaleString()}
                        </div>
                        <div style={{ color: 'var(--color-text-muted)' }}>Plays</div>
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
                    {categories.map(category => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            style={{
                                padding: '10px 24px',
                                borderRadius: 'var(--radius-full)',
                                border: 'none',
                                backgroundColor: selectedCategory === category ? '#10B981' : '#F3F4F6',
                                color: selectedCategory === category ? 'white' : 'var(--color-text-main)',
                                cursor: 'pointer',
                                fontWeight: 600,
                                transition: 'all 0.2s'
                            }}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {/* Featured Podcast */}
                {filteredPodcasts.length > 0 && filteredPodcasts[0]?.featured && (
                    <div style={{ marginBottom: 'var(--spacing-3xl)' }}>
                        <h2 style={{ fontSize: '1.75rem', marginBottom: 'var(--spacing-lg)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <TrendingUp size={28} /> Featured Podcast
                        </h2>
                        <div
                            onClick={() => navigate(`/podcast/${filteredPodcasts[0].id || filteredPodcasts[0].id}`)}
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
                                <div style={{ height: '350px', overflow: 'hidden', position: 'relative' }}>
                                    <img
                                        src={filteredPodcasts[0].coverArt || filteredPodcasts[0].image}
                                        alt={filteredPodcasts[0].title}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                    <div style={{
                                        position: 'absolute',
                                        top: '50%',
                                        left: '50%',
                                        transform: 'translate(-50%, -50%)',
                                        width: '60px',
                                        height: '60px',
                                        backgroundColor: 'rgba(16, 185, 129, 0.9)',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <Play size={28} fill="white" color="white" />
                                    </div>
                                </div>
                                <div style={{ padding: 'var(--spacing-xl)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                    <h3 style={{ fontSize: '2rem', marginBottom: 'var(--spacing-sm)' }}>{filteredPodcasts[0].title}</h3>
                                    <p style={{ fontSize: '1.25rem', color: '#10B981', marginBottom: 'var(--spacing-md)' }}>
                                        Hosted by {filteredPodcasts[0].host}
                                    </p>
                                    <p style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--spacing-lg)', lineHeight: 1.6 }}>
                                        {filteredPodcasts[0].description}
                                    </p>
                                    <div style={{ display: 'flex', gap: 'var(--spacing-xl)', color: 'var(--color-text-muted)' }}>
                                        <span>{filteredPodcasts[0].episodes || 1} episodes</span>
                                        <span>{filteredPodcasts[0].playCount || 0} plays</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* All Podcasts Grid */}
                <h2 style={{ fontSize: '1.75rem', marginBottom: 'var(--spacing-lg)' }}>All Podcasts</h2>
                {filteredPodcasts.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                        No podcasts found.
                    </div>
                ) : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                        gap: 'var(--spacing-lg)',
                        marginBottom: 'var(--spacing-3xl)'
                    }}>
                        {filteredPodcasts.map(podcast => (
                            <div
                                key={podcast.id || podcast.id}
                                onClick={() => navigate(`/podcast/${podcast.id || podcast.id}`)}
                                className="card"
                                style={{
                                    overflow: 'hidden',
                                    cursor: 'pointer',
                                    transition: 'transform 0.2s'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                            >
                                <div style={{ position: 'relative', height: '200px', overflow: 'hidden' }}>
                                    <img
                                        src={podcast.coverArt || podcast.image}
                                        alt={podcast.title}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                    <div style={{
                                        position: 'absolute',
                                        bottom: '12px',
                                        right: '12px',
                                        padding: '4px 12px',
                                        backgroundColor: 'rgba(0,0,0,0.7)',
                                        color: 'white',
                                        borderRadius: 'var(--radius-full)',
                                        fontSize: '0.85rem',
                                        fontWeight: 600
                                    }}>
                                        {podcast.episodes || 1} episodes
                                    </div>
                                </div>
                                <div style={{ padding: 'var(--spacing-lg)' }}>
                                    <span style={{ fontSize: '0.85rem', color: '#10B981', fontWeight: 600 }}>
                                        {podcast.category || 'Podcast'}
                                    </span>
                                    <h3 style={{ fontSize: '1.25rem', marginTop: '4px', marginBottom: '4px' }}>{podcast.title}</h3>
                                    <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: 'var(--spacing-sm)' }}>
                                        by {podcast.host}
                                    </p>
                                    <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: 'var(--spacing-md)', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                        {podcast.description}
                                    </p>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                                        {podcast.playCount || 0} plays
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

export default PodcastListing;
