const express = require('express');
const router = express.Router();
const {
    getPayouts,
    updatePayoutStatus,
    deletePayout,
    getCommissions,
    updateCommission,
    getRefunds,
    updateRefundStatus
} = require('./finance.controller');
const { protect, authorize } = require('../../shared/middleware/protect');

router.use(protect);
router.use(authorize('admin'));

// Payouts
router.get('/payouts', getPayouts);
router.put('/payouts/:id', updatePayoutStatus);
router.delete('/payouts/:id', deletePayout);

// Commissions
router.get('/commissions', getCommissions);
router.put('/commissions/:id', updateCommission);

// Refunds
router.get('/refunds', getRefunds);
router.put('/refunds/:id/status', updateRefundStatus);

module.exports = router;
