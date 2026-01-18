import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Search, TrendingUp, Heart, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { contentService } from '../services/api';

const MeditationListing = () => {
    const navigate = useNavigate();
    const [meditation, setMeditation] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDifficulty, setSelectedDifficulty] = useState('All');
    const [currentSlide, setCurrentSlide] = useState(0);

    const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];

    useEffect(() => {
        const fetchMeditations = async () => {
            try {
                const response = await contentService.getMeditations();
                const data = Array.isArray(response.data) ? response.data : response.data.data;
                setMeditation(data || []);
            } catch (error) {
                console.error("Error fetching meditations:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchMeditations();
    }, []);

    // Get featured meditations (those with featured flag or first 3)
    const featuredMeditations = meditation.filter(m => (m.status === 'approved' || m.status === 'active') && m.featured);
    // Fallback if no featured
    const sliderMeditations = featuredMeditations.length > 0 ? featuredMeditations : meditation.slice(0, 3);

    const filteredMeditation = meditation.filter(item => {
        const isApproved = item.status === 'approved' || item.status === 'active' || item.status === 'published';
        const matchesDifficulty = selectedDifficulty === 'All' || item.difficulty === selectedDifficulty;
        return isApproved && matchesDifficulty;
    });

    const getYoutubeId = (url) => {
        if (!url) return null;
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % sliderMeditations.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + sliderMeditations.length) % sliderMeditations.length);
    };

    if (loading) {
        return <div className="p-8 text-center">Loading guided meditations...</div>;
    }

    return (
        <div>
            {/* Hero Section */}
            <div style={{
                background: 'linear-gradient(135deg, #9333EA 0%, #7C3AED 100%)',
                color: 'white',
                padding: '4rem 0',
                textAlign: 'center'
            }}>
                <div className="container">
                    <Heart size={48} style={{ margin: '0 auto var(--spacing-md)' }} />
                    <h1 style={{ fontSize: '3rem', marginBottom: 'var(--spacing-md)' }}>Guided Meditation</h1>
                    <p style={{ fontSize: '1.25rem', marginBottom: 'var(--spacing-xl)', opacity: 0.9 }}>
                        Find inner peace and clarity through mindfulness and meditation
                    </p>
                    <div style={{ maxWidth: '600px', margin: '0 auto', position: 'relative' }}>
                        <input
                            type="text"
                            placeholder="Search meditations, instructors, or topics..."
                            onClick={() => navigate('/meditation/search')}
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
                        <div style={{ fontSize: '2.5rem', fontWeight: 700, color: '#9333EA' }}>{meditation.length}</div>
                        <div style={{ color: 'var(--color-text-muted)' }}>Meditation Sessions</div>
                    </div>
                    <div className="card" style={{ padding: 'var(--spacing-lg)', textAlign: 'center' }}>
                        <div style={{ fontSize: '2.5rem', fontWeight: 700, color: '#9333EA' }}>
                            {meditation.reduce((acc, m) => acc + (m.playCount || 0), 0).toLocaleString()}
                        </div>
                        <div style={{ color: 'var(--color-text-muted)' }}>Total Plays</div>
                    </div>
                    <div className="card" style={{ padding: 'var(--spacing-lg)', textAlign: 'center' }}>
                        <div style={{ fontSize: '2.5rem', fontWeight: 700, color: '#9333EA' }}>
                            {meditation.filter(m => m.type === 'Series').length}
                        </div>
                        <div style={{ color: 'var(--color-text-muted)' }}>Series Available</div>
                    </div>
                </div>

                {/* Difficulty Filter */}
                <div style={{
                    display: 'flex',
                    gap: 'var(--spacing-md)',
                    marginBottom: 'var(--spacing-2xl)',
                    flexWrap: 'wrap',
                    justifyContent: 'center'
                }}>
                    {difficulties.map(difficulty => (
                        <button
                            key={difficulty}
                            onClick={() => setSelectedDifficulty(difficulty)}
                            style={{
                                padding: '10px 24px',
                                borderRadius: 'var(--radius-full)',
                                border: 'none',
                                backgroundColor: selectedDifficulty === difficulty ? '#9333EA' : '#F3F4F6',
                                color: selectedDifficulty === difficulty ? 'white' : 'var(--color-text-main)',
                                cursor: 'pointer',
                                fontWeight: 600,
                                transition: 'all 0.2s'
                            }}
                        >
                            {difficulty}
                        </button>
                    ))}
                </div>

                {/* Featured Meditation Slider */}
                {sliderMeditations.length > 0 && (
                    <div style={{ marginBottom: 'var(--spacing-3xl)' }}>
                        <h2 style={{ fontSize: '1.75rem', marginBottom: 'var(--spacing-lg)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <TrendingUp size={28} /> Featured Meditation
                        </h2>
                        <div style={{ position: 'relative' }}>
                            <div
                                className="card"
                                style={{ overflow: 'hidden', padding: 0, cursor: 'pointer' }}
                                onClick={() => navigate(`/meditation/${sliderMeditations[currentSlide].id || sliderMeditations[currentSlide].id}`)}
                            >
                                {/* YouTube Embed or Image */}
                                {sliderMeditations[currentSlide].videoUrl ? (
                                    <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden' }}>
                                        <iframe
                                            src={`https://www.youtube.com/embed/${getYoutubeId(sliderMeditations[currentSlide].videoUrl)}`}
                                            title={sliderMeditations[currentSlide].title}
                                            frameBorder="0"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                            style={{
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                width: '100%',
                                                height: '100%',
                                                pointerEvents: 'none'
                                            }}
                                        />
                                    </div>
                                ) : (
                                    <div style={{ position: 'relative', height: '400px', overflow: 'hidden' }}>
                                        <img
                                            src={sliderMeditations[currentSlide].coverArt || 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=1200'}
                                            alt={sliderMeditations[currentSlide].title}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                        <div style={{
                                            position: 'absolute',
                                            top: '50%',
                                            left: '50%',
                                            transform: 'translate(-50%, -50%)',
                                            width: '80px',
                                            height: '80px',
                                            backgroundColor: 'rgba(147, 51, 234, 0.9)',
                                            borderRadius: '50%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            cursor: 'pointer'
                                        }}>
                                            <Play size={36} fill="white" color="white" />
                                        </div>
                                    </div>
                                )}

                                {/* Content Below Video */}
                                <div style={{ padding: 'var(--spacing-xl)' }}>
                                    <h3 style={{ fontSize: '2rem', marginBottom: 'var(--spacing-sm)' }}>
                                        {sliderMeditations[currentSlide].title}
                                    </h3>
                                    <p style={{ fontSize: '1.25rem', color: '#9333EA', marginBottom: 'var(--spacing-md)' }}>
                                        Guided by {sliderMeditations[currentSlide].instructor || 'GauGyan'}
                                    </p>
                                    <p style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--spacing-lg)', lineHeight: 1.6 }}>
                                        {sliderMeditations[currentSlide].description}
                                    </p>
                                    <div style={{ display: 'flex', gap: 'var(--spacing-xl)', color: 'var(--color-text-muted)', flexWrap: 'wrap' }}>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <Clock size={16} /> {sliderMeditations[currentSlide].duration}
                                        </span>
                                        <span style={{
                                            padding: '4px 12px',
                                            borderRadius: 'var(--radius-full)',
                                            backgroundColor: sliderMeditations[currentSlide].difficulty === 'Beginner' ? '#10B98120' :
                                                sliderMeditations[currentSlide].difficulty === 'Intermediate' ? '#F5970020' : '#EF444420',
                                            color: sliderMeditations[currentSlide].difficulty === 'Beginner' ? '#10B981' :
                                                sliderMeditations[currentSlide].difficulty === 'Intermediate' ? '#F59700' : '#EF4444',
                                            fontWeight: 600
                                        }}>
                                            {sliderMeditations[currentSlide].difficulty}
                                        </span>
                                        <span>{sliderMeditations[currentSlide].playCount || 0} plays</span>
                                    </div>
                                </div>
                            </div>

                            {/* Slider Navigation */}
                            {sliderMeditations.length > 1 && (
                                <>
                                    <button
                                        onClick={prevSlide}
                                        style={{
                                            position: 'absolute',
                                            left: '-20px',
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            width: '40px',
                                            height: '40px',
                                            borderRadius: '50%',
                                            backgroundColor: 'white',
                                            border: '2px solid #E5E7EB',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            cursor: 'pointer',
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                            transition: 'all 0.2s'
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F3F4F6'}
                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                                    >
                                        <ChevronLeft size={24} color="#9333EA" />
                                    </button>
                                    <button
                                        onClick={nextSlide}
                                        style={{
                                            position: 'absolute',
                                            right: '-20px',
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            width: '40px',
                                            height: '40px',
                                            borderRadius: '50%',
                                            backgroundColor: 'white',
                                            border: '2px solid #E5E7EB',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            cursor: 'pointer',
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                            transition: 'all 0.2s'
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F3F4F6'}
                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                                    >
                                        <ChevronRight size={24} color="#9333EA" />
                                    </button>

                                    {/* Dots Indicator */}
                                    <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: 'var(--spacing-md)' }}>
                                        {sliderMeditations.map((_, index) => (
                                            <button
                                                key={index}
                                                onClick={() => setCurrentSlide(index)}
                                                style={{
                                                    width: currentSlide === index ? '24px' : '8px',
                                                    height: '8px',
                                                    borderRadius: 'var(--radius-full)',
                                                    backgroundColor: currentSlide === index ? '#9333EA' : '#E5E7EB',
                                                    border: 'none',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.3s'
                                                }}
                                            />
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                )}

                {/* All Meditations Grid */}
                <h2 style={{ fontSize: '1.75rem', marginBottom: 'var(--spacing-lg)' }}>All Meditations</h2>
                {filteredMeditation.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                        No meditations found.
                    </div>
                ) : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                        gap: 'var(--spacing-lg)',
                        marginBottom: 'var(--spacing-3xl)'
                    }}>
                        {filteredMeditation.map(item => (
                            <div
                                key={item.id || item.id}
                                onClick={() => navigate(`/meditation/${item.id || item.id}`)}
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
                                        src={item.coverArt || 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=400'}
                                        alt={item.title}
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
                                        fontWeight: 600,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '4px'
                                    }}>
                                        <Clock size={14} /> {item.duration}
                                    </div>
                                    {item.type === 'Series' && (
                                        <div style={{
                                            position: 'absolute',
                                            top: '12px',
                                            left: '12px',
                                            padding: '4px 12px',
                                            backgroundColor: '#9333EA',
                                            color: 'white',
                                            borderRadius: 'var(--radius-full)',
                                            fontSize: '0.75rem',
                                            fontWeight: 700,
                                            textTransform: 'uppercase'
                                        }}>
                                            Series
                                        </div>
                                    )}
                                </div>
                                <div style={{ padding: 'var(--spacing-lg)' }}>
                                    <span style={{
                                        fontSize: '0.85rem',
                                        color: '#9333EA',
                                        fontWeight: 600,
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.5px'
                                    }}>
                                        {item.type || 'Meditation'}
                                    </span>
                                    <h3 style={{ fontSize: '1.25rem', marginTop: '4px', marginBottom: '4px' }}>{item.title}</h3>
                                    <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: 'var(--spacing-sm)' }}>
                                        by {item.instructor || 'GauGyan'}
                                    </p>
                                    <p style={{
                                        fontSize: '0.9rem',
                                        color: 'var(--color-text-muted)',
                                        marginBottom: 'var(--spacing-md)',
                                        lineHeight: 1.5,
                                        display: '-webkit-box',
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: 'vertical',
                                        overflow: 'hidden'
                                    }}>
                                        {item.description}
                                    </p>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{
                                            fontSize: '0.85rem',
                                            padding: '4px 10px',
                                            borderRadius: 'var(--radius-full)',
                                            backgroundColor: item.difficulty === 'Beginner' ? '#10B98120' :
                                                item.difficulty === 'Intermediate' ? '#F5970020' : '#EF444420',
                                            color: item.difficulty === 'Beginner' ? '#10B981' :
                                                item.difficulty === 'Intermediate' ? '#F59700' : '#EF4444',
                                            fontWeight: 600
                                        }}>
                                            {item.difficulty}
                                        </span>
                                        <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                                            {item.playCount || 0} plays
                                        </span>
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

export default MeditationListing;
