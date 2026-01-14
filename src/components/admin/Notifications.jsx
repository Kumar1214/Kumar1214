import React, { useState } from 'react';
import { Bell, Send, Users, Filter, Calendar, CheckCircle, AlertCircle } from 'lucide-react';

const Notifications = () => {
    const [activeTab, setActiveTab] = useState('send');
    const [notificationType, setNotificationType] = useState('all');
    const [selectedUsers, setSelectedUsers] = useState('all');
    
    const [notification, setNotification] = useState({
        title: '',
        message: '',
        type: 'info',
        targetAudience: 'all',
        scheduledDate: '',
        priority: 'normal'
    });

    // Mock notification history
    const notificationHistory = [
        {
            id: 1,
            title: 'New Course Launch: Advanced Ayurveda',
            message: 'Check out our latest course on Advanced Ayurvedic Practices',
            type: 'info',
            recipients: 'all_users',
            sentAt: '2024-11-20T10:30:00Z',
            status: 'sent',
            opened: 1245,
            clicked: 678
        },
        {
            id: 2,
            title: 'Flash Sale: 50% Off All Products',
            message: 'Limited time offer on all Ayurvedic products',
            type: 'promotion',
            recipients: 'subscribers',
            sentAt: '2024-11-18T14:15:00Z',
            status: 'sent',
            opened: 2890,
            clicked: 1456
        },
        {
            id: 3,
            title: 'System Maintenance Notice',
            message: 'Platform will be under maintenance on Nov 25th',
            type: 'warning',
            recipients: 'all_users',
            sentAt: '2024-11-15T09:00:00Z',
            status: 'sent',
            opened: 3456,
            clicked: 234
        }
    ];

    const handleSendNotification = (e) => {
        e.preventDefault();
        if (!notification.title || !notification.message) {
            alert('Please fill in all required fields');
            return;
        }
        alert('Notification sent successfully!');
        setNotification({
            title: '',
            message: '',
            type: 'info',
            targetAudience: 'all',
            scheduledDate: '',
            priority: 'normal'
        });
    };

    return (
        <div>
            {/* Header */}
            <div style={{ marginBottom: '30px' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1F2937', marginBottom: '8px' }}>
                    Notifications & Communication
                </h2>
                <p style={{ color: '#6B7280' }}>
                    Send notifications and manage communication with your users
                </p>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '30px', borderBottom: '2px solid #F3F4F6' }}>
                <button
                    onClick={() => setActiveTab('send')}
                    style={{
                        padding: '12px 24px',
                        border: 'none',
                        backgroundColor: 'transparent',
                        color: activeTab === 'send' ? '#4F46E5' : '#6B7280',
                        borderBottom: activeTab === 'send' ? '2px solid #4F46E5' : 'none',
                        marginBottom: '-2px',
                        cursor: 'pointer',
                        fontWeight: activeTab === 'send' ? 600 : 400,
                        fontSize: '0.95rem'
                    }}
                >
                    Send Notification
                </button>
                <button
                    onClick={() => setActiveTab('history')}
                    style={{
                        padding: '12px 24px',
                        border: 'none',
                        backgroundColor: 'transparent',
                        color: activeTab === 'history' ? '#4F46E5' : '#6B7280',
                        borderBottom: activeTab === 'history' ? '2px solid #4F46E5' : 'none',
                        marginBottom: '-2px',
                        cursor: 'pointer',
                        fontWeight: activeTab === 'history' ? 600 : 400,
                        fontSize: '0.95rem'
                    }}
                >
                    Notification History
                </button>
                <button
                    onClick={() => setActiveTab('settings')}
                    style={{
                        padding: '12px 24px',
                        border: 'none',
                        backgroundColor: 'transparent',
                        color: activeTab === 'settings' ? '#4F46E5' : '#6B7280',
                        borderBottom: activeTab === 'settings' ? '2px solid #4F46E5' : 'none',
                        marginBottom: '-2px',
                        cursor: 'pointer',
                        fontWeight: activeTab === 'settings' ? 600 : 400,
                        fontSize: '0.95rem'
                    }}
                >
                    Settings
                </button>
            </div>

            {/* Send Notification Tab */}
            {activeTab === 'send' && (
                <div className="card" style={{ padding: '30px', borderRadius: '8px', backgroundColor: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                    <form onSubmit={handleSendNotification}>
                        <div style={{ display: 'grid', gap: '20px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 500 }}>
                                    Notification Title *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={notification.title}
                                    onChange={(e) => setNotification({ ...notification, title: e.target.value })}
                                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #D1D5DB', fontSize: '0.95rem' }}
                                    placeholder="Enter notification title"
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 500 }}>
                                    Message *
                                </label>
                                <textarea
                                    required
                                    value={notification.message}
                                    onChange={(e) => setNotification({ ...notification, message: e.target.value })}
                                    rows={4}
                                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #D1D5DB', fontSize: '0.95rem', fontFamily: 'inherit', resize: 'vertical' }}
                                    placeholder="Enter notification message"
                                />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 500 }}>
                                        Notification Type
                                    </label>
                                    <select
                                        value={notification.type}
                                        onChange={(e) => setNotification({ ...notification, type: e.target.value })}
                                        style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #D1D5DB', fontSize: '0.95rem' }}
                                    >
                                        <option value="info">Information</option>
                                        <option value="success">Success</option>
                                        <option value="warning">Warning</option>
                                        <option value="promotion">Promotion</option>
                                        <option value="announcement">Announcement</option>
                                    </select>
                                </div>

                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 500 }}>
                                        Target Audience
                                    </label>
                                    <select
                                        value={notification.targetAudience}
                                        onChange={(e) => setNotification({ ...notification, targetAudience: e.target.value })}
                                        style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #D1D5DB', fontSize: '0.95rem' }}
                                    >
                                        <option value="all">All Users</option>
                                        <option value="students">Students Only</option>
                                        <option value="instructors">Instructors Only</option>
                                        <option value="vendors">Vendors Only</option>
                                        <option value="subscribers">Subscribers Only</option>
                                    </select>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 500 }}>
                                        Priority
                                    </label>
                                    <select
                                        value={notification.priority}
                                        onChange={(e) => setNotification({ ...notification, priority: e.target.value })}
                                        style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #D1D5DB', fontSize: '0.95rem' }}
                                    >
                                        <option value="low">Low</option>
                                        <option value="normal">Normal</option>
                                        <option value="high">High</option>
                                        <option value="urgent">Urgent</option>
                                    </select>
                                </div>

                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 500 }}>
                                        Schedule (Optional)
                                    </label>
                                    <input
                                        type="datetime-local"
                                        value={notification.scheduledDate}
                                        onChange={(e) => setNotification({ ...notification, scheduledDate: e.target.value })}
                                        style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #D1D5DB', fontSize: '0.95rem' }}
                                    />
                                </div>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
                                <button
                                    type="button"
                                    onClick={() => setNotification({
                                        title: '',
                                        message: '',
                                        type: 'info',
                                        targetAudience: 'all',
                                        scheduledDate: '',
                                        priority: 'normal'
                                    })}
                                    style={{ padding: '10px 20px', border: '1px solid #D1D5DB', borderRadius: '6px', backgroundColor: 'white', cursor: 'pointer', fontSize: '0.95rem' }}
                                >
                                    Reset
                                </button>
                                <button
                                    type="submit"
                                    style={{ padding: '10px 24px', backgroundColor: '#4F46E5', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.95rem', fontWeight: 500 }}
                                >
                                    <Send size={18} /> Send Notification
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            )}

            {/* Notification History Tab */}
            {activeTab === 'history' && (
                <div>
                    {/* Filters */}
                    <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
                        <select
                            value={notificationType}
                            onChange={(e) => setNotificationType(e.target.value)}
                            style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #D1D5DB', fontSize: '0.9rem' }}
                        >
                            <option value="all">All Types</option>
                            <option value="info">Information</option>
                            <option value="success">Success</option>
                            <option value="warning">Warning</option>
                            <option value="promotion">Promotion</option>
                        </select>

                        <select
                            value={selectedUsers}
                            onChange={(e) => setSelectedUsers(e.target.value)}
                            style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #D1D5DB', fontSize: '0.9rem' }}
                        >
                            <option value="all">All Users</option>
                            <option value="students">Students</option>
                            <option value="instructors">Instructors</option>
                            <option value="vendors">Vendors</option>
                        </select>
                    </div>

                    {/* Notification List */}
                    <div style={{ display: 'grid', gap: '16px' }}>
                        {notificationHistory.map((notif) => (
                            <div key={notif.id} className="card" style={{ padding: '20px', borderRadius: '8px', backgroundColor: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                                            <h4 style={{ fontSize: '1.1rem', fontWeight: 600 }}>{notif.title}</h4>
                                            <span style={{
                                                padding: '4px 12px',
                                                borderRadius: '16px',
                                                fontSize: '0.75rem',
                                                fontWeight: 500,
                                                backgroundColor: notif.type === 'info' ? '#EFF6FF' :
                                                    notif.type === 'success' ? '#ECFDF5' :
                                                    notif.type === 'warning' ? '#FEF3C7' : '#F3E8FF',
                                                color: notif.type === 'info' ? '#1E40AF' :
                                                    notif.type === 'success' ? '#065F46' :
                                                    notif.type === 'warning' ? '#92400E' : '#6B21A8'
                                            }}>
                                                {notif.type}
                                            </span>
                                        </div>
                                        <p style={{ color: '#6B7280', fontSize: '0.95rem', marginBottom: '12px' }}>{notif.message}</p>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '0.85rem', color: '#9CA3AF' }}>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                <Calendar size={14} /> {new Date(notif.sentAt).toLocaleString()}
                                            </span>
                                            <span>•</span>
                                            <span>{notif.opened} opened</span>
                                            <span>•</span>
                                            <span>{notif.clicked} clicked</span>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <CheckCircle size={20} style={{ color: '#10B981' }} />
                                        <span style={{ fontSize: '0.85rem', color: '#10B981', fontWeight: 500 }}>Sent</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
                <div className="card" style={{ padding: '30px', borderRadius: '8px', backgroundColor: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '20px' }}>Notification Settings</h3>
                    
                    <div style={{ display: 'grid', gap: '20px' }}>
                        <div style={{ padding: '16px', backgroundColor: '#F9FAFB', borderRadius: '6px' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                                <input type="checkbox" defaultChecked style={{ width: '18px', height: '18px' }} />
                                <div>
                                    <div style={{ fontWeight: 500, marginBottom: '4px' }}>Email Notifications</div>
                                    <div style={{ fontSize: '0.85rem', color: '#6B7280' }}>Send notifications via email to users</div>
                                </div>
                            </label>
                        </div>

                        <div style={{ padding: '16px', backgroundColor: '#F9FAFB', borderRadius: '6px' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                                <input type="checkbox" defaultChecked style={{ width: '18px', height: '18px' }} />
                                <div>
                                    <div style={{ fontWeight: 500, marginBottom: '4px' }}>Push Notifications</div>
                                    <div style={{ fontSize: '0.85rem', color: '#6B7280' }}>Send push notifications to mobile app users</div>
                                </div>
                            </label>
                        </div>

                        <div style={{ padding: '16px', backgroundColor: '#F9FAFB', borderRadius: '6px' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                                <input type="checkbox" style={{ width: '18px', height: '18px' }} />
                                <div>
                                    <div style={{ fontWeight: 500, marginBottom: '4px' }}>SMS Notifications</div>
                                    <div style={{ fontSize: '0.85rem', color: '#6B7280' }}>Send notifications via SMS (additional charges may apply)</div>
                                </div>
                            </label>
                        </div>

                        <div style={{ padding: '16px', backgroundColor: '#F9FAFB', borderRadius: '6px' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                                <input type="checkbox" defaultChecked style={{ width: '18px', height: '18px' }} />
                                <div>
                                    <div style={{ fontWeight: 500, marginBottom: '4px' }}>In-App Notifications</div>
                                    <div style={{ fontSize: '0.85rem', color: '#6B7280' }}>Show notifications within the application</div>
                                </div>
                            </label>
                        </div>
                    </div>

                    <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid #E5E7EB' }}>
                        <button style={{ padding: '10px 24px', backgroundColor: '#4F46E5', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.95rem', fontWeight: 500 }}>
                            Save Settings
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Notifications;
