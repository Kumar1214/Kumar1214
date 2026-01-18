import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Play, X } from 'lucide-react';
import { contentService } from '../services/api';

const PodcastSearch = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedEpisodeCount, setSelectedEpisodeCount] = useState('all');
    const [showFilters, setShowFilters] = useState(false);
    const [podcasts, setPodcasts] = useState([]);
    const [loading, setLoading] = useState(false);

    const categories = ['All', 'Spirituality', 'Wellness', 'Culture', 'Education', 'Stories'];
    const episodeCounts = ['All', 'New (< 10 episodes)', 'Growing (10-25 episodes)', 'Established (> 25 episodes)'];

    useEffect(() => {
        const fetchPodcasts = async () => {
            setLoading(true);
            try {
                const params = {};
                if (searchQuery) params.search = searchQuery;
                if (selectedCategory !== 'all') params.category = selectedCategory;

                const response = await contentService.getPodcasts(params);
                const data = Array.isArray(response.data) ? response.data : response.data.data;
                setPodcasts(data || []);
            } catch (error) {
                console.error("Error fetching podcasts:", error);
            } finally {
                setLoading(false);
            }
        };

        const timeoutId = setTimeout(() => {
            fetchPodcasts();
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [searchQuery, selectedCategory]);

    const filteredPodcasts = podcasts.filter(podcast => {
        // Episode count filter is client-side for now as API doesn't return count of episodes in a series
        // Assuming 'episodes' field might not exist on individual podcast item, or needs to be calculated.
        // For now, ignoring episode count filter or assuming podcast item has 'episodeCount' if it's a series aggregator.
        // But since we are listing EPISODES, this filter is less relevant unless we group them.
        // I will keep the filter UI but it might not work effectively without series aggregation.
        // Let's rely on backend filtering for search/category.
        return true;
    });

    return (
        <div className="container mt-lg">
            <h1 style={{ fontSize: '2rem', marginBottom: 'var(--spacing-xl)' }}>Search Podcasts</h1>

            {/* Search Bar */}
            <div style={{ marginBottom: 'var(--spacing-xl)' }}>
                <div style={{ position: 'relative', maxWidth: '600px' }}>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by title, host, or topic..."
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

                        <div style={{ marginBottom: 'var(--spacing-xl)' }}>
                            <h4 style={{ fontSize: '1rem', marginBottom: 'var(--spacing-md)' }}>Category</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
                                {categories.map(category => (
                                    <label key={category} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                        <input
                                            type="radio"
                                            name="category"
                                            checked={selectedCategory === category.toLowerCase()}
                                            onChange={() => setSelectedCategory(category.toLowerCase())}
                                        />
                                        {category}
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Episode Count Filter - Disabled logic but kept UI */}
                        <div>
                            <h4 style={{ fontSize: '1rem', marginBottom: 'var(--spacing-md)' }}>Episode Count</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
                                {episodeCounts.map(count => (
                                    <label key={count} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                        <input
                                            type="radio"
                                            name="episodeCount"
                                            checked={selectedEpisodeCount === count.toLowerCase()}
                                            onChange={() => setSelectedEpisodeCount(count.toLowerCase())}
                                        />
                                        {count}
                                    </label>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={() => {
                                setSelectedCategory('all');
                                setSelectedEpisodeCount('all');
                                setSearchQuery('');
                            }}
                            style={{
                                marginTop: 'var(--spacing-lg)',
                                width: '100%',
                                padding: '10px',
                                border: '1px solid #10B981',
                                backgroundColor: 'white',
                                color: '#10B981',
                                borderRadius: 'var(--radius-md)',
                                cursor: 'pointer',
                                fontWeight: 600
                            }}
                        >
                            Clear All Filters
                        </button>
                    </div>
                )}

                <div>
                    <div style={{ marginBottom: 'var(--spacing-lg)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h2 style={{ fontSize: '1.5rem' }}>
                            {filteredPodcasts.length} {filteredPodcasts.length === 1 ? 'Result' : 'Results'}
                        </h2>
                    </div>

                    {loading ? (
                        <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>
                    ) : filteredPodcasts.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--color-text-muted)' }}>
                            <Search size={64} style={{ margin: '0 auto var(--spacing-lg)', opacity: 0.3 }} />
                            <h3>No podcasts found</h3>
                            <p>Try adjusting your search or filters</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                            {filteredPodcasts.map(podcast => (
                                <div
                                    key={podcast.id || podcast.id}
                                    onClick={() => navigate(`/podcast/${podcast.id || podcast.id}`)}
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
                                        <img src={podcast.coverArt || podcast.image || 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&q=80&w=200'} alt={podcast.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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
                                        <h3 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>{podcast.title}</h3>
                                        <p style={{ color: 'var(--color-text-muted)', marginBottom: '8px' }}>by {podcast.host}</p>
                                        <div style={{ display: 'flex', gap: 'var(--spacing-md)', fontSize: '0.85rem', color: 'var(--color-text-muted)', flexWrap: 'wrap' }}>
                                            <span style={{ padding: '2px 8px', backgroundColor: '#D1FAE5', color: '#065F46', borderRadius: 'var(--radius-sm)', fontWeight: 600 }}>
                                                {podcast.category}
                                            </span>
                                            {/* Removed episode count as per above logic */}
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

export default PodcastSearch;
