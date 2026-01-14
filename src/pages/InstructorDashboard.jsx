import React, { useState, useEffect, useMemo } from 'react';
import { BookOpen, Users, DollarSign, Star, MoreVertical, Plus, Filter, Search, MessageSquare, Settings, LayoutDashboard, Send, Clock, Reply, Wallet, Globe } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/useData';
import api from '../utils/api';
import DashboardLayout from '../layout/DashboardLayout';
import Button from '../components/Button';
import OnboardingWidget from '../components/dashboard/OnboardingWidget';
import WalletSection from '../components/dashboard/WalletSection';
import CommunityFeed from '../components/dashboard/CommunityFeed';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const InstructorDashboard = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('overview');

    // Data
    const [myCourses, setMyCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCourseModal, setShowCourseModal] = useState(false);

    // Communication State
    const [chats, setChats] = useState([]);
    const [activeChat, setActiveChat] = useState(null);
    const [messageInput, setMessageInput] = useState('');

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const { data } = await api.get(`/courses?instructor=${user.id}`);
                setMyCourses(data.data || []);
            } catch (err) {
                console.error("Failed to fetch instructor courses", err);
            } finally {
                setLoading(false);
            }
        };

        const fetchMessages = async () => {
            try {
                const { data } = await api.get('/messages/my-messages');
                const rawMsgs = data.data || [];
                const threads = {};
                rawMsgs.forEach(msg => {
                    const otherUser = msg.senderId === user.id ? msg.receiver : msg.sender;
                    if (!threads[otherUser.id]) {
                        threads[otherUser.id] = {
                            id: otherUser.id,
                            student: otherUser.name,
                            studentId: otherUser.id,
                            msgs: [],
                            lastMsg: msg.message,
                            time: new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                            course: 'General'
                        };
                    }
                    threads[otherUser.id].msgs.push(msg);
                    threads[otherUser.id].lastMsg = msg.message;
                });
                setChats(Object.values(threads));
            } catch (err) {
                console.error("Failed to fetch messages", err);
            }
        };

        if (user) {
            fetchCourses();
            fetchMessages();
        }
    }, [user, activeTab]);

    const handleSendMessage = async () => {
        if (!messageInput.trim() || !activeChat) return;
        try {
            const { data } = await api.post('/messages', {
                receiverId: activeChat.studentId,
                message: messageInput
            });
            const newMsg = data.data;
            alert("Reply sent!");
            setMessageInput('');
            // Optimistically update or refetch needed
        } catch (err) {
            alert("Failed to send");
        }
    };

    const stats = useMemo(() => {
        const totalCourses = myCourses.length;
        const totalStudents = myCourses.reduce((acc, c) => acc + (c.students || 0), 0);
        const totalRevenue = myCourses.reduce((acc, c) => acc + ((c.price || 0) * (c.students || 0)), 0);
        const avgRating = totalCourses > 0 ? (myCourses.reduce((acc, c) => acc + (c.rating || 0), 0) / totalCourses).toFixed(1) : 0;

        const chartData = [
            { name: 'Jan', revenue: 4000 },
            { name: 'Feb', revenue: 3000 },
            { name: 'Mar', revenue: totalRevenue * 0.2 },
            { name: 'Apr', revenue: totalRevenue * 0.3 },
            { name: 'May', revenue: totalRevenue * 0.5 },
        ];

        return { totalCourses, totalStudents, totalRevenue, avgRating, chartData };
    }, [myCourses]);


    const onboardingTasks = [
        { label: 'Complete Profile', description: 'Bio & Expertise', completed: true },
        { label: 'Create First Course', description: 'Upload lectures', completed: myCourses.length > 0 },
        { label: 'Get 10 Students', description: 'Promote your course', completed: stats.totalStudents >= 10 },
    ];

    const menuItems = [
        { path: '#overview', label: 'Overview', icon: LayoutDashboard, onClick: () => setActiveTab('overview') },
        { path: '#courses', label: 'My Courses', icon: BookOpen, onClick: () => setActiveTab('courses') },
        { path: '#communication', label: 'Communication', icon: MessageSquare, onClick: () => setActiveTab('communication') },
        { path: '#revenue', label: 'Revenue', icon: DollarSign, onClick: () => setActiveTab('revenue') },
        { path: '#community', label: 'Community', icon: Globe, onClick: () => setActiveTab('community') },
        { path: '#wallet', label: 'My Wallet', icon: Wallet, onClick: () => setActiveTab('wallet') },
        { path: '#settings', label: 'Settings', icon: Settings, onClick: () => setActiveTab('settings') },
    ];

    return (
        <DashboardLayout
            menuItems={menuItems}
            sidebarTitle="Instructor Panel"
            title={activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            darkMode={false}
        >
            <div className="relative">
                <div className="absolute top-0 right-0 -mt-16 hidden lg:flex">
                    <Button
                        onClick={() => setShowCourseModal(true)}
                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2 rounded-lg"
                    >
                        <Plus size={18} /> Create Course
                    </Button>
                </div>

                <div className="min-h-[500px]">
                    {activeTab === 'overview' && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                                    <span className="text-gray-500 text-sm">Total Students</span>
                                    <div className="text-2xl font-bold text-gray-900 mt-1">{stats.totalStudents}</div>
                                </div>
                                <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                                    <span className="text-gray-500 text-sm">Total Revenue</span>
                                    <div className="text-2xl font-bold text-gray-900 mt-1">₹{stats.totalRevenue.toLocaleString()}</div>
                                </div>
                                <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                                    <span className="text-gray-500 text-sm">Avg. Rating</span>
                                    <div className="text-2xl font-bold text-gray-900 mt-1 flex items-center gap-1">
                                        {stats.avgRating} <Star size={16} className="fill-yellow-400 text-yellow-400" />
                                    </div>
                                </div>
                                <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                                    <span className="text-gray-500 text-sm">Active Courses</span>
                                    <div className="text-2xl font-bold text-gray-900 mt-1">{stats.totalCourses}</div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                <div className="lg:col-span-2 space-y-6">
                                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                        <h3 className="text-lg font-bold text-gray-800 mb-6">Revenue Trend</h3>
                                        <div className="h-64">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <AreaChart data={stats.chartData}>
                                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                                    <XAxis dataKey="name" tickLine={false} axisLine={false} />
                                                    <YAxis tickLine={false} axisLine={false} prefix="₹" />
                                                    <Tooltip />
                                                    <Area type="monotone" dataKey="revenue" stroke="#4f46e5" fill="#e0e7ff" />
                                                </AreaChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    <OnboardingWidget title="Instructor Goals" tasks={onboardingTasks} completedCount={onboardingTasks.filter(t => t.completed).length} />

                                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                                        <h3 className="font-bold text-gray-800 mb-4">Inbox</h3>
                                        <div className="space-y-4">
                                            {chats.slice(0, 3).map(c => (
                                                <div key={c.id} className="flex gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-indigo-600 uppercase">{c.student ? c.student[0] : 'U'}</div>
                                                    <div className="flex-1 overflow-hidden">
                                                        <div className="flex justify-between">
                                                            <p className="font-bold text-sm text-gray-900">{c.student}</p>
                                                            <span className="text-xs text-gray-400">{c.time}</span>
                                                        </div>
                                                        <p className="text-sm text-gray-500 truncate">{c.lastMsg}</p>
                                                    </div>
                                                </div>
                                            ))}
                                            {chats.length === 0 && <p className="text-gray-500 text-sm">No new messages.</p>}
                                            <button onClick={() => setActiveTab('communication')} className="w-full text-center text-sm text-indigo-600 font-medium">View All Messages</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'courses' && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                                <h3 className="font-bold text-gray-800">My Courses</h3>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left min-w-[700px]">
                                    <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-semibold">
                                        <tr>
                                            <th className="px-6 py-4">Course</th>
                                            <th className="px-6 py-4">Price</th>
                                            <th className="px-6 py-4">Students</th>
                                            <th className="px-6 py-4">Rating</th>
                                            <th className="px-6 py-4 text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {myCourses.map(c => (
                                            <tr key={c.id} className="hover:bg-gray-50/50">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="font-medium text-gray-900">{c.title}</div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">₹{c.price || 'Free'}</td>
                                                <td className="px-6 py-4">{c.students || 0}</td>
                                                <td className="px-6 py-4 flex items-center gap-1">{c.rating || 0} <Star size={12} className="fill-yellow-400 text-yellow-400" /></td>
                                                <td className="px-6 py-4 text-right"><button><MoreVertical size={16} className="text-gray-400" /></button></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === 'communication' && (
                        <div className="flex flex-col md:flex-row bg-white rounded-xl shadow-sm border border-gray-100 h-[600px] overflow-hidden">
                            <div className="w-full md:w-1/3 border-r border-gray-100 p-4">
                                <div className="mb-4 relative">
                                    <input placeholder="Search students..." className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-8 pr-4 py-2 text-sm" />
                                    <Search className="absolute left-2.5 top-2.5 text-gray-400" size={16} />
                                </div>
                                <div className="space-y-2">
                                    {chats.map(chat => (
                                        <div
                                            key={chat.id}
                                            onClick={() => setActiveChat(chat)}
                                            className={`p-3 rounded-lg cursor-pointer transition-colors ${activeChat?.id === chat.id ? 'bg-indigo-50 border border-indigo-100' : 'hover:bg-gray-50'}`}
                                        >
                                            <div className="flex justify-between mb-1">
                                                <span className="font-bold text-gray-900 text-sm">{chat.student}</span>
                                                <span className="text-xs text-gray-400">{chat.time}</span>
                                            </div>
                                            <p className="text-xs text-gray-500 truncate">{chat.lastMsg}</p>
                                        </div>
                                    ))}
                                    {chats.length === 0 && <div className="text-center text-gray-400 mt-10">No messages yet.</div>}
                                </div>
                            </div>
                            <div className="flex-1 flex flex-col">
                                {activeChat ? (
                                    <>
                                        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                                            <div>
                                                <h3 className="font-bold text-gray-900">{activeChat.student}</h3>
                                                <p className="text-xs text-gray-500">Student • {activeChat.course}</p>
                                            </div>
                                            <Button className="!py-1 !px-3 text-xs bg-white border border-gray-200 !text-gray-700">View Profile</Button>
                                        </div>
                                        <div className="flex-1 p-4 overflow-y-auto space-y-4">
                                            {activeChat.msgs.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)).map(msg => (
                                                <div key={msg.id} className={`flex ${msg.senderId === user.id ? 'justify-end' : 'justify-start'}`}>
                                                    <div className={`p-3 rounded-lg max-w-[80%] ${msg.senderId === user.id ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-gray-100 text-gray-800 rounded-tl-none'}`}>
                                                        <p className="text-sm">{msg.message}</p>
                                                        <span className={`text-xs mt-1 block ${msg.senderId === user.id ? 'text-indigo-200' : 'text-gray-400'}`}>
                                                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="p-4 border-t border-gray-100">
                                            <div className="flex gap-2">
                                                <input
                                                    value={messageInput}
                                                    onChange={e => setMessageInput(e.target.value)}
                                                    placeholder="Type your reply..."
                                                    className="flex-1 border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                />
                                                <button onClick={handleSendMessage} className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700"><Send size={20} /></button>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex-1 flex items-center justify-center text-gray-400 flex-col gap-2">
                                        <MessageSquare size={48} className="opacity-20" />
                                        <p>Select a conversation to start chatting</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'revenue' && (
                        <div className="bg-white p-8 rounded-xl border border-gray-100 text-center">
                            <h3 className="text-lg font-bold mb-2">Total Earnings</h3>
                            <div className="text-4xl font-extrabold text-gray-900 mb-2">₹{stats.totalRevenue.toLocaleString()}</div>
                            <p className="text-gray-500 mb-8 max-w-md mx-auto">Revenue is calculated based on total student enrollments. Payouts are processed monthly.</p>

                            <div className="h-64 mt-8">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={stats.chartData}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                        <XAxis dataKey="name" tickLine={false} axisLine={false} />
                                        <YAxis tickLine={false} axisLine={false} />
                                        <Tooltip />
                                        <Bar dataKey="revenue" fill="#4f46e5" radius={[4, 4, 0, 0]} barSize={50} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    )}

                    {activeTab === 'community' && <CommunityFeed />}
                    {activeTab === 'wallet' && <WalletSection />}

                    {activeTab === 'settings' && <div className="p-8 text-center text-gray-500 bg-white rounded-xl border">Settings coming soon</div>}
                </div>
            </div>

            {showCourseModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl p-8 max-w-md w-full text-center">
                        <BookOpen size={48} className="mx-auto text-indigo-500 mb-4" />
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Create New Course</h3>
                        <p className="text-gray-500 mb-6">Redirecting to Course Studio...</p>
                        <Button onClick={() => setShowCourseModal(false)} className="w-full">Close</Button>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
};

export default InstructorDashboard;
