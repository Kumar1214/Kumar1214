import React, { useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, HelpCircle, Trophy, Users, ArrowLeft, Gift, Award, Calendar, FileText } from 'lucide-react';
import Button from '../components/Button';
import { DataContext } from '../context/DataContext';
import { useCurrency } from '../context/CurrencyContext';
import EngagementBar from '../components/engagement/EngagementBar';

const QuizSingle = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { trackEngagement } = useContext(DataContext);
    const { formatPrice } = useCurrency();

    const [quiz, setQuiz] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const [hasTrackedView, setHasTrackedView] = React.useState(false);

    React.useEffect(() => {
        const fetchQuiz = async () => {
            // Dynamic import to avoid circular dependency if any
            const module = await import('../services/api');
            try {
                const response = await module.contentService.getQuizById(id);

                const processData = (rawData) => {
                    if (!rawData) return null;
                    const data = { ...rawData };

                    const parseField = (field) => {
                        if (typeof field === 'string') {
                            try {
                                const parsed = JSON.parse(field);
                                return Array.isArray(parsed) ? parsed : [];
                            } catch (e) {
                                console.error('Failed to parse field:', field, e);
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
                    data.questions = parseField(data.questions);
                    data.totalAttempts = parseField(data.totalAttempts);
                    data.requirements = parseField(data.requirements);

                    return data;
                };

                if (response.data?.success) {
                    const processed = processData(response.data.data);
                    setQuiz(processed);

                    // Track view once quiz is loaded
                    if (!hasTrackedView && processed) {
                        trackEngagement('quiz', id, 'view');
                        setHasTrackedView(true);
                    }
                } else {
                    // Handle potential non-standard response
                    setQuiz(processData(response.data) || null);
                }
            } catch (error) {
                console.error("Error fetching quiz:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchQuiz();
    }, [id, trackEngagement, hasTrackedView]);

    const handleShare = async () => {
        try {
            await trackEngagement('quiz', id, 'share');
            if (navigator.share) {
                await navigator.share({
                    title: quiz.title,
                    text: quiz.description,
                    url: window.location.href,
                });
            } else {
                navigator.clipboard.writeText(window.location.href);
                alert('Quiz link copied to clipboard!');
            }
        } catch (err) {
            console.error("Failed to share quiz:", err);
        }
    };

    const handleBookmark = async () => {
        try {
            await trackEngagement('quiz', id, 'bookmark');
        } catch (err) {
            console.error("Failed to bookmark quiz:", err);
        }
    };

    if (loading) return <div className="container mt-lg text-center p-8">Loading Quiz...</div>;
    if (!quiz) return <div className="container mt-lg text-center p-8">Quiz not found.</div>;

    // Helper for safe array access
    if (!quiz.topics) quiz.topics = [];
    if (!quiz.prizes) quiz.prizes = [];
    if (!quiz.winners) quiz.winners = [];



    const isEnded = new Date() > new Date(quiz.endDate);
    const isResultDeclared = new Date() > new Date(quiz.resultDate);

    return (
        <div className="container mt-lg">
            <button onClick={() => navigate('/quizzes')} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', border: '1px solid #E5E7EB', backgroundColor: 'white', borderRadius: 'var(--radius-md)', cursor: 'pointer', marginBottom: 'var(--spacing-xl)', fontWeight: 500 }}>
                <ArrowLeft size={18} /> Back to Quizzes
            </button>

            <div className="single-listing-grid">
                <div>
                    <div style={{ width: '100%', aspectRatio: '1', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-lg)', marginBottom: 'var(--spacing-lg)', position: 'relative' }}>
                        <img src={quiz.image} alt={quiz.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        {quiz.price === 0 ? (
                            <div style={{ position: 'absolute', top: '20px', right: '20px', padding: '8px 16px', borderRadius: '8px', backgroundColor: 'rgba(0,0,0,0.8)', color: 'white', fontSize: '1.2rem', fontWeight: 700 }}>
                                Free
                            </div>
                        ) : (
                            <div style={{ position: 'absolute', top: '20px', right: '20px', padding: '8px 16px', borderRadius: '8px', backgroundColor: '#F59E0B', color: 'white', fontSize: '1.2rem', fontWeight: 700 }}>
                                {formatPrice(quiz.price)}
                            </div>
                        )}
                    </div>

                    {!isEnded ? (
                        <Button fullWidth onClick={() => navigate(`/quiz/${id}/start`)}>
                            {quiz.price === 0 ? 'Start Quiz Now' : `Pay ${formatPrice(quiz.price)} to Enter`}
                        </Button>
                    ) : (
                        <div style={{ padding: '16px', backgroundColor: '#F3F4F6', borderRadius: 'var(--radius-md)', textAlign: 'center', color: '#6B7280', fontWeight: 600 }}>
                            Contest Ended
                        </div>
                    )}

                    {/* Prizes Section */}
                    <div style={{ marginTop: 'var(--spacing-xl)' }}>
                        <h3 style={{ fontSize: '1.25rem', marginBottom: 'var(--spacing-md)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Gift size={20} color="#F59E0B" /> Prizes
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {quiz.prizes.map((prize, idx) => (
                                <div key={prize.id || `prize-${idx}`} className="prize-card" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', backgroundColor: '#FEF3C7', borderRadius: '8px', border: '1px solid #FCD34D', transition: 'transform 0.2s' }}>
                                    <div style={{ padding: '8px', backgroundColor: 'white', borderRadius: '50%', color: '#D97706' }}>
                                        {prize.icon === 'gift' ? <Gift size={18} /> : <Award size={18} />}
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: 600, color: '#92400E' }}>{prize.title}</div>
                                        <div style={{ fontSize: '0.8rem', color: '#B45309' }}>{prize.description}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Study Material Section */}
                    {quiz.studyMaterial && quiz.studyMaterial.length > 0 && (
                        <div style={{ marginTop: 'var(--spacing-xl)' }}>
                            <h3 style={{ fontSize: '1.25rem', marginBottom: 'var(--spacing-md)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <FileText size={20} color="var(--color-primary)" /> Study Material
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {quiz.studyMaterial.map((mat, idx) => (
                                    <button
                                        key={mat.id || `material-${idx}`}
                                        type="button"
                                        style={{ padding: '12px', border: '1px solid #E5E7EB', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '12px', transition: 'background-color 0.2s', cursor: 'pointer', backgroundColor: 'white', width: '100%', textAlign: 'left' }}
                                        onClick={() => window.open(mat.url, '_blank')}
                                    >
                                        <div style={{ padding: '8px', backgroundColor: '#EFF6FF', borderRadius: '50%', color: 'var(--color-primary)' }}>
                                            <FileText size={18} />
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: 600, color: 'var(--color-text-main)' }}>{mat.title}</div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>{mat.type}</div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div>
                    <span style={{ display: 'inline-block', padding: '4px 12px', backgroundColor: '#FEF3C7', color: '#92400E', borderRadius: 'var(--radius-full)', fontSize: '0.85rem', fontWeight: 600, marginBottom: 'var(--spacing-md)' }}>{quiz.category}</span>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: 'var(--spacing-sm)' }}>{quiz.title}</h1>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: 'var(--spacing-lg)' }}>
                        <p style={{ fontSize: '1.1rem', color: '#F59E0B', fontWeight: 600 }}>{quiz.difficulty} Level</p>
                        <span style={{ color: '#D1D5DB' }}>|</span>
                        <p style={{ fontSize: '1rem', color: '#6B7280', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Calendar size={16} /> Ends: {quiz.endDate ? new Date(quiz.endDate).toLocaleDateString() : 'TBA'}
                        </p>
                    </div>

                    <EngagementBar
                        views={quiz.views || 0}
                        shares={quiz.shares || 0}
                        bookmarks={quiz.bookmarks || 0}
                        onShare={handleShare}
                        onBookmark={handleBookmark}
                        className="mb-8"
                    />

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--spacing-lg)', marginBottom: 'var(--spacing-xl)', paddingBottom: 'var(--spacing-lg)', borderBottom: '1px solid #E5E7EB' }}>
                        <div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '4px' }}>Duration</div>
                            <div style={{ fontSize: '1.1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={18} /> {quiz.duration}</div>
                        </div>
                        <div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '4px' }}>Questions</div>
                            <div style={{ fontSize: '1.1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}><HelpCircle size={18} /> {quiz.questions?.length || quiz.questions_count || 0}</div>
                        </div>
                        <div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '4px' }}>Total Attempts</div>
                            <div style={{ fontSize: '1.1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}><Users size={18} /> {quiz.totalAttempts?.length || quiz.attempts || 0}</div>
                        </div>
                        <div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '4px' }}>Result Date</div>
                            <div style={{ fontSize: '1.1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}><Trophy size={18} /> {quiz.resultDate ? new Date(quiz.resultDate).toLocaleDateString() : 'TBA'}</div>
                        </div>
                    </div>

                    <div style={{ marginBottom: 'var(--spacing-xl)' }}>
                        <h3 style={{ fontSize: '1.25rem', marginBottom: 'var(--spacing-md)' }}>About This Quiz</h3>
                        <p style={{ lineHeight: 1.7, color: 'var(--color-text-muted)' }}>{quiz.description}</p>
                    </div>

                    <div style={{ marginBottom: 'var(--spacing-xl)' }}>
                        <h3 style={{ fontSize: '1.25rem', marginBottom: 'var(--spacing-md)' }}>Topics Covered</h3>
                        <ul style={{ lineHeight: 2, color: 'var(--color-text-muted)', paddingLeft: '20px' }}>
                            {quiz.topics.map((topic, idx) => (<li key={`topic-${idx}-${topic.substring(0, 10)}`}>{topic}</li>))}
                        </ul>
                    </div>

                    {/* Winners List (Conditional) */}
                    {/* For demo purposes, we are showing it if resultDate is passed OR if we force it for the demo */}
                    {/* In real app: isResultDeclared && quiz.winners.length > 0 */}
                    <div style={{ marginTop: 'var(--spacing-2xl)', padding: '24px', backgroundColor: '#F0FDF4', borderRadius: '16px', border: '1px solid #BBF7D0' }}>
                        <h3 style={{ fontSize: '1.5rem', marginBottom: 'var(--spacing-lg)', color: '#166534', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Trophy size={28} color="#16A34A" /> Hall of Fame
                        </h3>

                        {isResultDeclared ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {quiz.winners.map((winner) => (
                                    <div key={winner.rank} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                            <div style={{
                                                width: '32px',
                                                height: '32px',
                                                borderRadius: '50%',
                                                backgroundColor: winner.rank === 1 ? '#FCD34D' : (winner.rank === 2 ? '#E5E7EB' : (winner.rank === 3 ? '#FDBA74' : '#F3F4F6')),
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontWeight: 700,
                                                color: '#374151'
                                            }}>
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
                            <div style={{ textAlign: 'center', color: '#166534', padding: '20px' }}>
                                <p style={{ fontSize: '1.1rem', fontWeight: 500 }}>Winners will be announced on {new Date(quiz.resultDate).toLocaleDateString()}</p>
                                <p style={{ fontSize: '0.9rem', marginTop: '8px' }}>Participate now to secure your spot!</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <style>{`
                .prize-card:hover {
                    transform: translateX(5px);
                    background-color: #FDE68A !important;
                }
            `}</style>
        </div>
    );
};

export default QuizSingle;
