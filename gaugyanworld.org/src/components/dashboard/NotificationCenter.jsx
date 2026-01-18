import React, { useState, useEffect } from 'react';
import { Bell, CheckCircle2, AlertCircle, Info, Trash2, Check } from 'lucide-react';
import Button from '../Button';

// Mock Data (To be replaced with API later)
const MOCK_NOTIFICATIONS = [
    { id: 1, type: 'system', title: 'Welcome to GauGyan', message: 'Explore our new verified courses and get certified!', time: '2 hours ago', read: false },
    { id: 2, type: 'order', title: 'Order Shipped', message: 'Your order #1234 has been shipped and will arrive soon.', time: '1 day ago', read: false },
    { id: 3, type: 'alert', title: 'Action Required', message: 'Please update your profile to continue using all features.', time: '2 days ago', read: true },
    { id: 4, type: 'success', title: 'Quiz Completed', message: 'You passed the "Vue.js Fundamentals" quiz with 90%!', time: '3 days ago', read: true },
];

const NotificationCenter = () => {
    const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
    const [filter, setFilter] = useState('all');

    const unreadCount = notifications.filter(n => !n.read).length;

    const markAllRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    const clearAll = () => {
        if (window.confirm("Are you sure you want to clear all notifications?")) {
            setNotifications([]);
        }
    };

    const deleteNotification = (id) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    const filteredNotifications = filter === 'all'
        ? notifications
        : filter === 'unread'
            ? notifications.filter(n => !n.read)
            : notifications;

    const getIcon = (type) => {
        switch (type) {
            case 'success': return <CheckCircle2 className="text-green-500" size={20} />;
            case 'alert': return <AlertCircle className="text-red-500" size={20} />;
            case 'info': return <Info className="text-blue-500" size={20} />;
            default: return <Bell className="text-orange-500" size={20} />;
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden max-w-4xl mx-auto">
            <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <Bell className="fill-orange-50 stroke-orange-600" size={24} />
                        Notifications
                        {unreadCount > 0 && <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{unreadCount}</span>}
                    </h2>
                    <p className="text-sm text-gray-500">Stay updated with your latest activity.</p>
                </div>

                <div className="flex gap-2">
                    <div className="flex bg-gray-100 p-1 rounded-lg">
                        <button
                            onClick={() => setFilter('all')}
                            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${filter === 'all' ? 'bg-white shadow text-gray-800' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            All
                        </button>
                        <button
                            onClick={() => setFilter('unread')}
                            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${filter === 'unread' ? 'bg-white shadow text-gray-800' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            Unread
                        </button>
                    </div>
                    {unreadCount > 0 && (
                        <Button
                            onClick={markAllRead}
                            className="!bg-indigo-50 !text-indigo-600 hover:!bg-indigo-100 text-xs px-3 py-1.5 flex items-center gap-1 border-none"
                        >
                            <Check size={14} /> Mark all read
                        </Button>
                    )}
                    <Button
                        onClick={clearAll}
                        className="!bg-red-50 !text-red-600 hover:!bg-red-100 text-xs px-3 py-1.5 flex items-center gap-1 border-none"
                    >
                        <Trash2 size={14} /> Clear
                    </Button>
                </div>
            </div>

            <div className="divide-y divide-gray-50 max-h-[600px] overflow-y-auto">
                {filteredNotifications.length === 0 ? (
                    <div className="p-10 text-center text-gray-400 flex flex-col items-center">
                        <Bell size={48} strokeWidth={1} className="mb-2 opacity-20" />
                        <p>No notifications found.</p>
                    </div>
                ) : (
                    filteredNotifications.map(notification => (
                        <div
                            key={notification.id}
                            className={`p-4 flex gap-4 hover:bg-gray-50 transition-colors group ${!notification.read ? 'bg-blue-50/50' : ''}`}
                        >
                            <div className="mt-1 flex-shrink-0">
                                {getIcon(notification.type)}
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <h4 className={`text-sm font-semibold ${!notification.read ? 'text-gray-900' : 'text-gray-600'}`}>
                                        {notification.title}
                                    </h4>
                                    <span className="text-xs text-gray-400 whitespace-nowrap ml-2">{notification.time}</span>
                                </div>
                                <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                            </div>
                            <button
                                onClick={() => deleteNotification(notification.id)}
                                className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-opacity self-center p-2"
                                title="Delete"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default NotificationCenter;
