import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Download, Eye, Award, Calendar, FileText, CheckCircle } from 'lucide-react';
import UserDashboardLayout from '../layout/UserDashboardLayout';
import { certificateService } from '../services/api';

const UserCertificates = () => {
    const { user } = useAuth();
    const [activeFilter, setActiveFilter] = useState('all');
    const [settings, setSettings] = useState(null);

    React.useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response = await certificateService.getSettings();
                if (response.data.success) {
                    setSettings(response.data.data);
                }
            } catch (error) {
                console.error("Failed to fetch certificate settings", error);
            }
        };
        fetchSettings();
    }, []);

    // Mock certificates data - in production from backend/DataContext
    const certificates = [
        {
            id: 1,
            type: 'course',
            name: 'Ayurveda Basics',
            completionDate: '2024-09-27',
            serialNumber: 'GG1001',
            score: 85,
            status: 'available'
        },
        {
            id: 2,
            type: 'quiz',
            name: 'Weekly Quiz - Vedic Culture',
            completionDate: '2024-09-28',
            serialNumber: 'GG1002',
            score: 92,
            status: 'available'
        },
        {
            id: 3,
            type: 'exam',
            name: 'Yoga Certification Exam',
            completionDate: '2024-10-05',
            serialNumber: 'GG1003',
            score: 88,
            status: 'available'
        },
        {
            id: 4,
            type: 'course',
            name: 'Vedic Mathematics',
            completionDate: '2024-10-12',
            serialNumber: 'GG1004',
            score: 90,
            status: 'available'
        },
        {
            id: 5,
            type: 'course',
            name: 'Sanskrit Level 1',
            completionDate: '2024-11-15',
            serialNumber: 'GG1005',
            score: 95,
            status: 'available'
        },
        {
            id: 6,
            type: 'quiz',
            name: 'Gau Seva Awareness Quiz',
            completionDate: '2024-11-20',
            serialNumber: 'GG1006',
            score: 100,
            status: 'available'
        }
    ];

    const filteredCertificates = certificates.filter(cert =>
        activeFilter === 'all' || cert.type === activeFilter.slice(0, -1)
    );

    const generateCertificateHTML = (certificate) => {
        return `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Certificate - ${certificate.name}</title>
                <style>
                    body { margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; min-height: 100vh; background-color: #f0f0f0; }
                    @media print {
                        body { background-color: white; }
                        #certificate-container { box-shadow: none !important; margin: 0 !important; }
                        @page { size: landscape; margin: 0; }
                    }
                </style>
            </head>
            <body>
                <div id="root"></div>
                <script>
                    document.body.innerHTML = \`
                        <div style="width: 1000px; height: 750px; padding: 20px; background-color: #fff; position: relative; font-family: '${settings?.bodyFont || 'Arial'}', sans-serif; color: ${settings?.bodyColor || '#333'}; box-sizing: border-box; display: flex; justify-content: center; align-items: center;">
                            <div style="width: 100%; height: 100%; border: 20px solid #F59E0B; border-style: double; padding: 5px; box-sizing: border-box; position: relative; background-image: \${'${settings?.backgroundImage || ''}' ? 'url(${settings?.backgroundImage})' : 'linear-gradient(45deg, #F59E0B 25%, transparent 25%, transparent 75%, #F59E0B 75%, #F59E0B), linear-gradient(45deg, #F59E0B 25%, transparent 25%, transparent 75%, #F59E0B 75%, #F59E0B)'}; background-size: \${'${settings?.backgroundImage || ''}' ? 'cover' : '20px 20px'}; background-position: center;">
                                <div style="width: 100%; height: 100%; background-color: #FFFBEB; border: 2px solid #D97706; display: flex; flex-direction: column; align-items: center; padding: 40px 60px; box-sizing: border-box; position: relative;">
                                    
                                    <!-- Corner Decorations -->
                                    <div style="position: absolute; top: 15px; left: 15px; width: 50px; height: 50px; border-top: 5px solid #D97706; border-left: 5px solid #D97706;"></div>
                                    <div style="position: absolute; top: 15px; right: 15px; width: 50px; height: 50px; border-top: 5px solid #D97706; border-right: 5px solid #D97706;"></div>
                                    <div style="position: absolute; bottom: 15px; left: 15px; width: 50px; height: 50px; border-bottom: 5px solid #D97706; border-left: 5px solid #D97706;"></div>
                                    <div style="position: absolute; bottom: 15px; right: 15px; width: 50px; height: 50px; border-bottom: 5px solid #D97706; border-right: 5px solid #D97706;"></div>

                                    <!-- Top Left Logo -->
                                    <div style="position: absolute; top: 25px; left: 25px;">
                                        <img src="/assets/logo.png" style="height: 100px; width: auto; object-fit: contain;" onerror="this.onerror=null; this.src='/gaugyan-logo.png';" />
                                    </div>

                                    <!-- QR Code -->
                                    <div style="position: absolute; top: 25px; right: 25px;">
                                        <img src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(`${window.location.origin}/verify-certificate/${certificate.serialNumber}`)}" alt="QR Code" style="width: 100px; height: 100px; border: 1px solid #D97706; padding: 3px; background: white;" />
                                        <div style="font-size: 0.7rem; text-align: center; margin-top: 3px; font-weight: bold;">${certificate.serialNumber}</div>
                                    </div>

                                    <!-- Header -->
                                    <div style="text-align: center; margin-bottom: 20px; width: 70%; z-index: 1;">
                                        <h1 style="font-size: ${settings?.titleFontSize || 56}px; font-family: ${settings?.titleFont || 'Georgia'}; font-weight: bold; color: ${settings?.titleColor || '#EA580C'}; margin: 10px 0 5px; text-transform: uppercase;">${settings?.organizationName || 'GAUGYAN'}</h1>
                                        <h2 style="font-size: 1.8rem; color: #B45309; margin: 5px 0; font-family: serif; font-style: italic;">${settings?.certificateTitle || 'Certificate of Completion'}</h2>
                                        <p style="font-size: 1.1rem; color: #92400E; margin: 0;">Awarded on ${new Date(certificate.completionDate).toLocaleDateString()}</p>
                                    </div>

                                    <!-- Body -->
                                    <div style="text-align: center; font-size: ${settings?.bodyFontSize || 18}px; line-height: 1.8; color: ${settings?.bodyColor || '#1F2937'}; margin-bottom: 30px; position: relative; z-index: 1; flex: 1; display: flex; flex-direction: column; justify-content: center; width: 85%;">
                                        <!-- Watermark (Global Center) -->
                                        ${settings?.watermarkEnabled !== false ? `
                                        <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 450px; height: 450px; background-image: url('/gaugyan-logo.png'); background-repeat: no-repeat; background-position: center; background-size: contain; opacity: ${settings?.watermarkOpacity || 0.1}; z-index: -1; pointer-events: none;"></div>
                                        ` : ''}

                                        <p>This is to certify that <span style="font-weight: bold; border-bottom: 1px dotted #000; font-family: ${settings?.nameFont || 'Arial'}; font-size: ${settings?.nameFontSize || 40}px; color: ${settings?.nameColor || '#1F2937'}; padding: 0 10px;">${user?.displayName || 'Student Name'}</span></p>
                                        <p style="margin: 15px 0;">has successfully participated in the</p>
                                        <p style="font-size: 2.2rem; font-weight: bold; color: #D97706; margin: 10px 0;">${certificate.name}</p>
                                        <p style="margin-top: 15px;">We appreciate your enthusiasm for Sanatan Sanskriti, Gauseva, and Cow Protection. Your performance demonstrates a commendable understanding of our heritage.</p>
                                        <p style="font-size: 0.9rem; color: #666; margin-top: 5px;">(Score: <strong>${certificate.score}%</strong>)</p>
                                    </div>

                                    <!-- Signatures -->
                                    <div style="margin-top: auto; width: 90%; display: flex; justify-content: space-between; align-items: flex-end; padding-bottom: 10px; z-index: 1;">
                                        ${[1, 2, 3].map(i => settings && settings[`signature${i}Name`] ? `
                                            <div style="text-align: center; min-width: 180px;">
                                                <div style="height: 70px; margin-bottom: 5px; display: flex; align-items: flex-end; justify-content: center;">
                                                    ${settings[`signature${i}`] ? `<img src="${settings[`signature${i}`]}" style="max-height: 70px; max-width: 160px;" />` : `<span style="font-family: cursive; font-size: 1.8rem; color: #555;">${settings[`signature${i}Name`].split(' ')[0]}</span>`}
                                                </div>
                                                <div style="border-top: 2px solid #D97706; width: 160px; margin: 0 auto 5px;"></div>
                                                <div style="font-weight: bold; font-size: 1.1rem; color: #1F2937;">${settings[`signature${i}Name`]}</div>
                                                <div style="font-size: 0.95rem; color: #6B7280;">${settings[`signature${i}Title`]}</div>
                                            </div>
                                        ` : '').join('')}
                                    </div>
                                    
                                    <div style="margin-top: 15px; font-size: 0.8rem; color: #9CA3AF; text-align: center; width: 100%;">
                                        Certificate ID: ${certificate.serialNumber} • Validate at ${window.location.origin}/verify-certificate/${certificate.serialNumber}
                                    </div>
                                </div>
                            </div>
                        </div>
                    \`;
                </script>
            </body>
            </html>
        `;
    };

    const handleView = (certificate) => {
        const printWindow = window.open('', '_blank');
        printWindow.document.write(generateCertificateHTML(certificate));
        printWindow.document.close();
    };

    const handleDownload = (certificate) => {
        const printWindow = window.open('', '_blank');
        printWindow.document.write(generateCertificateHTML(certificate));
        printWindow.document.close();
        // The script inside generateCertificateHTML calls window.print() automatically if we add it,
        // but for 'View' we might just want to show it.
        // Let's modify the HTML for download to include auto-print.
        printWindow.onload = () => {
            setTimeout(() => printWindow.print(), 500);
        };
    };

    const getTypeColor = (type) => {
        switch (type) {
            case 'course': return { bg: '#DBEAFE', text: '#1E40AF' };
            case 'exam': return { bg: '#FEE2E2', text: '#991B1B' };
            case 'quiz': return { bg: '#D1FAE5', text: '#065F46' };
            default: return { bg: '#F3F4F6', text: '#374151' };
        }
    };

    return (
        <UserDashboardLayout title="My Certificates" subtitle="View and download your earned credentials">
            <div style={{
                display: 'flex',
                gap: '8px',
                flexWrap: 'wrap',
                marginBottom: '24px'
            }}>
                {['all', 'courses', 'exams', 'quizzes'].map(filter => (
                    <button
                        key={filter}
                        onClick={() => setActiveFilter(filter)}
                        style={{
                            padding: '8px 16px',
                            backgroundColor: activeFilter === filter ? '#EA580C' : 'white',
                            color: activeFilter === filter ? 'white' : '#4B5563',
                            border: activeFilter === filter ? 'none' : '1px solid #E5E7EB',
                            borderRadius: '20px',
                            fontWeight: 600,
                            fontSize: '0.875rem',
                            cursor: 'pointer',
                            textTransform: 'capitalize',
                            transition: 'all 0.2s'
                        }}
                    >
                        {filter}
                    </button>
                ))}
            </div>

            {filteredCertificates.length > 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
                    {filteredCertificates.map(certificate => {
                        const typeColor = getTypeColor(certificate.type);
                        return (
                            <div key={certificate.id} style={{
                                backgroundColor: 'white',
                                borderRadius: '16px',
                                border: '1px solid #E5E7EB',
                                padding: '24px',
                                display: 'flex',
                                flexDirection: 'column',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                                transition: 'transform 0.2s',
                            }}
                                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
                                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                                    <div style={{
                                        padding: '4px 12px',
                                        backgroundColor: typeColor.bg,
                                        color: typeColor.text,
                                        borderRadius: '20px',
                                        fontSize: '0.75rem',
                                        fontWeight: 700,
                                        textTransform: 'uppercase'
                                    }}>
                                        {certificate.type}
                                    </div>
                                    <Award size={24} color="#F59E0B" />
                                </div>

                                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1F2937', marginBottom: '8px', minHeight: '3rem' }}>
                                    {certificate.name}
                                </h3>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.9rem', color: '#6B7280', marginBottom: '24px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <Calendar size={16} />
                                        <span>Issued: {new Date(certificate.completionDate).toLocaleDateString()}</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <FileText size={16} />
                                        <span>ID: {certificate.serialNumber}</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <CheckCircle size={16} color="#10B981" />
                                        <span>Score: {certificate.score}%</span>
                                    </div>
                                </div>

                                <div style={{ marginTop: 'auto', display: 'flex', gap: '12px' }}>
                                    <button
                                        onClick={() => handleView(certificate)}
                                        style={{
                                            flex: 1,
                                            padding: '10px',
                                            backgroundColor: '#F3F4F6',
                                            color: '#374151',
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
                                        <Eye size={18} /> View
                                    </button>
                                    <button
                                        onClick={() => handleDownload(certificate)}
                                        style={{
                                            flex: 1,
                                            padding: '10px',
                                            backgroundColor: '#EA580C',
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
                                        <Download size={18} /> Download
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: 'white', borderRadius: '16px', border: '1px dashed #D1D5DB' }}>
                    <Award size={48} color="#D1D5DB" style={{ marginBottom: '16px' }} />
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>No certificates found</h3>
                    <p style={{ color: '#6B7280' }}>Try changing the filter or complete more courses/exams.</p>
                </div>
            )}
        </UserDashboardLayout>
    );
};

export default UserCertificates;
