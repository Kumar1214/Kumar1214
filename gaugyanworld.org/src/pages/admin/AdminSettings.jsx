import React, { useState, useEffect, useCallback } from 'react';
import { Save, RefreshCw, Settings as SettingsIcon, Palette, Key, Mail, Share2, Globe, AlertCircle, Layout } from 'lucide-react';
import ImageUploader from '../../components/ImageUploader';
import HeaderCustomizer from '../../components/admin/HeaderCustomizer';
import FooterCustomizer from '../../components/admin/FooterCustomizer';

const AdminSettings = () => {
    const [activeTab, setActiveTab] = useState('general');
    const [saving, setSaving] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);

    const [settings, setSettings] = useState({
        // General Settings
        siteName: 'Gaugyan',
        siteDescription: 'Your gateway to Vedic knowledge and spiritual growth',
        contactEmail: 'contact@gaugyan.com',
        contactPhone: '+91 9876543210',
        maintenanceMode: false,
        allowRegistration: true,

        // API Integration
        razorpayKeyId: '',
        razorpayKeySecret: '',
        razorpayMode: 'test', // test or live
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

        // Email Settings
        smtpHost: '',
        smtpPort: '587',
        smtpUsername: '',
        smtpPassword: '',
        emailFrom: '',
        emailFromName: 'Gaugyan',

        // Social Media
        facebookUrl: '',
        instagramUrl: '',
        twitterUrl: '',
        youtubeUrl: '',
        linkedinUrl: ''
    });

    // Permissions state
    const [showPermissionModal, setShowPermissionModal] = useState(false);
    const [editingRole, setEditingRole] = useState(null);
    const [rolePermissions, setRolePermissions] = useState({});

    // Default permissions for all roles
    const defaultPermissions = {
        'Super Admin': { Courses: { view: true, create: true, edit: true, delete: true }, Exams: { view: true, create: true, edit: true, delete: true }, Quizzes: { view: true, create: true, edit: true, delete: true }, Users: { view: true, create: true, edit: true, delete: true }, Music: { view: true, create: true, edit: true, delete: true }, Podcasts: { view: true, create: true, edit: true, delete: true }, Products: { view: true, create: true, edit: true, delete: true }, Orders: { view: true, create: true, edit: true, delete: true }, Vendors: { view: true, create: true, edit: true, delete: true }, Payouts: { view: true, create: true, edit: true, delete: true }, Settings: { view: true, create: true, edit: true, delete: true } },
        'Admin': { Courses: { view: true, create: true, edit: true, delete: true }, Exams: { view: true, create: true, edit: true, delete: true }, Quizzes: { view: true, create: true, edit: true, delete: true }, Users: { view: true, create: true, edit: true, delete: false }, Music: { view: true, create: true, edit: true, delete: true }, Podcasts: { view: true, create: true, edit: true, delete: true }, Products: { view: true, create: true, edit: true, delete: true }, Orders: { view: true, create: true, edit: true, delete: false }, Vendors: { view: true, create: false, edit: false, delete: false }, Payouts: { view: true, create: false, edit: false, delete: false }, Settings: { view: true, create: false, edit: true, delete: false } },
        'Instructor': { Courses: { view: true, create: true, edit: true, delete: true }, Exams: { view: true, create: true, edit: true, delete: false }, Quizzes: { view: true, create: true, edit: true, delete: false }, Users: { view: true, create: false, edit: false, delete: false }, Music: { view: true, create: false, edit: false, delete: false }, Podcasts: { view: true, create: false, edit: false, delete: false }, Products: { view: true, create: false, edit: false, delete: false }, Orders: { view: true, create: false, edit: false, delete: false }, Vendors: { view: false, create: false, edit: false, delete: false }, Payouts: { view: false, create: false, edit: false, delete: false }, Settings: { view: false, create: false, edit: false, delete: false } },
        'Artist': { Courses: { view: false, create: false, edit: false, delete: false }, Exams: { view: false, create: false, edit: false, delete: false }, Quizzes: { view: false, create: false, edit: false, delete: false }, Users: { view: false, create: false, edit: false, delete: false }, Music: { view: true, create: true, edit: true, delete: true }, Podcasts: { view: true, create: true, edit: true, delete: true }, Products: { view: false, create: false, edit: false, delete: false }, Orders: { view: false, create: false, edit: false, delete: false }, Vendors: { view: false, create: false, edit: false, delete: false }, Payouts: { view: true, create: false, edit: false, delete: false }, Settings: { view: false, create: false, edit: false, delete: false } },
        'Vendor': { Courses: { view: false, create: false, edit: false, delete: false }, Exams: { view: false, create: false, edit: false, delete: false }, Quizzes: { view: false, create: false, edit: false, delete: false }, Users: { view: false, create: false, edit: false, delete: false }, Music: { view: false, create: false, edit: false, delete: false }, Podcasts: { view: false, create: false, edit: false, delete: false }, Products: { view: true, create: true, edit: true, delete: true }, Orders: { view: true, create: false, edit: true, delete: false }, Vendors: { view: false, create: false, edit: false, delete: false }, Payouts: { view: true, create: false, edit: false, delete: false }, Settings: { view: false, create: false, edit: false, delete: false } },
        'Gaushala Owner': { Courses: { view: false, create: false, edit: false, delete: false }, Exams: { view: false, create: false, edit: false, delete: false }, Quizzes: { view: false, create: false, edit: false, delete: false }, Users: { view: false, create: false, edit: false, delete: false }, Music: { view: false, create: false, edit: false, delete: false }, Podcasts: { view: false, create: false, edit: false, delete: false }, Products: { view: true, create: true, edit: true, delete: false }, Orders: { view: true, create: false, edit: false, delete: false }, Vendors: { view: false, create: false, edit: false, delete: false }, Payouts: { view: true, create: false, edit: false, delete: false }, Settings: { view: false, create: false, edit: false, delete: false } },
        'User': { Courses: { view: true, create: false, edit: false, delete: false }, Exams: { view: true, create: false, edit: false, delete: false }, Quizzes: { view: true, create: false, edit: false, delete: false }, Users: { view: false, create: false, edit: false, delete: false }, Music: { view: true, create: false, edit: false, delete: false }, Podcasts: { view: true, create: false, edit: false, delete: false }, Products: { view: true, create: false, edit: false, delete: false }, Orders: { view: true, create: false, edit: false, delete: false }, Vendors: { view: false, create: false, edit: false, delete: false }, Payouts: { view: false, create: false, edit: false, delete: false }, Settings: { view: false, create: false, edit: false, delete: false } }
    };

    const AdminSettings = () => {
        const [activeTab, setActiveTab] = useState('general');
        const [saving, setSaving] = useState(false);
        const [hasChanges, setHasChanges] = useState(false);

        const [settings, setSettings] = useState(() => {
            const defaultSettings = {
                // General Settings
                siteName: 'Gaugyan',
                siteDescription: 'Your gateway to Vedic knowledge and spiritual growth',
                contactEmail: 'contact@gaugyan.com',
                contactPhone: '+91 9876543210',
                maintenanceMode: false,
                allowRegistration: true,

                // API Integration
                razorpayKeyId: '',
                razorpayKeySecret: '',
                razorpayMode: 'test', // test or live
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

                // Email Settings
                smtpHost: '',
                smtpPort: '587',
                smtpUsername: '',
                smtpPassword: '',
                emailFrom: '',
                emailFromName: 'Gaugyan',

                // Social Media
                facebookUrl: '',
                instagramUrl: '',
                twitterUrl: '',
                youtubeUrl: '',
                linkedinUrl: ''
            };
            try {
                const saved = localStorage.getItem('appSettings');
                return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
            } catch (e) {
                return defaultSettings;
            }
        });

        // Permissions state
        const [showPermissionModal, setShowPermissionModal] = useState(false);
        const [editingRole, setEditingRole] = useState(null);
        const [rolePermissions, setRolePermissions] = useState(() => {
            try {
                const savedPermissions = localStorage.getItem('rolePermissions');
                return savedPermissions ? JSON.parse(savedPermissions) : defaultPermissions;
            } catch (e) {
                return defaultPermissions;
            }
        });

        const loadSettings = useCallback(() => {
            try {
                const saved = localStorage.getItem('appSettings');
                if (saved) {
                    setSettings(prev => ({ ...prev, ...JSON.parse(saved) }));
                }

                // Load permissions
                const savedPermissions = localStorage.getItem('rolePermissions');
                if (savedPermissions) {
                    setRolePermissions(JSON.parse(savedPermissions));
                } else {
                    setRolePermissions(defaultPermissions);
                }
            } catch (error) {
                console.error('Error loading settings:', error);
            }
        }, []);

        const handleChange = (field, value) => {
            setSettings({ ...settings, [field]: value });
            setHasChanges(true);
        };

        const handleSave = () => {
            setSaving(true);
            try {
                localStorage.setItem('appSettings', JSON.stringify(settings));
                alert('Settings saved successfully!');
                setHasChanges(false);
            } catch (error) {
                console.error('Error saving settings:', error);
                alert('Error saving settings');
            }
            setSaving(false);
        };

        const handleReset = () => {
            if (window.confirm('Are you sure you want to reset all changes?')) {
                loadSettings();
                setHasChanges(false);
            }
        };

        const handleEditPermissions = (roleName) => {
            setEditingRole(roleName);
            setShowPermissionModal(true);
        };

        const handlePermissionChange = (module, action, value) => {
            setRolePermissions(prev => ({
                ...prev,
                [editingRole]: {
                    ...prev[editingRole],
                    [module]: {
                        ...prev[editingRole][module],
                        [action]: value
                    }
                }
            }));
        };

        const handleSavePermissions = () => {
            try {
                localStorage.setItem('rolePermissions', JSON.stringify(rolePermissions));
                alert('Permissions saved successfully!');
                setShowPermissionModal(false);
                setEditingRole(null);
            } catch (error) {
                console.error('Error saving permissions:', error);
                alert('Error saving permissions');
            }
        };

        const tabs = [
            { id: 'general', label: 'General', icon: SettingsIcon },
            { id: 'api', label: 'API Integration', icon: Key },
            { id: 'appearance', label: 'Appearance', icon: Palette },
            { id: 'email', label: 'Email', icon: Mail },
            { id: 'social', label: 'Social Media', icon: Share2 },
            { id: 'header', label: 'Header', icon: Layout },
            { id: 'footer', label: 'Footer', icon: Layout },
            { id: 'permissions', label: 'Permissions', icon: SettingsIcon }
        ];

        return (
            <div style={{ backgroundColor: '#F9FAFB', minHeight: '100vh', padding: window.innerWidth > 768 ? '32px' : '16px' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    {/* Header */}
                    <div style={{ marginBottom: '32px' }}>
                        <h1 style={{ fontSize: window.innerWidth > 768 ? '2rem' : '1.5rem', fontWeight: 700, color: '#1F2937', marginBottom: '8px' }}>
                            Application Settings
                        </h1>
                        <p style={{ color: '#6B7280' }}>Configure your application settings and integrations</p>
                    </div>

                    {/* Unsaved Changes Warning */}
                    {hasChanges && (
                        <div style={{
                            backgroundColor: '#FEF3C7',
                            border: '1px solid #FCD34D',
                            borderRadius: '12px',
                            padding: '16px',
                            marginBottom: '24px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px'
                        }}>
                            <AlertCircle size={20} color="#92400E" />
                            <span style={{ color: '#92400E', fontWeight: 500 }}>You have unsaved changes</span>
                        </div>
                    )}

                    {/* Tabs */}
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '12px',
                        marginBottom: '24px',
                        padding: '16px',
                        display: 'flex',
                        gap: '8px',
                        flexWrap: 'wrap',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                    }}>
                        {tabs.map(tab => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    style={{
                                        padding: '12px 20px',
                                        backgroundColor: activeTab === tab.id ? '#4F46E5' : 'transparent',
                                        color: activeTab === tab.id ? 'white' : '#6B7280',
                                        border: 'none',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        fontWeight: 600,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    <Icon size={18} />
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>

                    {/* Settings Content */}
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '16px',
                        padding: window.innerWidth > 768 ? '32px' : '20px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                    }}>
                        {/* General Settings */}
                        {activeTab === 'general' && (
                            <div style={{ display: 'grid', gap: '24px' }}>
                                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1F2937', marginBottom: '8px' }}>
                                    General Settings
                                </h2>

                                <div>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '6px', color: '#374151' }}>
                                        Site Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={settings.siteName}
                                        onChange={(e) => handleChange('siteName', e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '10px 12px',
                                            border: '1px solid #E5E7EB',
                                            borderRadius: '8px',
                                            fontSize: '0.875rem',
                                            outline: 'none'
                                        }}
                                    />
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '6px', color: '#374151' }}>
                                        Site Description
                                    </label>
                                    <textarea
                                        value={settings.siteDescription}
                                        onChange={(e) => handleChange('siteDescription', e.target.value)}
                                        rows="3"
                                        style={{
                                            width: '100%',
                                            padding: '10px 12px',
                                            border: '1px solid #E5E7EB',
                                            borderRadius: '8px',
                                            fontSize: '0.875rem',
                                            outline: 'none',
                                            resize: 'vertical'
                                        }}
                                    />
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth > 768 ? '1fr 1fr' : '1fr', gap: '16px' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '6px', color: '#374151' }}>
                                            Contact Email
                                        </label>
                                        <input
                                            type="email"
                                            value={settings.contactEmail}
                                            onChange={(e) => handleChange('contactEmail', e.target.value)}
                                            style={{
                                                width: '100%',
                                                padding: '10px 12px',
                                                border: '1px solid #E5E7EB',
                                                borderRadius: '8px',
                                                fontSize: '0.875rem',
                                                outline: 'none'
                                            }}
                                        />
                                    </div>

                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '6px', color: '#374151' }}>
                                            Contact Phone
                                        </label>
                                        <input
                                            type="tel"
                                            value={settings.contactPhone}
                                            onChange={(e) => handleChange('contactPhone', e.target.value)}
                                            style={{
                                                width: '100%',
                                                padding: '10px 12px',
                                                border: '1px solid #E5E7EB',
                                                borderRadius: '8px',
                                                fontSize: '0.875rem',
                                                outline: 'none'
                                            }}
                                        />
                                    </div>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', backgroundColor: '#F9FAFB', borderRadius: '8px' }}>
                                    <input
                                        type="checkbox"
                                        checked={settings.maintenanceMode}
                                        onChange={(e) => handleChange('maintenanceMode', e.target.checked)}
                                        style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                                    />
                                    <div>
                                        <div style={{ fontWeight: 600, color: '#1F2937' }}>Maintenance Mode</div>
                                        <div style={{ fontSize: '0.875rem', color: '#6B7280' }}>Disable site access for non-admin users</div>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', backgroundColor: '#F9FAFB', borderRadius: '8px' }}>
                                    <input
                                        type="checkbox"
                                        checked={settings.allowRegistration}
                                        onChange={(e) => handleChange('allowRegistration', e.target.checked)}
                                        style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                                    />
                                    <div>
                                        <div style={{ fontWeight: 600, color: '#1F2937' }}>Allow User Registration</div>
                                        <div style={{ fontSize: '0.875rem', color: '#6B7280' }}>Enable new users to register on the platform</div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* API Integration Settings */}
                        {activeTab === 'api' && (
                            <div style={{ display: 'grid', gap: '24px' }}>
                                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1F2937', marginBottom: '8px' }}>
                                    API Integration Settings
                                </h2>

                                {/* Razorpay */}
                                <div style={{ padding: '20px', backgroundColor: '#F9FAFB', borderRadius: '12px' }}>
                                    <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#1F2937', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <Globe size={20} />
                                        Razorpay Payment Gateway
                                    </h3>

                                    <div style={{ display: 'grid', gap: '16px' }}>
                                        <div>
                                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '6px', color: '#374151' }}>
                                                Razorpay Key ID
                                            </label>
                                            <input
                                                type="text"
                                                value={settings.razorpayKeyId}
                                                onChange={(e) => handleChange('razorpayKeyId', e.target.value)}
                                                placeholder="rzp_test_xxxxxxxxxx"
                                                style={{
                                                    width: '100%',
                                                    padding: '10px 12px',
                                                    border: '1px solid #E5E7EB',
                                                    borderRadius: '8px',
                                                    fontSize: '0.875rem',
                                                    outline: 'none'
                                                }}
                                            />
                                        </div>

                                        <div>
                                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '6px', color: '#374151' }}>
                                                Razorpay Key Secret
                                            </label>
                                            <input
                                                type="password"
                                                value={settings.razorpayKeySecret}
                                                onChange={(e) => handleChange('razorpayKeySecret', e.target.value)}
                                                placeholder="••••••••••••••••"
                                                style={{
                                                    width: '100%',
                                                    padding: '10px 12px',
                                                    border: '1px solid #E5E7EB',
                                                    borderRadius: '8px',
                                                    fontSize: '0.875rem',
                                                    outline: 'none'
                                                }}
                                            />
                                        </div>

                                        <div>
                                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '6px', color: '#374151' }}>
                                                Mode
                                            </label>
                                            <select
                                                value={settings.razorpayMode}
                                                onChange={(e) => handleChange('razorpayMode', e.target.value)}
                                                style={{
                                                    width: '100%',
                                                    padding: '10px 12px',
                                                    border: '1px solid #E5E7EB',
                                                    borderRadius: '8px',
                                                    fontSize: '0.875rem',
                                                    outline: 'none'
                                                }}
                                            >
                                                <option value="test">Test Mode</option>
                                                <option value="live">Live Mode</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* Google Maps */}
                                <div style={{ padding: '20px', backgroundColor: '#F9FAFB', borderRadius: '12px' }}>
                                    <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#1F2937', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <Globe size={20} />
                                        Google Maps API
                                    </h3>

                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '6px', color: '#374151' }}>
                                            Google Maps API Key
                                        </label>
                                        <input
                                            type="text"
                                            value={settings.googleMapsApiKey}
                                            onChange={(e) => handleChange('googleMapsApiKey', e.target.value)}
                                            placeholder="AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
                                            style={{
                                                width: '100%',
                                                padding: '10px 12px',
                                                border: '1px solid #E5E7EB',
                                                borderRadius: '8px',
                                                fontSize: '0.875rem',
                                                outline: 'none'
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* Firebase */}
                                <div style={{ padding: '20px', backgroundColor: '#F9FAFB', borderRadius: '12px' }}>
                                    <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#1F2937', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <Globe size={20} />
                                        Firebase Configuration
                                    </h3>

                                    <div style={{ display: 'grid', gap: '16px' }}>
                                        <div>
                                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '6px', color: '#374151' }}>
                                                API Key
                                            </label>
                                            <input
                                                type="text"
                                                value={settings.firebaseApiKey}
                                                onChange={(e) => handleChange('firebaseApiKey', e.target.value)}
                                                style={{
                                                    width: '100%',
                                                    padding: '10px 12px',
                                                    border: '1px solid #E5E7EB',
                                                    borderRadius: '8px',
                                                    fontSize: '0.875rem',
                                                    outline: 'none'
                                                }}
                                            />
                                        </div>

                                        <div>
                                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '6px', color: '#374151' }}>
                                                Auth Domain
                                            </label>
                                            <input
                                                type="text"
                                                value={settings.firebaseAuthDomain}
                                                onChange={(e) => handleChange('firebaseAuthDomain', e.target.value)}
                                                placeholder="your-app.firebaseapp.com"
                                                style={{
                                                    width: '100%',
                                                    padding: '10px 12px',
                                                    border: '1px solid #E5E7EB',
                                                    borderRadius: '8px',
                                                    fontSize: '0.875rem',
                                                    outline: 'none'
                                                }}
                                            />
                                        </div>

                                        <div>
                                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '6px', color: '#374151' }}>
                                                Project ID
                                            </label>
                                            <input
                                                type="text"
                                                value={settings.firebaseProjectId}
                                                onChange={(e) => handleChange('firebaseProjectId', e.target.value)}
                                                style={{
                                                    width: '100%',
                                                    padding: '10px 12px',
                                                    border: '1px solid #E5E7EB',
                                                    borderRadius: '8px',
                                                    fontSize: '0.875rem',
                                                    outline: 'none'
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* SMS Gateway */}
                                <div style={{ padding: '20px', backgroundColor: '#F9FAFB', borderRadius: '12px' }}>
                                    <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#1F2937', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <Globe size={20} />
                                        SMS Gateway
                                    </h3>

                                    <div style={{ display: 'grid', gap: '16px' }}>
                                        <div>
                                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '6px', color: '#374151' }}>
                                                API Key
                                            </label>
                                            <input
                                                type="text"
                                                value={settings.smsGatewayApiKey}
                                                onChange={(e) => handleChange('smsGatewayApiKey', e.target.value)}
                                                style={{
                                                    width: '100%',
                                                    padding: '10px 12px',
                                                    border: '1px solid #E5E7EB',
                                                    borderRadius: '8px',
                                                    fontSize: '0.875rem',
                                                    outline: 'none'
                                                }}
                                            />
                                        </div>

                                        <div>
                                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '6px', color: '#374151' }}>
                                                Sender ID
                                            </label>
                                            <input
                                                type="text"
                                                value={settings.smsGatewaySenderId}
                                                onChange={(e) => handleChange('smsGatewaySenderId', e.target.value)}
                                                placeholder="GAUGYN"
                                                style={{
                                                    width: '100%',
                                                    padding: '10px 12px',
                                                    border: '1px solid #E5E7EB',
                                                    borderRadius: '8px',
                                                    fontSize: '0.875rem',
                                                    outline: 'none'
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Appearance Settings */}
                        {activeTab === 'appearance' && (
                            <div style={{ display: 'grid', gap: '24px' }}>
                                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1F2937', marginBottom: '8px' }}>
                                    Appearance Settings
                                </h2>

                                {/* Logo Upload */}
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '6px', color: '#374151' }}>
                                        Main Logo
                                    </label>
                                    <ImageUploader
                                        label=""
                                        value={settings.logo ? [settings.logo] : []}
                                        onChange={(urls) => handleChange('logo', urls[0] || '')}
                                    />
                                    {settings.logo && (
                                        <div style={{ marginTop: '12px', padding: '16px', backgroundColor: '#F9FAFB', borderRadius: '8px' }}>
                                            <div style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '8px', color: '#374151' }}>Preview:</div>
                                            <img src={settings.logo} alt="Logo" style={{ maxHeight: '80px', objectFit: 'contain' }} />
                                        </div>
                                    )}
                                </div>

                                {/* Favicon Upload */}
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '6px', color: '#374151' }}>
                                        Favicon
                                    </label>
                                    <ImageUploader
                                        label=""
                                        value={settings.favicon ? [settings.favicon] : []}
                                        onChange={(urls) => handleChange('favicon', urls[0] || '')}
                                    />
                                </div>

                                {/* Color Settings */}
                                <div style={{ padding: '20px', backgroundColor: '#F9FAFB', borderRadius: '12px' }}>
                                    <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#1F2937', marginBottom: '16px' }}>
                                        Color Scheme
                                    </h3>

                                    <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth > 768 ? 'repeat(3, 1fr)' : '1fr', gap: '16px' }}>
                                        <div>
                                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '6px', color: '#374151' }}>
                                                Primary Color
                                            </label>
                                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                                <input
                                                    type="color"
                                                    value={settings.primaryColor}
                                                    onChange={(e) => handleChange('primaryColor', e.target.value)}
                                                    style={{ width: '60px', height: '40px', border: '1px solid #E5E7EB', borderRadius: '8px', cursor: 'pointer' }}
                                                />
                                                <input
                                                    type="text"
                                                    value={settings.primaryColor}
                                                    onChange={(e) => handleChange('primaryColor', e.target.value)}
                                                    style={{
                                                        flex: 1,
                                                        padding: '10px 12px',
                                                        border: '1px solid #E5E7EB',
                                                        borderRadius: '8px',
                                                        fontSize: '0.875rem',
                                                        outline: 'none'
                                                    }}
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '6px', color: '#374151' }}>
                                                Secondary Color
                                            </label>
                                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                                <input
                                                    type="color"
                                                    value={settings.secondaryColor}
                                                    onChange={(e) => handleChange('secondaryColor', e.target.value)}
                                                    style={{ width: '60px', height: '40px', border: '1px solid #E5E7EB', borderRadius: '8px', cursor: 'pointer' }}
                                                />
                                                <input
                                                    type="text"
                                                    value={settings.secondaryColor}
                                                    onChange={(e) => handleChange('secondaryColor', e.target.value)}
                                                    style={{
                                                        flex: 1,
                                                        padding: '10px 12px',
                                                        border: '1px solid #E5E7EB',
                                                        borderRadius: '8px',
                                                        fontSize: '0.875rem',
                                                        outline: 'none'
                                                    }}
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '6px', color: '#374151' }}>
                                                Accent Color
                                            </label>
                                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                                <input
                                                    type="color"
                                                    value={settings.accentColor}
                                                    onChange={(e) => handleChange('accentColor', e.target.value)}
                                                    style={{ width: '60px', height: '40px', border: '1px solid #E5E7EB', borderRadius: '8px', cursor: 'pointer' }}
                                                />
                                                <input
                                                    type="text"
                                                    value={settings.accentColor}
                                                    onChange={(e) => handleChange('accentColor', e.target.value)}
                                                    style={{
                                                        flex: 1,
                                                        padding: '10px 12px',
                                                        border: '1px solid #E5E7EB',
                                                        borderRadius: '8px',
                                                        fontSize: '0.875rem',
                                                        outline: 'none'
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Color Preview */}
                                    <div style={{ marginTop: '16px', padding: '16px', backgroundColor: 'white', borderRadius: '8px' }}>
                                        <div style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '12px', color: '#374151' }}>Color Preview:</div>
                                        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                                            <div style={{ padding: '12px 24px', backgroundColor: settings.primaryColor, color: 'white', borderRadius: '8px', fontWeight: 600 }}>
                                                Primary
                                            </div>
                                            <div style={{ padding: '12px 24px', backgroundColor: settings.secondaryColor, color: 'white', borderRadius: '8px', fontWeight: 600 }}>
                                                Secondary
                                            </div>
                                            <div style={{ padding: '12px 24px', backgroundColor: settings.accentColor, color: 'white', borderRadius: '8px', fontWeight: 600 }}>
                                                Accent
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Font Family */}
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '6px', color: '#374151' }}>
                                        Font Family
                                    </label>
                                    <select
                                        value={settings.fontFamily}
                                        onChange={(e) => handleChange('fontFamily', e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '10px 12px',
                                            border: '1px solid #E5E7EB',
                                            borderRadius: '8px',
                                            fontSize: '0.875rem',
                                            outline: 'none'
                                        }}
                                    >
                                        <option value="Inter">Inter</option>
                                        <option value="Roboto">Roboto</option>
                                        <option value="Open Sans">Open Sans</option>
                                        <option value="Poppins">Poppins</option>
                                        <option value="Lato">Lato</option>
                                    </select>
                                </div>

                                {/* Dark Mode */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', backgroundColor: '#F9FAFB', borderRadius: '8px' }}>
                                    <input
                                        type="checkbox"
                                        checked={settings.darkMode}
                                        onChange={(e) => handleChange('darkMode', e.target.checked)}
                                        style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                                    />
                                    <div>
                                        <div style={{ fontWeight: 600, color: '#1F2937' }}>Enable Dark Mode</div>
                                        <div style={{ fontSize: '0.875rem', color: '#6B7280' }}>Allow users to switch to dark theme</div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Email Settings */}
                        {activeTab === 'email' && (
                            <div style={{ display: 'grid', gap: '24px' }}>
                                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1F2937', marginBottom: '8px' }}>
                                    Email Settings (SMTP)
                                </h2>

                                <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth > 768 ? '1fr 1fr' : '1fr', gap: '16px' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '6px', color: '#374151' }}>
                                            SMTP Host
                                        </label>
                                        <input
                                            type="text"
                                            value={settings.smtpHost}
                                            onChange={(e) => handleChange('smtpHost', e.target.value)}
                                            placeholder="smtp.gmail.com"
                                            style={{
                                                width: '100%',
                                                padding: '10px 12px',
                                                border: '1px solid #E5E7EB',
                                                borderRadius: '8px',
                                                fontSize: '0.875rem',
                                                outline: 'none'
                                            }}
                                        />
                                    </div>

                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '6px', color: '#374151' }}>
                                            SMTP Port
                                        </label>
                                        <input
                                            type="text"
                                            value={settings.smtpPort}
                                            onChange={(e) => handleChange('smtpPort', e.target.value)}
                                            placeholder="587"
                                            style={{
                                                width: '100%',
                                                padding: '10px 12px',
                                                border: '1px solid #E5E7EB',
                                                borderRadius: '8px',
                                                fontSize: '0.875rem',
                                                outline: 'none'
                                            }}
                                        />
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth > 768 ? '1fr 1fr' : '1fr', gap: '16px' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '6px', color: '#374151' }}>
                                            SMTP Username
                                        </label>
                                        <input
                                            type="text"
                                            value={settings.smtpUsername}
                                            onChange={(e) => handleChange('smtpUsername', e.target.value)}
                                            style={{
                                                width: '100%',
                                                padding: '10px 12px',
                                                border: '1px solid #E5E7EB',
                                                borderRadius: '8px',
                                                fontSize: '0.875rem',
                                                outline: 'none'
                                            }}
                                        />
                                    </div>

                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '6px', color: '#374151' }}>
                                            SMTP Password
                                        </label>
                                        <input
                                            type="password"
                                            value={settings.smtpPassword}
                                            onChange={(e) => handleChange('smtpPassword', e.target.value)}
                                            placeholder="••••••••••••••••"
                                            style={{
                                                width: '100%',
                                                padding: '10px 12px',
                                                border: '1px solid #E5E7EB',
                                                borderRadius: '8px',
                                                fontSize: '0.875rem',
                                                outline: 'none'
                                            }}
                                        />
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth > 768 ? '1fr 1fr' : '1fr', gap: '16px' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '6px', color: '#374151' }}>
                                            From Email Address
                                        </label>
                                        <input
                                            type="email"
                                            value={settings.emailFrom}
                                            onChange={(e) => handleChange('emailFrom', e.target.value)}
                                            placeholder="noreply@gaugyan.com"
                                            style={{
                                                width: '100%',
                                                padding: '10px 12px',
                                                border: '1px solid #E5E7EB',
                                                borderRadius: '8px',
                                                fontSize: '0.875rem',
                                                outline: 'none'
                                            }}
                                        />
                                    </div>

                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '6px', color: '#374151' }}>
                                            From Name
                                        </label>
                                        <input
                                            type="text"
                                            value={settings.emailFromName}
                                            onChange={(e) => handleChange('emailFromName', e.target.value)}
                                            style={{
                                                width: '100%',
                                                padding: '10px 12px',
                                                border: '1px solid #E5E7EB',
                                                borderRadius: '8px',
                                                fontSize: '0.875rem',
                                                outline: 'none'
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Social Media Settings */}
                        {activeTab === 'social' && (
                            <div style={{ display: 'grid', gap: '24px' }}>
                                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1F2937', marginBottom: '8px' }}>
                                    Social Media Links
                                </h2>

                                <div>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '6px', color: '#374151' }}>
                                        Facebook URL
                                    </label>
                                    <input
                                        type="url"
                                        value={settings.facebookUrl}
                                        onChange={(e) => handleChange('facebookUrl', e.target.value)}
                                        placeholder="https://facebook.com/gaugyan"
                                        style={{
                                            width: '100%',
                                            padding: '10px 12px',
                                            border: '1px solid #E5E7EB',
                                            borderRadius: '8px',
                                            fontSize: '0.875rem',
                                            outline: 'none'
                                        }}
                                    />
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '6px', color: '#374151' }}>
                                        Instagram URL
                                    </label>
                                    <input
                                        type="url"
                                        value={settings.instagramUrl}
                                        onChange={(e) => handleChange('instagramUrl', e.target.value)}
                                        placeholder="https://instagram.com/gaugyan"
                                        style={{
                                            width: '100%',
                                            padding: '10px 12px',
                                            border: '1px solid #E5E7EB',
                                            borderRadius: '8px',
                                            fontSize: '0.875rem',
                                            outline: 'none'
                                        }}
                                    />
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '6px', color: '#374151' }}>
                                        Twitter URL
                                    </label>
                                    <input
                                        type="url"
                                        value={settings.twitterUrl}
                                        onChange={(e) => handleChange('twitterUrl', e.target.value)}
                                        placeholder="https://twitter.com/gaugyan"
                                        style={{
                                            width: '100%',
                                            padding: '10px 12px',
                                            border: '1px solid #E5E7EB',
                                            borderRadius: '8px',
                                            fontSize: '0.875rem',
                                            outline: 'none'
                                        }}
                                    />
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '6px', color: '#374151' }}>
                                        YouTube URL
                                    </label>
                                    <input
                                        type="url"
                                        value={settings.youtubeUrl}
                                        onChange={(e) => handleChange('youtubeUrl', e.target.value)}
                                        placeholder="https://youtube.com/@gaugyan"
                                        style={{
                                            width: '100%',
                                            padding: '10px 12px',
                                            border: '1px solid #E5E7EB',
                                            borderRadius: '8px',
                                            fontSize: '0.875rem',
                                            outline: 'none'
                                        }}
                                    />
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '6px', color: '#374151' }}>
                                        LinkedIn URL
                                    </label>
                                    <input
                                        type="url"
                                        value={settings.linkedinUrl}
                                        onChange={(e) => handleChange('linkedinUrl', e.target.value)}
                                        placeholder="https://linkedin.com/company/gaugyan"
                                        style={{
                                            width: '100%',
                                            padding: '10px 12px',
                                            border: '1px solid #E5E7EB',
                                            borderRadius: '8px',
                                            fontSize: '0.875rem',
                                            outline: 'none'
                                        }}
                                    />
                                </div>
                            </div>
                        )}


                        {/* Header Settings */}
                        {activeTab === 'header' && <HeaderCustomizer />}

                        {/* Footer Settings */}
                        {activeTab === 'footer' && <FooterCustomizer />}

                        {/* Permissions Settings */}
                        {activeTab === 'permissions' && (
                            <div style={{ display: 'grid', gap: '24px' }}>
                                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1F2937', marginBottom: '8px' }}>
                                    Roles & Permissions
                                </h2>

                                {/* Existing Roles */}
                                <div style={{ marginBottom: '24px' }}>
                                    <h4 style={{ fontSize: '1rem', marginBottom: '16px', color: '#374151' }}>Existing Roles</h4>
                                    <div style={{ display: 'grid', gap: '12px' }}>
                                        {[
                                            { name: 'Super Admin', users: 2, color: '#DC2626' },
                                            { name: 'Admin', users: 5, color: '#EA580C' },
                                            { name: 'Instructor', users: 45, color: '#2563EB' },
                                            { name: 'Artist', users: 23, color: '#7C3AED' },
                                            { name: 'Vendor', users: 18, color: '#059669' },
                                            { name: 'Gaushala Owner', users: 12, color: '#0891B2' },
                                            { name: 'User', users: 1234, color: '#6B7280' }
                                        ].map((role, i) => (
                                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', backgroundColor: '#F9FAFB', borderRadius: '8px', border: '1px solid #E5E7EB' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: role.color }}></div>
                                                    <span style={{ fontWeight: 500 }}>{role.name}</span>
                                                    <span style={{ fontSize: '0.85rem', color: '#6B7280' }}>({role.users} users)</span>
                                                </div>
                                                <div style={{ display: 'flex', gap: '8px' }}>
                                                    <button
                                                        onClick={() => handleEditPermissions(role.name)}
                                                        style={{ padding: '6px 12px', border: '1px solid #E5E7EB', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem', backgroundColor: 'white' }}
                                                    >
                                                        Edit Permissions
                                                    </button>
                                                    {!['Super Admin', 'Admin'].includes(role.name) && (
                                                        <button style={{ padding: '6px 12px', border: '1px solid #FCA5A5', color: '#B91C1C', borderRadius: '4px', cursor: 'pointer', background: '#FEF2F2', fontSize: '0.85rem' }}>Delete</button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Permission Matrix Example */}
                                <div>
                                    <h4 style={{ fontSize: '1rem', marginBottom: '16px', color: '#374151' }}>Permission Matrix (Example: Instructor Role)</h4>
                                    <div style={{ overflowX: 'auto' }}>
                                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                                            <thead style={{ backgroundColor: '#F9FAFB' }}>
                                                <tr>
                                                    <th style={{ padding: '12px 16px', textAlign: 'left', borderBottom: '2px solid #E5E7EB', fontWeight: 600 }}>Module</th>
                                                    <th style={{ padding: '12px 16px', textAlign: 'center', borderBottom: '2px solid #E5E7EB', fontWeight: 600 }}>View</th>
                                                    <th style={{ padding: '12px 16px', textAlign: 'center', borderBottom: '2px solid #E5E7EB', fontWeight: 600 }}>Create</th>
                                                    <th style={{ padding: '12px 16px', textAlign: 'center', borderBottom: '2px solid #E5E7EB', fontWeight: 600 }}>Edit</th>
                                                    <th style={{ padding: '12px 16px', textAlign: 'center', borderBottom: '2px solid #E5E7EB', fontWeight: 600 }}>Delete</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {[
                                                    { module: 'Courses', view: true, create: true, edit: true, delete: true },
                                                    { module: 'Exams', view: true, create: true, edit: true, delete: false },
                                                    { module: 'Quizzes', view: true, create: true, edit: true, delete: false },
                                                    { module: 'Users', view: true, create: false, edit: false, delete: false },
                                                    { module: 'Music', view: true, create: false, edit: false, delete: false },
                                                    { module: 'Podcasts', view: true, create: false, edit: false, delete: false },
                                                    { module: 'Products', view: true, create: false, edit: false, delete: false },
                                                    { module: 'Orders', view: true, create: false, edit: false, delete: false },
                                                    { module: 'Vendors', view: false, create: false, edit: false, delete: false },
                                                    { module: 'Payouts', view: false, create: false, edit: false, delete: false },
                                                    { module: 'Settings', view: false, create: false, edit: false, delete: false }
                                                ].map((perm, i) => (
                                                    <tr key={i} style={{ borderBottom: '1px solid #E5E7EB' }}>
                                                        <td style={{ padding: '12px 16px', fontWeight: 500 }}>{perm.module}</td>
                                                        <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                                                            <input type="checkbox" defaultChecked={perm.view} style={{ cursor: 'pointer', width: '16px', height: '16px' }} />
                                                        </td>
                                                        <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                                                            <input type="checkbox" defaultChecked={perm.create} style={{ cursor: 'pointer', width: '16px', height: '16px' }} />
                                                        </td>
                                                        <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                                                            <input type="checkbox" defaultChecked={perm.edit} style={{ cursor: 'pointer', width: '16px', height: '16px' }} />
                                                        </td>
                                                        <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                                                            <input type="checkbox" defaultChecked={perm.delete} style={{ cursor: 'pointer', width: '16px', height: '16px' }} />
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                                        <button style={{ padding: '8px 20px', border: '1px solid #E5E7EB', borderRadius: '8px', cursor: 'pointer', backgroundColor: 'white' }}>Cancel</button>
                                        <button onClick={() => alert('Permissions saved successfully!')} style={{ padding: '8px 20px', backgroundColor: '#4F46E5', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Save Permissions</button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div style={{
                        marginTop: '24px',
                        display: 'flex',
                        gap: '12px',
                        justifyContent: 'flex-end',
                        flexWrap: 'wrap'
                    }}>
                        <button
                            onClick={handleReset}
                            disabled={!hasChanges || saving}
                            style={{
                                padding: '12px 24px',
                                backgroundColor: 'white',
                                color: '#6B7280',
                                border: '1px solid #E5E7EB',
                                borderRadius: '8px',
                                cursor: hasChanges && !saving ? 'pointer' : 'not-allowed',
                                fontWeight: 600,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                opacity: hasChanges && !saving ? 1 : 0.5
                            }}
                        >
                            <RefreshCw size={18} />
                            Reset Changes
                        </button>

                        <button
                            onClick={handleSave}
                            disabled={!hasChanges || saving}
                            style={{
                                padding: '12px 24px',
                                backgroundColor: hasChanges && !saving ? '#4F46E5' : '#9CA3AF',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: hasChanges && !saving ? 'pointer' : 'not-allowed',
                                fontWeight: 600,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}
                        >
                            <Save size={18} />
                            {saving ? 'Saving...' : 'Save Settings'}
                        </button>
                    </div>

                    {/* Permission Editing Modal */}
                    {showPermissionModal && editingRole && rolePermissions[editingRole] && (
                        <div
                            style={{
                                position: 'fixed',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                backgroundColor: 'rgba(0,0,0,0.5)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                zIndex: 1000,
                                padding: '20px'
                            }}
                            onClick={() => setShowPermissionModal(false)}
                        >
                            <div
                                className="card"
                                style={{
                                    width: '100%',
                                    maxWidth: '900px',
                                    maxHeight: '90vh',
                                    overflowY: 'auto',
                                    backgroundColor: 'white',
                                    borderRadius: '16px',
                                    padding: '24px'
                                }}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', paddingBottom: '16px', borderBottom: '2px solid #E5E7EB' }}>
                                    <div>
                                        <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700, color: '#1F2937' }}>
                                            Edit Permissions: {editingRole}
                                        </h2>
                                        <p style={{ margin: '4px 0 0 0', color: '#6B7280', fontSize: '0.9rem' }}>
                                            Configure what this role can access and modify
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setShowPermissionModal(false)}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            fontSize: '24px',
                                            cursor: 'pointer',
                                            color: '#6B7280',
                                            padding: '4px 8px'
                                        }}
                                    >
                                        ×
                                    </button>
                                </div>

                                <div style={{ overflowX: 'auto' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                                        <thead style={{ backgroundColor: '#F9FAFB' }}>
                                            <tr>
                                                <th style={{ padding: '12px 16px', textAlign: 'left', borderBottom: '2px solid #E5E7EB', fontWeight: 600, minWidth: '150px' }}>Module</th>
                                                <th style={{ padding: '12px 16px', textAlign: 'center', borderBottom: '2px solid #E5E7EB', fontWeight: 600 }}>View</th>
                                                <th style={{ padding: '12px 16px', textAlign: 'center', borderBottom: '2px solid #E5E7EB', fontWeight: 600 }}>Create</th>
                                                <th style={{ padding: '12px 16px', textAlign: 'center', borderBottom: '2px solid #E5E7EB', fontWeight: 600 }}>Edit</th>
                                                <th style={{ padding: '12px 16px', textAlign: 'center', borderBottom: '2px solid #E5E7EB', fontWeight: 600 }}>Delete</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {Object.keys(rolePermissions[editingRole]).map((module, i) => (
                                                <tr key={i} style={{ borderBottom: '1px solid #E5E7EB' }}>
                                                    <td style={{ padding: '12px 16px', fontWeight: 500 }}>{module}</td>
                                                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                                                        <input
                                                            type="checkbox"
                                                            checked={rolePermissions[editingRole][module].view || false}
                                                            onChange={(e) => handlePermissionChange(module, 'view', e.target.checked)}
                                                            style={{ cursor: 'pointer', width: '18px', height: '18px' }}
                                                        />
                                                    </td>
                                                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                                                        <input
                                                            type="checkbox"
                                                            checked={rolePermissions[editingRole][module].create || false}
                                                            onChange={(e) => handlePermissionChange(module, 'create', e.target.checked)}
                                                            style={{ cursor: 'pointer', width: '18px', height: '18px' }}
                                                        />
                                                    </td>
                                                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                                                        <input
                                                            type="checkbox"
                                                            checked={rolePermissions[editingRole][module].edit || false}
                                                            onChange={(e) => handlePermissionChange(module, 'edit', e.target.checked)}
                                                            style={{ cursor: 'pointer', width: '18px', height: '18px' }}
                                                        />
                                                    </td>
                                                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                                                        <input
                                                            type="checkbox"
                                                            checked={rolePermissions[editingRole][module].delete || false}
                                                            onChange={(e) => handlePermissionChange(module, 'delete', e.target.checked)}
                                                            style={{ cursor: 'pointer', width: '18px', height: '18px' }}
                                                        />
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end', gap: '12px', paddingTop: '16px', borderTop: '1px solid #E5E7EB' }}>
                                    <button
                                        onClick={() => setShowPermissionModal(false)}
                                        style={{
                                            padding: '10px 24px',
                                            border: '1px solid #E5E7EB',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            backgroundColor: 'white',
                                            fontWeight: 600
                                        }}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSavePermissions}
                                        style={{
                                            padding: '10px 24px',
                                            backgroundColor: '#4F46E5',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            fontWeight: 600,
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px'
                                        }}
                                    >
                                        <Save size={18} />
                                        Save Permissions
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    };
};

export default AdminSettings;
