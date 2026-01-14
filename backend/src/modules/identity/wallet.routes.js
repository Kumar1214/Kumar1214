const express = require('express');
const router = express.Router();
const User = require('./User');
const Transaction = require('./Transaction');
const { protect, authorize } = require('../../shared/middleware/protect'); // Corrected middleware import

// @desc    Get current user wallet details
// @route   GET /api/v1/wallet/me
// @access  Private
router.get('/me', protect, async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);
        const transactions = await Transaction.findAll({
            where: { user: req.user.id },
            order: [['date', 'DESC']]
        });

        res.status(200).json({
            success: true,
            data: {
                walletBalance: parseFloat(user.walletBalance),
                coinBalance: user.coinBalance,
                transactions
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// @desc    Add money to wallet (Mock integration)
// @route   POST /api/v1/wallet/add-money
// @access  Private
router.post('/add-money', protect, async (req, res) => {
    try {
        const { amount } = req.body;
        if (!amount || amount <= 0) {
            return res.status(400).json({ success: false, error: 'Invalid amount' });
        }

        const user = await User.findByPk(req.user.id);
        // Ensure decimals are handled as numbers
        user.walletBalance = parseFloat(user.walletBalance) + Number(amount);
        await user.save();

        await Transaction.create({
            user: req.user.id,
            type: 'credit',
            amount: Number(amount),
            currency: 'INR',
            description: 'Money Added to Wallet',
            status: 'completed',
            date: new Date()
        });

        res.status(200).json({
            success: true,
            data: user.walletBalance,
            message: `Successfully added ₹${amount}`
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// @desc    Redeem Coins
// @route   POST /api/v1/wallet/redeem
// @access  Private
router.post('/redeem', protect, async (req, res) => {
    try {
        const { coins } = req.body;
        // Fetch coin rate from settings or constant. Using constant 1 Coin = ₹1 for now unless specified
        const COIN_RATE = 1;

        const user = await User.findByPk(req.user.id);

        if (user.coinBalance < coins) {
            return res.status(400).json({ success: false, error: 'Insufficient coins' });
        }

        const redeemValue = coins * COIN_RATE;

        user.coinBalance -= Number(coins);
        user.walletBalance = parseFloat(user.walletBalance) + redeemValue;
        await user.save();

        // Log Coin Debit
        await Transaction.create({
            user: req.user.id,
            type: 'debit',
            amount: Number(coins),
            currency: 'GG',
            description: `Redeemed ${coins} Coins`,
            status: 'completed',
            date: new Date()
        });

        // Log Wallet Credit
        await Transaction.create({
            user: req.user.id,
            type: 'credit',
            amount: redeemValue,
            currency: 'INR',
            description: 'Coin Redemption',
            status: 'completed',
            date: new Date()
        });

        res.status(200).json({
            success: true,
            data: { walletBalance: user.walletBalance, coinBalance: user.coinBalance },
            message: `Redeemed ${coins} coins for ₹${redeemValue}`
        });

    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// @desc    Admin Credit/Debit User Wallet/Coins
// @route   POST /api/v1/wallet/admin/transaction
// @access  Private/Admin
router.post('/admin/transaction', protect, authorize('admin', 'superadmin'), async (req, res) => {
    try {
        const { userId, type, amount, currency, description } = req.body; // type: credit/debit, currency: INR/GG

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        const val = Number(amount);

        if (currency === 'INR') {
            const currentBalance = parseFloat(user.walletBalance);
            if (type === 'credit') {
                user.walletBalance = currentBalance + val;
            } else {
                if (currentBalance < val) return res.status(400).json({ success: false, error: 'Insufficient funds' });
                user.walletBalance = currentBalance - val;
            }
        } else if (currency === 'GG') {
            if (type === 'credit') {
                user.coinBalance += val;
            } else {
                if (user.coinBalance < val) return res.status(400).json({ success: false, error: 'Insufficient coins' });
                user.coinBalance -= val;
            }
        } else {
            return res.status(400).json({ success: false, error: 'Invalid currency' });
        }

        await user.save();

        await Transaction.create({
            user: userId,
            type,
            amount: val,
            currency,
            description: description || `Admin ${type} adjustment`,
            status: 'completed',
            date: new Date()
        });

        res.status(200).json({
            success: true,
            data: user,
            message: 'Transaction successful'
        });

    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

module.exports = router;
