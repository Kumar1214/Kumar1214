import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Play, Music, Mic, Headphones } from 'lucide-react';
import SectionHeader from '../components/SectionHeader';
import { useData } from '../context/useData';



const Entertainment = () => {
    const { music, podcasts } = useData();
    const [activeTab, setActiveTab] = useState('All');

    return (
        <div className="container mt-lg">
            <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-2xl)' }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: 'var(--spacing-sm)', color: 'var(--color-text-main)' }}>Soulful Entertainment</h1>
                <p style={{ color: 'var(--color-text-muted)' }}>Immerse yourself in divine music, enlightening podcasts, and peaceful meditation.</p>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-xl)' }}>
                {['All', 'Music', 'Podcasts', 'Meditation'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        style={{
                            padding: '0.75rem 1.5rem',
                            borderRadius: 'var(--radius-full)',
                            border: activeTab === tab ? 'none' : '1px solid #E5E7EB',
                            backgroundColor: activeTab === tab ? 'var(--color-primary)' : 'white',
                            color: activeTab === tab ? 'white' : 'var(--color-text-main)',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}
                    >
                        {tab === 'Music' && <Music size={18} />}
                        {tab === 'Podcasts' && <Mic size={18} />}
                        {tab === 'Meditation' && <Headphones size={18} />}
                        {tab}
                    </button>
                ))}
            </div>

            {/* Music Section */}
            {(activeTab === 'All' || activeTab === 'Music' || activeTab === 'Meditation') && (
                <div style={{ marginBottom: 'var(--spacing-3xl)' }}>
                    <SectionHeader title="Divine Music & Meditation" />
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 'var(--spacing-lg)' }}>
                        {music.map(track => (
                            <div key={track.id} className="card" style={{ padding: 0, overflow: 'hidden', position: 'relative', cursor: 'pointer' }}>
                                <div style={{ height: '200px', position: 'relative' }}>
                                    <img src={track.coverArt} alt={track.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    <div style={{
                                        position: 'absolute',
                                        top: '50%',
                                        left: '50%',
                                        transform: 'translate(-50%, -50%)',
                                        backgroundColor: 'rgba(255, 107, 0, 0.8)',
                                        borderRadius: '50%',
                                        padding: '16px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                                    }}>
                                        <Play size={24} color="white" fill="white" />
                                    </div>
                                </div>
                                <div style={{ padding: 'var(--spacing-md)' }}>
                                    <h3 style={{ fontSize: '1.1rem', marginBottom: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{track.title}</h3>
                                    <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>{track.artist}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Podcasts Section */}
            {(activeTab === 'All' || activeTab === 'Podcasts') && (
                <div>
                    <SectionHeader title="Enlightening Podcasts" />
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 'var(--spacing-lg)' }}>
                        {podcasts.map(podcast => (
                            <Link to={`/podcast/${podcast.id}`} key={podcast.id} className="card" style={{ padding: 'var(--spacing-md)', display: 'flex', gap: 'var(--spacing-md)', alignItems: 'center' }}>
                                <div style={{ width: '100px', height: '100px', borderRadius: 'var(--radius-md)', overflow: 'hidden', flexShrink: 0 }}>
                                    <img src={podcast.coverArt} alt={podcast.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '1.1rem', marginBottom: 'var(--spacing-xs)' }}>{podcast.title}</h3>
                                    <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: 'var(--spacing-xs)' }}>Host: {podcast.host}</p>
                                    <span style={{ fontSize: '0.8rem', backgroundColor: '#F3F4F6', padding: '2px 8px', borderRadius: '4px', color: '#4B5563' }}>{podcast.episodes} Episodes</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Entertainment;
