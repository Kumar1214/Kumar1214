const express = require('express');
const router = express.Router();
const { auth } = require('../../shared/middleware/auth');

// Mock AI Text Generation
router.post('/generate-marketing-copy', auth, async (req, res) => {
    try {
        const { product, goal, tone } = req.body;

        // Simulate AI delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        let generatedText = "";

        if (goal === 'sale') {
            generatedText = `🔥 Flash Sale Alert! Get amazing deals on ${product}. Limited time offer! Shop now and save big before stocks run out. #Sale #${product.replace(/\s/g, '')} #GauGyan`;
        } else if (goal === 'awareness') {
            generatedText = `✨ Discover the magic of ${product}. Handcrafted with care and designed for perfection. Experience quality like never before. Visit our store on GauGyan today!`;
        } else {
            generatedText = `Looking for ${product}? We've got you covered. Best quality, best prices. Check it out now!`;
        }

        if (tone === 'urgent') generatedText = "HURRY! " + generatedText;
        if (tone === 'friendly') generatedText = "Hey friends! " + generatedText;

        res.json({ success: true, text: generatedText });

    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;
