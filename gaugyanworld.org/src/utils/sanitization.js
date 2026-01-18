import DOMPurify from 'dompurify';

/**
 * Sanitize HTML content to prevent XSS attacks
 * @param {string} dirty - Unsanitized HTML string
 * @param {Object} config - DOMPurify configuration options
 * @returns {string} - Sanitized HTML string
 */
export const sanitizeHTML = (dirty, config = {}) => {
    const defaultConfig = {
        ALLOWED_TAGS: [
            'b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li',
            'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'code', 'pre'
        ],
        ALLOWED_ATTR: ['href', 'title', 'target', 'rel'],
        ALLOW_DATA_ATTR: false,
    };

    return DOMPurify.sanitize(dirty, { ...defaultConfig, ...config });
};

/**
 * Sanitize user input (text only, no HTML)
 * @param {string} input - User input string
 * @returns {string} - Sanitized string
 */
export const sanitizeText = (input) => {
    if (typeof input !== 'string') return '';

    // Remove all HTML tags
    return DOMPurify.sanitize(input, { ALLOWED_TAGS: [] });
};

/**
 * Encode HTML entities
 * @param {string} str - String to encode
 * @returns {string} - Encoded string
 */
export const encodeHTML = (str) => {
    if (typeof str !== 'string') return '';

    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
};

/**
 * Decode HTML entities
 * @param {string} str - String to decode
 * @returns {string} - Decoded string
 */
export const decodeHTML = (str) => {
    if (typeof str !== 'string') return '';

    const div = document.createElement('div');
    div.innerHTML = str;
    return div.textContent || div.innerText || '';
};

/**
 * Sanitize URL to prevent javascript: and data: URLs
 * @param {string} url - URL to sanitize
 * @returns {string} - Sanitized URL or empty string if invalid
 */
export const sanitizeURL = (url) => {
    if (!url || typeof url !== 'string') return '';

    const trimmedURL = url.trim().toLowerCase();

    // Block dangerous protocols
    if (
        trimmedURL.startsWith('javascript:') ||
        trimmedURL.startsWith('data:') ||
        trimmedURL.startsWith('vbscript:')
    ) {
        return '';
    }

    return url.trim();
};

/**
 * Sanitize filename to prevent path traversal
 * @param {string} filename - Filename to sanitize
 * @returns {string} - Sanitized filename
 */
export const sanitizeFilename = (filename) => {
    if (!filename || typeof filename !== 'string') return '';

    // Remove path separators and special characters
    return filename
        .replace(/[\/\\]/g, '')
        .replace(/[^a-zA-Z0-9._-]/g, '_')
        .substring(0, 255); // Limit length
};
