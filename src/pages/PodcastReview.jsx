import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, ArrowLeft, ThumbsUp } from 'lucide-react';
import Button from '../components/Button';

const PodcastReview = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [reviewText, setReviewText] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const podcast = {
        id: id,
        title: 'The Science of Ayurveda',
        host: 'Dr. Vasant Lad',
        image: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&q=80&w=200'
    };

    const existingReviews = [
        {
            id: 1,
            user: 'Sunita Devi',
            rating: 5,
            date: 'Nov 22, 2024',
            comment: 'Incredible podcast! Dr. Lad explains complex Ayurvedic concepts in such a simple way. I\'ve learned so much about doshas and daily routines.',
            helpful: 67
        },
        {
            id: 2,
            user: 'Amit Sharma',
            rating: 5,
            date: 'Nov 18, 2024',
            comment: 'This is exactly what I was looking for. The episodes on herbal remedies have been life-changing. Highly recommend to anyone interested in holistic health.',
            helpful: 52
        },
        {
            id: 3,
            user: 'Priya Patel',
            rating: 4,
            date: 'Nov 12, 2024',
            comment: 'Great content and very informative. Would love to see more episodes on specific health conditions. Overall, a must-listen!',
            helpful: 38
        },
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        if (rating === 0) {
            alert('Please select a rating');
            return;
        }
        setSubmitted(true);
        setTimeout(() => {
            navigate(`/podcast/${id}`);
        }, 2000);
    };

    return (
        <div className="container mt-lg">

            {/* Back Button */}
            <button
                onClick={() => navigate(`/podcast/${id}`)}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 16px',
                    border: '1px solid #E5E7EB',
                    backgroundColor: 'white',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    marginBottom: 'var(--spacing-xl)',
                    fontWeight: 500
                }}
            >
                <ArrowLeft size={18} />
                Back to Podcast
            </button>

            <div style={{ maxWidth: '900px', margin: '0 auto' }}>

                {/* Podcast Info Header */}
                <div style={{ display: 'flex', gap: 'var(--spacing-lg)', marginBottom: 'var(--spacing-3xl)', alignItems: 'center' }}>
                    <div style={{ width: '80px', height: '80px', borderRadius: 'var(--radius-md)', overflow: 'hidden', flexShrink: 0 }}>
                        <img src={podcast.image} alt={podcast.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div>
                        <h1 style={{ fontSize: '2rem', marginBottom: '4px' }}>Review: {podcast.title}</h1>
                        <p style={{ color: '#10B981', fontSize: '1.1rem' }}>Hosted by {podcast.host}</p>
                    </div>
                </div>

                {/* Write Review Form */}
                {!submitted ? (
                    <div className="card" style={{ padding: 'var(--spacing-xl)', marginBottom: 'var(--spacing-3xl)' }}>
                        <h2 style={{ fontSize: '1.5rem', marginBottom: 'var(--spacing-lg)' }}>Write Your Review</h2>

                        <form onSubmit={handleSubmit}>
                            {/* Star Rating */}
                            <div style={{ marginBottom: 'var(--spacing-xl)' }}>
                                <label style={{ display: 'block', marginBottom: 'var(--spacing-md)', fontWeight: 600 }}>
                                    Your Rating *
                                </label>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setRating(star)}
                                            onMouseEnter={() => setHoverRating(star)}
                                            onMouseLeave={() => setHoverRating(0)}
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                cursor: 'pointer',
                                                padding: '4px'
                                            }}
                                        >
                                            <Star
                                                size={32}
                                                fill={(hoverRating || rating) >= star ? '#F59E0B' : 'none'}
                                                color={(hoverRating || rating) >= star ? '#F59E0B' : '#D1D5DB'}
                                            />
                                        </button>
                                    ))}
                                    {rating > 0 && (
                                        <span style={{ marginLeft: '12px', alignSelf: 'center', fontSize: '1.1rem', fontWeight: 600 }}>
                                            {rating} / 5
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Review Text */}
                            <div style={{ marginBottom: 'var(--spacing-xl)' }}>
                                <label style={{ display: 'block', marginBottom: 'var(--spacing-md)', fontWeight: 600 }}>
                                    Your Review
                                </label>
                                <textarea
                                    value={reviewText}
                                    onChange={(e) => setReviewText(e.target.value)}
                                    placeholder="Share your thoughts about this podcast... What did you learn? Which episodes did you enjoy most?"
                                    rows="6"
                                    style={{
                                        width: '100%',
                                        padding: 'var(--spacing-md)',
                                        borderRadius: 'var(--radius-md)',
                                        border: '1px solid #E5E7EB',
                                        fontSize: '1rem',
                                        fontFamily: 'inherit',
                                        resize: 'vertical'
                                    }}
                                />
                            </div>

                            <Button type="submit">Submit Review</Button>
                        </form>
                    </div>
                ) : (
                    <div className="card" style={{ padding: 'var(--spacing-2xl)', textAlign: 'center', marginBottom: 'var(--spacing-3xl)' }}>
                        <div style={{ fontSize: '3rem', marginBottom: 'var(--spacing-md)' }}>✓</div>
                        <h2 style={{ fontSize: '1.75rem', marginBottom: 'var(--spacing-md)', color: '#10B981' }}>
                            Thank You for Your Review!
                        </h2>
                        <p style={{ color: 'var(--color-text-muted)' }}>
                            Your feedback helps others discover great podcasts. Redirecting...
                        </p>
                    </div>
                )}

                {/* Existing Reviews */}
                <div>
                    <h2 style={{ fontSize: '1.75rem', marginBottom: 'var(--spacing-lg)' }}>
                        All Reviews ({existingReviews.length})
                    </h2>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
                        {existingReviews.map(review => (
                            <div key={review.id} className="card" style={{ padding: 'var(--spacing-lg)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--spacing-md)' }}>
                                    <div>
                                        <div style={{ fontWeight: 600, marginBottom: '4px' }}>{review.user}</div>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>{review.date}</div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '4px' }}>
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star
                                                key={star}
                                                size={18}
                                                fill={star <= review.rating ? '#F59E0B' : 'none'}
                                                color={star <= review.rating ? '#F59E0B' : '#D1D5DB'}
                                            />
                                        ))}
                                    </div>
                                </div>

                                <p style={{ lineHeight: 1.7, color: 'var(--color-text-main)', marginBottom: 'var(--spacing-md)' }}>
                                    {review.comment}
                                </p>

                                <button
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        padding: '6px 12px',
                                        border: '1px solid #E5E7EB',
                                        backgroundColor: 'white',
                                        borderRadius: 'var(--radius-md)',
                                        cursor: 'pointer',
                                        fontSize: '0.9rem',
                                        color: 'var(--color-text-muted)'
                                    }}
                                >
                                    <ThumbsUp size={16} />
                                    Helpful ({review.helpful})
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default PodcastReview;
