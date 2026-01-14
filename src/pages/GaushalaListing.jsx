import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Search, Heart, Filter, Home, Info } from 'lucide-react';
import { contentService } from '../services/api';
import { getImageUrl } from '../utils/imageHelper';

const GaushalaListing = () => {
    const navigate = useNavigate();
    const [gaushalas, setGaushalas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [city, setCity] = useState('');
    const [stateProp, setStateProp] = useState(''); // renamed to avoid confusion with React state concept

    // Debounce search term to avoid too many API calls
    const fetchGaushalaData = React.useCallback(async () => {
        try {
            setLoading(true);
            const params = {};
            if (searchTerm) params.location = searchTerm;
            if (city) params.city = city;
            if (stateProp) params.state = stateProp;

            const response = await contentService.getGaushalas(params);
            let data = Array.isArray(response.data) ? response.data : response.data.data;
            console.log("Gaushalas response:", response.data);

            setGaushalas(data || []);

        } catch (error) {
            console.error("Error fetching gaushala data:", error);
            setGaushalas([]);
        } finally {
            setLoading(false);
        }
    }, [searchTerm, city, stateProp]);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchGaushalaData();
        }, 500);

        return () => clearTimeout(timer);
    }, [fetchGaushalaData]);

    return (
        <div>
            <div style={{ background: 'linear-gradient(135deg, #059669 0%, #047857 100%)', color: 'white', padding: '3rem 0', textAlign: 'center' }}>
                <div className="container">
                    <Home size={48} style={{ margin: '0 auto var(--spacing-md)' }} />
                    <h1 style={{ fontSize: '2.5rem', marginBottom: 'var(--spacing-md)' }}>Our Partner Gaushalas</h1>
                    <p style={{ fontSize: '1.1rem', marginBottom: 'var(--spacing-xl)', opacity: 0.9 }}>
                        Visit and support the sanctuaries dedicated to cow protection
                    </p>
                    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                        <div style={{ position: 'relative', marginBottom: '1rem' }}>
                            <input
                                type="text"
                                placeholder="Search by name, address..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{ width: '100%', padding: '16px 50px 16px 20px', borderRadius: 'var(--radius-full)', border: 'none', fontSize: '1rem' }}
                            />
                            <Search size={20} style={{ position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                            <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
                                <input
                                    type="text"
                                    placeholder="Filter by City"
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                    style={{ width: '100%', padding: '12px 16px', borderRadius: 'var(--radius-full)', border: 'none', fontSize: '0.9rem' }}
                                />
                                <Filter size={16} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
                            </div>
                            <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
                                <input
                                    type="text"
                                    placeholder="Filter by State"
                                    value={stateProp}
                                    onChange={(e) => setStateProp(e.target.value)}
                                    style={{ width: '100%', padding: '12px 16px', borderRadius: 'var(--radius-full)', border: 'none', fontSize: '0.9rem' }}
                                />
                                <MapPin size={16} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mt-lg">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-lg)' }}>
                    <h2 style={{ fontSize: '1.75rem' }}>Gaushala Directory</h2>
                    {loading && <span className="text-gray-500">Updating...</span>}
                </div>

                {gaushalas.length === 0 && !loading ? (
                    <div className="text-center py-12 text-gray-500">
                        <p>No gaushalas found matching your criteria.</p>
                        <button
                            className="mt-4 text-primary hover:underline"
                            onClick={() => { setSearchTerm(''); setCity(''); setStateProp(''); }}
                        >
                            Clear all filters
                        </button>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 'var(--spacing-lg)', marginBottom: 'var(--spacing-3xl)' }}>
                        {gaushalas.map(gaushala => (
                            <div
                                key={gaushala.id || gaushala.id}
                                onClick={() => navigate(`/gaushala/${gaushala.id || gaushala.id}`)}
                                className="card"
                                style={{ overflow: 'hidden', cursor: 'pointer', transition: 'transform 0.2s', display: 'flex', flexDirection: 'column' }}
                                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                            >
                                <div style={{ position: 'relative', height: '220px', overflow: 'hidden' }}>
                                    <img
                                        src={getImageUrl(gaushala.image || gaushala.images)}
                                        alt={gaushala.name}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                    <div style={{ position: 'absolute', bottom: '0', left: '0', right: '0', background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)', padding: '20px 20px 10px', color: 'white' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <MapPin size={16} />
                                            <span style={{ fontSize: '0.9rem' }}>{gaushala.location?.formattedAddress || `${gaushala.city}, ${gaushala.state}` || gaushala.location}</span>
                                        </div>
                                    </div>
                                </div>

                                <div style={{ padding: 'var(--spacing-lg)', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                    <h3 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>{gaushala.name}</h3>

                                    <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: '16px', lineHeight: 1.5, flex: 1 }}>
                                        {gaushala.description}
                                    </p>

                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid #F3F4F6' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#059669', fontWeight: 600 }}>
                                            <Heart size={18} />
                                            <span>{gaushala.cowsCount || gaushala.cowCount || 0} Cows</span>
                                        </div>
                                        <button style={{ padding: '8px 16px', backgroundColor: '#ECFDF5', color: '#059669', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem' }}>
                                            Visit Gaushala
                                        </button>
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

export default GaushalaListing;
