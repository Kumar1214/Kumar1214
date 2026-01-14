import React, { useState, useEffect } from 'react';
import { Save, Bell, Mail, MessageSquare, Send } from 'lucide-react';

export default function SettingsNotifications() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Lazy initialize state
  const [settings, setSettings] = useState(() => {
    const defaultSettings = {
      enableEmailNotifications: true,
      enablePushNotifications: true,
      enableSmsNotifications: false,
      welcomeEmailTemplate: 'Welcome to Gaugyan! We are glad to have you.',
      resetPasswordEmailTemplate: 'Click the link below to reset your password.',
      orderConfirmationEmailTemplate: 'Thank you for your order! detailed below.',
      adminEmail: 'admin@gaugyan.com'
    };
    try {
      const saved = localStorage.getItem('appSettings');
      return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
    } catch {
      return defaultSettings;
    }
  });

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (field, value) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    setSaving(true);
    try {
      const existing = JSON.parse(localStorage.getItem('appSettings') || '{}');
      localStorage.setItem('appSettings', JSON.stringify({ ...existing, ...settings }));
      setTimeout(() => {
        setSaving(false);
        alert('Notification settings saved successfully!');
      }, 800);
    } catch (error) {
      console.error(error);
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading settings...</div>;

  return (
    <div className="space-y-6">
      {/* Header Banner with Gradient */}
      <div className="rounded-2xl p-8 text-white shadow-lg relative overflow-hidden"
        style={{
          backgroundImage: 'linear-gradient(45deg, #0c2d50 0%, #1F5B6B 100%)'
        }}
      >
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">Notification Settings</h1>
          <p className="opacity-90 text-lg">Configure system alerts, email templates, and messaging preferences.</p>
        </div>
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-16 -mt-16 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full -ml-10 -mb-10 pointer-events-none"></div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 space-y-8">

          {/* Notification Channels */}
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Bell size={20} className="text-primary" />
              Notification Channels
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Email Toggle */}
              <div className={`p-4 rounded-xl border transition-all cursor-pointer ${settings.enableEmailNotifications ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'}`}
                onClick={() => handleChange('enableEmailNotifications', !settings.enableEmailNotifications)}>
                <div className="flex items-center justify-between mb-2">
                  <Mail size={24} className={settings.enableEmailNotifications ? 'text-blue-600' : 'text-gray-400'} />
                  <div className={`w-10 h-5 rounded-full p-0.5 transition-colors ${settings.enableEmailNotifications ? 'bg-blue-600' : 'bg-gray-300'}`}>
                    <div className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform ${settings.enableEmailNotifications ? 'translate-x-5' : 'translate-x-0'}`} />
                  </div>
                </div>
                <div className="font-semibold text-gray-800">Email Notifications</div>
                <div className="text-xs text-gray-500 mt-1">Send system emails to users</div>
              </div>

              {/* Push Toggle - using primary color */}
              <div className={`p-4 rounded-xl border transition-all cursor-pointer ${settings.enablePushNotifications ? 'bg-[#F0F9FB] border-primary/20' : 'bg-gray-50 border-gray-200'}`}
                onClick={() => handleChange('enablePushNotifications', !settings.enablePushNotifications)}>
                <div className="flex items-center justify-between mb-2">
                  <Bell size={24} className={settings.enablePushNotifications ? 'text-primary' : 'text-gray-400'} />
                  <div className={`w-10 h-5 rounded-full p-0.5 transition-colors ${settings.enablePushNotifications ? 'bg-primary' : 'bg-gray-300'}`}>
                    <div className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform ${settings.enablePushNotifications ? 'translate-x-5' : 'translate-x-0'}`} />
                  </div>
                </div>
                <div className="font-semibold text-gray-800">Push Notifications</div>
                <div className="text-xs text-gray-500 mt-1">Web and mobile app alerts</div>
              </div>

              {/* SMS Toggle */}
              <div className={`p-4 rounded-xl border transition-all cursor-pointer ${settings.enableSmsNotifications ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}
                onClick={() => handleChange('enableSmsNotifications', !settings.enableSmsNotifications)}>
                <div className="flex items-center justify-between mb-2">
                  <MessageSquare size={24} className={settings.enableSmsNotifications ? 'text-green-600' : 'text-gray-400'} />
                  <div className={`w-10 h-5 rounded-full p-0.5 transition-colors ${settings.enableSmsNotifications ? 'bg-green-600' : 'bg-gray-300'}`}>
                    <div className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform ${settings.enableSmsNotifications ? 'translate-x-5' : 'translate-x-0'}`} />
                  </div>
                </div>
                <div className="font-semibold text-gray-800">SMS Notifications</div>
                <div className="text-xs text-gray-500 mt-1">OTP and urgent alerts</div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100 my-6"></div>

          {/* Email Templates */}
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Mail size={20} className="text-primary" />
              Email Configuration
            </h3>

            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Admin Email Address</label>
                <input
                  type="email"
                  value={settings.adminEmail}
                  onChange={(e) => handleChange('adminEmail', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Welcome Email Template</label>
                  <textarea
                    value={settings.welcomeEmailTemplate}
                    onChange={(e) => handleChange('welcomeEmailTemplate', e.target.value)}
                    rows="4"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Reset Password Template</label>
                  <textarea
                    value={settings.resetPasswordEmailTemplate}
                    onChange={(e) => handleChange('resetPasswordEmailTemplate', e.target.value)}
                    rows="4"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Order Confirmation Template</label>
                <textarea
                  value={settings.orderConfirmationEmailTemplate}
                  onChange={(e) => handleChange('orderConfirmationEmailTemplate', e.target.value)}
                  rows="4"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none resize-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer with Save Button */}
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
