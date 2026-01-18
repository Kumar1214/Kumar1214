import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import { BarChart, MapPin, Music, Heart, Users, ExternalLink } from 'lucide-react';

const AnalyticsWidget = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [range, setRange] = useState('7d');

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                setLoading(true);
                const res = await api.get(`/admin/analytics?range=${range}`);
                if (res.data.success) {
                    setData(res.data.data);
                }
            } catch (error) {
                console.error("Analytics load failed", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, [range]);

    if (loading) return <div className="p-6 bg-white rounded-lg shadow-sm animate-pulse h-64">Loading Analytics...</div>;
    if (!data) return null;

    return (
        <div className="space-y-6">
            {/* Header Controls */}
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <BarChart size={20} className="text-primary" />
                    Platform Analytics
                </h3>
                <div className="flex bg-gray-100 rounded-lg p-1">
                    {['today', '7d', '30d'].map(r => (
                        <button
                            key={r}
                            onClick={() => setRange(r)}
                            className={`px-3 py-1 text-xs font-medium rounded-md capitalize transition-all ${range === r ? 'bg-white shadow text-primary' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            {r === '7d' ? 'Week' : r === '30d' ? 'Month' : 'Today'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Traffic Graph (Simple CSS Bar Chart) */}
            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                <h4 className="text-sm font-semibold text-gray-600 mb-4">Traffic Overview</h4>
                <div className="flex items-end justify-between h-40 gap-2">
                    {data.activity?.map((day, idx) => {
                        const max = Math.max(...data.activity.map(d => d.visits), 10);
                        const height = (day.visits / max) * 100;
                        return (
                            <div key={day.date} className="flex flex-col items-center flex-1 group">
                                <div
                                    className="w-full bg-blue-100 hover:bg-blue-200 rounded-t-sm transition-all relative"
                                    style={{ height: `${height}%`, minHeight: '4px' }}
                                >
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                        {day.visits} Visits<br />{day.uniqueUsers} Users
                                    </div>
                                </div>
                                <span className="text-[10px] text-gray-400 mt-2 truncate w-full text-center">
                                    {new Date(day.date).toLocaleDateString(undefined, { weekday: 'short' })}
                                </span>
                            </div>
                        );
                    })}
                    {(!data.activity || data.activity.length === 0) && (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">No traffic data yet</div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Visitors & Location */}
                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                    <h4 className="text-sm font-semibold text-gray-600 mb-4 flex items-center gap-2">
                        <MapPin size={16} /> Recent Visitors
                    </h4>
                    <div className="space-y-3">
                        {data.recentUsers?.map((visit, i) => (
                            <div key={`${visit.createdAt}-${visit.ipAddress}`} className="flex justify-between items-center text-sm border-b border-gray-50 pb-2 last:border-0 hover:bg-gray-50 p-2 rounded transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${visit.user ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-500'}`}>
                                        {visit.user ? visit.user.name[0] : 'G'}
                                    </div>
                                    <div>
                                        <div className="font-medium text-gray-800">{visit.user ? visit.user.name : 'Guest'}</div>
                                        <div className="text-xs text-gray-400 flex items-center gap-1">
                                            {visit.location ? `${visit.location.city}, ${visit.location.country}` : visit.ipAddress}
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-xs text-gray-500">{new Date(visit.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                    <div className="text-[10px] text-gray-400 max-w-[100px] truncate">{visit.route}</div>
                                </div>
                            </div>
                        ))}
                        {(!data.recentUsers || data.recentUsers.length === 0) && (
                            <div className="text-center text-gray-400 py-4 text-sm">No recent visitors</div>
                        )}
                    </div>
                </div>

                {/* Most Liked Content */}
                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                    <h4 className="text-sm font-semibold text-gray-600 mb-4 flex items-center gap-2">
                        <Heart size={16} className="text-red-400" /> most Liked Content
                    </h4>

                    <div className="space-y-4">
                        {/* Music */}
                        <div>
                            <div className="text-xs font-bold text-gray-400 uppercase mb-2">Top Music</div>
                            {data.content?.music?.map((item, i) => (
                                <div key={item.title} className="flex justify-between text-sm py-1">
                                    <span className="truncate flex-1 pr-2 text-gray-700">{item.title}</span>
                                    <span className="font-mono text-xs bg-red-50 text-red-600 px-2 rounded-full">{item.likes} ❤</span>
                                </div>
                            ))}
                        </div>
                        {/* Meditation */}
                        <div>
                            <div className="text-xs font-bold text-gray-400 uppercase mb-2 mt-4">Top Meditation</div>
                            {data.content?.meditation?.map((item, i) => (
                                <div key={item.title} className="flex justify-between text-sm py-1">
                                    <span className="truncate flex-1 pr-2 text-gray-700">{item.title}</span>
                                    <span className="font-mono text-xs bg-red-50 text-red-600 px-2 rounded-full">{item.likes} ❤</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            {/* Most Wishlisted */}
            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                <h4 className="text-sm font-semibold text-gray-600 mb-4 flex items-center gap-2">
                    <ShoppingBag size={16} className="text-orange-400" /> Most Wishlisted Products
                </h4>
                <div className="grid grid-cols-2 gap-4">
                    {data.wishlist?.map((item, i) => (
                        <div key={item.id} className="bg-gray-50 p-2 rounded flex justify-between items-center">
                            <span className="text-sm text-gray-700 font-medium">Product #{item.id}</span>
                            <span className="bg-white shadow-sm px-2 py-1 rounded text-xs font-bold text-orange-600">{item.count}</span>
                        </div>
                    ))}
                    {(!data.wishlist || data.wishlist.length === 0) && (
                        <div className="col-span-2 text-center text-gray-400 py-4 text-sm">No wishlist data available</div>
                    )}
                </div>
            </div>
        </div>
    );
};

// Helper icon
const ShoppingBag = ({ size, className }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
        <line x1="3" y1="6" x2="21" y2="6"></line>
        <path d="M16 10a4 4 0 0 1-8 0"></path>
    </svg>
)


export default AnalyticsWidget;
