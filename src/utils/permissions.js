// Permission constants (mirror backend permissions)
export const PERMISSIONS = {
    MANAGE_USERS: "manage_users",
    CREATE_COURSES: "create_courses",
    EDIT_COURSES: "edit_courses",
    DELETE_COURSES: "delete_courses",
    ENROLL_COURSES: "enroll_courses",
    UPLOAD_ART: "upload_art",
    SELL_ON_MARKETPLACE: "sell_on_marketplace",
    PUBLISH_NEWS: "publish_news",
    EDIT_NEWS: "edit_news",
    DELETE_NEWS: "delete_news",

    // Ecommerce
    ADD_PRODUCT: "add_product",
    UPDATE_PRODUCT: "update_product",
    DELETE_PRODUCT: "delete_product",
    MANAGE_INVENTORY: "manage_inventory",
    VIEW_VENDOR_DASHBOARD: "view_vendor_dashboard",
    VIEW_ORDERS: "view_orders",
    ACCEPT_ORDERS: "accept_orders",
    PROCESS_REFUND: "process_refund",
    UPDATE_DELIVERY_STATUS: "update_delivery_status",

    MANAGE_PAYMENTS: "manage_payments",
    MANAGE_PROMO_CODE: "manage_promo_code",
    MANAGE_WITHDRAWALS: "manage_withdrawals",

    // Music & Media
    UPLOAD_MUSIC: "upload_music",
    EDIT_MUSIC: "edit_music",
    DELETE_MUSIC: "delete_music",
    UPLOAD_PODCAST: "upload_podcast",
    EDIT_PODCAST: "edit_podcast",
    DELETE_PODCAST: "delete_podcast",

    // Gaushala
    MANAGE_GAUSHALA: "manage_gaushala",
    VIEW_DONATIONS: "view_donations",
};

// Role-Permission mapping (mirror backend)
export const ROLE_PERMISSIONS = {
    Admin: [
        PERMISSIONS.MANAGE_USERS,
        PERMISSIONS.CREATE_COURSES,
        PERMISSIONS.DELETE_COURSES,
        PERMISSIONS.EDIT_COURSES,
        PERMISSIONS.PUBLISH_NEWS,
        PERMISSIONS.DELETE_NEWS,
        PERMISSIONS.EDIT_NEWS,
        PERMISSIONS.UPLOAD_ART,
        PERMISSIONS.SELL_ON_MARKETPLACE,
        PERMISSIONS.ADD_PRODUCT,
        PERMISSIONS.UPDATE_PRODUCT,
        PERMISSIONS.DELETE_PRODUCT,
        PERMISSIONS.MANAGE_INVENTORY,
        PERMISSIONS.MANAGE_PAYMENTS,
        PERMISSIONS.MANAGE_PROMO_CODE,
        PERMISSIONS.UPLOAD_MUSIC,
        PERMISSIONS.EDIT_MUSIC,
        PERMISSIONS.DELETE_MUSIC,
        PERMISSIONS.UPLOAD_PODCAST,
        PERMISSIONS.EDIT_PODCAST,
        PERMISSIONS.DELETE_PODCAST,
        PERMISSIONS.MANAGE_GAUSHALA,
        PERMISSIONS.VIEW_DONATIONS,
    ],

    Instructor: [
        PERMISSIONS.CREATE_COURSES,
        PERMISSIONS.DELETE_COURSES,
        PERMISSIONS.EDIT_COURSES,
    ],

    Vendor: [
        PERMISSIONS.SELL_ON_MARKETPLACE,
        PERMISSIONS.ADD_PRODUCT,
        PERMISSIONS.UPDATE_PRODUCT,
        PERMISSIONS.DELETE_PRODUCT,
        PERMISSIONS.MANAGE_INVENTORY,
        PERMISSIONS.VIEW_VENDOR_DASHBOARD,
        PERMISSIONS.VIEW_ORDERS,
        PERMISSIONS.ACCEPT_ORDERS,
    ],

    Editor: [PERMISSIONS.PUBLISH_NEWS, PERMISSIONS.EDIT_NEWS],

    Artist: [
        PERMISSIONS.UPLOAD_ART,
        PERMISSIONS.SELL_ON_MARKETPLACE,
        PERMISSIONS.UPLOAD_MUSIC,
        PERMISSIONS.EDIT_MUSIC,
        PERMISSIONS.UPLOAD_PODCAST,
        PERMISSIONS.EDIT_PODCAST,
    ],

    GaushalaOwner: [PERMISSIONS.MANAGE_GAUSHALA, PERMISSIONS.VIEW_DONATIONS],

    Learner: [PERMISSIONS.ENROLL_COURSES],
};

/**
 * Check if user has a specific permission
 * @param {Object} user - User object with accountType
 * @param {string} permission - Permission to check
 * @returns {boolean}
 */
export const hasPermission = (user, permission) => {
    if (!user || !user.accountType) return false;

    // Admin has all permissions
    if (user.accountType === 'Admin') return true;

    const userPermissions = ROLE_PERMISSIONS[user.accountType] || [];
    return userPermissions.includes(permission);
};

/**
 * Check if user has any of the specified permissions
 * @param {Object} user - User object
 * @param {string[]} permissions - Array of permissions
 * @returns {boolean}
 */
export const hasAnyPermission = (user, permissions) => {
    return permissions.some(permission => hasPermission(user, permission));
};

/**
 * Check if user has all of the specified permissions
 * @param {Object} user - User object
 * @param {string[]} permissions - Array of permissions
 * @returns {boolean}
 */
export const hasAllPermissions = (user, permissions) => {
    return permissions.every(permission => hasPermission(user, permission));
};

/**
 * Check if user has a specific role
 * @param {Object} user - User object
 * @param {string} role - Role to check
 * @returns {boolean}
 */
export const hasRole = (user, role) => {
    return user?.accountType === role;
};

/**
 * Check if user has any of the specified roles
 * @param {Object} user - User object
 * @param {string[]} roles - Array of roles
 * @returns {boolean}
 */
export const hasAnyRole = (user, roles) => {
    return roles.includes(user?.accountType);
};
