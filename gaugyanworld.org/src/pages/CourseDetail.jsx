import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PlayCircle, CheckCircle, Lock, FileText, Clock, Award, Share2, Bookmark } from 'lucide-react';
import Button from '../components/Button';
import YouTubeEmbed from '../components/YouTubeEmbed';

import { useAuth } from '../context/AuthContext';
import { contentService } from '../services/api';
import SEO from '../components/SEO';
import { useContext } from 'react';
import { DataContext } from '../context/DataContext';
import EngagementBar from '../components/engagement/EngagementBar';

// Dummy Course for Fallback
const DUMMY_COURSE = {
    id: 'dummy-1',
    title: 'Complete Ayurveda Certification Course',
    description: 'Master the ancient science of Ayurveda. Learn about Doshas, Dhatus, Malas, and how to maintain balance in life. This comprehensive course covers everything from basic principles to advanced treatments.',
    rating: 4.8,
    duration: '24 Weeks',
    syllabus: [
        { title: 'Introduction to Ayurveda', duration: '1h 30m', isFree: true },
        { title: 'Understanding Tridosha', duration: '2h 15m', isFree: false },
        { title: 'Dinacharya: Daily Routine', duration: '1h 45m', isFree: false },
        { title: 'Ayurvedic Dietetics', duration: '2h 30m', isFree: false },
        { title: 'Herbal Remedies', duration: '3h 00m', isFree: false }
    ],
    image: 'https://images.unsplash.com/photo-1544367563-12123d8965cd?auto=format&fit=crop&q=80&w=1000',
    price: 4999,
    originalPrice: 9999,
    previewVideo: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
};

const CourseDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { currentUser, isEnrolled } = useAuth();
    const { trackEngagement } = useContext(DataContext);
    const [showPreview, setShowPreview] = useState(false);

    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [hasTrackedView, setHasTrackedView] = useState(false);

    useEffect(() => {
        if (!id || id === 'undefined' || id === 'null') {
            navigate('/404');
            return;
        }

        const fetchCourse = async () => {
            setLoading(true);
            try {
                const response = await contentService.getCourseById(id);
                if (response.data.success && response.data.data) {
                    const data = response.data.data;

                    // Parse stringified JSON fields
                    const parseField = (field) => {
                        if (typeof field === 'string') {
                            try {
                                const parsed = JSON.parse(field);
                                return Array.isArray(parsed) ? parsed : [];
                            } catch (e) {
                                return [];
                            }
                        }
                        return Array.isArray(field) ? field : [];
                    };

                    data.syllabus = parseField(data.syllabus);
                    data.studyMaterial = parseField(data.studyMaterial);
                    data.includes = parseField(data.includes);
                    data.whatLearns = parseField(data.whatLearns);
                    data.chapters = parseField(data.chapters);
                    data.reviews = parseField(data.reviews);
                    data.faqs = parseField(data.faqs);
                    data.questions = parseField(data.questions);

                    // Handle Image if it's a stringified array
                    if (data.image && typeof data.image === 'string' && data.image.startsWith('[') && data.image.endsWith(']')) {
                        try {
                            const parsedImages = JSON.parse(data.image);
                            data.image = Array.isArray(parsedImages) && parsedImages.length > 0 ? parsedImages[0] : data.image;
                        } catch (e) {
                            console.warn('Failed to parse course image JSON', e);
                        }
                    }

                    setCourse(data);

                    // Track view once course is loaded
                    if (!hasTrackedView && data && trackEngagement) {
                        try {
                            await trackEngagement('course', id, 'view');
                        } catch (err) {
                            console.warn('Failed to track view:', err);
                        }
                        setHasTrackedView(true);
                    }
                } else {
                    // Use dummy if no data found
                    setCourse(DUMMY_COURSE);
                }
            } catch (error) {
                console.error("Error fetching course:", error);
                // Fallback to dummy data on error
                setCourse(DUMMY_COURSE);
            } finally {
                setLoading(false);
            }
        };
        fetchCourse();
    }, [id, trackEngagement, hasTrackedView]);

    const handleShare = async () => {
        try {
            if (trackEngagement) {
                await trackEngagement('course', id, 'share').catch(err => console.warn('Failed to track share:', err));
            }
            if (navigator.share) {
                await navigator.share({
                    title: course.title,
                    text: course.description,
                    url: window.location.href,
                });
            } else {
                navigator.clipboard.writeText(window.location.href);
                alert('Course link copied to clipboard!');
            }
        } catch (err) {
            console.error("Failed to share course:", err);
        }
    };

    const handleBookmark = async () => {
        try {
            if (trackEngagement) {
                await trackEngagement('course', id, 'bookmark').catch(err => console.warn('Failed to track bookmark:', err));
            }
            // Additional bookmark logic can be added here
        } catch (err) {
            console.error("Failed to bookmark course:", err);
        }
    };

    if (loading) {
        return <div className="container mt-lg" style={{ textAlign: 'center', padding: '4rem' }}>Loading course details...</div>;
    }

    if (!course) {
        return <div className="container mt-lg" style={{ textAlign: 'center', padding: '4rem' }}>Course not found</div>;
    }

    // TODO: Verify isEnrolled logic
    const userIsEnrolled = isEnrolled ? isEnrolled(course.id || course.id) : false;

    const handleEnroll = () => {
        if (!currentUser) {
            navigate(`/login?returnUrl=/courses/${id}`);
            return;
        }
        navigate(`/course-checkout/${course.id || course.id}`);
    };

    const handleStartLearning = () => {
        navigate(`/courses/${course.id || course.id}/learn`);
    };

    return (
        <div className="container mt-lg">
            {/*             <SEO
                title={course.title}
                description={course.description}
                image={course.image}
                url={`/courses/${course.id}`}
                type="article"
            /> */}
            <SEO
                title={course.title}
                description={course.description}
                image={course.image}
                url={`/courses/${course.id}`}
                type="article"
            />

            <div className="single-listing-grid-right">
                {/* Main Content */}
                <div>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: 'var(--spacing-md)', color: 'var(--color-text-main)' }}>{course.title}</h1>
                    <p style={{ fontSize: '1.1rem', color: 'var(--color-text-muted)', marginBottom: 'var(--spacing-lg)', lineHeight: 1.6 }}>
                        {course.description}
                    </p>

                    <div style={{ display: 'flex', gap: 'var(--spacing-xl)', marginBottom: 'var(--spacing-xl)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ padding: '8px', backgroundColor: '#FEF3C7', borderRadius: '50%', color: '#D97706' }}>
                                <Award size={20} />
                            </div>
                            <div>
                                <div style={{ fontWeight: 600 }}>{course.rating ? Number(course.rating).toFixed(1) : '0.0'}/5</div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Rating</div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ padding: '8px', backgroundColor: '#D1FAE5', borderRadius: '50%', color: '#059669' }}>
                                <Clock size={20} />
                            </div>
                            <div>
                                <div style={{ fontWeight: 600 }}>{course.duration || 'N/A'}</div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Duration</div>
                            </div>
                        </div>
                    </div>

                    {/* Engagement Widgets - Aligned Right & Below Rating/Duration */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '2rem' }}>
                        <EngagementBar
                            views={course.views || 0}
                            shares={course.shares || 0}
                            bookmarks={course.bookmarks || 0}
                            onShare={handleShare}
                            onBookmark={handleBookmark}
                            className="mb-8"
                            style={{ width: 'auto' }} // Ensure it doesn't take full width if flex
                        />
                    </div>

                    <div className="card" style={{ padding: 'var(--spacing-lg)', marginBottom: 'var(--spacing-2xl)' }}>
                        <h2 style={{ fontSize: '1.5rem', marginBottom: 'var(--spacing-lg)' }}>Course Syllabus</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                            {(course.syllabus || []).map((item, idx) => (
                                <div key={idx} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: 'var(--spacing-md)',
                                    backgroundColor: '#F9FAFB',
                                    borderRadius: 'var(--radius-md)',
                                    border: '1px solid #E5E7EB'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
                                        <div style={{ color: 'var(--color-text-muted)' }}>{idx + 1}</div>
                                        <div style={{ fontWeight: 500 }}>{item.title}</div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
                                        <span style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>{item.duration}</span>
                                        {item.isFree ? (
                                            <PlayCircle size={20} color="var(--color-primary)" style={{ cursor: 'pointer' }} />
                                        ) : (
                                            <Lock size={18} color="#9CA3AF" />
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div>
                    <div className="card" style={{ padding: 'var(--spacing-lg)', position: 'sticky', top: '100px' }}>
                        <div style={{
                            width: '100%',
                            aspectRatio: '16/9',
                            borderRadius: 'var(--radius-md)',
                            overflow: 'hidden',
                            marginBottom: 'var(--spacing-lg)',
                            position: 'relative',
                            cursor: course.youtubeUrl ? 'default' : 'pointer'
                        }}
                            onClick={() => !course.youtubeUrl && setShowPreview(true)}
                        >
                            {course.youtubeUrl ? (
                                <YouTubeEmbed url={course.youtubeUrl} title={course.title} />
                            ) : (
                                <>
                                    <img src={course.image || 'https://via.placeholder.com/600'} alt={course.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    <div style={{
                                        position: 'absolute',
                                        top: '0',
                                        left: '0',
                                        width: '100%',
                                        height: '100%',
                                        backgroundColor: 'rgba(0,0,0,0.3)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <PlayCircle size={48} color="white" style={{ cursor: 'pointer' }} />
                                    </div>
                                </>
                            )}
                        </div>

                        <div style={{ fontSize: '2rem', fontWeight: 700, color: course.price === 0 ? '#10B981' : 'var(--color-primary)', marginBottom: 'var(--spacing-sm)' }}>
                            {course.price === 0 ? 'FREE' : `₹${course.price}`} {course.originalPrice && <span style={{ fontSize: '1rem', textDecoration: 'line-through', color: 'var(--color-text-muted)', fontWeight: 400 }}>₹{course.originalPrice}</span>}
                        </div>

                        {userIsEnrolled ? (
                            <Button fullWidth className="mb-6 lg:mb-10" style={{ backgroundColor: '#10B981' }} onClick={handleStartLearning}>
                                Start Learning
                            </Button>
                        ) : (
                            <Button fullWidth className="mb-6 lg:mb-10" onClick={handleEnroll}>
                                {course.price === 0 ? 'Enroll for Free' : 'Enroll Now'}
                            </Button>
                        )}

                        <h3 style={{ fontSize: '1.1rem', marginBottom: 'var(--spacing-md)' }}>This course includes:</h3>
                        <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.95rem' }}>
                            <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle size={16} color="#10B981" /> 12.5 hours on-demand video</li>
                            <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle size={16} color="#10B981" /> 5 downloadable resources</li>
                            <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle size={16} color="#10B981" /> Full lifetime access</li>
                            <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle size={16} color="#10B981" /> Access on mobile and TV</li>
                            {course.finalExamId && (
                                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle size={16} color="#10B981" /> Final Certification Exam</li>
                            )}
                            <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle size={16} color="#10B981" /> Certificate of completion</li>
                        </ul>

                        {course.studyMaterial && course.studyMaterial.length > 0 && (
                            <div style={{ marginTop: 'var(--spacing-lg)', paddingTop: 'var(--spacing-md)', borderTop: '1px solid #E5E7EB' }}>
                                <h3 style={{ fontSize: '1.1rem', marginBottom: 'var(--spacing-md)' }}>Study Materials:</h3>
                                <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.95rem' }}>
                                    {course.studyMaterial.map((dm, i) => (
                                        <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <FileText size={16} color="var(--color-primary)" />
                                            <a href={dm.url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary)', textDecoration: 'none' }}>
                                                {dm.title} <span style={{ fontSize: '0.8rem', color: '#6B7280' }}>({dm.type})</span>
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Video Preview Modal */}
            {showPreview && course.previewVideo && (
                <div
                    onClick={() => setShowPreview(false)}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0,0,0,0.9)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1000,
                        padding: '20px'
                    }}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            width: '100%',
                            maxWidth: '900px',
                            backgroundColor: '#000',
                            borderRadius: '8px',
                            overflow: 'hidden',
                            position: 'relative'
                        }}
                    >
                        <button
                            onClick={() => setShowPreview(false)}
                            style={{
                                position: 'absolute',
                                top: '10px',
                                right: '10px',
                                backgroundColor: 'rgba(0,0,0,0.7)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '50%',
                                width: '40px',
                                height: '40px',
                                fontSize: '24px',
                                cursor: 'pointer',
                                zIndex: 10,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            ×
                        </button>
                        <iframe
                            width="100%"
                            height="500px"
                            src={course.previewVideo}
                            title="Course Preview"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default CourseDetail;
