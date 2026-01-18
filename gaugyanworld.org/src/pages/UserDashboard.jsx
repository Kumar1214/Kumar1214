import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    BookOpen, Trophy, ShoppingBag, Clock, Activity, Headphones, Brain, Wallet,
    LayoutDashboard, Award, Heart, Settings, Star, ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/useData';
import api from '../services/api'; // Import API utility
import DashboardLayout from '../layout/DashboardLayout';

// Enhanced Glassmorphism Stat Card
const StatCard = ({ icon: IconComp, label, value, subtext, gradientFrom, gradientTo, onClick }) => (
    <div
        onClick={onClick}
        className={`
            relative overflow-hidden rounded-3xl p-6 flex flex-col justify-between transition-all duration-300
            bg-white/10 backdrop-blur-md border border-white/20 shadow-xl
            ${onClick ? 'cursor-pointer hover:-translate-y-2 hover:shadow-2xl hover:border-white/40' : ''}
            group
        `}
    >
        {/* Glow Effect */}
        <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full bg-gradient-to-br ${gradientFrom} ${gradientTo} opacity-20 blur-3xl group-hover:opacity-30 transition-opacity`} />

        <div className="flex items-center justify-between mb-4 z-10">
            <div className={`p-3 rounded-2xl bg-gradient-to-br ${gradientFrom} ${gradientTo} shadow-lg shadow-${gradientFrom}/20`}>
                <IconComp size={24} className="text-white" />
            </div>
            {subtext && (
                <span className="text-xs font-semibold text-gray-200 bg-white/10 px-3 py-1 rounded-full border border-white/10 backdrop-blur-sm">
                    {subtext}
                </span>
            )}
        </div>
        <div className="z-10">
            <div className="text-4xl font-black text-white tracking-tight mb-1">{value}</div>
            <div className="text-sm font-medium text-gray-300 tracking-wide uppercase opacity-80">{label}</div>
        </div>
    </div>
);

const UserDashboard = () => {
    const { user } = useAuth();
    const { courses: rawCourses, orders: rawOrders } = useData();
    const navigate = useNavigate();

    // Local State for Results (fetched from Backend now)
    const [results, setResults] = useState([]);
    const [walletData, setWalletData] = useState({ balance: 0, coins: 0 });
    const [isLoading, setIsLoading] = useState(true);

    // Redirect safeguard
    useEffect(() => {
        if (user) {
            const role = user.role;
            if (role === 'admin') navigate('/admin');
            else if (role === 'vendor') navigate('/vendor/dashboard');
            else if (role === 'instructor') navigate('/instructor/dashboard');
            else if (role === 'artist') navigate('/artist/dashboard');
            else if (role === 'gaushala_owner') navigate('/gaushala/dashboard');
        }
    }, [user, navigate]);

    // Fetch Backend Data (Wallet & Results)
    useEffect(() => {
        const fetchData = async () => {
            try {
                // 1. Fetch Wallet
                const { walletService } = await import('../services/api');
                const walletRes = await walletService.getMyWallet();
                if (walletRes.data.success) {
                    setWalletData({
                        balance: walletRes.data.data.walletBalance,
                        coins: walletRes.data.data.coinBalance
                    });
                }

                // 2. Fetch Results (NEW API)
                const resultsRes = await api.get('/quizzes/my-results');
                if (resultsRes.data.success) {
                    setResults(resultsRes.data.data);
                }
            } catch (err) {
                console.error("Dashboard Data Fetch Error:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    // Data Processing
    const courses = rawCourses || [];
    const allOrders = rawOrders || [];
    const orders = user ? allOrders.filter(o => o.buyerEmail === user.email) : [];
    const totalSpent = orders.reduce((acc, order) => acc + order.total, 0);

    // Stats Calculation
    const quizzesTaken = results.filter(r => r.type === 'quiz').length;
    // Calculate average safely
    const validScores = results.filter(r => typeof r.score === 'number');
    const averageScore = validScores.length > 0
        ? Math.round(validScores.reduce((acc, r) => acc + r.percentage, 0) / validScores.length)
        : 0;

    const userStats = {
        coursesEnrolled: courses.length,
        coursesCompleted: courses.filter(c => c.progress === 100).length,
        totalLearningHours: Math.floor(quizzesTaken * 0.5) + (courses.length * 2), // Estimation based on activity
        quizzesTaken: quizzesTaken,
        averageQuizScore: averageScore,
        productsOrdered: orders.length,
        totalSpent: totalSpent,
        walletBalance: walletData.balance
    };

    const recentActivity = [
        ...results.slice(0, 3).map(r => ({
            id: `result-${r.id}`,
            type: r.type,
            title: `${r.type === 'exam' ? 'Exam Passed' : 'Quiz Completed'}: ${r.title}`,
            subtext: `Score: ${r.percentage?.toFixed(0)}%`,
            time: new Date(r.createdAt || r.attemptDate).toLocaleDateString(),
            icon: Trophy,
            gradientFrom: 'from-amber-400',
            gradientTo: 'to-orange-600'
        })),
        ...orders.slice(0, 2).map(o => ({
            id: `order-${o.id}`,
            type: 'order',
            title: `Order #${o.id.toString().slice(-4)}`,
            subtext: `${o.items?.length} Items`,
            time: new Date(o.date).toLocaleDateString(),
            icon: ShoppingBag,
            gradientFrom: 'from-blue-400',
            gradientTo: 'to-indigo-600'
        }))
    ].sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 5);

    if (recentActivity.length === 0) {
        recentActivity.push({
            id: 1, type: 'system', title: 'Welcome to GauGyan!', subtext: 'Start your journey today', time: 'Just now',
            icon: Star, gradientFrom: 'from-emerald-400', gradientTo: 'to-teal-600'
        });
    }

    const menuItems = [
        { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/wallet', label: 'My Wallet', icon: Wallet },
        { path: '/my-courses', label: 'My Learning', icon: BookOpen },
        { path: '/my-orders', label: 'My Orders', icon: ShoppingBag },
        { path: '/my-results', label: 'Performance', icon: Trophy },
        { path: '/certificates', label: 'Certificates', icon: Award },
        { path: '/wishlist', label: 'Wishlist', icon: Heart },
        { path: '/profile', label: 'Settings', icon: Settings },
    ];

    return (
        <div className="min-h-screen bg-[#0f172a] text-white font-sans selection:bg-purple-500 selection:text-white">
            {/* Background Effects */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-900/30 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900/30 rounded-full blur-[120px]" />
            </div>

            <DashboardLayout
                menuItems={menuItems}
                sidebarTitle="GauGyan"
                title={`Hello, ${user?.displayName?.split(' ')[0] || 'Student'}`}
                subtitle="Your learning command center is ready."
                darkMode={true} // Hint to layout to use dark mode styles if supported
            >
                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 relative z-10">
                    <StatCard
                        icon={BookOpen}
                        label="Enrolled"
                        value={userStats.coursesEnrolled}
                        subtext={`${userStats.coursesCompleted} Done`}
                        gradientFrom="from-emerald-400"
                        gradientTo="to-emerald-600"
                        onClick={() => navigate('/my-courses')}
                    />
                    <StatCard
                        icon={Clock}
                        label="Hours Learned"
                        value={userStats.totalLearningHours}
                        gradientFrom="from-cyan-400"
                        gradientTo="to-blue-600"
                    />
                    <StatCard
                        icon={Trophy}
                        label="Avg Score"
                        value={`${userStats.averageQuizScore}%`}
                        subtext={`${userStats.quizzesTaken} Quizzes`}
                        gradientFrom="from-amber-400"
                        gradientTo="to-orange-600"
                        onClick={() => navigate('/my-results')}
                    />
                    <StatCard
                        icon={Wallet}
                        label="Balance"
                        value={`₹${userStats.totalSpent}`} // Showing spent instead of balance for visual variety, or switch back
                        subtext={`${userStats.walletBalance} Credits`}
                        gradientFrom="from-purple-400"
                        gradientTo="to-pink-600"
                        onClick={() => navigate('/wallet')}
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
                    {/* Recent Activity */}
                    <div className="lg:col-span-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-xl">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white/10 rounded-xl">
                                    <Activity size={20} className="text-purple-400" />
                                </div>
                                <h2 className="text-xl font-bold text-white tracking-wide">Recent Activity</h2>
                            </div>
                            <button className="text-sm text-purple-400 hover:text-purple-300 font-medium transition-colors">View All</button>
                        </div>

                        <div className="flex flex-col gap-4">
                            {recentActivity.map((activity, idx) => (
                                <div key={idx} className="flex items-center p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors group">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 bg-gradient-to-br ${activity.gradientFrom} ${activity.gradientTo} shadow-lg mr-4 group-hover:scale-110 transition-transform`}>
                                        <activity.icon size={20} className="text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="font-bold text-gray-100">{activity.title}</div>
                                        <div className="text-xs text-gray-400 mt-1 flex items-center gap-2">
                                            <span>{activity.time}</span>
                                            {activity.subtext && (
                                                <>
                                                    <span className="w-1 h-1 rounded-full bg-gray-600" />
                                                    <span className="text-gray-300">{activity.subtext}</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    <ChevronRight size={18} className="text-gray-600 group-hover:text-purple-400 transition-colors" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quick Shortcuts */}
                    <div className="flex flex-col gap-6">
                        {/* Mindfulness Card */}
                        <div className="group relative overflow-hidden rounded-3xl p-8 bg-gradient-to-br from-pink-600 to-rose-900 shadow-2xl transition-all hover:shadow-pink-900/50">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                            <Brain size={40} className="text-white mb-6 drop-shadow-lg" />
                            <h3 className="text-2xl font-bold text-white mb-2">Mindfulness</h3>
                            <p className="text-pink-100 text-sm mb-6 opacity-90">Take a moment to breathe and focus.</p>
                            <button
                                onClick={() => navigate('/meditation')}
                                className="w-full py-3 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-xl text-white font-semibold transition-all flex items-center justify-center gap-2"
                            >
                                Start Session <ChevronRight size={16} />
                            </button>
                        </div>

                        {/* Music Card */}
                        <div className="group relative overflow-hidden rounded-3xl p-8 bg-gradient-to-br from-indigo-600 to-blue-900 shadow-2xl transition-all hover:shadow-blue-900/50">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                            <Headphones size={40} className="text-white mb-6 drop-shadow-lg" />
                            <h3 className="text-2xl font-bold text-white mb-2">Focus Music</h3>
                            <p className="text-indigo-100 text-sm mb-6 opacity-90">Curated playlists for deep work.</p>
                            <button
                                onClick={() => navigate('/music')}
                                className="w-full py-3 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-xl text-white font-semibold transition-all flex items-center justify-center gap-2"
                            >
                                Listen Now <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            </DashboardLayout>
        </div>
    );
};

export default UserDashboard;
