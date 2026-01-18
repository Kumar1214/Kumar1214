"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayoutWorkflow = exports.PayoutStatus = void 0;
var PayoutStatus;
(function (PayoutStatus) {
    PayoutStatus["PENDING_APPROVAL"] = "PENDING_APPROVAL";
    PayoutStatus["APPROVED_SECURITY"] = "APPROVED_SECURITY";
    PayoutStatus["APPROVED_FINANCE"] = "APPROVED_FINANCE";
    PayoutStatus["READY_FOR_PAYOUT"] = "READY_FOR_PAYOUT";
    PayoutStatus["PROCESSING"] = "PROCESSING";
    PayoutStatus["COMPLETED"] = "COMPLETED";
    PayoutStatus["REJECTED"] = "REJECTED";
})(PayoutStatus || (exports.PayoutStatus = PayoutStatus = {}));
class PayoutWorkflow {
    static async initiatePayout(amount, vendorId) {
        const payout = {
            id: `PAY-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            vendorId,
            amount,
            status: PayoutStatus.PENDING_APPROVAL,
            approvals: {
                security: false,
                finance: false,
                admin: false
            },
            auditLog: [`Payout initiated for Vendor ${vendorId} amount ${amount}`]
        };
        // Simulate DB save
        console.log(`[PayoutWorkflow] Created payout request: ${payout.id}`);
        // Trigger notifications (Mock)
        await this.notifyApprovers(payout.id);
        return payout;
    }
    static async approve(payout, approverRole) {
        payout.auditLog.push(`Approved by ${approverRole} at ${new Date().toISOString()}`);
        switch (approverRole) {
            case 'SECURITY':
                payout.approvals.security = true;
                if (payout.status === PayoutStatus.PENDING_APPROVAL) {
                    payout.status = PayoutStatus.APPROVED_SECURITY;
                }
                break;
            case 'FINANCE':
                payout.approvals.finance = true;
                if (payout.status === PayoutStatus.APPROVED_SECURITY) {
                    payout.status = PayoutStatus.APPROVED_FINANCE;
                }
                break;
            case 'ADMIN':
                payout.approvals.admin = true;
                break;
        }
        // Three-person approval logic
        if (payout.approvals.security && payout.approvals.finance && payout.approvals.admin) {
            payout.status = PayoutStatus.READY_FOR_PAYOUT;
            payout.auditLog.push(`Payout ${payout.id} is READY for processing.`);
        }
        return payout;
    }
    static async notifyApprovers(payoutId) {
        console.log(`[Notification] Alerting Security, Finance, and Admin for Payout ${payoutId}`);
    }
}
exports.PayoutWorkflow = PayoutWorkflow;
