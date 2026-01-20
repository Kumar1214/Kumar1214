import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../config/firebase';
import {
    signInWithPopup,
    GoogleAuthProvider,
    FacebookAuthProvider,
    signOut,
    sendPasswordResetEmail,
    RecaptchaVerifier,
    signInWithPhoneNumber
} from 'firebase/auth';
import api from '../services/api';
import { hasPermission, hasRole, hasAnyRole } from '../utils/permissions';

const AuthContext = createContext({
    user: null,
    loading: true,
    login: async () => { },
    signup: async () => { },
    logout: async () => { },
    hasRole: () => false,
    hasPermission: () => false
});

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [backendUser, setBackendUser] = useState(null);

    // Initialize user from localStorage
    useEffect(() => {
        console.error("AuthProvider: useEffect starting");
        try {
            const token = localStorage.getItem('token');
            const savedUser = localStorage.getItem('user');

            if (token && savedUser) {
                try {
                    const user = JSON.parse(savedUser);
                    setBackendUser(user);
                    setCurrentUser(user);
                    console.error("AuthProvider: User restored from localStorage");
                } catch (error) {
                    console.error('Error parsing saved user:', error);
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                }
            }
        } catch (e) {
            console.error("AuthProvider: localStorage access failed", e);
        } finally {
            setLoading(false);
            console.error("AuthProvider: setLoading(false) called");
        }
    }, []);

    // Backend API login
    const loginWithBackend = async (email, password) => {
        try {
            const response = await api.post('/v1/auth/login', { email, password });
            const { token, refreshToken, user } = response.data;

            // Store tokens and user
            localStorage.setItem('token', token);
            if (refreshToken) {
                localStorage.setItem('refreshToken', refreshToken);
            }
            localStorage.setItem('user', JSON.stringify(user));

            setBackendUser(user);
            setCurrentUser(user);

            return user;
        } catch (error) {
            throw new Error(error.message || 'Login failed');
        }
    };

    // Backend API signup
    const signupWithBackend = async (email, password, name, accountType = 'Learner') => {
        try {
            const response = await api.post('/v1/auth/register', {
                email,
                password,
                firstName: name.split(' ')[0] || name,
                lastName: name.split(' ')[1] || '',
                accountType
            });

            const { token, refreshToken, user } = response.data;

            localStorage.setItem('token', token);
            if (refreshToken) {
                localStorage.setItem('refreshToken', refreshToken);
            }
            localStorage.setItem('user', JSON.stringify(user));

            setBackendUser(user);
            setCurrentUser(user);

            return user;
        } catch (error) {
            throw new Error(error.message || 'Signup failed');
        }
    };

    // Generic Firebase Token Verification (Used by both Popup and Redirect flows)
    const verifyFirebaseToken = async (idToken, provider) => {
        try {
            const response = await api.post('/v1/auth/firebase-login', {
                idToken,
                provider
            });

            const { token, refreshToken, user } = response.data;

            localStorage.setItem('token', token);
            if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
            localStorage.setItem('user', JSON.stringify(user));

            setBackendUser(user);
            setCurrentUser(user);

            return user;
        } catch (error) {
            console.error(`${provider} verification failed:`, error);
            throw new Error(error.message || `${provider} login failed`);
        }
    };

    // Firebase Google login
    const loginWithGoogle = async () => {
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            const firebaseUser = result.user;
            const idToken = await firebaseUser.getIdToken();
            return await verifyFirebaseToken(idToken, 'google');
        } catch (error) {
            throw new Error(error.message || 'Google login failed');
        }
    };

    // Firebase Facebook login
    const loginWithFacebook = async () => {
        try {
            const provider = new FacebookAuthProvider();
            const result = await signInWithPopup(auth, provider);
            const firebaseUser = result.user;
            const idToken = await firebaseUser.getIdToken();
            return await verifyFirebaseToken(idToken, 'facebook');
        } catch (error) {
            throw new Error(error.message || 'Facebook login failed');
        }
    };

    // Unified login function (tries backend first, falls back to Firebase)
    const login = async (email, password) => {
        return loginWithBackend(email, password);
    };

    // Unified signup function
    const signup = async (email, password, name, accountType) => {
        return signupWithBackend(email, password, name, accountType);
    };

    // Logout
    const logout = async () => {
        try {
            // Call backend logout if needed
            if (backendUser) {
                try {
                    await api.post('/v1/auth/logout');
                } catch (error) {
                    console.error('Backend logout error:', error);
                }
            }

            // Sign out from Firebase
            try {
                await signOut(auth);
            } catch (error) {
                console.error('Firebase logout error:', error);
            }

            // Clear local storage
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');

            setCurrentUser(null);
            setBackendUser(null);
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    // Password reset
    const resetPassword = (email) => {
        return sendPasswordResetEmail(auth, email);
    };

    // Update user profile
    const updateUserProfile = async (updates) => {
        try {
            const response = await api.put('/v1/auth/profile', updates);
            const updatedUser = response.data.user;

            localStorage.setItem('user', JSON.stringify(updatedUser));
            setBackendUser(updatedUser);
            setCurrentUser(updatedUser);

            return updatedUser;
        } catch (error) {
            throw new Error(error.message || 'Profile update failed');
        }
    };

    // Permission checking utilities
    const checkPermission = (permission) => {
        return hasPermission(currentUser, permission);
    };

    const checkRole = (role) => {
        return hasRole(currentUser, role);
    };

    const checkAnyRole = (roles) => {
        return hasAnyRole(currentUser, roles);
    };

    // Role checking shortcuts
    const isAdmin = () => checkRole('Admin');
    const isInstructor = () => checkRole('Instructor');
    const isVendor = () => checkRole('Vendor');
    const isArtist = () => checkRole('Artist');
    const isEditor = () => checkRole('Editor');
    const isGaushalaOwner = () => checkRole('GaushalaOwner');

    // Enroll in course
    const enrollCourse = async (courseId) => {
        try {
            const response = await api.post('/users/enroll', { courseId });
            const enrolledCourses = response.data;

            // Update local user state
            const updatedUser = { ...currentUser, enrolledCourses };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setBackendUser(updatedUser);
            setCurrentUser(updatedUser);

            return updatedUser;
        } catch (error) {
            throw new Error(error.message || 'Enrollment failed');
        }
    };

    // Check if enrolled
    const isEnrolled = (courseId) => {
        if (!currentUser || !currentUser.enrolledCourses) return false;
        return currentUser.enrolledCourses.some(c => c.courseId == courseId);
    };

    // Update progress
    const updateCourseProgress = async (courseId, lectureId, totalLectures) => {
        try {
            const response = await api.post('/users/progress', { courseId, lectureId, totalLectures });
            const enrolledCourses = response.data;

            // Update local user state
            const updatedUser = { ...currentUser, enrolledCourses };
            localStorage.setItem('user', JSON.stringify(updatedUser)); // Persist
            setCurrentUser(updatedUser); // Update State
            return updatedUser;
        } catch (error) {
            console.error("Progress update failed:", error);
            // Don't throw, just log usage? Or throw?
            // Throw so UI can revert if needed
            throw error;
        }
    };

    // Mobile Auth (Firebase)
    const setupRecaptcha = (elementId) => {
        if (window.recaptchaVerifier) {
            try {
                window.recaptchaVerifier.clear();
            } catch (error) {
                console.warn("Failed to clear old recaptcha", error);
            }
            window.recaptchaVerifier = null;
        }

        window.recaptchaVerifier = new RecaptchaVerifier(auth, elementId, {
            'size': 'invisible',
            'callback': (response) => {
                // reCAPTCHA solved, allow signInWithPhoneNumber.
            }
        });
    };

    const sendOtp = async (phoneNumber, appVerifier) => {
        try {
            const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
            window.confirmationResult = confirmationResult;
            return confirmationResult;
        } catch (error) {
            throw new Error(error.message || 'Failed to send OTP');
        }
    };

    const verifyOtp = async (otp) => {
        try {
            const result = await window.confirmationResult.confirm(otp);
            const user = result.user;
            const idToken = await user.getIdToken();

            // Backend verification
            const response = await api.post('/v1/auth/mobile-login', {
                idToken,
                phoneNumber: user.phoneNumber
            });

            const { token, refreshToken, user: backendUserResponse } = response.data;

            localStorage.setItem('token', token);
            if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
            localStorage.setItem('user', JSON.stringify(backendUserResponse));

            setBackendUser(backendUserResponse);
            setCurrentUser(backendUserResponse);

            return backendUserResponse;
        } catch (error) {
            throw new Error(error.message || 'OTP verification failed');
        }
    };

    const value = {
        user: currentUser,
        currentUser,
        backendUser,
        loading,

        // Auth functions
        login,
        signup,
        logout,
        loginWithGoogle,
        loginWithFacebook,
        verifyFirebaseToken, // Added
        setupRecaptcha, // Added
        sendOtp, // Added
        verifyOtp, // Added
        resetPassword,
        updateUserProfile,
        enrollCourse,
        isEnrolled,
        updateCourseProgress,

        // Permission & role checking
        hasPermission: checkPermission,
        hasRole: checkRole,
        hasAnyRole: checkAnyRole,
        isAdmin,
        isInstructor,
        isVendor,
        isArtist,
        isEditor,
        isGaushalaOwner,

        // Firebase auth instance
        auth
    };

    // Provide a visible loading state to prevent blank screens
    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                width: '100vw',
                backgroundColor: '#fff',
                color: '#333',
                flexDirection: 'column',
                gap: '20px'
            }}>
                <div style={{
                    width: '50px',
                    height: '50px',
                    border: '5px solid #f3f3f3',
                    borderTop: '5px solid #FFB347',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                }}></div>
                <h2>Initializing Application...</h2>
                <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
            </div>
        );
    }

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
