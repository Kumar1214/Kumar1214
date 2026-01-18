const asyncHandler = require('express-async-handler');
const { sequelize } = require('../../shared/config/database');
const Payout = require('../finance/Payout');
const Wallet = require('../finance/Wallet');
const Transaction = require('../identity/Transaction'); // Using identity module transaction
const { Op } = require('sequelize');

// @desc    Get all payouts
// @route   GET /api/finance/payouts
// @access  Admin
exports.getPayouts = asyncHandler(async (req, res) => {
    const payouts = await Payout.findAll({
        order: [['createdAt', 'DESC']]
    });
    res.status(200).json({ success: true, count: payouts.length, data: payouts });
});

// @desc    Update payout status
// @route   PUT /api/finance/payouts/:id
// @access  Admin
exports.updatePayoutStatus = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { status, note } = req.body;

    const t = await sequelize.transaction();

    try {
        const payout = await Payout.findByPk(id, { transaction: t });

        if (!payout) {
            await t.rollback();
            return res.status(404).json({ success: false, message: 'Payout not found' });
        }

        // State transition validation (Basic)
        if (payout.status === 'COMPLETED' || payout.status === 'REJECTED') {
            await t.rollback();
            return res.status(400).json({ success: false, message: 'Payout is already finalized' });
        }

        payout.status = status;
        if (note) {
            let audit = payout.auditLog || [];
            // Ensure audit is an array
            if (typeof audit === 'string') {
                try { audit = JSON.parse(audit); } catch { audit = []; }
            }
            audit.push({ status, note, date: new Date(), user: req.user ? req.user.id : 'admin' });
            payout.auditLog = audit;
        }

        await payout.save({ transaction: t });

        // If Completed, deduct from Wallet (Deduction usually happens on Request, but we verify here)
        // Or if Rejected, Refund to Wallet?
        // For now, assuming Payout Request deducts 'Held' balance, validation logic depends on specific Wallet flow.
        // We will just log the Transaction if Completed.

        if (status === 'COMPLETED') {
            // Example: Create a Debit Transaction Record if not already created
            // This assumes the money actually left the system
            // Logic can be expanded based on Wallet.js implementation
        }

        await t.commit();
        res.status(200).json({ success: true, message: `Payout updated to ${status}`, data: payout });

    } catch (error) {
        await t.rollback();
        console.error('Payout Update Error:', error);
        res.status(500).json({ success: false, message: 'Transaction failed', error: error.message });
    }
});

// @desc    Delete payout
// @route   DELETE /api/finance/payouts/:id
// @access  Admin
exports.deletePayout = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const t = await sequelize.transaction();

    try {
        const payout = await Payout.findByPk(id, { transaction: t });

        if (!payout) {
            await t.rollback();
            return res.status(404).json({ success: false, message: 'Payout not found' });
        }

        // Only allow deleting Pending or Rejected
        if (['PROCESSING', 'COMPLETED'].includes(payout.status)) {
            await t.rollback();
            return res.status(400).json({ success: false, message: 'Cannot delete active/completed payouts' });
        }

        await payout.destroy({ transaction: t });
        await t.commit();

        res.status(200).json({ success: true, message: 'Payout deleted' });
    } catch (error) {
        await t.rollback();
        res.status(500).json({ success: false, message: 'Delete failed', error: error.message });
    }
});

// @desc    Get all commissions
// @route   GET /api/finance/commissions
// @access  Admin
exports.getCommissions = asyncHandler(async (req, res) => {
    // Placeholder: Return Transactions of type 'credit' to Admin/Platform?
    // Or if Commission model exists. Currently assuming Transaction model serves as ledger.
    const commissions = await Transaction.findAll({
        where: { type: 'credit', description: { [Op.like]: '%Commission%' } }, // loose filter
        limit: 100,
        order: [['createdAt', 'DESC']]
    });
    res.status(200).json({ success: true, count: commissions.length, data: commissions });
});

// @desc    Update commission
// @route   PUT /api/finance/commissions/:id
// @access  Admin
exports.updateCommission = asyncHandler(async (req, res) => {
    res.status(501).json({ success: false, message: 'Not Implemented: Commission structure varies' });
});

// @desc    Get all refunds
// @route   GET /api/finance/refunds
// @access  Admin
exports.getRefunds = asyncHandler(async (req, res) => {
    // Retrieve transactions marked as refund
    const refunds = await Transaction.findAll({
        where: { type: 'debit', description: { [Op.like]: '%Refund%' } },
        limit: 100,
        order: [['createdAt', 'DESC']]
    });
    res.status(200).json({ success: true, count: refunds.length, data: refunds });
});

// @desc    Update refund status
// @route   PUT /api/finance/refunds/:id/status
// @access  Admin
exports.updateRefundStatus = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    // Refunds usually handled via Payment Gateway callbacks.
    // This endpoint might be for manual override.
    const t = await sequelize.transaction();
    try {
        const transaction = await Transaction.findByPk(id, { transaction: t });
        if (!transaction) {
            await t.rollback();
            return res.status(404).json({ success: false, message: 'Refund transaction not found' });
        }

        transaction.status = status;
        await transaction.save({ transaction: t });

        await t.commit();
        res.status(200).json({ success: true, message: 'Refund status updated', data: transaction });
    } catch (error) {
        await t.rollback();
        res.status(500).json({ success: false, message: 'Update failed', error: error.message });
    }
});
