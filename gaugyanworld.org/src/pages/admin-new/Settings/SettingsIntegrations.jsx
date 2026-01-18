import React, { useState, useEffect } from 'react';
import { Save, Key, Globe } from 'lucide-react';
import api from '../../../utils/api';

const SettingsIntegrations = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [settings, setSettings] = useState({
        newsApiKey: ''
    });

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                // Fetch settings from API
                const res = await api.get('/settings/integrations');
                if (res.data && res.data.settings) {
                    const parsed = res.data.settings;
                    setSettings(prev => ({
                        ...prev,
                        newsApiKey: parsed.newsApiKey || ''
                    }));
                }
            } catch (error) {
                console.error("Failed to load integration settings", error);
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
            await api.put('/settings/integrations', {
                settings: settings
            });
            alert('Integration settings saved successfully!');
        } catch (error) {
            console.error('Error saving settings:', error);
            alert('Failed to save settings.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-8">Loading settings...</div>;

    return (
        <div className="max-w-4xl">
            <div className="bg-white rounded-xl">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <Globe className="text-orange-500" size={24} />
                        External Integrations
                    </h2>
                    <p className="text-gray-500 mt-1">Manage API keys and external service connections</p>
                </div>

                <div className="p-6 space-y-8">
                    {/* NewsAPI Integration */}
                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                                    <Key size={18} className="text-blue-500" />
                                    NewsAPI Integration
                                </h3>
                                <p className="text-sm text-gray-500 mt-1">
                                    Configure your NewsAPI key to fetch live news. Get one at <a href="https://newsapi.org" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">newsapi.org</a>.
                                </p>
                            </div>
                            <div className={`px-2 py-1 rounded text-xs font-semibold ${settings.newsApiKey ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>
                                {settings.newsApiKey ? 'Connected' : 'Not Configured'}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">API Key</label>
                                <input
                                    type="text" // Use text so they can see it, or password if preferred. Usually API keys are treated like passwords.
                                    value={settings.newsApiKey}
                                    onChange={(e) => handleChange('newsApiKey', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none font-mono text-sm"
                                    placeholder="Enter your NewsAPI Key"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Future Integrations can go here */}

                    {/* Actions */}
                    <div className="flex justify-end pt-6 border-t border-gray-100">
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className={`
                                flex items-center gap-2 px-6 py-3 rounded-lg text-white font-semibold shadow-md transition-all
                                ${saving ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 hover:shadow-lg'}
                            `}
                        >
                            <Save size={18} />
                            {saving ? 'Saving...' : 'Save Configuration'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsIntegrations;
