const express = require('express');
const router = express.Router();
const Page = require('./Page');
const { Op } = require('sequelize');

// Get all pages
router.get('/', async (req, res) => {
    try {
        const { published } = req.query;

        const where = published === 'true' ? { isPublished: true } : {};

        const pages = await Page.findAll({
            where,
            attributes: ['slug', 'title', 'isPublished', 'publishedAt', 'updatedAt'],
            order: [['updatedAt', 'DESC']]
        });

        res.json(pages);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get page by slug
router.get('/:slug', async (req, res) => {
    try {
        const page = await Page.findOne({ where: { slug: req.params.slug } });

        if (!page) {
            return res.status(404).json({ error: 'Page not found' });
        }

        // Only return published pages to non-admin users
        // TODO: Add admin check properly
        if (!page.isPublished) {
            // return res.status(404).json({ error: 'Page not found' });
        }

        res.json(page);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create page
router.post('/', async (req, res) => {
    try {
        const { slug, title, metaTitle, metaDescription, sections } = req.body;

        // TODO: Add authentication middleware
        // const userId = req.user.id;
        const userId = 1; // Placeholder for SQL migration (Admin)

        // Check if slug already exists
        const existingPage = await Page.findOne({ where: { slug } });
        if (existingPage) {
            return res.status(400).json({ error: 'Page with this slug already exists' });
        }

        const page = await Page.create({
            slug,
            title,
            metaTitle,
            metaDescription,
            sections: sections || [],
            isPublished: false,
            updatedBy: userId
        });

        res.status(201).json({
            success: true,
            page
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update page
router.put('/:slug', async (req, res) => {
    try {
        const { title, metaTitle, metaDescription, sections, isPublished } = req.body;

        // TODO: Add authentication middleware
        const userId = 1; // Placeholder

        let page = await Page.findOne({ where: { slug: req.params.slug } });

        if (!page) {
            return res.status(404).json({ error: 'Page not found' });
        }

        const updateData = {};
        if (title !== undefined) updateData.title = title;
        if (metaTitle !== undefined) updateData.metaTitle = metaTitle;
        if (metaDescription !== undefined) updateData.metaDescription = metaDescription;
        if (sections !== undefined) updateData.sections = sections;
        if (isPublished !== undefined) {
            updateData.isPublished = isPublished;
            if (isPublished) {
                updateData.publishedAt = new Date();
            }
        }
        updateData.updatedBy = userId;

        page = await page.update(updateData);

        res.json({
            success: true,
            page
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete page
router.delete('/:slug', async (req, res) => {
    try {
        const page = await Page.findOne({ where: { slug: req.params.slug } });

        if (!page) {
            return res.status(404).json({ error: 'Page not found' });
        }

        await page.destroy();

        res.json({
            success: true,
            message: 'Page deleted successfully'
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add section to page
router.post('/:slug/sections', async (req, res) => {
    try {
        const { type, order, config, content } = req.body;

        const page = await Page.findOne({ where: { slug: req.params.slug } });

        if (!page) {
            return res.status(404).json({ error: 'Page not found' });
        }

        const newSection = {
            id: `section-${Date.now()}`,
            type,
            order: order || (page.sections ? page.sections.length : 0),
            config: config || {},
            content: content || {}
        };

        const updatedSections = [...(page.sections || []), newSection];
        await page.update({ sections: updatedSections });

        res.json({
            success: true,
            section: newSection
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update section
router.put('/:slug/sections/:sectionId', async (req, res) => {
    try {
        const { type, order, config, content } = req.body;

        const page = await Page.findOne({ where: { slug: req.params.slug } });

        if (!page) {
            return res.status(404).json({ error: 'Page not found' });
        }

        const sections = page.sections || [];
        const sectionIndex = sections.findIndex(s => s.id === req.params.sectionId);

        if (sectionIndex === -1) {
            return res.status(404).json({ error: 'Section not found' });
        }

        const updatedSection = { ...sections[sectionIndex] };
        if (type !== undefined) updatedSection.type = type;
        if (order !== undefined) updatedSection.order = order;
        if (config !== undefined) updatedSection.config = config;
        if (content !== undefined) updatedSection.content = content;

        sections[sectionIndex] = updatedSection;

        // Sequelize JSON update requires explicitly setting the value to a new object/array reference sometimes, 
        // but 'update' with complete array should work.
        await page.update({ sections: [...sections] });

        res.json({
            success: true,
            section: updatedSection
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete section
router.delete('/:slug/sections/:sectionId', async (req, res) => {
    try {
        const page = await Page.findOne({ where: { slug: req.params.slug } });

        if (!page) {
            return res.status(404).json({ error: 'Page not found' });
        }

        const sections = page.sections || [];
        const updatedSections = sections.filter(s => s.id !== req.params.sectionId);

        await page.update({ sections: updatedSections });

        res.json({
            success: true,
            message: 'Section deleted successfully'
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
