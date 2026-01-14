import api from '../utils/api';

/*
    Refactored to use the unified API instance from utils/api.js
    This ensures token refresh logic and consistent error handling across the app.
*/

export const authService = {
    login: async (credentials) => {
        const response = await api.post('/v1/auth/login', credentials);
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
        }
        return response.data;
    },
    register: async (userData) => {
        const response = await api.post('/v1/auth/register', userData);
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
        }
        return response.data;
    },
    logout: () => {
        localStorage.removeItem('token');
    },
    getCurrentUser: async () => {
        const response = await api.get('/v1/auth/me');
        return response.data;
    }
};

export const contentService = {
    // Music
    getMusic: (params) => api.get('/music', { params }),
    getMusicById: (id) => api.get(`/music/${id}`),

    // Podcasts
    getPodcasts: (params) => api.get('/podcasts', { params }),
    getPodcastById: (id) => api.get(`/podcasts/${id}`),

    // Meditation
    getMeditations: (params) => api.get('/meditation', { params }),
    getMeditationById: (id) => api.get(`/meditation/${id}`),

    // News
    getNews: (params) => api.get('/news', { params }),
    getNewsById: (id) => api.get(`/news/${id}`),

    // Gaushalas
    getGaushalas: (params) => api.get('/gaushalas', { params }),
    getGaushalaById: (id) => api.get(`/gaushalas/${id}`),

    // Knowledgebase
    getArticles: (params) => api.get('/v1/content/knowledgebase', { params }),
    getArticleById: (id) => api.get(`/v1/content/knowledgebase/${id}`),

    // Knowledgebase Categories
    getKnowledgebaseCategories: () => api.get('/knowledgebase-categories'),
    createKnowledgebaseCategory: (data) => api.post('/knowledgebase-categories', data),
    updateKnowledgebaseCategory: (id, data) => api.put(`/knowledgebase-categories/${id}`, data),
    deleteKnowledgebaseCategory: (id) => api.delete(`/knowledgebase-categories/${id}`),

    // News Categories
    getNewsCategories: () => api.get('/news-categories'),
    createNewsCategory: (data) => api.post('/news-categories', data),
    updateNewsCategory: (id, data) => api.put(`/news-categories/${id}`, data),
    deleteNewsCategory: (id) => api.delete(`/news-categories/${id}`),

    // Commerce (Shop)
    getProducts: (params) => api.get('/products', { params }),
    getProductById: (id) => api.get(`/products/${id}`),
    createProduct: (data) => api.post('/products', data),
    updateProduct: (id, data) => api.put(`/products/${id}`, data),
    deleteProduct: (id) => api.delete(`/products/${id}`),
    getOrders: (params) => api.get('/orders', { params }),
    getOrderById: (id) => api.get(`/orders/${id}`),
    createOrder: (data) => api.post('/orders', data),

    getProductCategories: () => api.get('/marketplace/categories'),
    createProductCategory: (data) => api.post('/marketplace/categories', data),
    updateProductCategory: (id, data) => api.put(`/marketplace/categories/${id}`, data),
    deleteProductCategory: (id) => api.delete(`/marketplace/categories/${id}`),

    // Finance (Payouts, Commissions, Refunds)
    getPayouts: (params) => api.get('/finance/payouts', { params }),
    updatePayoutStatus: (id, status) => api.put(`/finance/payouts/${id}`, { status }),
    deletePayout: (id) => api.delete(`/finance/payouts/${id}`),

    getCommissions: (params) => api.get('/finance/commissions', { params }),
    updateCommission: (id, rate) => api.put(`/finance/commissions/${id}`, { rate }),

    getRefunds: (params) => api.get('/finance/refunds', { params }),
    updateRefundStatus: (id, status) => api.put(`/finance/refunds/${id}/status`, { status }),

    // Vendors - REMOVED LEGACY ROUTES to avoid conflict with Plugin Routes
    // getVendors: (params) => api.get('/vendors', { params }),
    // createVendor: (data) => api.post('/vendors', data),
    // updateVendorStatus: (id, status) => api.put(`/vendors/${id}/status`, { status }),




    // LMS (Courses, Exams, Quizzes)
    getCourses: (params) => api.get('/courses', { params }),
    getCourseById: (id) => api.get(`/courses/${id}`),
    createCourse: (data) => api.post('/courses', data),
    updateCourse: (id, data) => api.put(`/courses/${id}`, data),
    deleteCourse: (id) => api.delete(`/courses/${id}`),

    getExams: (params) => api.get('/exams', { params }),
    getExamById: (id) => api.get(`/exams/${id}`),
    createExam: (data) => api.post('/exams', data),
    updateExam: (id, data) => api.put(`/exams/${id}`, data),
    deleteExam: (id) => api.delete(`/exams/${id}`),

    getQuizzes: (params) => api.get('/quizzes', { params }),
    getQuizById: (id) => api.get(`/quizzes/${id}`),
    createQuiz: (data) => api.post('/quizzes', data),
    updateQuiz: (id, data) => api.put(`/quizzes/${id}`, data),
    deleteQuiz: (id) => api.delete(`/quizzes/${id}`),

    // Course Categories (Added)
    getCourseCategories: () => api.get('/course-categories'),
    createCourseCategory: (data) => api.post('/course-categories', data),
    updateCourseCategory: (id, data) => api.put(`/course-categories/${id}`, data),
    deleteCourseCategory: (id) => api.delete(`/course-categories/${id}`),

    // Vendors (Plugin Integration)
    getVendors: (params) => api.get('/vendor/list', { params }),
    createVendor: (data) => api.post('/vendor/admin/create', data), // Using new Admin Helper Logic
    updateVendorStatus: (id, status) => api.put(`/vendor/${id}/status`, { status }),

    // Vendor Specific (For Vendor Dashboard)
    getVendorProfile: () => api.get('/vendor/me'),
    getVendorProducts: () => api.get('/vendor/products'),
    getVendorOrders: () => api.get('/vendor/orders')
};

