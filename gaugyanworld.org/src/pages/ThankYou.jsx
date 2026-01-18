import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, ArrowRight } from 'lucide-react';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';

const ThankYou = () => {
    const { user } = useAuth();
    const [orderId, setOrderId] = React.useState('...');

    React.useEffect(() => {
        setOrderId(Math.floor(100000 + Math.random() * 900000));
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
