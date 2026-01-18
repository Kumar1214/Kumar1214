
import React, { useState, useEffect } from 'react';
import { MessageSquare, Star, Check, X, Trash2, Search, Filter, AlertCircle, Quote, Sparkles, ShieldAlert } from 'lucide-react';
import api from '../../../services/api';
import toast from 'react-hot-toast';

const Reviews = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        try {
            const { data } = await api.get('/reviews');
            if (data.success) setReviews(data.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // DEBUG ONLY: Function to seed a test review
    const createTestReview = async (isSpam) => {
        try {
            await api.post('/reviews', {
                rating: 1,
                comment: isSpam ? "This is a stupid fake spam review with bad words." : "This is a great product, I loved it!",
                targetType: 'product',
                targetId: 1
            });
            toast.success(isSpam ? "Spam review created (Auto-flagged?)" : "Safe review created (Auto-approved?)");
            fetchReviews();
        } catch (e) {
            toast.error("Failed to create test review");
        }
    };


    const [filterStatus, setFilterStatus] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredReviews = reviews.filter(review => {
        const matchesSearch =
            (review.User?.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            review.comment.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesFilter = filterStatus === 'all' || review.status === filterStatus;

        return matchesSearch && matchesFilter;
    });

    const handleAction = async (id, action) => {
        if (action === 'delete') {
            // Delete logic if needed
        } else {
            try {
                await api.put(`/reviews/${id}/status`, { status: action });
                toast.success(`Review ${action}`);
                fetchReviews();
            } catch (e) {
                toast.error("Action failed");
            }
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'approved': return 'bg-green-100 text-green-700 border-green-200';
            case 'rejected': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-yellow-100 text-yellow-700 border-yellow-200';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-[#0c2d50] to-[#EA580C] px-8 py-12 text-white shadow-lg">
                <div className="max-w-7xl mx-auto flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                            <MessageSquare className="h-8 w-8 text-orange-300" />
                            Review Moderation (AI Powered)
                        </h1>
                        <p className="text-blue-100 opacity-90">
                            AI automatically flags suspicious content. Safe content is auto-approved.
                        </p>
                    </div>
                    {/* Test Buttons */}
                    <div className="space-x-2">
                        <button onClick={() => createTestReview(false)} className="bg-white/10 hover:bg-white/20 px-3 py-1 rounded text-xs border border-white/20">
                            + Test Safe
                        </button>
                        <button onClick={() => createTestReview(true)} className="bg-red-500/20 hover:bg-red-500/30 px-3 py-1 rounded text-xs border border-red-400/50">
                            + Test Spam
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex-1 px-4 py-8 max-w-7xl mx-auto w-full -mt-8">

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <p className="text-sm text-gray-500 font-medium mb-1">Total Reviews</p>
                        <p className="text-3xl font-bold text-gray-900">{reviews.length}</p>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <p className="text-sm text-gray-500 font-medium mb-1">Pending</p>
                        <p className="text-3xl font-bold text-yellow-600">{reviews.filter(r => r.status === 'pending').length}</p>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <p className="text-sm text-gray-500 font-medium mb-1">Average Rating</p>
                        <div className="flex items-center gap-2">
                            <p className="text-3xl font-bold text-blue-600">
                                {(reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length || 0).toFixed(1)}
                            </p>
                            <Star className="text-yellow-400 fill-yellow-400" size={24} />
                        </div>

                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <p className="text-sm text-gray-500 font-medium mb-1">Approval Body</p>
                        <p className="text-3xl font-bold text-green-600">
                            {Math.round((reviews.filter(r => r.status === 'approved').length / reviews.length || 0) * 100)}%
                        </p>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                    {/* Filters */}
                    <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="relative w-full md:w-96">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search review content or user..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition-shadow"
                            />
                        </div>
                        <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto">
                            {['all', 'pending', 'approved', 'rejected'].map(status => (
                                <button
                                    key={status}
                                    onClick={() => setFilterStatus(status)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium capitalize whitespace-nowrap transition-colors ${filterStatus === status
                                        ? 'bg-orange-100 text-orange-700 border border-orange-200'
                                        : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                                        }`}
                                >
                                    {status}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Reviews List */}
                    <div className="divide-y divide-gray-100">
                        {filteredReviews.length > 0 ? (
                            filteredReviews.map(review => (
                                <div key={review.id} className="p-6 hover:bg-gray-50 transition-colors group">
                                    <div className="flex flex-col md:flex-row gap-6">
                                        {/* User Info */}
                                        <div className="flex-shrink-0 flex md:flex-col items-center md:items-start gap-3 md:w-48">
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={review.avatar}
                                                    alt={review.user}
                                                    className="w-10 h-10 rounded-full bg-gray-200"
                                                />
                                                <div>
                                                    <div className="font-semibold text-gray-900">{review.User?.name || 'Unknown'}</div>
                                                    <div className="text-xs text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</div>
                                                </div>
                                            </div>
                                            <span className={`mt-2 md:mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize border ${getStatusColor(review.status)}`}>
                                                {review.status}
                                            </span>
                                        </div>

                                        {/* Review Content */}
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className="flex">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            size={16}
                                                            className={i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}
                                                        />
                                                    ))}
                                                </div>
                                                <span className="text-sm font-medium text-gray-700">Type: {review.targetType}</span>
                                            </div>

                                            {/* AI Badge */}
                                            {review.aiFlagged && (
                                                <div className="mb-2 inline-flex items-center gap-2 px-3 py-1 bg-red-50 border border-red-100 rounded-md text-red-700 text-xs font-bold">
                                                    <ShieldAlert size={12} />
                                                    AI FLAGGED: {review.aiReason} ({(review.aiConfidence * 100).toFixed(0)}% Conf.)
                                                </div>
                                            )}
                                            {!review.aiFlagged && (
                                                <div className="mb-2 inline-flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-100 rounded-md text-blue-700 text-xs font-bold">
                                                    <Sparkles size={12} />
                                                    AI CLEAN
                                                </div>
                                            )}

                                            <div className="relative pl-6">
                                                <Quote size={18} className="absolute left-0 top-0 text-gray-300 transform -scale-x-100" />
                                                <p className="text-gray-600 leading-relaxed italic">
                                                    {review.comment}
                                                </p>
                                            </div>

                                        </div>

                                        {/* Actions */}
                                        <div className="flex md:flex-col gap-2 justify-end md:border-l md:border-gray-100 md:pl-6 md:min-w-[140px]">
                                            {review.status === 'pending' && (
                                                <>
                                                    <button
                                                        onClick={() => handleAction(review.id, 'approved')}
                                                        className="flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 hover:bg-green-100 rounded-md text-sm font-medium transition-colors"
                                                    >
                                                        <Check size={16} /> Approve
                                                    </button>
                                                    <button
                                                        onClick={() => handleAction(review.id, 'rejected')}
                                                        className="flex items-center gap-2 px-3 py-1.5 bg-yellow-50 text-yellow-700 hover:bg-yellow-100 rounded-md text-sm font-medium transition-colors"
                                                    >
                                                        <X size={16} /> Reject
                                                    </button>
                                                </>
                                            )}
                                            {review.status === 'rejected' && (
                                                <button
                                                    onClick={() => handleAction(review.id, 'approved')}
                                                    className="flex items-center gap-2 px-3 py-1.5 bg-white border border-green-200 text-green-700 hover:bg-green-50 rounded-md text-sm font-medium transition-colors"
                                                >
                                                    <Check size={16} /> Approve
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleAction(review.id, 'delete')}
                                                className="flex items-center gap-2 px-3 py-1.5 text-red-600 hover:bg-red-50 rounded-md text-sm font-medium transition-colors md:mt-auto"
                                            >
                                                <Trash2 size={16} /> Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-12 text-center text-gray-500">
                                <AlertCircle size={48} className="mx-auto text-gray-300 mb-4" />
                                <p className="text-lg font-medium">No reviews found</p>
                                <p className="text-sm">Try adjusting your filters or search query.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Reviews;
