import React, { useState } from 'react';
import { Plus, Trash2, Edit, CheckSquare, X } from 'lucide-react';
import { useData } from '../../context/useData';
import FormModal from '../FormModal';
import RichTextEditor from '../RichTextEditor';

const ExamManagement = () => {
    const { filteredExams, addExam, deleteExam, updateExam, examCategories, addExamCategory, deleteExamCategory, questions, addQuestion, updateQuestion } = useData();
    const [showExamModal, setShowExamModal] = useState(false);
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [showQuestionModal, setShowQuestionModal] = useState(false);
    const [showSelectionModal, setShowSelectionModal] = useState(false);
    const [showResultBoard, setShowResultBoard] = useState(false);
    const [selectedExamForResults, setSelectedExamForResults] = useState(null);

    const [editingExam, setEditingExam] = useState(null);
    const [editingQuestion, setEditingQuestion] = useState(null);

    const [newExam, setNewExam] = useState({
        title: '',
        category: 'Ayurveda',
        duration: 60,
        passingScore: 70,
        questions: [],
        price: 0,
        startDate: '',
        endDate: '',
        resultDate: '',
        prizes: [],
        winners: []
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
            category: 'Ayurveda',
            duration: 60,
            passingScore: 70,
            questions: [],
            price: 0,
            startDate: '',
            endDate: '',
            resultDate: '',
            prizes: [],
            winners: []
        });
        setEditingExam(null);
    };

    const handleExamSubmit = (e) => {
        e.preventDefault();
        if (editingExam) {
            updateExam(editingExam.id, newExam);
        } else {
            addExam(newExam);
        }
        setShowExamModal(false);
        resetExamForm();
    };

    const handleEditExam = (exam) => {
        setEditingExam(exam);
        setNewExam(exam);
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
            text: '', type: 'multiple_choice', options: ['', '', '', ''], correctAnswer: 0,
            tags: '', difficulty: 'Medium'
        });
        setEditingQuestion(null);
    };

    const handleQuestionSubmit = (e) => {
        e.preventDefault();
        const dataToSubmit = {
            ...questionFormData,
            tags: typeof questionFormData.tags === 'string' ? questionFormData.tags.split(',').map(t => t.trim()) : questionFormData.tags
        };

        if (editingQuestion) {
            updateQuestion(editingQuestion.id, dataToSubmit);
        } else {
            addQuestion(dataToSubmit);
        }

        setShowQuestionModal(false);
        resetQuestionForm();
    };

    const handleOptionChange = (index, value) => {
        const newOptions = [...questionFormData.options];
        newOptions[index] = value;
        setQuestionFormData({ ...questionFormData, options: newOptions });
    };

    const toggleQuestionSelection = (questionId) => {
        const currentQuestions = newExam.questions || [];
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
    const getExamResults = (examId) => {
        return [
            { id: 1, userName: 'Sarah Johnson', score: '45/50', percentage: 90, timeTaken: '55m 30s', attemptDate: '2024-12-03' },
            { id: 2, userName: 'Michael Chen', score: '43/50', percentage: 86, timeTaken: '58m 15s', attemptDate: '2024-12-03' },
            { id: 3, userName: 'Emily Davis', score: '41/50', percentage: 82, timeTaken: '59m 45s', attemptDate: '2024-12-02' },
            { id: 4, userName: 'David Wilson', score: '39/50', percentage: 78, timeTaken: '60m 00s', attemptDate: '2024-12-02' },
            { id: 5, userName: 'Lisa Anderson', score: '37/50', percentage: 74, timeTaken: '58m 30s', attemptDate: '2024-12-01' }
        ];
    };


    return (
        <div>
            {/* Exam Categories Section */}
            <div style={{ marginBottom: '40px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--spacing-lg)' }}>
                    <h3>Exam Categories</h3>
                    <button onClick={() => setShowCategoryModal(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', backgroundColor: '#F3F4F6', color: '#374151', border: '1px solid #D1D5DB', borderRadius: 'var(--radius-md)', cursor: 'pointer' }}>
                        <Plus size={16} /> Add Category
                    </button>
                </div>
                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                    {examCategories.map(cat => (
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
                                    <span>{exam.questions.length} Questions</span>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <button onClick={() => handleViewResults(exam)} style={{ padding: '8px', border: '1px solid #10B981', borderRadius: '4px', cursor: 'pointer', color: '#10B981', background: '#F0FDF4' }}>Results</button>
                                <button onClick={() => handleEditExam(exam)} style={{ padding: '8px', border: '1px solid #E5E7EB', borderRadius: '4px', cursor: 'pointer', color: '#4B5563' }}><Edit size={18} /></button>
                                <button onClick={() => deleteExam(exam.id)} style={{ padding: '8px', border: '1px solid #FCA5A5', color: '#B91C1C', borderRadius: '4px', cursor: 'pointer', background: '#FEF2F2' }}><Trash2 size={18} /></button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Add/Edit Exam Modal */}
            <FormModal isOpen={showExamModal} onClose={() => setShowExamModal(false)} title={editingExam ? 'Edit Exam' : 'Create New Exam'} onSubmit={handleExamSubmit}>
                <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 500 }}>Exam Title *</label>
                    <input type="text" required value={newExam.title} onChange={e => setNewExam({ ...newExam, title: e.target.value })} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #D1D5DB' }} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 500 }}>Category</label>
                        <select value={newExam.category} onChange={e => setNewExam({ ...newExam, category: e.target.value })} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #D1D5DB' }}>
                            {examCategories.map(cat => (
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
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 500 }}>Passing Score (%)</label>
                    <input type="number" min="0" max="100" value={newExam.passingScore} onChange={e => setNewExam({ ...newExam, passingScore: parseInt(e.target.value) })} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #D1D5DB' }} />
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
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 500 }}>Start Date *</label>
                        <input
                            type="datetime-local"
                            required
                            value={newExam.startDate}
                            onChange={e => setNewExam({ ...newExam, startDate: e.target.value })}
                            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #D1D5DB' }}
                        />
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 500 }}>End Date *</label>
                        <input
                            type="datetime-local"
                            required
                            value={newExam.endDate}
                            onChange={e => setNewExam({ ...newExam, endDate: e.target.value })}
                            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #D1D5DB' }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 500 }}>Result Date *</label>
                        <input
                            type="datetime-local"
                            required
                            value={newExam.resultDate}
                            onChange={e => setNewExam({ ...newExam, resultDate: e.target.value })}
                            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #D1D5DB' }}
                        />
                    </div>
                </div>

                {/* Prizes Section */}
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <label style={{ fontSize: '0.9rem', fontWeight: 500 }}>Prizes ({newExam.prizes?.length || 0})</label>
                        <button
                            type="button"
                            onClick={() => {
                                const newPrize = { title: '', icon: 'gift', description: '' };
                                setNewExam({ ...newExam, prizes: [...(newExam.prizes || []), newPrize] });
                            }}
                            style={{ fontSize: '0.8rem', padding: '4px 8px', background: '#F59E0B', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                        >
                            + Add Prize
                        </button>
                    </div>
                    <div style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid #D1D5DB', borderRadius: '4px', padding: '8px', backgroundColor: '#F9FAFB' }}>
                        {newExam.prizes && newExam.prizes.length > 0 ? (
                            newExam.prizes.map((prize, idx) => (
                                <div key={`prize-${prize.title}-${idx}`} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 3fr auto', gap: '8px', marginBottom: '8px', padding: '8px', background: 'white', borderRadius: '4px' }}>
                                    <input
                                        type="text"
                                        placeholder="Prize Title"
                                        value={prize.title}
                                        onChange={e => {
                                            const updated = [...newExam.prizes];
                                            updated[idx].title = e.target.value;
                                            setNewExam({ ...newExam, prizes: updated });
                                        }}
                                        style={{ padding: '6px', border: '1px solid #D1D5DB', borderRadius: '4px', fontSize: '0.85rem' }}
                                    />
                                    <select
                                        value={prize.icon}
                                        onChange={e => {
                                            const updated = [...newExam.prizes];
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
                                            const updated = [...newExam.prizes];
                                            updated[idx].description = e.target.value;
                                            setNewExam({ ...newExam, prizes: updated });
                                        }}
                                        style={{ padding: '6px', border: '1px solid #D1D5DB', borderRadius: '4px', fontSize: '0.85rem' }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setNewExam({ ...newExam, prizes: newExam.prizes.filter((_, i) => i !== idx) });
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
                        <label style={{ fontSize: '0.9rem', fontWeight: 500 }}>Winners ({newExam.winners?.length || 0})</label>
                        <button
                            type="button"
                            onClick={() => {
                                const newWinner = { rank: (newExam.winners?.length || 0) + 1, name: '', score: '', time: '', avatar: '' };
                                setNewExam({ ...newExam, winners: [...(newExam.winners || []), newWinner] });
                            }}
                            style={{ fontSize: '0.8rem', padding: '4px 8px', background: '#10B981', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                        >
                            + Add Winner
                        </button>
                    </div>
                    <div style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid #D1D5DB', borderRadius: '4px', padding: '8px', backgroundColor: '#F9FAFB' }}>
                        {newExam.winners && newExam.winners.length > 0 ? (
                            newExam.winners.map((winner, idx) => (
                                <div key={`winner-${winner.name}-${idx}`} style={{ display: 'grid', gridTemplateColumns: '60px 2fr 1fr 1fr 2fr auto', gap: '8px', marginBottom: '8px', padding: '8px', background: 'white', borderRadius: '4px' }}>
                                    <input
                                        type="number"
                                        placeholder="Rank"
                                        value={winner.rank}
                                        onChange={e => {
                                            const updated = [...newExam.winners];
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
                                            const updated = [...newExam.winners];
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
                                            const updated = [...newExam.winners];
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
                                            const updated = [...newExam.winners];
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
                                            const updated = [...newExam.winners];
                                            updated[idx].avatar = e.target.value;
                                            setNewExam({ ...newExam, winners: updated });
                                        }}
                                        style={{ padding: '6px', border: '1px solid #D1D5DB', borderRadius: '4px', fontSize: '0.85rem' }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setNewExam({ ...newExam, winners: newExam.winners.filter((_, i) => i !== idx) });
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
                        <label style={{ fontSize: '0.9rem', fontWeight: 500 }}>Questions ({newExam.questions?.length || 0})</label>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button type="button" onClick={() => setShowSelectionModal(true)} style={{ fontSize: '0.8rem', padding: '4px 8px', background: '#F3F4F6', border: '1px solid #D1D5DB', borderRadius: '4px', cursor: 'pointer' }}>Select Existing</button>
                            <button type="button" onClick={() => { resetQuestionForm(); setShowQuestionModal(true); }} style={{ fontSize: '0.8rem', padding: '4px 8px', background: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>+ Create New</button>
                        </div>
                    </div>

                    <div style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid #D1D5DB', borderRadius: '4px', padding: '8px', backgroundColor: '#F9FAFB' }}>
                        {newExam.questions && newExam.questions.length > 0 ? (
                            questions.filter(q => newExam.questions.includes(q.id)).map(q => (
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
            </FormModal>

            {/* Question Selection Modal */}
            {showSelectionModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100 }}>
                    <div className="card" style={{ width: '600px', maxHeight: '80vh', display: 'flex', flexDirection: 'column', padding: '24px' }}>
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
            )}

            {/* Create/Edit Question Modal - Custom implementation to avoid nesting FormModal */}
            {showQuestionModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1200 }}>
                    <div className="card" style={{ width: '700px', maxHeight: '90vh', overflowY: 'auto', padding: '24px' }}>
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
                                        <option value="multiple_choice">Multiple Choice</option>
                                        <option value="true_false">True/False</option>
                                        <option value="short_answer">Short Answer</option>
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

                            {questionFormData.type === 'multiple_choice' && (
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

                            {questionFormData.type === 'true_false' && (
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

                            {questionFormData.type === 'short_answer' && (
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

                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #E5E7EB' }}>
                                <button type="button" onClick={() => setShowQuestionModal(false)} style={{ padding: '10px 20px', border: '1px solid #D1D5DB', borderRadius: '6px', background: 'white', cursor: 'pointer', fontWeight: 500 }}>Cancel</button>
                                <button type="submit" style={{ padding: '10px 20px', backgroundColor: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 500 }}>Add Question</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Add Category Modal */}
            {showCategoryModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div className="card" style={{ width: '400px', padding: '24px' }}>
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
            )}

            {/* Result Board Modal */}
            {showResultBoard && selectedExamForResults && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
                    <div className="card" style={{ width: '900px', maxHeight: '90vh', overflow: 'auto', padding: '32px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <div>
                                <h3 style={{ margin: 0, fontSize: '1.5rem' }}>Exam Results: {selectedExamForResults.title}</h3>
                                <p style={{ color: '#6B7280', marginTop: '4px' }}>Total Attempts: {getExamResults(selectedExamForResults.id).length}</p>
                            </div>
                            <button onClick={() => setShowResultBoard(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '24px', color: '#6B7280' }}><X size={24} /></button>
                        </div>

                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ backgroundColor: '#F9FAFB', borderBottom: '2px solid #E5E7EB' }}>
                                        <th style={{ padding: '12px', textAlign: 'left', fontWeight: 600, color: '#374151' }}>Rank</th>
                                        <th style={{ padding: '12px', textAlign: 'left', fontWeight: 600, color: '#374151' }}>User Name</th>
                                        <th style={{ padding: '12px', textAlign: 'left', fontWeight: 600, color: '#374151' }}>Score</th>
                                        <th style={{ padding: '12px', textAlign: 'left', fontWeight: 600, color: '#374151' }}>Percentage</th>
                                        <th style={{ padding: '12px', textAlign: 'left', fontWeight: 600, color: '#374151' }}>Time Taken</th>
                                        <th style={{ padding: '12px', textAlign: 'left', fontWeight: 600, color: '#374151' }}>Attempt Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {getExamResults(selectedExamForResults.id).map((result, idx) => (
                                        <tr key={result.id} style={{ borderBottom: '1px solid #E5E7EB' }}>
                                            <td style={{ padding: '12px' }}>
                                                <span style={{
                                                    width: '32px',
                                                    height: '32px',
                                                    borderRadius: '50%',
                                                    backgroundColor: idx === 0 ? '#F59E0B' : idx === 1 ? '#9CA3AF' : idx === 2 ? '#CD7F32' : '#F3F4F6',
                                                    color: idx < 3 ? 'white' : '#6B7280',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontWeight: 600
                                                }}>
                                                    {idx + 1}
                                                </span>
                                            </td>
                                            <td style={{ padding: '12px', fontWeight: 500 }}>{result.userName}</td>
                                            <td style={{ padding: '12px' }}>{result.score}</td>
                                            <td style={{ padding: '12px' }}>
                                                <span style={{
                                                    padding: '4px 8px',
                                                    borderRadius: '12px',
                                                    backgroundColor: result.percentage >= 80 ? '#D1FAE5' : result.percentage >= 60 ? '#FEF3C7' : '#FEE2E2',
                                                    color: result.percentage >= 80 ? '#065F46' : result.percentage >= 60 ? '#92400E' : '#991B1B',
                                                    fontSize: '0.875rem',
                                                    fontWeight: 500
                                                }}>
                                                    {result.percentage}%
                                                </span>
                                            </td>
                                            <td style={{ padding: '12px', color: '#6B7280' }}>{result.timeTaken}</td>
                                            <td style={{ padding: '12px', color: '#6B7280' }}>{result.attemptDate}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ExamManagement;
