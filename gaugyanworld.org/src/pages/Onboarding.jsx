import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const Onboarding = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(0); // 0: Logo, 1: Video, 2: Highlights
    const [highlightIndex, setHighlightIndex] = useState(0);
    const videoRef = useRef(null);

    // Highlights Content
    const highlights = [
        {
            icon: "📚",
            title: "Learn & Grow",
            desc: "Master ancient wisdom through our structured courses and gain certifications."
        },
        {
            icon: "🛍️",
            title: "Shop Organic",
            desc: "Buy authentic, organic products directly from Gaushalas and support the cause."
        },
        {
            icon: "🎧",
            title: "Soulful Media",
            desc: "Listen to divine music, podcasts, and guided meditations."
        }
    ];

    // Finish onboarding
    const handleFinish = () => {
        localStorage.setItem('onboarding_seen', 'true');
        navigate('/login');
    };

    // Step 0: Logo Timer
    useEffect(() => {
        if (step === 0) {
            const timer = setTimeout(() => {
                setStep(1);
            }, 3000); // 3 seconds logo splash
            return () => clearTimeout(timer);
        }
    }, [step]);

    // Step 1: Video Auto-play
    useEffect(() => {
        if (step === 1 && videoRef.current) {
            videoRef.current.muted = true; // Required for mobile autoplay usually
            videoRef.current.play().catch(e => console.log('Autoplay blocked', e));
        }
    }, [step]);

    const handleVideoEnd = () => {
        setStep(2);
    };

    const handleNextHighlight = () => {
        if (highlightIndex < highlights.length - 1) {
            setHighlightIndex(highlightIndex + 1);
        } else {
            handleFinish();
        }
    };

    // --- RENDER ---

    // 1. LOGO SCREEN
    if (step === 0) {
        return (
            <div style={{
                position: 'fixed', inset: 0, backgroundColor: 'white', zIndex: 10000,
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
            }}>
                <img
                    src="/gaugyan-logo.png"
                    alt="Logo"
                    style={{
                        width: '180px',
                        animation: 'pulse 2s infinite'
                    }}
                />
            </div>
        );
    }

    // 2. VIDEO SCREEN
    if (step === 1) {
        return (
            <div style={{
                position: 'fixed', inset: 0, backgroundColor: 'black', zIndex: 10000,
                display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
                <button
                    onClick={() => setStep(2)}
                    style={{
                        position: 'absolute', top: '40px', right: '20px', zIndex: 10,
                        background: 'rgba(255,255,255,0.2)', color: 'white', border: 'none',
                        padding: '8px 16px', borderRadius: '20px', backdropFilter: 'blur(4px)',
                        cursor: 'pointer'
                    }}
                >
                    Skip
                </button>
                <video
                    ref={videoRef}
                    src="/assets/intro.mp4" // Placeholder path
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onEnded={handleVideoEnd}
                    muted
                    playsInline
                    controls={false}
                    onError={(e) => {
                        console.warn("Video failed to load", e);
                        // Auto skip if video fails
                        setStep(2);
                    }}
                />
                {/* Fallback text if video is blank/loading/missing */}
                <div style={{ position: 'absolute', color: 'rgba(255,255,255,0.5)', pointerEvents: 'none' }}>
                    Video Playing...
                </div>
            </div>
        );
    }

    // 3. HIGHLIGHTS SCREEN
    const currentH = highlights[highlightIndex];

    return (
        <div className="bg-white fixed inset-0 z-[10000] flex flex-col">
            {/* Top Bar */}
            <div className="p-4 flex justify-end">
                <button onClick={handleFinish} className="text-gray-400 font-medium hover:text-primary transition-colors">
                    Skip
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center max-w-md mx-auto w-full">
                <div
                    className={`w-48 h-48 mx-auto mb-10 rounded-full flex items-center justify-center text-8xl transition-colors duration-500 ${highlightIndex === 0 ? 'bg-secondary/30' : highlightIndex === 1 ? 'bg-primary-light/20' : 'bg-secondary-dark/30'
                        }`}
                >
                    <span className="animate-bounce">{currentH.icon}</span>
                </div>

                <h2 className="text-3xl font-bold mb-4 text-primary transition-all duration-300 font-display">
                    {currentH.title}
                </h2>
                <p className="text-gray-500 leading-relaxed text-lg max-w-xs mx-auto">
                    {currentH.desc}
                </p>
            </div>

            {/* Bottom */}
            <div className="p-8 max-w-md mx-auto w-full">
                {/* Dots */}
                <div className="flex justify-center gap-2 mb-8">
                    {highlights.map((_, i) => (
                        <div key={i}
                            className={`h-2 rounded-full transition-all duration-300 ease-in-out ${i === highlightIndex ? 'w-6 bg-primary' : 'w-2 bg-gray-200'
                                }`}
                        />
                    ))}
                </div>

                <button
                    onClick={handleNextHighlight}
                    className="w-full py-4 bg-primary text-white rounded-xl font-semibold text-lg flex items-center justify-center gap-2 shadow-lg shadow-primary/30 hover:bg-primary-dark transition-all active:scale-95"
                >
                    {highlightIndex === highlights.length - 1 ? "Get Started" : "Next"} <ChevronRight size={20} />
                </button>
            </div>
        </div>
    );
};

export default Onboarding;
