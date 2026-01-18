import React, { useState, useEffect } from 'react';
import { ThumbsUp, ThumbsDown, Filter, MessageSquare, Star, Calendar } from 'lucide-react';
import { useData } from '../../context/useData';

const KnowledgebaseFeedback = () => {
    const { knowledgebase } = useData();
    const [feedback, setFeedback] = useState([]);
    const [filter, setFilter] = useState('all');
    const [sortBy, setSortBy] = useState('newest');

    // Mock feedback data - in a real implementation, this would come from an API
    const mockFeedback = [
        {
            id: 1,
            articleId: 1,
            articleTitle: 'गौज्ञान की मूल अवधारणा और सामाजिक उद्देश्य',
            userId: 5,
            userName: 'Rajesh Kumar',
            rating: 5,
            helpful: true,
            comment: 'Very informative article. Helped me understand the core concepts better.',
            date: '2024-11-22T10:30:00Z'
        },
        {
            id: 2,
            articleId: 2,
            articleTitle: 'Basic Yoga Poses for Beginners',
            userId: 3,
            userName: 'Priya Desai',
            rating: 4,
            helpful: true,
            comment: 'Good introduction but could use more detailed instructions.',
            date: '2024-11-21T14:15:00Z'
        },
        {
            id: 3,
            articleId: 1,
            articleTitle: 'गौज्ञान की मूल अवधारणा और सामाजिक उद्देश्य',
            userId: 7,
            userName: 'Amit Patel',
            rating: 3,
            helpful: false,
            comment: 'Could be more detailed about the social impact aspects.',
            date: '2024-11-20T09:45:00Z'
        },
        {
            id: 4,
            articleId: 3,
            articleTitle: 'Understanding Chakra Meditation',
            userId: 2,
            userName: 'Swami Anand',
            rating: 5,
            helpful: true,
            comment: 'Excellent explanation of chakras. Very helpful for practitioners.',
            date: '2024-11-19T16:20:00Z'
        }
    ];

    useEffect(() => {
        // In a real implementation, fetch feedback from API
        setFeedback(mockFeedback);
    }, []);

    const handleFeedbackAction = async (feedbackId, action) => {
        // In a real implementation, this would update feedback via API
        try {
            if (action === 'helpful') {
                alert('Marked as helpful!');
            } else if (action === 'notHelpful') {
                alert('Marked as not helpful!');
            }
        } catch (error) {
            console.error("Error updating feedback:", error);
            alert("Failed to update feedback.");
        }
    };

    const filteredFeedback = feedback.filter(item => {
        if (filter !== 'all' && item.articleId !== parseInt(filter)) return false;
        return true;
    });

    const sortedFeedback = [...filteredFeedback].sort((a, b) => {
        if (sortBy === 'newest') {
            return new Date(b.date) - new Date(a.date);
        } else if (sortBy === 'oldest') {
            return new Date(a.date) - new Date(b.date);
        } else if (sortBy === 'ratingHigh') {
            return b.rating - a.rating;
        } else if (sortBy === 'ratingLow') {
            return a.rating - b.rating;
        }
        return 0;
    });

    // Calculate statistics
    const totalFeedback = feedback.length;
    const helpfulFeedback = feedback.filter(item => item.helpful).length;
    const notHelpfulFeedback = feedback.filter(item => !item.helpful).length;
    const averageRating = feedback.length > 0 
        ? (feedback.reduce((sum, item) => sum + item.rating, 0) / feedback.length).toFixed(1)
        : 0;

    return (
        <div>
            {/* Stats Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '30px' }}>
                <div className="card" style={{ padding: '20px', borderRadius: '8px', backgroundColor: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ padding: '12px', borderRadius: '8px', backgroundColor: '#EFF6FF' }}>
                            <MessageSquare size={24} style={{ color: '#3B82F6' }} />
                        </div>
                        <div>
                            <h4 style={{ fontSize: '0.9rem', color: '#6B7280', marginBottom: '4px' }}>Total Feedback</h4>
                            <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{totalFeedback}</p>
                        </div>
                    </div>
                </div>
                
                <div className="card" style={{ padding: '20px', borderRadius: '8px', backgroundColor: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ padding: '12px', borderRadius: '8px', backgroundColor: '#ECFDF5' }}>
                            <ThumbsUp size={24} style={{ color: '#10B981' }} />
                        </div>
                        <div>
                            <h4 style={{ fontSize: '0.9rem', color: '#6B7280', marginBottom: '4px' }}>Helpful</h4>
                            <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{helpfulFeedback}</p>
                        </div>
                    </div>
                </div>
                
                <div className="card" style={{ padding: '20px', borderRadius: '8px', backgroundColor: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ padding: '12px', borderRadius: '8px', backgroundColor: '#FEF3C7' }}>
                            <Star size={24} style={{ color: '#F59E0B' }} />
                        </div>
                        <div>
                            <h4 style={{ fontSize: '0.9rem', color: '#6B7280', marginBottom: '4px' }}>Average Rating</h4>
                            <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{averageRating}/5</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters and Sorting */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    <select 
                        value={filter} 
                        onChange={(e) => setFilter(e.target.value)}
                        style={{ padding: '8px 12px', borderRadius: '4px', border: '1px solid #D1D5DB' }}
                    >
                        <option value="all">All Articles</option>
                        {knowledgebase.map(article => (
                            <option key={article.id || article.id} value={article.id || article.id}>
                                {article.title}
                            </option>
                        ))}
                    </select>
                    
                    <select 
                        value={sortBy} 
                        onChange={(e) => setSortBy(e.target.value)}
                        style={{ padding: '8px 12px', borderRadius: '4px', border: '1px solid #D1D5DB' }}
                    >
                        <option value="newest">Newest First</option>
                        <option value="oldest">Oldest First</option>
                        <option value="ratingHigh">Highest Rated</option>
                        <option value="ratingLow">Lowest Rated</option>
                    </select>
                </div>
            </div>

            {/* Feedback List */}
            <div>
                <h3>User Feedback ({sortedFeedback.length})</h3>
                
                {sortedFeedback.length === 0 ? (
                    <div style={{ padding: '40px', textAlign: 'center', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginTop: '20px' }}>
                        <MessageSquare size={48} style={{ opacity: 0.5, margin: '0 auto 16px', color: '#9CA3AF' }} />
                        <p style={{ color: '#9CA3AF', fontSize: '1.125rem' }}>No feedback found</p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gap: '16px', marginTop: '20px' }}>
                        {sortedFeedback.map(item => (
                            <div key={item.id} className="card" style={{ padding: '20px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                                    <div>
                                        <h4 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>{item.articleTitle}</h4>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#6B7280', fontSize: '0.9rem' }}>
                                            <span>By {item.userName}</span>
                                            <span>•</span>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                <Calendar size={14} />
                                                {new Date(item.date).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        {[...Array(5)].map((_, i) => (
                                            <Star 
                                                key={i} 
                                                size={16} 
                                                style={{ 
                                                    color: i < item.rating ? '#FBBF24' : '#E5E7EB',
                                                    fill: i < item.rating ? '#FBBF24' : 'none'
                                                }} 
                                            />
                                        ))}
                                    </div>
                                </div>
                                
                                <div style={{ marginBottom: '16px', fontSize: '0.95rem', color: '#374151', lineHeight: '1.5' }}>
                                    {item.comment}
                                </div>
                                
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <span style={{ 
                                            padding: '4px 12px', 
                                            borderRadius: '16px', 
                                            fontSize: '0.8rem', 
                                            fontWeight: 500,
                                            backgroundColor: item.helpful ? '#D1FAE5' : '#FEF3C7',
                                            color: item.helpful ? '#065F46' : '#92400E'
                                        }}>
                                            {item.helpful ? 'Helpful' : 'Not Helpful'}
                                        </span>
                                    </div>
                                    
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <button 
                                            onClick={() => handleFeedbackAction(item.id, 'helpful')}
                                            style={{ 
                                                display: 'flex', 
                                                alignItems: 'center', 
                                                gap: '6px', 
                                                padding: '6px 12px', 
                                                border: '1px solid #10B981', 
                                                color: '#10B981', 
                                                borderRadius: '4px', 
                                                cursor: 'pointer', 
                                                background: 'white',
                                                fontSize: '0.85rem'
                                            }}
                                        >
                                            <ThumbsUp size={14} /> Helpful
                                        </button>
                                        <button 
                                            onClick={() => handleFeedbackAction(item.id, 'notHelpful')}
                                            style={{ 
                                                display: 'flex', 
                                                alignItems: 'center', 
                                                gap: '6px', 
                                                padding: '6px 12px', 
                                                border: '1px solid #F87171', 
                                                color: '#F87171', 
                                                borderRadius: '4px', 
                                                cursor: 'pointer', 
                                                background: 'white',
                                                fontSize: '0.85rem'
                                            }}
                                        >
                                            <ThumbsDown size={14} /> Not Helpful
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default KnowledgebaseFeedback;