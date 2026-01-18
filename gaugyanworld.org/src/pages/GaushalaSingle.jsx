import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Heart, Users, Phone, Mail, Globe, Share2, Award } from 'lucide-react';
import Button from '../components/Button';
import { contentService } from '../services/api';
import { useData } from '../context/DataContext';
import EngagementBar from '../components/engagement/EngagementBar';

const GaushalaSingle = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [gaushala, setGaushala] = useState(null);
    const [cows, setCows] = useState([]);
    const [loading, setLoading] = useState(true);
    const { trackEngagement } = useData();

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Gaushala Details
                let gaushalaData = null;
                try {
                    const response = await contentService.getGaushalaById(id);
                    gaushalaData = response.data.data || response.data;
                } catch (err) {
                    console.warn("Failed to fetch gaushala by ID, using mock", err);
                }

                // Track view
                if (gaushalaData) {
                    trackEngagement('gaushalas', id, 'view');
                }

                // Mock data fallback or ensure structure...
                if (!gaushalaData || !gaushalaData.name) {
                    gaushalaData = {
                        id: id,
                        name: 'Shri Krishna Gaushala',
                        location: 'Vrindavan, Uttar Pradesh', // Ensure string
                        image: 'https://images.unsplash.com/photo-1596733430284-f74377bc2184?auto=format&fit=crop&q=80&w=800',
                        description: 'A dedicated sanctuary for the protection and service of cows. We provide shelter, medical care, and a loving environment for over 500 indigenous cows.',
                        established: 2010,
                        cowCount: 520,
                        staffCount: 15, // New Field
                        timings: '6:00 AM - 7:00 PM', // New Field
                        services: ['Cow Shelter', 'Medical Care', 'Organic Farming', 'Gau Mutra Therapy'], // New Field
                        achievements: ['Best Gaushala Award 2023', 'Zero Mortality Rate 2024'], // New Field
                        gallery: [
                            'https://images.unsplash.com/photo-1544367563-12123d8965cd?auto=format&fit=crop&q=80&w=400',
                            'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?auto=format&fit=crop&q=80&w=400',
                            'https://images.unsplash.com/photo-1596733430284-f74377bc2184?auto=format&fit=crop&q=80&w=400'
                        ], // New Field
                        contact: { phone: '+91 98765 43210', email: 'contact@krishnagaushala.org', website: 'www.krishnagaushala.org' }
                    };
                }
                setGaushala(gaushalaData);

                // Mock Cows Data (Can be replaced with API call later)
                const mockCows = [
                    { id: 'c1', name: 'Gauri', breed: 'Gir', age: 5, gender: 'Female', image: 'https://images.unsplash.com/photo-1541625810516-44f1ce894de9?auto=format&fit=crop&q=80&w=400', status: 'Healthy' },
                    { id: 'c2', name: 'Nandi', breed: 'Sahiwal', age: 3, gender: 'Male', image: 'https://images.unsplash.com/photo-1596733430284-f74377bc2184?auto=format&fit=crop&q=80&w=800', status: 'Injured (Recovering)' },
                    { id: 'c3', name: 'Shyama', breed: 'Rathi', age: 7, gender: 'Female', image: 'https://plus.unsplash.com/premium_photo-1661962360244-123456789abc?auto=format&fit=crop&q=80&w=400', status: 'Healthy' },
                    { id: 'c4', name: 'Gopala', breed: 'Tharparkar', age: 2, gender: 'Male', image: 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?auto=format&fit=crop&q=80&w=400', status: 'Healthy' }
                ];
                setCows(mockCows);

            } catch (error) {
                console.error("Error fetching details:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: gaushala.name,
                text: gaushala.description,
                url: window.location.href,
            }).then(() => {
                trackEngagement('gaushalas', id, 'share', 'web-native');
            }).catch(console.error);
        } else {
            const url = window.location.href;
            navigator.clipboard.writeText(url);
            alert('Link copied to clipboard!');
            trackEngagement('gaushalas', id, 'share', 'copy-link');
        }
    };

    const handleBookmark = () => {
        trackEngagement('gaushalas', id, 'bookmark');
    };

    if (loading) return (
        <div className="container mt-lg p-8 text-center min-h-[50vh] flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
    );

    if (!gaushala) {
        return (
            <div className="container mt-lg text-center" style={{ padding: '100px 0' }}>
                <h2>Gaushala Not Found</h2>
                <Button onClick={() => navigate('/gaushala')}>Back to Listing</Button>
            </div>
        );
    }

    // Helper to safely get location string
    const getLocationString = (loc) => {
        if (!loc) return 'Location not available';
        if (typeof loc === 'string') return loc;
        if (typeof loc === 'object') {
            return loc.formattedAddress || loc.address || `${loc.city || ''} ${loc.state || ''}`.trim() || 'India';
        }
        return 'India';
    };

    const locationString = getLocationString(gaushala.location);

    return (
        <div>
            {/* Banner Header */}
            <div style={{
                position: 'relative',
                height: '400px',
                width: '100%',
                backgroundColor: '#1F2937'
            }}>
                <img
                    src={gaushala.image || 'https://images.unsplash.com/photo-1544367563-12123d8965cd?auto=format&fit=crop&q=80&w=1200'}
                    alt={gaushala.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6 }}
                />
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    padding: 'var(--spacing-3xl) 0'
                }}>
                    <div className="container">
                        <button
                            onClick={() => navigate('/gaushala')}
                            style={{
                                position: 'absolute', top: '2rem', left: 'max(1rem, calc((100% - 1200px) / 2))',
                                display: 'flex', alignItems: 'center', gap: '8px',
                                color: 'white', background: 'rgba(255,255,255,0.2)',
                                backdropFilter: 'blur(4px)', padding: '8px 16px',
                                borderRadius: 'var(--radius-full)', border: 'none', cursor: 'pointer',
                                fontWeight: 500
                            }}
                        >
                            <ArrowLeft size={18} /> Back
                        </button>

                        <div style={{ color: 'white' }}>
                            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '12px' }}>
                                <span style={{
                                    backgroundColor: '#059669', color: 'white',
                                    padding: '4px 12px', borderRadius: '4px',
                                    fontSize: '0.85rem', fontWeight: 600,
                                    display: 'flex', alignItems: 'center', gap: '6px'
                                }}>
                                    <Award size={14} /> Registered Gaushala
                                </span>
                                {gaushala.established && (
                                    <span style={{
                                        backgroundColor: 'rgba(255,255,255,0.2)', color: 'white',
                                        padding: '4px 12px', borderRadius: '4px',
                                        fontSize: '0.85rem', fontWeight: 600
                                    }}>
                                        Est. {gaushala.established}
                                    </span>
                                )}
                            </div>
                            <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '16px', lineHeight: 1.1 }}>{gaushala.name}</h1>
                            <p style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px', opacity: 0.9 }}>
                                <MapPin size={20} color="#34D399" /> {locationString}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container" style={{ marginTop: 'var(--spacing-2xl)', marginBottom: 'var(--spacing-4xl)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--spacing-2xl)' }}>

                    {/* Left Column: Details */}
                    <div>
                        {/* Action Buttons (Mobile friendly top) */}
                        {/* Engagement Bar */}
                        <EngagementBar
                            views={gaushala.viewCount || 0}
                            shares={gaushala.shareCount || 0}
                            bookmarks={gaushala.bookmarkCount || 0}
                            onShare={handleShare}
                            onBookmark={handleBookmark}
                            className="bg-white rounded-lg px-4 shadow-sm border border-gray-100"
                        />

                        <div className="card" style={{ padding: 'var(--spacing-xl)', marginBottom: 'var(--spacing-xl)' }}>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px', borderBottom: '2px solid #F3F4F6', paddingBottom: '12px' }}>About Gaushala</h2>
                            <p style={{ fontSize: '1.05rem', lineHeight: 1.8, color: '#4B5563', marginBottom: '16px' }}>
                                {gaushala.description}
                            </p>

                            {/* New Sections: Timings, Services, Achievements */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                                <div>
                                    <h4 style={{ fontWeight: 700, marginBottom: '8px' }}>Timings</h4>
                                    <p style={{ color: '#4B5563' }}>{gaushala.timings || '6:00 AM - 7:00 PM'}</p>
                                </div>
                                {gaushala.services && (
                                    <div>
                                        <h4 style={{ fontWeight: 700, marginBottom: '8px' }}>Services</h4>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                            {gaushala.services.map((svc, i) => (
                                                <span key={i} style={{ fontSize: '0.85rem', background: '#E0F2FE', color: '#0369A1', padding: '2px 8px', borderRadius: '4px' }}>{svc}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {gaushala.achievements && (
                                <div style={{ marginBottom: '20px' }}>
                                    <h4 style={{ fontWeight: 700, marginBottom: '8px' }}>Achievements</h4>
                                    <ul style={{ paddingLeft: '20px', color: '#4B5563' }}>
                                        {gaushala.achievements.map((ach, i) => (
                                            <li key={i}>{ach}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            <div style={{ marginTop: '24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px' }}>
                                <div style={{ backgroundColor: '#ECFDF5', padding: '16px', borderRadius: '8px', textAlign: 'center' }}>
                                    <div style={{ fontSize: '2rem', fontWeight: 700, color: '#059669' }}>{gaushala.cowCount || 0}</div>
                                    <div style={{ color: '#047857', fontWeight: 600 }}>Cows Protected</div>
                                </div>
                                <div style={{ backgroundColor: '#FFF7ED', padding: '16px', borderRadius: '8px', textAlign: 'center' }}>
                                    <div style={{ fontSize: '2rem', fontWeight: 700, color: '#EA580C' }}>{gaushala.staffCount || 0}</div>
                                    <div style={{ color: '#9A3412', fontWeight: 600 }}>Staff Members</div>
                                </div>
                                <div style={{ backgroundColor: '#FEF3C7', padding: '16px', borderRadius: '8px', textAlign: 'center' }}>
                                    <div style={{ fontSize: '2rem', fontWeight: 700, color: '#D97706' }}>Active</div>
                                    <div style={{ color: '#B45309', fontWeight: 600 }}>Status</div>
                                </div>
                            </div>
                        </div>

                        {/* Gallery Section */}
                        {gaushala.gallery && gaushala.gallery.length > 0 && (
                            <div className="card" style={{ padding: 'var(--spacing-xl)', marginBottom: 'var(--spacing-xl)' }}>
                                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>Gallery</h2>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '12px' }}>
                                    {gaushala.gallery.map((img, i) => (
                                        <div key={i} style={{ height: '120px', borderRadius: '8px', overflow: 'hidden' }}>
                                            <img src={img} alt={`Gallery ${i}`} style={{ width: '100%', height: '100%', objectFit: 'cover', cursor: 'pointer' }} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Cows Listing */}
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '20px' }}>Meet Our Cows</h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' }}>
                            {cows.map(cow => (
                                <div key={cow.id} className="card" style={{ overflow: 'hidden', padding: 0 }}>
                                    <div style={{ height: '160px', overflow: 'hidden' }}>
                                        <img src={cow.image} alt={cow.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }}
                                            onMouseOver={e => e.currentTarget.style.transform = 'scale(1.1)'}
                                            onMouseOut={e => e.currentTarget.style.transform = 'scale(1.0)'}
                                        />
                                    </div>
                                    <div style={{ padding: '16px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{cow.name}</h3>
                                            <span style={{ fontSize: '0.8rem', background: '#F3F4F6', padding: '2px 8px', borderRadius: '4px' }}>{cow.breed}</span>
                                        </div>
                                        <div style={{ fontSize: '0.9rem', color: '#6B7280' }}>
                                            {String(cow.status)}
                                        </div>
                                        <button style={{ width: '100%', marginTop: '12px', padding: '8px', border: '1px solid #059669', color: '#059669', background: 'transparent', borderRadius: '4px', cursor: 'pointer', fontWeight: 600 }}>
                                            Adopt
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Column: Sidebar */}
                    <div>
                        <div className="card" style={{ padding: 'var(--spacing-xl)', marginBottom: 'var(--spacing-xl)', position: 'sticky', top: '100px' }}>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '16px' }}>Contact Information</h3>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {gaushala.contact?.phone && (
                                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                        <div style={{ padding: '10px', background: '#F3F4F6', borderRadius: '50%' }}><Phone size={18} color="#4B5563" /></div>
                                        <div>
                                            <div style={{ fontSize: '0.85rem', color: '#6B7280' }}>Phone</div>
                                            <div style={{ fontWeight: 500 }}>{String(gaushala.contact.phone)}</div>
                                        </div>
                                    </div>
                                )}
                                {gaushala.contact?.email && (
                                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                        <div style={{ padding: '10px', background: '#F3F4F6', borderRadius: '50%' }}><Mail size={18} color="#4B5563" /></div>
                                        <div>
                                            <div style={{ fontSize: '0.85rem', color: '#6B7280' }}>Email</div>
                                            <div style={{ fontWeight: 500 }}>{String(gaushala.contact.email)}</div>
                                        </div>
                                    </div>
                                )}
                                {gaushala.contact?.website && (
                                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                        <div style={{ padding: '10px', background: '#F3F4F6', borderRadius: '50%' }}><Globe size={18} color="#4B5563" /></div>
                                        <div>
                                            <div style={{ fontSize: '0.85rem', color: '#6B7280' }}>Website</div>
                                            <div style={{ fontWeight: 500 }}>{String(gaushala.contact.website)}</div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <hr style={{ margin: '24px 0', borderTop: '1px solid #E5E7EB' }} />

                            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '16px' }}>Location</h3>
                            <div style={{ borderRadius: '8px', overflow: 'hidden', height: '200px', background: '#E5E7EB' }}>
                                <iframe
                                    width="100%"
                                    height="100%"
                                    frameBorder="0"
                                    style={{ border: 0 }}
                                    src={`https://www.google.com/maps/embed/v1/place?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&q=${encodeURIComponent(locationString)}`}
                                    allowFullScreen
                                ></iframe>
                            </div>
                            <Button variant="secondary" style={{ width: '100%', marginTop: '16px' }}>
                                <Share2 size={18} style={{ marginRight: '8px' }} /> Share Gaushala
                            </Button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default GaushalaSingle;
