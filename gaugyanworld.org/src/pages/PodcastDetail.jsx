import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Play, Pause, Share2, Heart, List, ArrowLeft } from 'lucide-react';
import Button from '../components/Button';
import { contentService } from '../services/api';

import LoadingScreen from '../components/LoadingScreen';
import SEO from '../components/SEO';
import { useData } from '../context/DataContext';
import EngagementBar from '../components/engagement/EngagementBar';

const PodcastDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [podcast, setPodcast] = useState(null);
    const [loading, setLoading] = useState(true);
    const [episodes, setEpisodes] = useState([]);
    const { trackEngagement } = useData();

    useEffect(() => {
        const fetchPodcast = async () => {
            try {
                const response = await contentService.getPodcastById(id);
                const data = response.data.data;
                setPodcast(data);

                // Track view
                if (data) {
                    trackEngagement('podcasts', id, 'view');
                }

                // If podcast has a series, fetch other episodes
                if (data && data.series) {
                    const seriesResponse = await contentService.getPodcasts({ series: data.series });
                    const seriesData = Array.isArray(seriesResponse.data) ? seriesResponse.data : seriesResponse.data.data;
                    setEpisodes(seriesData.filter(ep => ep.series === data.series)); // Ensure series matches
                } else {
                    // If no series, it's just this one episode in the list (or we can treat it as a single)
                    setEpisodes([data]);
                }
            } catch (error) {
                console.error("Error fetching podcast:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPodcast();
    }, [id]);

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: podcast.title,
                text: podcast.description,
                url: window.location.href,
            }).then(() => {
                trackEngagement('podcasts', id, 'share', 'web-native');
            }).catch(console.error);
        } else {
            const url = window.location.href;
            navigator.clipboard.writeText(url);
            alert('Link copied to clipboard!');
            trackEngagement('podcasts', id, 'share', 'copy-link');
        }
    };

    const handleBookmark = () => {
        trackEngagement('podcasts', id, 'bookmark');
    };

    if (loading) return <LoadingScreen />;
    if (!podcast) return <div className="p-8 text-center">Podcast not found.</div>;

    return (
        <div className="container mt-lg">
            <SEO
                title={podcast.title}
                description={podcast.description}
                image={podcast.coverArt || podcast.image}
                url={`/podcasts/${podcast.id}`}
                type="article"
            />
            {/* Back Button */}
            <button
                onClick={() => navigate('/podcasts')}
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
                Back
            </button>

            <div className="single-listing-grid" style={{ marginBottom: 'var(--spacing-3xl)' }}>
                <div>
                    <div style={{ width: '100%', aspectRatio: '1', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-lg)', marginBottom: 'var(--spacing-lg)' }}>
                        <img src={podcast.coverArt || podcast.image || 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&q=80&w=800'} alt={podcast.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                </div>

                <div>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: 'var(--spacing-sm)', color: 'var(--color-text-main)' }}>{podcast.title}</h1>
                    <p style={{ fontSize: '1.2rem', color: 'var(--color-primary)', marginBottom: 'var(--spacing-md)' }}>Hosted by {podcast.host || 'Unknown Host'}</p>
                    <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.6, marginBottom: 'var(--spacing-lg)' }}>{podcast.description}</p>

                    <div style={{ display: 'flex', gap: 'var(--spacing-md)', alignItems: 'center' }}>
                        <Button style={{ padding: '0.75rem 2rem', gap: '8px' }}>
                            <Play size={20} fill="white" /> Play Latest
                        </Button>
                    </div>

                    <EngagementBar
                        views={podcast.viewCount || 0}
                        shares={podcast.shareCount || 0}
                        bookmarks={podcast.bookmarkCount || 0}
                        onShare={handleShare}
                        onBookmark={handleBookmark}
                    />
                </div>
            </div>

            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: 'var(--spacing-lg)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <List size={24} /> {podcast.series ? `Episodes in ${podcast.series}` : 'This Episode'}
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                    {episodes.map(episode => (
                        <EpisodePlayer key={episode.id || episode.id} episode={episode} />
                    ))}
                </div>
            </div>
        </div>
    );
};

const EpisodePlayer = ({ episode }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef(null);

    const togglePlay = () => {
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };


    // Detect YouTube
    const getYouTubeEmbedUrl = (url) => {
        if (!url) return null;
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}` : null;
    };
    const youtubeUrl = getYouTubeEmbedUrl(episode.videoUrl || episode.audioUrl); // Check both

    return (
        <div className="card" style={{
            padding: 'var(--spacing-md)',
            display: 'flex',
            flexDirection: 'column', // Changed to column to accommodate video
            gap: '1rem',
            marginBottom: '1rem',
            cursor: 'default'
        }}>
            {youtubeUrl ? (
                <div style={{ width: '100%', aspectRatio: '16/9', borderRadius: '8px', overflow: 'hidden' }}>
                    <iframe
                        width="100%"
                        height="100%"
                        src={youtubeUrl}
                        title={episode.title}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                </div>
            ) : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                    <audio ref={audioRef} src={episode.audioUrl || "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"} />
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)', flex: 1 }}>
                        <button
                            onClick={togglePlay}
                            style={{
                                width: '40px',
                                height: '40px',
                                backgroundColor: isPlaying ? '#EF4444' : 'var(--color-primary)',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                border: 'none',
                                cursor: 'pointer'
                            }}
                        >
                            {isPlaying ? <Pause size={16} fill="white" /> : <Play size={16} fill="white" />}
                        </button>
                        <div style={{ flex: 1 }}>
                            <h3 style={{ fontSize: '1rem', marginBottom: '4px' }}>{episode.title}</h3>
                            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>{episode.publishDate ? new Date(episode.publishDate).toLocaleDateString() : 'N/A'}</p>
                        </div>
                    </div>
                    <span style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>{episode.duration}</span>
                </div>
            )}
        </div>
    );
};

export default PodcastDetail;
