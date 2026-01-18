import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, Star, Send } from 'lucide-react';
import Button from '../components/Button';
import { feedbackService } from '../services/api';

const Feedback = () => {
    const navigate = useNavigate();
    const [submitted, setSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        category: 'general',
        rating: 0,
        subject: '',
        message: ''
    });

    const categories = [
        { value: 'general', label: 'General Feedback' },
        { value: 'bug', label: 'Bug Report' },
        { value: 'feature', label: 'Feature Request' },
        { value: 'course', label: 'Course Related' },
        { value: 'technical', label: 'Technical Issue' },
        { value: 'other', label: 'Other' }
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await feedbackService.submitFeedback(formData);
            setSubmitted(true);
            setTimeout(() => {
                navigate('/');
            }, 3000);
        } catch (error) {
            console.error('Feedback submission failed:', error);
            // Optionally show error toast if you had toast imported, 
            // but for now we just log it as per existing style or add alert
            alert('Failed to submit feedback. Please try again.');
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    if (submitted) {
        return (
            <div className="container mt-lg" style={{ maxWidth: '600px', textAlign: 'center', padding: '4rem 0' }}>
                <div style={{ fontSize: '4rem', marginBottom: 'var(--spacing-lg)' }}>✅</div>
                <h2 style={{ fontSize: '2rem', marginBottom: 'var(--spacing-md)' }}>Thank You!</h2>
                <p style={{ fontSize: '1.1rem', color: 'var(--color-text-muted)', marginBottom: 'var(--spacing-lg)' }}>
                    Your feedback has been submitted successfully. Our team will review it shortly.
                </p>
                <p style={{ color: 'var(--color-text-muted)' }}>Redirecting to home page...</p>
            </div>
        );
    }

    return (
        <div className="container mt-lg" style={{ maxWidth: '800px', margin: '0 auto', padding: 'var(--spacing-3xl) var(--spacing-lg)' }}>
            <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-3xl)' }}>
                <MessageSquare size={48} color="var(--color-primary)" style={{ margin: '0 auto var(--spacing-md)' }} />
                <h1 style={{ fontSize: '2.5rem', marginBottom: 'var(--spacing-sm)' }}>Send Us Your Feedback</h1>
                <p style={{ fontSize: '1.1rem', color: 'var(--color-text-muted)' }}>
                    We value your opinion! Help us improve by sharing your thoughts.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="card" style={{ padding: 'var(--spacing-2xl)' }}>
                {/* Name & Email */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-lg)', marginBottom: 'var(--spacing-lg)' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Name *</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            placeholder="Your name"
                            style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid #E5E7EB' }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Email *</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="your@email.com"
                            style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid #E5E7EB' }}
                        />
                    </div>
                </div>

                {/* Category */}
                <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Category *</label>
                    <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        required
                        style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid #E5E7EB' }}
                    >
                        {categories.map(cat => (
                            <option key={cat.value} value={cat.value}>{cat.label}</option>
                        ))}
                    </select>
                </div>

                {/* Rating */}
                <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Overall Rating *</label>
                    <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
                        {[1, 2, 3, 4, 5].map(star => (
                            <Star
                                key={star}
                                size={32}
                                fill={star <= formData.rating ? '#F59E0B' : 'none'}
                                color={star <= formData.rating ? '#F59E0B' : '#D1D5DB'}
                                style={{ cursor: 'pointer' }}
                                onClick={() => setFormData({ ...formData, rating: star })}
                            />
                        ))}
                        <span style={{ marginLeft: 'var(--spacing-md)', color: 'var(--color-text-muted)' }}>
                            {formData.rating > 0 ? `${formData.rating} star${formData.rating > 1 ? 's' : ''}` : 'Select rating'}
                        </span>
                    </div>
                </div>

                {/* Subject */}
                <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Subject *</label>
                    <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        placeholder="Brief summary of your feedback"
                        style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid #E5E7EB' }}
                    />
                </div>

                {/* Message */}
                <div style={{ marginBottom: 'var(--spacing-xl)' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Message *</label>
                    <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        placeholder="Please provide detailed feedback..."
                        rows={6}
                        style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid #E5E7EB', resize: 'vertical' }}
                    />
                </div>

                {/* Submit Button */}
                <Button type="submit" fullWidth style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <Send size={18} />
                    Submit Feedback
                </Button>
            </form>
        </div>
    );
};

export default Feedback;
