import React, { useState, useEffect } from 'react';
import { Save, CreditCard, DollarSign, Key, Shield } from 'lucide-react';
import { settingsService } from '../../../services/api';

export default function SettingsPayment() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [settings, setSettings] = useState({
        currencyCode: 'INR',
        currencySymbol: '₹',
        razorpayKeyId: '',
        razorpayKeySecret: '',
        stripePublishableKey: '',
        stripeSecretKey: '',
        enableRazorpay: true,
        enableStripe: false
    });

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                setLoading(true);
                // Using 'payment' as the key for payment settings
                const response = await settingsService.getSettings('payment');
                if (response.data && response.data.settings) {
                    setSettings(prev => ({ ...prev, ...response.data.settings }));
                }
            } catch (error) {
                console.error('Error fetching settings:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const handleChange = (field, value) => {
        setSettings(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await settingsService.updateSettings('payment', settings);
            alert('Payment settings saved successfully!');
        } catch (error) {
            console.error('Error saving settings:', error);
            alert('Failed to save settings.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Loading settings...</div>;

    return (
        <div className="space-y-6">
            {/* Header Banner */}
            <div className="rounded-2xl p-8 text-white shadow-lg relative overflow-hidden"
                style={{ backgroundImage: 'linear-gradient(45deg, #0c2d50 0%, #1F5B6B 100%)' }}
            >
                <div className="relative z-10">
                    <h1 className="text-3xl font-bold mb-2">Payment Settings</h1>
                    <p className="opacity-90 text-lg">Configure currency, payment gateways, and API keys.</p>
                </div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-16 -mt-16 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full -ml-10 -mb-10 pointer-events-none"></div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 space-y-8">

                    {/* General Config */}
                    <div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <DollarSign size={20} className="text-primary" />
                            Currency Configuration
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Currency Code</label>
                                <input
                                    type="text"
                                    value={settings.currencyCode}
                                    onChange={(e) => handleChange('currencyCode', e.target.value)}
                                    placeholder="e.g. INR, USD"
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Currency Symbol</label>
                                <input
                                    type="text"
                                    value={settings.currencySymbol}
                                    onChange={(e) => handleChange('currencySymbol', e.target.value)}
                                    placeholder="e.g. ₹, $"
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-gray-100 my-6"></div>

                    {/* Razorpay Config */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                                <CreditCard size={20} className="text-blue-600" />
                                Razorpay Configuration
                            </h3>
                            <div className={`p-2 rounded-lg cursor-pointer border transition-all ${settings.enableRazorpay ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'}`}
                                onClick={() => handleChange('enableRazorpay', !settings.enableRazorpay)}>
                                <div className="flex items-center gap-2">
                                    <div className={`w-4 h-4 rounded border flex items-center justify-center ${settings.enableRazorpay ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-400'}`}>
                                        {settings.enableRazorpay && <div className="w-2 h-2 bg-white rounded-sm" />}
                                    </div>
                                    <span className="text-sm font-medium">Enable Razorpay</span>
                                </div>
                            </div>
                        </div>

                        <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${!settings.enableRazorpay ? 'opacity-50 pointer-events-none' : ''}`}>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Key ID</label>
                                <div className="relative">
                                    <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="password"
                                        value={settings.razorpayKeyId}
                                        onChange={(e) => handleChange('razorpayKeyId', e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Key Secret</label>
                                <div className="relative">
                                    <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="password"
                                        value={settings.razorpayKeySecret}
                                        onChange={(e) => handleChange('razorpayKeySecret', e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-gray-100 my-6"></div>

                    {/* Stripe Config */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                                <CreditCard size={20} className="text-purple-600" />
                                Stripe Configuration
                            </h3>
                            <div className={`p-2 rounded-lg cursor-pointer border transition-all ${settings.enableStripe ? 'bg-purple-50 border-purple-200' : 'bg-gray-50 border-gray-200'}`}
                                onClick={() => handleChange('enableStripe', !settings.enableStripe)}>
                                <div className="flex items-center gap-2">
                                    <div className={`w-4 h-4 rounded border flex items-center justify-center ${settings.enableStripe ? 'bg-purple-600 border-purple-600' : 'bg-white border-gray-400'}`}>
                                        {settings.enableStripe && <div className="w-2 h-2 bg-white rounded-sm" />}
                                    </div>
                                    <span className="text-sm font-medium">Enable Stripe</span>
                                </div>
                            </div>
                        </div>

                        <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${!settings.enableStripe ? 'opacity-50 pointer-events-none' : ''}`}>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Publishable Key</label>
                                <div className="relative">
                                    <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="password"
                                        value={settings.stripePublishableKey}
                                        onChange={(e) => handleChange('stripePublishableKey', e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Secret Key</label>
                                <div className="relative">
                                    <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="password"
                                        value={settings.stripeSecretKey}
                                        onChange={(e) => handleChange('stripeSecretKey', e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end">
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 px-6 py-2.5 bg-[#0c2d50] hover:bg-[#091e35] text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all disabled:opacity-70"
                    >
                        {saving ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save size={18} />
                                Save Changes
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
