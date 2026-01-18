import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Search, Clock, Users, Gift, Award } from 'lucide-react';
import { parseArrayField } from '../utils/jsonUtils';

const ExamListing = () => {
    const navigate = useNavigate();
    const [selectedCategory, setSelectedCategory] = useState('all');

    const categories = ['All', 'Ayurveda', 'Yoga', 'Vedic Studies', 'Sanskrit', 'General'];

    // Mock Date for "Live" status logic
    const today = new Date();
    const yesterday = new Date(today); yesterday.setDate(yesterday.getDate() - 1);
    const tomorrow = new Date(today); tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date(today); nextWeek.setDate(nextWeek.getDate() + 7);

    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchExams = async () => {
            try {
                const response = await import('../services/api').then(module => module.contentService.getExams());
                if (response.data && response.data.success) {
                    setExams(response.data.data);
                } else if (Array.isArray(response.data)) {
                    setExams(response.data);
                }
            } catch (error) {
                console.error('Error fetching exams:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchExams();
    }, []);

    // Helper for image URLs
    const getImageUrl = (path) => {
        if (!path) return 'https://placehold.co/600x400';
        if (path.startsWith('http')) return path;
        return `${import.meta.env.VITE_API_URL || 'https://gaugyanworld.org'}${path}`;
    };

    const filteredExams = selectedCategory === 'all' ? exams : exams.filter(exam => exam.category?.toLowerCase() === selectedCategory.toLowerCase());

    const getStatus = (startDate, endDate) => {
        const now = new Date();
        const start = new Date(startDate);
        const end = new Date(endDate);

        if (now < start) return { label: 'Upcoming', color: '#3B82F6', bg: '#DBEAFE' };
        if (now >= start && now <= end) return { label: 'Live', color: '#10B981', bg: '#D1FAE5' };
        return { label: 'Ended', color: '#6B7280', bg: '#F3F4F6' };
    };

    if (loading) {
        return <div className="p-8 text-center">Loading exams...</div>;
    }

    return (
        <div>
            <div style={{ background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)', color: 'white', padding: '3rem 0', textAlign: 'center' }}>
                <div className="container">
                    <FileText size={48} style={{ margin: '0 auto var(--spacing-md)' }} />
                    <h1 style={{ fontSize: '2.5rem', marginBottom: 'var(--spacing-md)' }}>Certification Exams</h1>
                    <p style={{ fontSize: '1.1rem', marginBottom: 'var(--spacing-xl)', opacity: 0.9 }}>Test your knowledge and earn certifications</p>
                    <div style={{ maxWidth: '600px', margin: '0 auto', position: 'relative' }}>
                        <input type="text" placeholder="Search exams..." onClick={() => navigate('/exams/search')} style={{ width: '100%', padding: '16px 50px 16px 20px', borderRadius: 'var(--radius-full)', border: 'none', fontSize: '1rem', cursor: 'pointer' }} />
                        <Search size={20} style={{ position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                    </div>
                </div>
            </div>

            <div className="container mt-lg">
                <div style={{ display: 'flex', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-2xl)', flexWrap: 'wrap', justifyContent: 'center' }}>
                    {categories.map(cat => (
                        <button key={cat} onClick={() => setSelectedCategory(cat.toLowerCase())} style={{ padding: '10px 24px', borderRadius: 'var(--radius-full)', border: 'none', backgroundColor: selectedCategory === cat.toLowerCase() ? '#EF4444' : '#F3F4F6', color: selectedCategory === cat.toLowerCase() ? 'white' : 'var(--color-text-main)', cursor: 'pointer', fontWeight: 600, transition: 'all 0.2s' }}>
                            {cat}
                        </button>
                    ))}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: 'var(--spacing-lg)', marginBottom: 'var(--spacing-3xl)' }}>
                    {filteredExams.map(exam => {
                        const status = getStatus(exam.startDate, exam.endDate);
                        return (
                            <div key={exam.id} onClick={() => navigate(`/exams/${exam.id}`)} className="card" style={{ overflow: 'hidden', cursor: 'pointer', transition: 'transform 0.2s', position: 'relative' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                                <div style={{ height: '180px', overflow: 'hidden', position: 'relative' }}>
                                    <img src={getImageUrl(exam.image)} alt={exam.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => e.target.src = 'https://placehold.co/600x400'} />
                                    <div style={{ position: 'absolute', top: '10px', right: '10px', padding: '4px 12px', borderRadius: 'var(--radius-full)', backgroundColor: status.bg, color: status.color, fontSize: '0.75rem', fontWeight: 700 }}>
                                        {status.label}
                                    </div>
                                    <div style={{ position: 'absolute', bottom: '10px', left: '10px', padding: '4px 10px', borderRadius: '4px', backgroundColor: '#EF4444', color: 'white', fontSize: '0.8rem', fontWeight: 600 }}>
                                        ₹{exam.price}
                                    </div>
                                </div>
                                <div style={{ padding: 'var(--spacing-lg)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontSize: '0.85rem', color: '#EF4444', fontWeight: 600 }}>{exam.category || 'General'}</span>
                                        {parseArrayField(exam.prizes).length > 0 && (
                                            <div title={parseArrayField(exam.prizes).map(p => p.title).join(', ')} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: '#991B1B', backgroundColor: '#FEE2E2', padding: '2px 8px', borderRadius: '12px' }}>
                                                <Gift size={12} /> Rewards
                                            </div>
                                        )}
                                    </div>
                                    <h3 style={{ fontSize: '1.25rem', marginTop: '4px', marginBottom: 'var(--spacing-sm)' }}>{exam.title}</h3>
                                    <div style={{ display: 'flex', gap: 'var(--spacing-md)', fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: 'var(--spacing-md)', flexWrap: 'wrap' }}>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={14} /> {exam.duration} mins</span>
                                        <span>{parseArrayField(exam.questions).length} Qs</span>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Users size={14} /> {exam.participants || 0}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ padding: '4px 12px', backgroundColor: '#F3F4F6', color: '#4B5563', borderRadius: 'var(--radius-full)', fontSize: '0.85rem', fontWeight: 600 }}>{exam.difficulty || 'Medium'}</span>
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
            </div>
        </div>
    );
};

export default ExamListing;
