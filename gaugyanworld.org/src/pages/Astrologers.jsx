import React, { useState, useEffect } from 'react';
import { Search, Filter, Star, Phone, Video, MessageCircle } from 'lucide-react';
import api from '../utils/api';
import BannerSlider from '../components/BannerSlider';

const Astrologers = () => {
    const [astrologers, setAstrologers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');

    const SPECIALIZATIONS = ['All', 'Vedic', 'Numerology', 'Tarot', 'Vastu', 'Palmistry'];

    useEffect(() => {
        fetchAstrologers();
    }, []);

    const fetchAstrologers = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/astrology/astrologers');
            setAstrologers(data.data || []);
        } catch (error) {
            console.error("Failed to fetch astrologers", error);
            // Mock data for display if API empty (since we just created backend and have no data)
            setAstrologers([
                { id: 1, User: { name: 'Pt. Sharma Ji', profilePicture: null }, specialization: ['Vedic', 'Vastu'], experience: 15, rating: 4.8, consultationFee: 500, languages: ['Hindi', 'English'] },
                { id: 2, User: { name: 'Tarot Riya', profilePicture: null }, specialization: ['Tarot', 'Numerology'], experience: 5, rating: 4.5, consultationFee: 800, languages: ['English'] }
            ]);
        } finally {
            setLoading(false);
        }
    };

    const filteredAstrologers = filter === 'All'
        ? astrologers
        : astrologers.filter(a => a.specialization?.includes(filter));

    return (
        <div className="bg-gray-50 min-h-screen">
            <BannerSlider placement="astrology" />

            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <h1 className="text-3xl font-bold text-gray-800">Talk to Astrologers</h1>

                    {/* Filters */}
                    <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto">
                        {SPECIALIZATIONS.map(spec => (
                            <button
                                key={spec}
                                onClick={() => setFilter(spec)}
                                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${filter === spec ? 'bg-orange-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
                            >
                                {spec}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Grid */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredAstrologers.map(astrologer => (
                            <div key={astrologer.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-5 border border-gray-100 flex flex-col">
                                <div className="flex gap-4">
                                    <div className="relative">
                                        <img
                                            src={astrologer.User?.profilePicture || 'https://via.placeholder.com/150'}
                                            alt={astrologer.User?.name}
                                            className="w-20 h-20 rounded-full object-cover border-2 border-orange-100"
                                        />
                                        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white px-2 py-0.5 rounded-full shadow text-[10px] font-bold flex items-center gap-1 border border-gray-100">
                                            {astrologer.rating} <Star size={10} className="fill-orange-400 text-orange-400" />
                                        </div>
                                    </div>

                                    <div className="flex-1">
                                        <h3 className="font-bold text-lg text-gray-900">{astrologer.User?.name}</h3>
                                        <p className="text-sm text-gray-500 mb-2 truncate max-w-[200px]">
                                            {Array.isArray(astrologer.specialization) ? astrologer.specialization.join(', ') : 'Vedic Astrologer'}
                                        </p>
                                        <div className="flex flex-wrap gap-1 mb-2">
                                            {astrologer.languages?.map(lang => (
                                                <span key={lang} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                                                    {lang}
                                                </span>
                                            ))}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            Exp: <span className="font-semibold text-gray-700">{astrologer.experience} Years</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
                                    <div className="font-bold text-lg text-gray-800">
                                        ₹{astrologer.consultationFee}<span className="text-xs font-normal text-gray-400">/min</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => window.location.href = '/chat'}
                                            className="p-2 text-green-600 bg-green-50 rounded-full hover:bg-green-100 transition-colors"
                                            title="Chat"
                                        >
                                            <MessageCircle size={18} />
                                        </button>
                                        <button className="px-4 py-2 bg-orange-600 text-white text-sm font-bold rounded-full hover:bg-orange-700 transition-colors shadow-sm shadow-orange-200">
                                            Consult Now
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Astrologers;
