import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Sun, Moon, Clock, ChevronLeft, ChevronRight, Star, Shield, ShieldAlert } from 'lucide-react';
import api from '../utils/api';
import BannerSlider from '../components/BannerSlider';

const Panchang = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [panchangData, setPanchangData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPanchang();
    }, [currentDate]);

    const fetchPanchang = async () => {
        setLoading(true);
        try {
            const dateStr = currentDate.toISOString().split('T')[0];
            const { data } = await api.get(`/astrology/panchang/today?date=${dateStr}`);
            setPanchangData(data.data);
        } catch (error) {
            console.error("Failed to fetch panchang", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDateChange = (days) => {
        const newDate = new Date(currentDate);
        newDate.setDate(newDate.getDate() + days);
        setCurrentDate(newDate);
    };

    const formatDate = (date) => {
        return date.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    };

    return (
        <div className="bg-orange-50 min-h-screen pb-12">
            <BannerSlider placement="astrology" /> {/* Placeholder, might fallback to home banner */}

            <div className="container mx-auto px-4 -mt-10 relative z-10">
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
                    {/* Header & Navigation */}
                    <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-orange-800">Daily Panchang</h1>
                            <p className="text-gray-500 flex items-center gap-2 mt-1">
                                <MapPin size={16} /> New Delhi, India
                            </p>
                        </div>

                        <div className="flex items-center gap-4 bg-orange-50 p-2 rounded-full">
                            <button onClick={() => handleDateChange(-1)} className="p-2 hover:bg-orange-100 rounded-full text-orange-700 transition-colors">
                                <ChevronLeft size={24} />
                            </button>
                            <div className="flex items-center gap-2 px-4 font-semibold text-gray-700 min-w-[200px] justify-center">
                                <Calendar size={18} className="text-orange-600" />
                                {formatDate(currentDate)}
                            </div>
                            <button onClick={() => handleDateChange(1)} className="p-2 hover:bg-orange-100 rounded-full text-orange-700 transition-colors">
                                <ChevronRight size={24} />
                            </button>
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
                        </div>
                    ) : panchangData ? (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Main Metrics */}
                            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                                <PanchangCard
                                    icon={Moon}
                                    title="Tithi"
                                    value={panchangData.tithi?.name}
                                    subtext={`Ends at ${panchangData.tithi?.endTime}`}
                                    color="bg-purple-50 text-purple-700"
                                />
                                <PanchangCard
                                    icon={Star}
                                    title="Nakshatra"
                                    value={panchangData.nakshatra?.name}
                                    subtext={`Ends at ${panchangData.nakshatra?.endTime}`}
                                    color="bg-blue-50 text-blue-700"
                                />
                                <PanchangCard
                                    icon={Sun}
                                    title="Yoga"
                                    value={panchangData.yoga?.name}
                                    subtext={`Ends at ${panchangData.yoga?.endTime}`}
                                    color="bg-yellow-50 text-yellow-700"
                                />
                                <PanchangCard
                                    icon={Clock}
                                    title="Karana"
                                    value={panchangData.karana?.name}
                                    subtext={`Ends at ${panchangData.karana?.endTime}`}
                                    color="bg-green-50 text-green-700"
                                />
                            </div>

                            {/* Sun & Moon Times */}
                            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                                <h3 className="font-bold text-gray-800 mb-4">Sun & Moon</h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                                        <div className="flex items-center gap-3 text-gray-600">
                                            <Sun size={20} className="text-orange-500" /> Sunrise
                                        </div>
                                        <span className="font-semibold">{panchangData.sunrise}</span>
                                    </div>
                                    <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                                        <div className="flex items-center gap-3 text-gray-600">
                                            <Moon size={20} className="text-gray-500" /> Sunset
                                        </div>
                                        <span className="font-semibold">{panchangData.sunset}</span>
                                    </div>
                                </div>

                                <h3 className="font-bold text-gray-800 mt-8 mb-4">Timings</h3>
                                <div className="space-y-4">
                                    <TimeRow label="Abhijit Muhurat" time={panchangData.auspicious?.abhijitMuhuarta} type="good" />
                                    <TimeRow label="Rahu Kalam" time={panchangData.inauspicious?.rahuKalam} type="bad" />
                                    <TimeRow label="Yamaganda" time={panchangData.inauspicious?.yamaganda} type="bad" />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-10 text-gray-500">
                            Data not available for this date.
                        </div>
                    )}
                </div>

                {/* Promo for Astrologers */}
                <div className="bg-gradient-to-r from-indigo-900 to-purple-900 rounded-2xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                        <h2 className="text-2xl font-bold mb-2">Need Personal Guidance?</h2>
                        <p className="text-indigo-200">Connect with verified Vedic Astrologers for Kundli analysis and predictions.</p>
                    </div>
                    <a href="/astrology" className="bg-white text-indigo-900 px-8 py-3 rounded-full font-bold hover:bg-indigo-50 transition-colors">
                        Consult Now
                    </a>
                </div>
            </div>
        </div>
    );
};

const PanchangCard = ({ icon: Icon, title, value, subtext, color }) => (
    <div className={`p-6 rounded-xl border border-transparent hover:border-gray-200 transition-colors ${color}`}>
        <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold">{title}</h3>
            <Icon size={24} className="opacity-80" />
        </div>
        <div className="text-2xl font-bold mb-1">{value}</div>
        <div className="text-xs opacity-70">{subtext}</div>
    </div>
);

const TimeRow = ({ label, time, type }) => (
    <div className="flex justify-between items-center">
        <div className="flex items-center gap-2 text-sm text-gray-600">
            {type === 'good' ? <Shield size={14} className="text-green-500" /> : <ShieldAlert size={14} className="text-red-500" />}
            {label}
        </div>
        <span className={`text-sm font-semibold ${type === 'good' ? 'text-green-700' : 'text-red-700'}`}>{time}</span>
    </div>
);

export default Panchang;
