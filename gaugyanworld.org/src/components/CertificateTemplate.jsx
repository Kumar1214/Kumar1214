import React from 'react';

const CertificateTemplate = ({ data, settings }) => {
    // Default data if not provided
    const {
        name = "Student Name",
        mobile = "XXXXXXXXXX",
        category = "General Knowledge",
        dateRange = "9th TO 15th September, 2024",
        serialNumber = "GG1001"
    } = data || {};

    const {
        watermarkEnabled = true,
        watermarkOpacity = 0.1,
        backgroundImage,
        titleFont = 'Georgia',
        titleFontSize = 48,
        titleColor = '#F97316',
        nameFont = 'Arial',
        nameFontSize = 36,
        nameColor = '#1F2937',
        bodyFont = 'Arial',
        bodyFontSize = 14,
        bodyColor = '#374151',
        signature1, signature1Name, signature1Title,
        signature2, signature2Name, signature2Title,
        signature3, signature3Name, signature3Title,
        organizationName = 'GauGyan'
    } = settings || {};

    const verificationUrl = `${window.location.origin}/verify-certificate/${serialNumber}`;
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(verificationUrl)}`;

    return (
        <div
            id="certificate-container"
            style={{
                width: '800px',
                height: '600px',
                padding: '20px',
                backgroundColor: '#fff',
                margin: '0 auto',
                position: 'relative',
                fontFamily: "'Noto Sans Devanagari', sans-serif",
                color: '#333',
                boxSizing: 'border-box',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}
        >
            {/* Outer Border */}
            <div style={{
                width: '100%',
                height: '100%',
                border: '15px solid #F59E0B', // Gold/Orange border
                borderStyle: 'double',
                padding: '5px',
                boxSizing: 'border-box',
                position: 'relative',
                backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'linear-gradient(45deg, #F59E0B 25%, transparent 25%, transparent 75%, #F59E0B 75%, #F59E0B), linear-gradient(45deg, #F59E0B 25%, transparent 25%, transparent 75%, #F59E0B 75%, #F59E0B)',
                backgroundSize: backgroundImage ? 'cover' : '20px 20px',
                backgroundPosition: backgroundImage ? 'center' : '0 0, 10px 10px'
            }}>
                {/* Inner Content Area */}
                <div style={{
                    width: '100%',
                    height: '100%',
                    backgroundColor: '#FFFBEB', // Light cream background
                    border: '2px solid #D97706',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: '20px 40px',
                    boxSizing: 'border-box',
                    position: 'relative'
                }}>
                    {/* Watermark Logo - Global Center */}
                    {watermarkEnabled && (
                        <div style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: '400px',
                            height: '400px',
                            backgroundImage: `url(/gaugyan-logo.png)`,
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'center',
                            backgroundSize: 'contain',
                            opacity: watermarkOpacity,
                            zIndex: 0,
                            pointerEvents: 'none'
                        }}></div>
                    )}

                    {/* Corner Decorations */}
                    <div style={{ position: 'absolute', top: '10px', left: '10px', width: '40px', height: '40px', borderTop: '4px solid #D97706', borderLeft: '4px solid #D97706' }}></div>
                    <div style={{ position: 'absolute', top: '10px', right: '10px', width: '40px', height: '40px', borderTop: '4px solid #D97706', borderRight: '4px solid #D97706' }}></div>
                    <div style={{ position: 'absolute', bottom: '10px', left: '10px', width: '40px', height: '40px', borderBottom: '4px solid #D97706', borderLeft: '4px solid #D97706' }}></div>
                    <div style={{ position: 'absolute', bottom: '10px', right: '10px', width: '40px', height: '40px', borderBottom: '4px solid #D97706', borderRight: '4px solid #D97706' }}></div>

                    {/* Top Left Logo - Aligned with QR Code */}
                    <div style={{ position: 'absolute', top: '20px', left: '20px' }}>
                        <img
                            src="/assets/logo.png"
                            alt="GauGyan Logo"
                            style={{
                                height: '80px',
                                width: 'auto',
                                objectFit: 'contain'
                            }}
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "/gaugyan-logo.png";
                            }}
                        />
                    </div>

                    {/* QR Code */}
                    <div style={{ position: 'absolute', top: '20px', right: '20px' }}>
                        <img src={qrCodeUrl} alt="QR Code" style={{ width: '80px', height: '80px', border: '1px solid #D97706', padding: '2px', background: 'white' }} />
                        <div style={{ fontSize: '0.6rem', textAlign: 'center', marginTop: '2px', fontWeight: 'bold' }}>{serialNumber}</div>
                    </div>

                    {/* Header Text (Centered) */}
                    <div style={{ textAlign: 'center', marginBottom: '20px', marginTop: '10px', zIndex: 1, width: '60%' }}>
                        <h2 style={{
                            fontSize: `${titleFontSize}px`,
                            fontFamily: titleFont,
                            color: titleColor,
                            margin: '10px 0 5px',
                            textTransform: 'uppercase',
                            letterSpacing: '2px',
                            fontWeight: 'bold'
                        }}>
                            {organizationName}
                        </h2>
                        <h3 style={{ fontSize: '1.4rem', color: '#92400E', margin: '5px 0', fontFamily: 'serif', fontStyle: 'italic' }}>Certificate of Completion</h3>
                        <p style={{ fontSize: '1rem', color: '#92400E', margin: '0' }}>
                            {dateRange}
                        </p>
                    </div>

                    {/* Body Text */}
                    <div style={{
                        textAlign: 'center',
                        fontSize: `${bodyFontSize}px`,
                        fontFamily: bodyFont,
                        lineHeight: '1.8',
                        color: bodyColor,
                        marginBottom: '30px',
                        position: 'relative',
                        zIndex: 1,
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        width: '85%'
                    }}>
                        <p>
                            This is to certify that <span style={{ fontWeight: 'bold', borderBottom: '1px dotted #000', fontFamily: nameFont, fontSize: `${nameFontSize}px`, color: nameColor, padding: '0 10px' }}>{name}</span>
                        </p>
                        <p style={{ margin: '10px 0' }}>
                            (Mobile: <span style={{ fontWeight: 'bold' }}>{mobile}</span>) has successfully participated in the
                        </p>
                        <p style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#D97706', margin: '10px 0' }}>
                            {category}
                        </p>
                        <p style={{ marginTop: '10px' }}>
                            We appreciate your enthusiasm for Sanatan Sanskriti, Gauseva, and Cow Protection. Your performance demonstrates a commendable understanding of our heritage.
                        </p>
                    </div>

                    {/* Footer / Signatures */}
                    <div style={{
                        marginTop: 'auto',
                        width: '90%',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-end',
                        paddingBottom: '10px',
                        zIndex: 1
                    }}>
                        {[
                            { img: signature1, name: signature1Name, title: signature1Title },
                            { img: signature2, name: signature2Name, title: signature2Title },
                            { img: signature3, name: signature3Name, title: signature3Title }
                        ].map((sig, idx) => (
                            <div key={`signature-${sig.name}-${idx}`} style={{ textAlign: 'center', minWidth: '150px', visibility: sig.name ? 'visible' : 'hidden' }}>
                                <div style={{ height: '60px', marginBottom: '5px', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
                                    {sig.img ?
                                        <img src={sig.img} alt="Sig" style={{ maxHeight: '60px', maxWidth: '140px' }} /> :
                                        <span style={{ fontFamily: 'cursive', fontSize: '1.5rem', color: '#555' }}>
                                            {sig.name ? sig.name.split(' ')[0] : 'Sign'}
                                        </span>
                                    }
                                </div>
                                <div style={{ borderTop: '2px solid #D97706', width: '140px', margin: '0 auto 5px' }}></div>
                                <div style={{ fontWeight: 'bold', fontSize: '1rem', color: '#1F2937' }}>{sig.name || 'Signatory'}</div>
                                <div style={{ fontSize: '0.85rem', color: '#6B7280' }}>{sig.title || 'Title'}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CertificateTemplate;
