import React from 'react';
import { MoreVertical, Edit, Trash2, Copy, Eye, Clock, Award, BookOpen, FileQuestion } from 'lucide-react';

const QuestionCard = ({ question, onEdit, onDelete, onDuplicate }) => {
    const getDifficultyColor = (difficulty) => {
        switch (difficulty?.toLowerCase()) {
            case 'easy': return { bg: '#D1FAE5', text: '#059669' };
            case 'medium': return { bg: '#FEF3C7', text: '#D97706' };
            case 'hard': return { bg: '#FEE2E2', text: '#DC2626' };
            default: return { bg: '#F3F4F6', text: '#6B7280' };
        }
    };

    const getTypeColor = (type) => {
        return type === 'quiz' ? { bg: '#EEF2FF', text: '#4F46E5' } : { bg: '#E0F2FE', text: '#0EA5E9' };
    };

    const difficultyStyle = getDifficultyColor(question.difficulty);
    const typeStyle = getTypeColor(question.type);

    return (
        <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            border: '1px solid #E5E7EB',
            transition: 'all 0.2s',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
        }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span style={{
                        backgroundColor: typeStyle.bg,
                        color: typeStyle.text,
                        padding: '4px 8px',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                    }}>
                        {question.type === 'quiz' ? <BookOpen size={12} /> : <FileQuestion size={12} />}
                        {question.questionType?.replace('_', ' ')}
                    </span>
                    <span style={{
                        backgroundColor: difficultyStyle.bg,
                        color: difficultyStyle.text,
                        padding: '4px 8px',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        textTransform: 'uppercase'
                    }}>
                        {question.difficulty}
                    </span>
                </div>

                <div className="dropdown" style={{ position: 'relative' }}>
                    <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: '#9CA3AF' }}>
                        <MoreVertical size={20} />
                    </button>
                    {/* Dropdown content would go here, or we can use direct buttons for now */}
                </div>
            </div>

            {/* Question Text */}
            <div>
                <h3 style={{
                    fontSize: '1rem',
                    fontWeight: 600,
                    color: '#1F2937',
                    marginBottom: '8px',
                    lineHeight: '1.5',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                }}>
                    {question.text}
                </h3>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {question.categories?.map((cat, idx) => (
                        <span key={idx} style={{ fontSize: '0.75rem', color: '#6B7280', backgroundColor: '#F3F4F6', padding: '2px 8px', borderRadius: '12px' }}>
                            {cat}
                        </span>
                    ))}
                </div>
            </div>

            {/* Footer Info */}
            <div style={{
                marginTop: 'auto',
                paddingTop: '16px',
                borderTop: '1px solid #F3F4F6',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '0.875rem',
                color: '#6B7280'
            }}>
                <div style={{ display: 'flex', gap: '12px' }}>
                    {question.type === 'exam' && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Award size={14} /> {question.marks} Marks
                        </span>
                    )}
                    {question.timeLimit && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Clock size={14} /> {question.timeLimit}m
                        </span>
                    )}
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                        onClick={() => onEdit(question)}
                        style={{ padding: '6px', borderRadius: '6px', border: 'none', backgroundColor: '#F3F4F6', color: '#4B5563', cursor: 'pointer' }}
                        title="Edit"
                    >
                        <Edit size={16} />
                    </button>
                    <button
                        onClick={() => onDuplicate(question)}
                        style={{ padding: '6px', borderRadius: '6px', border: 'none', backgroundColor: '#F3F4F6', color: '#4B5563', cursor: 'pointer' }}
                        title="Duplicate"
                    >
                        <Copy size={16} />
                    </button>
                    <button
                        onClick={() => onDelete(question.id)}
                        style={{ padding: '6px', borderRadius: '6px', border: 'none', backgroundColor: '#FEE2E2', color: '#EF4444', cursor: 'pointer' }}
                        title="Delete"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default QuestionCard;
