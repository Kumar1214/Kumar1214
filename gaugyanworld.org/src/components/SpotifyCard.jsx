import React from 'react';
import { motion } from 'framer-motion';

const SpotifyCard = ({
    image,
    title,
    subtitle,
    onClick,
    onPlay,
    showPlayButton = true,
    className = ''
}) => {
    const [isHovered, setIsHovered] = React.useState(false);

    return (
        <motion.div
            className={`spotify-card ${className}`}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={onClick}
            style={{
                background: '#181818',
                borderRadius: '8px',
                padding: '16px',
                cursor: 'pointer',
                transition: 'background-color 0.2s',
                position: 'relative'
            }}
        >
            {/* Image Container */}
            <div style={{
                position: 'relative',
                width: '100%',
                paddingBottom: '100%',
                marginBottom: '16px',
                borderRadius: '4px',
                overflow: 'hidden',
                background: '#282828'
            }}>
                {image && (
                    <img
                        src={image}
                        alt={title}
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                        }}
                    />
                )}

                {/* Play Button Overlay */}
                {showPlayButton && onPlay && (
                    <motion.button
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{
                            opacity: isHovered ? 1 : 0,
                            scale: isHovered ? 1 : 0.8
                        }}
                        transition={{ duration: 0.2 }}
                        onClick={(e) => {
                            e.stopPropagation();
                            onPlay();
                        }}
                        style={{
                            position: 'absolute',
                            bottom: '8px',
                            right: '8px',
                            width: '48px',
                            height: '48px',
                            borderRadius: '50%',
                            background: '#1DB954',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 8px 16px rgba(0,0,0,0.3)',
                            zIndex: 2
                        }}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                            <path d="M8 5v14l11-7z" />
                        </svg>
                    </motion.button>
                )}
            </div>

            {/* Content */}
            <div>
                <h3 style={{
                    color: '#fff',
                    fontSize: '16px',
                    fontWeight: 700,
                    marginBottom: '4px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                }}>
                    {title}
                </h3>
                {subtitle && (
                    <p style={{
                        color: '#b3b3b3',
                        fontSize: '14px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                    }}>
                        {subtitle}
                    </p>
                )}
            </div>

            <style>{`
                .spotify-card:hover {
                    background-color: #282828 !important;
                }
            `}</style>
        </motion.div>
    );
};

export default SpotifyCard;
