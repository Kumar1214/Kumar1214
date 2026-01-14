const express = require('express');
const router = express.Router();
const {
    getMeditations,
    getMeditationById,
    createMeditation,
    updateMeditation,
    deleteMeditation
} = require('./meditation.controller');
const { protect, authorize } = require('../../shared/middleware/protect');

router.route('/')
    .get(getMeditations)
    .post(protect, authorize('artist', 'admin'), createMeditation);

router.route('/:id')
    .get(getMeditationById)
    .put(protect, authorize('artist', 'admin'), updateMeditation)
    .delete(protect, authorize('artist', 'admin'), deleteMeditation);

module.exports = router;
