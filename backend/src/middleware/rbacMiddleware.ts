import { Request, Response, NextFunction } from 'express';
import { RoleManager, UserRole } from '../services/auth/RoleManager';

// Extend Request interface to include user
interface AuthenticatedRequest extends Request {
    user?: {
        id: string;
        role: UserRole;
    };
}

export const rbacMiddleware = (requiredPermission: keyof import('../services/auth/RoleManager').IRolePermissions) => {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            if (!req.user) {
                return res.status(401).json({ message: 'Unauthorized: No user found' });
            }

            const userRole = req.user.role;
            const hasPermission = RoleManager.hasPermission(userRole, requiredPermission);

            if (!hasPermission) {
                console.warn(`[RBAC] Access Denied for user ${req.user.id} (Role: ${userRole}) requesting ${requiredPermission}`);
                return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
            }

            next();
        } catch (error) {
            console.error('[RBAC] Middleware Error:', error);
            res.status(500).json({ message: 'Internal Server Error during authorization' });
        }
    };
};
