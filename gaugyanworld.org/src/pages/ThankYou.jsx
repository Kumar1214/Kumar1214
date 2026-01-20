import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, ArrowRight } from 'lucide-react';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';

const ThankYou = () => {
    const { user } = useAuth();
    const [orderId, setOrderId] = React.useState('...');

    React.useEffect(() => {
        setOrderId(String(Math.floor(100000 + Math.random() * 900000)));
    }, []);

    return (
        <div className="container mt-lg" style={{ textAlign: 'center', padding: 'var(--spacing-3xl) 0', maxWidth: '600px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 'var(--spacing-lg)' }}>
                <CheckCircle size={80} color="#10B981" fill="#ECFDF5" />
            </div>

            <h1 style={{ fontSize: '2.5rem', marginBottom: 'var(--spacing-md)', color: 'var(--color-text-main)' }}>Thank You!</h1>

            <p style={{ fontSize: '1.2rem', color: 'var(--color-text-light)', marginBottom: 'var(--spacing-xl)' }}>
                Your order has been placed successfully.
            </p>

            <div className="card" style={{ padding: 'var(--spacing-xl)', marginBottom: 'var(--spacing-xl)', backgroundColor: '#F9FAFB' }}>
                <p style={{ marginBottom: 'var(--spacing-md)' }}>
                    We have sent an order confirmation email to your registered email address.
                </p>
                <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
                    Order ID: #{orderId}
                </p>
            </div>

            {/* Upsell Section */}
            <div className="card" style={{ padding: 'var(--spacing-xl)', marginBottom: 'var(--spacing-xl)', border: '2px solid #F59E0B', backgroundColor: '#FFFBEB' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                    <div style={{ padding: '10px', backgroundColor: '#F59E0B', borderRadius: '50%', color: 'white' }}>
                        <CheckCircle size={24} />
                    </div>
                    <div style={{ textAlign: 'left' }}>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#92400E' }}>Unlock Your Potential!</h3>
                        <p style={{ color: '#B45309' }}>Based on your interest, we recommend this course.</p>
                    </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'white', padding: '16px', borderRadius: '8px' }}>
                    <div style={{ textAlign: 'left' }}>
                        <h4 style={{ fontWeight: 600 }}>Ayurveda & Holistic Living</h4>
                        <p style={{ fontSize: '0.9rem', color: '#6B7280' }}>Master the art of healthy living.</p>
                    </div>
                    <Link to="/courses/1">
                        <Button style={{ backgroundColor: '#F59E0B' }}>View Course</Button>
                    </Link>
                </div>
            </div>

            <div style={{ display: 'flex', gap: 'var(--spacing-md)', justifyContent: 'center' }}>
                <Link to={
                    user?.role === 'admin' ? '/admin' :
                        user?.role === 'vendor' ? '/vendor/dashboard' :
                            user?.role === 'instructor' ? '/instructor/dashboard' :
                                '/dashboard'
                }>
                    <Button variant="secondary">Go to Dashboard</Button>
                </Link>
                <Link to="/shop">
                    <Button style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        Continue Shopping <ArrowRight size={18} />
                    </Button>
                </Link>
            </div>
        </div>
    );
};

export default ThankYou;
