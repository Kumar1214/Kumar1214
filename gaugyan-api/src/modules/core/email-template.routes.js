const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../../shared/middleware/protect');
const {
    getTemplates,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    checkAndSeed
} = require('./controllers/email-template.controller');
// const { sendBulkEmail } = require('../communication/newsletter.controller');

// CRUD Templates
router.get('/test', (req, res) => res.json({ message: 'Router Works' }));
router.get('/', protect, authorize('admin'), getTemplates);
router.post('/', protect, authorize('admin'), createTemplate);
router.put('/:id', protect, authorize('admin'), updateTemplate);
router.delete('/:id', protect, authorize('admin'), deleteTemplate);
router.post('/seed', protect, authorize('admin'), checkAndSeed);

// Bulk Email
// router.post('/bulk', protect, authorize('admin'), sendBulkEmail);

module.exports = router;
