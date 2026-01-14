const jwt = require("jsonwebtoken");
const ROLE_PERMISSIONS = require("../config/rolePermission");
const User = require("../../modules/identity/User");

function extractToken(req) {
    const authHeader = req.headers.authorization || req.headers.Authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
        return authHeader.split(" ")[1];
    }

    return req.cookies?.token || req.body?.token || null;
}

exports.auth = async (req, res, next) => {
    try {
        const token = extractToken(req);

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: No token provided",
            });
        }

        let decoded;

        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch {
            return res.status(401).json({
                success: false,
                message: "Invalid or expired token",
            });
        }

        // Attach user payload to request
        const user = await User.findByPk(decoded.id);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: User not found",
            });
        }

        // Normalize for existing RBAC expectations
        req.user = user.toJSON();
        req.user.accountType = user.role.charAt(0).toUpperCase() + user.role.slice(1); // Standardize 'admin' -> 'Admin'
        req.user.id = user.id;

        // Logging only in development
        if (process.env.NODE_ENV !== "production") {
            try {
                console.log(
                    `Authenticated → User: ${user.email} | Role: ${req.user.accountType}`
                );
            } catch {
                // Ignore logging errors
            }
        }

        next();
    } catch (error) {
        console.error("Auth Error:", error);
        return res.status(500).json({
            success: false,
            message: "Authentication failed. Please try again later.",
        });
    }
};

exports.optionalAuth = async (req, res, next) => {
    try {
        const token = extractToken(req);

        if (token) {
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                const user = await User.findByPk(decoded.id);
                if (user) {
                    req.user = user.toJSON();
                    req.user.accountType = user.role.charAt(0).toUpperCase() + user.role.slice(1);
                    req.user.role = user.role; // also keep original
                    req.user.id = user.id;
                }
            } catch {
                // Invalid token, just proceed without user
            }
        }
        next();
    } catch {
        // Should not happen, but safety net
        next();
    }
};

exports.requireRole = (...allowedRoles) => {
    return (req, res, next) => {
        try {
            if (!req.user || !req.user.accountType) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized: user not recognized",
                });
            }

            if (!allowedRoles.includes(req.user.accountType)) {
                return res.status(403).json({
                    success: false,
                    message: "Forbidden: insufficient permissions",
                });
            }

            return next();
        } catch (error) {
            console.error("RBAC Error:", error);
            return res.status(500).json({
                success: false,
                message: "Authorization failed",
            });
        }
    };
};

exports.requirePermission = (permission) => {
    return (req, res, next) => {
        try {
            const userRole = req.user?.accountType;
            if (!userRole) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized: No role detected",
                });
            }

            const allowedPermissions = ROLE_PERMISSIONS[userRole] || [];

            if (!allowedPermissions.includes(permission) && userRole !== "Admin") {
                return res.status(403).json({
                    success: false,
                    message: "Forbidden: Permission denied",
                });
            }
            next();
        } catch (error) {
            console.error("Permission Check Error:", error);
            return res.status(500).json({
                success: false,
                message: "Error validating permissions",
            });
        }
    };
};

exports.verifyVendorOwnership = (Model) => async (req, res, next) => {
    try {
        const resource = await Model.findById(req.params.id);
        if (!resource)
            return res
                .status(404)
                .json({ success: false, message: "Resource not found" });

        if (resource.vendor.toString() !== req.user.id.toString()) {
            return res
                .status(403)
                .json({ success: false, message: "Access denied: Not your resource" });
        }

        next();
    } catch (err) {
        console.error("Vendor Ownership Error:", err);
        return res.status(500).json({ success: false, message: err.message });
    }
};

exports.isAdmin = exports.requireRole("Admin");
exports.isInstructor = exports.requireRole("Instructor");
exports.isLearner = exports.requireRole("Learner");
exports.isVendor = exports.requireRole("Vendor");
exports.isEditor = exports.requireRole("Editor");
exports.isArtist = exports.requireRole("Artist");
