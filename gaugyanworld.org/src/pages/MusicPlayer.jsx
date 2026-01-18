import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Play, Pause, SkipBack, SkipForward, Volume2, Heart, Share2, ArrowLeft } from 'lucide-react';
import { contentService } from '../services/api';
import LoadingScreen from '../components/LoadingScreen';
import toast from 'react-hot-toast';

const MusicPlayer = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const audioRef = useRef(null);

    // State
    const [track, setTrack] = useState(null);
    const [relatedTracks, setRelatedTracks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);

    // Fetch Track Data
    useEffect(() => {
        const fetchTrack = async () => {
            try {
                setLoading(true);
                const response = await contentService.getMusicById(id);
                if (response.data && response.data.success) {
                    setTrack(response.data.data);
                } else if (response.data) {
                    // Fallback if API structure is direct
                    setTrack(response.data);
                }

                // Fetch related tracks (could be improved with a specific endpoint)
                const relatedRes = await contentService.getMusic({ limit: 3 });
                if (relatedRes.data && relatedRes.data.success && Array.isArray(relatedRes.data.data)) {
                    setRelatedTracks(relatedRes.data.data.filter(t => t.id !== id));
                } else if (Array.isArray(relatedRes.data)) {
                    setRelatedTracks(relatedRes.data.filter(t => t.id !== id));
                } else {
                    setRelatedTracks([]);
                }

            } catch (error) {
                console.error("Error fetching track:", error);
                toast.error("Could not load track");
            } finally {
                setLoading(false);
            }
        };

        fetchTrack();
    }, [id]);

    // Audio Event Listeners
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const updateTime = () => setCurrentTime(audio.currentTime);
        const updateDuration = () => setDuration(audio.duration);
        const onEnded = () => setIsPlaying(false);

        audio.addEventListener('timeupdate', updateTime);
        audio.addEventListener('loadedmetadata', updateDuration);
        audio.addEventListener('ended', onEnded);

        return () => {
            audio.removeEventListener('timeupdate', updateTime);
            audio.removeEventListener('loadedmetadata', updateDuration);
            audio.removeEventListener('ended', onEnded);
        };
    }, [track]); // Re-attach when track changes (and audio element re-renders)

    const togglePlay = () => {
        const audio = audioRef.current;
        if (!audio) return;

        if (isPlaying) {
            audio.pause();
        } else {
            audio.play().catch(e => console.error("Playback error:", e));
        }
        setIsPlaying(!isPlaying);
    };

    const handleSeek = (e) => {
        const audio = audioRef.current;
        if (!audio) return;

        const seekTime = (e.target.value / 100) * duration;
        audio.currentTime = seekTime;
        setCurrentTime(seekTime);
    };

    const handleVolumeChange = (e) => {
        const newVolume = e.target.value / 100;
        if (audioRef.current) audioRef.current.volume = newVolume;
        setVolume(newVolume);
    };

    const formatTime = (time) => {
        if (isNaN(time)) return '0:00';
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    if (loading) return <LoadingScreen />;
    if (!track) return <div className="text-center mt-xl">Track not found. <button onClick={() => navigate('/music')} className="text-blue-500 underline">Go Back</button></div>;

    // Helper: Detect YouTube
    const getYouTubeEmbedUrl = (url) => {
        if (!url) return null;
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}?autoplay=1` : null;
    };

    const isYouTube = track?.videoUrl && getYouTubeEmbedUrl(track.videoUrl);
    const isSelfHostedVideo = track?.videoUrl && !isYouTube;

    // Determine source
    const mediaSrc = track?.videoUrl || track?.audioUrl;

    return (
        <div className="container mt-lg" style={{ maxWidth: '900px', margin: '0 auto', paddingBottom: '100px' }}>
            <button
                onClick={() => navigate('/music')}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '20px',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--color-text-muted)'
                }}
            >
                <ArrowLeft size={20} /> Back
            </button>

            {/* Media Player Area */}
            <div style={{ width: '100%', borderRadius: 'var(--radius-lg)', overflow: 'hidden', backgroundColor: 'black', marginBottom: 'var(--spacing-xl)', boxShadow: 'var(--shadow-lg)' }}>
                {isYouTube ? (
                    <div style={{ position: 'relative', paddingTop: '56.25%' /* 16:9 Aspect Ratio */ }}>
                        <iframe
                            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                            src={getYouTubeEmbedUrl(track.videoUrl)}
                            title={track.title}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    </div>
                ) : isSelfHostedVideo ? (
                    <video
                        src={track.videoUrl}
                        controls
                        width="100%"
                        ref={audioRef} // Reusing ref for events
                        onTimeUpdate={() => setCurrentTime(audioRef.current?.currentTime || 0)}
                        onLoadedMetadata={() => setDuration(audioRef.current?.duration || 0)}
                        onEnded={() => setIsPlaying(false)}
                        poster={track.coverArt || track.image}
                    />
                ) : (
                    // Default Audio View (Visualizer Placeholder + Audio Tag)
                    <div style={{ padding: '20px', display: 'flex', justifyContent: 'center' }}>
                        <audio ref={audioRef} src={mediaSrc} autoPlay={false} />
                        {/* We keep audio hidden effectively and control it via custom UI below, or simple controls */}
                    </div>
                )}
            </div>

            {/* Album Art & Info */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 'var(--spacing-2xl)' }}>
                <div style={{
                    width: '300px',
                    height: '300px',
                    borderRadius: 'var(--radius-lg)',
                    overflow: 'hidden',
                    boxShadow: 'var(--shadow-lg)',
                    marginBottom: 'var(--spacing-xl)',
                    position: 'relative'
                }}>
                    <img
                        src={track.coverArt || track.image || 'https://placehold.co/400'}
                        alt={track.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => e.target.src = 'https://placehold.co/400?text=Music'}
                    />
                </div>

                <h1 style={{ fontSize: '2rem', marginBottom: 'var(--spacing-sm)', textAlign: 'center' }}>{track.title}</h1>
                <p style={{ fontSize: '1.2rem', color: 'var(--color-primary)', marginBottom: 'var(--spacing-md)' }}>{track.artist || track.uploadedBy?.name || 'Unknown Artist'}</p>

                <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
                    <button style={{ padding: '8px', borderRadius: '50%', border: '1px solid #E5E7EB', background: 'white', cursor: 'pointer' }}>
                        <Heart size={20} />
                    </button>
                    <button style={{ padding: '8px', borderRadius: '50%', border: '1px solid #E5E7EB', background: 'white', cursor: 'pointer' }}>
                        <Share2 size={20} />
                    </button>
                </div>
            </div>

            {/* Player Controls */}
            <div className="card" style={{ padding: 'var(--spacing-xl)' }}>
                {/* Progress Bar */}
                <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={(currentTime / duration) * 100 || 0}
                        onChange={handleSeek}
                        style={{ width: '100%', cursor: 'pointer' }}
                    />
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '8px' }}>
                        <span>{formatTime(currentTime)}</span>
                        <span>{formatTime(duration)}</span>
                    </div>
                </div>

                {/* Playback Controls */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--spacing-lg)', marginBottom: 'var(--spacing-lg)' }}>
                    <button style={{ padding: '12px', borderRadius: '50%', border: 'none', background: '#F3F4F6', cursor: 'pointer' }}>
                        <SkipBack size={24} />
                    </button>

                    <button
                        onClick={togglePlay}
                        style={{
                            padding: '20px',
                            borderRadius: '50%',
                            border: 'none',
                            background: 'var(--color-primary)',
                            color: 'white',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                        }}
                    >
                        {isPlaying ? <Pause size={32} fill="white" /> : <Play size={32} fill="white" />}
                    </button>

                    <button style={{ padding: '12px', borderRadius: '50%', border: 'none', background: '#F3F4F6', cursor: 'pointer' }}>
                        <SkipForward size={24} />
                    </button>
                </div>

                {/* Volume Control */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)', justifyContent: 'center' }}>
                    <Volume2 size={20} />
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={volume * 100}
                        onChange={handleVolumeChange}
                        style={{ width: '150px', cursor: 'pointer' }}
                    />
                </div>
            </div>

            {/* Up Next */}
            {relatedTracks.length > 0 && (
                <div style={{ marginTop: 'var(--spacing-2xl)' }}>
                    <h3 style={{ marginBottom: 'var(--spacing-lg)' }}>You Might Also Like</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                        {relatedTracks.map(t => (
                            <div
                                key={t.id}
                                onClick={() => navigate(`/music/${t.id}/player`)}
                                className="card"
                                style={{
                                    padding: 'var(--spacing-md)',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    cursor: 'pointer'
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <img src={t.coverArt || 'https://placehold.co/50'} style={{ width: '40px', height: '40px', borderRadius: '4px', objectFit: 'cover' }} alt="" />
                                    <div>
                                        <h4 style={{ marginBottom: '4px', fontSize: '1rem' }}>{t.title}</h4>
                                        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>{t.artist || 'Unknown'}</p>
                                    </div>
                                </div>
                                <span style={{ color: 'var(--color-text-muted)' }}>{t.duration}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default MusicPlayer;
