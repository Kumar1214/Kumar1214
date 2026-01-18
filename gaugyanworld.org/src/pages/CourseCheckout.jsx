import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowLeft } from 'lucide-react';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const CourseCheckout = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const { currentUser, enrollCourse, isEnrolled } = useAuth();
    const [enrolling, setEnrolling] = useState(false);
    const [enrolled, setEnrolled] = useState(false);
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Redirect if not logged in
    useEffect(() => {
        if (!currentUser && !loading && !course) { // Only if not loading course initially? No, check user first.
            // Actually loading state refers to course loading.
        }
        if (!currentUser) {
            navigate(`/login?returnUrl=/course-checkout/${courseId}`);
        }
    }, [currentUser, navigate, courseId]);

    // Check enrollment status
    useEffect(() => {
        if (currentUser && isEnrolled(courseId) && !enrolled) {
            navigate(`/courses/${courseId}/learn`);
        }
    }, [currentUser, isEnrolled, courseId, navigate, enrolled]);

    // Fetch Course
    useEffect(() => {
        const fetchCourse = async () => {
            try {
                setLoading(true);
                const response = await api.get(`/courses/${courseId}`);
                // response.data could be { success: true, data: {...} } or just {...}
                const data = response.data.data || response.data;
                setCourse(data);
            } catch (err) {
                console.error("Error fetching course:", err);
                setError("Course not found or failed to load.");
            } finally {
                setLoading(false);
            }
        };
        if (courseId) fetchCourse();
    }, [courseId]);


    const handleConfirmEnrollment = async () => {
        if (!course) return;
        setEnrolling(true);

        try {
            await enrollCourse(parseInt(courseId));
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

    if (error || !course) {
        return (
            <div className="container mt-lg">
                <h2>{error || 'Course not found'}</h2>
                <Button onClick={() => navigate('/courses')}>Browse Courses</Button>
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
                        Enrollment Successful!
                    </h1>
                    <p style={{ fontSize: '1.1rem', color: '#047857', marginBottom: 'var(--spacing-xl)' }}>
                        You've been successfully enrolled in <strong>{course.title}</strong>
                    </p>
                    <div style={{ display: 'flex', gap: 'var(--spacing-md)', justifyContent: 'center' }}>
                        <Button onClick={() => navigate(`/courses/${courseId}/learn`)}>
                            Start Learning
                        </Button>
                        <Button
                            variant="secondary"
                            onClick={() => navigate('/user-dashboard')}
                            style={{ backgroundColor: 'white', color: 'var(--color-primary)', border: '1px solid var(--color-primary)' }}
                        >
                            Go to My Courses
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-lg" style={{ maxWidth: '800px' }}>
            <button
                onClick={() => navigate(`/courses/${courseId}`)}
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
                <ArrowLeft size={20} /> Back to Course
            </button>

            <h1 style={{ fontSize: '2.5rem', marginBottom: 'var(--spacing-xl)' }}>Checkout</h1>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-2xl)' }}>
                {/* Course Summary */}
                <div>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: 'var(--spacing-lg)' }}>Course Summary</h2>
                    <div className="card" style={{ padding: 'var(--spacing-lg)' }}>
                        <img
                            src={course.image || 'https://via.placeholder.com/400x225?text=Course'}
                            alt={course.title}
                            style={{
                                width: '100%',
                                aspectRatio: '16/9',
                                objectFit: 'cover',
                                borderRadius: 'var(--radius-md)',
                                marginBottom: 'var(--spacing-md)'
                            }}
                        />
                        <h3 style={{ fontSize: '1.2rem', marginBottom: 'var(--spacing-sm)' }}>{course.title}</h3>
                        <p style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--spacing-md)' }}>
                            by {course.instructor || course.instructorName || 'Instructor'}
                        </p>
                        <div style={{ display: 'flex', gap: 'var(--spacing-lg)', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
                            <span>⏱️ {course.duration || 'N/A'}</span>
                            <span>📚 {course.lectures ? course.lectures.length || course.lectures : 0} lectures</span>
                            <span>📊 {course.level || 'All Levels'}</span>
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
                            <span>Course Price</span>
                            <span style={{ fontWeight: 600 }}>
                                {course.price === 0 || !course.price ? 'FREE' : `₹${course.price}`}
                            </span>
                        </div>

                        {course.originalPrice && course.price > 0 && (
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                marginBottom: 'var(--spacing-md)',
                                color: '#10B981'
                            }}>
                                <span>Discount</span>
                                <span>-₹{course.originalPrice - course.price}</span>
                            </div>
                        )}

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
                            <span style={{ color: course.price === 0 || !course.price ? '#10B981' : 'var(--color-primary)' }}>
                                {course.price === 0 || !course.price ? 'FREE' : `₹${course.price}`}
                            </span>
                        </div>

                        <div style={{ marginTop: 'var(--spacing-xl)' }}>
                            {(course.price === 0 || !course.price) ? (
                                <>
                                    <Button
                                        fullWidth
                                        onClick={handleConfirmEnrollment}
                                        disabled={enrolling}
                                        style={{ marginBottom: 'var(--spacing-md)' }}
                                    >
                                        {enrolling ? 'Enrolling...' : 'Confirm Free Enrollment'}
                                    </Button>
                                    <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', textAlign: 'center' }}>
                                        By enrolling, you agree to our Terms of Service and Privacy Policy
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
                                    <Button fullWidth disabled>
                                        Proceed to Payment
                                    </Button>
                                    <p style={{ marginTop: '10px', textAlign: 'center', fontSize: '0.8em' }}>
                                        (Paid courses not yet enabled in this demo)
                                    </p>
                                </>
                            )}
                        </div>

                        <div style={{ marginTop: 'var(--spacing-lg)', padding: 'var(--spacing-md)', backgroundColor: '#F9FAFB', borderRadius: 'var(--radius-md)' }}>
                            <h4 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: 'var(--spacing-sm)' }}>
                                What you'll get:
                            </h4>
                            <ul style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', paddingLeft: '20px' }}>
                                <li>Full lifetime access</li>
                                <li>Access on mobile and desktop</li>
                                <li>Certificate of completion</li>
                                <li>Direct instructor support</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseCheckout;
