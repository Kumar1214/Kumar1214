export enum UserRole {
    ADMIN = 'admin',
    LEARNER = 'learner',
    VENDOR = 'vendor',
    GAUSHALA_OWNER = 'gaushala_owner',
    ARTIST = 'artist',
    INSTRUCTOR = 'instructor',
    AUTHOR = 'author',
    ASTROLOGER = 'astrologer'
}

export interface IRolePermissions {
    canAccessMarketplace: boolean;
    canUploadCourse: boolean;
    canManageCows: boolean;
    requiresFinancialAudit: boolean;
    canManageUsers: boolean;
    canPublishContent: boolean;
    canGradeStudents: boolean;
    canViewAnalytics: boolean;
    canManageStore: boolean;
}

export const RoleRegistry: Record<UserRole, IRolePermissions> = {
    [UserRole.ADMIN]: {
        canAccessMarketplace: true,
        canUploadCourse: true,
        canManageCows: true,
        requiresFinancialAudit: false,
        canManageUsers: true,
        canPublishContent: true,
        canGradeStudents: true,
        canViewAnalytics: true,
        canManageStore: true
    },
    [UserRole.LEARNER]: {
        canAccessMarketplace: true,
        canUploadCourse: false,
        canManageCows: false,
        requiresFinancialAudit: false,
        canManageUsers: false,
        canPublishContent: false,
        canGradeStudents: false,
        canViewAnalytics: false,
        canManageStore: false
    },
    [UserRole.VENDOR]: {
        canAccessMarketplace: true,
        canUploadCourse: false,
        canManageCows: false,
        requiresFinancialAudit: true,
        canManageUsers: false,
        canPublishContent: false,
        canGradeStudents: false,
        canViewAnalytics: true,
        canManageStore: true
    },
    [UserRole.GAUSHALA_OWNER]: {
        canAccessMarketplace: true,
        canUploadCourse: false,
        canViewAnalytics: true
    },
    [UserRole.ARTIST]: {
        canAccessMarketplace: false,
        canUploadCourse: false,
        requiresFinancialAudit: true,
        canManageUsers: false,
        canViewAnalytics: true
    },
    [UserRole.INSTRUCTOR]: {
        canAccessMarketplace: false,
        canUploadCourse: true,
        requiresFinancialAudit: true,
        canManageUsers: false,
        canViewAnalytics: true
    },
    [UserRole.AUTHOR]: {
        canAccessMarketplace: false,
        canUploadCourse: true,
        requiresFinancialAudit: true,
        canManageUsers: false,
        canViewAnalytics: true
    },
    [UserRole.ASTROLOGER]: {
        canAccessMarketplace: true,
        canUploadCourse: false,
        requiresFinancialAudit: true,
        canManageUsers: false,
        canViewAnalytics: true
    }
};

export class RoleManager {
    static getPermissions(role: UserRole): IRolePermissions {
        return RoleRegistry[role] || RoleRegistry[UserRole.LEARNER];
    }

    static hasPermission(role: UserRole, permission: keyof IRolePermissions): boolean {
        const permissions = this.getPermissions(role);
        return permissions[permission];
    }
}
