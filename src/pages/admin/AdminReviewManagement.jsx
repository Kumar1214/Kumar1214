import React, { useState } from 'react';
import { Star, Check, X, Trash2 } from 'lucide-react';
import RatingStars from '../../components/RatingStars';

const AdminReviewManagement = () => {
    // Mock Reviews Data
    const [reviews, setReviews] = useState([
        { id: 1, product: 'Pure Gir Cow A2 Ghee', user: 'Rahul Kumar', rating: 5, comment: 'Excellent quality ghee! Smells divine.', date: '2023-11-25', status: 'pending' },
        { id: 2, product: 'Organic Dhoop Sticks', user: 'Priya Singh', rating: 4, comment: 'Good fragrance but burns a bit fast.', date: '2023-11-24', status: 'approved' },
        { id: 3, product: 'Herbal Face Pack', user: 'Amit Sharma', rating: 2, comment: 'Caused irritation. Not recommended.', date: '2023-11-23', status: 'pending' },
        { id: 4, product: 'Cow Dung Diya', user: 'Sneha Gupta', rating: 5, comment: 'Beautifully made. Eco-friendly.', date: '2023-11-22', status: 'rejected' },
    ]);

    const handleStatusChange = (id, newStatus) => {
        setReviews(reviews.map(r => r.id === id ? { ...r, status: newStatus } : r));
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this review?')) {
            setReviews(reviews.filter(r => r.id !== id));
        }
    };

    return (
        <div style={{ padding: '2rem' }}>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#1F2937', marginBottom: '2rem' }}>Review Moderation</h1>

            <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid #E5E7EB', textAlign: 'left' }}>
                            <th style={{ padding: '12px', color: '#6B7280', fontWeight: 500 }}>Product</th>
                            <th style={{ padding: '12px', color: '#6B7280', fontWeight: 500 }}>User</th>
                            <th style={{ padding: '12px', color: '#6B7280', fontWeight: 500 }}>Rating</th>
                            <th style={{ padding: '12px', color: '#6B7280', fontWeight: 500, width: '30%' }}>Comment</th>
                            <th style={{ padding: '12px', color: '#6B7280', fontWeight: 500 }}>Date</th>
                            <th style={{ padding: '12px', color: '#6B7280', fontWeight: 500 }}>Status</th>
                            <th style={{ padding: '12px', color: '#6B7280', fontWeight: 500 }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reviews.map((review) => (
                            <tr key={review.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                                <td style={{ padding: '12px', fontWeight: 500 }}>{review.product}</td>
                                <td style={{ padding: '12px', color: '#6B7280' }}>{review.user}</td>
                                <td style={{ padding: '12px' }}>
                                    <RatingStars rating={review.rating} size={14} />
                                </td>
                                <td style={{ padding: '12px', color: '#4B5563', fontSize: '0.9rem' }}>{review.comment}</td>
                                <td style={{ padding: '12px', color: '#6B7280', fontSize: '0.85rem' }}>{review.date}</td>
                                <td style={{ padding: '12px' }}>
                                    <span style={{
                                        padding: '4px 10px',
                                        borderRadius: '20px',
                                        fontSize: '0.85rem',
                                        fontWeight: 500,
                                        backgroundColor:
                                            review.status === 'approved' ? '#D1FAE5' :
                                                review.status === 'pending' ? '#FEF3C7' : '#FEE2E2',
                                        color:
                                            review.status === 'approved' ? '#059669' :
                                                review.status === 'pending' ? '#D97706' : '#DC2626'
                                    }}>
                                        {review.status.charAt(0).toUpperCase() + review.status.slice(1)}
                                    </span>
                                </td>
                                <td style={{ padding: '12px' }}>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        {review.status === 'pending' && (
                                            <>
                                                <button
                                                    onClick={() => handleStatusChange(review.id, 'approved')}
                                                    title="Approve"
                                                    style={{ padding: '6px', border: 'none', background: '#D1FAE5', borderRadius: '4px', cursor: 'pointer', color: '#059669' }}
                                                >
                                                    <Check size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleStatusChange(review.id, 'rejected')}
                                                    title="Reject"
                                                    style={{ padding: '6px', border: 'none', background: '#FEE2E2', borderRadius: '4px', cursor: 'pointer', color: '#DC2626' }}
                                                >
                                                    <X size={18} />
                                                </button>
                                            </>
                                        )}
                                        <button
                                            onClick={() => handleDelete(review.id)}
                                            title="Delete"
                                            style={{ padding: '6px', border: 'none', background: 'none', cursor: 'pointer', color: '#9CA3AF' }}
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminReviewManagement;
