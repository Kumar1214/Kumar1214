// Cache TTL configuration (in seconds)
export const CACHE_TTL = {
    // Content caching
    music: 300, // 5 minutes
    podcasts: 300,
    meditation: 300,
    courses: 600, // 10 minutes
    products: 300,
    news: 300,
    knowledgebase: 600,
    gaushala: 600,

    // User data
    userProfile: 1800, // 30 minutes
    userPreferences: 3600, // 1 hour

    // Static content
    categories: 3600,
    tags: 3600,
    settings: 3600,

    // Analytics
    analytics: 300,

    // Search results
    search: 180, // 3 minutes
};

// Cache key generators
export const CACHE_KEYS = {
    // Music
    musicList: () => 'music:list',
    musicDetail: (id) => `music:detail:${id}`,
    musicByGenre: (genre) => `music:genre:${genre}`,
    musicByMood: (mood) => `music:mood:${mood}`,

    // Courses
    courseList: () => 'courses:list',
    courseDetail: (id) => `courses:detail:${id}`,
    coursesByCategory: (category) => `courses:category:${category}`,

    // Products
    productList: () => 'products:list',
    productDetail: (id) => `products:detail:${id}`,
    productsByCategory: (category) => `products:category:${category}`,

    // Podcasts
    podcastList: () => 'podcasts:list',
    podcastDetail: (id) => `podcasts:detail:${id}`,

    // Meditation
    meditationList: () => 'meditation:list',
    meditationDetail: (id) => `meditation:detail:${id}`,

    // News
    newsList: () => 'news:list',
    newsDetail: (id) => `news:detail:${id}`,

    // Knowledgebase
    knowledgebaseList: () => 'knowledgebase:list',
    knowledgebaseDetail: (id) => `knowledgebase:detail:${id}`,

    // User
    userProfile: (userId) => `user:profile:${userId}`,
    userOrders: (userId) => `user:orders:${userId}`,
    userWishlist: (userId) => `user:wishlist:${userId}`,

    // Search
    search: (query, type) => `search:${type}:${query}`,
};

// Cache invalidation patterns
export const CACHE_PATTERNS = {
    allMusic: /^music:/,
    allCourses: /^courses:/,
    allProducts: /^products:/,
    allPodcasts: /^podcasts:/,
    allMeditation: /^meditation:/,
    allNews: /^news:/,
    allKnowledgebase: /^knowledgebase:/,
    allUser: /^user:/,
    allSearch: /^search:/,
};
