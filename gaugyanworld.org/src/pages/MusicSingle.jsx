import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Play, Heart, Share2, Clock, User, Star, MessageCircle } from 'lucide-react';
import Button from '../components/Button';
import { contentService } from '../services/api';
import SEO from '../components/SEO';
import { useData } from '../context/DataContext';
import EngagementBar from '../components/engagement/EngagementBar';

const MusicSingle = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isLiked, setIsLiked] = useState(false);
    const [track, setTrack] = useState(null);
    const [loading, setLoading] = useState(true);
    const [relatedTracks, setRelatedTracks] = useState([]);
    const { trackEngagement } = useData();

    useEffect(() => {
        const fetchTrack = async () => {
            try {
                const response = await contentService.getMusicById(id);
                const trackData = response.data.data;
                setTrack(trackData);

                // Track view
                if (trackData) {
                    if (trackEngagement) {
                        trackEngagement('music', id, 'view').catch(err =>
                            console.warn('Failed to track music view:', err)
                        );
                    }
                }

                // Fetch related tracks (e.g. same genre)
                if (trackData) {
                    const relatedResponse = await contentService.getMusic({ genre: trackData.genre });
                    const relatedData = Array.isArray(relatedResponse.data) ? relatedResponse.data : relatedResponse.data.data;
                    setRelatedTracks(relatedData.filter(t => t.id !== id).slice(0, 3) || []);
                }

            } catch (error) {
                console.error("Error fetching track:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTrack();
    }, [id]);

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: track.title,
                text: track.description,
                url: window.location.href,
            }).then(() => {
                if (trackEngagement) {
                    trackEngagement('music', id, 'share', 'web-native').catch(err =>
                        console.warn('Failed to track share:', err)
                    );
                }
            }).catch(console.error);
        } else {
            // Fallback
            const url = window.location.href;
            navigator.clipboard.writeText(url);
            alert('Link copied to clipboard!');
            if (trackEngagement) {
                trackEngagement('music', id, 'share', 'copy-link').catch(err =>
                    console.warn('Failed to track share:', err)
                );
            }
        }
    };

    const handleBookmark = () => {
        if (trackEngagement) {
            trackEngagement('music', id, 'bookmark').catch(err =>
                console.warn('Failed to track bookmark:', err)
            );
        }
    };

    if (loading) {
        return <div className="p-8 text-center">Loading track details...</div>;
    }

    if (!track) {
        return <div className="p-8 text-center">Track not found.</div>;
    }

    return (
        <div className="container mt-lg">
            <SEO
                title={track.title}
                description={track.description}
                image={track.coverArt || track.image}
                url={`/music/${track.id}`}
                type="music.song"
            />

            {/* Main Track Info */}
            <div className="single-listing-grid" style={{ marginBottom: 'var(--spacing-3xl)' }}>

                {/* Album Art */}
                <div>
                    <div style={{
                        width: '100%',
                        aspectRatio: '1',
                        borderRadius: 'var(--radius-lg)',
                        overflow: 'hidden',
                        boxShadow: 'var(--shadow-lg)',
                        marginBottom: 'var(--spacing-lg)'
                    }}>
                        <img src={track.coverArt || track.image || 'https://images.unsplash.com/photo-1514117445516-2ec90fa4b84b?auto=format&fit=crop&q=80&w=600'} alt={track.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>

                    {/* Action Buttons */}
                    <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
                        <Button
                            fullWidth
                            onClick={() => navigate(`/music/${track.id}/player`)}
                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                        >
                            <Play size={20} fill="white" />
                            Play Now
                        </Button>
                    </div>

                    <EngagementBar
                        views={track.viewCount || track.plays || 0}
                        shares={track.shareCount || 0}
                        bookmarks={track.bookmarkCount || 0}
                        onShare={handleShare}
                        onBookmark={handleBookmark}
                    />
                </div>

                {/* Track Details */}
                <div>
                    <span style={{
                        display: 'inline-block',
                        padding: '4px 12px',
                        backgroundColor: '#FFF7ED',
                        color: 'var(--color-primary)',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        marginBottom: 'var(--spacing-md)'
                    }}>
                        {track.genre}
                    </span>

                    <h1 style={{ fontSize: '2.5rem', marginBottom: 'var(--spacing-sm)' }}>{track.title}</h1>
                    <p style={{ fontSize: '1.25rem', color: 'var(--color-primary)', marginBottom: 'var(--spacing-lg)' }}>
                        {track.artist}
                    </p>

                    {/* Stats */}
                    <div className="stats-grid-4">
                        <div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '4px' }}>Duration</div>
                            <div style={{ fontSize: '1.1rem', fontWeight: 600 }}>{track.duration}</div>
                        </div>
                        <div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '4px' }}>Plays</div>
                            <div style={{ fontSize: '1.1rem', fontWeight: 600 }}>{track.playCount || track.plays}</div>
                        </div>
                        <div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '4px' }}>Likes</div>
                            <div style={{ fontSize: '1.1rem', fontWeight: 600 }}>{track.likes}</div>
                        </div>
                        <div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '4px' }}>Rating</div>
                            <div style={{ fontSize: '1.1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <Star size={18} fill="#F59E0B" color="#F59E0B" />
                                {track.rating}
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div style={{ marginBottom: 'var(--spacing-xl)' }}>
                        <h3 style={{ fontSize: '1.25rem', marginBottom: 'var(--spacing-md)' }}>About This Track</h3>
                        <p style={{ lineHeight: 1.7, color: 'var(--color-text-muted)' }}>{track.description}</p>
                    </div>

                    {/* Additional Info */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)', fontSize: '0.95rem' }}>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <span style={{ color: 'var(--color-text-muted)' }}>Album:</span>
                            <span style={{ fontWeight: 600 }}>{track.album}</span>
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <span style={{ color: 'var(--color-text-muted)' }}>Release Date:</span>
                            <span style={{ fontWeight: 600 }}>{track.releaseDate ? new Date(track.releaseDate).toLocaleDateString() : 'N/A'}</span>
                        </div>
                    </div>

                    {/* Review Button */}
                    <button
                        onClick={() => navigate(`/music/${track.id || track.id}/review`)}
                        style={{
                            marginTop: 'var(--spacing-xl)',
                            padding: '12px 24px',
                            border: '1px solid var(--color-primary)',
                            backgroundColor: 'white',
                            color: 'var(--color-primary)',
                            borderRadius: 'var(--radius-md)',
                            cursor: 'pointer',
                            fontWeight: 600,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}
                    >
                        <MessageCircle size={18} />
                        Write a Review ({track.numRatings || track.reviews || 0})
                    </button>
                </div>
            </div>

            {/* Related Tracks */}
            {relatedTracks.length > 0 && (
                <div>
                    <h2 style={{ fontSize: '1.75rem', marginBottom: 'var(--spacing-lg)' }}>You May Also Like</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--spacing-lg)' }}>
                        {relatedTracks.map(relatedTrack => (
                            <div
                                key={relatedTrack.id || relatedTrack.id}
                                onClick={() => navigate(`/music/${relatedTrack.id || relatedTrack.id}`)}
                                className="card"
                                style={{
                                    padding: 'var(--spacing-md)',
                                    display: 'flex',
                                    gap: 'var(--spacing-md)',
                                    cursor: 'pointer',
                                    transition: 'transform 0.2s'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                            >
                                <div style={{ width: '60px', height: '60px', borderRadius: 'var(--radius-md)', overflow: 'hidden', flexShrink: 0 }}>
                                    <img src={relatedTrack.coverArt || relatedTrack.image} alt={relatedTrack.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <h4 style={{ fontSize: '1rem', marginBottom: '4px' }}>{relatedTrack.title}</h4>
                                    <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '4px' }}>{relatedTrack.artist}</p>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{relatedTrack.duration}</span>
                                </div>
                                <button style={{
                                    width: '36px',
                                    height: '36px',
                                    borderRadius: '50%',
                                    border: 'none',
                                    backgroundColor: 'var(--color-primary)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    flexShrink: 0
                                }}>
                                    <Play size={16} fill="white" color="white" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

        </div>
    );
};

export default MusicSingle;
