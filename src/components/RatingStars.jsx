import React from 'react';
import { Heart } from 'lucide-react';

const RatingStars = ({ rating = 0, maxRating = 5, size = 20, interactive = false, onChange }) => {
    const [hoverRating, setHoverRating] = React.useState(0);

    const handleClick = (value) => {
        if (interactive && onChange) {
            onChange(value);
        }
    };

    const handleMouseEnter = (value) => {
        if (interactive) {
            setHoverRating(value);
        }
    };

    const handleMouseLeave = () => {
        if (interactive) {
            setHoverRating(0);
        }
    };

    const displayRating = interactive ? (hoverRating || rating) : rating;

    return (
        <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
            {[...Array(maxRating)].map((_, index) => {
                const starValue = index + 1;
                const isFilled = starValue <= displayRating;
                const isPartial = starValue > displayRating && starValue - 1 < displayRating;
                const partialFill = isPartial ? ((displayRating % 1) * 100) : 0;

                return (
                    <div
                        key={index}
                        onClick={() => handleClick(starValue)}
                        onMouseEnter={() => handleMouseEnter(starValue)}
                        onMouseLeave={handleMouseLeave}
                        style={{
                            cursor: interactive ? 'pointer' : 'default',
                            position: 'relative',
                            width: size,
                            height: size
                        }}
                    >
                        {/* Background star */}
                        <svg
                            width={size}
                            height={size}
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#E5E7EB"
                            strokeWidth="1.5"
                            style={{ position: 'absolute', top: 0, left: 0 }}
                        >
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>

                        {/* Filled star */}
                        {(isFilled || isPartial) && (
                            <svg
                                width={size}
                                height={size}
                                viewBox="0 0 24 24"
                                fill="#F59E0B"
                                stroke="#F59E0B"
                                strokeWidth="1.5"
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    clipPath: isPartial ? `inset(0 ${100 - partialFill}% 0 0)` : 'none'
                                }}
                            >
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                        )}
                    </div>
                );
            })}
            {!interactive && (
                <span style={{
                    marginLeft: '8px',
                    fontSize: '0.875rem',
                    color: '#6B7280',
                    fontWeight: 500
                }}>
                    {rating.toFixed(1)}
                </span>
            )}
        </div>
    );
};

export default RatingStars;
