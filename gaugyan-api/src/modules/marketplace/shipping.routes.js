const express = require('express');
const router = express.Router();
const {
    getShippingRules,
    createShippingRule,
    updateShippingRule,
    deleteShippingRule,
    calculateShipping
} = require('./shipping.controller');
const { protect, authorize } = require('../../shared/middleware/protect');

// Public route for calculation during checkout
router.post('/calculate', calculateShipping);

// Admin routes for rule management
router.use(protect);
router.use(authorize('admin'));

router.route('/rules')
    .get(getShippingRules)
    .post(createShippingRule);

router.route('/rules/:id')
    .put(updateShippingRule)
    .delete(deleteShippingRule);

module.exports = router;
