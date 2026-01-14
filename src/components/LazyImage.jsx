import React, { useState, useEffect, useRef } from 'react';

/**
 * Lazy loading image component with Intersection Observer
 * Supports responsive images, blur-up effect, and WebP format
 */
const LazyImage = ({
    src,
    alt,
    className = '',
    width,
    height,
    placeholder = '/placeholder.jpg',
    blurDataURL,
    objectFit = 'cover',
    onLoad,
    onError,
    ...props
}) => {
    const [imageSrc, setImageSrc] = useState(placeholder || blurDataURL);
    const [imageRef, setImageRef] = useState();
    const [isLoaded, setIsLoaded] = useState(false);
    const [isInView, setIsInView] = useState(false);

    useEffect(() => {
        let observer;

        if (imageRef && !isInView) {
            observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            setIsInView(true);
                            observer.unobserve(imageRef);
                        }
                    });
                },
                {
                    rootMargin: '50px', // Start loading 50px before image enters viewport
                }
            );

            observer.observe(imageRef);
        }

        return () => {
            if (observer && imageRef) {
                observer.unobserve(imageRef);
            }
        };
    }, [imageRef, isInView]);

    useEffect(() => {
        if (isInView && src) {
            const img = new Image();

            img.onload = () => {
                setImageSrc(src);
                setIsLoaded(true);
                if (onLoad) onLoad();
            };

            img.onerror = () => {
                setImageSrc(placeholder || '/error-image.jpg');
                if (onError) onError();
            };

            img.src = src;
        }
    }, [isInView, src, placeholder, onLoad, onError]);

    return (
        <div
            ref={setImageRef}
            className={`lazy-image-container ${className}`}
            style={{
                position: 'relative',
                overflow: 'hidden',
                width: width || '100%',
                height: height || 'auto',
            }}
        >
            <img
                src={imageSrc}
                alt={alt}
                className={`lazy-image ${isLoaded ? 'loaded' : 'loading'}`}
                style={{
                    width: '100%',
                    height: '100%',
                    objectFit,
                    transition: 'opacity 0.3s ease-in-out, filter 0.3s ease-in-out',
                    opacity: isLoaded ? 1 : 0.6,
                    filter: isLoaded ? 'none' : 'blur(10px)',
                }}
                loading="lazy"
                {...props}
            />
            {!isLoaded && (
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'rgba(0, 0, 0, 0.1)',
                    }}
                >
                    <div className="spinner" />
                </div>
            )}
        </div>
    );
};

export default LazyImage;
