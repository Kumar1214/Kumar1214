import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BannerGrid = ({ featuredQuiz, featuredExam }) => {
    const navigate = useNavigate();

    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--spacing-lg)', marginBottom: 'var(--spacing-3xl)' }}>

            {/* Featured Quiz Banner */}
            <div style={{
                backgroundColor: '#FEF3C7',
                borderRadius: 'var(--radius-lg)',
                padding: 'var(--spacing-xl)',
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                minHeight: '250px'
            }}>
                <div style={{ position: 'relative', zIndex: 1 }}>
                    <span style={{
                        backgroundColor: '#F59E0B',
                        color: 'white',
                        padding: '4px 12px',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        marginBottom: 'var(--spacing-sm)',
                        display: 'inline-block'
                    }}>
                        FEATURED QUIZ
                    </span>
                    <h3 style={{ fontSize: '1.75rem', marginBottom: 'var(--spacing-sm)', color: '#78350F' }}>
                        {featuredQuiz ? featuredQuiz.title : "Test Your Knowledge"}
                    </h3>
                    <p style={{ color: '#92400E', marginBottom: 'var(--spacing-lg)' }}>
                        {featuredQuiz ? `Category: ${featuredQuiz.category}` : "Win exciting rewards by scoring 100%"}
                    </p>
                    <button
                        onClick={() => navigate(featuredQuiz ? `/quizzes/${featuredQuiz.id || featuredQuiz.id}` : '/quizzes')}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            backgroundColor: '#78350F',
                            color: 'white',
                            padding: '10px 20px',
                            borderRadius: 'var(--radius-md)',
                            border: 'none',
                            cursor: 'pointer',
                            fontWeight: 600
                        }}>
                        Start Quiz <ArrowRight size={18} />
                    </button>
                </div>
                <div style={{
                    position: 'absolute',
                    right: '-20px',
                    bottom: '-20px',
                    width: '180px',
                    height: '180px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(245, 158, 11, 0.2)'
                }}></div>
                <div style={{
                    position: 'absolute',
                    right: '20px',
                    bottom: '20px',
                    opacity: 0.1
                }}>
                    <svg width="120" height="120" viewBox="0 0 24 24" fill="currentColor"><path d="M9 11.75c-.69 0-1.25.56-1.25 1.25s.56 1.25 1.25 1.25 1.25-.56 1.25-1.25-.56-1.25-1.25-1.25zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8 0-.29.02-.58.05-.86 2.36-1.05 4.23-2.98 5.21-5.37C11.07 8.33 14.05 10 17.42 10c.78 0 1.53-.09 2.25-.26.21 1.01.33 2.05.33 3.14 0 4.41-3.59 8-8 8z" /></svg>
                </div>
            </div>

            {/* Featured Exam Banner */}
            <div style={{
                backgroundColor: '#ECFDF5',
                borderRadius: 'var(--radius-lg)',
                padding: 'var(--spacing-xl)',
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                minHeight: '250px'
            }}>
                <div style={{ position: 'relative', zIndex: 1 }}>
                    <span style={{
                        backgroundColor: '#059669',
                        color: 'white',
                        padding: '4px 12px',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        marginBottom: 'var(--spacing-sm)',
                        display: 'inline-block'
                    }}>
                        FEATURED EXAM
                    </span>
                    <h3 style={{ fontSize: '1.75rem', marginBottom: 'var(--spacing-sm)', color: '#064E3B' }}>
                        {featuredExam ? featuredExam.title : "National Exams"}
                    </h3>
                    <p style={{ color: '#065F46', marginBottom: 'var(--spacing-lg)' }}>
                        {featuredExam ? `Difficulty: ${featuredExam.difficulty}` : "Certifications for top performers."}
                    </p>
                    <button
                        onClick={() => navigate(featuredExam ? `/exams/${featuredExam.id || featuredExam.id}` : '/exams')}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            backgroundColor: '#064E3B',
                            color: 'white',
                            padding: '10px 20px',
                            borderRadius: 'var(--radius-md)',
                            border: 'none',
                            cursor: 'pointer',
                            fontWeight: 600
                        }}>
                        Register Now <ArrowRight size={18} />
                    </button>
                </div>
                <div style={{
                    position: 'absolute',
                    right: '-20px',
                    bottom: '-20px',
                    width: '180px',
                    height: '180px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(5, 150, 105, 0.2)'
                }}></div>
                <div style={{
                    position: 'absolute',
                    right: '20px',
                    bottom: '20px',
                    opacity: 0.1
                }}>
                    <svg width="120" height="120" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72l5 2.73 5-2.73v3.72z" /></svg>
                </div>
            </div>

        </div>
    );
};

export default BannerGrid;
