import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowLeft } from 'lucide-react';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const ExamCheckout = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const [enrolling, setEnrolling] = useState(false);
    const [enrolled, setEnrolled] = useState(false);
    const [exam, setExam] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Redirect if not logged in
    useEffect(() => {
        if (!currentUser) {
            navigate(`/login?returnUrl=/checkout/exam/${id}`);
        }
    }, [currentUser, navigate, id]);

    // Fetch Exam
    useEffect(() => {
        const fetchExam = async () => {
            try {
                setLoading(true);
                const response = await api.get(`/exams/${id}`);
                const data = response.data.data || response.data;
                setExam(data);
            } catch (err) {
                console.error("Error fetching exam:", err);
                setError("Exam not found or failed to load.");
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchExam();
    }, [id]);


    const handleConfirmEnrollment = async () => {
        if (!exam) return;
        setEnrolling(true);

        try {
            // Assuming an endpoint exists or just mocking the success for now as per plan
            // await api.post('/exams/enroll', { examId: id }); 

            // For now, since backend might not have this specific endpoint, we simulate success
            // to allow access to the exam runner.
            // In a real scenario, this would be a transaction.

            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1000));

            setEnrolled(true);
        } catch (err) {
            console.error(err);
            alert(err.message || "Failed to enroll");
        } finally {
            setEnrolling(false);
        }
    };

    if (loading) {
        return <div className="container mt-lg">Loading checkout details...</div>;
    }

    if (error || !exam) {
        return (
            <div className="container mt-lg">
                <h2>{error || 'Exam not found'}</h2>
                <Button onClick={() => navigate('/exams')}>Browse Exams</Button>
            </div>
        );
    }

    if (enrolled) {
        return (
            <div className="container mt-lg" style={{ maxWidth: '600px', textAlign: 'center' }}>
                <div style={{
                    padding: 'var(--spacing-2xl)',
                    backgroundColor: '#F0FDF4',
                    borderRadius: 'var(--radius-lg)',
                    marginBottom: 'var(--spacing-xl)'
                }}>
                    <div style={{
                        width: '80px',
                        height: '80px',
                        backgroundColor: '#10B981',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto var(--spacing-lg)'
                    }}>
                        <CheckCircle size={48} color="white" />
                    </div>
                    <h1 style={{ fontSize: '2rem', marginBottom: 'var(--spacing-md)', color: '#065F46' }}>
                        Registration Successful!
                    </h1>
                    <p style={{ fontSize: '1.1rem', color: '#047857', marginBottom: 'var(--spacing-xl)' }}>
                        You've been successfully registered for <strong>{exam.title}</strong>
                    </p>
                    <div style={{ display: 'flex', gap: 'var(--spacing-md)', justifyContent: 'center' }}>
                        <Button onClick={() => navigate(`/exam/${id}/start`)}>
                            Start Exam
                        </Button>
                        <Button
                            variant="secondary"
                            onClick={() => navigate('/user-dashboard')}
                            style={{ backgroundColor: 'white', color: 'var(--color-primary)', border: '1px solid var(--color-primary)' }}
                        >
                            Go to Dashboard
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-lg" style={{ maxWidth: '800px' }}>
            <button
                onClick={() => navigate(`/exam/${id}`)}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: 'none',
                    border: 'none',
                    color: 'var(--color-primary)',
                    cursor: 'pointer',
                    marginBottom: 'var(--spacing-lg)',
                    fontSize: '1rem'
                }}
            >
                <ArrowLeft size={20} /> Back to Exam Details
            </button>

            <h1 style={{ fontSize: '2.5rem', marginBottom: 'var(--spacing-xl)' }}>Exam Checkout</h1>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-2xl)' }}>
                {/* Exam Summary */}
                <div>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: 'var(--spacing-lg)' }}>Exam Summary</h2>
                    <div className="card" style={{ padding: 'var(--spacing-lg)' }}>
                        <img
                            src={exam.image || 'https://via.placeholder.com/400x225?text=Exam'}
                            alt={exam.title}
                            style={{
                                width: '100%',
                                aspectRatio: '16/9',
                                objectFit: 'cover',
                                borderRadius: 'var(--radius-md)',
                                marginBottom: 'var(--spacing-md)'
                            }}
                        />
                        <h3 style={{ fontSize: '1.2rem', marginBottom: 'var(--spacing-sm)' }}>{exam.title}</h3>
                        <div style={{ display: 'flex', gap: 'var(--spacing-lg)', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
                            <span>⏱️ {exam.duration || 'N/A'} mins</span>
                            <span>📝 {exam.totalMarks || 'N/A'} marks</span>
                        </div>
                    </div>
                </div>

                {/* Payment Summary */}
                <div>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: 'var(--spacing-lg)' }}>Order Summary</h2>
                    <div className="card" style={{ padding: 'var(--spacing-lg)' }}>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            marginBottom: 'var(--spacing-md)',
                            paddingBottom: 'var(--spacing-md)',
                            borderBottom: '1px solid #E5E7EB'
                        }}>
                            <span>Exam Fee</span>
                            <span style={{ fontWeight: 600 }}>
                                {exam.price === 0 || !exam.price ? 'FREE' : `₹${exam.price}`}
                            </span>
                        </div>

                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            marginTop: 'var(--spacing-md)',
                            paddingTop: 'var(--spacing-md)',
                            borderTop: '2px solid #E5E7EB',
                            fontSize: '1.3rem',
                            fontWeight: 700
                        }}>
                            <span>Total</span>
                            <span style={{ color: exam.price === 0 || !exam.price ? '#10B981' : 'var(--color-primary)' }}>
                                {exam.price === 0 || !exam.price ? 'FREE' : `₹${exam.price}`}
                            </span>
                        </div>

                        <div style={{ marginTop: 'var(--spacing-xl)' }}>
                            {(exam.price === 0 || !exam.price) ? (
                                <>
                                    <Button
                                        fullWidth
                                        onClick={handleConfirmEnrollment}
                                        disabled={enrolling}
                                        style={{ marginBottom: 'var(--spacing-md)' }}
                                    >
                                        {enrolling ? 'Registering...' : 'Confirm Registration'}
                                    </Button>
                                    <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', textAlign: 'center' }}>
                                        By registering, you agree to our Terms of Service.
                                    </p>
                                </>
                            ) : (
                                <>
                                    <p style={{
                                        padding: 'var(--spacing-md)',
                                        backgroundColor: '#FEF3C7',
                                        borderRadius: 'var(--radius-md)',
                                        color: '#92400E',
                                        marginBottom: 'var(--spacing-md)',
                                        textAlign: 'center'
                                    }}>
                                        💳 Payment integration coming soon!
                                    </p>
                                    <Button fullWidth onClick={handleConfirmEnrollment}>
                                        Proceed to Pay (Demo)
                                    </Button>
                                    <p style={{ marginTop: '10px', textAlign: 'center', fontSize: '0.8em' }}>
                                        (Demo Mode: Click to simulate payment)
                                    </p>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExamCheckout;
