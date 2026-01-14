import React from 'react';

const YouTubeEmbed = ({ url, title = 'YouTube video player', className = '' }) => {
    // Extract video ID from various YouTube URL formats
    const getVideoId = (url) => {
        if (!url) return null;

        // Handle different YouTube URL formats
        const patterns = [
            /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
            /youtube\.com\/watch\?.*v=([^&\n?#]+)/
        ];

        for (const pattern of patterns) {
            const match = url.match(pattern);
            if (match && match[1]) {
                return match[1];
            }
        }

        return null;
    };

    const videoId = getVideoId(url);

    if (!videoId) {
        return (
            <div className={`youtube-embed-error ${className}`} style={{
                padding: '20px',
                background: '#fee',
                border: '1px solid #fcc',
                borderRadius: '8px',
                color: '#c33',
                textAlign: 'center'
            }}>
                <p>Invalid YouTube URL</p>
            </div>
        );
    }

    return (
        <div className={`youtube-embed-container ${className}`} style={{
            position: 'relative',
            paddingBottom: '56.25%', // 16:9 aspect ratio
            height: 0,
            overflow: 'hidden',
            borderRadius: '8px',
            background: '#000'
        }}>
            <iframe
                src={`https://www.youtube.com/embed/${videoId}`}
                title={title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    borderRadius: '8px'
                }}
            />
            <style>{`
                .youtube-embed-container {
                    max-width: 100%;
                }
                
                @media (max-width: 768px) {
                    .youtube-embed-container {
                        border-radius: 0;
                    }
                }
            `}</style>
        </div>
    );
};

export default YouTubeEmbed;
