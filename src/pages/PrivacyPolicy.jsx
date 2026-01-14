import React from 'react';
import { Shield } from 'lucide-react';

const PrivacyPolicy = () => {
    return (
        <div className="container mt-lg" style={{ maxWidth: '900px', margin: '0 auto', padding: 'var(--spacing-3xl) var(--spacing-lg)' }}>
            <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-3xl)' }}>
                <Shield size={48} color="#6366F1" style={{ margin: '0 auto var(--spacing-md)' }} />
                <h1 style={{ fontSize: '2.5rem', marginBottom: 'var(--spacing-sm)' }}>Privacy Policy</h1>
                <p style={{ color: 'var(--color-text-muted)' }}>Last updated: November 26, 2024</p>
            </div>

            <div style={{ fontSize: '1.05rem', lineHeight: 1.8, color: 'var(--color-text-main)' }}>
                <h2 style={{ fontSize: '1.75rem', marginTop: 'var(--spacing-2xl)', marginBottom: 'var(--spacing-lg)' }}>1. Introduction</h2>
                <p>Welcome to Gaugyan LMS ("we," "our," or "us"). We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.</p>

                <h2 style={{ fontSize: '1.75rem', marginTop: 'var(--spacing-2xl)', marginBottom: 'var(--spacing-lg)' }}>2. Information We Collect</h2>
                <h3 style={{ fontSize: '1.3rem', marginTop: 'var(--spacing-lg)', marginBottom: 'var(--spacing-md)' }}>2.1 Personal Information</h3>
                <p>We collect personal information that you voluntarily provide to us when you:</p>
                <ul style={{ marginLeft: '20px', marginBottom: 'var(--spacing-lg)' }}>
                    <li>Register for an account</li>
                    <li>Make a purchase</li>
                    <li>Subscribe to our newsletter</li>
                    <li>Participate in surveys or contests</li>
                    <li>Contact us for support</li>
                </ul>
                <p>This information may include:</p>
                <ul style={{ marginLeft: '20px', marginBottom: 'var(--spacing-lg)' }}>
                    <li>Name and contact information (email, phone number, address)</li>
                    <li>Payment information</li>
                    <li>Profile information</li>
                    <li>Communication preferences</li>
                </ul>

                <h3 style={{ fontSize: '1.3rem', marginTop: 'var(--spacing-lg)', marginBottom: 'var(--spacing-md)' }}>2.2 Automatically Collected Information</h3>
                <p>When you access our platform, we automatically collect certain information, including:</p>
                <ul style={{ marginLeft: '20px', marginBottom: 'var(--spacing-lg)' }}>
                    <li>Device information (IP address, browser type, operating system)</li>
                    <li>Usage data (pages visited, time spent, clicks)</li>
                    <li>Cookies and similar tracking technologies</li>
                </ul>

                <h2 style={{ fontSize: '1.75rem', marginTop: 'var(--spacing-2xl)', marginBottom: 'var(--spacing-lg)' }}>3. How We Use Your Information</h2>
                <p>We use the information we collect to:</p>
                <ul style={{ marginLeft: '20px', marginBottom: 'var(--spacing-lg)' }}>
                    <li>Provide, maintain, and improve our services</li>
                    <li>Process transactions and send related information</li>
                    <li>Send administrative information and updates</li>
                    <li>Respond to your inquiries and provide customer support</li>
                    <li>Send marketing and promotional communications (with your consent)</li>
                    <li>Monitor and analyze usage patterns and trends</li>
                    <li>Detect, prevent, and address technical issues and fraudulent activity</li>
                    <li>Comply with legal obligations</li>
                </ul>

                <h2 style={{ fontSize: '1.75rem', marginTop: 'var(--spacing-2xl)', marginBottom: 'var(--spacing-lg)' }}>4. Information Sharing and Disclosure</h2>
                <p>We may share your information in the following circumstances:</p>
                <ul style={{ marginLeft: '20px', marginBottom: 'var(--spacing-lg)' }}>
                    <li><strong>Service Providers:</strong> With third-party vendors who perform services on our behalf</li>
                    <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
                    <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
                    <li><strong>With Your Consent:</strong> When you have given us permission to share your information</li>
                </ul>

                <h2 style={{ fontSize: '1.75rem', marginTop: 'var(--spacing-2xl)', marginBottom: 'var(--spacing-lg)' }}>5. Data Security</h2>
                <p>We implement appropriate technical and organizational security measures to protect your personal information. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.</p>

                <h2 style={{ fontSize: '1.75rem', marginTop: 'var(--spacing-2xl)', marginBottom: 'var(--spacing-lg)' }}>6. Your Privacy Rights</h2>
                <p>Depending on your location, you may have the following rights:</p>
                <ul style={{ marginLeft: '20px', marginBottom: 'var(--spacing-lg)' }}>
                    <li>Access and receive a copy of your personal information</li>
                    <li>Correct inaccurate or incomplete information</li>
                    <li>Request deletion of your personal information</li>
                    <li>Object to or restrict processing of your information</li>
                    <li>Data portability</li>
                    <li>Withdraw consent at any time</li>
                </ul>

                <h2 style={{ fontSize: '1.75rem', marginTop: 'var(--spacing-2xl)', marginBottom: 'var(--spacing-lg)' }}>7. Cookies and Tracking Technologies</h2>
                <p>We use cookies and similar tracking technologies to collect and track information about your use of our platform. You can control cookies through your browser settings.</p>

                <h2 style={{ fontSize: '1.75rem', marginTop: 'var(--spacing-2xl)', marginBottom: 'var(--spacing-lg)' }}>8. Children's Privacy</h2>
                <p>Our services are not directed to children under 13 years of age. We do not knowingly collect personal information from children under 13. If you believe we have collected information from a child under 13, please contact us immediately.</p>

                <h2 style={{ fontSize: '1.75rem', marginTop: 'var(--spacing-2xl)', marginBottom: 'var(--spacing-lg)' }}>9. Changes to This Privacy Policy</h2>
                <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.</p>

                <h2 style={{ fontSize: '1.75rem', marginTop: 'var(--spacing-2xl)', marginBottom: 'var(--spacing-lg)' }}>10. Contact Us</h2>
                <p>If you have questions or concerns about this Privacy Policy, please contact us at:</p>
                <div style={{ padding: 'var(--spacing-lg)', backgroundColor: '#F3F4F6', borderRadius: 'var(--radius-md)', marginTop: 'var(--spacing-md)' }}>
                    <p style={{ marginBottom: '8px' }}><strong>Email:</strong> privacy@gaugyan.com</p>
                    <p style={{ marginBottom: '8px' }}><strong>Phone:</strong> +91 1234567890</p>
                    <p><strong>Address:</strong> Gaugyan LMS, Mumbai, Maharashtra, India</p>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