export const pluginService = {
    getAll: () => api.get('/system/plugins'),
    toggle: (slug, active) => api.put(`/system/plugins/${slug}/toggle`, { active })
};

export const entertainmentService = {
    // Music Genres
    getMusicGenres: () => api.get('/music-genres'),
    createMusicGenre: (data) => api.post('/music-genres', data),
    updateMusicGenre: (id, data) => api.put(`/music-genres/${id}`, data),
    deleteMusicGenre: (id) => api.delete(`/music-genres/${id}`),
};

export const mediaService = {
    uploadFile: async (file, folder = 'general') => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', folder);
        const response = await api.post('/media/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    },
    uploadMultipleFiles: async (files, folder = 'general') => {
        const formData = new FormData();
        Array.from(files).forEach(file => {
            formData.append('files', file);
        });
        formData.append('folder', folder);
        const response = await api.post('/media/upload-multiple', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    },
    deleteFile: (id) => api.delete(`/media/${id}`)
};

export const walletService = {
    getMyWallet: () => api.get('/v1/wallet/me'),
    addMoney: (amount) => api.post('/v1/wallet/add-money', { amount }),
    redeemCoins: (coins) => api.post('/v1/wallet/redeem', { coins }),

    // Admin
    adminTransaction: (data) => api.post('/v1/wallet/admin/transaction', data)
};

export const settingsService = {
    getSettings: (category) => api.get(`/settings/${category}`),
    updateSettings: (category, settings) => api.put(`/settings/${category}`, { settings }),
    getAllSettings: () => api.get('/settings')
};

export const certificateService = {
    verifyCertificate: (serialNumber) => api.get(`/v1/certificate/verify/${serialNumber}`),
    getSettings: () => api.get('/v1/certificate/settings'),
    saveSettings: (settings) => api.put('/v1/certificate/settings', settings), // Assuming PUT endpoint exists or needs creation
    generateSerial: (data) => api.post('/v1/certificate/generate', data)
};

export const bannerService = {
    getBanners: (params) => api.get('/banners', { params }),
    getPlacement: (placement) => api.get(`/banners/placement/${placement}`),
    createBanner: (data) => api.post('/banners', data),
    updateBanner: (id, data) => api.put(`/banners/${id}`, data),
    deleteBanner: (id) => api.delete(`/banners/${id}`),
    reorderBanners: (banners) => api.post('/banners/reorder', { banners })
};



export const userService = {
    toggleWishlist: (productId) => api.post('/users/wishlist/toggle', { productId }),
    getWishlist: () => api.get('/users/wishlist'),
    createUser: (userData) => api.post('/users', userData),
    enrollCourse: (courseId) => api.post('/users/enroll', { courseId })
};

export const feedbackService = {
    submitFeedback: (data) => api.post('/feedback', data),
    getFeedbacks: (params) => api.get('/feedback', { params }),
    updateStatus: (id, status) => api.put(`/feedback/${id}`, { status }),
    deleteFeedback: (id) => api.delete(`/feedback/${id}`)
};

export const notificationService = {
    getAll: () => api.get('/notifications'),
    markRead: (id) => api.get(`/notifications/${id}/read`),
    markAllRead: () => api.put('/notifications/read-all')
};

export default api;
