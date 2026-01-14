
import React, { useState, useEffect } from 'react';
import { Upload, Type, Image as ImageIcon, Hash, Save, Eye, Settings as SettingsIcon } from 'lucide-react';
import { certificateService } from '../../../services/api';

const SettingsCertificates = () => {
    const [settings, setSettings] = useState({
        // Background
        backgroundImage: '', // Fetch from backend

        // Meta
        watermarkEnabled: true,
        watermarkOpacity: 0.1,

        // Fonts
        titleFont: 'Georgia',
        titleFontSize: 48,
        titleColor: '#1F5B6B',

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
        dateFormat: 'DD MMM, YYYY'
    });

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            setLoading(true);
            const response = await certificateService.getSettings();
            if (response.data.success && response.data.data) {
                // Merge with defaults
                setSettings(prev => ({ ...prev, ...response.data.data }));
            }
        } catch (error) {
            console.error("Failed to fetch settings", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            setLoading(true);
            await certificateService.saveSettings({ category: 'certificate', settings });
            alert('Certificate settings saved successfully!');
        } catch (error) {
            alert('Failed to save settings');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const [previewData] = useState({
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

    const [showPreview, setShowPreview] = useState(false);

    const generatePreview = () => {
        setShowPreview(true);
    };

    const PreviewModal = () => {
        if (!showPreview) return null;

        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
                <div className="bg-white rounded-xl w-full max-w-5xl overflow-hidden shadow-2xl relative">
                    {/* Modal Header */}
                    <div className="p-4 border-b flex justify-between items-center bg-gray-50">
                        <h3 className="text-xl font-bold text-gray-800">Certificate Preview</h3>
                        <button
                            onClick={() => setShowPreview(false)}
                            className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>

                    {/* Certificate Canvas */}
                    <div className="p-8 overflow-auto bg-gray-100 flex justify-center">
                        <div
                            style={{
                                width: '800px', // Standard Landscape
                                height: '600px',
                                position: 'relative',
                                backgroundColor: 'white',
                                backgroundImage: `url(${settings.backgroundImage})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                                fontFamily: 'Arial, sans-serif', // Fallback
                                border: '12px solid #FFB347' // Light Orange/Saffron Border
                            }}
                            className="certificate-container"
                        >
                            {/* Watermark (if enabled) */}
                            {settings.watermarkEnabled && (
                                <div
                                    className="absolute inset-0 flex items-center justify-center pointer-events-none"
                                    style={{ opacity: settings.watermarkOpacity }}
                                >
                                    <img src="/gaugyan-logo.png" alt="Watermark" className="w-64 h-64 object-contain opacity-50" />
                                </div>
                            )}

                            {/* Top Left Logo */}
                            <div className="absolute top-8 left-8">
                                <img src="/gaugyan-logo.png" alt="Logo" className="h-24 w-auto object-contain" />
                            </div>

                            {/* Top Right QR Code & Serial */}
                            <div className="absolute top-8 right-8 flex flex-col items-center">
                                <div className="bg-white p-1 border border-gray-200 mb-2">
                                    <img
                                        src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=https://gaugyanworld.org/verify/${previewData.serialNumber}`}
                                        alt="QR Code"
                                        className="h-20 w-20 object-contain"
                                    />
                                </div>
                                <div className="text-center">
                                    <p className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold">Certificate ID</p>
                                    <p className="text-sm font-mono font-bold text-gray-800 tracking-wider">
                                        {settings.serialNumberPrefix}{String(settings.serialNumberStart).padStart(settings.serialNumberPadding, '0')}
                                    </p>
                                </div>
                            </div>

                            {/* Content Layer */}
                            <div className="relative z-10 w-full h-full flex flex-col items-center justify-start p-12 text-center pt-28">

                                {/* Header / Title */}
                                <h1 style={{
                                    fontFamily: settings.titleFont,
                                    fontSize: `${settings.titleFontSize}px`,
                                    color: settings.titleColor,
                                    marginBottom: '5px'
                                }}>
                                    {settings.organizationName || 'Organization Name'}
                                </h1>

                                <h2 className="text-2xl font-serif text-gray-700 mb-4 tracking-wide">{settings.certificateTitle}</h2>
                                <div style={{
                                    fontFamily: settings.bodyFont,
                                    fontSize: `${settings.bodyFontSize}px`,
                                    color: settings.bodyColor,
                                    lineHeight: '1.6',
                                    maxWidth: '85%', // Align with signature width
                                    margin: '0 auto',
                                    marginTop: '40px' // Push down slightly from title
                                }}>
                                    This certificate is proudly presented to
                                    <div style={{
                                        fontFamily: settings.nameFont,
                                        fontSize: `${settings.nameFontSize}px`,
                                        color: settings.nameColor,
                                        fontWeight: 'bold',
                                        margin: '8px 0',
                                        borderBottom: '1px solid #FFB347',
                                        display: 'inline-block',
                                        width: '100%',
                                        maxWidth: '500px'
                                    }}>
                                        {previewData.userName}
                                    </div>
                                    <div className="mt-2">
                                        for successfully completing the educational requirements and demonstrating proficiency in the course <span className="font-bold text-gray-900">{previewData.courseName}</span> on <span className="font-bold text-gray-900">{previewData.completionDate}</span>
                                    </div>
                                </div>

                                {/* Signatures and Serial */}
                                <div className="absolute bottom-12 left-12 right-12 flex justify-between items-end">
                                    {/* Signatures */}
                                    <div className="flex gap-8 w-full justify-center px-12">
                                        {[1, 2, 3].map(num => (
                                            <div key={num} className="text-center group relative flex-1">
                                                {/* Signature Image or Placeholder */}
                                                <div className="h-14 mb-1 flex items-end justify-center">
                                                    {settings[`signature${num}`] ? (
                                                        <img
                                                            src={settings[`signature${num}`]}
                                                            alt="Signature"
                                                            className="max-h-full w-auto object-contain"
                                                        />
                                                    ) : (
                                                        <div className="h-10 w-32 bg-gray-50 border border-dashed border-gray-300 flex items-center justify-center text-[10px] text-gray-400">
                                                            Sign Here
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="border-t border-gray-400 w-full mx-auto pt-1">
                                                    <p className="text-sm font-bold text-gray-900">{settings[`signature${num}Name`] || `Signatory ${num}`}</p>
                                                    <p className="text-[11px] font-medium text-gray-600 uppercase tracking-wider">{settings[`signature${num}Title`] || 'Title'}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Serial Number (Cleaned up) */}
                                <div className="absolute bottom-0 right-0 text-right">
                                    {/* Removed as per request */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        );
    };

    return (
        <div className="bg-gray-50 min-h-screen p-4 md:p-8">
            <PreviewModal />
            {loading && <div className="fixed inset-0 bg-white/50 z-50 flex items-center justify-center">Loading...</div>}
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                        <SettingsIcon className="h-8 w-8 text-primary" />
                        Certificate Settings
                    </h1>
                    <p className="text-gray-600 w-full md:w-2/3">Configure certificate templates, branding, and generation settings for automated course completion certificates.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
                    {/* Settings Panel */}
                    <div className="space-y-6">
                        {/* Background Settings */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <h3 className="text-lg font-bold mb-5 flex items-center gap-2 text-gray-900">
                                <ImageIcon size={20} className="text-primary" />
                                Background Image
                            </h3>
                            <div className="mb-4">
                                <label className="block text-sm font-semibold mb-2 text-gray-700">
                                    Upload Background
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleFileUpload('backgroundImage', e)}
                                    className="hidden"
                                    id="bg-upload"
                                />
                                <label
                                    htmlFor="bg-upload"
                                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-lg cursor-pointer font-semibold hover:bg-primary-dark transition-colors shadow-sm"
                                >
                                    <Upload size={18} />
                                    Choose File
                                </label>
                            </div>
                            {settings.backgroundImage && (
                                <div className="mt-3">
                                    <img src={settings.backgroundImage} alt="Background" className="max-w-full rounded-lg border border-gray-200" />
                                </div>
                            )}
                        </div>

                        {/* Font Settings */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <h3 className="text-lg font-bold mb-5 flex items-center gap-2 text-gray-900">
                                <Type size={20} className="text-primary" />
                                Font Settings
                            </h3>

                            {/* Title Font */}
                            <div className="mb-5 p-4 bg-gray-50 rounded-lg border border-gray-100">
                                <h4 className="text-sm font-semibold mb-3 text-gray-800">Title Font (Organization Name)</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    <div>
                                        <label className="block text-xs font-semibold mb-1 text-gray-500">Font Family</label>
                                        <select
                                            value={settings.titleFont}
                                            onChange={(e) => setSettings({ ...settings, titleFont: e.target.value })}
                                            className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none"
                                        >
                                            <option value="Georgia">Georgia</option>
                                            <option value="Arial">Arial</option>
                                            <option value="Times New Roman">Times New Roman</option>
                                            <option value="Helvetica">Helvetica</option>
                                            <option value="Verdana">Verdana</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold mb-1 text-gray-500">Size (px)</label>
                                        <input
                                            type="number"
                                            value={settings.titleFontSize}
                                            onChange={(e) => setSettings({ ...settings, titleFontSize: parseInt(e.target.value) })}
                                            className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold mb-1 text-gray-500">Color</label>
                                        <input
                                            type="color"
                                            value={settings.titleColor}
                                            onChange={(e) => setSettings({ ...settings, titleColor: e.target.value })}
                                            className="w-full h-[38px] border border-gray-300 rounded-lg cursor-pointer p-0.5"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Name Font */}
                            <div className="mb-5 p-4 bg-gray-50 rounded-lg border border-gray-100">
                                <h4 className="text-sm font-semibold mb-3 text-gray-800">Name Font (User Name)</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    <div>
                                        <label className="block text-xs font-semibold mb-1 text-gray-500">Font Family</label>
                                        <select
                                            value={settings.nameFont}
                                            onChange={(e) => setSettings({ ...settings, nameFont: e.target.value })}
                                            className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none"
                                        >
                                            <option value="Georgia">Georgia</option>
                                            <option value="Arial">Arial</option>
                                            <option value="Times New Roman">Times New Roman</option>
                                            <option value="Helvetica">Helvetica</option>
                                            <option value="Verdana">Verdana</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold mb-1 text-gray-500">Size (px)</label>
                                        <input
                                            type="number"
                                            value={settings.nameFontSize}
                                            onChange={(e) => setSettings({ ...settings, nameFontSize: parseInt(e.target.value) })}
                                            className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold mb-1 text-gray-500">Color</label>
                                        <input
                                            type="color"
                                            value={settings.nameColor}
                                            onChange={(e) => setSettings({ ...settings, nameColor: e.target.value })}
                                            className="w-full h-[38px] border border-gray-300 rounded-lg cursor-pointer p-0.5"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Body Font */}
                            <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                                <h4 className="text-sm font-semibold mb-3 text-gray-800">Body Font (Description Text)</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    <div>
                                        <label className="block text-xs font-semibold mb-1 text-gray-500">Font Family</label>
                                        <select
                                            value={settings.bodyFont}
                                            onChange={(e) => setSettings({ ...settings, bodyFont: e.target.value })}
                                            className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none"
                                        >
                                            <option value="Georgia">Georgia</option>
                                            <option value="Arial">Arial</option>
                                            <option value="Times New Roman">Times New Roman</option>
                                            <option value="Helvetica">Helvetica</option>
                                            <option value="Verdana">Verdana</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold mb-1 text-gray-500">Size (px)</label>
                                        <input
                                            type="number"
                                            value={settings.bodyFontSize}
                                            onChange={(e) => setSettings({ ...settings, bodyFontSize: parseInt(e.target.value) })}
                                            className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold mb-1 text-gray-500">Color</label>
                                        <input
                                            type="color"
                                            value={settings.bodyColor}
                                            onChange={(e) => setSettings({ ...settings, bodyColor: e.target.value })}
                                            className="w-full h-[38px] border border-gray-300 rounded-lg cursor-pointer p-0.5"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Signature Settings */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <h3 className="text-lg font-bold mb-5 flex items-center gap-2 text-gray-900">
                                <Upload size={20} className="text-primary" />
                                Signature Settings
                            </h3>

                            {[1, 2, 3].map(num => (
                                <div key={num} className="mb-5 p-4 bg-gray-50 rounded-lg border border-gray-100 last:mb-0">
                                    <h4 className="text-sm font-semibold mb-3 text-gray-800">Signature {num}</h4>
                                    <div className="space-y-3">
                                        <div>
                                            <label className="block text-xs font-semibold mb-1 text-gray-500">Upload Signature</label>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => handleFileUpload(`signature${num}`, e)}
                                                className="hidden"
                                                id={`sig${num}-upload`}
                                            />
                                            <label
                                                htmlFor={`sig${num}-upload`}
                                                className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg cursor-pointer text-sm font-semibold hover:bg-gray-50 transition-colors"
                                            >
                                                <Upload size={16} />
                                                Choose File
                                            </label>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-xs font-semibold mb-1 text-gray-500">Name</label>
                                                <input
                                                    type="text"
                                                    value={settings[`signature${num}Name`]}
                                                    onChange={(e) => setSettings({ ...settings, [`signature${num}Name`]: e.target.value })}
                                                    className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-semibold mb-1 text-gray-500">Title</label>
                                                <input
                                                    type="text"
                                                    value={settings[`signature${num}Title`]}
                                                    onChange={(e) => setSettings({ ...settings, [`signature${num}Title`]: e.target.value })}
                                                    className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Serial Number Settings */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <h3 className="text-lg font-bold mb-5 flex items-center gap-2 text-gray-900">
                                <Hash size={20} className="text-primary" />
                                Serial Number Settings
                            </h3>
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-sm font-semibold mb-1.5 text-gray-700">Prefix</label>
                                        <input
                                            type="text"
                                            value={settings.serialNumberPrefix}
                                            onChange={(e) => setSettings({ ...settings, serialNumberPrefix: e.target.value })}
                                            placeholder="GG"
                                            className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold mb-1.5 text-gray-700">Format</label>
                                        <select
                                            value={settings.serialNumberFormat}
                                            onChange={(e) => setSettings({ ...settings, serialNumberFormat: e.target.value })}
                                            className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none bg-white"
                                        >
                                            <option value="auto">Auto Generate</option>
                                            <option value="manual">Manual Entry</option>
                                        </select>
                                    </div>
                                </div>
                                {settings.serialNumberFormat === 'auto' && (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-sm font-semibold mb-1.5 text-gray-700">Start Number</label>
                                            <input
                                                type="number"
                                                value={settings.serialNumberStart}
                                                onChange={(e) => setSettings({ ...settings, serialNumberStart: parseInt(e.target.value) })}
                                                className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold mb-1.5 text-gray-700">Padding (Digits)</label>
                                            <input
                                                type="number"
                                                value={settings.serialNumberPadding}
                                                onChange={(e) => setSettings({ ...settings, serialNumberPadding: parseInt(e.target.value) })}
                                                min="1"
                                                max="10"
                                                className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none"
                                            />
                                        </div>
                                    </div>
                                )}
                                <div className="p-3 bg-indigo-50 rounded-lg text-sm text-indigo-700">
                                    <strong>Preview:</strong> {settings.serialNumberPrefix}{String(settings.serialNumberStart).padStart(settings.serialNumberPadding, '0')}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Preview Panel */}
                    <div className="lg:sticky lg:top-6 h-fit">
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <h3 className="text-lg font-bold mb-5 flex items-center gap-2 text-gray-900">
                                <Eye size={20} className="text-primary" />
                                Preview
                            </h3>
                            <div className="mb-4 p-3 bg-gray-50 rounded-lg text-sm border border-gray-100">
                                <div className="mb-2">
                                    <strong>User:</strong> {previewData.userName}
                                </div>
                                <div className="mb-2">
                                    <strong>User ID:</strong> {previewData.userId}
                                </div>
                                <div className="mb-2">
                                    <strong>Course:</strong> {previewData.courseName}
                                </div>
                                <div className="mb-2">
                                    <strong>Date:</strong> {previewData.completionDate}
                                </div>
                                <div>
                                    <strong>Serial:</strong> {previewData.serialNumber}
                                </div>
                            </div>
                            <button
                                onClick={generatePreview}
                                className="w-full py-3 mb-3 bg-blue-500 text-white rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-blue-600 transition-colors shadow-sm"
                            >
                                <Eye size={18} />
                                Generate Preview
                            </button>
                            <button
                                onClick={handleSave}
                                className="w-full py-3 bg-green-500 text-white rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-green-600 transition-colors shadow-sm"
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

export default SettingsCertificates;
