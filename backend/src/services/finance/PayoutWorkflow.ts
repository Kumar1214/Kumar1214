export enum PayoutStatus {
    PENDING_APPROVAL = 'PENDING_APPROVAL',
    APPROVED_SECURITY = 'APPROVED_SECURITY',
    APPROVED_FINANCE = 'APPROVED_FINANCE',
    READY_FOR_PAYOUT = 'READY_FOR_PAYOUT',
    PROCESSING = 'PROCESSING',
    COMPLETED = 'COMPLETED',
    REJECTED = 'REJECTED'
}

export interface IPayoutRequest {
    id: string;
    vendorId: string;
    amount: number;
    status: PayoutStatus;
    approvals: {
        security: boolean;
        finance: boolean;
        admin: boolean;
    };
    auditLog: string[];
}



export class PayoutWorkflow {
    // Replaces the mock initiatePayout. Now handled directly by FinanceController using Payout.create()

    static async approve(payout: any, approverRole: 'SECURITY' | 'FINANCE' | 'ADMIN') {
        // Clone to ensure Sequelize detects changes to JSON fields
        const currentAuditLog = [...(payout.auditLog || [])];
        currentAuditLog.push(`Approved by ${approverRole} at ${new Date().toISOString()}`);
        payout.auditLog = currentAuditLog;

        const approvals = { ...(payout.approvals || { security: false, finance: false, admin: false }) };

        switch (approverRole) {
            case 'SECURITY':
                approvals.security = true;
                if (payout.status === PayoutStatus.PENDING_APPROVAL) {
                    payout.status = PayoutStatus.APPROVED_SECURITY;
                }
                break;
            case 'FINANCE':
                approvals.finance = true;
                if (payout.status === PayoutStatus.APPROVED_SECURITY) {
                    payout.status = PayoutStatus.APPROVED_FINANCE;
                }
                break;
            case 'ADMIN':
                approvals.admin = true;
                break;
        }

        payout.approvals = approvals;

        // Three-person approval logic
        if (approvals.security && approvals.finance && approvals.admin) {
            payout.status = PayoutStatus.READY_FOR_PAYOUT;
            const finalLog = [...payout.auditLog];
            finalLog.push(`Payout ${payout.id} is READY for processing.`);
            payout.auditLog = finalLog;
        }

        return payout;
    }

    private static async notifyApprovers(payoutId: string) {
        console.log(`[Notification] Alerting Security, Finance, and Admin for Payout ${payoutId}`);
    }
}
