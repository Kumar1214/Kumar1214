import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Save, Clock, Award } from 'lucide-react';
import RichTextEditor from '../../RichTextEditor';

const ExamQuestionForm = ({ initialData, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        text: '',
        questionType: 'essay',
        marks: 10,
        timeLimit: 15,
        difficulty: 'hard',
        categories: [],
        tags: '',
        markingScheme: '',
        referenceMaterials: []
    });

    useEffect(() => {
        if (initialData) {
            // Prevent cascading renders by checking if data actually changed
            const tags = initialData.tags?.join(', ') || '';
            setFormData(prev => {
                if (JSON.stringify(prev) === JSON.stringify({ ...initialData, tags })) {
                    return prev;
                }
                return { ...initialData, tags };
            });
        }
    }, [initialData]);

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({
            ...formData,
            type: 'exam',
            tags: formData.tags.split(',').map(t => t.trim()).filter(t => t)
        });
    };

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Question Type & Difficulty */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: '#374151' }}>Question Type</label>
                    <select
                        value={formData.questionType}
                        onChange={(e) => handleChange('questionType', e.target.value)}
                        style={{
                            width: '100%',
                            padding: '10px',
                            borderRadius: '6px',
                            border: '1px solid #D1D5DB',
                            backgroundColor: 'white'
                        }}
                    >
                        <option value="essay">Essay</option>
                        <option value="long_answer">Long Answer</option>
                        <option value="case_study">Case Study</option>
                        <option value="coding">Coding Problem</option>
                    </select>
                </div>
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
            </div>

            {/* Question Text */}
            <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: '#374151' }}>Question Text *</label>
                <RichTextEditor
                    value={formData.text}
                    onChange={(val) => handleChange('text', val)}
                    placeholder="Enter your exam question here..."
                />
            </div>

            {/* Marks & Time Limit */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: '#374151' }}>Marks</label>
                    <div style={{ position: 'relative' }}>
                        <Award size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
                        <input
                            type="number"
                            value={formData.marks}
                            onChange={(e) => handleChange('marks', parseInt(e.target.value))}
                            min="1"
                            style={{
                                width: '100%',
                                padding: '10px 12px 10px 40px',
                                borderRadius: '6px',
                                border: '1px solid #D1D5DB'
                            }}
                        />
                    </div>
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: '#374151' }}>Time Limit (Minutes)</label>
                    <div style={{ position: 'relative' }}>
                        <Clock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
                        <input
                            type="number"
                            value={formData.timeLimit}
                            onChange={(e) => handleChange('timeLimit', parseInt(e.target.value))}
                            min="1"
                            style={{
                                width: '100%',
                                padding: '10px 12px 10px 40px',
                                borderRadius: '6px',
                                border: '1px solid #D1D5DB'
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Marking Scheme */}
            <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: '#374151' }}>Marking Scheme / Rubric</label>
                <textarea
                    value={formData.markingScheme}
                    onChange={(e) => handleChange('markingScheme', e.target.value)}
                    placeholder="Describe how marks should be awarded..."
                    rows={4}
                    style={{
                        width: '100%',
                        padding: '10px',
                        borderRadius: '6px',
                        border: '1px solid #D1D5DB',
                        fontFamily: 'inherit'
                    }}
                />
            </div>

            {/* Tags */}
            <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: '#374151' }}>Tags</label>
                <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => handleChange('tags', e.target.value)}
                    placeholder="ayurveda, theory, advanced (comma separated)"
                    style={{
                        width: '100%',
                        padding: '10px',
                        borderRadius: '6px',
                        border: '1px solid #D1D5DB'
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
                        backgroundColor: '#0EA5E9',
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
                    Save Exam Question
                </button>
            </div>
        </form>
    );
};

ExamQuestionForm.propTypes = {
    initialData: PropTypes.object,
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired
};

export default ExamQuestionForm;
