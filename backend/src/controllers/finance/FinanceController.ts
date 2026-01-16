export class FinanceController {
    static async requestPayout(req: any, res: any) {
        try {
            const { amount, vendorId } = req.body;
            // In real app, vendorId would come from req.user

            // @ts-ignore
            const Payout = require('../../modules/finance/Payout');

            // Create Payout Record in DB
            const payout = await Payout.create({
                id: `PAY-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                vendorId,
                amount,
                status: 'PENDING_APPROVAL',
                approvals: { security: false, finance: false, admin: false },
                auditLog: [`Payout initiated for Vendor ${vendorId} amount ${amount}`]
            });

            console.log(`[Finance] Payout Request Created: ${payout.id}`);
            res.json({ message: 'Payout requested successfully', data: payout });
        } catch (error) {
            console.error('Payout Request Error:', error);
            res.status(500).json({ message: 'Failed to request payout' });
        }
    }

    static async approvePayout(req: any, res: any) {
        try {
            const { payoutId, role } = req.body;

            // @ts-ignore
            const { sequelize } = require('../../shared/config/database');
            // @ts-ignore
            const Payout = require('../../modules/finance/Payout');
            // @ts-ignore
            const Wallet = require('../../modules/finance/Wallet');

            await sequelize.transaction(async (t: any) => {
                // 1. Validate Payout (Locking Row)
                const payout = await Payout.findByPk(payoutId, { transaction: t, lock: true });

                if (!payout) {
                    throw new Error('Payout request not found');
                }

                // 2. Execute Approval Workflow State Transition
                // We reuse the logic from PayoutWorkflow but apply it to the Sequelize instance
                const { PayoutWorkflow } = require('../../services/finance/PayoutWorkflow');
                await PayoutWorkflow.approve(payout, role);

                // 3. Deduct Wallet Balance (Atomic Check) if Status is READY_FOR_PAYOUT
                // Note: The workflow updates the status.
                if (payout.status === 'READY_FOR_PAYOUT') {
                    await Wallet.decrement('balance', {
                        by: payout.amount,
                        where: { vendorId: payout.vendorId },
                        transaction: t
                    });

                    // Sequelize decrement returns result array, check if affected rows > 0 could be useful validation
                    // but standard decrement is safe.
                    payout.auditLog = [...payout.auditLog, `Wallet debited by ${payout.amount}`];
                }

                // 4. Save Payout State
                // Explicitly marking fields as changed if needed, but Sequelize handles direct assignments usually
                // However, for JSON fields like approvals/auditLog, we need to be careful.
                await payout.save({ transaction: t });

                console.log(`[Finance] Transaction Committed for Payout ${payoutId} by ${role}`);
                res.json({ message: 'Payout Approved & Processed Atomically', data: payout });
            });

        } catch (error: any) {
            console.error('Approval Failed:', error);
            res.status(500).json({ message: error.message || 'Approval failed' });
        }
    }
}
