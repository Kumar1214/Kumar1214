const asyncHandler = require('../../shared/middleware/asyncHandler');

// Since we might not have actual Payout/Commission models yet, we'll use MOCK data or empty arrays 
// to ensure the frontend doesn't crash 404. 
// If models exist (like WalletTransaction), we could link them. 
// For now, let's create a basic structure.

// @desc    Get all payouts
// @route   GET /api/finance/payouts
// @access  Private/Admin
exports.getPayouts = asyncHandler(async (req, res) => {
    // Return mock data or empty array
    // TODO: Connect to WalletTransaction model where type='payout'
    res.json({
        success: true,
        data: [
            { id: 1, vendor: 'Gau Amrit', amount: 5000, status: 'Pending', requestedAt: new Date() },
            { id: 2, vendor: 'Organic Life', amount: 12000, status: 'Paid', requestedAt: new Date(Date.now() - 86400000) }
        ]
    });
});

// @desc    Update payout status
// @route   PUT /api/finance/payouts/:id
// @access  Private/Admin
exports.updatePayoutStatus = asyncHandler(async (req, res) => {
    const { status } = req.body;
    // Logic to update payout
    res.json({ success: true, message: `Payout marked as ${status}` });
});

// @desc    Delete Payout
// @route   DELETE /api/finance/payouts/:id
// @access  Private/Admin
exports.deletePayout = asyncHandler(async (req, res) => {
    res.json({ success: true, message: 'Payout deleted' });
});

// @desc    Get commissions
// @route   GET /api/finance/commissions
// @access  Private/Admin
exports.getCommissions = asyncHandler(async (req, res) => {
    res.json({
        success: true,
        data: [
            { id: 1, orderId: 'ORD-001', amount: 500, rate: 10, createdAt: new Date() },
            { id: 2, orderId: 'ORD-002', amount: 150, rate: 5, createdAt: new Date() }
        ]
    });
});

// @desc    Update commission
// @route   PUT /api/finance/commissions/:id
// @access  Private/Admin
exports.updateCommission = asyncHandler(async (req, res) => {
    res.json({ success: true, message: 'Commission updated' });
});

// @desc    Get refunds
// @route   GET /api/finance/refunds
// @access  Private/Admin
exports.getRefunds = asyncHandler(async (req, res) => {
    res.json({
        success: true,
        data: [
            { id: 1, orderId: 'ORD-999', amount: 1200, reason: 'Damaged Item', status: 'Pending', user: 'Rahul' }
        ]
    });
});

// @desc    Update refund status
// @route   PUT /api/finance/refunds/:id/status
// @access  Private/Admin
exports.updateRefundStatus = asyncHandler(async (req, res) => {
    res.json({ success: true, message: 'Refund status updated' });
});
