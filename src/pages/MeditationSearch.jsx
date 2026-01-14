import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Play, X, Clock } from 'lucide-react';
import { contentService } from '../services/api';

const MeditationSearch = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedType, setSelectedType] = useState('all');
    const [selectedDuration, setSelectedDuration] = useState('all');
    const [showFilters, setShowFilters] = useState(false);
    const [meditations, setMeditations] = useState([]);
    const [loading, setLoading] = useState(false);

    const types = ['All', 'Guided', 'Silent', 'Breathing', 'Mantra', 'Visualization'];
    const durations = ['All', 'Quick (< 15 min)', 'Medium (15-25 min)', 'Long (> 25 min)'];

    useEffect(() => {
        const fetchMeditations = async () => {
            setLoading(true);
            try {
                const params = {};
                if (searchQuery) params.search = searchQuery;
                if (selectedType !== 'all') params.type = selectedType;

                const response = await contentService.getMeditations(params);
                const data = Array.isArray(response.data) ? response.data : response.data.data;
                setMeditations(data || []);
            } catch (error) {
                console.error("Error fetching meditations:", error);
            } finally {
                setLoading(false);
            }
        };

        const timeoutId = setTimeout(() => {
            fetchMeditations();
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [searchQuery, selectedType]);

    const filteredMeditations = meditations.filter(med => {
        // Duration filter client-side logic
        const durationStr = med.duration || "0";
        const durationMins = parseInt(durationStr);

        const matchesDuration = selectedDuration === 'all' ||
            (selectedDuration === 'quick (< 15 min)' && durationMins < 15) ||
            (selectedDuration === 'medium (15-25 min)' && durationMins >= 15 && durationMins <= 25) ||
            (selectedDuration === 'long (> 25 min)' && durationMins > 25);

        return matchesDuration;
    });

    return (
        <div className="container mt-lg">
            <h1 style={{ fontSize: '2rem', marginBottom: 'var(--spacing-xl)' }}>Search Meditation Sessions</h1>

            {/* Search Bar */}
            <div style={{ marginBottom: 'var(--spacing-xl)' }}>
                <div style={{ position: 'relative', maxWidth: '600px' }}>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by title, instructor, or type..."
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

                {/* Filter Toggle Button */}
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

                        {/* Type Filter */}
                        <div style={{ marginBottom: 'var(--spacing-xl)' }}>
                            <h4 style={{ fontSize: '1rem', marginBottom: 'var(--spacing-md)' }}>Type</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
                                {types.map(type => (
                                    <label key={type} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                        <input
                                            type="radio"
                                            name="type"
                                            checked={selectedType === type.toLowerCase()}
                                            onChange={() => setSelectedType(type.toLowerCase())}
                                        />
                                        {type}
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
                                            checked={selectedDuration === duration.toLowerCase()}
                                            onChange={() => setSelectedDuration(duration.toLowerCase())}
                                        />
                                        {duration}
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Clear Filters */}
                        <button
                            onClick={() => {
                                setSelectedType('all');
                                setSelectedDuration('all');
                                setSearchQuery('');
                            }}
                            style={{
                                marginTop: 'var(--spacing-lg)',
                                width: '100%',
                                padding: '10px',
                                border: '1px solid #8B5CF6',
                                backgroundColor: 'white',
                                color: '#8B5CF6',
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
                            {filteredMeditations.length} {filteredMeditations.length === 1 ? 'Result' : 'Results'}
                        </h2>
                    </div>

                    {loading ? (
                        <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>
                    ) : filteredMeditations.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--color-text-muted)' }}>
                            <Search size={64} style={{ margin: '0 auto var(--spacing-lg)', opacity: 0.3 }} />
                            <h3>No meditation sessions found</h3>
                            <p>Try adjusting your search or filters</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                            {filteredMeditations.map(meditation => (
                                <div
                                    key={meditation.id || meditation.id}
                                    onClick={() => navigate(`/meditation/${meditation.id || meditation.id}`)}
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
                                    <div style={{ width: '100px', height: '100px', borderRadius: 'var(--radius-md)', overflow: 'hidden', flexShrink: 0, position: 'relative' }}>
                                        <img src={meditation.image || 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=200'} alt={meditation.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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
                                            <Play size={28} fill="white" color="white" />
                                        </div>
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <h3 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>{meditation.title}</h3>
                                        <p style={{ color: 'var(--color-text-muted)', marginBottom: '8px' }}>with {meditation.instructor}</p>
                                        <div style={{ display: 'flex', gap: 'var(--spacing-md)', fontSize: '0.85rem', color: 'var(--color-text-muted)', flexWrap: 'wrap' }}>
                                            <span style={{ padding: '2px 8px', backgroundColor: '#EDE9FE', color: '#6B21A8', borderRadius: 'var(--radius-sm)', fontWeight: 600 }}>
                                                {meditation.type}
                                            </span>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                <Clock size={14} /> {meditation.duration}
                                            </span>
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

export default MeditationSearch;
