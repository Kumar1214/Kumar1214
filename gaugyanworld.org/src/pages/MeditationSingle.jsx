import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Play, Pause, Heart, Share2, Clock, Users, ArrowLeft } from 'lucide-react';
import Button from '../components/Button';
import { contentService } from '../services/api';

import LoadingScreen from '../components/LoadingScreen';
import SEO from '../components/SEO';
import { useData } from '../context/DataContext';
import EngagementBar from '../components/engagement/EngagementBar';

const MeditationSingle = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [meditation, setMeditation] = useState(null);
    const [loading, setLoading] = useState(true);
    const { trackEngagement } = useData();
    const [isLiked, setIsLiked] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef(null);
    const [relatedSessions, setRelatedSessions] = useState([]);

    useEffect(() => {
        const fetchMeditation = async () => {
            try {
                const response = await contentService.getMeditationById(id);
                const data = response.data.data;
                setMeditation(data);

                // Track view
                if (data) {
                    trackEngagement('meditations', id, 'view');
                }

                // Fetch random/related sessions (e.g. same type)
                // For now, simple fetch all
                const allRes = await contentService.getMeditations();
                const allData = Array.isArray(allRes.data) ? allRes.data : allRes.data.data;
                const filtered = allData.filter(m => (m.id || m.id) !== id).slice(0, 3);
                setRelatedSessions(filtered);

            } catch (error) {
                console.error("Error fetching meditation:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchMeditation();
    }, [id]);

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: meditation.title,
                text: meditation.description,
                url: window.location.href,
            }).then(() => {
                trackEngagement('meditations', id, 'share', 'web-native');
            }).catch(console.error);
        } else {
            const url = window.location.href;
            navigator.clipboard.writeText(url);
            alert('Link copied to clipboard!');
            trackEngagement('meditations', id, 'share', 'copy-link');
        }
    };

    const handleBookmark = () => {
        trackEngagement('meditations', id, 'bookmark');
    };

    // Helper function to convert YouTube URL to embed URL
    const getYouTubeEmbedUrl = (url) => {
        if (!url) return null;
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11)
            ? `https://www.youtube.com/embed/${match[2]}`
            : null;
    };

    const togglePlay = () => {
        const audio = audioRef.current;
        if (audio) {
            if (isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    if (loading) return <LoadingScreen />;
    if (!meditation) return <div className="p-8 text-center">Session not found.</div>;

    return (
        <div className="container mt-lg">
            <SEO
                title={meditation.title}
                description={meditation.description}
                image={meditation.image}
                url={`/meditation/${meditation.id}`}
                type="article"
            />

            {/* Back Button */}
            <button
                onClick={() => navigate('/meditation')}
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
                Back to Meditations
            </button>

            {/* Main Session Info */}
            <div className="single-listing-grid" style={{ marginBottom: 'var(--spacing-3xl)' }}>

                {/* Session Media - Video or Audio */}
                <div>
                    {meditation.videoUrl && getYouTubeEmbedUrl(meditation.videoUrl) ? (
                        /* YouTube Video Player */
                        <div style={{
                            width: '100%',
                            aspectRatio: '16/9',
                            borderRadius: 'var(--radius-lg)',
                            overflow: 'hidden',
                            boxShadow: 'var(--shadow-lg)',
                            marginBottom: 'var(--spacing-lg)'
                        }}>
                            <iframe
                                width="100%"
                                height="100%"
                                src={getYouTubeEmbedUrl(meditation.videoUrl)}
                                title={meditation.title}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                style={{ display: 'block' }}
                            ></iframe>
                        </div>
                    ) : meditation.videoUrl ? (
                        /* Self Hosted Video Player */
                        <div style={{
                            width: '100%',
                            aspectRatio: '16/9',
                            borderRadius: 'var(--radius-lg)',
                            overflow: 'hidden',
                            boxShadow: 'var(--shadow-lg)',
                            marginBottom: 'var(--spacing-lg)',
                            backgroundColor: 'black'
                        }}>
                            <video
                                src={meditation.videoUrl}
                                controls
                                width="100%"
                                height="100%"
                                poster={meditation.image}
                            />
                        </div>
                    ) : (
                        /* Audio Player with Cover Art */
                        <>
                            <div style={{
                                width: '100%',
                                aspectRatio: '1',
                                borderRadius: 'var(--radius-lg)',
                                overflow: 'hidden',
                                boxShadow: 'var(--shadow-lg)',
                                marginBottom: 'var(--spacing-lg)',
                                position: 'relative'
                            }}>
                                <img src={meditation.image || 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=600'} alt={meditation.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                <div style={{
                                    position: 'absolute',
                                    inset: 0,
                                    backgroundColor: 'rgba(0,0,0,0.3)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <button
                                        onClick={togglePlay}
                                        style={{
                                            width: '80px',
                                            height: '80px',
                                            borderRadius: '50%',
                                            backgroundColor: '#8B5CF6',
                                            border: 'none',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            cursor: 'pointer',
                                            boxShadow: 'var(--shadow-lg)'
                                        }}
                                    >
                                        {isPlaying ? <Pause size={32} fill="white" color="white" /> : <Play size={32} fill="white" color="white" />}
                                    </button>
                                </div>
                            </div>

                            {/* Audio Element */}
                            <audio ref={audioRef} src={meditation.audioUrl} />
                        </>
                    )}

                    <EngagementBar
                        views={meditation.viewCount || 0}
                        shares={meditation.shareCount || 0}
                        bookmarks={meditation.bookmarkCount || 0}
                        onShare={handleShare}
                        onBookmark={handleBookmark}
                    />
                </div>

                {/* Session Details */}
                <div>
                    <span style={{
                        display: 'inline-block',
                        padding: '4px 12px',
                        backgroundColor: '#EDE9FE',
                        color: '#6B21A8',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        marginBottom: 'var(--spacing-md)'
                    }}>
                        {meditation.type}
                    </span>

                    <h1 style={{ fontSize: '2.5rem', marginBottom: 'var(--spacing-sm)' }}>{meditation.title}</h1>
                    <p style={{ fontSize: '1.25rem', color: '#8B5CF6', marginBottom: 'var(--spacing-lg)' }}>
                        with {meditation.instructor}
                    </p>

                    {/* Stats */}
                    <div className="stats-grid-4">
                        <div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '4px' }}>Duration</div>
                            <div style={{ fontSize: '1.1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <Clock size={18} /> {meditation.duration}
                            </div>
                        </div>
                        <div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '4px' }}>Date</div>
                            <div style={{ fontSize: '1.1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                                {/* Using Date as placeholder for Participants, assuming backend might not track participants yet */}
                                {new Date(meditation.createdAt).toLocaleDateString()}
                            </div>
                        </div>
                        {/* Likes might not be in API yet, showing placeholder or removing */}
                    </div>

                    {/* Description */}
                    <div style={{ marginBottom: 'var(--spacing-xl)' }}>
                        <h3 style={{ fontSize: '1.25rem', marginBottom: 'var(--spacing-md)' }}>About This Session</h3>
                        <p style={{ lineHeight: 1.7, color: 'var(--color-text-muted)' }}>{meditation.description}</p>
                    </div>

                    {/* Benefits - Assuming backend has benefits array, otherwise checking */}
                    {meditation.benefits && Array.isArray(meditation.benefits) && (
                        <div>
                            <h3 style={{ fontSize: '1.25rem', marginBottom: 'var(--spacing-md)' }}>Benefits</h3>
                            <ul style={{ lineHeight: 2, color: 'var(--color-text-muted)', paddingLeft: '20px' }}>
                                {meditation.benefits.map((benefit, idx) => (
                                    <li key={idx}>{benefit}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>

            {/* Related Sessions */}
            {relatedSessions.length > 0 && (
                <div>
                    <h2 style={{ fontSize: '1.75rem', marginBottom: 'var(--spacing-lg)' }}>More Sessions</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--spacing-lg)' }}>
                        {relatedSessions.map(session => (
                            <div
                                key={session.id || session.id}
                                onClick={() => navigate(`/meditation/${session.id || session.id}`)}
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
                                    <img src={session.image || 'https://images.unsplash.com/photo-1545389336-cf090694435e?auto=format&fit=crop&q=80&w=200'} alt={session.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <h4 style={{ fontSize: '1rem', marginBottom: '4px' }}>{session.title}</h4>
                                    <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '4px' }}>with {session.instructor}</p>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{session.duration}</span>
                                </div>
                                <button style={{
                                    width: '36px',
                                    height: '36px',
                                    borderRadius: '50%',
                                    border: 'none',
                                    backgroundColor: '#8B5CF6',
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

export default MeditationSingle;
