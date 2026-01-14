import React, { useState } from 'react';
import {
    Settings as SettingsIcon, Globe, Palette, Mail, CreditCard, BookOpen, Users,
    Shield, Search, Bell, Share2, Save, Upload, Eye, EyeOff
} from 'lucide-react';
import Button from '../../components/Button';

const Settings = () => {
    const [activeTab, setActiveTab] = useState('general');
    const [showPassword, setShowPassword] = useState({});
    const [settings, setSettings] = useState({
        // General Settings
        siteName: 'Gaugyan',
        tagline: 'Learn, Grow, Connect',
        contactEmail: 'contact@gaugyan.com',
        supportEmail: 'support@gaugyan.com',
        timezone: 'Asia/Kolkata',
        dateFormat: 'DD/MM/YYYY',
        language: 'en',

        // Appearance
        primaryColor: '#F97316',
        secondaryColor: '#3B82F6',
        fontFamily: 'Inter',

        // Email Settings
        smtpHost: 'smtp.gmail.com',
        smtpPort: '587',
        smtpUsername: '',
        smtpPassword: '',
        fromEmail: 'noreply@gaugyan.com',
        fromName: 'Gaugyan',

        // Payment Settings
        currency: 'INR',
        currencySymbol: '₹',
        paymentGateway: 'razorpay',
        razorpayKey: '',
        razorpaySecret: '',
        testMode: true,

        // Course Settings
        defaultDuration: '30',
        enrollmentApproval: false,
        courseReview: true,
        maxStudents: '100',

        // User Settings
        registrationEnabled: true,
        emailVerification: true,
        defaultRole: 'student',

        // Security
        twoFactorAuth: false,
        sessionTimeout: '30',

        // SEO
        metaTitle: 'Gaugyan - Learn Ayurveda, Yoga & Vedic Studies',
        metaDescription: 'Join Gaugyan to learn about Ayurveda, Yoga, Meditation, and Vedic Studies',
        googleAnalytics: '',

        // Social Media
        facebookUrl: '',
        twitterUrl: '',
        instagramUrl: '',
        linkedinUrl: ''
    });

    const handleInputChange = (field, value) => {
        setSettings({ ...settings, [field]: value });
    };

    const handleSave = () => {
        // In a real app, this would save to backend
        alert('Settings saved successfully!');
        console.log('Saved settings:', settings);
    };

    const tabs = [
        { id: 'general', label: 'General', icon: <Globe size={18} /> },
        { id: 'appearance', label: 'Appearance', icon: <Palette size={18} /> },
        { id: 'email', label: 'Email', icon: <Mail size={18} /> },
        { id: 'payment', label: 'Payment', icon: <CreditCard size={18} /> },
        { id: 'course', label: 'Course', icon: <BookOpen size={18} /> },
        { id: 'user', label: 'User', icon: <Users size={18} /> },
        { id: 'security', label: 'Security', icon: <Shield size={18} /> },
        { id: 'seo', label: 'SEO', icon: <Search size={18} /> },
        { id: 'social', label: 'Social Media', icon: <Share2 size={18} /> },
    ];

    const renderGeneralSettings = () => (
        <div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', fontWeight: 600 }}>General Settings</h2>

            <div style={{ display: 'grid', gap: '1.5rem' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Site Name</label>
                    <input
                        type="text"
                        value={settings.siteName}
                        onChange={(e) => handleInputChange('siteName', e.target.value)}
                        style={{ width: '100%', padding: '0.75rem', border: '1px solid #E5E7EB', borderRadius: '8px' }}
                    />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Tagline</label>
                    <input
                        type="text"
                        value={settings.tagline}
                        onChange={(e) => handleInputChange('tagline', e.target.value)}
                        style={{ width: '100%', padding: '0.75rem', border: '1px solid #E5E7EB', borderRadius: '8px' }}
                    />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Contact Email</label>
                        <input
                            type="email"
                            value={settings.contactEmail}
                            onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                            style={{ width: '100%', padding: '0.75rem', border: '1px solid #E5E7EB', borderRadius: '8px' }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Support Email</label>
                        <input
                            type="email"
                            value={settings.supportEmail}
                            onChange={(e) => handleInputChange('supportEmail', e.target.value)}
                            style={{ width: '100%', padding: '0.75rem', border: '1px solid #E5E7EB', borderRadius: '8px' }}
                        />
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Timezone</label>
                        <select
                            value={settings.timezone}
                            onChange={(e) => handleInputChange('timezone', e.target.value)}
                            style={{ width: '100%', padding: '0.75rem', border: '1px solid #E5E7EB', borderRadius: '8px' }}
                        >
                            <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                            <option value="America/New_York">America/New York (EST)</option>
                            <option value="Europe/London">Europe/London (GMT)</option>
                        </select>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Date Format</label>
                        <select
                            value={settings.dateFormat}
                            onChange={(e) => handleInputChange('dateFormat', e.target.value)}
                            style={{ width: '100%', padding: '0.75rem', border: '1px solid #E5E7EB', borderRadius: '8px' }}
                        >
                            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                        </select>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Language</label>
                        <select
                            value={settings.language}
                            onChange={(e) => handleInputChange('language', e.target.value)}
                            style={{ width: '100%', padding: '0.75rem', border: '1px solid #E5E7EB', borderRadius: '8px' }}
                        >
                            <option value="en">English</option>
                            <option value="hi">Hindi</option>
                            <option value="mr">Marathi</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Site Logo</label>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <div style={{ width: '100px', height: '100px', border: '2px dashed #E5E7EB', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F9FAFB' }}>
                            <Upload size={32} color="#9CA3AF" />
                        </div>
                        <Button style={{ gap: '0.5rem' }}>
                            <Upload size={18} /> Upload Logo
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderAppearanceSettings = () => (
        <div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', fontWeight: 600 }}>Appearance Settings</h2>

            <div style={{ display: 'grid', gap: '1.5rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Primary Color</label>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <input
                                type="color"
                                value={settings.primaryColor}
                                onChange={(e) => handleInputChange('primaryColor', e.target.value)}
                                style={{ width: '60px', height: '40px', border: '1px solid #E5E7EB', borderRadius: '8px', cursor: 'pointer' }}
                            />
                            <input
                                type="text"
                                value={settings.primaryColor}
                                onChange={(e) => handleInputChange('primaryColor', e.target.value)}
                                style={{ flex: 1, padding: '0.75rem', border: '1px solid #E5E7EB', borderRadius: '8px' }}
                            />
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Secondary Color</label>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <input
                                type="color"
                                value={settings.secondaryColor}
                                onChange={(e) => handleInputChange('secondaryColor', e.target.value)}
                                style={{ width: '60px', height: '40px', border: '1px solid #E5E7EB', borderRadius: '8px', cursor: 'pointer' }}
                            />
                            <input
                                type="text"
                                value={settings.secondaryColor}
                                onChange={(e) => handleInputChange('secondaryColor', e.target.value)}
                                style={{ flex: 1, padding: '0.75rem', border: '1px solid #E5E7EB', borderRadius: '8px' }}
                            />
                        </div>
                    </div>
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Font Family</label>
                    <select
                        value={settings.fontFamily}
                        onChange={(e) => handleInputChange('fontFamily', e.target.value)}
                        style={{ width: '100%', padding: '0.75rem', border: '1px solid #E5E7EB', borderRadius: '8px' }}
                    >
                        <option value="Inter">Inter</option>
                        <option value="Roboto">Roboto</option>
                        <option value="Open Sans">Open Sans</option>
                        <option value="Poppins">Poppins</option>
                    </select>
                </div>
            </div>
        </div>
    );

    const renderEmailSettings = () => (
        <div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', fontWeight: 600 }}>Email Settings</h2>

            <div style={{ display: 'grid', gap: '1.5rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>SMTP Host</label>
                        <input
                            type="text"
                            value={settings.smtpHost}
                            onChange={(e) => handleInputChange('smtpHost', e.target.value)}
                            style={{ width: '100%', padding: '0.75rem', border: '1px solid #E5E7EB', borderRadius: '8px' }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>SMTP Port</label>
                        <input
                            type="text"
                            value={settings.smtpPort}
                            onChange={(e) => handleInputChange('smtpPort', e.target.value)}
                            style={{ width: '100%', padding: '0.75rem', border: '1px solid #E5E7EB', borderRadius: '8px' }}
                        />
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>SMTP Username</label>
                        <input
                            type="text"
                            value={settings.smtpUsername}
                            onChange={(e) => handleInputChange('smtpUsername', e.target.value)}
                            style={{ width: '100%', padding: '0.75rem', border: '1px solid #E5E7EB', borderRadius: '8px' }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>SMTP Password</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type={showPassword.smtp ? 'text' : 'password'}
                                value={settings.smtpPassword}
                                onChange={(e) => handleInputChange('smtpPassword', e.target.value)}
                                style={{ width: '100%', padding: '0.75rem', paddingRight: '3rem', border: '1px solid #E5E7EB', borderRadius: '8px' }}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword({ ...showPassword, smtp: !showPassword.smtp })}
                                style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer' }}
                            >
                                {showPassword.smtp ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>From Email</label>
                        <input
                            type="email"
                            value={settings.fromEmail}
                            onChange={(e) => handleInputChange('fromEmail', e.target.value)}
                            style={{ width: '100%', padding: '0.75rem', border: '1px solid #E5E7EB', borderRadius: '8px' }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>From Name</label>
                        <input
                            type="text"
                            value={settings.fromName}
                            onChange={(e) => handleInputChange('fromName', e.target.value)}
                            style={{ width: '100%', padding: '0.75rem', border: '1px solid #E5E7EB', borderRadius: '8px' }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );

    const renderPaymentSettings = () => (
        <div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', fontWeight: 600 }}>Payment Settings</h2>

            <div style={{ display: 'grid', gap: '1.5rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Currency</label>
                        <select
                            value={settings.currency}
                            onChange={(e) => handleInputChange('currency', e.target.value)}
                            style={{ width: '100%', padding: '0.75rem', border: '1px solid #E5E7EB', borderRadius: '8px' }}
                        >
                            <option value="INR">INR - Indian Rupee</option>
                            <option value="USD">USD - US Dollar</option>
                            <option value="EUR">EUR - Euro</option>
                        </select>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Currency Symbol</label>
                        <input
                            type="text"
                            value={settings.currencySymbol}
                            onChange={(e) => handleInputChange('currencySymbol', e.target.value)}
                            style={{ width: '100%', padding: '0.75rem', border: '1px solid #E5E7EB', borderRadius: '8px' }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Payment Gateway</label>
                        <select
                            value={settings.paymentGateway}
                            onChange={(e) => handleInputChange('paymentGateway', e.target.value)}
                            style={{ width: '100%', padding: '0.75rem', border: '1px solid #E5E7EB', borderRadius: '8px' }}
                        >
                            <option value="razorpay">Razorpay</option>
                            <option value="stripe">Stripe</option>
                            <option value="paypal">PayPal</option>
                        </select>
                    </div>
                </div>

                {settings.paymentGateway === 'razorpay' && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Razorpay Key ID</label>
                            <input
                                type="text"
                                value={settings.razorpayKey}
                                onChange={(e) => handleInputChange('razorpayKey', e.target.value)}
                                placeholder="rzp_test_xxxxx"
                                style={{ width: '100%', padding: '0.75rem', border: '1px solid #E5E7EB', borderRadius: '8px' }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Razorpay Secret</label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type={showPassword.razorpay ? 'text' : 'password'}
                                    value={settings.razorpaySecret}
                                    onChange={(e) => handleInputChange('razorpaySecret', e.target.value)}
                                    placeholder="xxxxxxxxxxxxx"
                                    style={{ width: '100%', padding: '0.75rem', paddingRight: '3rem', border: '1px solid #E5E7EB', borderRadius: '8px' }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword({ ...showPassword, razorpay: !showPassword.razorpay })}
                                    style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer' }}
                                >
                                    {showPassword.razorpay ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                        <input
                            type="checkbox"
                            checked={settings.testMode}
                            onChange={(e) => handleInputChange('testMode', e.target.checked)}
                            style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                        />
                        <span style={{ fontWeight: 500 }}>Enable Test Mode</span>
                    </label>
                    <p style={{ fontSize: '0.85rem', color: '#6B7280', marginTop: '0.25rem', marginLeft: '1.5rem' }}>
                        Use test API keys for development
                    </p>
                </div>
            </div>
        </div>
    );

    const renderCourseSettings = () => (
        <div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', fontWeight: 600 }}>Course Settings</h2>

            <div style={{ display: 'grid', gap: '1.5rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Default Course Duration (days)</label>
                        <input
                            type="number"
                            value={settings.defaultDuration}
                            onChange={(e) => handleInputChange('defaultDuration', e.target.value)}
                            style={{ width: '100%', padding: '0.75rem', border: '1px solid #E5E7EB', borderRadius: '8px' }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Max Students per Course</label>
                        <input
                            type="number"
                            value={settings.maxStudents}
                            onChange={(e) => handleInputChange('maxStudents', e.target.value)}
                            style={{ width: '100%', padding: '0.75rem', border: '1px solid #E5E7EB', borderRadius: '8px' }}
                        />
                    </div>
                </div>

                <div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                        <input
                            type="checkbox"
                            checked={settings.enrollmentApproval}
                            onChange={(e) => handleInputChange('enrollmentApproval', e.target.checked)}
                            style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                        />
                        <span style={{ fontWeight: 500 }}>Require Enrollment Approval</span>
                    </label>
                </div>

                <div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                        <input
                            type="checkbox"
                            checked={settings.courseReview}
                            onChange={(e) => handleInputChange('courseReview', e.target.checked)}
                            style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                        />
                        <span style={{ fontWeight: 500 }}>Enable Course Review System</span>
                    </label>
                </div>
            </div>
        </div>
    );

    const renderUserSettings = () => (
        <div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', fontWeight: 600 }}>User Settings</h2>

            <div style={{ display: 'grid', gap: '1.5rem' }}>
                <div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                        <input
                            type="checkbox"
                            checked={settings.registrationEnabled}
                            onChange={(e) => handleInputChange('registrationEnabled', e.target.checked)}
                            style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                        />
                        <span style={{ fontWeight: 500 }}>Allow User Registration</span>
                    </label>
                </div>

                <div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                        <input
                            type="checkbox"
                            checked={settings.emailVerification}
                            onChange={(e) => handleInputChange('emailVerification', e.target.value)}
                            style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                        />
                        <span style={{ fontWeight: 500 }}>Require Email Verification</span>
                    </label>
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Default User Role</label>
                    <select
                        value={settings.defaultRole}
                        onChange={(e) => handleInputChange('defaultRole', e.target.value)}
                        style={{ width: '100%', padding: '0.75rem', border: '1px solid #E5E7EB', borderRadius: '8px' }}
                    >
                        <option value="student">Student</option>
                        <option value="instructor">Instructor</option>
                    </select>
                </div>
            </div>
        </div>
    );

    const renderSecuritySettings = () => (
        <div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', fontWeight: 600 }}>Security Settings</h2>

            <div style={{ display: 'grid', gap: '1.5rem' }}>
                <div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                        <input
                            type="checkbox"
                            checked={settings.twoFactorAuth}
                            onChange={(e) => handleInputChange('twoFactorAuth', e.target.checked)}
                            style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                        />
                        <span style={{ fontWeight: 500 }}>Enable Two-Factor Authentication</span>
                    </label>
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Session Timeout (minutes)</label>
                    <input
                        type="number"
                        value={settings.sessionTimeout}
                        onChange={(e) => handleInputChange('sessionTimeout', e.target.value)}
                        style={{ width: '100%', padding: '0.75rem', border: '1px solid #E5E7EB', borderRadius: '8px' }}
                    />
                </div>
            </div>
        </div>
    );

    const renderSEOSettings = () => (
        <div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', fontWeight: 600 }}>SEO Settings</h2>

            <div style={{ display: 'grid', gap: '1.5rem' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Meta Title</label>
                    <input
                        type="text"
                        value={settings.metaTitle}
                        onChange={(e) => handleInputChange('metaTitle', e.target.value)}
                        style={{ width: '100%', padding: '0.75rem', border: '1px solid #E5E7EB', borderRadius: '8px' }}
                    />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Meta Description</label>
                    <textarea
                        value={settings.metaDescription}
                        onChange={(e) => handleInputChange('metaDescription', e.target.value)}
                        rows={3}
                        style={{ width: '100%', padding: '0.75rem', border: '1px solid #E5E7EB', borderRadius: '8px', resize: 'vertical' }}
                    />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Google Analytics ID</label>
                    <input
                        type="text"
                        value={settings.googleAnalytics}
                        onChange={(e) => handleInputChange('googleAnalytics', e.target.value)}
                        placeholder="G-XXXXXXXXXX"
                        style={{ width: '100%', padding: '0.75rem', border: '1px solid #E5E7EB', borderRadius: '8px' }}
                    />
                </div>
            </div>
        </div>
    );

    const renderSocialSettings = () => (
        <div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', fontWeight: 600 }}>Social Media Settings</h2>

            <div style={{ display: 'grid', gap: '1.5rem' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Facebook URL</label>
                    <input
                        type="url"
                        value={settings.facebookUrl}
                        onChange={(e) => handleInputChange('facebookUrl', e.target.value)}
                        placeholder="https://facebook.com/gaugyan"
                        style={{ width: '100%', padding: '0.75rem', border: '1px solid #E5E7EB', borderRadius: '8px' }}
                    />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Twitter URL</label>
                    <input
                        type="url"
                        value={settings.twitterUrl}
                        onChange={(e) => handleInputChange('twitterUrl', e.target.value)}
                        placeholder="https://twitter.com/gaugyan"
                        style={{ width: '100%', padding: '0.75rem', border: '1px solid #E5E7EB', borderRadius: '8px' }}
                    />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Instagram URL</label>
                    <input
                        type="url"
                        value={settings.instagramUrl}
                        onChange={(e) => handleInputChange('instagramUrl', e.target.value)}
                        placeholder="https://instagram.com/gaugyan"
                        style={{ width: '100%', padding: '0.75rem', border: '1px solid #E5E7EB', borderRadius: '8px' }}
                    />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>LinkedIn URL</label>
                    <input
                        type="url"
                        value={settings.linkedinUrl}
                        onChange={(e) => handleInputChange('linkedinUrl', e.target.value)}
                        placeholder="https://linkedin.com/company/gaugyan"
                        style={{ width: '100%', padding: '0.75rem', border: '1px solid #E5E7EB', borderRadius: '8px' }}
                    />
                </div>
            </div>
        </div>
    );

    const renderContent = () => {
        switch (activeTab) {
            case 'general': return renderGeneralSettings();
            case 'appearance': return renderAppearanceSettings();
            case 'email': return renderEmailSettings();
            case 'payment': return renderPaymentSettings();
            case 'course': return renderCourseSettings();
            case 'user': return renderUserSettings();
            case 'security': return renderSecuritySettings();
            case 'seo': return renderSEOSettings();
            case 'social': return renderSocialSettings();
            default: return renderGeneralSettings();
        }
    };

    return (
        <div className="container mt-lg">
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <SettingsIcon size={32} />
                <h1 style={{ fontSize: '2rem', fontWeight: 700 }}>Settings</h1>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '2rem' }}>
                {/* Sidebar */}
                <div className="card" style={{ padding: '1rem', height: 'fit-content' }}>
                    <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.75rem',
                                    padding: '0.75rem 1rem',
                                    border: 'none',
                                    borderRadius: '8px',
                                    backgroundColor: activeTab === tab.id ? '#F97316' : 'transparent',
                                    color: activeTab === tab.id ? 'white' : '#374151',
                                    cursor: 'pointer',
                                    fontWeight: activeTab === tab.id ? 600 : 400,
                                    transition: 'all 0.2s',
                                    textAlign: 'left'
                                }}
                            >
                                {tab.icon}
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Content */}
                <div className="card" style={{ padding: '2rem' }}>
                    {renderContent()}

                    {/* Save Button */}
                    <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid #E5E7EB', display: 'flex', justifyContent: 'flex-end' }}>
                        <Button onClick={handleSave} style={{ gap: '0.5rem' }}>
                            <Save size={18} /> Save Changes
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
