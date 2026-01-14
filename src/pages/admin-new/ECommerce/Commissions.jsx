
import React, { useState, useEffect } from 'react';
import { Save, Percent, Tag, Info } from 'lucide-react';
import { contentService } from '../../../services/api';
import toast from 'react-hot-toast';

const Commissions = () => {
    const [saving, setSaving] = useState(false);
    const [commissions, setCommissions] = useState([]);

    useEffect(() => {
        fetchCommissions();
    }, []);

    const fetchCommissions = async () => {
        try {
            const response = await contentService.getCommissions();
            if (response.data.success) {
                setCommissions(response.data.data);
            }
        } catch (error) {
            console.error("Fetch commissions error:", error);
            // Fallback
            setCommissions([
                { id: 1, category: 'Food & Nutrition', rate: 10 },
                { id: 2, category: 'Pooja Essentials', rate: 15 },
            ]);
        }
    };

    const handleRateChange = (id, newRate) => {
        setCommissions(commissions.map(c => c.id === id ? { ...c, rate: newRate } : c));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            // Update all explicitly or optimize to tracked changes. 
            // For now, loop and update.
            await Promise.all(commissions.map(c => contentService.updateCommission(c.id, c.rate)));
            toast.success('Commission rates updated successfully!');
        } catch (error) {
            console.error("Save error:", error);
            toast.error("Failed to save commission rates");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-[#0c2d50] to-[#EA580C] px-8 py-12 text-white shadow-lg">
                <div className="max-w-5xl mx-auto">
                    <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                        <Percent className="h-8 w-8" />
                        Commission Management
                    </h1>
                    <p className="text-blue-100 opacity-90">
                        Set platform commission rates for different product categories.
                    </p>
                </div>
            </div>

            <div className="flex-1 px-4 py-8 max-w-5xl mx-auto w-full -mt-8">

                <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden p-8">

                    <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex gap-3 mb-8">
                        <Info className="text-blue-600 flex-shrink-0" />
                        <div>
                            <h4 className="font-semibold text-blue-900">How it works</h4>
                            <p className="text-sm text-blue-800 mt-1">
                                The percentage set here will be automatically deducted from vendor sales for each category transaction. Changes usually take effect immediately for new orders.
                            </p>
                        </div>
                    </div>

                    <div className="grid gap-4">
                        {commissions.map((item) => (
                            <div key={item.id} className="flex items-center justify-between p-5 bg-gray-50 rounded-xl border border-gray-100 hover:border-gray-300 transition-all group">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-white rounded-lg shadow-sm text-gray-500 group-hover:text-orange-600 transition-colors">
                                        <Tag size={20} />
                                    </div>
                                    <span className="font-semibold text-gray-800 text-lg">{item.category}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <input
                                            type="number"
                                            min="0"
                                            max="100"
                                            value={item.rate}
                                            onChange={(e) => handleRateChange(item.id, parseFloat(e.target.value))}
                                            className="w-24 pl-4 pr-8 py-2 text-center rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 outline-none font-bold text-gray-800"
                                        />
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 font-bold">%</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className={`
                                flex items-center gap-2 px-8 py-3 rounded-lg text-white font-semibold shadow-md transition-all
                                ${saving ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#0c2d50] hover:bg-[#0a2340] hover:shadow-lg'}
                            `}
                        >
                            {saving ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save size={20} />
                                    Save Commission Rates
                                </>
                            )}
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Commissions;
