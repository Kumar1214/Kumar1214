import React, { useState } from 'react';
import { Upload, Type, Image as ImageIcon, Hash, Save, Eye, Download, Settings as SettingsIcon } from 'lucide-react';

const AdminCertificateSettings = () => {
    const [settings, setSettings] = useState({
        // Background
        backgroundImage: 'https://example.com/certificate-bg.jpg',

        // Fonts
        titleFont: 'Georgia',
        titleFontSize: 48,
        titleColor: '#F97316',

        nameFont: 'Arial',
        nameFontSize: 36,
        nameColor: '#1F2937',

        bodyFont: 'Arial',
        bodyFontSize: 14,
        bodyColor: '#374151',

        // Signatures
        signature1: '',
        signature1Name: 'Name & Position',
        signature1Title: 'Organizer',

        signature2: '',
        signature2Name: 'Ashok Kumar Sharma',
        signature2Title: 'Exam Controller',

        signature3: '',
        signature3Name: 'Om Saraswat',
        signature3Title: 'Secretary',

        // Serial Number
        serialNumberPrefix: 'GG',
        serialNumberFormat: 'auto', // auto or manual
        serialNumberStart: 1001,
        serialNumberPadding: 4,

        // Certificate Text
        organizationName: 'GauGyan',
        certificateTitle: 'Certificate of Completion',

        // Issue Date Format
        dateFormat: 'DD MMM, YYYY' // e.g., 15 Sep, 2024
    });

    const [previewData, setPreviewData] = useState({
        userName: 'John Doe',
        userId: 'GG12345',
        courseName: 'Ayurveda Basics',
        completionDate: '15 Sep, 2024',
        serialNumber: 'GG1001'
    });

    const handleFileUpload = (field, event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSettings({ ...settings, [field]: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = () => {
        // In production, save to backend/DataContext
        alert('Certificate settings saved successfully!');
    };

    const generatePreview = () => {
        alert('Certificate preview will open in new window');
    };

    return (
        <div style={{ backgroundColor: '#F9FAFB', minHeight: '100vh', padding: window.innerWidth > 768 ? '32px' : '16px' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                {/* Header */}
                <div style={{ marginBottom: '32px' }}>
                    <h1 style={{ fontSize: window.innerWidth > 768 ? '2rem' : '1.5rem', fontWeight: 700, color: '#1F2937', marginBottom: '8px' }}>
                        Certificate Settings
                    </h1>
                    <p style={{ color: '#6B7280' }}>Configure certificate templates and generation settings</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth > 1024 ? '2fr 1fr' : '1fr', gap: '24px' }}>
                    {/* Settings Panel */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        {/* Background Settings */}
                        <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <ImageIcon size={20} color="#F97316" />
                                Background Image
                            </h3>
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '8px', color: '#374151' }}>
                                    Upload Background
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleFileUpload('backgroundImage', e)}
                                    style={{ display: 'none' }}
                                    id="bg-upload"
                                />
                                <label
                                    htmlFor="bg-upload"
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        padding: '10px 20px',
                                        backgroundColor: '#F97316',
                                        color: 'white',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        fontWeight: 600
                                    }}
                                >
                                    <Upload size={18} />
                                    Choose File
                                </label>
                            </div>
                            {settings.backgroundImage && (
                                <div style={{ marginTop: '12px' }}>
                                    <img src={settings.backgroundImage} alt="Background" style={{ maxWidth: '100%', borderRadius: '8px', border: '1px solid #E5E7EB' }} />
                                </div>
                            )}
                        </div>

                        {/* Font Settings */}
                        <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Type size={20} color="#F97316" />
                                Font Settings
                            </h3>

                            {/* Title Font */}
                            <div style={{ marginBottom: '20px', padding: '16px', backgroundColor: '#F9FAFB', borderRadius: '8px' }}>
                                <h4 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '12px', color: '#1F2937' }}>Title Font (Organization Name)</h4>
                                <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth > 640 ? 'repeat(3, 1fr)' : '1fr', gap: '12px' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, marginBottom: '4px', color: '#6B7280' }}>Font Family</label>
                                        <select
                                            value={settings.titleFont}
                                            onChange={(e) => setSettings({ ...settings, titleFont: e.target.value })}
                                            style={{ width: '100%', padding: '8px', border: '1px solid #E5E7EB', borderRadius: '6px', fontSize: '0.875rem' }}
                                        >
                                            <option value="Georgia">Georgia</option>
                                            <option value="Arial">Arial</option>
                                            <option value="Times New Roman">Times New Roman</option>
                                            <option value="Helvetica">Helvetica</option>
                                            <option value="Verdana">Verdana</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, marginBottom: '4px', color: '#6B7280' }}>Size (px)</label>
                                        <input
                                            type="number"
                                            value={settings.titleFontSize}
                                            onChange={(e) => setSettings({ ...settings, titleFontSize: parseInt(e.target.value) })}
                                            style={{ width: '100%', padding: '8px', border: '1px solid #E5E7EB', borderRadius: '6px', fontSize: '0.875rem' }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, marginBottom: '4px', color: '#6B7280' }}>Color</label>
                                        <input
                                            type="color"
                                            value={settings.titleColor}
                                            onChange={(e) => setSettings({ ...settings, titleColor: e.target.value })}
                                            style={{ width: '100%', height: '38px', border: '1px solid #E5E7EB', borderRadius: '6px', cursor: 'pointer' }}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Name Font */}
                            <div style={{ marginBottom: '20px', padding: '16px', backgroundColor: '#F9FAFB', borderRadius: '8px' }}>
                                <h4 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '12px', color: '#1F2937' }}>Name Font (User Name)</h4>
                                <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth > 640 ? 'repeat(3, 1fr)' : '1fr', gap: '12px' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, marginBottom: '4px', color: '#6B7280' }}>Font Family</label>
                                        <select
                                            value={settings.nameFont}
                                            onChange={(e) => setSettings({ ...settings, nameFont: e.target.value })}
                                            style={{ width: '100%', padding: '8px', border: '1px solid #E5E7EB', borderRadius: '6px', fontSize: '0.875rem' }}
                                        >
                                            <option value="Georgia">Georgia</option>
                                            <option value="Arial">Arial</option>
                                            <option value="Times New Roman">Times New Roman</option>
                                            <option value="Helvetica">Helvetica</option>
                                            <option value="Verdana">Verdana</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, marginBottom: '4px', color: '#6B7280' }}>Size (px)</label>
                                        <input
                                            type="number"
                                            value={settings.nameFontSize}
                                            onChange={(e) => setSettings({ ...settings, nameFontSize: parseInt(e.target.value) })}
                                            style={{ width: '100%', padding: '8px', border: '1px solid #E5E7EB', borderRadius: '6px', fontSize: '0.875rem' }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, marginBottom: '4px', color: '#6B7280' }}>Color</label>
                                        <input
                                            type="color"
                                            value={settings.nameColor}
                                            onChange={(e) => setSettings({ ...settings, nameColor: e.target.value })}
                                            style={{ width: '100%', height: '38px', border: '1px solid #E5E7EB', borderRadius: '6px', cursor: 'pointer' }}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Body Font */}
                            <div style={{ padding: '16px', backgroundColor: '#F9FAFB', borderRadius: '8px' }}>
                                <h4 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '12px', color: '#1F2937' }}>Body Font (Description Text)</h4>
                                <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth > 640 ? 'repeat(3, 1fr)' : '1fr', gap: '12px' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, marginBottom: '4px', color: '#6B7280' }}>Font Family</label>
                                        <select
                                            value={settings.bodyFont}
                                            onChange={(e) => setSettings({ ...settings, bodyFont: e.target.value })}
                                            style={{ width: '100%', padding: '8px', border: '1px solid #E5E7EB', borderRadius: '6px', fontSize: '0.875rem' }}
                                        >
                                            <option value="Georgia">Georgia</option>
                                            <option value="Arial">Arial</option>
                                            <option value="Times New Roman">Times New Roman</option>
                                            <option value="Helvetica">Helvetica</option>
                                            <option value="Verdana">Verdana</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, marginBottom: '4px', color: '#6B7280' }}>Size (px)</label>
                                        <input
                                            type="number"
                                            value={settings.bodyFontSize}
                                            onChange={(e) => setSettings({ ...settings, bodyFontSize: parseInt(e.target.value) })}
                                            style={{ width: '100%', padding: '8px', border: '1px solid #E5E7EB', borderRadius: '6px', fontSize: '0.875rem' }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, marginBottom: '4px', color: '#6B7280' }}>Color</label>
                                        <input
                                            type="color"
                                            value={settings.bodyColor}
                                            onChange={(e) => setSettings({ ...settings, bodyColor: e.target.value })}
                                            style={{ width: '100%', height: '38px', border: '1px solid #E5E7EB', borderRadius: '6px', cursor: 'pointer' }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Signature Settings */}
                        <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Upload size={20} color="#F97316" />
                                Signature Settings
                            </h3>

                            {[1, 2, 3].map(num => (
                                <div key={num} style={{ marginBottom: '20px', padding: '16px', backgroundColor: '#F9FAFB', borderRadius: '8px' }}>
                                    <h4 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '12px', color: '#1F2937' }}>Signature {num}</h4>
                                    <div style={{ display: 'grid', gap: '12px' }}>
                                        <div>
                                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, marginBottom: '4px', color: '#6B7280' }}>Upload Signature</label>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => handleFileUpload(`signature${num}`, e)}
                                                style={{ display: 'none' }}
                                                id={`sig${num}-upload`}
                                            />
                                            <label
                                                htmlFor={`sig${num}-upload`}
                                                style={{
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: '8px',
                                                    padding: '8px 16px',
                                                    backgroundColor: '#F3F4F6',
                                                    color: '#374151',
                                                    borderRadius: '6px',
                                                    cursor: 'pointer',
                                                    fontSize: '0.875rem',
                                                    fontWeight: 600
                                                }}
                                            >
                                                <Upload size={16} />
                                                Choose File
                                            </label>
                                        </div>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                            <div>
                                                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, marginBottom: '4px', color: '#6B7280' }}>Name</label>
                                                <input
                                                    type="text"
                                                    value={settings[`signature${num}Name`]}
                                                    onChange={(e) => setSettings({ ...settings, [`signature${num}Name`]: e.target.value })}
                                                    style={{ width: '100%', padding: '8px', border: '1px solid #E5E7EB', borderRadius: '6px', fontSize: '0.875rem' }}
                                                />
                                            </div>
                                            <div>
                                                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, marginBottom: '4px', color: '#6B7280' }}>Title</label>
                                                <input
                                                    type="text"
                                                    value={settings[`signature${num}Title`]}
                                                    onChange={(e) => setSettings({ ...settings, [`signature${num}Title`]: e.target.value })}
                                                    style={{ width: '100%', padding: '8px', border: '1px solid #E5E7EB', borderRadius: '6px', fontSize: '0.875rem' }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Serial Number Settings */}
                        <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Hash size={20} color="#F97316" />
                                Serial Number Settings
                            </h3>
                            <div style={{ display: 'grid', gap: '16px' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth > 640 ? '1fr 1fr' : '1fr', gap: '12px' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '6px', color: '#374151' }}>Prefix</label>
                                        <input
                                            type="text"
                                            value={settings.serialNumberPrefix}
                                            onChange={(e) => setSettings({ ...settings, serialNumberPrefix: e.target.value })}
                                            placeholder="GG"
                                            style={{ width: '100%', padding: '10px', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '0.875rem' }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '6px', color: '#374151' }}>Format</label>
                                        <select
                                            value={settings.serialNumberFormat}
                                            onChange={(e) => setSettings({ ...settings, serialNumberFormat: e.target.value })}
                                            style={{ width: '100%', padding: '10px', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '0.875rem' }}
                                        >
                                            <option value="auto">Auto Generate</option>
                                            <option value="manual">Manual Entry</option>
                                        </select>
                                    </div>
                                </div>
                                {settings.serialNumberFormat === 'auto' && (
                                    <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth > 640 ? '1fr 1fr' : '1fr', gap: '12px' }}>
                                        <div>
                                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '6px', color: '#374151' }}>Start Number</label>
                                            <input
                                                type="number"
                                                value={settings.serialNumberStart}
                                                onChange={(e) => setSettings({ ...settings, serialNumberStart: parseInt(e.target.value) })}
                                                style={{ width: '100%', padding: '10px', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '0.875rem' }}
                                            />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '6px', color: '#374151' }}>Padding (Digits)</label>
                                            <input
                                                type="number"
                                                value={settings.serialNumberPadding}
                                                onChange={(e) => setSettings({ ...settings, serialNumberPadding: parseInt(e.target.value) })}
                                                min="1"
                                                max="10"
                                                style={{ width: '100%', padding: '10px', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '0.875rem' }}
                                            />
                                        </div>
                                    </div>
                                )}
                                <div style={{ padding: '12px', backgroundColor: '#EEF2FF', borderRadius: '8px', fontSize: '0.875rem', color: '#4F46E5' }}>
                                    <strong>Preview:</strong> {settings.serialNumberPrefix}{String(settings.serialNumberStart).padStart(settings.serialNumberPadding, '0')}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Preview Panel */}
                    <div style={{ position: window.innerWidth > 1024 ? 'sticky' : 'relative', top: '24px', height: 'fit-content' }}>
                        <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Eye size={20} color="#F97316" />
                                Preview
                            </h3>
                            <div style={{ marginBottom: '16px', padding: '12px', backgroundColor: '#F9FAFB', borderRadius: '8px', fontSize: '0.875rem' }}>
                                <div style={{ marginBottom: '8px' }}>
                                    <strong>User:</strong> {previewData.userName}
                                </div>
                                <div style={{ marginBottom: '8px' }}>
                                    <strong>User ID:</strong> {previewData.userId}
                                </div>
                                <div style={{ marginBottom: '8px' }}>
                                    <strong>Course:</strong> {previewData.courseName}
                                </div>
                                <div style={{ marginBottom: '8px' }}>
                                    <strong>Date:</strong> {previewData.completionDate}
                                </div>
                                <div>
                                    <strong>Serial:</strong> {previewData.serialNumber}
                                </div>
                            </div>
                            <button
                                onClick={generatePreview}
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    backgroundColor: '#3B82F6',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '8px',
                                    marginBottom: '12px'
                                }}
                            >
                                <Eye size={18} />
                                Generate Preview
                            </button>
                            <button
                                onClick={handleSave}
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    backgroundColor: '#10B981',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '8px'
                                }}
                            >
                                <Save size={18} />
                                Save Settings
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminCertificateSettings;
