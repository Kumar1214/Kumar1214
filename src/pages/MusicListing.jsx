import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Search, TrendingUp, Clock, Heart } from 'lucide-react';
import Button from '../components/Button';
import { contentService } from '../services/api';


const MusicListing = () => {
    const navigate = useNavigate();
    const [music, setMusic] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('all');

    useEffect(() => {
        const fetchMusic = async () => {
            try {
                const response = await contentService.getMusic();
                // Support both array response and object with data property
                let data = Array.isArray(response.data) ? response.data : response.data.data;

                setMusic(data || []);
            } catch (error) {
                console.error("Error fetching music:", error);
                // Fallback dummy data if API fails
                setMusic([
                    {
                        id: 'dummy-1',
                        title: 'Divine Chanting (Demo)',
                        artist: 'Pandit Sharma',
                        genre: 'Mantra',
                        duration: '4:20',
                        playCount: 5000,
                        status: 'active',
                        coverArt: 'https://images.unsplash.com/photo-1528643610687-950a498877ba?auto=format&fit=crop&q=80&w=400'
                    },
                    {
                        id: 'dummy-2',
                        title: 'Morning Flute (Demo)',
                        artist: 'Krishna Vibes',
                        genre: 'Instrumental',
                        duration: '6:15',
                        playCount: 12000,
                        status: 'active',
                        coverArt: 'https://images.unsplash.com/photo-1511735111811-6d9b4c05e367?auto=format&fit=crop&q=80&w=400'
                    }
                ]);
            } finally {
                setLoading(false);
            }
        };
        fetchMusic();
    }, []);

    // Get unique genres from music data
    const allGenres = [...new Set(music.map(track => track.genre).filter(Boolean))];
    const categories = ['All', ...allGenres];

    // Map music data to display format
    const displayTracks = music
        .filter(track => track.status === 'approved' || track.status === 'active') // Handle both status conventions if needed
        .map(track => ({
            id: track.id || track.id,
            title: track.title,
            artist: track.artist,
            category: track.genre,
            duration: track.duration,
            plays: track.playCount ? `${(track.playCount / 1000).toFixed(0)}K` : '0',
            image: track.coverArt || 'https://images.unsplash.com/photo-1514117445516-2ec90fa4b84b?auto=format&fit=crop&q=80&w=400'
        }));

    const filteredTracks = selectedCategory === 'all'
        ? displayTracks
        : displayTracks.filter(track => track.category?.toLowerCase() === selectedCategory.toLowerCase());

    if (loading) {
        return <div className="p-8 text-center">Loading sacred music...</div>;
    }

    return (
        <div>


            {/* Hero Section */}
            <div style={{
                background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
                color: 'white',
                padding: '4rem 0',
                textAlign: 'center'
            }}>
                <div className="container">
                    <h1 style={{ fontSize: '3rem', marginBottom: 'var(--spacing-md)' }}>Sacred Music</h1>
                    <p style={{ fontSize: '1.25rem', marginBottom: 'var(--spacing-xl)', opacity: 0.9 }}>
                        Discover divine melodies, devotional songs, and peaceful meditation music
                    </p>
                    <div style={{ maxWidth: '600px', margin: '0 auto', position: 'relative' }}>
                        <input
                            type="text"
                            placeholder="Search for music, artists, or genres..."
                            onClick={() => navigate('/music/search')}
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
                        <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--color-primary)' }}>{music.length}</div>
                        <div style={{ color: 'var(--color-text-muted)' }}>Sacred Tracks</div>
                    </div>
                    <div className="card" style={{ padding: 'var(--spacing-lg)', textAlign: 'center' }}>
                        <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--color-primary)' }}>{[...new Set(music.map(t => t.artist))].length}</div>
                        <div style={{ color: 'var(--color-text-muted)' }}>Artists</div>
                    </div>
                    <div className="card" style={{ padding: 'var(--spacing-lg)', textAlign: 'center' }}>
                        <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--color-primary)' }}>{(music.reduce((sum, t) => sum + (t.playCount || 0), 0) / 1000000).toFixed(1)}M+</div>
                        <div style={{ color: 'var(--color-text-muted)' }}>Total Plays</div>
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
                            onClick={() => setSelectedCategory(category.toLowerCase())}
                            style={{
                                padding: '10px 24px',
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

                {/* Featured Track (Large) */}
                {filteredTracks[0] && (
                    <div style={{ marginBottom: 'var(--spacing-3xl)' }}>
                        <h2 style={{ fontSize: '1.75rem', marginBottom: 'var(--spacing-lg)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <TrendingUp size={28} /> Featured Track
                        </h2>
                        <div
                            onClick={() => navigate(`/music/${filteredTracks[0].id}`)}
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
                                <div style={{ height: '300px', overflow: 'hidden', position: 'relative' }}>
                                    <img
                                        src={filteredTracks[0].image}
                                        alt={filteredTracks[0].title}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                    <div style={{
                                        position: 'absolute',
                                        top: '50%',
                                        left: '50%',
                                        transform: 'translate(-50%, -50%)',
                                        width: '60px',
                                        height: '60px',
                                        backgroundColor: 'rgba(255, 107, 53, 0.9)',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer'
                                    }}>
                                        <Play size={28} fill="white" color="white" />
                                    </div>
                                </div>
                                <div style={{ padding: 'var(--spacing-xl)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                    <h3 style={{ fontSize: '2rem', marginBottom: 'var(--spacing-sm)' }}>{filteredTracks[0].title}</h3>
                                    <p style={{ fontSize: '1.25rem', color: 'var(--color-primary)', marginBottom: 'var(--spacing-md)' }}>
                                        {filteredTracks[0].artist}
                                    </p>
                                    <div style={{ display: 'flex', gap: 'var(--spacing-xl)', color: 'var(--color-text-muted)', marginBottom: 'var(--spacing-lg)' }}>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <Clock size={18} /> {filteredTracks[0].duration}
                                        </span>
                                        <span>{filteredTracks[0].plays} plays</span>
                                    </div>
                                    <Button onClick={(e) => { e.stopPropagation(); navigate(`/music/${filteredTracks[0].id}`); }}>
                                        Play Now
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* All Tracks Grid */}
                <h2 style={{ fontSize: '1.75rem', marginBottom: 'var(--spacing-lg)' }}>All Tracks</h2>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                    gap: 'var(--spacing-lg)',
                    marginBottom: 'var(--spacing-3xl)'
                }}>
                    {filteredTracks.map(track => (
                        <div
                            key={track.id}
                            onClick={() => navigate(`/music/${track.id}`)}
                            className="card"
                            style={{
                                overflow: 'hidden',
                                cursor: 'pointer',
                                transition: 'transform 0.2s',
                                position: 'relative'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                        >
                            <div style={{ position: 'relative', height: '200px', overflow: 'hidden' }}>
                                <img
                                    src={track.image}
                                    alt={track.title}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                                <button
                                    style={{
                                        position: 'absolute',
                                        bottom: '12px',
                                        right: '12px',
                                        width: '40px',
                                        height: '40px',
                                        backgroundColor: 'var(--color-primary)',
                                        borderRadius: '50%',
                                        border: 'none',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer',
                                        boxShadow: 'var(--shadow-md)'
                                    }}
                                >
                                    <Play size={18} fill="white" color="white" />
                                </button>
                            </div>
                            <div style={{ padding: 'var(--spacing-md)' }}>
                                <span style={{ fontSize: '0.85rem', color: 'var(--color-primary)', fontWeight: 600 }}>
                                    {track.category}
                                </span>
                                <h3 style={{ fontSize: '1.1rem', marginTop: '4px', marginBottom: '4px' }}>{track.title}</h3>
                                <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: 'var(--spacing-sm)' }}>
                                    {track.artist}
                                </p>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                                    <span>{track.duration}</span>
                                    <span>{track.plays} plays</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
};

export default MusicListing;
