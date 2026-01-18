import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash2, Upload, Layout, Link as LinkIcon, Facebook, Twitter, Instagram, Linkedin, Youtube, Globe } from 'lucide-react';
import { settingsService, mediaService } from '../../../services/api';
import toast from 'react-hot-toast';
import Button from '../../../components/Button';
import Input from '../../../components/Input';

const SettingsHeaderFooter = () => {
    const [activeTab, setActiveTab] = useState('header');
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);

    // Header Settings State
    const [headerSettings, setHeaderSettings] = useState({
        logo: '',
        topBar: {
            enabled: true,
            links: []
        }
    });

    // Footer Settings State
    const [footerSettings, setFooterSettings] = useState({
        description: '',
        contact: {
            email: '',
            phone: '',
            address: '',
            gst: ''
        }
    });

    // Social Settings State
    const [socialSettings, setSocialSettings] = useState({
        facebook: '',
        twitter: '',
        instagram: '',
        linkedin: '',
        youtube: ''
    });

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        setLoading(true);
        try {
            const [headerRes, footerRes, socialRes] = await Promise.all([
                settingsService.getSettings('header'),
                settingsService.getSettings('footer'),
                settingsService.getSettings('social')
            ]);

            if (headerRes.data?.settings) setHeaderSettings(prev => ({ ...prev, ...headerRes.data.settings }));
            if (footerRes.data?.settings) setFooterSettings(prev => ({ ...prev, ...footerRes.data.settings }));
            if (socialRes.data?.settings) setSocialSettings(prev => ({ ...prev, ...socialRes.data.settings }));
        } catch (error) {
            console.error('Error fetching settings:', error);
            toast.error('Failed to load settings');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            if (activeTab === 'header') {
                await settingsService.updateSettings('header', headerSettings);
            } else if (activeTab === 'footer') {
                await settingsService.updateSettings('footer', footerSettings);
            } else if (activeTab === 'social') {
                await settingsService.updateSettings('social', socialSettings);
            }
            toast.success('Settings saved successfully');
        } catch (error) {
            console.error('Error saving settings:', error);
            toast.error('Failed to save settings');
        } finally {
            setLoading(false);
        }
    };

    const handleLogoUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        try {
            const response = await mediaService.uploadFile(file, 'logos');
            if (response.success) {
                setHeaderSettings(prev => ({ ...prev, logo: response.url }));
                toast.success('Logo uploaded successfully');
            }
        } catch {
            toast.error('Failed to upload logo');
        } finally {
            setUploading(false);
        }
    };

    const addTopBarLink = () => {
        setHeaderSettings(prev => ({
            ...prev,
            topBar: {
                ...prev.topBar,
                links: [...prev.topBar.links, { label: '', url: '' }]
            }
        }));
    };

    const removeTopBarLink = (index) => {
        setHeaderSettings(prev => ({
            ...prev,
            topBar: {
                ...prev.topBar,
                links: prev.topBar.links.filter((_, i) => i !== index)
            }
        }));
    };

    const updateTopBarLink = (index, field, value) => {
        setHeaderSettings(prev => ({
            ...prev,
            topBar: {
                ...prev.topBar,
                links: prev.topBar.links.map((link, i) => i === index ? { ...link, [field]: value } : link)
            }
        }));
    };

    return (
        <div className="p-6 max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-[#0c2d50]">Layout Customization</h2>
                    <p className="text-gray-500 mt-1">Manage header, footer, and social links</p>
                </div>
                <Button onClick={handleSave} disabled={loading} className="flex items-center gap-2">
                    <Save size={18} />
                    {loading ? 'Saving...' : 'Save Changes'}
                </Button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200 mb-8 overflow-x-auto">
                {['header', 'footer', 'social'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-6 py-3 font-medium text-sm transition-colors relative whitespace-nowrap ${activeTab === tab ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        {activeTab === tab && (
                            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-t-full"></div>
                        )}
                    </button>
                ))}
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">

                {/* HEADERS TAB */}
                {activeTab === 'header' && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
                        {/* Logo Section */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                <Layout size={20} /> Logo Configuration
                            </h3>
                            <div className="flex items-start gap-6">
                                <div className="w-32 h-32 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center p-2 relative overflow-hidden group">
                                    {headerSettings.logo ? (
                                        <img src={headerSettings.logo} alt="Logo Preview" className="w-full h-full object-contain" />
                                    ) : (
                                        <span className="text-gray-400 text-xs text-center">No Logo</span>
                                    )}
                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <label className="cursor-pointer text-white text-xs flex flex-col items-center gap-1">
                                            <Upload size={16} /> Change
                                            <input type="file" className="hidden" accept="image/*" onChange={handleLogoUpload} disabled={uploading} />
                                        </label>
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <div className="flex gap-4 items-center">
                                        <Input
                                            label="Logo URL"
                                            value={headerSettings.logo}
                                            onChange={(e) => setHeaderSettings({ ...headerSettings, logo: e.target.value })}
                                            placeholder="https://..."
                                            className="flex-1"
                                        />
                                        <div className="mt-6">
                                            <label className="btn btn-outline cursor-pointer flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50 text-sm">
                                                <Upload size={16} /> Upload New
                                                <input type="file" className="hidden" accept="image/*" onChange={handleLogoUpload} disabled={uploading} />
                                            </label>
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2">Recommended size: 200x60px. Supports PNG, JPG, SVG.</p>
                                </div>
                            </div>
                        </div>

                        <hr className="border-gray-100" />

                        {/* Top Bar Section */}
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                    <LinkIcon size={20} /> Top Bar Links
                                </h3>
                                <div className="flex items-center gap-3">
                                    <span className="text-sm font-medium text-gray-700">Enable Top Bar</span>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={headerSettings.topBar?.enabled ?? true}
                                            onChange={(e) => setHeaderSettings(prev => ({ ...prev, topBar: { ...prev.topBar, enabled: e.target.checked } }))}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                    </label>
                                </div>
                            </div>

                            <div className="space-y-3">
                                {headerSettings.topBar?.links.map((link, index) => (
                                    <div key={index} className="flex gap-3 items-center">
                                        <Input
                                            value={link.label}
                                            onChange={(e) => updateTopBarLink(index, 'label', e.target.value)}
                                            placeholder="Link Label (e.g. 📢 Advertise)"
                                        />
                                        <Input
                                            value={link.url}
                                            onChange={(e) => updateTopBarLink(index, 'url', e.target.value)}
                                            placeholder="URL (e.g. /advertise)"
                                        />
                                        <button onClick={() => removeTopBarLink(index)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg mt-1">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                ))}
                                <button onClick={addTopBarLink} className="text-sm text-blue-600 font-medium hover:underline flex items-center gap-1 mt-2">
                                    <Plus size={16} /> Add Link
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* FOOTER TAB */}
                {activeTab === 'footer' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 max-w-2xl">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Company Details</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Company Description</label>
                                    <textarea
                                        value={footerSettings.description}
                                        onChange={(e) => setFooterSettings(prev => ({ ...prev, description: e.target.value }))}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all resize-none"
                                        rows="3"
                                        placeholder="Brief description appearing below the logo in footer..."
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Contact Information</h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                <Input
                                    label="Support Email"
                                    value={footerSettings.contact.email}
                                    onChange={(e) => setFooterSettings(prev => ({ ...prev, contact: { ...prev.contact, email: e.target.value } }))}
                                    placeholder="info@gaugyan.com"
                                />
                                <Input
                                    label="Support Phone"
                                    value={footerSettings.contact.phone}
                                    onChange={(e) => setFooterSettings(prev => ({ ...prev, contact: { ...prev.contact, phone: e.target.value } }))}
                                    placeholder="+91 98765 43210"
                                />
                                <Input
                                    label="GST Number"
                                    value={footerSettings.contact.gst}
                                    onChange={(e) => setFooterSettings(prev => ({ ...prev, contact: { ...prev.contact, gst: e.target.value } }))}
                                    placeholder="GSTIN..."
                                />
                            </div>
                            <div className="mt-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                <textarea
                                    value={footerSettings.contact.address}
                                    onChange={(e) => setFooterSettings(prev => ({ ...prev, contact: { ...prev.contact, address: e.target.value } }))}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all resize-none"
                                    rows="3"
                                    placeholder="Full address..."
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* SOCIAL TAB */}
                {activeTab === 'social' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 max-w-2xl">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Social Media Links</h3>
                        <p className="text-sm text-gray-500 mb-6">Leave fields empty to hide the icon from the footer.</p>

                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <Facebook className="text-blue-600" size={24} />
                                <Input
                                    value={socialSettings.facebook}
                                    onChange={(e) => setSocialSettings(prev => ({ ...prev, facebook: e.target.value }))}
                                    placeholder="Facebook URL"
                                    containerClassName="flex-1"
                                />
                            </div>
                            <div className="flex items-center gap-3">
                                <Twitter className="text-sky-500" size={24} />
                                <Input
                                    value={socialSettings.twitter}
                                    onChange={(e) => setSocialSettings(prev => ({ ...prev, twitter: e.target.value }))}
                                    placeholder="Twitter / X URL"
                                    containerClassName="flex-1"
                                />
                            </div>
                            <div className="flex items-center gap-3">
                                <Instagram className="text-pink-600" size={24} />
                                <Input
                                    value={socialSettings.instagram}
                                    onChange={(e) => setSocialSettings(prev => ({ ...prev, instagram: e.target.value }))}
                                    placeholder="Instagram URL"
                                    containerClassName="flex-1"
                                />
                            </div>
                            <div className="flex items-center gap-3">
                                <Linkedin className="text-blue-700" size={24} />
                                <Input
                                    value={socialSettings.linkedin}
                                    onChange={(e) => setSocialSettings(prev => ({ ...prev, linkedin: e.target.value }))}
                                    placeholder="LinkedIn URL"
                                    containerClassName="flex-1"
                                />
                            </div>
                            <div className="flex items-center gap-3">
                                <Youtube className="text-red-600" size={24} />
                                <Input
                                    value={socialSettings.youtube}
                                    onChange={(e) => setSocialSettings(prev => ({ ...prev, youtube: e.target.value }))}
                                    placeholder="YouTube Channel URL"
                                    containerClassName="flex-1"
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SettingsHeaderFooter;
