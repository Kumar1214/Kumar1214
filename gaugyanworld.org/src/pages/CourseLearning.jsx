import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PlayCircle, CheckCircle, Lock, ChevronLeft, ChevronRight, Menu, X } from 'lucide-react';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const CourseLearning = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { currentUser, isEnrolled, updateCourseProgress } = useAuth();
    const [currentLecture, setCurrentLecture] = useState(0);
    const [showSidebar, setShowSidebar] = useState(true);
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [localCompletedLectures, setLocalCompletedLectures] = useState([]);

    // Redirect if not logged in or not enrolled
    useEffect(() => {
        if (!loading && currentUser) {
            if (!isEnrolled(id)) {
                navigate(`/courses/${id}`);
            }
        } else if (!loading && !currentUser) {
            navigate(`/login?returnUrl=/courses/${id}/learn`);
        }
    }, [currentUser, loading, id, isEnrolled, navigate]);

    // Fetch Course
    useEffect(() => {
        const fetchCourse = async () => {
            try {
                setLoading(true);
                const response = await api.get(`/courses/${id}`);
                const data = response.data.data || response.data;
                setCourse(data);
            } catch (error) {
                console.error("Error fetching course:", error);
                // navigate('/courses'); // Optional: redirect on error
            } finally {
                setLoading(false);
            }
        };
        fetchCourse();
    }, [id]);

    // Initialize completed lectures from user profile
    useEffect(() => {
        if (currentUser && currentUser.enrolledCourses) {
            const enrollment = currentUser.enrolledCourses.find(c => c.courseId == id);
            if (enrollment && enrollment.completedLectures) {
                setLocalCompletedLectures(enrollment.completedLectures);
            }
        }
    }, [currentUser, id]);

    const handleNext = () => {
        if (course && currentLecture < course.lectures.length - 1) {
            setCurrentLecture(currentLecture + 1);
        }
    };

    const handlePrevious = () => {
        if (currentLecture > 0) {
            setCurrentLecture(currentLecture - 1);
        }
    };

    const markComplete = async () => {
        if (!course) return;

        const lecture = course.lectures[currentLecture];
        // lecture might have 'id' or we use index?
        // Ideally lectures have IDs. If MOCK data had IDs 1,2,3...
        // API data should have IDs.
        const lectureId = lecture.id || currentLecture; // Fallback to index if no ID (risky)

        // Optimistic UI update
        if (!localCompletedLectures.includes(lectureId)) {
            const newCompleted = [...localCompletedLectures, lectureId];
            setLocalCompletedLectures(newCompleted);

            try {
                await updateCourseProgress(id, lectureId, course.lectures.length);
            } catch (error) {
                // Revert on failure?
                console.error("Failed to save progress", error);
            }
        }
        handleNext();
    };

    if (loading) return <div style={{ padding: '50px', color: 'white' }}>Loading course content...</div>;
    if (!course) return <div style={{ padding: '50px', color: 'white' }}>Course not found</div>;

    // Sort lectures if valid
    const lectures = course.lectures || [];
    const currentLectureData = lectures[currentLecture];

    if (!currentLectureData) return <div style={{ padding: '50px', color: 'white' }}>No lectures found</div>;

    const progress = Math.round((localCompletedLectures.length / lectures.length) * 100);

    return (
        <div style={{ display: 'flex', height: '100vh', backgroundColor: '#000' }}>

            {/* Main Content */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>

                {/* Top Bar */}
                <div style={{
                    backgroundColor: '#1F2937',
                    color: 'white',
                    padding: '16px 24px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderBottom: '1px solid #374151'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <button
                            onClick={() => navigate(`/courses/${id}`)}
                            style={{
                                padding: '8px',
                                backgroundColor: 'transparent',
                                border: '1px solid #4B5563',
                                borderRadius: '4px',
                                color: 'white',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center'
                            }}
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <div>
                            <h2 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>{course.title}</h2>
                            <div style={{ fontSize: '0.85rem', color: '#9CA3AF' }}>
                                Lecture {currentLecture + 1} of {lectures.length}
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowSidebar(!showSidebar)}
                        style={{
                            padding: '8px',
                            backgroundColor: 'transparent',
                            border: '1px solid #4B5563',
                            borderRadius: '4px',
                            color: 'white',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center'
                        }}
                    >
                        {showSidebar ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>

                {/* Video Player */}
                <div style={{ flex: 1, backgroundColor: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {currentLectureData.videoUrl ? (
                        <iframe
                            width="100%"
                            height="100%"
                            src={currentLectureData.videoUrl}
                            title={currentLectureData.title}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            style={{ maxWidth: '100%', maxHeight: '100%' }}
                        />
                    ) : (
                        <div style={{ color: '#9CA3AF' }}>No video available for this lecture</div>
                    )}
                </div>

                {/* Bottom Controls */}
                <div style={{
                    backgroundColor: '#1F2937',
                    color: 'white',
                    padding: '16px 24px',
                    borderTop: '1px solid #374151'
                }}>
                    <div style={{ marginBottom: '12px' }}>
                        <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>{currentLectureData.title}</h3>
                        <p style={{ fontSize: '0.9rem', color: '#9CA3AF' }}>{currentLectureData.description}</p>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <button
                            onClick={handlePrevious}
                            disabled={currentLecture === 0}
                            style={{
                                padding: '10px 20px',
                                backgroundColor: currentLecture === 0 ? '#374151' : '#4B5563',
                                color: currentLecture === 0 ? '#6B7280' : 'white',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: currentLecture === 0 ? 'not-allowed' : 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}
                        >
                            <ChevronLeft size={18} /> Previous
                        </button>
                        <button
                            onClick={markComplete}
                            style={{
                                padding: '10px 24px',
                                backgroundColor: '#10B981',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontWeight: 600
                            }}
                        >
                            {localCompletedLectures.includes(currentLectureData.id || currentLecture) ? 'Completed' : 'Mark Complete & Continue'}
                        </button>
                        <button
                            onClick={handleNext}
                            disabled={currentLecture === lectures.length - 1}
                            style={{
                                padding: '10px 20px',
                                backgroundColor: currentLecture === lectures.length - 1 ? '#374151' : '#4B5563',
                                color: currentLecture === lectures.length - 1 ? '#6B7280' : 'white',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: currentLecture === lectures.length - 1 ? 'not-allowed' : 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}
                        >
                            Next <ChevronRight size={18} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Sidebar - Course Content */}
            {showSidebar && (
                <div style={{
                    width: '380px',
                    backgroundColor: '#F9FAFB',
                    borderLeft: '1px solid #E5E7EB',
                    display: 'flex',
                    flexDirection: 'column',
                    maxHeight: '100vh',
                    overflowY: 'auto'
                }}>
                    <div style={{ padding: '20px', borderBottom: '1px solid #E5E7EB' }}>
                        <h3 style={{ fontSize: '1.1rem', marginBottom: '12px' }}>Course Content</h3>
                        <div style={{
                            backgroundColor: '#E5E7EB',
                            borderRadius: '8px',
                            height: '8px',
                            overflow: 'hidden',
                            marginBottom: '8px'
                        }}>
                            <div style={{
                                width: `${progress}%`,
                                height: '100%',
                                backgroundColor: '#10B981',
                                transition: 'width 0.3s'
                            }} />
                        </div>
                        <div style={{ fontSize: '0.85rem', color: '#6B7280' }}>
                            {progress}% Complete
                        </div>
                    </div>

                    <div style={{ flex: 1, overflowY: 'auto' }}>
                        {lectures.map((lecture, index) => (
                            <div
                                key={lecture.id || index}
                                onClick={() => setCurrentLecture(index)}
                                style={{
                                    padding: '16px 20px',
                                    borderBottom: '1px solid #E5E7EB',
                                    cursor: 'pointer',
                                    backgroundColor: currentLecture === index ? '#FEF3C7' : 'transparent',
                                    transition: 'background-color 0.2s'
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                                    <div style={{ marginTop: '2px' }}>
                                        {localCompletedLectures.includes(lecture.id || index) ? (
                                            <CheckCircle size={20} color="#10B981" fill="#10B981" />
                                        ) : currentLecture === index ? (
                                            <PlayCircle size={20} color="#F59E0B" />
                                        ) : (
                                            <PlayCircle size={20} color="#9CA3AF" />
                                        )}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{
                                            fontSize: '0.95rem',
                                            fontWeight: currentLecture === index ? 600 : 400,
                                            marginBottom: '4px',
                                            color: '#1F2937'
                                        }}>
                                            {index + 1}. {lecture.title}
                                        </div>
                                        <div style={{ fontSize: '0.8rem', color: '#6B7280' }}>
                                            {lecture.duration}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CourseLearning;
