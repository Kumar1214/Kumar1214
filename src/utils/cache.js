/**
 * Simple in-memory cache with TTL support
 */
class Cache {
    constructor() {
        this.cache = new Map();
        this.timers = new Map();
    }

    /**
     * Set a value in cache with optional TTL
     * @param {string} key - Cache key
     * @param {any} value - Value to cache
     * @param {number} ttl - Time to live in seconds (default: 300 = 5 minutes)
     */
    set(key, value, ttl = 300) {
        // Clear existing timer if any
        if (this.timers.has(key)) {
            clearTimeout(this.timers.get(key));
        }

        // Set value
        this.cache.set(key, {
            value,
            timestamp: Date.now(),
            ttl: ttl * 1000, // Convert to milliseconds
        });

        // Set expiration timer
        const timer = setTimeout(() => {
            this.delete(key);
        }, ttl * 1000);

        this.timers.set(key, timer);
    }

    /**
     * Get a value from cache
     * @param {string} key - Cache key
     * @returns {any} - Cached value or null if not found/expired
     */
    get(key) {
        const item = this.cache.get(key);

        if (!item) return null;

        // Check if expired
        const now = Date.now();
        if (now - item.timestamp > item.ttl) {
            this.delete(key);
            return null;
        }

        return item.value;
    }

    /**
     * Check if key exists in cache
     * @param {string} key - Cache key
     * @returns {boolean}
     */
    has(key) {
        return this.get(key) !== null;
    }

    /**
     * Delete a key from cache
     * @param {string} key - Cache key
     */
    delete(key) {
        if (this.timers.has(key)) {
            clearTimeout(this.timers.get(key));
            this.timers.delete(key);
        }
        this.cache.delete(key);
    }

    /**
     * Clear all cache
     */
    clear() {
        // Clear all timers
        this.timers.forEach((timer) => clearTimeout(timer));
        this.timers.clear();
        this.cache.clear();
    }

    /**
     * Get cache size
     * @returns {number}
     */
    size() {
        return this.cache.size;
    }

    /**
     * Get all keys
     * @returns {string[]}
     */
    keys() {
        return Array.from(this.cache.keys());
    }
}

// Create singleton instance
const cache = new Cache();

/**
 * Cache wrapper for async functions
 * @param {string} key - Cache key
 * @param {Function} fn - Async function to execute if cache miss
 * @param {number} ttl - Time to live in seconds
 * @returns {Promise<any>}
 */
export const cachedFetch = async (key, fn, ttl = 300) => {
    // Check cache first
    const cached = cache.get(key);
    if (cached !== null) {
        console.log(`✅ Cache HIT: ${key}`);
        return cached;
    }

    console.log(`❌ Cache MISS: ${key}`);

    // Execute function and cache result
    try {
        const result = await fn();
        cache.set(key, result, ttl);
        return result;
    } catch (error) {
        console.error(`Cache fetch error for key ${key}:`, error);
        throw error;
    }
};

/**
 * Invalidate cache by key or pattern
 * @param {string|RegExp} keyOrPattern - Key or pattern to match
 */
export const invalidateCache = (keyOrPattern) => {
    if (typeof keyOrPattern === 'string') {
        cache.delete(keyOrPattern);
        console.log(`🗑️ Cache invalidated: ${keyOrPattern}`);
    } else if (keyOrPattern instanceof RegExp) {
        const keys = cache.keys();
        keys.forEach((key) => {
            if (keyOrPattern.test(key)) {
                cache.delete(key);
                console.log(`🗑️ Cache invalidated: ${key}`);
            }
        });
    }
};

/**
 * Clear all cache
 */
export const clearCache = () => {
    cache.clear();
    console.log('🗑️ All cache cleared');
};

export default cache;
