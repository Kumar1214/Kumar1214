import React, { useState, useEffect } from 'react';
import { Mail, Save, AlertCircle } from 'lucide-react';
import api from '../../../utils/api';
import FormModal from '../../../components/FormModal';

const SettingsEmail = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);
    const [showTestModal, setShowTestModal] = useState(false);
    const [sendingTest, setSendingTest] = useState(false);

    const [settings, setSettings] = useState({
        smtpHost: '',
        smtpPort: '587',
        smtpUsername: '',
        smtpPassword: '',
        emailFrom: '',
        emailFromName: 'Gaugyan'
    });

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                // Fetch email settings from API
                const res = await api.get('/settings/email');
                if (res.data && res.data.settings) {
                    const parsed = res.data.settings;
                    setSettings(prev => ({
                        ...prev,
                        smtpHost: parsed.smtpHost || '',
                        smtpPort: parsed.smtpPort || '587',
                        smtpUsername: parsed.smtpUsername || '',
                        smtpPassword: parsed.smtpPassword || '',
                        emailFrom: parsed.emailFrom || '',
                        emailFromName: parsed.emailFromName || 'Gaugyan'
                    }));
                }
            } catch (error) {
                console.error("Failed to load email settings", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSettings();
    }, []);

    const handleChange = (field, value) => {
        setSettings(prev => ({ ...prev, [field]: value }));
        setHasChanges(true);
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            // Save to API
            await api.put('/settings/email', {
                settings: settings
            });
            setHasChanges(false);
            alert('Email settings saved successfully!');
        } catch (error) {
            console.error('Error saving settings:', error);
            alert('Failed to save settings.');
        } finally {
            setSaving(false);
        }
    };

    const handleSendTestEmail = async (data) => {
        const { testEmail } = data;
        if (!testEmail) return;

        setSendingTest(true);
        try {
            await api.post('/settings/email/test', { to: testEmail });
            alert('Test email sent successfully to ' + testEmail);
            setShowTestModal(false);
        } catch (e) {
            alert('Failed to send test email: ' + (e.response?.data?.error || e.message));
        } finally {
            setSendingTest(false);
        }
    };

    if (loading) return <div className="p-8">Loading settings...</div>;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Gradient Banner */}
            <div className="bg-gradient-to-r from-[#0c2d50] to-[#EA580C] px-8 py-12 text-white shadow-lg">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                        <Mail className="h-8 w-8" />
                        Email Configuration
                    </h1>
                    <p className="text-blue-100 opacity-90">
                        Configure SMTP server details for sending system emails.
                    </p>
                </div>
            </div>

            <div className="flex-1 px-4 py-8 max-w-4xl mx-auto w-full -mt-8">
                <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 md:p-8">

                    {hasChanges && (
                        <div className="mb-6 bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-center gap-3 text-amber-800 animate-fade-in">
                            <AlertCircle size={20} />
                            <span className="font-medium">You have unsaved changes. Save them before testing!</span>
                        </div>
                    )}

                    <div className="grid gap-8">
                        {/* SMTP Server Settings */}
                        <div>
                            <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100">
                                SMTP Server
                            </h2>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">SMTP Host</label>
                                    <input
                                        type="text"
                                        value={settings.smtpHost}
                                        onChange={(e) => handleChange('smtpHost', e.target.value)}
                                        placeholder="e.g. smtp.gmail.com"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">SMTP Port</label>
                                    <input
                                        type="text"
                                        value={settings.smtpPort}
                                        onChange={(e) => handleChange('smtpPort', e.target.value)}
                                        placeholder="587"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Authentication */}
                        <div>
                            <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100">
                                Authentication
                            </h2>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">SMTP Username</label>
                                    <input
                                        type="text"
                                        value={settings.smtpUsername}
                                        onChange={(e) => handleChange('smtpUsername', e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">SMTP Password</label>
                                    <input
                                        type="password"
                                        value={settings.smtpPassword}
                                        onChange={(e) => handleChange('smtpPassword', e.target.value)}
                                        placeholder="••••••••••••••••"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Sender Details */}
                        <div>
                            <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100">
                                Sender Information
                            </h2>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">From Email Address</label>
                                    <input
                                        type="email"
                                        value={settings.emailFrom}
                                        onChange={(e) => handleChange('emailFrom', e.target.value)}
                                        placeholder="noreply@domain.com"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">From Name</label>
                                    <input
                                        type="text"
                                        value={settings.emailFromName}
                                        onChange={(e) => handleChange('emailFromName', e.target.value)}
                                        placeholder="Platform Name"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex justify-between pt-6 border-t border-gray-100">
                            <button
                                onClick={() => {
                                    if (hasChanges) {
                                        if (!window.confirm('You have unsaved changes. Test email will use OLD settings. Continue?')) {
                                            return;
                                        }
                                    }
                                    setShowTestModal(true);
                                }}
                                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 flex items-center gap-2"
                            >
                                <Mail size={16} />
                                Send Test Email
                            </button>

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

            {/* Test Email Modal */}
            <FormModal
                isOpen={showTestModal}
                onClose={() => setShowTestModal(false)}
                title="Send Test Email"
                onSubmit={handleSendTestEmail}
                isLoading={sendingTest}
                submitText="Send Test"
                fields={[
                    { name: 'testEmail', label: 'Recipient Email', type: 'email', required: true, placeholder: 'Enter email address' }
                ]}
            />
        </div>
    );
};

export default SettingsEmail;
