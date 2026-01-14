import { z } from 'zod';

// Email validation schema
export const emailSchema = z.string()
    .email('Invalid email address')
    .min(5, 'Email must be at least 5 characters')
    .max(255, 'Email must not exceed 255 characters');

// Password validation schema
export const passwordSchema = z.string()
    .min(12, 'Password must be at least 12 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

// Phone number validation (international format)
export const phoneSchema = z.string()
    .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format (use international format: +1234567890)');

// URL validation schema
export const urlSchema = z.string()
    .url('Invalid URL format')
    .max(2048, 'URL must not exceed 2048 characters');

// Name validation schema
export const nameSchema = z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must not exceed 100 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'Name can only contain letters, spaces, hyphens, and apostrophes');

// File upload validation
export const fileSchema = z.object({
    name: z.string(),
    size: z.number().max(10 * 1024 * 1024, 'File size must not exceed 10MB'),
    type: z.string().refine(
        (type) => ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'].includes(type),
        'Invalid file type. Allowed: JPEG, PNG, GIF, WebP, PDF'
    ),
});

// Image file validation
export const imageSchema = z.object({
    name: z.string(),
    size: z.number().max(5 * 1024 * 1024, 'Image size must not exceed 5MB'),
    type: z.string().refine(
        (type) => ['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(type),
        'Invalid image type. Allowed: JPEG, PNG, GIF, WebP'
    ),
});

// Audio file validation
export const audioSchema = z.object({
    name: z.string(),
    size: z.number().max(50 * 1024 * 1024, 'Audio file must not exceed 50MB'),
    type: z.string().refine(
        (type) => ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg'].includes(type),
        'Invalid audio type. Allowed: MP3, WAV, OGG'
    ),
});

// Video file validation
export const videoSchema = z.object({
    name: z.string(),
    size: z.number().max(100 * 1024 * 1024, 'Video file must not exceed 100MB'),
    type: z.string().refine(
        (type) => ['video/mp4', 'video/webm', 'video/ogg'].includes(type),
        'Invalid video type. Allowed: MP4, WebM, OGG'
    ),
});

/**
 * Validate email
 * @param {string} email - Email to validate
 * @returns {Object} - { success: boolean, error?: string }
 */
export const validateEmail = (email) => {
    try {
        emailSchema.parse(email);
        return { success: true };
    } catch (error) {
        return { success: false, error: error.errors[0].message };
    }
};

/**
 * Validate password
 * @param {string} password - Password to validate
 * @returns {Object} - { success: boolean, error?: string }
 */
export const validatePassword = (password) => {
    try {
        passwordSchema.parse(password);
        return { success: true };
    } catch (error) {
        return { success: false, error: error.errors[0].message };
    }
};

/**
 * Validate phone number
 * @param {string} phone - Phone number to validate
 * @returns {Object} - { success: boolean, error?: string }
 */
export const validatePhone = (phone) => {
    try {
        phoneSchema.parse(phone);
        return { success: true };
    } catch (error) {
        return { success: false, error: error.errors[0].message };
    }
};

/**
 * Validate URL
 * @param {string} url - URL to validate
 * @returns {Object} - { success: boolean, error?: string }
 */
export const validateURL = (url) => {
    try {
        urlSchema.parse(url);
        return { success: true };
    } catch (error) {
        return { success: false, error: error.errors[0].message };
    }
};

/**
 * Validate file upload
 * @param {File} file - File object to validate
 * @returns {Object} - { success: boolean, error?: string }
 */
export const validateFile = (file) => {
    try {
        fileSchema.parse({
            name: file.name,
            size: file.size,
            type: file.type,
        });
        return { success: true };
    } catch (error) {
        return { success: false, error: error.errors[0].message };
    }
};

/**
 * Calculate password strength
 * @param {string} password - Password to check
 * @returns {Object} - { strength: 'weak'|'medium'|'strong'|'very-strong', score: 0-4 }
 */
export const calculatePasswordStrength = (password) => {
    let score = 0;

    if (!password) return { strength: 'weak', score: 0 };

    // Length check
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;

    // Character variety checks
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    // Determine strength
    if (score <= 1) return { strength: 'weak', score };
    if (score === 2) return { strength: 'medium', score };
    if (score === 3 || score === 4) return { strength: 'strong', score };
    return { strength: 'very-strong', score };
};
