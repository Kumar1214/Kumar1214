import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import Input from '../components/Input';
import { Facebook } from 'lucide-react';
import { signInWithGoogle, signInWithFacebook } from '../config/firebase';

const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { signup, login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Input Validation
        if (!name.trim()) {
            return setError('Name is required');
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return setError('Please enter a valid email address');
        }

        if (password.length < 6) {
            return setError('Password must be at least 6 characters long');
        }

        if (password !== confirmPassword) {
            return setError('Passwords do not match');
        }

        try {
            setError('');
            setLoading(true);
            const user = await signup(email, password, name);

            // Redirect based on user role
            if (user && user.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/dashboard');
            }
        } catch (err) {
            setError('Failed to create account: ' + err.message);
        }

        setLoading(false);
    };

    const handleGoogleSignup = async () => {
        try {
            setError('');
            setLoading(true);
            const user = await signInWithGoogle();

            // Create user session with AuthContext
            await login(user.email, null, user);

            // Redirect
            navigate('/');
        } catch (err) {
            setError('Google signup failed: ' + err.message);
        }
        setLoading(false);
    };

    const handleFacebookSignup = async () => {
        try {
            setError('');
            setLoading(true);
            const user = await signInWithFacebook();
            // Create session
            await login(user.email, null, user);
            navigate('/dashboard');
        } catch (err) {
            setError('Facebook signup failed: ' + err.message);
            setLoading(false);
        }
    };

    return (
        <div className="container" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="card" style={{ width: '100%', maxWidth: '450px' }}>
                <h2 className="text-center" style={{ marginBottom: 'var(--spacing-lg)', color: 'var(--color-primary)' }}>
                    Create Account
                </h2>

                {error && (
                    <div style={{
                        backgroundColor: '#FEE2E2',
                        color: '#B91C1C',
                        padding: '0.75rem',
                        borderRadius: 'var(--radius-md)',
                        marginBottom: 'var(--spacing-md)',
                        fontSize: '0.875rem'
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <Input
                        label="Full Name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        placeholder="Enter your full name"
                    />

                    <Input
                        label="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="Enter your email"
                    />

                    <Input
                        label="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="Create a password"
                    />

                    <Input
                        label="Confirm Password"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        placeholder="Confirm your password"
                    />

                    <Button type="submit" fullWidth disabled={loading} className="mt-md">
                        {loading ? 'Creating Account...' : 'Sign Up'}
                    </Button>
                </form>

                <div style={{ marginTop: 'var(--spacing-md)', textAlign: 'center', fontSize: '0.9rem' }}>
                    Already have an account? <Link to="/login" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>Log In</Link>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', margin: '24px 0' }}>
                    <div style={{ flex: 1, height: '1px', backgroundColor: '#E5E7EB' }}></div>
                    <span style={{ padding: '0 10px', color: '#6B7280', fontSize: '0.85rem', fontWeight: 500 }}>OR SIGN UP WITH</span>
                    <div style={{ flex: 1, height: '1px', backgroundColor: '#E5E7EB' }}></div>
                </div>

                <div style={{ marginBottom: '16px' }}>
                    <Button
                        type="button"
                        fullWidth
                        variant="secondary"
                        onClick={() => navigate('/login')}
                        style={{ border: '1px solid var(--color-primary)', color: 'var(--color-primary)' }}
                    >
                        Sign up with Mobile Number used
                    </Button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <button
                        type="button"
                        onClick={handleGoogleSignup}
                        disabled={loading}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '10px',
                            padding: '10px',
                            border: '1px solid #D1D5DB',
                            borderRadius: 'var(--radius-md)',
                            backgroundColor: 'white',
                            color: '#374151',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            fontWeight: 500,
                            opacity: loading ? 0.6 : 1,
                            transition: 'background-color 0.2s'
                        }}
                        onMouseOver={(e) => !loading && (e.currentTarget.style.backgroundColor = '#F9FAFB')}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                        Google
                    </button>
                    <button
                        type="button"
                        onClick={handleFacebookSignup}
                        disabled={loading}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '10px',
                            padding: '10px',
                            border: 'none',
                            borderRadius: 'var(--radius-md)',
                            backgroundColor: '#1877F2',
                            color: 'white',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            fontWeight: 500,
                            opacity: loading ? 0.6 : 1,
                            transition: 'opacity 0.2s'
                        }}
                        onMouseOver={(e) => !loading && (e.currentTarget.style.opacity = '0.9')}
                        onMouseOut={(e) => e.currentTarget.style.opacity = loading ? '0.6' : '1'}
                    >
                        <Facebook size={20} />
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate('/login?mode=mobile')}
                        disabled={loading}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '10px',
                            padding: '10px',
                            border: 'none',
                            borderRadius: 'var(--radius-md)',
                            backgroundColor: '#4B5563',
                            color: 'white',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            fontWeight: 500,
                            opacity: loading ? 0.6 : 1,
                            transition: 'opacity 0.2s'
                        }}
                        onMouseOver={(e) => !loading && (e.currentTarget.style.opacity = '0.9')}
                        onMouseOut={(e) => e.currentTarget.style.opacity = loading ? '0.6' : '1'}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 18h.01" /><path d="M17 18h.01" /><path d="M7 18h.01" /><path d="M12 14h.01" /><path d="M17 14h.01" /><path d="M7 14h.01" /><path d="M12 10h.01" /><path d="M17 10h.01" /><path d="M7 10h.01" /><path d="M12 6h.01" /><path d="M17 6h.01" /><path d="M7 6h.01" /><rect x="5" y="2" width="14" height="20" rx="2" ry="2" /></svg>
                        Sign up with Mobile OTP
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Signup;
