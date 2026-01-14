import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Play, X } from 'lucide-react';
import { contentService } from '../services/api';

const MusicSearch = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedGenre, setSelectedGenre] = useState('all');
    const [selectedDuration, setSelectedDuration] = useState('all');
    const [showFilters, setShowFilters] = useState(false);
    const [tracks, setTracks] = useState([]);
    const [loading, setLoading] = useState(false);

    const genres = ['All', 'Devotional', 'Classical', 'Meditation', 'Bhajans', 'Mantras'];
    const durations = ['All', 'Short (< 10 min)', 'Medium (10-20 min)', 'Long (> 20 min)'];

    useEffect(() => {
        const fetchTracks = async () => {
            setLoading(true);
            try {
                const params = {};
                if (searchQuery) params.search = searchQuery;
                if (selectedGenre !== 'all') params.genre = selectedGenre;

                const response = await contentService.getMusic(params);
                const data = Array.isArray(response.data) ? response.data : response.data.data;
                setTracks(data || []);
            } catch (error) {
                console.error("Error fetching music:", error);
            } finally {
                setLoading(false);
            }
        };

        // Debounce search
        const timeoutId = setTimeout(() => {
            fetchTracks();
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [searchQuery, selectedGenre]);

    // Client-side duration filtering
    const parseDuration = (durationStr) => {
        if (!durationStr) return 0;
        const parts = durationStr.split(':').map(Number);
        if (parts.length === 2) return parts[0] + parts[1] / 60;
        if (parts.length === 3) return parts[0] * 60 + parts[1] + parts[2] / 60;
        return 0;
    };

    const filteredTracks = tracks.filter(track => {
        if (selectedDuration === 'all') return true;
        const durationMins = parseDuration(track.duration);
        if (selectedDuration === 'Short (< 10 min)') return durationMins < 10;
        if (selectedDuration === 'Medium (10-20 min)') return durationMins >= 10 && durationMins <= 20;
        if (selectedDuration === 'Long (> 20 min)') return durationMins > 20;
        return true;
    });

    return (
        <div className="container mt-lg">
            <h1 style={{ fontSize: '2rem', marginBottom: 'var(--spacing-xl)' }}>Search Music</h1>

            {/* Search Bar */}
            <div style={{ marginBottom: 'var(--spacing-xl)' }}>
                <div style={{ position: 'relative', maxWidth: '600px' }}>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by title, artist, or genre..."
                        style={{
                            width: '100%',
                            padding: '14px 50px 14px 20px',
                            borderRadius: 'var(--radius-md)',
                            border: '2px solid #E5E7EB',
                            fontSize: '1rem'
                        }}
                    />
                    <Search
                        size={20}
                        style={{
                            position: 'absolute',
                            right: '16px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            color: 'var(--color-text-muted)'
                        }}
                    />
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: showFilters ? '250px 1fr' : '1fr', gap: 'var(--spacing-xl)' }}>

                {/* Filter Toggle Button (Mobile) */}
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    style={{
                        display: showFilters ? 'none' : 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '10px 20px',
                        border: '1px solid #E5E7EB',
                        backgroundColor: 'white',
                        borderRadius: 'var(--radius-md)',
                        cursor: 'pointer',
                        marginBottom: 'var(--spacing-lg)',
                        width: 'fit-content'
                    }}
                >
                    <Filter size={18} />
                    Show Filters
                </button>

                {/* Filters Sidebar */}
                {showFilters && (
                    <div className="card" style={{ padding: 'var(--spacing-lg)', height: 'fit-content', position: 'sticky', top: '100px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-lg)' }}>
                            <h3 style={{ fontSize: '1.25rem' }}>Filters</h3>
                            <button
                                onClick={() => setShowFilters(false)}
                                style={{
                                    padding: '4px',
                                    border: 'none',
                                    background: 'none',
                                    cursor: 'pointer'
                                }}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Genre Filter */}
                        <div style={{ marginBottom: 'var(--spacing-xl)' }}>
                            <h4 style={{ fontSize: '1rem', marginBottom: 'var(--spacing-md)' }}>Genre</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
                                {genres.map(genre => (
                                    <label key={genre} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                        <input
                                            type="radio"
                                            name="genre"
                                            checked={selectedGenre === genre.toLowerCase()}
                                            onChange={() => setSelectedGenre(genre.toLowerCase())}
                                        />
                                        {genre}
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Duration Filter */}
                        <div>
                            <h4 style={{ fontSize: '1rem', marginBottom: 'var(--spacing-md)' }}>Duration</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
                                {durations.map(duration => (
                                    <label key={duration} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                        <input
                                            type="radio"
                                            name="duration"
                                            checked={selectedDuration.toLowerCase() === duration.toLowerCase()}
                                            onChange={() => setSelectedDuration(duration)}
                                        />
                                        {duration}
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Clear Filters */}
                        <button
                            onClick={() => {
                                setSelectedGenre('all');
                                setSelectedDuration('all');
                                setSearchQuery('');
                            }}
                            style={{
                                marginTop: 'var(--spacing-lg)',
                                width: '100%',
                                padding: '10px',
                                border: '1px solid var(--color-primary)',
                                backgroundColor: 'white',
                                color: 'var(--color-primary)',
                                borderRadius: 'var(--radius-md)',
                                cursor: 'pointer',
                                fontWeight: 600
                            }}
                        >
                            Clear All Filters
                        </button>
                    </div>
                )}

                {/* Results */}
                <div>
                    <div style={{ marginBottom: 'var(--spacing-lg)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h2 style={{ fontSize: '1.5rem' }}>
                            {filteredTracks.length} {filteredTracks.length === 1 ? 'Result' : 'Results'}
                        </h2>
                    </div>

                    {loading ? (
                        <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>
                    ) : filteredTracks.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--color-text-muted)' }}>
                            <Search size={64} style={{ margin: '0 auto var(--spacing-lg)', opacity: 0.3 }} />
                            <h3>No tracks found</h3>
                            <p>Try adjusting your search or filters</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                            {filteredTracks.map(track => (
                                <div
                                    key={track.id || track.id}
                                    onClick={() => navigate(`/music/${track.id || track.id}`)}
                                    className="card"
                                    style={{
                                        padding: 'var(--spacing-md)',
                                        display: 'flex',
                                        gap: 'var(--spacing-md)',
                                        cursor: 'pointer',
                                        transition: 'transform 0.2s'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(4px)'}
                                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateX(0)'}
                                >
                                    <div style={{ width: '80px', height: '80px', borderRadius: 'var(--radius-md)', overflow: 'hidden', flexShrink: 0, position: 'relative' }}>
                                        <img src={track.coverArt || track.image || 'https://images.unsplash.com/photo-1514117445516-2ec90fa4b84b?auto=format&fit=crop&q=80&w=200'} alt={track.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        <div style={{
                                            position: 'absolute',
                                            inset: 0,
                                            backgroundColor: 'rgba(0,0,0,0.4)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            opacity: 0,
                                            transition: 'opacity 0.2s'
                                        }}
                                            onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                                            onMouseLeave={(e) => e.currentTarget.style.opacity = '0'}
                                        >
                                            <Play size={24} fill="white" color="white" />
                                        </div>
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <h3 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>{track.title}</h3>
                                        <p style={{ color: 'var(--color-text-muted)', marginBottom: '8px' }}>{track.artist}</p>
                                        <div style={{ display: 'flex', gap: 'var(--spacing-md)', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                                            <span style={{ padding: '2px 8px', backgroundColor: '#FFF7ED', color: 'var(--color-primary)', borderRadius: 'var(--radius-sm)', fontWeight: 600 }}>
                                                {track.genre}
                                            </span>
                                            <span>{track.duration}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default MusicSearch;
