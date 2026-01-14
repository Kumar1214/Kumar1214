import { Plus, Trash2, Edit, CheckSquare, X, BarChart2, TrendingUp, Users, CheckCircle, Award, Share2 } from 'lucide-react';
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

const ExamManagement = () => {
    const { filteredExams, addExam, deleteExam, updateExam, examCategories, addExamCategory, deleteExamCategory, questions, addQuestion, updateQuestion, refreshExams } = useData();
    const { getModuleAnalytics, getTrendingContent } = useContext(DataContext);
    const [analytics, setAnalytics] = useState(null);
    const [trending, setTrending] = useState([]);
    const [showTrendingModal, setShowTrendingModal] = useState(false);
    const [showExamModal, setShowExamModal] = useState(false);
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [showQuestionModal, setShowQuestionModal] = useState(false);
    const [showSelectionModal, setShowSelectionModal] = useState(false);
    const [showResultBoard, setShowResultBoard] = useState(false);
    const [selectedExamForResults, setSelectedExamForResults] = useState(null);
    const [uploading, setUploading] = useState(false);


    const [editingExam, setEditingExam] = useState(null);
    const [editingQuestion, setEditingQuestion] = useState(null);

    const [newExam, setNewExam] = useState({
        title: '',
        description: '',
        category: 'Ayurveda',
        duration: 60,
        passingMarks: 70,
        questions: [],
        price: 0,
        startDate: '',
        endDate: '',
        resultDate: '',
        image: '',
        prizes: [],
        winners: [],
        studyMaterial: []
    });

    const [newCategory, setNewCategory] = useState({
        name: '',
        icon: '📝'
    });

    const [questionFormData, setQuestionFormData] = useState({
        text: '', type: 'multiple_choice', options: ['', '', '', ''], correctAnswer: 0,
        tags: '', difficulty: 'Medium'
    });

    // Exam Form Handlers
    const resetExamForm = () => {
        setNewExam({
            title: '',
            description: '',
            category: 'Ayurveda',
            duration: 60,
            passingMarks: 70,
            questions: [],
            price: 0,
            startDate: '',
            endDate: '',
            resultDate: '',
            image: '',
            prizes: [],
            winners: [],
            studyMaterial: []
        });
        setEditingExam(null);
    };

    const handleExamSubmit = async (data) => {
        // data from FormModal might be partial or empty if custom fields were used
        // We prioritize the newExam state which is updated by all specialized handlers
        const examData = { ...newExam, ...(data || {}) };

        // Validation
        if (!examData.title || !examData.duration || !examData.description) {
            toast.error("Please fill in required fields: Title, Description, and Duration");
            return;
        }
        if (examData.price === undefined || examData.price === null || examData.price < 0) {
            toast.error("Please enter a valid Price (0 for free)");
            return;
        }

        // Map Question IDs to Full Objects for Backend
        // The backend needs full objects to calculate totalMarks
        const selectedQuestionIds = parseArrayField(examData.questions);
        const fullQuestions = questions.filter(q => selectedQuestionIds.includes(q.id));

        const payload = {
            ...examData,
            questions: fullQuestions
        };

        const promise = editingExam
            ? updateExam(editingExam.id, payload)
            : addExam(payload);

        toast.promise(promise, {
            loading: editingExam ? 'Updating exam...' : 'Creating exam...',
            success: (res) => {
                setShowExamModal(false);
                resetExamForm();
                return editingExam ? "Exam updated successfully" : "Exam created successfully";
            },
            error: (err) => {
                console.error('Failed to save exam:', err);
                return err.response?.data?.message || 'Failed to save exam. Please try again.';
            }
        });
    };

    const handleEditExam = (exam) => {
        // Safe parsing helper properly
        const safeParse = (field) => parseArrayField(field, []);

        // If questions are objects (populated), extract IDs. If strings/numbers, keep as is.
        let rawQuestions = safeParse(exam.questions);
        const questionIds = rawQuestions.map(q => (typeof q === 'object' ? q.id : q));

        // Format Date for datetime-local (YYYY-MM-DDTHH:mm)
        const formatDate = (dateStr) => {
            if (!dateStr) return '';
            try {
                return new Date(dateStr).toISOString().slice(0, 16);
            } catch (e) { return ''; }
        };

        const parsedExam = {
            ...exam,
            description: exam.description || '',
            prizes: safeParse(exam.prizes),
            winners: safeParse(exam.winners),
            questions: questionIds,
            studyMaterial: safeParse(exam.studyMaterial),
            startDate: formatDate(exam.startDate),
            endDate: formatDate(exam.endDate),
            resultDate: formatDate(exam.resultDate)
        };
        setEditingExam(parsedExam);
        setNewExam(parsedExam);
        setShowExamModal(true);
    };

    const handleCategorySubmit = (e) => {
        e.preventDefault();
        addExamCategory(newCategory);
        setShowCategoryModal(false);
        setNewCategory({ name: '', icon: '📝' });
    };

    // Question Form Handlers
    const resetQuestionForm = () => {
        setQuestionFormData({
            text: '', type: 'multiple-choice', options: ['', '', '', ''], correctAnswer: 0,
            tags: '', difficulty: 'Medium'
        });
        setEditingQuestion(null);
    };

    const handleQuestionSubmit = async (e) => {
        // Handle both event (from manual form) and direct call
        if (e && e.preventDefault) {
            e.preventDefault();
        }

        // In Exams.jsx, the question modal is a manual form using questionFormData state
        // The argument 'e' is the event, so we should ignore it as data and use state
        const formData = questionFormData;

        const dataToSubmit = {
            ...formData,
            tags: typeof formData.tags === 'string' ? formData.tags.split(',').map(t => t.trim()) : formData.tags,
            category: newExam.category || 'General'
        };

        try {
            if (editingQuestion) {
                await updateQuestion(editingQuestion.id, dataToSubmit);
            } else {
                const res = await addQuestion(dataToSubmit);
                console.log('Question created:', res);

                if (res && res.success && res.data) {
                    // Add the new question ID to the current exam being created
                    setNewExam(prev => {
                        const currentQuestions = parseArrayField(prev.questions);
                        const updated = {
                            ...prev,
                            questions: [...currentQuestions, res.data.id]
                        };
                        console.log('Updated exam with question:', updated.questions);
                        return updated;
                    });
                } else {
                    throw new Error('Failed to create question - no data returned');
                }
            }

            setShowQuestionModal(false);
            resetQuestionForm();
            toast.success(editingQuestion ? "Question updated" : "Question added");
        } catch (error) {
            console.error('Question submit error:', error);
            toast.error('Failed to save question: ' + (error.message || 'Unknown error'));
        }
    };

    const handleOptionChange = (index, value) => {
        const newOptions = [...questionFormData.options];
        newOptions[index] = value;
        setQuestionFormData({ ...questionFormData, options: newOptions });
    };

    const toggleQuestionSelection = (questionId) => {
        const currentQuestions = parseArrayField(newExam.questions);
        if (currentQuestions.includes(questionId)) {
            setNewExam({ ...newExam, questions: currentQuestions.filter(id => id !== questionId) });
        } else {
            setNewExam({ ...newExam, questions: [...currentQuestions, questionId] });
        }
    };

    const handleViewResults = (exam) => {
        setSelectedExamForResults(exam);
        setShowResultBoard(true);
    };

    // Mock result data - in real app, this would come from backend
    const getExamResults = () => {
        return [
            { id: 1, userName: 'Sarah Johnson', score: '45/50', percentage: 90, timeTaken: '55m 30s', attemptDate: '2024-12-03' },
            { id: 2, userName: 'Michael Chen', score: '43/50', percentage: 86, timeTaken: '58m 15s', attemptDate: '2024-12-03' },
            { id: 3, userName: 'Emily Davis', score: '41/50', percentage: 82, timeTaken: '59m 45s', attemptDate: '2024-12-02' },
            { id: 4, userName: 'David Wilson', score: '39/50', percentage: 78, timeTaken: '60m 00s', attemptDate: '2024-12-02' },
            { id: 5, userName: 'Lisa Anderson', score: '37/50', percentage: 74, timeTaken: '58m 30s', attemptDate: '2024-12-01' }
        ];
    };


    useEffect(() => {
        const fetchAnalytics = async () => {
            const data = await getModuleAnalytics('exam');
            if (data) setAnalytics(data);

            const trendingData = await getTrendingContent('exam', 10);
            if (trendingData) setTrending(trendingData);
        };
        fetchAnalytics();
    }, [getModuleAnalytics, getTrendingContent]);

    return (
        <div>
            <AnalyticsGrid
                metrics={[
                    { title: 'Total Exams', value: analytics?.totalItems || filteredExams.length, icon: BarChart2, color: 'indigo' },
                    { title: 'Total Attempts', value: analytics?.overview?.totalAttempts?.toLocaleString() || '1,850', icon: Users, color: 'blue', trend: 'up', trendValue: 12 },
                    { title: 'Avg. Pass Rate', value: analytics?.overview?.avgPassRate ? `${analytics.overview.avgPassRate}%` : '76%', icon: CheckCircle, color: 'green' },
                    { title: 'Total Shares', value: analytics?.overview?.totalShares?.toLocaleString() || '210', icon: Share2, color: 'purple' }
                ]}
            />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '24px', marginBottom: '32px' }}>
                <div className="card" style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, margin: 0 }}>Participation Trends</h3>
                        <button
                            onClick={() => setShowTrendingModal(true)}
                            style={{ background: 'none', border: 'none', color: '#4F46E5', fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.9rem' }}
                        >
                            <TrendingUp size={16} /> View Top 50
                        </button>
                    </div>
                    <TrendingChart data={trending.length > 0 ? trending : filteredExams.slice(0, 8)} dataKey="totalAttempts" />
                </div>

                <div style={{ backgroundColor: '#0c2d50', borderRadius: '12px', padding: '24px', color: 'white', display: 'flex', flexDirection: 'column', height: '100%' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 600, margin: '0 0 12px 0' }}>Exam Insights</h3>
                    <p style={{ fontSize: '0.9rem', color: '#E5E7EB', lineHeight: 1.5, flex: 1 }}>
                        The "Basic Ayurveda" exam has the highest pass rate (92%) this month. Consider increasing complexity for advanced learners.
                    </p>
                    <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', paddingBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                            <span style={{ color: '#9CA3AF' }}>Most Popular</span>
                            <span style={{ fontWeight: 600 }}>Yoga Level 1</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                            <span style={{ color: '#9CA3AF' }}>Avg. Score</span>
                            <span style={{ fontWeight: 600 }}>82 / 100</span>
                        </div>
                    </div>
                </div>
            </div>
            {/* Exam Categories Section */}
            <div style={{ marginBottom: '40px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--spacing-lg)' }}>
                    <h3>Exam Categories</h3>
                    <button onClick={() => setShowCategoryModal(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', backgroundColor: '#F3F4F6', color: '#374151', border: '1px solid #D1D5DB', borderRadius: 'var(--radius-md)', cursor: 'pointer' }}>
                        <Plus size={16} /> Add Category
                    </button>
                </div>
                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                    {(examCategories || []).map(cat => (
                        <div key={cat.id} className="card" style={{ padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '12px', minWidth: '150px' }}>
                            <span style={{ fontSize: '1.5rem' }}>{cat.icon}</span>
                            <span style={{ fontWeight: 500 }}>{cat.name}</span>
                            <button onClick={() => deleteExamCategory(cat.id)} style={{ marginLeft: 'auto', border: 'none', background: 'none', cursor: 'pointer', color: '#9CA3AF' }}><Trash2 size={14} /></button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Exam List Section */}
            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--spacing-lg)' }}>
                    <h3>Exam Management</h3>
                    <button onClick={() => { resetExamForm(); setShowExamModal(true); }} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', backgroundColor: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer' }}>
                        <Plus size={18} /> Create Exam
                    </button>
                </div>
                <div style={{ display: 'grid', gap: 'var(--spacing-md)' }}>
                    {filteredExams.map(exam => (
                        <div key={exam.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--spacing-lg)' }}>
                            <div>
                                <h4 style={{ marginBottom: '4px', fontSize: '1.1rem' }}>{exam.title}</h4>
                                <div style={{ display: 'flex', gap: '12px', color: '#6B7280', fontSize: '0.9rem' }}>
                                    <span>{exam.category}</span>
                                    <span>•</span>
                                    <span>{exam.duration} mins</span>
                                    <span>•</span>
                                    <span>{parseArrayField(exam.questions).length} Questions</span>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <button onClick={() => handleViewResults(exam)} style={{ padding: '8px', border: '1px solid #10B981', borderRadius: '4px', cursor: 'pointer', color: '#10B981', background: '#F0FDF4' }}>Results</button>
                                <button onClick={() => handleEditExam(exam)} style={{ padding: '8px', border: '1px solid #E5E7EB', borderRadius: '4px', cursor: 'pointer', color: '#4B5563' }}><Edit size={18} /></button>
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
                                            deleteExam(exam.id).then(() => {
                                                toast.success("Exam deleted successfully");
                                            }).catch(() => toast.error("Failed to delete exam"));
                                        }
                                    });
                                }} style={{ padding: '8px', border: '1px solid #FCA5A5', color: '#B91C1C', borderRadius: '4px', cursor: 'pointer', background: '#FEF2F2' }}><Trash2 size={18} /></button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Add/Edit Exam Modal */}
            <FormModal isOpen={showExamModal} onClose={() => setShowExamModal(false)} title={editingExam ? 'Edit Exam' : 'Create New Exam'} onSubmit={handleExamSubmit} isLoading={uploading}>
                <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 500 }}>Exam Title *</label>
                    <input type="text" required value={newExam.title} onChange={e => setNewExam({ ...newExam, title: e.target.value })} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #D1D5DB' }} />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 500 }}>Description *</label>
                    <textarea
                        required
                        value={newExam.description}
                        onChange={e => setNewExam({ ...newExam, description: e.target.value })}
                        style={{ width: '100%', minHeight: '80px', padding: '8px', borderRadius: '4px', border: '1px solid #D1D5DB' }}
                        placeholder="Enter elaborate exam description..."
                    />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 500 }}>Category</label>
                        <select value={newExam.category} onChange={e => setNewExam({ ...newExam, category: e.target.value })} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #D1D5DB' }}>
                            <option key="default" value="">Select Category</option>
                            {(examCategories || []).map(cat => (
                                <option key={cat.id} value={cat.name}>{cat.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 500 }}>Duration (mins) *</label>
                        <input type="number" required value={newExam.duration} onChange={e => setNewExam({ ...newExam, duration: parseInt(e.target.value) })} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #D1D5DB' }} />
                    </div>
                </div>
                <div>
                    <FileUploader
                        label="Exam Thumbnail"
                        accept="image/*"
                        value={newExam.image}
                        onChange={(url) => setNewExam({ ...newExam, image: url })}
                    />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 500 }}>Passing Score</label>
                    <input type="number" min="0" max="100" value={newExam.passingMarks} onChange={e => setNewExam({ ...newExam, passingMarks: parseInt(e.target.value) })} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #D1D5DB' }} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                    <input
                        type="checkbox"
                        id="featuredExam"
                        checked={newExam.featured || false}
                        onChange={e => setNewExam({ ...newExam, featured: e.target.checked })}
                        style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                    />
                    <label htmlFor="featuredExam" style={{ cursor: 'pointer', fontSize: '0.9rem', fontWeight: 500 }}>Featured Exam</label>
                </div>

                {/* Pricing & Scheduling */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 500 }}>Price (₹) *</label>
                        <input
                            type="number"
                            min="0"
                            required
                            value={newExam.price}
                            onChange={e => setNewExam({ ...newExam, price: parseInt(e.target.value) || 0 })}
                            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #D1D5DB' }}
                            placeholder="0 for Free"
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 500 }}>Start Date (Optional)</label>
                        <input
                            type="datetime-local"
                            value={newExam.startDate}
                            onChange={e => setNewExam({ ...newExam, startDate: e.target.value })}
                            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #D1D5DB' }}
                        />
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 500 }}>End Date (Optional)</label>
                        <input
                            type="datetime-local"
                            value={newExam.endDate}
                            onChange={e => setNewExam({ ...newExam, endDate: e.target.value })}
                            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #D1D5DB' }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 500 }}>Result Date (Optional)</label>
                        <input
                            type="datetime-local"
                            value={newExam.resultDate}
                            onChange={e => setNewExam({ ...newExam, resultDate: e.target.value })}
                            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #D1D5DB' }}
                        />
                    </div>
                </div>

                {/* Prizes Section */}
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <label style={{ fontSize: '0.9rem', fontWeight: 500 }}>Prizes ({parseArrayField(newExam.prizes).length})</label>
                        <button
                            type="button"
                            onClick={() => {
                                const newPrize = { title: '', icon: 'gift', description: '' };
                                const currentPrizes = parseArrayField(newExam.prizes);
                                setNewExam({ ...newExam, prizes: [...currentPrizes, newPrize] });
                            }}
                            style={{ fontSize: '0.8rem', padding: '4px 8px', background: '#F59E0B', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                        >
                            + Add Prize
                        </button>
                    </div>
                    <div style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid #D1D5DB', borderRadius: '4px', padding: '8px', backgroundColor: '#F9FAFB' }}>
                        {newExam.prizes && parseArrayField(newExam.prizes).length > 0 ? (
                            parseArrayField(newExam.prizes).map((prize, idx) => (
                                <div key={idx} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 3fr auto', gap: '8px', marginBottom: '8px', padding: '8px', background: 'white', borderRadius: '4px' }}>
                                    <input
                                        type="text"
                                        placeholder="Prize Title"
                                        value={prize.title}
                                        onChange={e => {
                                            const updated = [...parseArrayField(newExam.prizes)];
                                            updated[idx].title = e.target.value;
                                            setNewExam({ ...newExam, prizes: updated });
                                        }}
                                        style={{ padding: '6px', border: '1px solid #D1D5DB', borderRadius: '4px', fontSize: '0.85rem' }}
                                    />
                                    <select
                                        value={prize.icon}
                                        onChange={e => {
                                            const updated = [...parseArrayField(newExam.prizes)];
                                            updated[idx].icon = e.target.value;
                                            setNewExam({ ...newExam, prizes: updated });
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
                                            const updated = [...parseArrayField(newExam.prizes)];
                                            updated[idx].description = e.target.value;
                                            setNewExam({ ...newExam, prizes: updated });
                                        }}
                                        style={{ padding: '6px', border: '1px solid #D1D5DB', borderRadius: '4px', fontSize: '0.85rem' }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setNewExam({ ...newExam, prizes: parseArrayField(newExam.prizes).filter((_, i) => i !== idx) });
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
                        <label style={{ fontSize: '0.9rem', fontWeight: 500 }}>Winners ({parseArrayField(newExam.winners).length})</label>
                        <button
                            type="button"
                            onClick={() => {
                                const currentWinners = parseArrayField(newExam.winners);
                                const newWinner = { rank: (currentWinners.length || 0) + 1, name: '', score: '', time: '', avatar: '' };
                                setNewExam({ ...newExam, winners: [...currentWinners, newWinner] });
                            }}
                            style={{ fontSize: '0.8rem', padding: '4px 8px', background: '#10B981', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                        >
                            + Add Winner
                        </button>
                    </div>
                    <div style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid #D1D5DB', borderRadius: '4px', padding: '8px', backgroundColor: '#F9FAFB' }}>
                        {newExam.winners && parseArrayField(newExam.winners).length > 0 ? (
                            parseArrayField(newExam.winners).map((winner, idx) => (
                                <div key={idx} style={{ display: 'grid', gridTemplateColumns: '60px 2fr 1fr 1fr 2fr auto', gap: '8px', marginBottom: '8px', padding: '8px', background: 'white', borderRadius: '4px' }}>
                                    <input
                                        type="number"
                                        placeholder="Rank"
                                        value={winner.rank}
                                        onChange={e => {
                                            const updated = [...parseArrayField(newExam.winners)];
                                            updated[idx].rank = parseInt(e.target.value) || 1;
                                            setNewExam({ ...newExam, winners: updated });
                                        }}
                                        style={{ padding: '6px', border: '1px solid #D1D5DB', borderRadius: '4px', fontSize: '0.85rem' }}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Name"
                                        value={winner.name}
                                        onChange={e => {
                                            const updated = [...parseArrayField(newExam.winners)];
                                            updated[idx].name = e.target.value;
                                            setNewExam({ ...newExam, winners: updated });
                                        }}
                                        style={{ padding: '6px', border: '1px solid #D1D5DB', borderRadius: '4px', fontSize: '0.85rem' }}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Score"
                                        value={winner.score}
                                        onChange={e => {
                                            const updated = [...parseArrayField(newExam.winners)];
                                            updated[idx].score = e.target.value;
                                            setNewExam({ ...newExam, winners: updated });
                                        }}
                                        style={{ padding: '6px', border: '1px solid #D1D5DB', borderRadius: '4px', fontSize: '0.85rem' }}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Time"
                                        value={winner.time}
                                        onChange={e => {
                                            const updated = [...parseArrayField(newExam.winners)];
                                            updated[idx].time = e.target.value;
                                            setNewExam({ ...newExam, winners: updated });
                                        }}
                                        style={{ padding: '6px', border: '1px solid #D1D5DB', borderRadius: '4px', fontSize: '0.85rem' }}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Avatar URL"
                                        value={winner.avatar}
                                        onChange={e => {
                                            const updated = [...parseArrayField(newExam.winners)];
                                            updated[idx].avatar = e.target.value;
                                            setNewExam({ ...newExam, winners: updated });
                                        }}
                                        style={{ padding: '6px', border: '1px solid #D1D5DB', borderRadius: '4px', fontSize: '0.85rem' }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setNewExam({ ...newExam, winners: parseArrayField(newExam.winners).filter((_, i) => i !== idx) });
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
                        <label style={{ fontSize: '0.9rem', fontWeight: 500 }}>Questions ({parseArrayField(newExam.questions).length})</label>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button type="button" onClick={() => setShowSelectionModal(true)} style={{ fontSize: '0.8rem', padding: '4px 8px', background: '#F3F4F6', border: '1px solid #D1D5DB', borderRadius: '4px', cursor: 'pointer' }}>Select Existing</button>
                            <button type="button" onClick={() => { resetQuestionForm(); setShowQuestionModal(true); }} style={{ fontSize: '0.8rem', padding: '4px 8px', background: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>+ Create New</button>
                        </div>
                    </div>

                    <div style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid #D1D5DB', borderRadius: '4px', padding: '8px', backgroundColor: '#F9FAFB' }}>
                        {newExam.questions && parseArrayField(newExam.questions).length > 0 ? (
                            questions.filter(q => parseArrayField(newExam.questions).includes(q.id)).map(q => (
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
                        <label style={{ fontSize: '0.9rem', fontWeight: 500 }}>Study Material ({parseArrayField(newExam.studyMaterial).length})</label>
                        <button
                            type="button"
                            onClick={() => {
                                const newMat = { title: '', url: '', type: 'pdf' };
                                const currentMat = parseArrayField(newExam.studyMaterial);
                                setNewExam({ ...newExam, studyMaterial: [...currentMat, newMat] });
                            }}
                            style={{ fontSize: '0.8rem', padding: '4px 8px', background: '#3B82F6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                        >
                            + Add Material
                        </button>
                    </div>
                    <div style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid #D1D5DB', borderRadius: '4px', padding: '8px', backgroundColor: '#F9FAFB' }}>
                        {newExam.studyMaterial && parseArrayField(newExam.studyMaterial).length > 0 ? (
                            parseArrayField(newExam.studyMaterial).map((mat, idx) => (
                                <div key={idx} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 3fr auto', gap: '8px', marginBottom: '8px', padding: '8px', background: 'white', borderRadius: '4px' }}>
                                    <input
                                        type="text"
                                        placeholder="Title"
                                        value={mat.title}
                                        onChange={e => {
                                            const updated = [...parseArrayField(newExam.studyMaterial)];
                                            updated[idx].title = e.target.value;
                                            setNewExam({ ...newExam, studyMaterial: updated });
                                        }}
                                        style={{ padding: '6px', border: '1px solid #D1D5DB', borderRadius: '4px', fontSize: '0.85rem' }}
                                    />
                                    <select
                                        value={mat.type}
                                        onChange={e => {
                                            const updated = [...parseArrayField(newExam.studyMaterial)];
                                            updated[idx].type = e.target.value;
                                            setNewExam({ ...newExam, studyMaterial: updated });
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
                                                const updated = [...parseArrayField(newExam.studyMaterial)];
                                                updated[idx].url = e.target.value;
                                                setNewExam({ ...newExam, studyMaterial: updated });
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
                                                                const updated = [...parseArrayField(newExam.studyMaterial)];
                                                                updated[idx].url = fileUrl;
                                                                // Auto-set type if PDF
                                                                if (file.type === 'application/pdf') updated[idx].type = 'pdf';
                                                                setNewExam({ ...newExam, studyMaterial: updated });
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
                                            setNewExam({ ...newExam, studyMaterial: parseArrayField(newExam.studyMaterial).filter((_, i) => i !== idx) });
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
            </FormModal>

            {/* Question Selection Modal */}
            {
                showSelectionModal && (
                    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100, padding: '16px' }}>
                        <div className="card w-full max-w-2xl" style={{ maxHeight: '90vh', display: 'flex', flexDirection: 'column', padding: '24px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                <h3 style={{ margin: 0 }}>Select Questions</h3>
                                <button onClick={() => setShowSelectionModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={24} /></button>
                            </div>
                            <div style={{ flex: 1, overflowY: 'auto', border: '1px solid #E5E7EB', borderRadius: '4px' }}>
                                {questions.map(q => (
                                    <div key={q.id} onClick={() => toggleQuestionSelection(q.id)} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderBottom: '1px solid #F3F4F6', cursor: 'pointer', backgroundColor: (newExam.questions || []).includes(q.id) ? '#EFF6FF' : 'white' }}>
                                        <div style={{ width: '20px', height: '20px', borderRadius: '4px', border: '1px solid #D1D5DB', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: (newExam.questions || []).includes(q.id) ? 'var(--color-primary)' : 'white' }}>
                                            {(newExam.questions || []).includes(q.id) && <CheckSquare size={14} color="white" />}
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

            {/* Create/Edit Question Modal - Custom implementation to avoid nesting FormModal */}
            {
                showQuestionModal && (
                    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1200, padding: '16px' }}>
                        <div className="card w-full max-w-3xl" style={{ maxHeight: '90vh', overflowY: 'auto', padding: '24px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                <h3 style={{ margin: 0 }}>{editingQuestion ? 'Edit Question' : 'Create New Question'}</h3>
                                <button onClick={() => setShowQuestionModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '24px', color: '#6B7280' }}><X size={24} /></button>
                            </div>
                            <form onSubmit={handleQuestionSubmit} style={{ display: 'grid', gap: '16px' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 500 }}>Question Text *</label>
                                    <textarea
                                        value={questionFormData.text}
                                        onChange={e => setQuestionFormData({ ...questionFormData, text: e.target.value })}
                                        style={{ width: '100%', minHeight: '100px', padding: '8px', borderRadius: '4px', border: '1px solid #D1D5DB', fontFamily: 'inherit' }}
                                        placeholder="Enter your question here..."
                                    />
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

                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #E5E7EB' }}>
                                    <button type="button" onClick={() => setShowQuestionModal(false)} style={{ padding: '10px 20px', border: '1px solid #D1D5DB', borderRadius: '6px', background: 'white', cursor: 'pointer', fontWeight: 500 }}>Cancel</button>
                                    <button type="submit" style={{ padding: '10px 20px', backgroundColor: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 500 }}>Add Question</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )
            }

            {/* Add Category Modal */}
            {
                showCategoryModal && (
                    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '16px' }}>
                        <div className="card w-full max-w-md" style={{ padding: '24px' }}>
                            <h3 style={{ marginBottom: '20px' }}>Add Exam Category</h3>
                            <form onSubmit={handleCategorySubmit} style={{ display: 'grid', gap: '16px' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 500 }}>Category Name</label>
                                    <input type="text" required value={newCategory.name} onChange={e => setNewCategory({ ...newCategory, name: e.target.value })} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #D1D5DB' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 500 }}>Icon (Emoji)</label>
                                    <input type="text" required value={newCategory.icon} onChange={e => setNewCategory({ ...newCategory, icon: e.target.value })} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #D1D5DB' }} placeholder="e.g. 🌿" />
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
                showResultBoard && selectedExamForResults && (
                    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100, padding: '16px' }}>
                        <div className="card w-full max-w-4xl" style={{ maxHeight: '90vh', display: 'flex', flexDirection: 'column', padding: '24px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                <h3 style={{ margin: 0 }}>Results: {selectedExamForResults.title}</h3>
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
                                        {getExamResults().map(result => (
                                            <tr key={result.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                                                <td style={{ padding: '12px', fontWeight: 500 }}>{result.userName}</td>
                                                <td style={{ padding: '12px' }}>{result.score}</td>
                                                <td style={{ padding: '12px' }}>
                                                    <span style={{ padding: '2px 8px', borderRadius: '12px', backgroundColor: result.percentage >= selectedExamForResults.passingMarks ? '#D1FAE5' : '#FEE2E2', color: result.percentage >= selectedExamForResults.passingMarks ? '#065F46' : '#991B1B', fontSize: '0.8rem', fontWeight: 500 }}>
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
                title="Top Exams by Participation"
                data={trending.length > 0 ? trending : filteredExams}
                metricKey="totalAttempts"
                metricLabel="Attempts"
            />
        </div >
    );
};

export default ExamManagement;
