const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');

const User = require('./User');
const { protect } = require('../../shared/middleware/protect');
const { loginLimiter } = require('../../shared/middleware/security');
const { notifyAdmins } = require('../../shared/utils/notificationService');

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '2h',
    });
};

// @route   POST /api/v1/auth/login
// @desc    Auth user & get token
// @access  Public
// Uses loginLimiter to prevent brute force
router.post('/login', [loginLimiter,
    body('email').isEmail().withMessage('Please include a valid email'),
    body('password').exists().withMessage('Password is required')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
        // Check for user email
        console.log('[AUTH] Login attempt for:', email);

        const user = await User.findOne({ where: { email } });

        console.log('[AUTH] User found:', user ? user.email : 'No user');

        if (!user) {
            console.log('[AUTH] Login failed: User not found');
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            console.log('[AUTH] Login failed: Invalid password');
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = generateToken(user.id);
        console.log('[AUTH] Login successful for:', user.email);

        res.json({
            token,
            user: {
                _id: user.id, // ID compatibility
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        console.error('[AUTH] Login error:', error.message);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   POST /api/v1/auth/register
// @desc    Register user
// @access  Public
router.post('/register', [
    body('email').isEmail().withMessage('Please include a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be 6 or more characters'),
    body('firstName').not().isEmpty().withMessage('First name is required'),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, firstName, lastName, accountType } = req.body;

    try {
        let user = await User.findOne({ where: { email } });

        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Map accountType to role
        let role = 'user';
        if (accountType === 'Instructor') role = 'instructor';
        else if (accountType === 'Vendor') role = 'vendor';
        else if (accountType === 'GaushalaOwner') role = 'gaushala_owner';
        else if (accountType === 'Artist') role = 'artist';
        // SECURITY FIX: Prevent public registration as Admin
        // else if (accountType === 'Admin') role = 'admin';

        user = await User.create({
            name: `${firstName} ${lastName}`.trim(),
            email,
            password,
            role
        });

        // Notify Admins
        await notifyAdmins(
            `New User Registered: ${user.name}`,
            'info',
            { userId: user.id, email: user.email, role: user.role }
        );

        const token = generateToken(user.id);

        res.status(201).json({
            token,
            user: {
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   POST /api/v1/auth/firebase-login
// @desc    Login with Firebase (Google/Facebook)
// @access  Public
router.post('/firebase-login', async (req, res) => {
    const { idToken, provider } = req.body;

    try {
        // SECURE VERIFICATION
        const admin = require('../../shared/config/firebaseAdmin');
        let decodedToken;

        try {
            decodedToken = await admin.auth().verifyIdToken(idToken);
            console.log('[Auth] Firebase Token Verified for:', decodedToken.email);
        } catch (verifyErr) {
            console.error('[Auth] Token Verification Failed:', verifyErr.message);
            // CRITICAL: Fail if verification fails
            return res.status(401).json({ message: 'Invalid or expired token', error: verifyErr.message });
        }

        const email = decodedToken.email;
        const name = decodedToken.name || email.split('@')[0];
        const picture = decodedToken.picture;
        const uid = decodedToken.uid;

        if (!email) {
            return res.status(400).json({ message: 'Token missing email claim' });
        }

        let user = await User.findOne({ where: { email } });

        if (!user) {
            // Create user
            user = await User.create({
                name,
                email,
                password: Math.random().toString(36).slice(-16) + 'Aa1!', // Longer random password
                profilePicture: picture,
                role: 'user',
                isVerified: decodedToken.email_verified || false,
                googleId: provider === 'google' ? uid : null,
                facebookId: provider === 'facebook' ? uid : null
            });

            // Notify Admins of new user via social
            await notifyAdmins(
                `New Social User: ${user.name}`,
                'info',
                { userId: user.id, email: user.email, provider }
            );
        } else if (picture && user.profilePicture !== picture) {
            // Update existing user with latest info if needed
            // e.g., if profile pic changed
            user.profilePicture = picture;
            await user.save();
        }

        const token = generateToken(user.id);

        res.json({
            token,
            user: {
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                profilePicture: user.profilePicture
            },
        });

    } catch (e) {
        console.error("Firebase Login Error:", e);
        res.status(500).json({ message: 'Server error: ' + e.message });
    }
});

// @route   POST /api/v1/auth/mobile-login
// @desc    Login with Mobile Number (Firebase)
// @access  Public
router.post('/mobile-login', async (req, res) => {
    const { idToken, phoneNumber } = req.body;

    try {
        // SECURE VERIFICATION
        const admin = require('../../shared/config/firebaseAdmin');
        let decodedToken;

        try {
            decodedToken = await admin.auth().verifyIdToken(idToken);
        } catch (verifyErr) {
            console.error('[Auth] Mobile Token Verification Failed:', verifyErr.message);
            return res.status(401).json({ message: 'Invalid token' });
        }

        const phone = decodedToken.phone_number || phoneNumber;

        if (!phone) {
            console.log('[Mobile Auth] Token missing phone_number claim');
            return res.status(400).json({ message: 'Phone number required' });
        }

        // Ensure the token actually belongs to the phone number claimed (if passed in body)
        if (phoneNumber && decodedToken.phone_number && phoneNumber !== decodedToken.phone_number) {
            console.warn('[Security] Phone mismatch:', phoneNumber, 'vs', decodedToken.phone_number);
            return res.status(403).json({ message: 'Phone number verification mismatch' });
        }

        // Check user by mobile field logic
        let user = await User.findOne({ where: { mobile: phone } });

        // Fallback: Check if stored in email (legacy/placeholder)
        if (!user) {
            const emailPlaceholder = `${phone.replace('+', '')}@mobile.gaugyan`;
            user = await User.findOne({ where: { email: emailPlaceholder } });
        }

        if (!user) {
            // Create user
            const emailPlaceholder = `${phone.replace('+', '')}@mobile.gaugyan`;
            user = await User.create({
                name: 'Mobile User',
                email: emailPlaceholder,
                mobile: phone,
                password: Math.random().toString(36).slice(-16) + 'Aa1!',
                role: 'user',
                isVerified: true // Phone verified by Firebase
            });
        }

        const token = generateToken(user.id);

        res.json({
            token,
            user: {
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                mobile: user.mobile
            },
        });

    } catch (e) {
        console.error("Mobile Login Error:", e);
        res.status(500).json({ message: 'Server error: ' + e.message });
    }
});


// @route   POST /api/v1/auth/refresh
// @desc    Refresh access token
// @access  Public
router.post('/refresh', async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(401).json({ message: 'No refresh token' });
    }

    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);

        // Check if user still exists
        const user = await User.findByPk(decoded.id);
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        // Generate new access token
        const token = generateToken(user.id);

        res.json({
            token,
        });
    } catch (error) {
        console.error('Refresh token error:', error);
        return res.status(401).json({ message: 'Invalid refresh token' });
    }
});

// @route   POST /api/v1/auth/logout
// @desc    Logout user / Clear cookie
// @access  Private
router.post('/logout', (req, res) => {
    res.json({ message: 'Logged out' });
});

// @route   GET /api/v1/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', protect, async (req, res) => {
    try {
        // Get user from database (protect middleware sets req.user.id)
        // Exclude password
        const user = await User.findByPk(req.user.id, {
            attributes: { exclude: ['password'] }
        });

        if (!user) {
            return res.status(401).json({ success: false, message: 'User not found' });
        }

        // Convert to plain object and add _id for compatibility
        const userData = user.toJSON();
        userData._id = user.id;

        res.status(200).json({
            success: true,
            data: userData
        });
    } catch (error) {
        console.error('Get me error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @route   GET /api/v1/auth/facebook
// @desc    Redirect to Facebook OAuth
// @access  Public
router.get('/facebook', (req, res) => {
    const appId = '1014311170752989';
    const redirectUri = `${process.env.API_URL || 'https://api.gaugyanworld.org/api'}/v1/auth/facebook/callback`;
    const scope = 'email,public_profile';

    // State param is good practice for security but skipped for simplicity in manual flow unless needed
    const url = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${appId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}&response_type=code`;

    res.redirect(url);
});

// @route   GET /api/v1/auth/facebook/callback
// @desc    Facebook OAuth Callback
// @access  Public
router.get('/facebook/callback', async (req, res) => {
    const { code, error } = req.query;
    const axios = require('axios');

    const clientUrl = process.env.CLIENT_URL ? process.env.CLIENT_URL.split(',')[0] : 'https://gaugyanworld.org';
    if (error) {
        return res.redirect(`${clientUrl}/login?error=FacebookLoginFailed`);
    }

    if (!code) {
        return res.redirect(`${clientUrl}/login?error=NoCode`);
    }

    try {
        const appId = '1014311170752989';
        const appSecret = '57171f54e04d20c1744ec332b585d56f';
        const redirectUri = `${process.env.API_URL || 'https://api.gaugyanworld.org/api'}/v1/auth/facebook/callback`;

        // 1. Exchange Code for Token
        const tokenRes = await axios.get('https://graph.facebook.com/v18.0/oauth/access_token', {
            params: {
                client_id: appId,
                client_secret: appSecret,
                redirect_uri: redirectUri,
                code: code
            }
        });

        const { access_token } = tokenRes.data;

        // 2. Get User Info
        const userRes = await axios.get('https://graph.facebook.com/me', {
            params: {
                fields: 'id,name,email,picture',
                access_token: access_token
            }
        });

        const fbUser = userRes.data;
        const email = fbUser.email || `${fbUser.id}@facebook.gaugyan.com`; // Fallback if no email
        const name = fbUser.name;
        const picture = fbUser.picture?.data?.url;

        // 3. Find or Create User
        let user = await User.findOne({ where: { email } });

        if (!user) {
            user = await User.create({
                name,
                email,
                password: Math.random().toString(36).slice(-8) + 'Fb!', // Random secure-ish password
                role: 'user',
                profilePicture: picture,
                isVerified: true
            });
            console.log(`[Facebook Auth] Created new user: ${email}`);
        } else {
            console.log(`[Facebook Auth] Logged in existing user: ${email}`);
        }

        // 4. Generate Token & Redirect
        const token = generateToken(user.id);

        // Redirect to Frontend with Token
        res.redirect(`${clientUrl}/login?token=${token}`);

    } catch (err) {
        console.error('Facebook Auth Error:', err.response?.data || err.message);
        res.redirect(`${clientUrl}/login?error=AuthFailed`);
    }
});

module.exports = router;
