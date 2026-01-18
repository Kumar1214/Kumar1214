
import React, { useState, useEffect } from 'react';
import { Save, Globe, Key, Palette, Image as ImageIcon, CreditCard, Lock, MessageSquare, Smartphone } from 'lucide-react';
import ImageUploader from '../../../components/ImageUploader';
import { settingsService } from '../../../services/api';

export default function SettingsApp() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general'); // general, integrations, mobile

  const [settings, setSettings] = useState({
    // API Integration
    razorpayKeyId: '',
    razorpayKeySecret: '',
    razorpayMode: 'test',
    googleMapsApiKey: '',
    firebaseApiKey: '',
    firebaseAuthDomain: '',
    firebaseProjectId: '',
    smsGatewayApiKey: '',
    smsGatewaySenderId: '',

    // Appearance
    primaryColor: '#F97316',
    secondaryColor: '#4F46E5',
    accentColor: '#10B981',
    logo: '',
    favicon: '',
    darkMode: false,
    fontFamily: 'Inter',

    // Mobile App
    mobileAppName: 'GauGyan',
    mobileAppVersion: '1.0.0',
    mobileAppPackageName: 'com.gaugyan.app',
    enablePushNotifications: true,
    forceUpdate: false,

    // Preloader
    preloaderEnabled: true,
    preloaderType: 'video',
    preloaderImage: '',
    preloaderVideo: '/intro-video.mp4',
    preloaderOnce: false,
    preloaderHideLoggedIn: false,
    preloaderHideAdmin: true,
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await settingsService.getSettings('app');
      if (response.data && response.data.settings) {
        setSettings(prev => ({ ...prev, ...response.data.settings }));
      }
    } catch (error) {
      console.error('Failed to fetch settings', error);
      // alert('Failed to load settings from server.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await settingsService.saveSettings('app', settings);

      // Also update localStorage for immediate app-wide availability if needed, 
      // though ideally app should fetch from API
      localStorage.setItem('appSettings', JSON.stringify(settings));

      setTimeout(() => {
        setSaving(false);
        alert('App settings saved successfully!');
      }, 800);
    } catch (error) {
      console.error(error);
      setSaving(false);
      alert('Failed to save settings.');
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
          <h1 className="text-3xl font-bold mb-2">App & Integration Settings</h1>
          <p className="opacity-90 text-lg">Configure API keys, payment gateways, and application appearance.</p>
        </div>
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-16 -mt-16 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full -ml-10 -mb-10 pointer-events-none"></div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-gray-200">
        <button
          className={`px-4 py-2 font-medium border-b-2 transition-colors ${activeTab === 'general' ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('general')}
        >
          Appearance
        </button>
        <button
          className={`px-4 py-2 font-medium border-b-2 transition-colors ${activeTab === 'integrations' ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('integrations')}
        >
          Integrations
        </button>
        <button
          className={`px-4 py-2 font-medium border-b-2 transition-colors ${activeTab === 'mobile' ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('mobile')}
        >
          Mobile App
        </button>
        <button
          className={`px-4 py-2 font-medium border-b-2 transition-colors ${activeTab === 'preloader' ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('preloader')}
        >
          Preloader
        </button>
      </div>

      <div className="space-y-6">

        {/* 1. Appearance Section */}
        {activeTab === 'general' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden p-6 animate-fade-in">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Palette size={20} className="text-[#EA580C]" />
              Appearance
            </h3>

            <div className="space-y-6">
              {/* Logo & Favicon */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Main Logo</label>
                  <ImageUploader
                    label=""
                    value={settings.logo ? [settings.logo] : []}
                    onChange={(urls) => handleChange('logo', urls[0] || '')}
                  />
                  {settings.logo && (
                    <div className="mt-3 p-4 bg-gray-50 rounded-lg flex justify-center">
                      <img src={settings.logo} alt="Logo Preview" className="h-12 object-contain" />
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Favicon</label>
                  <ImageUploader
                    label=""
                    value={settings.favicon ? [settings.favicon] : []}
                    onChange={(urls) => handleChange('favicon', urls[0] || '')}
                  />
                  {settings.favicon && (
                    <div className="mt-3 p-4 bg-gray-50 rounded-lg flex justify-center">
                      <img src={settings.favicon} alt="Favicon Preview" className="h-8 w-8 object-contain" />
                    </div>
                  )}
                </div>
              </div>

              {/* Colors & Font */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Color Scheme</label>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={settings.primaryColor}
                        onChange={(e) => handleChange('primaryColor', e.target.value)}
                        className="h-10 w-14 rounded cursor-pointer border-0 p-0"
                      />
                      <div className="flex-1">
                        <div className="text-sm font-medium">Primary Color</div>
                        <div className="text-xs text-gray-500 uppercase">{settings.primaryColor}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={settings.secondaryColor}
                        onChange={(e) => handleChange('secondaryColor', e.target.value)}
                        className="h-10 w-14 rounded cursor-pointer border-0 p-0"
                      />
                      <div className="flex-1">
                        <div className="text-sm font-medium">Secondary Color</div>
                        <div className="text-xs text-gray-500 uppercase">{settings.secondaryColor}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={settings.accentColor}
                        onChange={(e) => handleChange('accentColor', e.target.value)}
                        className="h-10 w-14 rounded cursor-pointer border-0 p-0"
                      />
                      <div className="flex-1">
                        <div className="text-sm font-medium">Accent Color</div>
                        <div className="text-xs text-gray-500 uppercase">{settings.accentColor}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Font Family</label>
                  <select
                    value={settings.fontFamily}
                    onChange={(e) => handleChange('fontFamily', e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                  >
                    <option value="Inter">Inter</option>
                    <option value="Roboto">Roboto</option>
                    <option value="Open Sans">Open Sans</option>
                    <option value="Poppins">Poppins</option>
                    <option value="Lato">Lato</option>
                  </select>

                  <div className="mt-6 flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-800">Dark Mode</div>
                      <div className="text-xs text-gray-500">Enable dark theme switcher</div>
                    </div>
                    <div
                      onClick={() => handleChange('darkMode', !settings.darkMode)}
                      className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors duration-200 ease-in-out ${settings.darkMode ? 'bg-[#0c2d50]' : 'bg-gray-300'}`}
                    >
                      <div className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform duration-200 ease-in-out ${settings.darkMode ? 'translate-x-6' : 'translate-x-0'}`} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. API Integrations */}
        {activeTab === 'integrations' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden p-6 animate-fade-in">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Key size={20} className="text-[#EA580C]" />
              API Integrations
            </h3>

            <div className="space-y-8">
              {/* Razorpay Section */}
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <CreditCard className="text-orange-500" size={18} />
                  Razorpay Payment Gateway
                </h4>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Key ID</label>
                    <input
                      type="text"
                      value={settings.razorpayKeyId}
                      onChange={(e) => handleChange('razorpayKeyId', e.target.value)}
                      placeholder="rzp_test_..."
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Key Secret</label>
                    <input
                      type="password"
                      value={settings.razorpayKeySecret}
                      onChange={(e) => handleChange('razorpayKeySecret', e.target.value)}
                      placeholder="••••••••••••••••"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Mode</label>
                    <select
                      value={settings.razorpayMode || 'test'}
                      onChange={(e) => handleChange('razorpayMode', e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all bg-white"
                    >
                      <option value="test">Test / Sandbox</option>
                      <option value="live">Live / Production</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Google Maps Section */}
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Globe className="text-blue-500" size={18} />
                  Google Maps API
                </h4>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">API Key</label>
                  <input
                    type="text"
                    value={settings.googleMapsApiKey || ''}
                    onChange={(e) => handleChange('googleMapsApiKey', e.target.value)}
                    placeholder="AIzaSy..."
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  />
                  <p className="text-xs text-gray-500 mt-2">Required for address autocomplete and map views.</p>
                </div>
              </div>

              {/* Firebase Section */}
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-yellow-400 flex items-center justify-center text-xs font-bold text-white">F</div>
                  Firebase Configuration
                </h4>
                <div className="grid gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">API Key</label>
                    <input
                      type="text"
                      value={settings.firebaseApiKey || ''}
                      onChange={(e) => handleChange('firebaseApiKey', e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition-all"
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Auth Domain</label>
                      <input
                        type="text"
                        value={settings.firebaseAuthDomain || ''}
                        onChange={(e) => handleChange('firebaseAuthDomain', e.target.value)}
                        placeholder="app.firebaseapp.com"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Project ID</label>
                      <input
                        type="text"
                        value={settings.firebaseProjectId || ''}
                        onChange={(e) => handleChange('firebaseProjectId', e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* SMS Section */}
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <MessageSquare className="text-green-500" size={18} />
                  SMS Gateway
                </h4>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">API Key</label>
                    <input
                      type="text"
                      value={settings.smsGatewayApiKey || ''}
                      onChange={(e) => handleChange('smsGatewayApiKey', e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Sender ID</label>
                    <input
                      type="text"
                      value={settings.smsGatewaySenderId || ''}
                      onChange={(e) => handleChange('smsGatewaySenderId', e.target.value)}
                      placeholder="GAUGYN"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3. Mobile App Section */}
        {activeTab === 'mobile' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden p-6 animate-fade-in">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Smartphone size={20} className="text-[#EA580C]" />
              Mobile App Settings
            </h3>
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">App Name</label>
                  <input
                    type="text"
                    value={settings.mobileAppName || ''}
                    onChange={(e) => handleChange('mobileAppName', e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Package Name</label>
                  <input
                    type="text"
                    value={settings.mobileAppPackageName || ''}
                    onChange={(e) => handleChange('mobileAppPackageName', e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Current Version</label>
                  <input
                    type="text"
                    value={settings.mobileAppVersion || ''}
                    onChange={(e) => handleChange('mobileAppVersion', e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 outline-none"
                  />
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Force Update</div>
                    <div className="text-xs text-gray-500">Require users to update to the latest version</div>
                  </div>
                  <div
                    onClick={() => handleChange('forceUpdate', !settings.forceUpdate)}
                    className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${settings.forceUpdate ? 'bg-orange-500' : 'bg-gray-300'}`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform ${settings.forceUpdate ? 'translate-x-6' : 'translate-x-0'}`} />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Push Notifications</div>
                    <div className="text-xs text-gray-500">Enable push notifications for mobile app</div>
                  </div>
                  <div
                    onClick={() => handleChange('enablePushNotifications', !settings.enablePushNotifications)}
                    className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${settings.enablePushNotifications ? 'bg-orange-500' : 'bg-gray-300'}`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform ${settings.enablePushNotifications ? 'translate-x-6' : 'translate-x-0'}`} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 4. Preloader Section */}
        {activeTab === 'preloader' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden p-6 animate-fade-in">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <ImageIcon size={20} className="text-[#EA580C]" />
              Preloader Settings
            </h3>

            <div className="space-y-6">
              {/* Enable Switch */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900">Enable Preloader</div>
                  <div className="text-sm text-gray-500">Show a loading screen when the app starts</div>
                </div>
                <div
                  onClick={() => handleChange('preloaderEnabled', !settings.preloaderEnabled)}
                  className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${settings.preloaderEnabled ? 'bg-orange-500' : 'bg-gray-300'}`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform ${settings.preloaderEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
                </div>
              </div>

              {settings.preloaderEnabled && (
                <div className="space-y-6 animate-fade-in">
                  {/* Type Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Preloader Type</label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 cursor-pointer border p-3 rounded-lg hover:bg-gray-50">
                        <input
                          type="radio"
                          name="preloaderType"
                          checked={settings.preloaderType === 'image'}
                          onChange={() => handleChange('preloaderType', 'image')}
                          className="accent-orange-500"
                        />
                        <span>Image / Logo</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer border p-3 rounded-lg hover:bg-gray-50">
                        <input
                          type="radio"
                          name="preloaderType"
                          checked={settings.preloaderType === 'video'}
                          onChange={() => handleChange('preloaderType', 'video')}
                          className="accent-orange-500"
                        />
                        <span>Video</span>
                      </label>
                    </div>
                  </div>

                  {/* Media Upload */}
                  {settings.preloaderType === 'image' ? (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Preloader Image</label>
                      <ImageUploader
                        label=""
                        value={settings.preloaderImage ? [settings.preloaderImage] : []}
                        onChange={(urls) => handleChange('preloaderImage', urls[0] || '')}
                      />
                    </div>
                  ) : (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Preloader Video URL</label>
                      <input
                        type="text"
                        value={settings.preloaderVideo || ''}
                        onChange={(e) => handleChange('preloaderVideo', e.target.value)}
                        placeholder="https://example.com/video.mp4"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 outline-none"
                      />
                      <p className="text-xs text-gray-500 mt-1">Direct link to an MP4 video file.</p>
                    </div>
                  )}

                  {/* Conditions */}
                  <div className="space-y-3 pt-4 border-t border-gray-100">
                    <h4 className="font-medium text-gray-800">Display Conditions</h4>

                    <label className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <span className="text-sm text-gray-700">Show only to first-time visitors (per device)</span>
                      <input
                        type="checkbox"
                        checked={settings.preloaderOnce || false}
                        onChange={(e) => handleChange('preloaderOnce', e.target.checked)}
                        className="accent-orange-500 h-5 w-5"
                      />
                    </label>

                    <label className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <span className="text-sm text-gray-700">Hide for logged-in users</span>
                      <input
                        type="checkbox"
                        checked={settings.preloaderHideLoggedIn || false}
                        onChange={(e) => handleChange('preloaderHideLoggedIn', e.target.checked)}
                        className="accent-orange-500 h-5 w-5"
                      />
                    </label>

                    <label className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <span className="text-sm text-gray-700">Hide for logged-in Admins</span>
                      <input
                        type="checkbox"
                        checked={settings.preloaderHideAdmin || false}
                        onChange={(e) => handleChange('preloaderHideAdmin', e.target.checked)}
                        className="accent-orange-500 h-5 w-5"
                      />
                    </label>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Footer with Save Button */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end rounded-xl shadow-sm">
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
