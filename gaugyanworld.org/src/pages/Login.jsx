

import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import Input from '../components/Input';
import { Facebook } from 'lucide-react';
import { auth } from '../config/firebase';
import {
    GoogleAuthProvider,
    FacebookAuthProvider,
    signInWithRedirect,
    getRedirectResult
} from 'firebase/auth';

const Login = () => {
    const [identifier, setIdentifier] = useState(''); // Email or Phone
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [showOtpInput, setShowOtpInput] = useState(false);
    const [isPhone, setIsPhone] = useState(false);
    const [confirmationResult, setConfirmationResult] = useState(null);

    // Forgot Password State
    const [showForgotModal, setShowForgotModal] = useState(false);
    const [forgotEmail, setForgotEmail] = useState('');
    const [forgotMsg, setForgotMsg] = useState('');

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login, resetPassword, currentUser, sendOtp, verifyOtp, setupRecaptcha, verifyFirebaseToken } = useAuth(); // Destructure verifyFirebaseToken

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const returnUrl = searchParams.get('returnUrl');

    // Redirect if already logged in
    useEffect(() => {
        if (currentUser) {
            if (returnUrl) {
                navigate(returnUrl);
            } else if (currentUser.role === 'admin') {
                navigate('/admin');
            } else if (currentUser.role === 'vendor') {
                navigate('/vendor/dashboard');
            } else if (currentUser.role === 'instructor') {
                navigate('/instructor/dashboard');
            } else if (currentUser.role === 'artist') {
                navigate('/artist/dashboard');
            } else if (currentUser.role === 'author') {
                navigate('/author/dashboard');
            } else if (currentUser.role === 'editor') {
                navigate('/editor/dashboard');
            } else if (currentUser.role === 'gaushala_owner') {
                navigate('/gaushala/dashboard');
            } else {
                navigate('/dashboard');
            }
        }
    }, [currentUser, navigate, returnUrl]);

    // Check for Redirect Result (for Mobile/Redirect Flow)
    useEffect(() => {
        const checkRedirect = async () => {
            try {
                // Check local query param for mode
                if (searchParams.get('mode') === 'mobile') {
                    setIdentifier('+91');
                    setIsPhone(true);
                }

                const result = await getRedirectResult(auth);
                if (result) {
                    setLoading(true);
                    const user = result.user;
                    console.log("Redirect Login Success:", user.email);

                    // FIX: Exchange Firebase Token with Backend
                    const idToken = await user.getIdToken();
                    await verifyFirebaseToken(idToken, 'google');

                    // Explicitly go to Dashboard
                    navigate(returnUrl || '/dashboard');
                }
            } catch (error) {
                console.error("Redirect Login Error:", error);
                setError('Login failed: ' + error.message);
                alert('Login Error: ' + error.message);
                setLoading(false);
            }
        };
        checkRedirect();
    }, [login, navigate, returnUrl, verifyFirebaseToken]);

    useEffect(() => {
        setupRecaptcha('recaptcha-container');
        return () => {
            if (window.recaptchaVerifier) {
                try {
                    window.recaptchaVerifier.clear();
                } catch (e) {/* ignore */ }
                window.recaptchaVerifier = null;
            }
        };
    }, [setupRecaptcha]);

    // ... existing defined useEffects ...

    const handleIdentifierChange = (e) => {
        const value = e.target.value;
        setIdentifier(value);
        if (value.match(/^\+?[0-9]{10,14}$/)) { // Basic phone check
            setIsPhone(true);
        } else {
            setIsPhone(false);
            setShowOtpInput(false);
        }
    };

    const handleSendOtp = async () => {
        if (!isPhone) return;
        setError('');
        setLoading(true);

        try {
            // Format phone number (E.164) - assume IN (+91) if missing for now, or let user type it
            let phoneNumber = identifier;
            if (!phoneNumber.startsWith('+')) {
                phoneNumber = '+91' + phoneNumber; // Default to India compliant if only 10 digits
            }

            // Ensure appVerifier is ready
            if (!window.recaptchaVerifier) {
                // Should be initialized by useEffect, but double check
                console.error("Recaptcha not initialized");
                setError("System error: Recaptcha not ready. Refresh page.");
                setLoading(false);
                return;
            }

            const appVerifier = window.recaptchaVerifier;
            const result = await sendOtp(phoneNumber, appVerifier);

            setConfirmationResult(result);
            setShowOtpInput(true);
            alert("OTP Sent to " + phoneNumber);

        } catch (error) {
            console.error("SMS Error:", error);
            setError("Failed to send OTP: " + error.message);
            if (window.recaptchaVerifier) window.recaptchaVerifier.clear();
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async () => {
        if (!confirmationResult) return;
        setLoading(true);
        try {
            await verifyOtp(otp);
            // Login successful (verifyOtp handles context update)
            navigate(returnUrl || '/dashboard');
        } catch (error) {
            setError("Invalid OTP or Verification Failed: " + error.message);
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (isPhone) {
            if (!showOtpInput) {
                handleSendOtp();
            } else {
                handleVerifyOtp();
            }
            return;
        }

        // Email Login
        try {
            setLoading(true);
            const user = await login(identifier, password);
            if (user) {
                if (returnUrl) {
                    navigate(returnUrl);
                } else if (user.role === 'admin') {
                    navigate('/admin');
                } else if (user.role === 'vendor') {
                    navigate('/vendor/dashboard');
                } else if (user.role === 'instructor') {
                    navigate('/instructor/dashboard');
                } else if (user.role === 'artist') {
                    navigate('/artist/dashboard');
                } else if (user.role === 'gaushala_owner') {
                    navigate('/gaushala/dashboard');
                } else {
                    navigate('/dashboard');
                }
            } else {
                navigate(returnUrl || '/');
            }
        } catch (err) {
            setError('Failed to log in: ' + err.message);
        }
        setLoading(false);
    };

    const handleForgotPassword = async () => {
        if (!forgotEmail) return setForgotMsg("Please enter email");
        try {
            await resetPassword(forgotEmail);
            setForgotMsg("Reset link sent!");
            setTimeout(() => setShowForgotModal(false), 3000);
        } catch (e) {
            setForgotMsg("Error: " + e.message);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            setError('');
            setLoading(true);
            await signInWithRedirect(auth, new GoogleAuthProvider());
            // No need to navigate here, the redirect will reload page and hit useEffect
        } catch (err) {
            setError('Google login failed: ' + err.message);
            setLoading(false);
        }
    };

    // Check for Token from Backend (Social Login Redirect)
    useEffect(() => {
        const token = searchParams.get('token');
        const errorParam = searchParams.get('error');

        if (token) {
            setLoading(true);
            // Verify and Decode Token locally or fetch /me
            // For simplicity, we just set the token and fetch user
            localStorage.setItem('token', token);
            // We need to trigger the auth context's loadUser or equivalent
            // Assuming useAuth exposes a method to reload or we just reload page/navigate
            // A clean way is to call a method that sets the user. 
            // Since AuthContext likely checks token on mount, a reload works, OR passing to context.
            // Let's see... context uses `login` which takes email/pass. 
            // We should use the token. 
            // Simplest: Reload page to let AuthProvider pick up token, or better:
            // Force fetch user.

            // Hack for immediate feedback:
            window.location.href = '/dashboard';
        }

        if (errorParam) {
            setError(`Login Failed: ${errorParam}`);
        }
    }, [searchParams]);

    const handleFacebookLogin = () => {
        setLoading(true);
        // Redirect to Backend Manual OAuth
        const apiBase = import.meta.env.VITE_API_URL || 'https://api.gaugyanworld.org/api';
        // Ensure we don't double up /api if VITE_API_URL already has it, but auth route is usually /api/v1/auth
        // If VITE_API_URL is https://api.../api, then we append /v1/auth/facebook
        window.location.href = `${apiBase}/v1/auth/facebook`;
    };

    return (
        <div className="container mt-lg" style={{ maxWidth: '400px', display: 'flex', flexDirection: 'column', minHeight: '80vh', justifyContent: 'center' }}>
            {/* Recaptcha Container */}
            <div id="recaptcha-container"></div>

            <div className="card" style={{ padding: 'var(--spacing-xl)' }}>
                {/* Logo */}
                <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-lg)' }}>
                    <img src="/gaugyan-logo.png" alt="Gaugyan" style={{ height: '80px', width: 'auto', margin: '0 auto', display: 'block' }} />
                </div>

                <h2 style={{ textAlign: 'center', marginBottom: 'var(--spacing-lg)' }}>Log In / Sign Up</h2>
                {error && <div style={{ backgroundColor: '#FEE2E2', color: '#DC2626', padding: '10px', borderRadius: 'var(--radius-md)', marginBottom: 'var(--spacing-md)' }}>{error}</div>}
                <form onSubmit={handleSubmit}>
                    <Input
                        label="Email or Mobile Number"
                        type="text"
                        id="identifier"
                        name="identifier"
                        value={identifier}
                        onChange={handleIdentifierChange}
                        required={!showOtpInput}
                        placeholder="Enter email or mobile (+91...)"
                        disabled={showOtpInput}
                    />

                    {isPhone && showOtpInput ? (
                        <div style={{ animation: 'fadeIn 0.3s' }}>
                            <Input
                                label="Enter OTP"
                                type="text"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                required
                                placeholder="123456"
                                maxLength="6"
                            />
                        </div>
                    ) : !isPhone && (
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <Input
                                label="Password"
                                type="password"
                                id="password"
                                name="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <div style={{ textAlign: 'right', marginTop: '-10px', marginBottom: '15px' }}>
                                <button type="button" onClick={() => setShowForgotModal(true)} style={{ fontSize: '0.85rem', color: 'var(--color-primary)' }}>Forgot Password?</button>
                            </div>
                        </div>
                    )}

                    <Button type="submit" fullWidth disabled={loading}>
                        {loading ? 'Processing...' : (isPhone ? (showOtpInput ? 'Verify OTP' : 'Send OTP') : 'Log In')}
                    </Button>
                </form>

                <div style={{ marginTop: 'var(--spacing-md)', textAlign: 'center' }}>
                    Don't have an account? <Link to="/signup">Sign Up</Link>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', margin: '24px 0' }}>
                    <div style={{ flex: 1, height: '1px', backgroundColor: '#E5E7EB' }}></div>
                    <span style={{ padding: '0 10px', color: '#6B7280', fontSize: '0.85rem', fontWeight: 500 }}>OR CONTINUE WITH</span>
                    <div style={{ flex: 1, height: '1px', backgroundColor: '#E5E7EB' }}></div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <button type="button" onClick={handleGoogleLogin} disabled={loading} style={socialBtnStyle}>
                        {/* Google Icon SVG */}
                        <svg width="20" height="20" viewBox="0 0 24 24" style={{ marginRight: '8px' }}><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
                        Google
                    </button>
                    <button type="button" onClick={handleFacebookLogin} disabled={loading} style={{ ...socialBtnStyle, backgroundColor: '#1877F2', color: 'white', border: 'none' }}>
                        <Facebook size={20} style={{ marginRight: '8px' }} /> Facebook
                    </button>
                    <button type="button" onClick={() => { setIdentifier('+91'); setIsPhone(true); document.getElementById('identifier')?.focus(); }} disabled={loading} style={{ ...socialBtnStyle, backgroundColor: '#4B5563', color: 'white', border: 'none' }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}><path d="M12 18h.01" /><path d="M17 18h.01" /><path d="M7 18h.01" /><path d="M12 14h.01" /><path d="M17 14h.01" /><path d="M7 14h.01" /><path d="M12 10h.01" /><path d="M17 10h.01" /><path d="M7 10h.01" /><path d="M12 6h.01" /><path d="M17 6h.01" /><path d="M7 6h.01" /><rect x="5" y="2" width="14" height="20" rx="2" ry="2" /></svg>
                        Login with Mobile OTP
                    </button>
                </div>


            </div>

            {/* Forgot Password Modal */}
            {showForgotModal && (
                <div style={{
                    position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
                }}>
                    <div className="card" style={{ width: '90%', maxWidth: '350px', padding: '24px' }}>
                        <h3>Reset Password</h3>
                        <p style={{ fontSize: '0.9rem', marginBottom: '16px', color: '#6B7280' }}>Enter your email to receive a reset link.</p>
                        <Input
                            value={forgotEmail}
                            onChange={(e) => setForgotEmail(e.target.value)}
                            placeholder="Enter email"
                            type="email"
                        />
                        {forgotMsg && <p style={{ color: forgotMsg.includes('Error') ? 'red' : 'green', fontSize: '0.9rem', margin: '8px 0' }}>{forgotMsg}</p>}
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '16px' }}>
                            <button onClick={() => setShowForgotModal(false)} style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid #D1D5DB' }}>Cancel</button>
                            <button onClick={handleForgotPassword} style={{ padding: '8px 16px', borderRadius: '6px', backgroundColor: 'var(--color-primary)', color: 'white', border: 'none' }}>Send</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const socialBtnStyle = {
    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px',
    border: '1px solid #D1D5DB', borderRadius: 'var(--radius-md)', backgroundColor: 'white',
    color: '#374151', cursor: 'pointer', fontWeight: 500
};

export default Login;
