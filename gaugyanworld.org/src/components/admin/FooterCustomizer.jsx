import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash2, Layout, Mail, Phone, MapPin } from 'lucide-react';
import { settingsService } from '../../services/api';

const FooterCustomizer = () => {
    const [loading, setLoading] = useState(false);
    const [settings, setSettings] = useState({
        description: 'Empowering people with cow\'s multidimensional aspects.',
        contact: {
            email: 'info@gaugyan.com',
            phone: '+91 6367176883',
            address: 'Plot No-20, Bhairu Nagar, Hathoj, Kalwar Road, Jhotwara Jaipur-302012',
            gst: '08ABBFG3554F1ZK'
        },
        columns: [
            // Default columns structure reference if needed, but we start empty or fetch from backend
        ]
    });

    useEffect(() => {
        const loadSettings = async () => {
            try {
                const response = await settingsService.getSettings('footer');
                if (response.data && response.data.settings && Object.keys(response.data.settings).length > 0) {
                    setSettings(prev => ({ ...prev, ...response.data.settings }));
                }
            } catch (error) {
                console.error('Error loading footer settings:', error);
            }
        };
        loadSettings();
    }, []);

    const handleSave = async () => {
        setLoading(true);
        try {
            await settingsService.updateSettings('footer', settings);
            alert('Footer settings saved successfully!');
        } catch (error) {
            console.error('Error saving footer settings:', error);
            alert('Failed to save footer settings');
        }
        setLoading(false);
    };

    const handleChange = (field, value) => {
        setSettings(prev => ({ ...prev, [field]: value }));
    };

    const handleContactChange = (field, value) => {
        setSettings(prev => ({
            ...prev,
            contact: { ...prev.contact, [field]: value }
        }));
    };

    return (
        <div style={{ display: 'grid', gap: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1F2937' }}>Footer Customization</h2>
                <button
                    onClick={handleSave}
                    disabled={loading}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#4F46E5',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontWeight: 600,
                        opacity: loading ? 0.7 : 1
                    }}
                >
                    <Save size={18} />
                    {loading ? 'Saving...' : 'Save Changes'}
                </button>
            </div>

            {/* General Info */}
            <div className="card" style={{ padding: '24px', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Layout size={20} /> General Information
                </h3>
                <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Footer Description</label>
                    <textarea
                        value={settings.description}
                        onChange={(e) => handleChange('description', e.target.value)}
                        rows={3}
                        style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #D1D5DB' }}
                        placeholder="Short description under the Logo..."
                    />
                </div>
            </div>

            {/* Contact Info */}
            <div className="card" style={{ padding: '24px', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    Contact Details
                </h3>
                <div style={{ display: 'grid', gap: '16px' }}>
                    <div>
                        <label style={{ marginBottom: '6px', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '6px' }}><Mail size={16} /> Email</label>
                        <input
                            type="text"
                            value={settings.contact?.email}
                            onChange={(e) => handleContactChange('email', e.target.value)}
                            style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #D1D5DB' }}
                        />
                    </div>
                    <div>
                        <label style={{ marginBottom: '6px', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '6px' }}><Phone size={16} /> Phone</label>
                        <input
                            type="text"
                            value={settings.contact?.phone}
                            onChange={(e) => handleContactChange('phone', e.target.value)}
                            style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #D1D5DB' }}
                        />
                    </div>
                    <div>
                        <label style={{ marginBottom: '6px', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '6px' }}><MapPin size={16} /> Address</label>
                        <textarea
                            value={settings.contact?.address}
                            onChange={(e) => handleContactChange('address', e.target.value)}
                            rows={3}
                            style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #D1D5DB' }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '6px', fontWeight: 500 }}>GST Number</label>
                        <input
                            type="text"
                            value={settings.contact?.gst}
                            onChange={(e) => handleContactChange('gst', e.target.value)}
                            style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #D1D5DB' }}
                        />
                    </div>
                </div>
            </div>

            {/* Note about Column Links */}
            <div className="card" style={{ padding: '24px', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <p style={{ color: '#6B7280', fontSize: '0.9rem' }}>
                    Note: Footer navigation columns are currently following the site structure.
                    Contact details updated here will reflect in the footer immediately.
                    Social Media links can be managed in the "Social Media" tab.
                </p>
            </div>
        </div>
    );
};

export default FooterCustomizer;
