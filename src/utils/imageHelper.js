export const getImageUrl = (path) => {
    if (!path) return 'https://via.placeholder.com/300';
    if (path.startsWith('http') || path.startsWith('blob:') || path.startsWith('data:')) return path;

    // Handle JSON stringified arrays (common in some DB storage)
    if (path.startsWith('[')) {
        try {
            const parsed = JSON.parse(path);
            if (Array.isArray(parsed) && parsed.length > 0) {
                // Recursively call for the first image in array
                return getImageUrl(parsed[0]);
            }
        } catch (e) {
            console.warn('Failed to parse image path:', path);
            return 'https://via.placeholder.com/300';
        }
    }

    // 1. Normalize slashes (Windows fix)
    let cleanPath = path.replace(/\\/g, '/');

    // 2. Ensure leading slash
    cleanPath = cleanPath.startsWith('/') ? cleanPath : `/${cleanPath}`;

    // 4. Determine Base URL - Use env var or default to relative path/empty if not set
    // We need to handle the case where VITE_API_URL includes '/api' but static files are at root '/uploads'
    let apiBase = import.meta.env.VITE_API_URL || 'https://api.gaugyanworld.org';

    // Strip trailing /api if present, because uploads are usually served from root, not /api/uploads
    if (apiBase.endsWith('/api')) {
        apiBase = apiBase.slice(0, -4);
    }
    if (apiBase.endsWith('/api/')) {
        apiBase = apiBase.slice(0, -5);
    }

    // If path already contains the API URL (duplicate prefix fix), return it as is.
    if (apiBase && cleanPath.startsWith(apiBase)) return cleanPath;

    return `${apiBase}${cleanPath}`;
};
