import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png'; // Assuming logo.png exists
import Button from '../components/Button';

// Features for the highlights section
const HIGHLIGHTS = [
    {
        title: "Learn Ancient Wisdom",
        description: "Access courses on Vedas, Upanishads, and Yoga from expert gurus.",
        icon: "📚"
    },
    {
        title: "Pure Marketplace",
        description: "Shop authentic, organic, and cruelty-free products directly from Gaushalas.",
        icon: "🛍️"
    },
    {
        title: "Soulful Media",
        description: "Listen to divine music, podcasts, and guided meditations.",
        icon: "🎧"
    }
];

const Intro = () => {
    const [step, setStep] = useState(0); // 0: Logo, 1: Video, 2: Highlights
    const [highlightIndex, setHighlightIndex] = useState(0);
    const videoRef = useRef(null);
    const navigate = useNavigate();

    // Step 0: Logo Splash
    useEffect(() => {
        if (step === 0) {
            const timer = setTimeout(() => {
                setStep(1);
            }, 2500); // 2.5s for logo
            return () => clearTimeout(timer);
        }
    }, [step]);

    // Step 1: Video Auto-play
    useEffect(() => {
        if (step === 1 && videoRef.current) {
            videoRef.current.play().catch(e => console.log("Auto-play prevented", e));
        }
    }, [step]);

    const handleVideoEnd = () => {
        setStep(2);
    };

    const handleNextHighlight = () => {
        if (highlightIndex < HIGHLIGHTS.length - 1) {
            setHighlightIndex(prev => prev + 1);
        } else {
            finishIntro();
        }
    };

    const finishIntro = () => {
        localStorage.setItem('hasSeenIntro', 'true');
        navigate('/login');
    };

    // Render Steps
    if (step === 0) {
        return (
            <div style={{
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'white',
                animation: 'fadeIn 0.5s ease-in'
            }}>
                <img
                    src={logo}
                    alt="Gaugyan Logo"
                    style={{ width: '150px', objectFit: 'contain', marginBottom: '20px', animation: 'pulse 2s infinite' }}
                />
                <h1 style={{ color: 'var(--color-primary)', fontSize: '2rem', fontWeight: 'bold' }}>Gaugyan</h1>
            </div>
        );
    }

    if (step === 1) {
        return (
            <div style={{ height: '100vh', backgroundColor: 'black', position: 'relative' }}>
                {/* Placeholder for video if source is missing */}
                <video
                    ref={videoRef}
                    src="/assets/intro.mp4" // Assuming file might exist or needs to be added
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onEnded={handleVideoEnd}
                    muted // Muted needed for auto-play often
                    playsInline
                    controls={false}
                    onError={() => {
                        // Fallback if video fails/missing
                        console.warn("Intro video not found, skipping");
                        setStep(2);
                    }}
                />
                <button
                    onClick={() => setStep(2)}
                    style={{
                        position: 'absolute',
                        top: '20px',
                        right: '20px',
                        padding: '8px 16px',
                        background: 'rgba(0,0,0,0.5)',
                        color: 'white',
                        border: '1px solid white',
                        borderRadius: '20px',
                        cursor: 'pointer'
                    }}
                >
                    Skip
                </button>
            </div>
        );
    }

    // Step 2: Highlights
    const currentFeature = HIGHLIGHTS[highlightIndex];

    return (
        <div style={{
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            padding: '24px',
            backgroundColor: 'white',
            textAlign: 'center',
            justifyContent: 'center'
        }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <div style={{ fontSize: '4rem', marginBottom: '24px', animation: 'float 3s ease-in-out infinite' }}>
                    {currentFeature.icon}
                </div>
                <h2 style={{ fontSize: '2rem', color: '#1F2937', marginBottom: '16px' }}>{currentFeature.title}</h2>
                <p style={{ fontSize: '1.1rem', color: '#6B7280', lineHeight: '1.6', maxWidth: '300px' }}>
                    {currentFeature.description}
                </p>
            </div>

            <div style={{ marginBottom: '40px' }}>
                {/* Dots indicator */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '24px' }}>
                    {HIGHLIGHTS.map((_, idx) => (
                        <div
                            key={idx}
                            style={{
                                width: '10px',
                                height: '10px',
                                borderRadius: '50%',
                                backgroundColor: idx === highlightIndex ? 'var(--color-primary)' : '#D1D5DB',
                                transition: 'all 0.3s'
                            }}
                        />
                    ))}
                </div>

                <Button onClick={handleNextHighlight} fullWidth size="large">
                    {highlightIndex === HIGHLIGHTS.length - 1 ? "Get Started" : "Next"}
                </Button>
            </div>
        </div>
    );
};

export default Intro;
