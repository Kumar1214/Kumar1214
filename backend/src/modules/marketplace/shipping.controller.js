const ShippingRule = require('./ShippingRule');
const { Op } = require('sequelize');

// @desc    Get all shipping rules
// @route   GET /api/shipping/rules
// @access  Private/Admin
exports.getShippingRules = async (req, res) => {
    try {
        const rules = await ShippingRule.findAll();
        res.status(200).json({ success: true, data: rules });
    } catch (error) {
        console.error('getShippingRules error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @desc    Create shipping rule
// @route   POST /api/shipping/rules
// @access  Private/Admin
exports.createShippingRule = async (req, res) => {
    try {
        const rule = await ShippingRule.create(req.body);
        res.status(201).json({ success: true, data: rule });
    } catch (error) {
        console.error('createShippingRule error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @desc    Update shipping rule
// @route   PUT /api/shipping/rules/:id
// @access  Private/Admin
exports.updateShippingRule = async (req, res) => {
    try {
        const rule = await ShippingRule.findByPk(req.params.id);
        if (!rule) return res.status(404).json({ success: false, message: 'Rule not found' });
        await rule.update(req.body);
        res.status(200).json({ success: true, data: rule });
    } catch (error) {
        console.error('updateShippingRule error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @desc    Delete shipping rule
// @route   DELETE /api/shipping/rules/:id
// @access  Private/Admin
exports.deleteShippingRule = async (req, res) => {
    try {
        const rule = await ShippingRule.findByPk(req.params.id);
        if (!rule) return res.status(404).json({ success: false, message: 'Rule not found' });
        await rule.destroy();
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        console.error('deleteShippingRule error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @desc    Calculate Shipping & GST
// @route   POST /api/shipping/calculate
// @access  Public
exports.calculateShipping = async (req, res) => {
    try {
        const { state, pincode, weight = 1, subtotal } = req.body;

        // 1. Find matching rule
        // Logic: specific pincode match > state match > default "National" (or fallback)
        const rules = await ShippingRule.findAll({ where: { isActive: true } });

        let matchingRule = null;

        // Check pincode prefixes
        if (pincode) {
            matchingRule = rules.find(r => r.pincodePrefixes?.some(prefix => pincode.startsWith(prefix)));
        }

        // If no pincode match, check state
        if (!matchingRule && state) {
            matchingRule = rules.find(r => r.states?.map(s => s.toLowerCase()).includes(state.toLowerCase()));
        }

        // Fallback to a "Default" or "National" rule if defined, otherwise generic fallback
        if (!matchingRule) {
            matchingRule = rules.find(r => r.zoneName === 'Default' || r.zoneName === 'National');
        }

        const baseRate = matchingRule ? Number(matchingRule.baseCharge) : 100; // Default fallback 100
        const perKg = matchingRule ? Number(matchingRule.perKgCharge) : 50;
        const freeThreshold = matchingRule ? matchingRule.freeShippingThreshold : null;

        let shippingCost = 0;

        // Free shipping check
        if (freeThreshold && subtotal >= freeThreshold) {
            shippingCost = 0;
        } else {
            shippingCost = baseRate + (Math.max(0, weight - 1) * perKg); // Base covers 1kg? Or just base + w * perKg? Assuming Base + (Weight-0.5)*Rate or similar. 
            // Simplified: Base + (Weight * perKg) or simply Base for <1kg.
            // Logic: Base charge is flat, perKg added for excess?
            // Let's use Base Charge + (Weight * PerKg)
            shippingCost = baseRate + (weight * perKg);
        }

        // GST Calculation (18% on Products? Or Shipping? Start with plain 18% on Subtotal + Shipping usually taxes are separate)
        // User said: "GST excluded from product price, added at checkout"
        // So Tax = (Subtotal * 0.18)
        // Shipping Tax is usually 18% of shipping cost too.

        const gstRate = 0.18;
        const taxAmount = (subtotal * gstRate);
        const shippingTax = (shippingCost * gstRate);
        const totalTax = taxAmount + shippingTax;

        res.status(200).json({
            success: true,
            data: {
                shipping: Number(shippingCost.toFixed(2)),
                tax: Number(totalTax.toFixed(2)),
                ruleApplied: matchingRule ? matchingRule.zoneName : 'Default Fallback'
            }
        });

    } catch (error) {
        console.error("Shipping Calc Error:", error);
        res.status(500).json({ success: false, message: 'Calculation failed' });
    }
};
