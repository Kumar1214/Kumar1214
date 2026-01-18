import React, { useState, useEffect } from 'react';
import { Save, Monitor, Layout, FileCode, DollarSign } from 'lucide-react';
import ImageUploader from '../../../components/ImageUploader';

export default function SettingsAds() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Lazy initialize state
  const [settings, setSettings] = useState(() => {
    const defaultSettings = {
      enableAds: false,
      googleAdsenseId: '',
      bannerAdImage: '',
      bannerAdLink: '',
      sidebarAdImage: '',
      sidebarAdLink: '',
      popupAdImage: '',
      popupAdLink: '',
      popupAdEnabled: false,
      adScripts: ''
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
        alert('Ad settings saved successfully!');
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
          backgroundImage: 'linear-gradient(45deg, #0c2d50 0%, #EA580C 100%)'
        }}
      >
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">Advertisement Settings</h1>
          <p className="opacity-90 text-lg">Manage ad placements, Google AdSense, and promotional banners.</p>
        </div>
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-16 -mt-16 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full -ml-10 -mb-10 pointer-events-none"></div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 space-y-8">

          {/* Global Toggle */}
          <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg border border-orange-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white rounded-full text-orange-600 shadow-sm">
                <DollarSign size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Enable Advertisements</h3>
                <p className="text-sm text-gray-600">Toggle all ad display on the platform</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleChange('enableAds', !settings.enableAds)}
              className={`w-14 h-7 rounded-full p-1 cursor-pointer transition-colors duration-200 ease-in-out ${settings.enableAds ? 'bg-orange-600' : 'bg-gray-300'} border-none focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500`}
              aria-pressed={settings.enableAds}
              aria-label="Toggle advertisements"
            >
              <div className={`w-5 h-5 rounded-full bg-white shadow-sm transform transition-transform duration-200 ease-in-out ${settings.enableAds ? 'translate-x-7' : 'translate-x-0'}`} />
            </button>
          </div>

          <div className="border-t border-gray-100 my-6"></div>

          {/* Google AdSense */}
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FileCode size={20} className="text-[#EA580C]" />
              Google AdSense
            </h3>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Publisher ID</label>
                <input
                  type="text"
                  value={settings.googleAdsenseId}
                  onChange={(e) => handleChange('googleAdsenseId', e.target.value)}
                  placeholder="pub-xxxxxxxxxxxxxxxx"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Custom Ad Scripts (Head)</label>
                <textarea
                  value={settings.adScripts}
                  onChange={(e) => handleChange('adScripts', e.target.value)}
                  rows="4"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none font-mono text-sm"
                  placeholder="<script>...</script>"
                />
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100 my-6"></div>

          {/* Custom Banners */}
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Layout size={20} className="text-[#EA580C]" />
              Custom Ad Banners
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Main Banner */}
              <div className="p-4 border border-gray-200 rounded-lg">
                <h4 className="font-medium text-gray-700 mb-3">Homepage Banner</h4>
                <ImageUploader
                  label="Banner Image"
                  value={settings.bannerAdImage ? [settings.bannerAdImage] : []}
                  onChange={(urls) => handleChange('bannerAdImage', urls[0] || '')}
                />
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Target URL</label>
                  <input
                    type="url"
                    value={settings.bannerAdLink}
                    onChange={(e) => handleChange('bannerAdLink', e.target.value)}
                    className="w-full px-3 py-2 rounded border border-gray-300 focus:border-orange-500 outline-none"
                  />
                </div>
              </div>

              {/* Sidebar Banner */}
              <div className="p-4 border border-gray-200 rounded-lg">
                <h4 className="font-medium text-gray-700 mb-3">Sidebar Banner</h4>
                <ImageUploader
                  label="Banner Image"
                  value={settings.sidebarAdImage ? [settings.sidebarAdImage] : []}
                  onChange={(urls) => handleChange('sidebarAdImage', urls[0] || '')}
                />
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Target URL</label>
                  <input
                    type="url"
                    value={settings.sidebarAdLink}
                    onChange={(e) => handleChange('sidebarAdLink', e.target.value)}
                    className="w-full px-3 py-2 rounded border border-gray-300 focus:border-orange-500 outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100 my-6"></div>

          {/* Popup Ad */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <Monitor size={20} className="text-[#EA580C]" />
                Popup Validations
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-600">Active</span>
                <button
                  type="button"
                  onClick={() => handleChange('popupAdEnabled', !settings.popupAdEnabled)}
                  className={`w-10 h-5 rounded-full p-0.5 cursor-pointer transition-colors duration-200 ease-in-out ${settings.popupAdEnabled ? 'bg-orange-600' : 'bg-gray-300'} border-none focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500`}
                  aria-pressed={settings.popupAdEnabled}
                  aria-label="Toggle popup ad"
                >
                  <div className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform duration-200 ease-in-out ${settings.popupAdEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>
            </div>

            <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <ImageUploader
                    label="Popup Image"
                    value={settings.popupAdImage ? [settings.popupAdImage] : []}
                    onChange={(urls) => handleChange('popupAdImage', urls[0] || '')}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Target URL</label>
                  <input
                    type="url"
                    value={settings.popupAdLink}
                    onChange={(e) => handleChange('popupAdLink', e.target.value)}
                    className="w-full px-3 py-2 rounded border border-gray-300 focus:border-orange-500 outline-none mb-4"
                  />
                  <p className="text-xs text-gray-500">
                    This popup will appear once per session for all users when enabled.
                  </p>
                </div>
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

