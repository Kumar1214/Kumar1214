import React, { useEffect, useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';

const PreScreen = ({ onComplete, configs }) => {
    const [isVisible, setIsVisible] = useState(true);

    // Default configuration (fallback)
    const safeConfigs = configs || {};
    const type = safeConfigs.preloaderType || 'video';
    const videoSrc = safeConfigs.preloaderVideo || '/intro-video.mp4';
    const imageSrc = safeConfigs.preloaderImage || '/gaugyan-logo.png';

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            if (onComplete) setTimeout(onComplete, 500);
        }, 4000);

        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    className="fixed inset-0 z-[9999] flex items-center justify-center bg-black overflow-hidden"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Background Content */}
                    {type === 'video' ? (
                        <video
                            autoPlay
                            muted
                            loop
                            playsInline
                            className="absolute inset-0 w-full h-full object-cover opacity-60"
                        >
                            <source src={videoSrc} type="video/mp4" />
                        </video>
                    ) : (
                        <div className="absolute inset-0 bg-black">
                            {/* Optional: Background image if user wants, currently just black or same image blurred? 
                                 For now, just black bg for logo preloader looks clean. 
                             */}
                            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black"></div>
                        </div>
                    )}

                    {/* Overlay Content (Logo always shown, or maybe just if image type? Logic below) */}
                    {/* If type is video, we show logo overlay. If type is image, we show the image as the main loader. */}

                    <div className="relative z-10 flex flex-col items-center justify-center">
                        <motion.img
                            src={imageSrc} // Use configured logo/image
                            alt="Brand Logo"
                            className="w-48 h-48 md:w-64 md:h-64 object-contain mb-8 drop-shadow-2xl"
                            initial={{ scale: 0.5, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            transition={{
                                duration: 1.5,
                                ease: "easeOut",
                                type: "spring",
                                stiffness: 100
                            }}
                        />

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1, duration: 1 }}
                            className="text-white text-2xl font-light tracking-widest font-display"
                        >
                            GAUGYAN
                        </motion.div>
                    </div>

                    {/* Overlay Gradient/Dimmer for video */}
                    {type === 'video' && <div className="absolute inset-0 bg-black/40 z-0"></div>}
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default PreScreen;
