// Color Theme for Gaugyan Application
// Based on logo analysis - Primary color: Orange/Saffron (#F97316)

export const colors = {
    // Primary Colors (Deep Blue - Main Branding)
    primary: {
        50: '#E6F0F7',
        100: '#CDDDEF',
        200: '#9BBDDF',
        300: '#699CCF',
        400: '#377ABC',
        500: '#004E7C', // Main primary color (matches logo)
        600: '#003D61',
        700: '#002C46',
        800: '#001B2B',
        900: '#000A10',
    },

    // Secondary Colors (Saffron/Orange - Spiritual accent)
    secondary: {
        50: '#FFF4E6',
        100: '#FFE9CC',
        200: '#FFD399',
        300: '#FFBD66',
        400: '#FFA733',
        500: '#FF6F00', // Saffron/Orange - Highlights, Accents
        600: '#CC5900',
        700: '#994300',
        800: '#662C00',
        900: '#331600',
    },

    // Accent Colors (Green - Success, Eco-friendly elements)
    accent: {
        50: '#E8F5E9',
        100: '#C8E6C9',
        200: '#A5D6A7',
        300: '#81C784',
        400: '#66BB6A',
        500: '#4CAF50', // Green - Success, Eco-friendly elements
        600: '#43A047',
        700: '#388E3C',
        800: '#2E7D32',
        900: '#1B5E20',
    },

    // Neutral Colors (grays for text and backgrounds)
    neutral: {
        50: '#F9FAFB',
        100: '#F3F4F6',
        200: '#E5E7EB',
        300: '#D1D5DB',
        400: '#9CA3AF',
        500: '#6B7280',
        600: '#4B5563',
        700: '#374151',
        800: '#1F2937',
        900: '#111827',
    },

    // Semantic Colors
    success: {
        light: '#D1FAE5',
        main: '#10B981',
        dark: '#065F46',
    },
    error: {
        light: '#FEE2E2',
        main: '#EF4444',
        dark: '#991B1B',
    },
    warning: {
        light: '#FEF3C7',
        main: '#F59E0B',
        dark: '#92400E',
    },
    info: {
        light: '#DBEAFE',
        main: '#3B82F6',
        dark: '#1E40AF',
    },

    // Background Colors
    background: {
        default: '#FFF9E8', // Light Cream - Main Background (matches mobile)
        paper: '#FFFFFF', // Cards, Modals (matches mobile)
        dark: '#111827',
    },

    // Text Colors
    text: {
        primary: '#111827',
        secondary: '#6B7280',
        disabled: '#9CA3AF',
        inverse: '#FFFFFF',
    },
};

// Spacing system
export const spacing = {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    '2xl': '48px',
    '3xl': '64px',
};

// Border radius
export const borderRadius = {
    none: '0',
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    full: '9999px',
};

// Shadows
export const shadows = {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
};

// Typography
export const typography = {
    fontFamily: {
        sans: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        serif: 'Georgia, Cambria, "Times New Roman", Times, serif',
        mono: 'Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    },
    fontSize: {
        xs: '0.75rem',    // 12px
        sm: '0.875rem',   // 14px
        base: '1rem',     // 16px
        lg: '1.125rem',   // 18px
        xl: '1.25rem',    // 20px
        '2xl': '1.5rem',  // 24px
        '3xl': '1.875rem',// 30px
        '4xl': '2.25rem', // 36px
        '5xl': '3rem',    // 48px
    },
    fontWeight: {
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
        extrabold: 800,
    },
};

// Breakpoints
export const breakpoints = {
    xs: '320px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
};

// Export default theme object
const theme = {
    colors,
    spacing,
    borderRadius,
    shadows,
    typography,
    breakpoints,
};

export default theme;
