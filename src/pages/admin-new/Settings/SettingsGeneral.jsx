import React, { useState, useEffect } from 'react';
import { Save, Globe, Phone, Mail, Facebook, Instagram, Twitter, Linkedin, Youtube, AlertCircle } from 'lucide-react';
import { settingsService } from '../../../services/api';

export default function SettingsGeneral() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    siteName: 'Gaugyan',
    siteDescription: 'Your gateway to Vedic knowledge and spiritual growth',
    contactEmail: '',
    contactPhone: '',
    maintenanceMode: false,
    allowRegistration: true,
    facebookUrl: '',
    instagramUrl: '',
    twitterUrl: '',
    youtubeUrl: '',
    linkedinUrl: ''
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const response = await settingsService.getSettings('general');
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
      await settingsService.updateSettings('general', settings);
      alert('General settings saved successfully!');
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
          <h1 className="text-3xl font-bold mb-2">General Settings</h1>
          <p className="opacity-90 text-lg">Manage site information, contact details, and social media links.</p>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-16 -mt-16 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full -ml-10 -mb-10 pointer-events-none"></div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 space-y-8">
          {/* Site Information */}
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Globe size={20} className="text-primary" />
              Site Information
            </h3>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Site Name</label>
                <input
                  type="text"
                  value={settings.siteName}
                  onChange={(e) => handleChange('siteName', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">about Content (Home Page)</label>
                <textarea
                  value={settings.siteDescription}
                  onChange={(e) => handleChange('siteDescription', e.target.value)}
                  rows="5"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all resize-none"
                />
                <p className="text-xs text-gray-500 mt-1">This text appears in the "About" section on the Home page.</p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100 my-6"></div>

          {/* Contact Information */}
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Phone size={20} className="text-primary" />
              Contact Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="email"
                    value={settings.contactEmail}
                    onChange={(e) => handleChange('contactEmail', e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Phone</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="tel"
                    value={settings.contactPhone}
                    onChange={(e) => handleChange('contactPhone', e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100 my-6"></div>

          {/* Social Media */}
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Globe size={20} className="text-primary" />
              Social Media Links
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {['Facebook', 'Instagram', 'Twitter', 'YouTube', 'LinkedIn'].map(platform => {
                const field = `${platform.toLowerCase()}Url`;
                const Icon = { Facebook, Instagram, Twitter, YouTube: Youtube, LinkedIn: Linkedin }[platform];
                return (
                  <div key={platform}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{platform}</label>
                    <div className="relative">
                      <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        type="url"
                        value={settings[field]}
                        onChange={(e) => handleChange(field, e.target.value)}
                        placeholder={`https://${platform.toLowerCase()}.com/...`}
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="border-t border-gray-100 my-6"></div>

          {/* System Config */}
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <AlertCircle size={20} className="text-primary" />
              System Config
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className={`p-4 rounded-lg cursor-pointer border transition-all ${settings.maintenanceMode ? 'bg-[#F0F9FB] border-primary/30' : 'bg-gray-50 border-gray-200 hover:border-primary/30'}`}
                onClick={() => handleChange('maintenanceMode', !settings.maintenanceMode)}>
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded border flex items-center justify-center ${settings.maintenanceMode ? 'bg-primary border-primary' : 'bg-white border-gray-400'}`}>
                    {settings.maintenanceMode && <div className="w-2.5 h-2.5 bg-white rounded-sm" />}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800">Maintenance Mode</div>
                    <div className="text-xs text-gray-500">Disable direct user access</div>
                  </div>
                </div>
              </div>

              <div className={`p-4 rounded-lg cursor-pointer border transition-all ${settings.allowRegistration ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200 hover:border-blue-200'}`}
                onClick={() => handleChange('allowRegistration', !settings.allowRegistration)}>
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded border flex items-center justify-center ${settings.allowRegistration ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-400'}`}>
                    {settings.allowRegistration && <div className="w-2.5 h-2.5 bg-white rounded-sm" />}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800">Allow Registration</div>
                    <div className="text-xs text-gray-500">New users can sign up</div>
                  </div>
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
