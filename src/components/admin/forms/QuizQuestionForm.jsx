import React, { useState, useEffect } from 'react';
import { Save, X, Plus, Trash2 } from 'lucide-react';
import RichTextEditor from '../../RichTextEditor';

const QuizQuestionForm = ({ initialData, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        text: '',
        options: ['', '', '', ''],
        correctAnswer: 0,
        difficulty: 'medium',
        categories: [],
        tags: '',
        explanation: ''
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                ...initialData,
                tags: initialData.tags?.join(', ') || ''
            });
        }
    }, [initialData]);

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleOptionChange = (index, value) => {
        const newOptions = [...formData.options];
        newOptions[index] = value;
        setFormData(prev => ({ ...prev, options: newOptions }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({
            ...formData,
            type: 'quiz',
            questionType: 'multiple_choice',
            tags: formData.tags.split(',').map(t => t.trim()).filter(t => t)
        });
    };

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Question Text */}
            <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: '#374151' }}>Question Text *</label>
                <RichTextEditor
                    value={formData.text}
                    onChange={(val) => handleChange('text', val)}
                    placeholder="Enter your question here..."
                />
            </div>

            {/* Options */}
            <div>
                <label style={{ display: 'block', marginBottom: '12px', fontWeight: 500, color: '#374151' }}>Options *</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {formData.options.map((option, index) => (
                        <div key={index} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                            <input
                                type="radio"
                                name="correctAnswer"
                                checked={formData.correctAnswer === index}
                                onChange={() => handleChange('correctAnswer', index)}
                                style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                            />
                            <input
                                type="text"
                                value={option}
                                onChange={(e) => handleOptionChange(index, e.target.value)}
                                placeholder={`Option ${index + 1}`}
                                required
                                style={{
                                    flex: 1,
                                    padding: '10px',
                                    borderRadius: '6px',
                                    border: '1px solid #D1D5DB',
                                    fontSize: '0.95rem'
                                }}
                            />
                        </div>
                    ))}
                </div>
                <p style={{ fontSize: '0.8rem', color: '#6B7280', marginTop: '8px' }}>Select the radio button to mark the correct answer.</p>
            </div>

            {/* Metadata Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: '#374151' }}>Difficulty</label>
                    <select
                        value={formData.difficulty}
                        onChange={(e) => handleChange('difficulty', e.target.value)}
                        style={{
                            width: '100%',
                            padding: '10px',
                            borderRadius: '6px',
                            border: '1px solid #D1D5DB',
                            backgroundColor: 'white'
                        }}
                    >
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                    </select>
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: '#374151' }}>Tags</label>
                    <input
                        type="text"
                        value={formData.tags}
                        onChange={(e) => handleChange('tags', e.target.value)}
                        placeholder="yoga, basics, breathing (comma separated)"
                        style={{
                            width: '100%',
                            padding: '10px',
                            borderRadius: '6px',
                            border: '1px solid #D1D5DB'
                        }}
                    />
                </div>
            </div>

            {/* Explanation */}
            <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: '#374151' }}>Explanation (Optional)</label>
                <textarea
                    value={formData.explanation}
                    onChange={(e) => handleChange('explanation', e.target.value)}
                    placeholder="Explain why this is the correct answer..."
                    rows={3}
                    style={{
                        width: '100%',
                        padding: '10px',
                        borderRadius: '6px',
                        border: '1px solid #D1D5DB',
                        fontFamily: 'inherit'
                    }}
                />
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #E5E7EB' }}>
                <button
                    type="button"
                    onClick={onCancel}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: 'white',
                        border: '1px solid #D1D5DB',
                        borderRadius: '6px',
                        color: '#374151',
                        cursor: 'pointer',
                        fontWeight: 500
                    }}
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    style={{
                        padding: '10px 24px',
                        backgroundColor: '#4F46E5',
                        border: 'none',
                        borderRadius: '6px',
                        color: 'white',
                        cursor: 'pointer',
                        fontWeight: 500,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}
                >
                    <Save size={18} />
                    Save Question
                </button>
            </div>
        </form>
    );
};

export default QuizQuestionForm;
