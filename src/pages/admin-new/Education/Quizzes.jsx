import { Plus, Edit, Trash2, CheckSquare, X, BarChart2, TrendingUp, Users, CheckCircle, Award, Share2 } from 'lucide-react';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import { useData } from '../../../context/useData';
import { DataContext } from '../../../context/DataContext';
import { useContext, useEffect, useState } from 'react';
import AnalyticsGrid from '../../../components/admin/analytics/AnalyticsGrid';
import TrendingChart from '../../../components/admin/analytics/TrendingChart';
import TrendingModal from '../../../components/admin/analytics/TrendingModal';
import FormModal from '../../../components/FormModal';
import RichTextEditor from '../../../components/RichTextEditor';
import FileUploader from '../../../components/FileUploader';

import { mediaService } from '../../../services/api';
import { parseArrayField } from '../../../utils/jsonUtils';

const QuizManagement = () => {
    const { filteredQuizzes, addQuiz, deleteQuiz, updateQuiz, quizCategories, addQuizCategory, deleteQuizCategory, questions, addQuestion, updateQuestion } = useData();
    const { getModuleAnalytics, getTrendingContent } = useContext(DataContext);
    const [analytics, setAnalytics] = useState(null);
    const [trending, setTrending] = useState([]);
    const [showTrendingModal, setShowTrendingModal] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showQuestionModal, setShowQuestionModal] = useState(false);
    const [showSelectionModal, setShowSelectionModal] = useState(false);
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [showResultBoard, setShowResultBoard] = useState(false);
    const [selectedQuizForResults, setSelectedQuizForResults] = useState(null);
    const [uploading, setUploading] = useState(false);


    const [editingQuiz, setEditingQuiz] = useState(null);
    const [editingQuestion, setEditingQuestion] = useState(null);

    const [newCategory, setNewCategory] = useState({
        name: '',
        icon: '📝'
    });

    const [newQuiz, setNewQuiz] = useState({
        title: '',
        category: 'Yoga',
        duration: 10,
        questions: [],
        price: 0,
        difficulty: 'Easy',
        startDate: '',
        endDate: '',
        resultDate: '',
        image: '',
        prizes: [],
        winners: [],
        studyMaterial: []
    });

    const [questionFormData, setQuestionFormData] = useState({
        text: '', type: 'multiple_choice', options: ['', '', '', ''], correctAnswer: 0,
        tags: '', difficulty: 'Medium'
    });

    // Quiz Form Handlers
    const resetQuizForm = () => {
        setNewQuiz({
            title: '',
            category: 'Yoga',
            duration: 10,
            questions: [],
            price: 0,
            difficulty: 'Easy',
            startDate: '',
            endDate: '',
            resultDate: '',
            prizes: [],
            winners: [],
            studyMaterial: []
        });
        setEditingQuiz(null);
    };

    const handleQuizSubmit = async (data) => {
        // data from FormModal might be partial or empty if custom fields were used
        // We prioritize the newQuiz state which is updated by all specialized handlers
        const quizData = { ...newQuiz, ...(data || {}) };

        // Map Duration to TimeLimit (Backend expectation)
        if (quizData.duration) {
            quizData.timeLimit = quizData.duration;
        }

        // Map Question IDs to Full Objects for Backend
        // The backend needs full objects to calculate totalPoints
        const selectedQuestionIds = parseArrayField(quizData.questions);
        const fullQuestions = questions.filter(q => selectedQuestionIds.includes(q.id));

        const payload = {
            ...quizData,
            questions: fullQuestions
        };

        const promise = editingQuiz
            ? updateQuiz(editingQuiz.id, payload)
            : addQuiz(payload);

        toast.promise(promise, {
            loading: editingQuiz ? 'Updating quiz...' : 'Creating quiz...',
            success: (res) => {
                setShowModal(false);
                resetQuizForm();
                return editingQuiz ? 'Quiz updated successfully' : 'Quiz created successfully';
            },
            error: (err) => {
                console.error('Failed to save quiz:', err);
                return err.response?.data?.message || 'Failed to save quiz. Please try again.';
            }
        });
    };

    const handleEditQuiz = (quiz) => {
        // Safe parsing helper properly
        const safeParse = (field) => parseArrayField(field, []);

        // If questions are objects (populated), extract IDs
        let rawQuestions = safeParse(quiz.questions);
        if (rawQuestions.length > 0 && typeof rawQuestions[0] === 'object') {
            rawQuestions = rawQuestions.map(q => q.id);
        }

        // Format Date for datetime-local
        const formatDate = (dateStr) => {
            if (!dateStr) return '';
            try {
                return new Date(dateStr).toISOString().slice(0, 16);
            } catch (e) { return ''; }
        };

        const parsedQuiz = {
            ...quiz,
            prizes: safeParse(quiz.prizes),
            winners: safeParse(quiz.winners),
            questions: rawQuestions,
            studyMaterial: safeParse(quiz.studyMaterial),
            startDate: formatDate(quiz.startDate),
            endDate: formatDate(quiz.endDate),
            resultDate: formatDate(quiz.resultDate)
        };
        setEditingQuiz(parsedQuiz);
        setNewQuiz(parsedQuiz);
        setShowModal(true);
    };

    // Question Form Handlers
    const resetQuestionForm = () => {
        setQuestionFormData({
            text: '', type: 'multiple-choice', options: ['', '', '', ''], correctAnswer: 0,
            tags: '', difficulty: 'Medium'
        });
        setEditingQuestion(null);
    };

    const handleQuestionSubmit = async (data) => {
        // data comes from FormModal onSubmit
        const formData = data || questionFormData;
        const dataToSubmit = {
            ...formData,
            tags: typeof formData.tags === 'string' ? formData.tags.split(',').map(t => t.trim()) : formData.tags,
            category: newQuiz.category || 'General'
        };

        try {
            if (editingQuestion) {
                await updateQuestion(editingQuestion.id, dataToSubmit);
            } else {
                const res = await addQuestion(dataToSubmit);
                console.log('Question created:', res);

                if (res && res.success && res.data) {
                    // Add the new question ID to the current quiz
                    setNewQuiz(prev => {
                        const currentQuestions = parseArrayField(prev.questions);
                        const updated = {
                            ...prev,
                            questions: [...currentQuestions, res.data.id]
                        };
                        console.log('Updated quiz with question:', updated.questions);
                        return updated;
                    });
                } else {
                    throw new Error('Failed to create question - no data returned');
                }
            }

            setShowQuestionModal(false);
            resetQuestionForm();
        } catch (error) {
            console.error('Question submit error:', error);
            alert('Failed to save question: ' + (error.message || 'Unknown error'));
        }
    };

    const handleOptionChange = (index, value) => {
        const newOptions = [...questionFormData.options];
        newOptions[index] = value;
        setQuestionFormData({ ...questionFormData, options: newOptions });
    };

    const toggleQuestionSelection = (questionId) => {
        const currentQuestions = parseArrayField(newQuiz.questions);
        if (currentQuestions.includes(questionId)) {
            setNewQuiz({ ...newQuiz, questions: currentQuestions.filter(id => id !== questionId) });
        } else {
            setNewQuiz({ ...newQuiz, questions: [...currentQuestions, questionId] });
        }
    };

    const handleCategorySubmit = (e) => {
        e.preventDefault();
        addQuizCategory(newCategory);
        setShowCategoryModal(false);
        setNewCategory({ name: '', icon: '📝' });
    };

    const handleViewResults = (quiz) => {
        setSelectedQuizForResults(quiz);
        setShowResultBoard(true);
    };

    // Mock result data - in real app, this would come from backend
    const getQuizResults = () => {
        return [
            { id: 1, userName: 'John Doe', score: '18/20', percentage: 90, timeTaken: '8m 30s', attemptDate: '2024-12-03' },
            { id: 2, userName: 'Jane Smith', score: '17/20', percentage: 85, timeTaken: '9m 15s', attemptDate: '2024-12-03' },
            { id: 3, userName: 'Bob Johnson', score: '16/20', percentage: 80, timeTaken: '9m 45s', attemptDate: '2024-12-02' },
            { id: 4, userName: 'Alice Williams', score: '15/20', percentage: 75, timeTaken: '10m 00s', attemptDate: '2024-12-02' },
            { id: 5, userName: 'Charlie Brown', score: '14/20', percentage: 70, timeTaken: '10m 30s', attemptDate: '2024-12-01' }
        ];
    };


    useEffect(() => {
        const fetchAnalytics = async () => {
            const data = await getModuleAnalytics('quiz');
            if (data) setAnalytics(data);

            const trendingData = await getTrendingContent('quiz', 10);
            if (trendingData) setTrending(trendingData);
        };
        fetchAnalytics();
    }, [getModuleAnalytics, getTrendingContent]);

    return (
        <div>
            <AnalyticsGrid
                metrics={[
                    { title: 'Total Quizzes', value: analytics?.totalItems || filteredQuizzes.length, icon: BarChart2, color: 'indigo' },
                    { title: 'Total Attempts', value: analytics?.overview?.totalAttempts?.toLocaleString() || '4,250', icon: Users, color: 'blue', trend: 'up', trendValue: 18 },
                    { title: 'Completion Rate', value: analytics?.overview?.completionRate ? `${analytics.overview.completionRate}%` : '88%', icon: CheckCircle, color: 'green' },
                    { title: 'Total Shares', value: analytics?.overview?.totalShares?.toLocaleString() || '540', icon: Share2, color: 'purple' }
                ]}
            />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '24px', marginBottom: '32px' }}>
                <div className="card" style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, margin: 0 }}>Quiz Participation Trends</h3>
                        <button
                            onClick={() => setShowTrendingModal(true)}
                            style={{ background: 'none', border: 'none', color: '#4F46E5', fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.9rem' }}
                        >
                            <TrendingUp size={16} /> View Top 50
                        </button>
                    </div>
                    <TrendingChart data={trending.length > 0 ? trending : filteredQuizzes.slice(0, 8)} dataKey="totalAttempts" />
                </div>

                <div style={{ backgroundColor: '#0c2d50', borderRadius: '12px', padding: '24px', color: 'white', display: 'flex', flexDirection: 'column', height: '100%' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 600, margin: '0 0 12px 0' }}>Engagement Insight</h3>
                    <p style={{ fontSize: '0.9rem', color: '#E5E7EB', lineHeight: 1.5, flex: 1 }}>
                        Quizzes on "Vedic History" are reaching 2x more users through social shares. Recommended: Add more interactive quizzes for this topic.
                    </p>
                    <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', paddingBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                            <span style={{ color: '#9CA3AF' }}>Hot Topic</span>
                            <span style={{ fontWeight: 600 }}>Bhagavad Gita</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                            <span style={{ color: '#9CA3AF' }}>Avg. Time</span>
                            <span style={{ fontWeight: 600 }}>4m 20s</span>
                        </div>
                    </div>
                </div>
            </div>
            {/* Quiz Categories Section */}
            <div style={{ marginBottom: '40px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--spacing-lg)' }}>
                    <h3>Quiz Categories</h3>
                    <button onClick={() => setShowCategoryModal(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', backgroundColor: '#F3F4F6', color: '#374151', border: '1px solid #D1D5DB', borderRadius: 'var(--radius-md)', cursor: 'pointer' }}>
                        <Plus size={16} /> Add Category
                    </button>
                </div>
                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                    {(quizCategories || []).map(cat => (
                        <div key={cat.id} className="card" style={{ padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '12px', minWidth: '150px' }}>
                            <span style={{ fontSize: '1.5rem' }}>{cat.icon}</span>
                            <span style={{ fontWeight: 500 }}>{cat.name}</span>
                            <button onClick={() => deleteQuizCategory(cat.id)} style={{ marginLeft: 'auto', border: 'none', background: 'none', cursor: 'pointer', color: '#9CA3AF' }}><Trash2 size={14} /></button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Quiz List Section */}

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--spacing-lg)' }}>
                <h3>Quiz Management</h3>
                <button onClick={() => { resetQuizForm(); setShowModal(true); }} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', backgroundColor: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer' }}>
                    <Plus size={18} /> Create Quiz
                </button>
            </div>
            <div style={{ display: 'grid', gap: 'var(--spacing-md)' }}>
                {filteredQuizzes.map(quiz => (
                    <div key={quiz.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--spacing-lg)' }}>
                        <div>
                            <h4 style={{ marginBottom: '4px', fontSize: '1.1rem' }}>{quiz.title}</h4>
                            <div style={{ display: 'flex', gap: '12px', color: '#6B7280', fontSize: '0.9rem' }}>
                                <span>{quiz.category}</span>
                                <span>•</span>
                                <span>{quiz.duration} mins</span>
                                <span>•</span>
                                <span>{quiz.questions.length} Questions</span>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button onClick={() => handleViewResults(quiz)} style={{ padding: '8px', border: '1px solid #10B981', borderRadius: '4px', cursor: 'pointer', color: '#10B981', background: '#F0FDF4' }}>Results</button>
                            <button onClick={() => handleEditQuiz(quiz)} style={{ padding: '8px', border: '1px solid #E5E7EB', borderRadius: '4px', cursor: 'pointer', color: '#4B5563' }}><Edit size={18} /></button>
                            <button onClick={() => {
                                Swal.fire({
                                    title: 'Are you sure?',
                                    text: "You won't be able to revert this!",
                                    icon: 'warning',
                                    showCancelButton: true,
                                    confirmButtonColor: '#d33',
                                    cancelButtonColor: '#3085d6',
                                    confirmButtonText: 'Yes, delete it!'
                                }).then((result) => {
                                    if (result.isConfirmed) {
                                        deleteQuiz(quiz.id).then(() => {
                                            toast.success("Quiz deleted successfully");
                                        }).catch(() => toast.error("Failed to delete quiz"));
                                    }
                                });
                            }} style={{ padding: '8px', border: '1px solid #FCA5A5', color: '#B91C1C', borderRadius: '4px', cursor: 'pointer', background: '#FEF2F2' }}><Trash2 size={18} /></button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Add/Edit Quiz Modal */}
            <FormModal isOpen={showModal} onClose={() => setShowModal(false)} title={editingQuiz ? 'Edit Quiz' : 'Create New Quiz'} onSubmit={handleQuizSubmit} isLoading={uploading}>
                <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 500 }}>Quiz Title *</label>
                    <input type="text" required value={newQuiz.title} onChange={e => setNewQuiz({ ...newQuiz, title: e.target.value })} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #D1D5DB' }} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 500 }}>Category</label>
                        <select value={newQuiz.category} onChange={e => setNewQuiz({ ...newQuiz, category: e.target.value })} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #D1D5DB' }}>
                            <option>Yoga</option>
                            <option>Ayurveda</option>
                            <option>General Knowledge</option>
                        </select>
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 500 }}>Duration (mins) *</label>
                        <input type="number" required value={newQuiz.duration} onChange={e => setNewQuiz({ ...newQuiz, duration: parseInt(e.target.value) })} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #D1D5DB' }} />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 500 }}>Difficulty</label>
                        <select value={newQuiz.difficulty} onChange={e => setNewQuiz({ ...newQuiz, difficulty: e.target.value })} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #D1D5DB' }}>
                            <option>Easy</option>
                            <option>Medium</option>
                            <option>Hard</option>
                        </select>
                    </div>
                </div>
                <div>
                    <FileUploader
                        label="Quiz Thumbnail"
                        accept="image/*"
                        value={newQuiz.image}
                        onChange={(url) => setNewQuiz({ ...newQuiz, image: url })}
                    />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                    <input
                        type="checkbox"
                        id="featuredQuiz"
                        checked={newQuiz.featured || false}
                        onChange={e => setNewQuiz({ ...newQuiz, featured: e.target.checked })}
                        style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                    />
                    <label htmlFor="featuredQuiz" style={{ cursor: 'pointer', fontSize: '0.9rem', fontWeight: 500 }}>Featured Quiz</label>
                </div>

                {/* Pricing & Scheduling */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 500 }}>Price (₹) *</label>
                        <input
                            type="number"
                            min="0"
                            required
                            value={newQuiz.price}
                            onChange={e => setNewQuiz({ ...newQuiz, price: parseInt(e.target.value) || 0 })}
                            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #D1D5DB' }}
                            placeholder="0 for Free"
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 500 }}>Start Date (Optional)</label>
                        <input
                            type="datetime-local"
                            value={newQuiz.startDate}
                            onChange={e => setNewQuiz({ ...newQuiz, startDate: e.target.value })}
                            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #D1D5DB' }}
                        />
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 500 }}>End Date (Optional)</label>
                        <input
                            type="datetime-local"
                            value={newQuiz.endDate}
                            onChange={e => setNewQuiz({ ...newQuiz, endDate: e.target.value })}
                            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #D1D5DB' }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 500 }}>Result Date (Optional)</label>
                        <input
                            type="datetime-local"
                            value={newQuiz.resultDate}
                            onChange={e => setNewQuiz({ ...newQuiz, resultDate: e.target.value })}
                            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #D1D5DB' }}
                        />
                    </div>
                </div>

                {/* Prizes Section */}
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <label style={{ fontSize: '0.9rem', fontWeight: 500 }}>Prizes ({parseArrayField(newQuiz.prizes).length})</label>
                        <button
                            type="button"
                            onClick={() => {
                                const newPrize = { title: '', icon: 'gift', description: '' };
                                const currentPrizes = parseArrayField(newQuiz.prizes);
                                setNewQuiz({ ...newQuiz, prizes: [...currentPrizes, newPrize] });
                            }}
                            style={{ fontSize: '0.8rem', padding: '4px 8px', background: '#F59E0B', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                        >
                            + Add Prize
                        </button>
                    </div>
                    <div style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid #D1D5DB', borderRadius: '4px', padding: '8px', backgroundColor: '#F9FAFB' }}>
                        {newQuiz.prizes && parseArrayField(newQuiz.prizes).length > 0 ? (
                            parseArrayField(newQuiz.prizes).map((prize, idx) => (
                                <div key={idx} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 3fr auto', gap: '8px', marginBottom: '8px', padding: '8px', background: 'white', borderRadius: '4px' }}>
                                    <input
                                        type="text"
                                        placeholder="Prize Title"
                                        value={prize.title}
                                        onChange={e => {
                                            const updated = [...parseArrayField(newQuiz.prizes)];
                                            updated[idx].title = e.target.value;
                                            setNewQuiz({ ...newQuiz, prizes: updated });
                                        }}
                                        style={{ padding: '6px', border: '1px solid #D1D5DB', borderRadius: '4px', fontSize: '0.85rem' }}
                                    />
                                    <select
                                        value={prize.icon}
                                        onChange={e => {
                                            const updated = [...parseArrayField(newQuiz.prizes)];
                                            updated[idx].icon = e.target.value;
                                            setNewQuiz({ ...newQuiz, prizes: updated });
                                        }}
                                        style={{ padding: '6px', border: '1px solid #D1D5DB', borderRadius: '4px', fontSize: '0.85rem' }}
                                    >
                                        <option value="gift">🎁 Gift</option>
                                        <option value="award">🏆 Award</option>
                                        <option value="medal">🥇 Medal</option>
                                        <option value="certificate">📜 Certificate</option>
                                    </select>
                                    <input
                                        type="text"
                                        placeholder="Description"
                                        value={prize.description}
                                        onChange={e => {
                                            const updated = [...parseArrayField(newQuiz.prizes)];
                                            updated[idx].description = e.target.value;
                                            setNewQuiz({ ...newQuiz, prizes: updated });
                                        }}
                                        style={{ padding: '6px', border: '1px solid #D1D5DB', borderRadius: '4px', fontSize: '0.85rem' }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setNewQuiz({ ...newQuiz, prizes: parseArrayField(newQuiz.prizes).filter((_, i) => i !== idx) });
                                        }}
                                        style={{ color: '#EF4444', background: 'none', border: 'none', cursor: 'pointer' }}
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            ))
                        ) : (
                            <div style={{ padding: '16px', color: '#9CA3AF', textAlign: 'center', fontStyle: 'italic' }}>No prizes added yet.</div>
                        )}
                    </div>
                </div>

                {/* Winners Section */}
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <label style={{ fontSize: '0.9rem', fontWeight: 500 }}>Winners ({parseArrayField(newQuiz.winners).length})</label>
                        <button
                            type="button"
                            onClick={() => {
                                const currentWinners = parseArrayField(newQuiz.winners);
                                const newWinner = { rank: (currentWinners.length || 0) + 1, name: '', score: '', time: '', avatar: '' };
                                setNewQuiz({ ...newQuiz, winners: [...currentWinners, newWinner] });
                            }}
                            style={{ fontSize: '0.8rem', padding: '4px 8px', background: '#10B981', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                        >
                            + Add Winner
                        </button>
                    </div>
                    <div style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid #D1D5DB', borderRadius: '4px', padding: '8px', backgroundColor: '#F9FAFB' }}>
                        {newQuiz.winners && parseArrayField(newQuiz.winners).length > 0 ? (
                            parseArrayField(newQuiz.winners).map((winner, idx) => (
                                <div key={idx} style={{ display: 'grid', gridTemplateColumns: '60px 2fr 1fr 1fr 2fr auto', gap: '8px', marginBottom: '8px', padding: '8px', background: 'white', borderRadius: '4px' }}>
                                    <input
                                        type="number"
                                        placeholder="Rank"
                                        value={winner.rank}
                                        onChange={e => {
                                            const updated = [...parseArrayField(newQuiz.winners)];
                                            updated[idx].rank = parseInt(e.target.value) || 1;
                                            setNewQuiz({ ...newQuiz, winners: updated });
                                        }}
                                        style={{ padding: '6px', border: '1px solid #D1D5DB', borderRadius: '4px', fontSize: '0.85rem' }}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Name"
                                        value={winner.name}
                                        onChange={e => {
                                            const updated = [...parseArrayField(newQuiz.winners)];
                                            updated[idx].name = e.target.value;
                                            setNewQuiz({ ...newQuiz, winners: updated });
                                        }}
                                        style={{ padding: '6px', border: '1px solid #D1D5DB', borderRadius: '4px', fontSize: '0.85rem' }}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Score"
                                        value={winner.score}
                                        onChange={e => {
                                            const updated = [...parseArrayField(newQuiz.winners)];
                                            updated[idx].score = e.target.value;
                                            setNewQuiz({ ...newQuiz, winners: updated });
                                        }}
                                        style={{ padding: '6px', border: '1px solid #D1D5DB', borderRadius: '4px', fontSize: '0.85rem' }}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Time"
                                        value={winner.time}
                                        onChange={e => {
                                            const updated = [...parseArrayField(newQuiz.winners)];
                                            updated[idx].time = e.target.value;
                                            setNewQuiz({ ...newQuiz, winners: updated });
                                        }}
                                        style={{ padding: '6px', border: '1px solid #D1D5DB', borderRadius: '4px', fontSize: '0.85rem' }}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Avatar URL"
                                        value={winner.avatar}
                                        onChange={e => {
                                            const updated = [...parseArrayField(newQuiz.winners)];
                                            updated[idx].avatar = e.target.value;
                                            setNewQuiz({ ...newQuiz, winners: updated });
                                        }}
                                        style={{ padding: '6px', border: '1px solid #D1D5DB', borderRadius: '4px', fontSize: '0.85rem' }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setNewQuiz({ ...newQuiz, winners: parseArrayField(newQuiz.winners).filter((_, i) => i !== idx) });
                                        }}
                                        style={{ color: '#EF4444', background: 'none', border: 'none', cursor: 'pointer' }}
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            ))
                        ) : (
                            <div style={{ padding: '16px', color: '#9CA3AF', textAlign: 'center', fontStyle: 'italic' }}>No winners added yet.</div>
                        )}
                    </div>
                </div>

                {/* Questions Section */}
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <label style={{ fontSize: '0.9rem', fontWeight: 500 }}>Questions ({parseArrayField(newQuiz.questions).length})</label>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button type="button" onClick={() => setShowSelectionModal(true)} style={{ fontSize: '0.8rem', padding: '4px 8px', background: '#F3F4F6', border: '1px solid #D1D5DB', borderRadius: '4px', cursor: 'pointer' }}>Select Existing</button>
                            <button type="button" onClick={() => { resetQuestionForm(); setShowQuestionModal(true); }} style={{ fontSize: '0.8rem', padding: '4px 8px', background: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>+ Create New</button>
                        </div>
                    </div>

                    <div style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid #D1D5DB', borderRadius: '4px', padding: '8px', backgroundColor: '#F9FAFB' }}>
                        {newQuiz.questions && parseArrayField(newQuiz.questions).length > 0 ? (
                            questions.filter(q => parseArrayField(newQuiz.questions).includes(q.id)).map(q => (
                                <div key={q.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px', borderBottom: '1px solid #E5E7EB', background: 'white', marginBottom: '4px', borderRadius: '4px' }}>
                                    <span style={{ flex: 1, fontSize: '0.9rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{q.text.replace(/<[^>]*>?/gm, '')}</span>
                                    <span style={{ fontSize: '0.75rem', padding: '2px 6px', backgroundColor: '#F3F4F6', borderRadius: '4px' }}>{q.type}</span>
                                    <button type="button" onClick={() => toggleQuestionSelection(q.id)} style={{ color: '#EF4444', background: 'none', border: 'none', cursor: 'pointer' }}><X size={16} /></button>
                                </div>
                            ))
                        ) : (
                            <div style={{ padding: '16px', color: '#9CA3AF', textAlign: 'center', fontStyle: 'italic' }}>No questions added yet.</div>
                        )}
                    </div>
                </div>


                {/* Study Material Section */}
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <label style={{ fontSize: '0.9rem', fontWeight: 500 }}>Study Material ({parseArrayField(newQuiz.studyMaterial).length})</label>
                        <button
                            type="button"
                            onClick={() => {
                                const newMat = { title: '', url: '', type: 'pdf' };
                                const currentMat = parseArrayField(newQuiz.studyMaterial);
                                setNewQuiz({ ...newQuiz, studyMaterial: [...currentMat, newMat] });
                            }}
                            style={{ fontSize: '0.8rem', padding: '4px 8px', background: '#3B82F6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                        >
                            + Add Material
                        </button>
                    </div>
                    <div style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid #D1D5DB', borderRadius: '4px', padding: '8px', backgroundColor: '#F9FAFB' }}>
                        {newQuiz.studyMaterial && parseArrayField(newQuiz.studyMaterial).length > 0 ? (
                            parseArrayField(newQuiz.studyMaterial).map((mat, idx) => (
                                <div key={idx} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 3fr auto', gap: '8px', marginBottom: '8px', padding: '8px', background: 'white', borderRadius: '4px' }}>
                                    <input
                                        type="text"
                                        placeholder="Title"
                                        value={mat.title}
                                        onChange={e => {
                                            const updated = [...parseArrayField(newQuiz.studyMaterial)];
                                            updated[idx].title = e.target.value;
                                            setNewQuiz({ ...newQuiz, studyMaterial: updated });
                                        }}
                                        style={{ padding: '6px', border: '1px solid #D1D5DB', borderRadius: '4px', fontSize: '0.85rem' }}
                                    />
                                    <select
                                        value={mat.type}
                                        onChange={e => {
                                            const updated = [...parseArrayField(newQuiz.studyMaterial)];
                                            updated[idx].type = e.target.value;
                                            setNewQuiz({ ...newQuiz, studyMaterial: updated });
                                        }}
                                        style={{ padding: '6px', border: '1px solid #D1D5DB', borderRadius: '4px', fontSize: '0.85rem' }}
                                    >
                                        <option value="pdf">PDF</option>
                                        <option value="link">Link</option>
                                        <option value="video">Video</option>
                                    </select>
                                    <div style={{ display: 'flex', gap: '4px' }}>
                                        <input
                                            type="text"
                                            placeholder="URL"
                                            value={mat.url}
                                            onChange={e => {
                                                const updated = [...parseArrayField(newQuiz.studyMaterial)];
                                                updated[idx].url = e.target.value;
                                                setNewQuiz({ ...newQuiz, studyMaterial: updated });
                                            }}
                                            style={{ flex: 1, padding: '6px', border: '1px solid #D1D5DB', borderRadius: '4px', fontSize: '0.85rem' }}
                                        />
                                        <label style={{ cursor: 'pointer', padding: '6px', backgroundColor: '#F3F4F6', border: '1px solid #D1D5DB', borderRadius: '4px', display: 'flex', alignItems: 'center' }}>
                                            <span style={{ fontSize: '0.8rem' }}>⬆️</span>
                                            <input
                                                type="file"
                                                style={{ display: 'none' }}
                                                onChange={async (e) => {
                                                    const file = e.target.files[0];
                                                    if (file) {
                                                        setUploading(true);
                                                        try {
                                                            const res = await mediaService.uploadFile(file, 'study_material');
                                                            if (res && (res.success || res.status === 'success' || res.data?.url)) {
                                                                const fileUrl = res.data?.url || res.url;
                                                                const updated = [...parseArrayField(newQuiz.studyMaterial)];
                                                                updated[idx].url = fileUrl;
                                                                if (file.type === 'application/pdf') updated[idx].type = 'pdf';
                                                                setNewQuiz({ ...newQuiz, studyMaterial: updated });
                                                            }
                                                        } catch (err) {
                                                            console.error("Upload failed", err);
                                                        } finally {
                                                            setUploading(false);
                                                        }
                                                    }
                                                }}
                                            />
                                        </label>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setNewQuiz({ ...newQuiz, studyMaterial: parseArrayField(newQuiz.studyMaterial).filter((_, i) => i !== idx) });
                                        }}
                                        style={{ color: '#EF4444', background: 'none', border: 'none', cursor: 'pointer' }}
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            ))
                        ) : (
                            <div style={{ padding: '16px', color: '#9CA3AF', textAlign: 'center', fontStyle: 'italic' }}>No study material added yet.</div>
                        )}
                    </div>
                </div>
            </FormModal >

            {/* Question Selection Modal */}
            {
                showSelectionModal && (
                    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100 }}>
                        <div className="card" style={{ width: '600px', maxHeight: '80vh', display: 'flex', flexDirection: 'column', padding: '24px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                <h3 style={{ margin: 0 }}>Select Questions</h3>
                                <button onClick={() => setShowSelectionModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={24} /></button>
                            </div>
                            <div style={{ flex: 1, overflowY: 'auto', border: '1px solid #E5E7EB', borderRadius: '4px' }}>
                                {questions.map(q => (
                                    <div key={q.id} onClick={() => toggleQuestionSelection(q.id)} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderBottom: '1px solid #F3F4F6', cursor: 'pointer', backgroundColor: (newQuiz.questions || []).includes(q.id) ? '#EFF6FF' : 'white' }}>
                                        <div style={{ width: '20px', height: '20px', borderRadius: '4px', border: '1px solid #D1D5DB', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: (newQuiz.questions || []).includes(q.id) ? 'var(--color-primary)' : 'white' }}>
                                            {(newQuiz.questions || []).includes(q.id) && <CheckSquare size={14} color="white" />}
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontSize: '0.95rem', marginBottom: '4px' }} dangerouslySetInnerHTML={{ __html: q.text }} />
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                <span style={{ fontSize: '0.75rem', padding: '2px 8px', backgroundColor: '#F3F4F6', borderRadius: '12px' }}>{q.type}</span>
                                                <span style={{ fontSize: '0.75rem', padding: '2px 8px', backgroundColor: '#F3F4F6', borderRadius: '12px' }}>{q.difficulty}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div style={{ marginTop: '16px', textAlign: 'right' }}>
                                <button onClick={() => setShowSelectionModal(false)} style={{ padding: '8px 20px', backgroundColor: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer' }}>Done</button>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* Create/Edit Question Modal */}
            <FormModal isOpen={showQuestionModal} onClose={() => setShowQuestionModal(false)} title={editingQuestion ? 'Edit Question' : 'Create New Question'} onSubmit={handleQuestionSubmit}>
                <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 500 }}>Question Text *</label>
                    <RichTextEditor value={questionFormData.text} onChange={content => setQuestionFormData({ ...questionFormData, text: content })} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 500 }}>Type</label>
                        <select value={questionFormData.type} onChange={e => setQuestionFormData({ ...questionFormData, type: e.target.value })} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #D1D5DB' }}>
                            <option value="multiple-choice">Multiple Choice</option>
                            <option value="true-false">True/False</option>
                            <option value="short-answer">Short Answer</option>
                        </select>
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 500 }}>Difficulty</label>
                        <select value={questionFormData.difficulty} onChange={e => setQuestionFormData({ ...questionFormData, difficulty: e.target.value })} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #D1D5DB' }}>
                            <option>Easy</option>
                            <option>Medium</option>
                            <option>Hard</option>
                        </select>
                    </div>
                </div>

                {questionFormData.type === 'multiple-choice' && (
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <label style={{ fontSize: '0.9rem', fontWeight: 500 }}>Options</label>
                            <span style={{ fontSize: '0.8rem', color: '#6B7280' }}>Select the radio button for the correct answer</span>
                        </div>
                        {questionFormData.options.map((option, index) => (
                            <div key={index} style={{ display: 'flex', gap: '8px', marginBottom: '8px', alignItems: 'center' }}>
                                <input
                                    type="radio"
                                    name="correctAnswer"
                                    checked={questionFormData.correctAnswer === index}
                                    onChange={() => setQuestionFormData({ ...questionFormData, correctAnswer: index })}
                                    style={{ cursor: 'pointer' }}
                                    title="Mark as correct answer"
                                />
                                <input
                                    type="text"
                                    value={option}
                                    onChange={(e) => handleOptionChange(index, e.target.value)}
                                    placeholder={`Option ${index + 1}`}
                                    style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid #D1D5DB' }}
                                />
                            </div>
                        ))}
                    </div>
                )}

                {questionFormData.type === 'true-false' && (
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 500 }}>Correct Answer</label>
                        <div style={{ display: 'flex', gap: '16px' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                <input
                                    type="radio"
                                    name="tfAnswer"
                                    checked={questionFormData.correctAnswer === 'true'}
                                    onChange={() => setQuestionFormData({ ...questionFormData, correctAnswer: 'true' })}
                                />
                                True
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                <input
                                    type="radio"
                                    name="tfAnswer"
                                    checked={questionFormData.correctAnswer === 'false'}
                                    onChange={() => setQuestionFormData({ ...questionFormData, correctAnswer: 'false' })}
                                />
                                False
                            </label>
                        </div>
                    </div>
                )}

                {questionFormData.type === 'short-answer' && (
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 500 }}>Correct Answer (Keywords/Exact Match)</label>
                        <input
                            type="text"
                            value={questionFormData.correctAnswer}
                            onChange={(e) => setQuestionFormData({ ...questionFormData, correctAnswer: e.target.value })}
                            placeholder="Enter the correct answer..."
                            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #D1D5DB' }}
                        />
                    </div>
                )}

                <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 500 }}>Tags (comma separated)</label>
                    <input type="text" value={questionFormData.tags} onChange={e => setQuestionFormData({ ...questionFormData, tags: e.target.value })} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #D1D5DB' }} />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 500 }}>Attachment (Optional)</label>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <input
                            type="text"
                            placeholder="File URL"
                            value={questionFormData.attachment || ''}
                            onChange={e => setQuestionFormData({ ...questionFormData, attachment: e.target.value })}
                            style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid #D1D5DB' }}
                        />
                        <label style={{ cursor: 'pointer', padding: '8px 12px', backgroundColor: '#F3F4F6', border: '1px solid #D1D5DB', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem' }}>
                            <span>📎 Upload</span>
                            <input
                                type="file"
                                style={{ display: 'none' }}
                                onChange={async (e) => {
                                    const file = e.target.files[0];
                                    if (file) {
                                        setUploading(true);
                                        try {
                                            const res = await mediaService.uploadFile(file, 'question_attachments');
                                            if (res && res.success) {
                                                setQuestionFormData({ ...questionFormData, attachment: res.data.url });
                                            }
                                        } catch (err) {
                                            console.error("Upload failed", err);
                                        } finally {
                                            setUploading(false);
                                        }
                                    }
                                }}
                            />
                        </label>
                    </div>
                    {questionFormData.attachment && (
                        <a href={questionFormData.attachment} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.8rem', color: '#3B82F6', marginTop: '4px', display: 'inline-block' }}>
                            View attached file
                        </a>
                    )}
                </div>
            </FormModal>

            {/* Add Category Modal */}
            {
                showCategoryModal && (
                    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                        <div className="card" style={{ width: '400px', padding: '24px' }}>
                            <h3 style={{ marginBottom: '20px' }}>Add Quiz Category</h3>
                            <form onSubmit={handleCategorySubmit} style={{ display: 'grid', gap: '16px' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 500 }}>Category Name</label>
                                    <input type="text" required value={newCategory.name} onChange={e => setNewCategory({ ...newCategory, name: e.target.value })} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #D1D5DB' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 500 }}>Icon (Emoji)</label>
                                    <input type="text" required value={newCategory.icon} onChange={e => setNewCategory({ ...newCategory, icon: e.target.value })} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #D1D5DB' }} placeholder="e.g. 🧘" />
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
                                    <button type="button" onClick={() => setShowCategoryModal(false)} style={{ padding: '8px 16px', border: '1px solid #D1D5DB', borderRadius: '4px', background: 'white', cursor: 'pointer' }}>Cancel</button>
                                    <button type="submit" style={{ padding: '8px 16px', backgroundColor: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Add Category</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )
            }

            {/* Result Board Modal */}
            {
                showResultBoard && selectedQuizForResults && (
                    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100, padding: '16px' }}>
                        <div className="card w-full max-w-4xl" style={{ maxHeight: '90vh', display: 'flex', flexDirection: 'column', padding: '24px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                <h3 style={{ margin: 0 }}>Results: {selectedQuizForResults.title}</h3>
                                <button onClick={() => setShowResultBoard(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={24} /></button>
                            </div>

                            <div style={{ flex: 1, overflowY: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead style={{ backgroundColor: '#F9FAFB', textAlign: 'left' }}>
                                        <tr>
                                            <th style={{ padding: '12px', borderBottom: '1px solid #E5E7EB' }}>Student Name</th>
                                            <th style={{ padding: '12px', borderBottom: '1px solid #E5E7EB' }}>Score</th>
                                            <th style={{ padding: '12px', borderBottom: '1px solid #E5E7EB' }}>%</th>
                                            <th style={{ padding: '12px', borderBottom: '1px solid #E5E7EB' }}>Time Taken</th>
                                            <th style={{ padding: '12px', borderBottom: '1px solid #E5E7EB' }}>Attempt Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {getQuizResults().map(result => (
                                            <tr key={result.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                                                <td style={{ padding: '12px', fontWeight: 500 }}>{result.userName}</td>
                                                <td style={{ padding: '12px' }}>{result.score}</td>
                                                <td style={{ padding: '12px' }}>
                                                    <span style={{ padding: '2px 8px', borderRadius: '12px', backgroundColor: result.percentage >= 70 ? '#D1FAE5' : '#FEE2E2', color: result.percentage >= 70 ? '#065F46' : '#991B1B', fontSize: '0.8rem', fontWeight: 500 }}>
                                                        {result.percentage}%
                                                    </span>
                                                </td>
                                                <td style={{ padding: '12px' }}>{result.timeTaken}</td>
                                                <td style={{ padding: '12px', color: '#6B7280' }}>{result.attemptDate}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div style={{ marginTop: '20px', textAlign: 'right' }}>
                                <button style={{ padding: '8px 16px', backgroundColor: '#3B82F6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Export CSV</button>
                            </div>
                        </div>
                    </div>
                )
            }

            <TrendingModal
                isOpen={showTrendingModal}
                onClose={() => setShowTrendingModal(false)}
                title="Top Quizzes by Participation"
                data={trending.length > 0 ? trending : filteredQuizzes}
                metricKey="totalAttempts"
                metricLabel="Attempts"
            />
        </div >

    );
};

export default QuizManagement;
