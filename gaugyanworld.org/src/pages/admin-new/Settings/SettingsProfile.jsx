import React, { useState, useEffect } from 'react';
import { Save, User, Lock } from 'lucide-react';
import ImageUploader from '../../../components/ImageUploader';

export default function SettingsProfile() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Lazy initialize state
  const [profile, setProfile] = useState(() => {
    const defaultProfile = {
      fullName: 'Admin User',
      email: 'admin@gaugyan.com',
      role: 'Super Admin',
      avatar: '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    };
    try {
      const saved = localStorage.getItem('userProfile');
      return saved ? { ...defaultProfile, ...JSON.parse(saved) } : defaultProfile;
    } catch {
      return defaultProfile;
    }
  });

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (field, value) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (profile.newPassword && profile.newPassword !== profile.confirmPassword) {
      alert("New passwords don't match!");
      return;
    }

    setSaving(true);
    try {
      // Save profile excluding sensitive password fields
      // eslint-disable-next-line no-unused-vars
      const { currentPassword, newPassword, confirmPassword, ...profileData } = profile;
      localStorage.setItem('userProfile', JSON.stringify(profileData));

      setTimeout(() => {
        setSaving(false);
        setProfile(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }));
        alert('Profile updated successfully!');
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
        <div className="relative z-10 flex items-center gap-6">
          <div className="relative group">
            <div className="w-24 h-24 rounded-full border-4 border-white/30 overflow-hidden bg-white/10 flex items-center justify-center">
              {profile.avatar ? (
                <img src={profile.avatar} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User size={40} className="text-white/80" />
              )}
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-1">{profile.fullName}</h1>
            <p className="opacity-90 text-lg flex items-center gap-2">
              <span className="px-3 py-0.5 rounded-full bg-white/20 text-sm font-medium border border-white/20">
                {profile.role}
              </span>
              {profile.email}
            </p>
          </div>
        </div>
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-16 -mt-16 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full -ml-10 -mb-10 pointer-events-none"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left Col: Personal Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
              <User size={20} className="text-primary" />
              Personal Information
            </h3>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={profile.fullName}
                  onChange={(e) => handleChange('fullName', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Profile Picture</label>
                <ImageUploader
                  label=""
                  value={profile.avatar ? [profile.avatar] : []}
                  onChange={(urls) => handleChange('avatar', urls[0] || '')}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Security */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
              <Lock size={20} className="text-primary" />
              Security
            </h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                <input
                  type="password"
                  value={profile.currentPassword}
                  onChange={(e) => handleChange('currentPassword', e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                />
              </div>
              <div className="border-t border-gray-100 pt-2"></div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                <input
                  type="password"
                  value={profile.newPassword}
                  onChange={(e) => handleChange('newPassword', e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                <input
                  type="password"
                  value={profile.confirmPassword}
                  onChange={(e) => handleChange('confirmPassword', e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                />
              </div>
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#0c2d50] hover:bg-[#091e35] text-white rounded-xl font-medium shadow-md hover:shadow-lg transition-all disabled:opacity-70"
          >
            {saving ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Saving Changes...
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
