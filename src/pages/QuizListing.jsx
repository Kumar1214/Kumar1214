import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HelpCircle, Search, Clock, Trophy, Calendar, Gift, Award } from 'lucide-react';
import { contentService } from '../services/api';
import { parseArrayField } from '../utils/jsonUtils';

const QuizListing = () => {
    const navigate = useNavigate();
    const [selectedCategory, setSelectedCategory] = useState('all');

    const categories = ['All', 'Ayurveda', 'Yoga', 'Vedic Studies', 'Sanskrit', 'General Knowledge'];

    // Mock Date for "Live" status logic
    const today = new Date();
    const yesterday = new Date(today); yesterday.setDate(yesterday.getDate() - 1);
    const tomorrow = new Date(today); tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date(today); nextWeek.setDate(nextWeek.getDate() + 7);

    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                const response = await contentService.getQuizzes();
                if (response.data && response.data.success) {
                    setQuizzes(response.data.data);
                } else if (Array.isArray(response.data)) {
                    setQuizzes(response.data);
                }
            } catch (error) {
                console.error('Error fetching quizzes:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchQuizzes();
    }, []);

    // Helper for image URLs
    const getImageUrl = (path) => {
        if (!path) return 'https://placehold.co/600x400';
        if (path.startsWith('http')) return path;
        return `${import.meta.env.VITE_API_URL || 'https://gaugyanworld.org'}${path}`;
    };

    const filteredQuizzes = selectedCategory === 'all' ? quizzes : quizzes.filter(quiz => quiz.category?.toLowerCase() === selectedCategory.toLowerCase());

    const getStatus = (startDate, endDate) => {
        if (!startDate || !endDate) return { label: 'Self-Paced', color: '#8B5CF6', bg: '#EDE9FE' };

        const now = new Date();
        const start = new Date(startDate);
        const end = new Date(endDate);

        if (isNaN(start.getTime()) || isNaN(end.getTime())) return { label: 'Self-Paced', color: '#8B5CF6', bg: '#EDE9FE' };

        if (now < start) return { label: 'Upcoming', color: '#3B82F6', bg: '#DBEAFE' };
        if (now >= start && now <= end) return { label: 'Live', color: '#10B981', bg: '#D1FAE5' };
        return { label: 'Ended', color: '#6B7280', bg: '#F3F4F6' };
    };

    return (
        <div>
            <div style={{ background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)', color: 'white', padding: '3rem 0', textAlign: 'center' }}>
                <div className="container">
                    <HelpCircle size={48} style={{ margin: '0 auto var(--spacing-md)' }} />
                    <h1 style={{ fontSize: '2.5rem', marginBottom: 'var(--spacing-md)' }}>Knowledge Quizzes</h1>
                    <p style={{ fontSize: '1.1rem', marginBottom: 'var(--spacing-xl)', opacity: 0.9 }}>Test your knowledge with fun and interactive quizzes</p>
                    <div style={{ maxWidth: '600px', margin: '0 auto', position: 'relative' }}>
                        <input type="text" placeholder="Search quizzes..." onClick={() => navigate('/quizzes/search')} style={{ width: '100%', padding: '16px 50px 16px 20px', borderRadius: 'var(--radius-full)', border: 'none', fontSize: '1rem', cursor: 'pointer' }} />
                        <Search size={20} style={{ position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                    </div>
                </div>
            </div>

            <div className="container mt-lg">
                {loading ? (
                    <div className="text-center py-12 text-gray-500">Loading quizzes...</div>
                ) : (
                    <>
                        <div style={{ display: 'flex', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-2xl)', flexWrap: 'wrap', justifyContent: 'center' }}>
                            {categories.map(cat => (
                                <button key={cat} onClick={() => setSelectedCategory(cat.toLowerCase())} style={{ padding: '10px 24px', borderRadius: 'var(--radius-full)', border: 'none', backgroundColor: selectedCategory === cat.toLowerCase() ? '#F59E0B' : '#F3F4F6', color: selectedCategory === cat.toLowerCase() ? 'white' : 'var(--color-text-main)', cursor: 'pointer', fontWeight: 600, transition: 'all 0.2s' }}>
                                    {cat}
                                </button>
                            ))}
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 'var(--spacing-lg)', marginBottom: 'var(--spacing-3xl)' }}>
                            {filteredQuizzes.map(quiz => {
                                const status = getStatus(quiz.startDate, quiz.endDate);
                                return (
                                    <div key={quiz.id} onClick={() => navigate(`/quizzes/${quiz.id}`)} className="card" style={{ overflow: 'hidden', cursor: 'pointer', transition: 'transform 0.2s', position: 'relative' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                                        <div style={{ height: '160px', overflow: 'hidden', position: 'relative' }}>
                                            <img src={getImageUrl(quiz.image)} alt={quiz.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => e.target.src = 'https://placehold.co/600x400'} />
                                            <div style={{ position: 'absolute', top: '10px', right: '10px', padding: '4px 12px', borderRadius: 'var(--radius-full)', backgroundColor: status.bg, color: status.color, fontSize: '0.75rem', fontWeight: 700 }}>
                                                {status.label}
                                            </div>
                                            {quiz.price === 0 ? (
                                                <div style={{ position: 'absolute', bottom: '10px', left: '10px', padding: '4px 10px', borderRadius: '4px', backgroundColor: 'rgba(0,0,0,0.7)', color: 'white', fontSize: '0.8rem', fontWeight: 600 }}>
                                                    Free
                                                </div>
                                            ) : (
                                                <div style={{ position: 'absolute', bottom: '10px', left: '10px', padding: '4px 10px', borderRadius: '4px', backgroundColor: '#F59E0B', color: 'white', fontSize: '0.8rem', fontWeight: 600 }}>
                                                    ₹{quiz.price}
                                                </div>
                                            )}
                                        </div>
                                        <div style={{ padding: 'var(--spacing-lg)' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <span style={{ fontSize: '0.85rem', color: '#F59E0B', fontWeight: 600 }}>{quiz.category || 'General'}</span>
                                                {parseArrayField(quiz.prizes).length > 0 && (
                                                    <div title={parseArrayField(quiz.prizes).map(p => p.title).join(', ')} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: '#D97706', backgroundColor: '#FEF3C7', padding: '2px 8px', borderRadius: '12px' }}>
                                                        <Gift size={12} /> Prizes
                                                    </div>
                                                )}
                                            </div>
                                            <h3 style={{ fontSize: '1.25rem', marginTop: '4px', marginBottom: 'var(--spacing-sm)' }}>{quiz.title}</h3>
                                            <div style={{ display: 'flex', gap: 'var(--spacing-md)', fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: 'var(--spacing-md)', flexWrap: 'wrap' }}>
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={14} /> {quiz.duration} mins</span>
                                                <span>{parseArrayField(quiz.questions).length} Qs</span>
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Trophy size={14} /> {quiz.attempts || 0}</span>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <span style={{ padding: '4px 12px', backgroundColor: '#F3F4F6', color: '#4B5563', borderRadius: 'var(--radius-full)', fontSize: '0.85rem', fontWeight: 600 }}>{quiz.difficulty || 'Medium'}</span>
                                                {status.label === 'Ended' && (
                                                    <span style={{ fontSize: '0.8rem', color: '#10B981', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                        <Award size={14} /> Winners Out
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default QuizListing;
