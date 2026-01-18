import React from 'react';
import { useData } from '../context/useData';
import { Trophy, CheckCircle, XCircle, Calendar, Download } from 'lucide-react';
import UserDashboardLayout from '../layout/UserDashboardLayout';

const MyResults = () => {
    const { results } = useData();

    const [activeTab, setActiveTab] = React.useState('results');

    // Mock Leaderboard Data
    const leaderboardData = [
        { rank: 1, name: "Amit Patel", points: 1250, badge: "Gold" },
        { rank: 2, name: "Priya Sharma", points: 1100, badge: "Silver" },
        { rank: 3, name: "Rahul Singh", points: 950, badge: "Bronze" },
        { rank: 4, name: "Neha Gupta", points: 880, badge: null },
        { rank: 5, name: "Vikram Malhotra", points: 820, badge: null },
    ];

    const handleDownloadCertificate = (result) => {
        const printWindow = window.open('', '_blank');

        // Similar to UserCertificates.jsx logic but using 'result' object
        // Note: result object structure might differ slightly from certificate object in UserCertificates
        // We map result to certificate-like structure
        const certificate = {
            name: result.title,
            serialNumber: `RES-${result.id}`, // Mock serial
            completionDate: result.date,
            score: result.score,
            type: result.type
        };

        // Note: We don't have 'settings' state here, so we use defaults. 
        // In a real app, we should fetch settings here too or use a context.
        // For consistency, I'll use the hardcoded defaults that match the new design.

        const htmlContent = `
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
                        <div style="width: 1000px; height: 750px; padding: 20px; background-color: #fff; position: relative; font-family: 'Arial', sans-serif; color: #333; box-sizing: border-box; display: flex; justify-content: center; align-items: center;">
                            <div style="width: 100%; height: 100%; border: 20px solid #F59E0B; border-style: double; padding: 5px; box-sizing: border-box; position: relative; background-image: linear-gradient(45deg, #F59E0B 25%, transparent 25%, transparent 75%, #F59E0B 75%, #F59E0B), linear-gradient(45deg, #F59E0B 25%, transparent 25%, transparent 75%, #F59E0B 75%, #F59E0B); background-size: 20px 20px; background-position: center;">
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
                                        <h1 style="font-size: 56px; font-family: 'Georgia'; font-weight: bold; color: #EA580C; margin: 10px 0 5px; text-transform: uppercase;">GAUGYAN</h1>
                                        <h2 style="font-size: 1.8rem; color: #B45309; margin: 5px 0; font-family: serif; font-style: italic;">Certificate of Completion</h2>
                                        <p style="font-size: 1.1rem; color: #92400E; margin: 0;">Awarded on ${new Date(certificate.completionDate).toLocaleDateString()}</p>
                                    </div>

                                    <!-- Body -->
                                    <div style="text-align: center; font-size: 18px; line-height: 1.8; color: #1F2937; margin-bottom: 30px; position: relative; z-index: 1; flex: 1; display: flex; flex-direction: column; justify-content: center; width: 85%;">
                                        <!-- Watermark (Global Center) -->
                                        <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 450px; height: 450px; background-image: url('/gaugyan-logo.png'); background-repeat: no-repeat; background-position: center; background-size: contain; opacity: 0.1; z-index: -1; pointer-events: none;"></div>

                                        <p>This is to certify that <span style="font-weight: bold; border-bottom: 1px dotted #000; font-family: 'Arial'; font-size: 40px; color: #1F2937; padding: 0 10px;">User Name</span></p>
                                        <p style="margin: 15px 0;">has successfully participated in the</p>
                                        <p style="font-size: 2.2rem; font-weight: bold; color: #D97706; margin: 10px 0;">${certificate.name}</p>
                                        <p style="margin-top: 15px;">We appreciate your enthusiasm for Sanatan Sanskriti, Gauseva, and Cow Protection. Your performance demonstrates a commendable understanding of our heritage.</p>
                                        <p style="font-size: 0.9rem; color: #666; margin-top: 5px;">(Score: <strong>${certificate.score}%</strong>)</p>
                                    </div>

                                    <!-- Signatures -->
                                    <div style="margin-top: auto; width: 90%; display: flex; justify-content: space-between; align-items: flex-end; padding-bottom: 10px; z-index: 1;">
                                        <div style="text-align: center; min-width: 180px;">
                                            <div style="height: 70px; margin-bottom: 5px; display: flex; align-items: flex-end; justify-content: center;">
                                                <span style="font-family: cursive; font-size: 1.8rem; color: #555;">Name</span>
                                            </div>
                                            <div style="border-top: 2px solid #D97706; width: 160px; margin: 0 auto 5px;"></div>
                                            <div style="font-weight: bold; font-size: 1.1rem; color: #1F2937;">Name & Position</div>
                                            <div style="font-size: 0.95rem; color: #6B7280;">Organizer</div>
                                        </div>
                                        <div style="text-align: center; min-width: 180px;">
                                            <div style="height: 70px; margin-bottom: 5px; display: flex; align-items: flex-end; justify-content: center;">
                                                <span style="font-family: cursive; font-size: 1.8rem; color: #555;">Ashok</span>
                                            </div>
                                            <div style="border-top: 2px solid #D97706; width: 160px; margin: 0 auto 5px;"></div>
                                            <div style="font-weight: bold; font-size: 1.1rem; color: #1F2937;">Ashok Kumar Sharma</div>
                                            <div style="font-size: 0.95rem; color: #6B7280;">Exam Controller</div>
                                        </div>
                                        <div style="text-align: center; min-width: 180px;">
                                            <div style="height: 70px; margin-bottom: 5px; display: flex; align-items: flex-end; justify-content: center;">
                                                <span style="font-family: cursive; font-size: 1.8rem; color: #555;">Om</span>
                                            </div>
                                            <div style="border-top: 2px solid #D97706; width: 160px; margin: 0 auto 5px;"></div>
                                            <div style="font-weight: bold; font-size: 1.1rem; color: #1F2937;">Om Saraswat</div>
                                            <div style="font-size: 0.95rem; color: #6B7280;">Secretary</div>
                                        </div>
                                    </div>
                                    
                                    <div style="margin-top: 15px; font-size: 0.8rem; color: #9CA3AF; text-align: center; width: 100%;">
                                        Certificate ID: ${certificate.serialNumber} • Validate at ${window.location.origin}/verify-certificate/${certificate.serialNumber}
                                    </div>
                                </div>
                            </div>
                        </div>
                    \`;
                    
                    setTimeout(() => {
                        window.print();
                    }, 500);
                </script>
            </body>
            </html>
        `;

        printWindow.document.write(htmlContent);
        printWindow.document.close();
    };

    return (
        <UserDashboardLayout title="Performance & Results" subtitle="Track your progress and rankings">
            <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', borderBottom: '1px solid #E5E7EB' }}>
                <button
                    onClick={() => setActiveTab('results')}
                    style={{
                        padding: '12px 24px',
                        backgroundColor: 'transparent',
                        color: activeTab === 'results' ? '#EA580C' : '#6B7280',
                        borderBottom: activeTab === 'results' ? '2px solid #EA580C' : 'none',
                        fontWeight: 600,
                        cursor: 'pointer',
                        fontSize: '1rem'
                    }}
                >
                    My Results
                </button>
                <button
                    onClick={() => setActiveTab('leaderboard')}
                    style={{
                        padding: '12px 24px',
                        backgroundColor: 'transparent',
                        color: activeTab === 'leaderboard' ? '#EA580C' : '#6B7280',
                        borderBottom: activeTab === 'leaderboard' ? '2px solid #EA580C' : 'none',
                        fontWeight: 600,
                        cursor: 'pointer',
                        fontSize: '1rem'
                    }}
                >
                    Leaderboard
                </button>
            </div>

            {activeTab === 'results' ? (
                results && results.length > 0 ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
                        {results.map(result => (
                            <div key={result.id} style={{
                                backgroundColor: 'white',
                                borderRadius: '16px',
                                border: '1px solid #E5E7EB',
                                padding: '24px',
                                display: 'flex',
                                flexDirection: 'column',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                                transition: 'transform 0.2s, box-shadow 0.2s',
                            }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.transform = 'translateY(-4px)';
                                    e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                                    <div style={{
                                        width: '48px',
                                        height: '48px',
                                        borderRadius: '12px',
                                        backgroundColor: result.passed ? '#DEF7EC' : '#FDE8E8',
                                        color: result.passed ? '#059669' : '#E02424',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}>
                                        {result.passed ? <CheckCircle size={24} /> : <XCircle size={24} />}
                                    </div>
                                    <span style={{
                                        padding: '4px 12px',
                                        borderRadius: '20px',
                                        backgroundColor: '#F3F4F6',
                                        color: '#374151',
                                        fontSize: '0.8rem',
                                        fontWeight: 600,
                                        textTransform: 'uppercase'
                                    }}>
                                        {result.type}
                                    </span>
                                </div>

                                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1F2937', marginBottom: '8px', lineHeight: 1.4 }}>
                                    {result.title}
                                </h3>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6B7280', fontSize: '0.9rem', marginBottom: '20px' }}>
                                    <Calendar size={16} />
                                    <span>{new Date(result.date).toLocaleDateString()}</span>
                                </div>

                                <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid #F3F4F6' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                        <span style={{ color: '#6B7280', fontWeight: 500 }}>Score</span>
                                        <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1F2937' }}>
                                            {result.score} <span style={{ fontSize: '0.9rem', color: '#9CA3AF', fontWeight: 500 }}>/ {result.total}</span>
                                        </span>
                                    </div>

                                    {result.passed && (
                                        <button
                                            onClick={() => handleDownloadCertificate(result)}
                                            style={{
                                                width: '100%',
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
                                                gap: '8px',
                                                transition: 'background-color 0.2s'
                                            }}
                                            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#C2410C'}
                                            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#EA580C'}
                                        >
                                            <Download size={18} />
                                            Download Certificate
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: 'white', borderRadius: '16px', border: '1px dashed #D1D5DB' }}>
                        <Trophy size={48} color="#D1D5DB" style={{ marginBottom: '16px' }} />
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>No results found</h3>
                        <p style={{ color: '#6B7280' }}>Participate in quizzes and exams to see your results here.</p>
                    </div>
                )
            ) : (
                <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1F2937', marginBottom: '20px' }}>Global Leaderboard</h3>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '2px solid #E5E7EB' }}>
                                    <th style={{ padding: '12px', textAlign: 'left', color: '#6B7280', fontWeight: 600 }}>Rank</th>
                                    <th style={{ padding: '12px', textAlign: 'left', color: '#6B7280', fontWeight: 600 }}>Student Name</th>
                                    <th style={{ padding: '12px', textAlign: 'right', color: '#6B7280', fontWeight: 600 }}>Total Points</th>
                                    <th style={{ padding: '12px', textAlign: 'center', color: '#6B7280', fontWeight: 600 }}>Badge</th>
                                </tr>
                            </thead>
                            <tbody>
                                {leaderboardData.map((user, index) => (
                                    <tr key={index} style={{ borderBottom: '1px solid #F3F4F6' }}>
                                        <td style={{ padding: '16px 12px', fontWeight: 700, color: index < 3 ? '#EA580C' : '#374151' }}>#{user.rank}</td>
                                        <td style={{ padding: '16px 12px', fontWeight: 600, color: '#1F2937' }}>{user.name}</td>
                                        <td style={{ padding: '16px 12px', textAlign: 'right', fontWeight: 700, color: '#EA580C' }}>{user.points}</td>
                                        <td style={{ padding: '16px 12px', textAlign: 'center' }}>
                                            {user.badge && (
                                                <span style={{
                                                    padding: '4px 12px',
                                                    borderRadius: '20px',
                                                    backgroundColor: user.badge === 'Gold' ? '#FEF3C7' : user.badge === 'Silver' ? '#F3F4F6' : '#FFF7ED',
                                                    color: user.badge === 'Gold' ? '#D97706' : user.badge === 'Silver' ? '#4B5563' : '#C2410C',
                                                    fontSize: '0.75rem',
                                                    fontWeight: 700,
                                                    textTransform: 'uppercase'
                                                }}>
                                                    {user.badge}
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </UserDashboardLayout>
    );
};

export default MyResults;
