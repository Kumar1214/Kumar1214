import React, { useState } from 'react';
import { useData } from '../../../context/useData';
import { CheckCircle, Eye, Edit, Trash2, X, Save, MoreVertical } from 'lucide-react';

const Approvals = () => {
    const {
        courses, updateCourse, deleteCourse,
        products, updateProduct, deleteProduct,
        music, updateMusic, deleteMusic,
        podcasts, updatePodcast, deletePodcast,
        meditation, updateMeditation, deleteMeditation,
        news, updateNews, deleteNews
    } = useData();

    const [activeTab, setActiveTab] = useState('all');
    const [viewItem, setViewItem] = useState(null);
    const [editItem, setEditItem] = useState(null);

    // Helper to get pending items
    const getPendingItems = (items, type) => {
        if (!items) return [];
        return items.filter(item => item.status !== 'approved' && item.status !== 'published').map(item => ({ ...item, contentType: type }));
    };

    const getSubmitterName = (item) => {
        // Check specific fields based on content type or just fallback through all possible ones
        const submitter = item.instructor || item.artist || item.vendor || item.author || item.host;

        if (!submitter) return 'Unknown User';

        // If submitter is an object (populated user), return name
        if (typeof submitter === 'object') {
            return submitter.name || submitter.email || 'Unknown User';
        }

        // If submitter is a string (ID or name), return it
        return submitter;
    };

    const pendingItems = [
        ...getPendingItems(courses, 'Course'),
        ...getPendingItems(products, 'Product'),
        ...getPendingItems(music, 'Music'),
        ...getPendingItems(podcasts, 'Podcast'),
        ...getPendingItems(meditation, 'Meditation'),
        ...getPendingItems(news, 'News')
    ];

    const filteredItems = activeTab === 'all'
        ? pendingItems
        : pendingItems.filter(item => item.contentType === activeTab);

    const handleApprove = (item) => {
        // const updateData = { status: item.contentType === 'News' ? 'published' : 'approved' };
        // Logic simplified for demo
        const updateData = { status: 'approved' };
        if (item.contentType === 'News') updateData.status = 'published';

        switch (item.contentType) {
            case 'Course': updateCourse(item.id, updateData); break;
            case 'Product': updateProduct(item.id, updateData); break;
            case 'Music': updateMusic(item.id, updateData); break;
            case 'Podcast': updatePodcast(item.id, updateData); break;
            case 'Meditation': updateMeditation(item.id, updateData); break;
            case 'News': updateNews(item.id, updateData); break;
            default: break;
        }
    };

    const handleDelete = (item) => {
        if (window.confirm('Are you sure you want to reject and delete this item?')) {
            switch (item.contentType) {
                case 'Course': deleteCourse(item.id); break;
                case 'Product': deleteProduct(item.id); break;
                case 'Music': deleteMusic(item.id); break;
                case 'Podcast': deletePodcast(item.id); break;
                case 'Meditation': deleteMeditation(item.id); break;
                case 'News': deleteNews(item.id); break;
                default: break;
            }
        }
    };

    const handleUpdate = (e) => {
        e.preventDefault();
        const { contentType, id, ...data } = editItem;
        const updateData = { ...data };
        // delete updateData.contentType; // Not needed if we carefully select fields

        switch (contentType) {
            case 'Course': updateCourse(id, updateData); break;
            case 'Product': updateProduct(id, updateData); break;
            case 'Music': updateMusic(id, updateData); break;
            case 'Podcast': updatePodcast(id, updateData); break;
            case 'Meditation': updateMeditation(id, updateData); break;
            case 'News': updateNews(id, updateData); break;
            default: break;
        }
        setEditItem(null);
    };

    return (
        <div className="p-6">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-[#0c2d50]">Content Approvals</h2>
                <p className="text-gray-500 mt-1">Review and approve content submitted by instructors, artists, and vendors.</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-3 mb-6 overflow-x-auto pb-2 scrollbar-hide">
                {['All', 'Auto-Triage', 'Course', 'Product', 'Music', 'Podcast', 'Meditation', 'News'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab === 'All' ? 'all' : tab)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap flex items-center gap-2
                            ${(activeTab === 'all' && tab === 'All') || activeTab === tab
                                ? 'bg-[#0c2d50] text-white shadow-md'
                                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                            }`}
                    >
                        {tab === 'Auto-Triage' && <span className="mr-1">✨</span>}
                        {tab}
                        {tab === 'All' && pendingItems.length > 0 && (
                            <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">{pendingItems.length}</span>
                        )}
                    </button>
                ))}
            </div>

            {/* Grid Layout */}
            {filteredItems.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                    <div className="w-16 h-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle size={32} />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">All caught up!</h3>
                    <p className="text-gray-500">No pending content to approve.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredItems.map((item) => {
                        // Mock AI Scoring Logic
                        const aiScore = Math.floor(Math.random() * (99 - 80) + 80);
                        const isHighConfidence = aiScore > 90;

                        return (
                            <div key={`${item.contentType}-${item.id}`} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow flex flex-col h-full relative group">
                                {/* AI Badge */}
                                <div className="absolute top-3 left-3 z-10">
                                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider shadow-sm flex items-center gap-1 ${isHighConfidence ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                        ✨ AI Score: {aiScore}%
                                    </span>
                                </div>


                                {/* Image Section */}
                                <div className="relative h-44 bg-gray-100">
                                    <img
                                        src={item.image || item.coverArt || item.featuredImage || (item.images && item.images[0]) || 'https://via.placeholder.com/300x200'}
                                        alt={item.title || item.name}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute top-3 right-3">
                                        <span className="px-2 py-1 rounded bg-black/60 text-white text-xs font-medium backdrop-blur-sm">
                                            {item.contentType}
                                        </span>
                                    </div>
                                </div>

                                {/* Content Section */}
                                <div className="p-4 flex-1 flex flex-col">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-semibold text-gray-900 line-clamp-2 leading-tight">
                                            {item.title || item.name}
                                        </h3>
                                        <button className="text-gray-400 hover:text-gray-600"><MoreVertical size={16} /></button>
                                    </div>
                                    <div className="text-sm text-gray-500 mb-4">
                                        by {getSubmitterName(item)}
                                    </div>

                                    {/* Footer Section */}
                                    <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleApprove(item)}
                                                className="p-1.5 rounded-md bg-green-50 text-green-600 hover:bg-green-100 transition-colors"
                                                title="Approve"
                                            >
                                                <CheckCircle size={18} />
                                            </button>
                                        </div>
                                        <div className="flex gap-1">
                                            <button onClick={() => setViewItem(item)} className="p-1.5 rounded-md text-gray-500 hover:bg-gray-100 transition-colors" title="View">
                                                <Eye size={18} />
                                            </button>
                                            <button onClick={() => setEditItem({ ...item })} className="p-1.5 rounded-md text-blue-500 hover:bg-blue-50 transition-colors" title="Edit">
                                                <Edit size={18} />
                                            </button>
                                            <button onClick={() => handleDelete(item)} className="p-1.5 rounded-md text-red-500 hover:bg-red-50 transition-colors" title="Reject">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* View Modal */}
            {
                viewItem && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                        <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center z-10">
                                <h3 className="text-lg font-bold text-gray-900">Content Details</h3>
                                <button onClick={() => setViewItem(null)} className="text-gray-400 hover:text-gray-600">
                                    <X size={24} />
                                </button>
                            </div>
                            <div className="p-6">
                                <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden mb-6">
                                    <img
                                        src={viewItem.image || viewItem.coverArt || viewItem.featuredImage || (viewItem.images && viewItem.images[0]) || 'https://via.placeholder.com/600x400'}
                                        alt={viewItem.title || viewItem.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="space-y-6">
                                    <div>
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wide block mb-1">Title</label>
                                        <p className="text-xl font-semibold text-gray-900">{viewItem.title || viewItem.name}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wide block mb-1">Description</label>
                                        <p className="text-gray-600 leading-relaxed">{viewItem.description || viewItem.content || 'No description provided.'}</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div>
                                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wide block mb-1">Type</label>
                                            <p className="font-medium text-gray-900">{viewItem.contentType}</p>
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wide block mb-1">Submitted By</label>
                                            <p className="font-medium text-gray-900">{getSubmitterName(viewItem)}</p>
                                        </div>
                                        {viewItem.price !== undefined && (
                                            <div>
                                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wide block mb-1">Price</label>
                                                <p className="font-medium text-gray-900">₹{viewItem.price}</p>
                                            </div>
                                        )}
                                        {viewItem.category && (
                                            <div>
                                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wide block mb-1">Category</label>
                                                <p className="font-medium text-gray-900">{viewItem.category}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 rounded-b-xl border-t border-gray-100">
                                <button onClick={() => setViewItem(null)} className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors">
                                    Close
                                </button>
                                <button onClick={() => { handleApprove(viewItem); setViewItem(null); }} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium flex items-center gap-2 transition-colors">
                                    <CheckCircle size={18} /> Approve Now
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* Edit Modal */}
            {
                editItem && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                        <div className="bg-white rounded-xl shadow-xl w-full max-w-lg">
                            <form onSubmit={handleUpdate}>
                                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                                    <h3 className="text-lg font-bold text-gray-900">Edit Content</h3>
                                    <button type="button" onClick={() => setEditItem(null)} className="text-gray-400 hover:text-gray-600">
                                        <X size={24} />
                                    </button>
                                </div>
                                <div className="p-6 space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                        <input
                                            type="text"
                                            value={editItem.title || editItem.name || ''}
                                            onChange={(e) => setEditItem({ ...editItem, [editItem.title !== undefined ? 'title' : 'name']: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0c2d50] focus:border-[#0c2d50] outline-none"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                        <textarea
                                            rows="4"
                                            value={editItem.description || editItem.content || ''}
                                            onChange={(e) => setEditItem({ ...editItem, [editItem.description !== undefined ? 'description' : 'content']: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0c2d50] focus:border-[#0c2d50] outline-none"
                                        ></textarea>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                            <input
                                                type="text"
                                                value={editItem.category || ''}
                                                onChange={(e) => setEditItem({ ...editItem, category: e.target.value })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0c2d50] focus:border-[#0c2d50] outline-none"
                                            />
                                        </div>
                                        {editItem.price !== undefined && (
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                                                <input
                                                    type="number"
                                                    value={editItem.price}
                                                    onChange={(e) => setEditItem({ ...editItem, price: Number(e.target.value) })}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0c2d50] focus:border-[#0c2d50] outline-none"
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="px-6 py-4 bg-gray-50 rounded-b-xl border-t border-gray-100 flex justify-end gap-3">
                                    <button type="button" onClick={() => setEditItem(null)} className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors">
                                        Cancel
                                    </button>
                                    <button type="submit" className="px-4 py-2 bg-[#0c2d50] text-white rounded-lg hover:bg-[#0a2644] font-medium flex items-center gap-2 transition-colors">
                                        <Save size={18} /> Save Changes
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )
            }
        </div >
    );
};

export default Approvals;
