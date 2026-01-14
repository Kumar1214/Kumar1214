import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Bell, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import api from '../../utils/api';

const AIWelcomeWidget = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAISummary = async () => {
            try {
                const { data } = await api.get('/admin/ai-summary');
                if (data.success) {
                    setData(data.data);
                }
            } catch (error) {
                console.error("Failed to load AI summary", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAISummary();
    }, []);

    if (loading) return (
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg animate-pulse h-48">
            <div className="h-6 w-1/3 bg-white/20 rounded mb-4"></div>
            <div className="h-4 w-1/2 bg-white/20 rounded"></div>
        </div>
    );

    if (!data) return null;

    return (
        <div className="bg-gradient-to-r from-[#0c2d50] to-[#2563eb] rounded-2xl p-0 overflow-hidden shadow-xl text-white relative mb-8">
            {/* Abstract Background Shapes */}
            <div className="absolute top-0 right-0 p-12 opacity-10">
                <Sparkles size={120} />
            </div>
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>

            <div className="relative p-6 md:p-8">
                <div className="flex flex-col md:flex-row justify-between gap-6">

                    {/* Greeting Section */}
                    <div className="flex-1">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-xs font-semibold tracking-wide uppercase mb-3 text-blue-100">
                            <Sparkles size={12} /> AI Insight Source
                        </div>
                        <h2 className="text-3xl font-bold mb-2">{data.greeting}!</h2>
                        <p className="text-blue-100 text-lg opacity-90 max-w-xl">
                            Here is your daily briefing. I've analyzed the platform activity and identified a few areas for your attention.
                        </p>
                    </div>

                    {/* Action Cards */}
                    <div className="flex-1 md:max-w-xl">
                        <div className="space-y-3">
                            {data.summary.map((item, idx) => (
                                <div key={idx} className="bg-white/10 backdrop-blur-md border border-white/10 rounded-xl p-3 flex items-center justify-between hover:bg-white/20 transition-colors group">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg ${item.type === 'urgent' ? 'bg-red-500/20 text-red-200' :
                                            item.type === 'warning' ? 'bg-amber-500/20 text-amber-200' :
                                                'bg-blue-500/20 text-blue-200'
                                            }`}>
                                            {item.type === 'urgent' && <AlertCircle size={18} />}
                                            {item.type === 'warning' && <Clock size={18} />}
                                            {item.type === 'info' && <Bell size={18} />}
                                            {item.type === 'success' && <CheckCircle size={18} />}
                                        </div>
                                        <span className="text-sm font-medium text-white/90">{item.message}</span>
                                    </div>
                                    {item.link && (
                                        item.link.startsWith('#') ? (
                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    const element = document.querySelector(item.link);
                                                    if (element) {
                                                        element.scrollIntoView({ behavior: 'smooth' });
                                                    }
                                                }}
                                                className="px-3 py-1.5 bg-white text-[#0c2d50] text-xs font-bold rounded-lg shadow-sm flex items-center gap-1 hover:bg-blue-50 transition-colors"
                                            >
                                                {item.action} <ArrowRight size={12} />
                                            </button>
                                        ) : (
                                            <Link to={item.link} className="px-3 py-1.5 bg-white text-[#0c2d50] text-xs font-bold rounded-lg shadow-sm flex items-center gap-1 hover:bg-blue-50 transition-colors">
                                                {item.action} <ArrowRight size={12} />
                                            </Link>
                                        )
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default AIWelcomeWidget;
