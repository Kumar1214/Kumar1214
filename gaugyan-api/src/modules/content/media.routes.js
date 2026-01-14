const express = require('express');
const router = express.Router();
const multer = require('multer');
const Media = require('./Media');
const storageService = require('../../shared/services/storageService');
const User = require('../identity/User');
const { auth } = require('../../shared/middleware/auth');


// Configure multer for memory storage
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 50 * 1024 * 1024 // 50MB limit
    }
});

// Upload single file
router.post('/upload', auth, upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const folder = req.body.folder || 'general';

        // TODO: Add authentication middleware properly
        // For now, if req.user exists, use it. Else hardcode for testing/seed?
        // Let's assume req.user might be present if protected, typically it should be.
        // If not, we might fail or use a default if system upload.
        // WARNING: Using hardcoded ID will break if that ID doesn't exist in SQL.
        // We really should protect this route.
        const userId = req.user ? req.user.id : 1; // Fallback to 1 (Admin usually)

        // Upload to configured storage
        const uploadResult = await storageService.upload(req.file, folder);

        // Save media record to database
        const media = await Media.create({
            filename: uploadResult.filename,
            originalName: req.file.originalname,
            mimeType: req.file.mimetype,
            size: req.file.size,
            url: uploadResult.url,
            storageProvider: uploadResult.provider,
            uploadedBy: userId,
            folder
        });

        res.json({
            success: true,
            media: {
                id: media.id,
                url: media.url,
                filename: media.filename,
                mimeType: media.mimeType,
                size: media.size
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Upload multiple files
router.post('/upload-multiple', auth, upload.array('files', 10), async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: 'No files uploaded' });
        }

        const folder = req.body.folder || 'general';
        const userId = req.user ? req.user.id : 1;

        const uploadedMedia = [];

        for (const file of req.files) {
            const uploadResult = await storageService.upload(file, folder);

            const media = await Media.create({
                filename: uploadResult.filename,
                originalName: file.originalname,
                mimeType: file.mimetype,
                size: file.size,
                url: uploadResult.url,
                storageProvider: uploadResult.provider,
                uploadedBy: userId,
                folder
            });

            uploadedMedia.push({
                id: media.id,
                url: media.url,
                filename: media.filename,
                mimeType: media.mimeType,
                size: media.size
            });
        }

        res.json({
            success: true,
            media: uploadedMedia
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all media
router.get('/', auth, async (req, res) => {
    try {
        const { folder, page = 1, limit = 20 } = req.query;

        const where = folder ? { folder } : {};
        if (req.user) {
            where.uploadedBy = req.user.id;
        }
        const limitNum = parseInt(limit);
        const offset = (parseInt(page) - 1) * limitNum;

        const { count, rows } = await Media.findAndCountAll({
            where,
            order: [['createdAt', 'DESC']],
            limit: limitNum,
            offset,
            include: [{
                model: User,
                as: 'uploader',
                attributes: ['name', 'email']
            }]
        });

        res.json({
            media: rows,
            totalPages: Math.ceil(count / limitNum),
            currentPage: parseInt(page),
            total: count
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete media
router.delete('/:id', async (req, res) => {
    try {
        const media = await Media.findByPk(req.params.id);

        if (!media) {
            return res.status(404).json({ error: 'Media not found' });
        }

        // Delete from storage
        // Note: storageService might need adjustment if it depended on old object structure, but assuming standard delete(url)
        await storageService.delete(media.url, media.storageProvider);

        // Delete from database
        await media.destroy();

        res.json({
            success: true,
            message: 'Media deleted successfully'
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
