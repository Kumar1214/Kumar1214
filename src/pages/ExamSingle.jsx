import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, FileText, Award, Users, ArrowLeft, Gift, Calendar, Trophy, Share2, Bookmark } from 'lucide-react';
import Button from '../components/Button';
import { useContext } from 'react';
import { DataContext } from '../context/DataContext';
import EngagementBar from '../components/engagement/EngagementBar';

const ExamSingle = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { trackEngagement } = useContext(DataContext);

    // Mock Date logic
    const today = new Date();
    const tomorrow = new Date(today); tomorrow.setDate(tomorrow.getDate() + 1);
    const yesterday = new Date(today); yesterday.setDate(yesterday.getDate() - 1);

    const [exam, setExam] = useState(null);
    const [loading, setLoading] = useState(true);
    const [hasTrackedView, setHasTrackedView] = useState(false);

    useEffect(() => {
        const fetchExam = async () => {
            try {
                // Dynamic import to avoid circular dep issues if any, or just standard import
                const module = await import('../services/api');
                const response = await module.contentService.getExamById(id);

                const processData = (rawData) => {
                    if (!rawData) return null;
                    const data = { ...rawData };

                    const parseField = (field) => {
                        if (typeof field === 'string') {
                            try {
                                const parsed = JSON.parse(field);
                                return Array.isArray(parsed) ? parsed : [];
                            } catch (e) {
                                return [];
                            }
                        }
                        return Array.isArray(field) ? field : [];
                    };

                    // Parse all potentially stringified array fields
                    data.topics = parseField(data.topics);
                    data.prizes = parseField(data.prizes);
                    data.winners = parseField(data.winners);
                    data.studyMaterial = parseField(data.studyMaterial);
                    data.requirements = parseField(data.requirements);
                    data.questions = parseField(data.questions);
                    data.totalAttempts = parseField(data.totalAttempts);
                    return data;
                };

                // Handle response structure (standardize to response.data or response.data.data)
                // If response.data.data exists (standard), process it.
                // If response.data exists but not success/data, try processing response.data directly (fallback).
                let processed = null;
                if (response.data && response.data.success && response.data.data) {
                    processed = processData(response.data.data);
                } else {
                    processed = processData(response.data || response);
                }

                setExam(processed);

                // Track view once exam is loaded
                if (!hasTrackedView && processed) {
                    trackEngagement('exam', id, 'view');
                    setHasTrackedView(true);
                }
            } catch (error) {
                console.error("Failed to fetch exam:", error);
                // Fallback to mock if API fails? Or show error. 
                // For now, let's keep the mock as a fallback if fetch fails, 
                // OR better, show an error message.
                // UNLESS user specifically wants the mock data to show up for demo.
                // Let's rely on API. If API fails, we can't show "real" data.
            } finally {
                setLoading(false);
            }
        };
        fetchExam();
    }, [id, trackEngagement, hasTrackedView]);

    const handleShare = async () => {
        try {
            await trackEngagement('exam', id, 'share');
            if (navigator.share) {
                await navigator.share({
                    title: exam.title,
                    text: exam.description,
                    url: window.location.href,
                });
            } else {
                navigator.clipboard.writeText(window.location.href);
                alert('Exam link copied to clipboard!');
            }
        } catch (err) {
            console.error("Failed to share exam:", err);
        }
    };

    const handleBookmark = async () => {
        try {
            await trackEngagement('exam', id, 'bookmark');
        } catch (err) {
            console.error("Failed to bookmark exam:", err);
        }
    };

    if (loading) return <div className="container mt-lg text-center p-8">Loading Exam Details...</div>;
    if (!exam) return <div className="container mt-lg text-center p-8">Exam not found or failed to load.</div>;

    // Helper for dates if API returns strings

    const endDate = new Date(exam.endDate);
    const resultDate = new Date(exam.resultDate || exam.endDate); // Fallback
    const isEnded = new Date() > endDate;
    const isResultDeclared = new Date() > resultDate;

    // Ensure arrays exist
    const prizes = Array.isArray(exam.prizes) ? exam.prizes : [];
    const studyMaterial = Array.isArray(exam.studyMaterial) ? exam.studyMaterial : [];
    const topics = Array.isArray(exam.topics) ? exam.topics : [];
    const requirements = Array.isArray(exam.requirements) ? exam.requirements : [];
    const winners = Array.isArray(exam.winners) ? exam.winners : [];



    return (
        <div className="container mt-lg">
            <button onClick={() => navigate('/exams')} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', border: '1px solid #E5E7EB', backgroundColor: 'white', borderRadius: 'var(--radius-md)', cursor: 'pointer', marginBottom: 'var(--spacing-xl)', fontWeight: 500 }}>
                <ArrowLeft size={18} /> Back to Exams
            </button>

            <div className="single-listing-grid">
                <div>
                    <div style={{ width: '100%', aspectRatio: '1', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-lg)', marginBottom: 'var(--spacing-lg)', position: 'relative' }}>
                        <img src={exam.image} alt={exam.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <div style={{ position: 'absolute', top: '20px', right: '20px', padding: '8px 16px', borderRadius: '8px', backgroundColor: '#EF4444', color: 'white', fontSize: '1.2rem', fontWeight: 700 }}>
                            ₹{exam.price}
                        </div>
                    </div>

                    {!isEnded ? (
                        <Button fullWidth onClick={() => navigate(`/exam/${id}/start`)}>
                            Pay ₹{exam.price} to Register
                        </Button>
                    ) : (
                        <div style={{ padding: '16px', backgroundColor: '#F3F4F6', borderRadius: 'var(--radius-md)', textAlign: 'center', color: '#6B7280', fontWeight: 600 }}>
                            Registration Closed
                        </div>
                    )}

                    {/* Prizes Section */}
                    <div style={{ marginTop: 'var(--spacing-xl)' }}>
                        <h3 style={{ fontSize: '1.25rem', marginBottom: 'var(--spacing-md)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Gift size={20} color="#EF4444" /> Rewards
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {prizes.map((prize, idx) => (
                                <div key={idx} className="prize-card" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', backgroundColor: '#FEE2E2', borderRadius: '8px', border: '1px solid #FECaca', transition: 'transform 0.2s' }}>
                                    <div style={{ padding: '8px', backgroundColor: 'white', borderRadius: '50%', color: '#B91C1C' }}>
                                        {prize.icon === 'gift' ? <Gift size={18} /> : <Award size={18} />}
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: 600, color: '#7F1D1D' }}>{prize.title}</div>
                                        <div style={{ fontSize: '0.8rem', color: '#991B1B' }}>{prize.description}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Study Material Section */}
                    {studyMaterial.length > 0 && (
                        <div style={{ marginTop: 'var(--spacing-xl)' }}>
                            <h3 style={{ fontSize: '1.25rem', marginBottom: 'var(--spacing-md)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <FileText size={20} color="var(--color-primary)" /> Study Material
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {studyMaterial.map((mat, idx) => (
                                    <div key={idx} style={{ padding: '12px', border: '1px solid #E5E7EB', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '12px', transition: 'background-color 0.2s', cursor: 'pointer' }} onClick={() => window.open(mat.url, '_blank')}>
                                        <div style={{ padding: '8px', backgroundColor: '#EFF6FF', borderRadius: '50%', color: 'var(--color-primary)' }}>
                                            <FileText size={18} />
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: 600, color: 'var(--color-text-main)' }}>{mat.title}</div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>{mat.type}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div>
                    <span style={{ display: 'inline-block', padding: '4px 12px', backgroundColor: '#FEE2E2', color: '#991B1B', borderRadius: 'var(--radius-full)', fontSize: '0.85rem', fontWeight: 600, marginBottom: 'var(--spacing-md)' }}>{exam.category}</span>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: 'var(--spacing-sm)' }}>{exam.title}</h1>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: 'var(--spacing-lg)' }}>
                        <p style={{ fontSize: '1.1rem', color: '#EF4444', fontWeight: 600 }}>{exam.difficulty} Level</p>
                        <span style={{ color: '#D1D5DB' }}>|</span>
                        <p style={{ fontSize: '1rem', color: '#6B7280', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Calendar size={16} /> Ends: {new Date(exam.endDate).toLocaleDateString()}
                        </p>
                    </div>

                    <EngagementBar
                        views={exam.views || 0}
                        shares={exam.shares || 0}
                        bookmarks={exam.bookmarks || 0}
                        onShare={handleShare}
                        onBookmark={handleBookmark}
                        className="mb-8"
                    />

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--spacing-lg)', marginBottom: 'var(--spacing-xl)', paddingBottom: 'var(--spacing-lg)', borderBottom: '1px solid #E5E7EB' }}>
                        <div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '4px' }}>Duration</div>
                            <div style={{ fontSize: '1.1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={18} /> {exam.duration}</div>
                        </div>
                        <div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '4px' }}>Questions</div>
                            <div style={{ fontSize: '1.1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}><FileText size={18} /> {exam.questions?.length || 0}</div>
                        </div>
                        <div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '4px' }}>Passing Score</div>
                            <div style={{ fontSize: '1.1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}><Award size={18} /> {exam.passingScore}%</div>
                        </div>
                        <div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '4px' }}>Result Date</div>
                            <div style={{ fontSize: '1.1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}><Trophy size={18} /> {new Date(exam.resultDate).toLocaleDateString()}</div>
                        </div>
                    </div>

                    <div style={{ marginBottom: 'var(--spacing-xl)' }}>
                        <h3 style={{ fontSize: '1.25rem', marginBottom: 'var(--spacing-md)' }}>About This Exam</h3>
                        <p style={{ lineHeight: 1.7, color: 'var(--color-text-muted)' }}>{exam.description}</p>
                    </div>

                    <div style={{ marginBottom: 'var(--spacing-xl)' }}>
                        <h3 style={{ fontSize: '1.25rem', marginBottom: 'var(--spacing-md)' }}>Topics Covered</h3>
                        <ul style={{ lineHeight: 2, color: 'var(--color-text-muted)', paddingLeft: '20px' }}>
                            {topics.map((topic, idx) => (<li key={idx}>{topic}</li>))}
                        </ul>
                    </div>

                    <div>
                        <h3 style={{ fontSize: '1.25rem', marginBottom: 'var(--spacing-md)' }}>Requirements</h3>
                        <ul style={{ lineHeight: 2, color: 'var(--color-text-muted)', paddingLeft: '20px' }}>
                            {requirements.map((req, idx) => (<li key={idx}>{req}</li>))}
                        </ul>
                    </div>

                    {/* Winners List (Conditional) */}
                    <div style={{ marginTop: 'var(--spacing-2xl)', padding: '24px', backgroundColor: '#FEF2F2', borderRadius: '16px', border: '1px solid #FECaca' }}>
                        <h3 style={{ fontSize: '1.5rem', marginBottom: 'var(--spacing-lg)', color: '#991B1B', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Trophy size={28} color="#DC2626" /> Top Performers
                        </h3>

                        {isResultDeclared ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {winners.map((winner) => (
                                    <div key={winner.rank} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                            <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: winner.rank === 1 ? '#FCD34D' : winner.rank === 2 ? '#E5E7EB' : winner.rank === 3 ? '#FDBA74' : '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#374151' }}>
                                                #{winner.rank}
                                            </div>
                                            <img src={winner.avatar} alt={winner.name} style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
                                            <div style={{ fontWeight: 600, color: '#1F2937' }}>{winner.name}</div>
                                        </div>
                                        <div style={{ display: 'flex', gap: '20px', color: '#4B5563', fontSize: '0.9rem' }}>
                                            <span>Score: <b>{winner.score}</b></span>
                                            <span>Time: {winner.time}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div style={{ textAlign: 'center', color: '#991B1B', padding: '20px' }}>
                                <p style={{ fontSize: '1.1rem', fontWeight: 500 }}>Results will be declared on {resultDate.toLocaleDateString()}</p>
                                <p style={{ fontSize: '0.9rem', marginTop: '8px' }}>Good luck to all participants!</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <style>{`
                .prize-card:hover {
                    transform: translateX(5px);
                    background-color: #FECaca !important;
                }
            `}</style>
        </div>
    );
};

export default ExamSingle;
