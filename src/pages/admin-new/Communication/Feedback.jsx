import React, { useState, useEffect } from 'react';
import { Mail, Trash2, CheckCircle, Search, Filter, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { feedbackService } from '../../../services/api';
import toast from 'react-hot-toast';

const Feedback = () => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedFeedback, setSelectedFeedback] = useState(null);

    const fetchFeedbacks = React.useCallback(async () => {
        setLoading(true);
        try {
            const params = {};
            if (filterStatus !== 'all') params.status = filterStatus;

            const response = await feedbackService.getFeedbacks(params);
            if (response.data.success) {
                setFeedbacks(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching feedbacks:', error);
            // toast.error('Failed to load feedback');
        } finally {
            setLoading(false);
        }
    }, [filterStatus]);

    useEffect(() => {
        fetchFeedbacks();
    }, [fetchFeedbacks]);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this feedback?')) {
            try {
                await feedbackService.deleteFeedback(id);
                toast.success('Feedback deleted successfully');
                setFeedbacks(feedbacks.filter(f => f._id !== id));
                if (selectedFeedback && selectedFeedback._id === id) setSelectedFeedback(null);
            } catch {
                toast.error('Failed to delete feedback');
            }
        }
    };

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            const response = await feedbackService.updateStatus(id, newStatus);
            if (response.data.success) {
                setFeedbacks(feedbacks.map(f => f._id === id ? response.data.data : f));
                if (selectedFeedback && selectedFeedback._id === id) {
                    setSelectedFeedback(response.data.data);
                }
                toast.success(`Marked as ${newStatus}`);
            }
        } catch {
            toast.error('Failed to update status');
        }
    };

    const filteredFeedbacks = feedbacks.filter(feedback =>
        feedback.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        feedback.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        feedback.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-6 h-[calc(100vh-80px)] flex gap-6">
            {/* Left List Panel */}
            <div className={`flex-1 flex flex-col bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden ${selectedFeedback ? 'hidden md:flex' : 'flex'}`}>
                {/* Header */}
                <div className="p-4 border-b border-gray-100 flex flex-col gap-4">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold text-gray-800">Feedback</h2>
                        <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-semibold">
                            {feedbacks.length} Messages
                        </span>
                    </div>
                    <div className="flex gap-2">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search by name, email or subject..."
                                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <select
                            className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 cursor-pointer"
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                        >
                            <option value="all">All Status</option>
                            <option value="new">New</option>
                            <option value="read">Read</option>
                            <option value="replied">Replied</option>
                        </select>
                    </div>
                </div>

                {/* List */}
                <div className="flex-1 overflow-y-auto">
                    {loading ? (
                        <div className="flex justify-center items-center h-40">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        </div>
                    ) : filteredFeedbacks.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                            <Mail size={48} className="mb-4 opacity-50" />
                            <p>No messages found</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-50">
                            {filteredFeedbacks.map((item) => (
                                <div
                                    key={item._id}
                                    onClick={() => {
                                        setSelectedFeedback(item);
                                        if (item.status === 'new') handleStatusUpdate(item._id, 'read');
                                    }}
                                    className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${selectedFeedback?._id === item._id ? 'bg-blue-50/50 border-l-4 border-blue-500' : 'border-l-4 border-transparent'} ${item.status === 'new' ? 'bg-white' : 'bg-gray-50/30'}`}
                                >
                                    <div className="flex justify-between items-start mb-1">
                                        <h3 className={`text-sm font-semibold text-gray-900 line-clamp-1 ${item.status === 'new' ? 'font-bold' : 'font-medium'}`}>
                                            {item.name}
                                        </h3>
                                        <span className="text-xs text-gray-400 whitespace-nowrap ml-2">
                                            {new Date(item.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p className={`text-sm text-gray-800 mb-1 line-clamp-1 ${item.status === 'new' ? 'font-semibold' : ''}`}>
                                        {item.subject}
                                    </p>
                                    <p className="text-xs text-gray-500 line-clamp-2">
                                        {item.message}
                                    </p>
                                    <div className="mt-2 flex items-center gap-2 flex-wrap">
                                        {/* Status Badge */}
                                        <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider
                                            ${item.status === 'new' ? 'bg-blue-100 text-blue-600' :
                                                item.status === 'read' ? 'bg-gray-200 text-gray-600' :
                                                    'bg-green-100 text-green-600'}`}>
                                            {item.status}
                                        </span>

                                        {/* AI Priority Badge */}
                                        {item.aiPriority === 'high' && (
                                            <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider bg-red-100 text-red-600 border border-red-200">
                                                High Priority
                                            </span>
                                        )}

                                        {/* AI Tags */}
                                        {item.aiTags && item.aiTags.map(tag => (
                                            <span key={tag} className="px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider bg-purple-50 text-purple-600 border border-purple-100">
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Right Detailed Panel */}
            <div className={`flex-[1.5] bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col ${selectedFeedback ? 'flex' : 'hidden md:flex'}`}>
                {selectedFeedback ? (
                    <>
                        {/* Detail Header */}
                        <div className="p-6 border-b border-gray-100 flex justify-between items-start">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-500/20">
                                    {selectedFeedback.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900 mb-1">{selectedFeedback.subject}</h2>
                                    <div className="flex flex-col text-sm text-gray-500">
                                        <span className="font-medium text-gray-800">{selectedFeedback.name}</span>
                                        <span className="text-blue-600 cursor-pointer hover:underline" onClick={() => window.location.href = `mailto:${selectedFeedback.email}`}>
                                            &lt;{selectedFeedback.email}&gt;
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleStatusUpdate(selectedFeedback._id, selectedFeedback.status === 'replied' ? 'read' : 'replied')}
                                    className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                    title={selectedFeedback.status === 'replied' ? "Mark as Read" : "Mark as Replied"}
                                >
                                    <CheckCircle size={20} />
                                </button>
                                <button
                                    onClick={() => handleDelete(selectedFeedback._id)}
                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                    title="Delete"
                                >
                                    <Trash2 size={20} />
                                </button>
                                <button
                                    className="md:hidden p-2 text-gray-400 hover:text-gray-600"
                                    onClick={() => setSelectedFeedback(null)}
                                >
                                    Back
                                </button>
                            </div>
                        </div>

                        {/* Detail Body */}
                        <div className="p-8 flex-1 overflow-y-auto">
                            <div className="prose max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
                                {selectedFeedback.message}
                            </div>
                        </div>

                        {/* Detail Footer (Quick Actions) */}
                        <div className="p-6 bg-gray-50 border-t border-gray-100 flex gap-4">
                            <a
                                href={`mailto:${selectedFeedback.email}?subject=Re: ${selectedFeedback.subject}`}
                                className="px-6 py-2.5 bg-[#0c2d50] text-white rounded-lg hover:bg-[#0a2644] font-medium transition-all shadow-sm hover:shadow-md flex items-center gap-2"
                                onClick={() => handleStatusUpdate(selectedFeedback._id, 'replied')}
                            >
                                <Mail size={18} /> Reply via Email
                            </a>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-8 text-center">
                        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                            <Mail size={40} className="text-gray-300" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Select a message</h3>
                        <p className="max-w-xs text-sm">Choose a message from the list to view details and manage feedback.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Feedback;
