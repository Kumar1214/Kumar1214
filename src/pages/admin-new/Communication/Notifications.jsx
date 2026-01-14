import React, { useState, useEffect } from 'react';
import { Bell, CheckCircle, Info, AlertTriangle, AlertCircle, Clock } from 'lucide-react';
import { notificationService } from '../../../services/api';
import toast from 'react-hot-toast';

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchNotifications = async () => {
        setLoading(true);
        try {
            const response = await notificationService.getAll();
            if (response.data.success) {
                setNotifications(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const markAsRead = async (id) => {
        try {
            const response = await notificationService.markRead(id);
            if (response.data.success) {
                setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
                toast.success('Marked as read');
            }
        } catch {
            toast.error('Failed to update status');
        }
    };

    const markAllRead = async () => {
        try {
            const response = await notificationService.markAllRead();
            if (response.data.success) {
                setNotifications(prev => prev.map(n => ({ ...n, read: true })));
                toast.success('All marked as read');
            }
        } catch {
            toast.error('Failed to update status');
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case 'success': return <CheckCircle className="text-green-500" />;
            case 'warning': return <AlertTriangle className="text-yellow-500" />;
            case 'error': return <AlertCircle className="text-red-500" />;
            default: return <Info className="text-blue-500" />;
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-[#0c2d50]">Notifications</h2>
                    <p className="text-gray-500 mt-1">System alerts and user activities</p>
                </div>
                <button
                    onClick={markAllRead}
                    disabled={notifications.every(n => n.read)}
                    className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Mark All as Read
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="p-12 text-center text-gray-500 flex flex-col items-center">
                        <Bell size={48} className="mb-4 opacity-20" />
                        <p>No notifications yet</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {notifications.map((notification) => (
                            <div
                                key={notification.id}
                                className={`p-4 flex gap-4 transition-colors ${notification.read ? 'bg-white' : 'bg-blue-50/50'}`}
                            >
                                <div className="mt-1">
                                    {getIcon(notification.type)}
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <h3 className={`text-sm ${notification.read ? 'font-medium text-gray-900' : 'font-bold text-gray-900'}`}>
                                            {notification.message}
                                        </h3>
                                        <span className="text-xs text-gray-400 flex items-center gap-1 whitespace-nowrap">
                                            <Clock size={12} />
                                            {new Date(notification.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div className="mt-2 flex justify-end">
                                        {!notification.read && (
                                            <button
                                                onClick={() => markAsRead(notification.id)}
                                                className="text-xs font-medium text-blue-600 hover:text-blue-700"
                                            >
                                                Mark as read
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Notifications;
