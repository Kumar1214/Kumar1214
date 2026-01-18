import React from 'react';
import { FileText } from 'lucide-react';

const TermsConditions = () => {
    return (
        <div className="container mt-lg" style={{ maxWidth: '900px', margin: '0 auto', padding: 'var(--spacing-3xl) var(--spacing-lg)' }}>
            <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-3xl)' }}>
                <FileText size={48} color="#6366F1" style={{ margin: '0 auto var(--spacing-md)' }} />
                <h1 style={{ fontSize: '2.5rem', marginBottom: 'var(--spacing-sm)' }}>Terms & Conditions</h1>
                <p style={{ color: 'var(--color-text-muted)' }}>Last updated: November 26, 2024</p>
            </div>

            <div style={{ fontSize: '1.05rem', lineHeight: 1.8, color: 'var(--color-text-main)' }}>
                <h2 style={{ fontSize: '1.75rem', marginTop: 'var(--spacing-2xl)', marginBottom: 'var(--spacing-lg)' }}>1. Acceptance of Terms</h2>
                <p>By accessing and using Gaugyan LMS ("Platform"), you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to these Terms & Conditions, please do not use our Platform.</p>

                <h2 style={{ fontSize: '1.75rem', marginTop: 'var(--spacing-2xl)', marginBottom: 'var(--spacing-lg)' }}>2. Use License</h2>
                <p>Permission is granted to temporarily access the materials (information or software) on Gaugyan LMS for personal, non-commercial use only. This is the grant of a license, not a transfer of title, and under this license you may not:</p>
                <ul style={{ marginLeft: '20px', marginBottom: 'var(--spacing-lg)' }}>
                    <li>Modify or copy the materials</li>
                    <li>Use the materials for any commercial purpose or public display</li>
                    <li>Attempt to decompile or reverse engineer any software on the Platform</li>
                    <li>Remove any copyright or proprietary notations from the materials</li>
                    <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
                </ul>

                <h2 style={{ fontSize: '1.75rem', marginTop: 'var(--spacing-2xl)', marginBottom: 'var(--spacing-lg)' }}>3. User Accounts</h2>
                <h3 style={{ fontSize: '1.3rem', marginTop: 'var(--spacing-lg)', marginBottom: 'var(--spacing-md)' }}>3.1 Account Creation</h3>
                <p>To access certain features of the Platform, you must register for an account. You agree to:</p>
                <ul style={{ marginLeft: '20px', marginBottom: 'var(--spacing-lg)' }}>
                    <li>Provide accurate, current, and complete information</li>
                    <li>Maintain and update your information to keep it accurate</li>
                    <li>Maintain the security of your password</li>
                    <li>Accept all responsibility for activity that occurs under your account</li>
                    <li>Notify us immediately of any unauthorized use of your account</li>
                </ul>

                <h3 style={{ fontSize: '1.3rem', marginTop: 'var(--spacing-lg)', marginBottom: 'var(--spacing-md)' }}>3.2 Account Termination</h3>
                <p>We reserve the right to suspend or terminate your account at any time for violations of these Terms or for any other reason at our sole discretion.</p>

                <h2 style={{ fontSize: '1.75rem', marginTop: 'var(--spacing-2xl)', marginBottom: 'var(--spacing-lg)' }}>4. Course Enrollment and Access</h2>
                <p>When you enroll in a course, you receive a limited, non-exclusive, non-transferable license to access and view the course content. This license is subject to the following conditions:</p>
                <ul style={{ marginLeft: '20px', marginBottom: 'var(--spacing-lg)' }}>
                    <li>Courses are for personal use only</li>
                    <li>You may not share your account credentials</li>
                    <li>You may not reproduce, distribute, or create derivative works from course content</li>
                    <li>Access may be revoked for violations of these terms</li>
                </ul>

                <h2 style={{ fontSize: '1.75rem', marginTop: 'var(--spacing-2xl)', marginBottom: 'var(--spacing-lg)' }}>5. Payments and Refunds</h2>
                <h3 style={{ fontSize: '1.3rem', marginTop: 'var(--spacing-lg)', marginBottom: 'var(--spacing-md)' }}>5.1 Pricing</h3>
                <p>All courses on our platform are currently offered free of charge. We reserve the right to introduce paid courses in the future with advance notice.</p>

                <h3 style={{ fontSize: '1.3rem', marginTop: 'var(--spacing-lg)', marginBottom: 'var(--spacing-md)' }}>5.2 E-commerce Transactions</h3>
                <p>For product purchases through our platform:</p>
                <ul style={{ marginLeft: '20px', marginBottom: 'var(--spacing-lg)' }}>
                    <li>All prices are in Indian Rupees (INR)</li>
                    <li>Payment must be made at the time of purchase</li>
                    <li>We accept various payment methods as displayed at checkout</li>
                    <li>Refund policy is subject to our Shipping Policy</li>
                </ul>

                <h2 style={{ fontSize: '1.75rem', marginTop: 'var(--spacing-2xl)', marginBottom: 'var(--spacing-lg)' }}>6. Intellectual Property</h2>
                <p>The Platform and its original content, features, and functionality are owned by Gaugyan LMS and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.</p>

                <h2 style={{ fontSize: '1.75rem', marginTop: 'var(--spacing-2xl)', marginBottom: 'var(--spacing-lg)' }}>7. User Content</h2>
                <p>By posting content on the Platform, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, and display such content in connection with operating the Platform.</p>

                <h2 style={{ fontSize: '1.75rem', marginTop: 'var(--spacing-2xl)', marginBottom: 'var(--spacing-lg)' }}>8. Prohibited Activities</h2>
                <p>You agree not to engage in any of the following prohibited activities:</p>
                <ul style={{ marginLeft: '20px', marginBottom: 'var(--spacing-lg)' }}>
                    <li>Violating laws or regulations</li>
                    <li>Infringing on intellectual property rights</li>
                    <li>Transmitting viruses or malicious code</li>
                    <li>Spamming or sending unsolicited communications</li>
                    <li>Harassing, abusing, or harming others</li>
                    <li>Impersonating others or providing false information</li>
                    <li>Interfering with the Platform's operation</li>
                </ul>

                <h2 style={{ fontSize: '1.75rem', marginTop: 'var(--spacing-2xl)', marginBottom: 'var(--spacing-lg)' }}>9. Disclaimer</h2>
                <p>The materials on Gaugyan LMS are provided on an 'as is' basis. We make no warranties, expressed or implied, and hereby disclaim all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property.</p>

                <h2 style={{ fontSize: '1.75rem', marginTop: 'var(--spacing-2xl)', marginBottom: 'var(--spacing-lg)' }}>10. Limitations of Liability</h2>
                <p>In no event shall Gaugyan LMS or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on the Platform.</p>

                <h2 style={{ fontSize: '1.75rem', marginTop: 'var(--spacing-2xl)', marginBottom: 'var(--spacing-lg)' }}>11. Governing Law</h2>
                <p>These Terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law provisions.</p>

                <h2 style={{ fontSize: '1.75rem', marginTop: 'var(--spacing-2xl)', marginBottom: 'var(--spacing-lg)' }}>12. Changes to Terms</h2>
                <p>We reserve the right to modify these Terms at any time. We will notify users of any material changes. Your continued use of the Platform after such modifications constitutes your acceptance of the updated Terms.</p>

                <h2 style={{ fontSize: '1.75rem', marginTop: 'var(--spacing-2xl)', marginBottom: 'var(--spacing-lg)' }}>13. Contact Information</h2>
                <p>If you have any questions about these Terms, please contact us at:</p>
                <div style={{ padding: 'var(--spacing-lg)', backgroundColor: '#F3F4F6', borderRadius: 'var(--radius-md)', marginTop: 'var(--spacing-md)' }}>
                    <p style={{ marginBottom: '8px' }}><strong>Email:</strong> legal@gaugyan.com</p>
                    <p style={{ marginBottom: '8px' }}><strong>Phone:</strong> +91 1234567890</p>
                    <p><strong>Address:</strong> Gaugyan LMS, Mumbai, Maharashtra, India</p>
                </div>
            </div>
        </div>
    );
};

export default TermsConditions;
