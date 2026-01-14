import React, { useState, useEffect, useContext } from 'react';
import {
    Plus, Search, Filter, Edit2, Trash2, Video, Music, List, Clock,
    MoreVertical, PlayCircle, Image as ImageIcon, Upload, Youtube,
    CheckCircle, HelpCircle, FileText, X, Eye, TrendingUp, Share2, Bookmark
} from 'lucide-react';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';
import { useData } from '../../../context/useData';
import { DataContext } from '../../../context/DataContext';
import FormModal from '../../../components/admin/shared/FormModal';
import FileUploader from '../../../components/admin/shared/FileUploader';
import AnalyticsGrid from '../../../components/admin/analytics/AnalyticsGrid';
import TrendingChart from '../../../components/admin/analytics/TrendingChart';
import TrendingModal from '../../../components/admin/analytics/TrendingModal';

// Helper components for icons
const User = ({ size, color }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color || "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
);
const Headphones = ({ size, color }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color || "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 18v-6a9 9 0 0 1 18 0v6"></path><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path></svg>
);

const parseArrayField = (field) => {
    if (!field) return [];
    if (Array.isArray(field)) return field;
    try {
        return JSON.parse(field);
    } catch (e) {
        console.error("Error parsing array field:", e);
        return [];
    }
};

const MeditationManagement = () => {
    const { filteredMeditation: userMeditation, addMeditation, deleteMeditation, updateMeditation } = useData();
    const { getModuleAnalytics, getTrendingContent } = useContext(DataContext);
    const [viewMode, setViewMode] = useState('grid');
    const [searchQuery, setSearchQuery] = useState('');
    const [analytics, setAnalytics] = useState(null);
    const [trending, setTrending] = useState([]);
    const [showTrendingModal, setShowTrendingModal] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editingSession, setEditingSession] = useState(null);
    const [activeTab, setActiveTab] = useState('basic'); // basic, media, series, preview

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const data = await getModuleAnalytics('meditation');
                if (data) setAnalytics(data);
                const trendingData = await getTrendingContent('meditation', 10);
                if (trendingData) setTrending(trendingData);
            } catch (err) {
                console.error("Error fetching meditation analytics:", err);
            }
        };
        fetchAnalytics();
    }, [getModuleAnalytics, getTrendingContent]);

    const [formData, setFormData] = useState({
        title: '', description: '', duration: '', difficulty: 'Beginner',
        type: 'Guided', // Guided, Visualization, Series, Music
        audioUrl: '', videoUrl: '', backgroundMusic: '', instructor: '', coverImage: '',
        featured: false,
        sessions: [],
        mediaType: 'upload' // 'upload' or 'youtube'
    });

    // State for new session in series
    const [newSession, setNewSession] = useState({
        title: '', duration: '', audioUrl: '', videoUrl: ''
    });

    const filteredMeditation = userMeditation.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.instructor?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Stats
    const stats = [
        { label: 'Total Sessions', value: userMeditation.length, icon: Music, color: '#8B5CF6' },
        { label: 'Guided', value: userMeditation.filter(m => m.type === 'Guided').length, icon: User, color: '#10B981' },
        { label: 'Music', value: userMeditation.filter(m => m.type === 'Music').length, icon: Headphones, color: '#F59E0B' },
        { label: 'Series', value: userMeditation.filter(m => m.type === 'Series').length, icon: List, color: '#EC4899' }
    ];

    const resetForm = () => {
        setFormData({
            title: '', description: '', duration: '', difficulty: 'Beginner',
            type: 'Guided',
            audioUrl: '', videoUrl: '', backgroundMusic: '', instructor: '', coverImage: '',
            featured: false,
            sessions: [],
            mediaType: 'upload'
        });
        setEditingSession(null);
        setNewSession({ title: '', duration: '', audioUrl: '', videoUrl: '' });
        setActiveTab('basic');
    };

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();

        // Validation
        if (!formData.title || !formData.duration || !formData.difficulty) {
            toast.error("Please fill required fields (Title, Duration, Difficulty)");
            return;
        }

        try {
            // Clean payload
            const { mediaType, id, createdAt, updatedAt, ...cleanData } = formData;

            let promise;
            if (editingSession) {
                promise = updateMeditation(editingSession.id, cleanData);
            } else {
                promise = addMeditation(cleanData);
            }

            await toast.promise(promise, {
                loading: editingSession ? 'Updating meditation...' : 'Adding meditation...',
                success: editingSession ? 'Meditation updated successfully!' : 'Meditation added successfully!',
                error: (err) => `Failed to save: ${err.response?.data?.message || err.message}`
            });

            setShowModal(false);
            resetForm();
        } catch (error) {
            console.error("Error saving meditation:", error);
        }
    };

    const handleEdit = (session) => {
        setEditingSession(session);
        setFormData({
            ...session,
            sessions: parseArrayField(session.sessions),
            mediaType: session.videoUrl?.includes('youtube') ? 'youtube' : 'upload'
        });
        setShowModal(true);
    };

    const handleDelete = async (session) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed) {
            try {
                await deleteMeditation(session.id);
                toast.success('Meditation session deleted successfully');
            } catch (error) {
                console.error("Error deleting session:", error);
                toast.error('Failed to delete session');
            }
        }
    };

    const handleAddSession = () => {
        if (!newSession.title) return;
        const currentSessions = parseArrayField(formData.sessions);
        setFormData({
            ...formData,
            sessions: [...currentSessions, { ...newSession, id: Date.now() }]
        });
        setNewSession({ title: '', duration: '', audioUrl: '', videoUrl: '' });
    };

    const handleRemoveSession = (sessionId) => {
        const currentSessions = parseArrayField(formData.sessions);
        setFormData({
            ...formData,
            sessions: currentSessions.filter(s => s.id !== sessionId)
        });
    };

    const getEmbedUrl = (url) => {
        if (!url) return '';
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}` : url;
    };



    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Meditation Library</h2>
                    <p className="text-gray-500">Manage your meditation sessions, music, and series</p>
                </div>
                <button
                    onClick={() => { resetForm(); setShowModal(true); }}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors shadow-sm font-medium"
                >
                    <Plus size={20} />
                    Add New
                </button>
            </div>

            {/* Analytics Section */}
            <AnalyticsGrid
                metrics={[
                    { title: 'Total Sessions', value: analytics?.totalItems || userMeditation.length, icon: Music, color: 'indigo' },
                    { title: 'Total Listens', value: analytics?.overview?.totalViews?.toLocaleString() || '5,280', icon: PlayCircle, color: 'blue', trend: 'up', trendValue: 14 },
                    { title: 'Total Shares', value: analytics?.overview?.totalShares?.toLocaleString() || '942', icon: Share2, color: 'green', trend: 'up', trendValue: 8 },
                    { title: 'Total Bookmarks', value: analytics?.overview?.totalBookmarks?.toLocaleString() || '215', icon: Bookmark, color: 'purple' }
                ]}
            />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '24px', marginBottom: '32px' }}>
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, margin: 0 }}>Engagement Trends</h3>
                        <button
                            onClick={() => setShowTrendingModal(true)}
                            style={{ background: 'none', border: 'none', color: '#8B5CF6', fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.9rem' }}
                        >
                            <TrendingUp size={16} /> View Top 50
                        </button>
                    </div>
                    <TrendingChart data={trending.length > 0 ? trending : userMeditation.slice(0, 8)} />
                </div>

                <div style={{ background: 'linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)', borderRadius: '12px', padding: '24px', color: 'white' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 600, margin: '0 0 12px 0' }}>Zen Insights</h3>
                    <p style={{ fontSize: '0.9rem', color: '#E5E7EB', lineHeight: 1.5 }}>
                        Users are completing 45% more sessions during early morning hours (5 AM - 7 AM). Consider pushing new releases on Friday mornings.
                    </p>
                    <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', paddingBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                            <span style={{ color: '#C4B5FD' }}>Retention Rate</span>
                            <span style={{ fontWeight: 600 }}>68%</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                            <span style={{ color: '#C4B5FD' }}>Avg. Session</span>
                            <span style={{ fontWeight: 600 }}>18m</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters & Search */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search by title or instructor..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                    />
                </div>
                <div className="flex gap-3">
                    <div className="flex bg-gray-100 p-1 rounded-lg">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white shadow text-purple-600' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            <div className="w-5 h-5 grid grid-cols-2 gap-0.5">
                                <div className="bg-current rounded-[1px]"></div>
                                <div className="bg-current rounded-[1px]"></div>
                                <div className="bg-current rounded-[1px]"></div>
                                <div className="bg-current rounded-[1px]"></div>
                            </div>
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-white shadow text-purple-600' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            <List size={20} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Content Grid */}
            {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredMeditation.map(item => (
                        <div key={item.id} className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col h-full">
                            <div className="relative aspect-video bg-gray-100 overflow-hidden">
                                <img
                                    src={item.coverImage || 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=400'}
                                    alt={item.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                    <button
                                        onClick={() => handleEdit(item)}
                                        className="p-2 bg-white/90 text-gray-700 rounded-full hover:bg-white hover:text-purple-600 transition-colors"
                                    >
                                        <Edit2 size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(item)}
                                        className="p-2 bg-white/90 text-gray-700 rounded-full hover:bg-white hover:text-red-600 transition-colors"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                                <div className="absolute top-2 left-2">
                                    <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md backdrop-blur-md text-white ${item.type === 'Series' ? 'bg-indigo-500/90' : 'bg-purple-500/90'
                                        }`}>
                                        {item.type}
                                    </span>
                                </div>
                                <div className="absolute bottom-2 right-2">
                                    <span className="px-2 py-1 bg-black/60 text-white text-xs font-medium rounded-full backdrop-blur-sm flex items-center gap-1">
                                        <Clock size={12} /> {item.duration}
                                    </span>
                                </div>
                            </div>
                            <div className="p-4 flex-1 flex flex-col">
                                <h3 className="font-bold text-gray-900 mb-1 line-clamp-1">{item.title}</h3>
                                <p className="text-sm text-gray-500 mb-3 line-clamp-2">{item.description}</p>
                                <div className="mt-auto flex items-center justify-between pt-3 border-t border-gray-100">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 text-xs font-bold">
                                            {item.instructor?.charAt(0) || 'G'}
                                        </div>
                                        <span className="text-xs font-medium text-gray-600">{item.instructor || 'GauGyan'}</span>
                                    </div>
                                    <span className={`text-xs px-2 py-0.5 rounded-full ${item.difficulty === 'Beginner' ? 'bg-green-100 text-green-700' :
                                        item.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                                        }`}>
                                        {item.difficulty}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Session</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Duration</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Difficulty</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredMeditation.map(item => (
                                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden">
                                                <img src={item.coverImage} alt="" className="w-full h-full object-cover" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">{item.title}</p>
                                                <p className="text-xs text-gray-500">{item.instructor}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${item.type === 'Series' ? 'bg-indigo-50 text-indigo-700' : 'bg-purple-50 text-purple-700'
                                            }`}>
                                            {item.type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{item.duration}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.difficulty === 'Beginner' ? 'bg-green-100 text-green-700' :
                                            item.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                                            }`}>
                                            {item.difficulty}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button onClick={() => handleEdit(item)} className="p-1.5 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
                                                <Edit2 size={16} />
                                            </button>
                                            <button onClick={() => handleDelete(item)} className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Advanced Form Modal */}
            <FormModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                title={editingSession ? 'Edit Meditation' : 'Add New Meditation'}
                onSubmit={handleSubmit}
                size="lg"
            >
                <div className="flex flex-col h-full">
                    {/* Tabs */}
                    <div className="flex border-b border-gray-200 mb-6">
                        <button
                            type="button"
                            onClick={() => setActiveTab('basic')}
                            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'basic' ? 'border-purple-600 text-purple-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                        >
                            Basic Info
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('media')}
                            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'media' ? 'border-purple-600 text-purple-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                        >
                            Media & Content
                        </button>
                        {formData.type === 'Series' && (
                            <button
                                type="button"
                                onClick={() => setActiveTab('series')}
                                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'series' ? 'border-purple-600 text-purple-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                            >
                                Series Episodes
                            </button>
                        )}
                        <button
                            type="button"
                            onClick={() => setActiveTab('preview')}
                            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'preview' ? 'border-purple-600 text-purple-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                        >
                            Preview
                        </button>
                    </div>

                    {/* Tab Content */}
                    <div className="flex-1 overflow-y-auto pr-2">
                        {activeTab === 'basic' && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                                        <input
                                            type="text"
                                            value={formData.title}
                                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Instructor</label>
                                        <input
                                            type="text"
                                            value={formData.instructor}
                                            onChange={e => setFormData({ ...formData, instructor: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                                        <select
                                            value={formData.type}
                                            onChange={e => setFormData({ ...formData, type: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                                        >
                                            <option value="Guided">Guided</option>
                                            <option value="Visualization">Visualization</option>
                                            <option value="Series">Series</option>
                                            <option value="Music">Music</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
                                        <select
                                            value={formData.difficulty}
                                            onChange={e => setFormData({ ...formData, difficulty: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                                        >
                                            <option value="Beginner">Beginner</option>
                                            <option value="Intermediate">Intermediate</option>
                                            <option value="Advanced">Advanced</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                                        <input
                                            type="text"
                                            value={formData.duration}
                                            onChange={e => setFormData({ ...formData, duration: e.target.value })}
                                            placeholder="e.g. 15 min"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                    <textarea
                                        value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                        rows={4}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Cover Art</label>
                                    <FileUploader
                                        value={formData.coverImage}
                                        onChange={(url) => setFormData({ ...formData, coverImage: url })}
                                    />
                                </div>
                            </div>
                        )}

                        {activeTab === 'media' && (
                            <div className="space-y-6">
                                {formData.type !== 'Series' ? (
                                    <>
                                        <div className="flex gap-4 mb-4">
                                            <button
                                                type="button"
                                                onClick={() => setFormData({ ...formData, mediaType: 'upload' })}
                                                className={`flex-1 py-3 px-4 rounded-xl border-2 flex items-center justify-center gap-2 transition-all ${formData.mediaType === 'upload' ? 'border-purple-600 bg-purple-50 text-purple-700' : 'border-gray-200 hover:border-gray-300'}`}
                                            >
                                                <Upload size={20} />
                                                <span className="font-medium">File Upload</span>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setFormData({ ...formData, mediaType: 'youtube' })}
                                                className={`flex-1 py-3 px-4 rounded-xl border-2 flex items-center justify-center gap-2 transition-all ${formData.mediaType === 'youtube' ? 'border-red-600 bg-red-50 text-red-700' : 'border-gray-200 hover:border-gray-300'}`}
                                            >
                                                <Youtube size={20} />
                                                <span className="font-medium">YouTube Embed</span>
                                            </button>
                                        </div>

                                        {formData.mediaType === 'upload' ? (
                                            <div className="space-y-4">
                                                <div className="p-6 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 text-center">
                                                    <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                                                        <Music size={24} />
                                                    </div>
                                                    <h3 className="font-medium text-gray-900">Upload Audio File</h3>
                                                    <p className="text-sm text-gray-500 mt-1 mb-4">MP3, WAV up to 50MB</p>
                                                    <input
                                                        type="file"
                                                        className="hidden"
                                                        id="audio-upload"
                                                        accept="audio/*"
                                                    />
                                                    <label
                                                        htmlFor="audio-upload"
                                                        className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
                                                    >
                                                        Choose File
                                                    </label>
                                                </div>
                                                <div className="p-6 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 text-center">
                                                    <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                                                        <Video size={24} />
                                                    </div>
                                                    <h3 className="font-medium text-gray-900">Upload Video File</h3>
                                                    <p className="text-sm text-gray-500 mt-1 mb-4">MP4, WebM up to 100MB</p>
                                                    <input
                                                        type="file"
                                                        className="hidden"
                                                        id="video-upload"
                                                        accept="video/*"
                                                    />
                                                    <label
                                                        htmlFor="video-upload"
                                                        className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
                                                    >
                                                        Choose File
                                                    </label>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">YouTube URL</label>
                                                    <div className="relative">
                                                        <Youtube className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                                        <input
                                                            type="url"
                                                            value={formData.videoUrl}
                                                            onChange={e => setFormData({ ...formData, videoUrl: e.target.value })}
                                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                                                            placeholder="https://youtube.com/watch?v=..."
                                                        />
                                                    </div>
                                                    <p className="text-xs text-gray-500 mt-1">Paste the full YouTube URL. We'll handle the embedding.</p>
                                                </div>
                                                {formData.videoUrl && (
                                                    <div className="aspect-video bg-black rounded-xl overflow-hidden shadow-sm">
                                                        <iframe
                                                            width="100%"
                                                            height="100%"
                                                            src={getEmbedUrl(formData.videoUrl)}
                                                            title="YouTube video player"
                                                            frameBorder="0"
                                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                            allowFullScreen
                                                        ></iframe>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div className="text-center py-8 text-gray-500">
                                        This is a Series. Please manage content in the "Series Episodes" tab.
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'series' && formData.type === 'Series' && (
                            <div className="space-y-6">
                                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                                    <h4 className="font-medium text-gray-900 mb-3">Add New Episode</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                                        <input
                                            type="text"
                                            placeholder="Episode Title"
                                            value={newSession.title}
                                            onChange={e => setNewSession({ ...newSession, title: e.target.value })}
                                            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                        />
                                        <input
                                            type="text"
                                            placeholder="Duration"
                                            value={newSession.duration}
                                            onChange={e => setNewSession({ ...newSession, duration: e.target.value })}
                                            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                        />
                                        <input
                                            type="url"
                                            placeholder="YouTube URL"
                                            value={newSession.videoUrl}
                                            onChange={e => setNewSession({ ...newSession, videoUrl: e.target.value })}
                                            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleAddSession}
                                        className="w-full py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 text-sm font-medium"
                                    >
                                        Add Episode
                                    </button>
                                </div>

                                <div className="space-y-2">
                                    {parseArrayField(formData.sessions).map((session, index) => (
                                        <div key={session.id} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500">
                                                    {index + 1}
                                                </span>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">{session.title}</p>
                                                    <p className="text-xs text-gray-500">{session.duration} • {session.videoUrl ? 'Video' : 'Audio'}</p>
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveSession(session.id)}
                                                className="text-red-500 hover:text-red-700 p-1"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    ))}
                                    {formData.sessions.length === 0 && (
                                        <div className="text-center py-8 text-gray-400">
                                            No episodes added yet.
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === 'preview' && (
                            <div className="space-y-6">
                                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden max-w-md mx-auto shadow-lg">
                                    <div className="relative aspect-video bg-gray-100">
                                        {formData.mediaType === 'youtube' && formData.videoUrl ? (
                                            <iframe
                                                width="100%"
                                                height="100%"
                                                src={getEmbedUrl(formData.videoUrl)}
                                                title="Preview"
                                                frameBorder="0"
                                                allowFullScreen
                                            ></iframe>
                                        ) : (
                                            <img
                                                src={formData.coverImage || 'https://via.placeholder.com/400x225'}
                                                alt="Cover"
                                                className="w-full h-full object-cover"
                                            />
                                        )}
                                        {formData.mediaType !== 'youtube' && (
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
                                                    <PlayCircle size={24} className="text-purple-600 ml-1" />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">{formData.type}</span>
                                            <span className="text-xs text-gray-500 flex items-center gap-1"><Clock size={12} /> {formData.duration}</span>
                                        </div>
                                        <h3 className="font-bold text-gray-900 text-lg mb-1">{formData.title || 'Untitled Session'}</h3>
                                        <p className="text-sm text-gray-500 mb-3">{formData.instructor || 'Instructor Name'}</p>
                                        <p className="text-sm text-gray-600 line-clamp-3">{formData.description || 'No description provided.'}</p>
                                    </div>
                                </div>
                                <div className="text-center text-sm text-gray-500">
                                    This is how the card will appear to users.
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </FormModal>
            {/* TRENDING MODAL */}
            <TrendingModal
                isOpen={showTrendingModal}
                onClose={() => setShowTrendingModal(false)}
                title="Top Performing Meditations"
                data={trending.length > 0 ? trending : userMeditation}
            />
        </div>
    );
};

export default MeditationManagement;
