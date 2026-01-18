import React, { useState, useEffect } from 'react';
import { useData } from '../context/useData';
import { PlayCircle, User, CheckCircle, BookOpen, MessageCircle, X, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import UserDashboardLayout from '../layout/UserDashboardLayout';
import Button from '../components/Button';
import api from '../utils/api';
import { getImageUrl, handleImgError } from '../utils/imageHelper';

const MyCourses = () => {
    // const { courses } = useData(); // Global courses not needed for this specific view if we fetch direct
    const navigate = useNavigate();
    const [showMessageModal, setShowMessageModal] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [messageText, setMessageText] = useState('');

    const [enrolledCourses, setEnrolledCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch Enrolled Courses
    useEffect(() => {
        const fetchMyCourses = async () => {
            try {
                const { data } = await api.get('/users/my-courses');
                setEnrolledCourses(data);
            } catch (err) {
                console.error("Failed to fetch my courses", err);
            } finally {
                setLoading(false);
            }
        };
        fetchMyCourses();
    }, []);

    const handleChatClick = (e, course) => {
        e.stopPropagation();
        setSelectedCourse(course);
        setShowMessageModal(true);
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        try {
            await api.post('/messages', {
                receiverId: selectedCourse.instructorId || 1,
                courseId: selectedCourse.id,
                message: messageText
            });
            alert('Message sent to instructor!');
            setShowMessageModal(false);
            setMessageText('');
        } catch (err) {
            console.error("Failed to send message", err);
            alert('Failed to send message.');
        }
    };

    if (loading) {
        return (
            <UserDashboardLayout title="My Learning" subtitle="Resume where you left off">
                <div className="flex items-center justify-center p-12">
                    <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            </UserDashboardLayout>
        );
    }

    return (
        <UserDashboardLayout title="My Learning" subtitle="Resume where you left off">
            {enrolledCourses.length > 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
                    {enrolledCourses.map(course => (
                        <div key={course.id} style={{
                            backgroundColor: 'white',
                            borderRadius: '16px',
                            border: '1px solid #E5E7EB',
                            overflow: 'hidden',
                            display: 'flex',
                            flexDirection: 'column',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                            transition: 'transform 0.2s',
                            cursor: 'pointer',
                            position: 'relative'
                        }}
                            className="group"
                            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
                            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                            onClick={() => navigate(`/courses/${course.id}/learn`)}
                        >
                            <div style={{ position: 'relative', height: '180px' }}>
                                <img
                                    src={getImageUrl(course.image)}
                                    alt={course.title}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    onError={handleImgError}
                                />
                                <div style={{
                                    position: 'absolute',
                                    inset: 0,
                                    backgroundColor: 'rgba(0,0,0,0.3)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    opacity: 0,
                                    transition: 'opacity 0.2s',
                                }}
                                    className="hover-overlay"
                                >
                                    <button style={{
                                        backgroundColor: 'white',
                                        color: '#EA580C',
                                        padding: '10px 24px',
                                        borderRadius: '24px',
                                        border: 'none',
                                        fontWeight: 600,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        cursor: 'pointer'
                                    }}>
                                        <PlayCircle size={20} /> Resume
                                    </button>
                                </div>
                                <style>{`
                                    .group:hover .hover-overlay { opacity: 1 !important; }
                                `}</style>
                            </div>

                            <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '8px', color: '#1F2937', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', height: '2.8rem' }}>
                                    {course.title}
                                </h3>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6B7280', fontSize: '0.9rem' }}>
                                        <User size={16} />
                                        <span>{course.instructor}</span>
                                    </div>
                                    <button
                                        onClick={(e) => handleChatClick(e, course)}
                                        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
                                        title="Chat with Instructor"
                                    >
                                        <MessageCircle size={18} />
                                    </button>
                                </div>

                                <div style={{ marginTop: 'auto' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem' }}>
                                        <span style={{ fontWeight: 500, color: '#374151' }}>Progress</span>
                                        <span style={{ fontWeight: 600, color: course.progress >= 100 ? '#10B981' : '#EA580C' }}>{course.progress}%</span>
                                    </div>
                                    <div style={{ height: '8px', backgroundColor: '#F3F4F6', borderRadius: '4px', overflow: 'hidden' }}>
                                        <div style={{
                                            width: `${Math.min(course.progress, 100)}%`,
                                            height: '100%',
                                            backgroundColor: course.progress >= 100 ? '#10B981' : '#EA580C',
                                            borderRadius: '4px'
                                        }} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: 'white', borderRadius: '16px', border: '1px dashed #D1D5DB' }}>
                    <BookOpen size={48} color="#D1D5DB" style={{ marginBottom: '16px' }} />
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>No courses enrolled yet</h3>
                    <p style={{ color: '#6B7280', marginBottom: '24px' }}>Start your learning journey today with our expert-led courses.</p>
                    <button
                        onClick={() => navigate('/courses')}
                        style={{
                            padding: '12px 24px',
                            backgroundColor: '#EA580C',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}
                    >
                        Browse Courses
                    </button>
                </div>
            )}

            {/* MESSAGE MODAL */}
            {showMessageModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
                        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h3 className="font-bold text-gray-800">Ask Instructor</h3>
                            <button onClick={() => setShowMessageModal(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
                        </div>
                        <div className="p-6">
                            <p className="text-sm text-gray-500 mb-4">
                                Sending message to <strong>{selectedCourse?.instructor}</strong> regarding <strong>{selectedCourse?.title}</strong>.
                            </p>
                            <textarea
                                value={messageText}
                                onChange={e => setMessageText(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg p-3 h-32 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none"
                                placeholder="Type your question here..."
                            />
                            <div className="flex justify-end gap-3 mt-4">
                                <Button onClick={() => setShowMessageModal(false)} className="!bg-gray-100 !text-gray-700">Cancel</Button>
                                <Button onClick={handleSendMessage} className="bg-indigo-600 text-white flex gap-2 items-center"><Send size={16} /> Send Message</Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </UserDashboardLayout>
    );
};

export default MyCourses;
