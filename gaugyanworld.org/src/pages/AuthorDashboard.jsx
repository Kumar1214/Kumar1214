import React, { useState, useEffect } from 'react';
import { FileText, BookOpen, BarChart2, Settings, Upload, Edit, Trash2, Plus, LayoutDashboard, Globe, Eye, ThumbsUp, Wallet } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLocation, Link } from 'react-router-dom';
import DashboardLayout from '../layout/DashboardLayout';
import Button from '../components/Button';
import AlertSection from '../components/dashboard/AlertSection';
import WalletSection from '../components/dashboard/WalletSection';
import CommunityFeed from '../components/dashboard/CommunityFeed';
import api from '../utils/api';

const AuthorDashboard = () => {
    const { user } = useAuth();
    const location = useLocation();

    // Data States
    const [news, setNews] = useState([]);
    const [knowledgebase, setKnowledgebase] = useState([]);
    const [loading, setLoading] = useState(true);

    const getInitialTab = () => {
        if (!location.hash) return 'overview';
        const hash = location.hash.replace('#', '');
        const menuPaths = ['overview', 'news', 'knowledgebase', 'analytics', 'settings', 'community', 'wallet'];
        return menuPaths.includes(hash) ? hash : 'overview';
    };

    const [activeTab, setActiveTab] = useState(getInitialTab);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [contentType, setContentType] = useState('news');

    // New Content Form State
    const [newContent, setNewContent] = useState({ title: '', category: 'General', content: '' });

    // Fetch Author Data
    useEffect(() => {
        const fetchAuthorData = async () => {
            if (!user?.id) return;
            try {
                setLoading(true);
                // Fetch News
                const newsRes = await api.get(`/news?authorId=${user.id}&status=all`);
                setNews(newsRes.data.data || []);

                // Fetch Knowledgebase
                const kbRes = await api.get(`/v1/content/knowledgebase?authorId=${user.id}&status=all`);
                setKnowledgebase(kbRes.data.data || []);
            } catch (error) {
                console.error("Failed to fetch author data", error);
            } finally {
                setLoading(false);
            }
        };

        if (user) fetchAuthorData();
    }, [user, activeTab]);

    // Sync tab with hash changes
    useEffect(() => {
        const hash = location.hash.replace('#', '');
        const menuPaths = ['overview', 'news', 'knowledgebase', 'analytics', 'settings', 'community', 'wallet'];
        if (hash && menuPaths.includes(hash)) {
            setActiveTab(hash);
        }
    }, [location.hash]);

    const handleCreateClick = () => {
        setContentType(activeTab === 'knowledgebase' ? 'knowledgebase' : 'news');
        setNewContent({ title: '', category: 'General', content: '' });
        setShowUploadModal(true);
    };

    const handleCreateSubmit = async (e) => {
        e.preventDefault();
        try {
            const endpoint = contentType === 'news' ? '/news' : '/v1/content/knowledgebase';
            await api.post(endpoint, {
                ...newContent,
                authorId: user.id,
                status: 'draft'
            });

            alert(`${contentType === 'news' ? 'News' : 'Article'} created successfully!`);
            setShowUploadModal(false);

            // Refresh
            if (contentType === 'news') {
                const newsRes = await api.get(`/news?authorId=${user.id}&status=all`);
                setNews(newsRes.data.data || []);
            } else {
                const kbRes = await api.get(`/v1/content/knowledgebase?authorId=${user.id}&status=all`);
                setKnowledgebase(kbRes.data.data || []);
            }

        } catch (error) {
            console.error("Creation failed", error);
            alert("Failed to create content.");
        }
    };

    const alerts = [
        { type: 'trend', title: 'Article Trending', message: "Your content is getting noticed.", time: '1h ago', action: 'View Details' },
        { type: 'tip', title: 'Content Tip', message: 'Articles with images get 2x more engagement.', time: '1d ago', action: 'Learn More' },
    ];

    const menuItems = [
        { path: '#overview', label: 'Overview', icon: LayoutDashboard, onClick: () => setActiveTab('overview') },
        { path: '#news', label: 'My News', icon: FileText, onClick: () => setActiveTab('news') },
        { path: '#knowledgebase', label: 'Knowledgebase', icon: BookOpen, onClick: () => setActiveTab('knowledgebase') },
        { path: '#analytics', label: 'Analytics', icon: BarChart2, onClick: () => setActiveTab('analytics') },
        { path: '#community', label: 'Community', icon: Globe, onClick: () => setActiveTab('community') },
        { path: '#wallet', label: 'My Wallet', icon: Wallet, onClick: () => setActiveTab('wallet') },
        { path: '#settings', label: 'Settings', icon: Settings, onClick: () => setActiveTab('settings') },
    ];

    if (loading && news.length === 0 && knowledgebase.length === 0) {
        return <DashboardLayout menuItems={menuItems} sidebarTitle="Author Studio" title="Loading..."><div className="p-8">Loading...</div></DashboardLayout>;
    }

    return (
        <DashboardLayout
            menuItems={menuItems}
            sidebarTitle="Author Studio"
            title={activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
        >
            <div className="relative">
                {/* Top Actions */}
                <div className="absolute top-0 right-0 -mt-16 hidden lg:flex items-center gap-4">
                    <Button
                        onClick={handleCreateClick}
                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2 rounded-lg"
                    >
                        <Plus size={18} /> Write New
                    </Button>
                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold border border-indigo-200">
                        {user?.displayName ? user.displayName.charAt(0) : 'A'}
                    </div>
                </div>

                <div className="min-h-[500px]">
                    {activeTab === 'overview' && (
                        <div className="space-y-8">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                <div className="lg:col-span-2 space-y-6">
                                    <AlertSection alerts={alerts} />

                                    {/* Stats Cards */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="bg-blue-50 p-2 rounded-lg text-blue-600"><Eye size={20} /></div>
                                                <span className="text-green-500 text-xs font-semibold">+12%</span>
                                            </div>
                                            <h4 className="text-gray-500 text-sm font-medium">Total Views</h4>
                                            <h2 className="text-2xl font-bold text-gray-800">
                                                {(news.reduce((acc, i) => acc + (i.views || 0), 0) + knowledgebase.reduce((acc, i) => acc + (i.views || 0), 0)).toLocaleString()}
                                            </h2>
                                        </div>
                                        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="bg-purple-50 p-2 rounded-lg text-purple-600"><FileText size={20} /></div>
                                                <span className="text-gray-400 text-xs font-semibold">Total</span>
                                            </div>
                                            <h4 className="text-gray-500 text-sm font-medium">Published Articles</h4>
                                            <h2 className="text-2xl font-bold text-gray-800">{news.length + knowledgebase.length}</h2>
                                        </div>
                                        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="bg-orange-50 p-2 rounded-lg text-orange-600"><ThumbsUp size={20} /></div>
                                                <span className="text-green-500 text-xs font-semibold">+5%</span>
                                            </div>
                                            <h4 className="text-gray-500 text-sm font-medium">Avg. Engagement</h4>
                                            <h2 className="text-2xl font-bold text-gray-800">4.8%</h2>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                                        <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Draft</h3>
                                        <input type="text" placeholder="Title your article..." className="w-full mb-3 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
                                        <textarea placeholder="What's on your mind?" className="w-full mb-3 px-3 py-2 border rounded-lg h-24 resize-none focus:ring-2 focus:ring-indigo-500 outline-none"></textarea>
                                        <button className="w-full py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 text-sm font-medium">Save Draft</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'news' && (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-bold text-gray-800">My News Articles</h3>
                                <button className="text-indigo-600 text-sm font-medium hover:underline">View All</button>
                            </div>
                            <ContentTable items={news} type="news" />
                        </div>
                    )}

                    {activeTab === 'knowledgebase' && (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-bold text-gray-800">Knowledgebase Articles</h3>
                                <button className="text-indigo-600 text-sm font-medium hover:underline">View All</button>
                            </div>
                            <ContentTable items={knowledgebase} type="kb" />
                        </div>
                    )}

                    {activeTab === 'community' && <CommunityFeed />}
                    {activeTab === 'wallet' && <WalletSection />}

                    {(activeTab === 'analytics' || activeTab === 'settings') && (
                        <div className="p-16 text-center text-gray-500 border border-dashed border-gray-200 rounded-xl">
                            <h3 className="text-lg font-medium text-gray-400 mb-2">Coming Soon</h3>
                            <p>This feature is under development.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Simple Upload Modal */}
            {showUploadModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-xl w-full max-w-lg p-6 shadow-2xl">
                        <h2 className="text-xl font-bold mb-4">Write New {contentType === 'news' ? 'News' : 'Article'}</h2>
                        <form onSubmit={handleCreateSubmit} className="space-y-4">
                            <input
                                value={newContent.title}
                                onChange={e => setNewContent({ ...newContent, title: e.target.value })}
                                placeholder="Title"
                                required
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                            />
                            <select
                                value={newContent.category}
                                onChange={e => setNewContent({ ...newContent, category: e.target.value })}
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                            >
                                <option>General</option>
                                <option>Health</option>
                                <option>Ayurveda</option>
                                <option>Technology</option>
                            </select>
                            <textarea
                                value={newContent.content}
                                onChange={e => setNewContent({ ...newContent, content: e.target.value })}
                                placeholder="Write your content here..."
                                required
                                className="w-full px-3 py-2 border rounded-lg h-32 resize-none focus:ring-2 focus:ring-indigo-500 outline-none"
                            />

                            <div className="flex justify-end gap-3 pt-2">
                                <button type="button" onClick={() => setShowUploadModal(false)} className="px-4 py-2 text-gray-500 hover:text-gray-700">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg">Publish Draft</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
};

const ContentTable = ({ items }) => (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm min-w-[700px]">
                <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                        <th className="px-6 py-4 font-medium text-gray-500">Title</th>
                        <th className="px-6 py-4 font-medium text-gray-500">Category</th>
                        <th className="px-6 py-4 font-medium text-gray-500">Views</th>
                        <th className="px-6 py-4 font-medium text-gray-500">Status</th>
                        <th className="px-6 py-4 font-medium text-gray-500 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                    {items.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 font-medium text-gray-800">{item.title}</td>
                            <td className="px-6 py-4 text-gray-500">{item.category}</td>
                            <td className="px-6 py-4 text-gray-500">{item.views.toLocaleString()}</td>
                            <td className="px-6 py-4">
                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${item.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                    {item.status}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                                <div className="flex justify-end gap-2">
                                    <button className="p-1 hover:bg-gray-100 rounded text-gray-500"><Edit size={16} /></button>
                                    <button className="p-1 hover:bg-red-50 rounded text-red-500"><Trash2 size={16} /></button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        {items.length === 0 && <div className="p-8 text-center text-gray-500">No content found.</div>}
    </div>
);

export default AuthorDashboard;
