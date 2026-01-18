import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getImageUrl } from '../utils/imageHelper';
import { bannerService } from '../services/api';

const ModernBannerSlider = ({ placement = 'home' }) => {
    const [banners, setBanners] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBanners = async () => {
            try {
                const response = await bannerService.getBanners();
                const result = response.data;

                if (result.success && Array.isArray(result.data)) {
                    const filteredBanners = result.data.filter(b =>
                        b.isActive &&
                        (b.placement === placement || (!b.placement && placement === 'home'))
                    ).sort((a, b) => (a.order || 0) - (b.order || 0));

                    setBanners(filteredBanners);
                }
            } catch (error) {
                console.error('Error fetching banners:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchBanners();
    }, [placement]);

    // Auto-advance
    useEffect(() => {
        if (banners.length <= 1) return;
        const interval = setInterval(() => {
            setCurrentIndex(prev => (prev + 1) % banners.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [banners.length]);

    const nextSlide = () => setCurrentIndex(prev => (prev + 1) % banners.length);
    const prevSlide = () => setCurrentIndex(prev => (prev - 1 + banners.length) % banners.length);

    if (loading) return <div className="h-[400px] bg-gray-100 animate-pulse rounded-xl" />;

    // Fallback if no banners found - Show default welcome banner ONLY on home
    if (banners.length === 0) {
        if (placement === 'home') {
            return (
                <div className="relative h-[400px] w-full overflow-hidden rounded-2xl bg-gradient-to-r from-blue-900 to-indigo-800 text-white flex items-center justify-center">
                    <div className="text-center p-8">
                        <h1 className="text-4xl font-bold mb-4">Welcome to GauGyan</h1>
                        <p className="text-xl opacity-90">Ancient Wisdom for Modern Living</p>
                    </div>
                </div>
            );
        }
        return null;
    }

    return (
        <div className="relative h-[400px] w-full overflow-hidden rounded-2xl shadow-xl group">
            <AnimatePresence mode='wait'>
                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0"
                >
                    {/* Background Image */}
                    <img
                        src={getImageUrl(banners[currentIndex].imageUrl)}
                        alt={banners[currentIndex].title}
                        className="w-full h-full object-cover"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                    {/* Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 text-white">
                        <motion.h2
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="text-3xl md:text-5xl font-bold mb-4"
                        >
                            {banners[currentIndex].title}
                        </motion.h2>
                        <motion.p
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="text-lg md:text-xl mb-6 max-w-2xl opacity-90"
                        >
                            {banners[currentIndex].description}
                        </motion.p>
                        {banners[currentIndex].linkUrl && (
                            <motion.a
                                href={banners[currentIndex].linkUrl}
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                className="inline-block px-8 py-3 bg-white text-indigo-900 rounded-full font-bold hover:bg-gray-100 transition-colors"
                            >
                                {banners[currentIndex].buttonText || 'Learn More'}
                            </motion.a>
                        )}
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            {banners.length > 1 && (
                <>
                    <button
                        onClick={prevSlide}
                        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white transition-all opacity-0 group-hover:opacity-100"
                    >
                        <ChevronLeft size={32} />
                    </button>
                    <button
                        onClick={nextSlide}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white transition-all opacity-0 group-hover:opacity-100"
                    >
                        <ChevronRight size={32} />
                    </button>

                    {/* Indicators */}
                    <div className="absolute bottom-4 right-8 flex gap-2">
                        {banners.map((_, idx) => (
                            <button
                                key={`dot-${idx}`}
                                onClick={() => setCurrentIndex(idx)}
                                className={`w-3 h-3 rounded-full transition-all ${idx === currentIndex ? 'bg-white w-8' : 'bg-white/50 hover:bg-white/80'
                                    }`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default ModernBannerSlider;
