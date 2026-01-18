import React from 'react';
import { X, Eye, Share2, Bookmark, BarChart2 } from 'lucide-react';

const TrendingModal = ({ isOpen, onClose, title, data, metricKey = 'views', metricLabel = 'Views' }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] shadow-2xl flex flex-col animate-in fade-in zoom-in duration-200">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">{title || 'Trending Content'}</h2>
                        <p className="text-sm text-gray-500 mt-0.5">Top 50 items ranked by engagement</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-600"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-0">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50 border-b border-gray-100 sticky top-0 z-10">
                            <tr>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider w-16">Rank</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Title/Content</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">{metricLabel}</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Shares</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Bookmarks</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {data && data.length > 0 ? data.map((item, index) => (
                                <tr key={item.id} className="hover:bg-gray-50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${index < 3 ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-600'
                                            }`}>
                                            {index + 1}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-gray-900 line-clamp-1">{item.title || item.name || 'Untitled'}</div>
                                        <div className="text-xs text-gray-500">{item.category}</div>
                                    </td>
                                    <td className="px-6 py-4 text-right font-semibold text-gray-900">
                                        {item[metricKey]?.toLocaleString() || 0}
                                    </td>
                                    <td className="px-6 py-4 text-right text-gray-600 text-sm">
                                        {item.shares?.toLocaleString() || 0}
                                    </td>
                                    <td className="px-6 py-4 text-right text-gray-600 text-sm">
                                        {item.bookmarks?.toLocaleString() || 0}
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-gray-400">
                                        <BarChart2 className="mx-auto mb-3 opacity-20" size={48} />
                                        <p>No data available to display</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="p-6 border-t border-gray-100 flex justify-end bg-gray-50 rounded-b-2xl">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium shadow-sm"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TrendingModal;
