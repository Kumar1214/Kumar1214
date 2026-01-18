import React, { useState } from 'react';
import { Smartphone, CheckCircle, AlertCircle, PlayCircle, Download, RefreshCw, Package } from 'lucide-react';

const MobileAppTesting = () => {
    const [activeTab, setActiveTab] = useState('overview');


    // Test scenarios
    const testScenarios = [
        {
            id: 1,
            category: 'Authentication',
            name: 'User Login Flow',
            status: 'passed',
            description: 'Test user login with email and password',
            lastRun: '2024-11-20T10:30:00Z'
        },
        {
            id: 2,
            category: 'Authentication',
            name: 'OTP Login Flow',
            status: 'passed',
            description: 'Test user login with mobile OTP',
            lastRun: '2024-11-20T10:32:00Z'
        },
        {
            id: 3,
            category: 'Courses',
            name: 'Course Listing',
            status: 'passed',
            description: 'Test course listing and filtering',
            lastRun: '2024-11-20T10:35:00Z'
        },
        {
            id: 4,
            category: 'Courses',
            name: 'Course Enrollment',
            status: 'passed',
            description: 'Test course enrollment process',
            lastRun: '2024-11-20T10:40:00Z'
        },
        {
            id: 5,
            category: 'E-commerce',
            name: 'Product Browse',
            status: 'passed',
            description: 'Test product browsing and search',
            lastRun: '2024-11-20T10:45:00Z'
        },
        {
            id: 6,
            category: 'E-commerce',
            name: 'Shopping Cart',
            status: 'passed',
            description: 'Test add to cart and cart management',
            lastRun: '2024-11-20T10:50:00Z'
        },
        {
            id: 7,
            category: 'E-commerce',
            name: 'Checkout Process',
            status: 'warning',
            description: 'Test checkout and payment flow',
            lastRun: '2024-11-20T10:55:00Z'
        },
        {
            id: 8,
            category: 'Entertainment',
            name: 'Music Playback',
            status: 'passed',
            description: 'Test music player functionality',
            lastRun: '2024-11-20T11:00:00Z'
        },
        {
            id: 9,
            category: 'Entertainment',
            name: 'Podcast Streaming',
            status: 'passed',
            description: 'Test podcast streaming',
            lastRun: '2024-11-20T11:05:00Z'
        },
        {
            id: 10,
            category: 'Gaushala',
            name: 'Gaushala Listing',
            status: 'passed',
            description: 'Test gaushala browsing',
            lastRun: '2024-11-20T11:10:00Z'
        },
        {
            id: 11,
            category: 'Gaushala',
            name: 'Cow Adoption',
            status: 'passed',
            description: 'Test cow adoption flow',
            lastRun: '2024-11-20T11:15:00Z'
        },
        {
            id: 12,
            category: 'Performance',
            name: 'App Launch Time',
            status: 'passed',
            description: 'Test app startup performance',
            lastRun: '2024-11-20T11:20:00Z'
        }
    ];

    // Build information
    const buildInfo = {
        version: '1.0.0',
        buildNumber: '1',
        buildDate: '2024-11-20',
        platform: 'Android',
        minSdkVersion: '21',
        targetSdkVersion: '33',
        apkSize: '45.2 MB'
    };

    // Device compatibility
    const deviceCompatibility = [
        { name: 'Android 11+', status: 'supported', percentage: '95%' },
        { name: 'Android 9-10', status: 'supported', percentage: '90%' },
        { name: 'Android 8', status: 'limited', percentage: '70%' },
        { name: 'Android 7', status: 'limited', percentage: '60%' }
    ];

    const passedTests = testScenarios.filter(t => t.status === 'passed').length;
    const failedTests = testScenarios.filter(t => t.status === 'failed').length;
    const warningTests = testScenarios.filter(t => t.status === 'warning').length;
    const totalTests = testScenarios.length;

    return (
        <div>
            {/* Header */}
            <div style={{ marginBottom: '30px' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1F2937', marginBottom: '8px' }}>
                    Mobile App Testing & Integration
                </h2>
                <p style={{ color: '#6B7280' }}>
                    Test your mobile app functionality and manage builds
                </p>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '30px', borderBottom: '2px solid #F3F4F6' }}>
                <button
                    onClick={() => setActiveTab('overview')}
                    style={{
                        padding: '12px 24px',
                        border: 'none',
                        backgroundColor: 'transparent',
                        color: activeTab === 'overview' ? '#4F46E5' : '#6B7280',
                        borderBottom: activeTab === 'overview' ? '2px solid #4F46E5' : 'none',
                        marginBottom: '-2px',
                        cursor: 'pointer',
                        fontWeight: activeTab === 'overview' ? 600 : 400,
                        fontSize: '0.95rem'
                    }}
                >
                    Overview
                </button>
                <button
                    onClick={() => setActiveTab('tests')}
                    style={{
                        padding: '12px 24px',
                        border: 'none',
                        backgroundColor: 'transparent',
                        color: activeTab === 'tests' ? '#4F46E5' : '#6B7280',
                        borderBottom: activeTab === 'tests' ? '2px solid #4F46E5' : 'none',
                        marginBottom: '-2px',
                        cursor: 'pointer',
                        fontWeight: activeTab === 'tests' ? 600 : 400,
                        fontSize: '0.95rem'
                    }}
                >
                    Test Results
                </button>
                <button
                    onClick={() => setActiveTab('builds')}
                    style={{
                        padding: '12px 24px',
                        border: 'none',
                        backgroundColor: 'transparent',
                        color: activeTab === 'builds' ? '#4F46E5' : '#6B7280',
                        borderBottom: activeTab === 'builds' ? '2px solid #4F46E5' : 'none',
                        marginBottom: '-2px',
                        cursor: 'pointer',
                        fontWeight: activeTab === 'builds' ? 600 : 400,
                        fontSize: '0.95rem'
                    }}
                >
                    Build Info
                </button>
            </div>

            {/* Overview Tab */}
            {activeTab === 'overview' && (
                <div>
                    {/* Test Statistics */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
                        <div className="card" style={{ padding: '20px', borderRadius: '8px', backgroundColor: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{ padding: '12px', borderRadius: '8px', backgroundColor: '#ECFDF5' }}>
                                    <CheckCircle size={24} style={{ color: '#10B981' }} />
                                </div>
                                <div>
                                    <h4 style={{ fontSize: '0.85rem', color: '#6B7280', marginBottom: '4px' }}>Passed Tests</h4>
                                    <p style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#10B981' }}>{passedTests}/{totalTests}</p>
                                </div>
                            </div>
                        </div>

                        <div className="card" style={{ padding: '20px', borderRadius: '8px', backgroundColor: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{ padding: '12px', borderRadius: '8px', backgroundColor: '#FEF3C7' }}>
                                    <AlertCircle size={24} style={{ color: '#F59E0B' }} />
                                </div>
                                <div>
                                    <h4 style={{ fontSize: '0.85rem', color: '#6B7280', marginBottom: '4px' }}>Warnings</h4>
                                    <p style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#F59E0B' }}>{warningTests}</p>
                                </div>
                            </div>
                        </div>

                        <div className="card" style={{ padding: '20px', borderRadius: '8px', backgroundColor: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{ padding: '12px', borderRadius: '8px', backgroundColor: '#FEF2F2' }}>
                                    <AlertCircle size={24} style={{ color: '#EF4444' }} />
                                </div>
                                <div>
                                    <h4 style={{ fontSize: '0.85rem', color: '#6B7280', marginBottom: '4px' }}>Failed Tests</h4>
                                    <p style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#EF4444' }}>{failedTests}</p>
                                </div>
                            </div>
                        </div>

                        <div className="card" style={{ padding: '20px', borderRadius: '8px', backgroundColor: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{ padding: '12px', borderRadius: '8px', backgroundColor: '#EFF6FF' }}>
                                    <Package size={24} style={{ color: '#3B82F6' }} />
                                </div>
                                <div>
                                    <h4 style={{ fontSize: '0.85rem', color: '#6B7280', marginBottom: '4px' }}>APK Size</h4>
                                    <p style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#1F2937' }}>{buildInfo.apkSize}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Device Compatibility */}
                    <div className="card" style={{ padding: '20px', borderRadius: '8px', backgroundColor: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginBottom: '30px' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '16px' }}>Device Compatibility</h3>
                        <div style={{ display: 'grid', gap: '12px' }}>
                            {deviceCompatibility.map((device, index) => (
                                <div key={index} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', backgroundColor: '#F9FAFB', borderRadius: '6px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <Smartphone size={20} style={{ color: '#6B7280' }} />
                                        <span style={{ fontWeight: 500 }}>{device.name}</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <span style={{ fontSize: '0.9rem', color: '#6B7280' }}>{device.percentage}</span>
                                        <span style={{
                                            padding: '4px 12px',
                                            borderRadius: '16px',
                                            fontSize: '0.75rem',
                                            fontWeight: 500,
                                            backgroundColor: device.status === 'supported' ? '#ECFDF5' : '#FEF3C7',
                                            color: device.status === 'supported' ? '#065F46' : '#92400E'
                                        }}>
                                            {device.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="card" style={{ padding: '20px', borderRadius: '8px', backgroundColor: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '16px' }}>Quick Actions</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                            <button style={{ padding: '12px', backgroundColor: '#4F46E5', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center', fontSize: '0.9rem', fontWeight: 500 }}>
                                <PlayCircle size={18} /> Run All Tests
                            </button>
                            <button style={{ padding: '12px', backgroundColor: '#10B981', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center', fontSize: '0.9rem', fontWeight: 500 }}>
                                <Package size={18} /> Build APK
                            </button>
                            <button style={{ padding: '12px', backgroundColor: '#F59E0B', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center', fontSize: '0.9rem', fontWeight: 500 }}>
                                <Download size={18} /> Download APK
                            </button>
                            <button style={{ padding: '12px', border: '1px solid #D1D5DB', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center', backgroundColor: 'white', fontSize: '0.9rem', fontWeight: 500 }}>
                                <RefreshCw size={18} /> Sync Code
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Test Results Tab */}
            {activeTab === 'tests' && (
                <div>
                    <div style={{ marginBottom: '20px', display: 'flex', gap: '12px' }}>
                        <button style={{ padding: '10px 20px', backgroundColor: '#4F46E5', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', fontWeight: 500 }}>
                            <PlayCircle size={16} /> Run All Tests
                        </button>
                        <select style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #D1D5DB', fontSize: '0.9rem' }}>
                            <option value="all">All Categories</option>
                            <option value="authentication">Authentication</option>
                            <option value="courses">Courses</option>
                            <option value="ecommerce">E-commerce</option>
                            <option value="entertainment">Entertainment</option>
                            <option value="gaushala">Gaushala</option>
                        </select>
                    </div>

                    <div style={{ display: 'grid', gap: '12px' }}>
                        {testScenarios.map((test) => (
                            <div key={test.id} className="card" style={{ padding: '16px', borderRadius: '8px', backgroundColor: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
                                            <span style={{
                                                padding: '4px 12px',
                                                borderRadius: '16px',
                                                fontSize: '0.7rem',
                                                fontWeight: 500,
                                                backgroundColor: '#F3F4F6',
                                                color: '#6B7280'
                                            }}>
                                                {test.category}
                                            </span>
                                            <h4 style={{ fontSize: '1rem', fontWeight: 600 }}>{test.name}</h4>
                                        </div>
                                        <p style={{ color: '#6B7280', fontSize: '0.85rem', marginBottom: '8px' }}>{test.description}</p>
                                        <p style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>
                                            Last run: {new Date(test.lastRun).toLocaleString()}
                                        </p>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <span style={{
                                            padding: '6px 16px',
                                            borderRadius: '16px',
                                            fontSize: '0.85rem',
                                            fontWeight: 500,
                                            backgroundColor: test.status === 'passed' ? '#ECFDF5' :
                                                test.status === 'failed' ? '#FEF2F2' : '#FEF3C7',
                                            color: test.status === 'passed' ? '#065F46' :
                                                test.status === 'failed' ? '#B91C1C' : '#92400E'
                                        }}>
                                            {test.status === 'passed' ? '✓ Passed' :
                                                test.status === 'failed' ? '✗ Failed' : '⚠ Warning'}
                                        </span>
                                        <button style={{ padding: '6px 12px', border: '1px solid #D1D5DB', borderRadius: '4px', cursor: 'pointer', backgroundColor: 'white', fontSize: '0.85rem' }}>
                                            Rerun
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Build Info Tab */}
            {activeTab === 'builds' && (
                <div className="card" style={{ padding: '30px', borderRadius: '8px', backgroundColor: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '20px' }}>Current Build Information</h3>

                    <div style={{ display: 'grid', gap: '16px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '12px', padding: '12px 0', borderBottom: '1px solid #F3F4F6' }}>
                            <span style={{ fontWeight: 500, color: '#6B7280' }}>Version</span>
                            <span style={{ fontWeight: 600 }}>{buildInfo.version}</span>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '12px', padding: '12px 0', borderBottom: '1px solid #F3F4F6' }}>
                            <span style={{ fontWeight: 500, color: '#6B7280' }}>Build Number</span>
                            <span style={{ fontWeight: 600 }}>{buildInfo.buildNumber}</span>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '12px', padding: '12px 0', borderBottom: '1px solid #F3F4F6' }}>
                            <span style={{ fontWeight: 500, color: '#6B7280' }}>Build Date</span>
                            <span style={{ fontWeight: 600 }}>{buildInfo.buildDate}</span>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '12px', padding: '12px 0', borderBottom: '1px solid #F3F4F6' }}>
                            <span style={{ fontWeight: 500, color: '#6B7280' }}>Platform</span>
                            <span style={{ fontWeight: 600 }}>{buildInfo.platform}</span>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '12px', padding: '12px 0', borderBottom: '1px solid #F3F4F6' }}>
                            <span style={{ fontWeight: 500, color: '#6B7280' }}>Min SDK Version</span>
                            <span style={{ fontWeight: 600 }}>{buildInfo.minSdkVersion}</span>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '12px', padding: '12px 0', borderBottom: '1px solid #F3F4F6' }}>
                            <span style={{ fontWeight: 500, color: '#6B7280' }}>Target SDK Version</span>
                            <span style={{ fontWeight: 600 }}>{buildInfo.targetSdkVersion}</span>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '12px', padding: '12px 0' }}>
                            <span style={{ fontWeight: 500, color: '#6B7280' }}>APK Size</span>
                            <span style={{ fontWeight: 600 }}>{buildInfo.apkSize}</span>
                        </div>
                    </div>

                    <div style={{ marginTop: '30px', paddingTop: '20px', borderTop: '1px solid #E5E7EB' }}>
                        <button style={{ padding: '12px 24px', backgroundColor: '#10B981', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '0.95rem', fontWeight: 500 }}>
                            <Download size={18} /> Download Current APK
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MobileAppTesting;
