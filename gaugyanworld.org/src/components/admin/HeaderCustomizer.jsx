import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash2, Link as LinkIcon, Image as ImageIcon } from 'lucide-react';
import { settingsService } from '../../services/api';
import ImageUploader from '../ImageUploader';

const HeaderCustomizer = () => {
    const [loading, setLoading] = useState(false);
    const [settings, setSettings] = useState({
        logo: '',
        topBar: {
            enabled: true,
            links: [
                { label: '📍 Gaushala Near Me', url: '/gaushala' },
                { label: '📢 Advertise with Gaugyan', url: '/advertise' }
            ]
        },
        mainMenu: [] // Will default if empty upon load
    });

    const loadSettings = async () => {
        try {
            const response = await settingsService.getSettings('header');
            if (response.data && response.data.settings && Object.keys(response.data.settings).length > 0) {
                setSettings(response.data.settings);
            }
        } catch (error) {
            console.error('Error loading header settings:', error);
        }
    };

    useEffect(() => {
        loadSettings();
    }, []);

    const handleSave = async () => {
        setLoading(true);
        try {
            await settingsService.updateSettings('header', settings);
            alert('Header settings saved successfully!');
        } catch (error) {
            console.error('Error saving header settings:', error);
            alert('Failed to save header settings');
        }
        setLoading(false);
    };

    const handleTopBarLinkChange = (index, field, value) => {
        const newLinks = [...settings.topBar.links];
        newLinks[index] = { ...newLinks[index], [field]: value };
        setSettings({
            ...settings,
            topBar: { ...settings.topBar, links: newLinks }
        });
    };

    const addTopBarLink = () => {
        setSettings({
            ...settings,
            topBar: {
                ...settings.topBar,
                links: [...settings.topBar.links, { label: 'New Link', url: '/' }]
            }
        });
    };

    const removeTopBarLink = (index) => {
        const newLinks = settings.topBar.links.filter((_, i) => i !== index);
        setSettings({
            ...settings,
            topBar: { ...settings.topBar, links: newLinks }
        });
    };

    return (
        <div style={{ display: 'grid', gap: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1F2937' }}>Header Customization</h2>
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

            {/* Logo Settings */}
            <div className="card" style={{ padding: '24px', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ImageIcon size={20} /> Logo Configuration
                </h3>
                <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Main Logo</label>
                    <ImageUploader
                        value={settings.logo ? [settings.logo] : []}
                        onChange={(urls) => setSettings({ ...settings, logo: urls[0] || '' })}
                    />
                    {settings.logo && (
                        <div style={{ marginTop: '12px', padding: '16px', backgroundColor: '#F3F4F6', borderRadius: '8px' }}>
                            <p style={{ fontSize: '0.875rem', marginBottom: '8px', fontWeight: 500 }}>Preview:</p>
                            <img src={settings.logo} alt="Logo Preview" style={{ maxHeight: '60px', objectFit: 'contain' }} />
                        </div>
                    )}
                </div>
            </div>

            {/* Top Bar Settings */}
            <div className="card" style={{ padding: '24px', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <LinkIcon size={20} /> Top Header Bar
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <label style={{ fontSize: '0.9rem', fontWeight: 500 }}>Enable Top Bar</label>
                        <input
                            type="checkbox"
                            checked={settings.topBar?.enabled ?? true}
                            onChange={(e) => setSettings({ ...settings, topBar: { ...settings.topBar, enabled: e.target.checked } })}
                            style={{ cursor: 'pointer', width: '16px', height: '16px' }}
                        />
                    </div>
                </div>

                {(settings.topBar?.enabled ?? true) && (
                    <div style={{ display: 'grid', gap: '12px' }}>
                        {settings.topBar?.links?.map((link, index) => (
                            <div key={index} style={{ display: 'flex', gap: '12px', alignItems: 'center', padding: '12px', backgroundColor: '#F9FAFB', borderRadius: '8px' }}>
                                <input
                                    type="text"
                                    value={link.label}
                                    onChange={(e) => handleTopBarLinkChange(index, 'label', e.target.value)}
                                    placeholder="Link Label (e.g., 📍 Gaushala Near Me)"
                                    style={{ flex: 1, padding: '8px', borderRadius: '6px', border: '1px solid #D1D5DB' }}
                                />
                                <input
                                    type="text"
                                    value={link.url}
                                    onChange={(e) => handleTopBarLinkChange(index, 'url', e.target.value)}
                                    placeholder="URL (e.g., /gaushala)"
                                    style={{ flex: 1, padding: '8px', borderRadius: '6px', border: '1px solid #D1D5DB' }}
                                />
                                <button
                                    onClick={() => removeTopBarLink(index)}
                                    style={{ padding: '8px', color: '#EF4444', background: 'none', border: 'none', cursor: 'pointer' }}
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        ))}
                        <button
                            onClick={addTopBarLink}
                            style={{
                                padding: '8px 16px',
                                border: '1px dashed #D1D5DB',
                                borderRadius: '8px',
                                backgroundColor: 'transparent',
                                color: '#4B5563',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                                fontWeight: 500
                            }}
                        >
                            <Plus size={16} /> Add Top Bar Link
                        </button>
                    </div>
                )}
            </div>

            {/* Navigation Menu Settings - Simplified for now, complex recursive editor might be too much for this step, 
                but we can add basic toggles or override hardcoded menu later if needed. 
                For now, focusing on Logo and Top Bar as these are most visible. 
                We can add 'Custom Menu Items' append later. */}

            <div className="card" style={{ padding: '24px', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '8px' }}>Main Navigation</h3>
                <p style={{ color: '#6B7280', fontSize: '0.9rem' }}>
                    Note: The main navigation structure (Education, Entertainment, Shop, etc.) is currently fixed to ensure correct app flow.
                    However, your Logo and Top Bar settings above will apply immediately.
                </p>
            </div>
        </div>
    );
};

export default HeaderCustomizer;
