const express = require('express');
const {
    getGaushalas,
    getGaushala,
    createGaushala,
    updateGaushala,
    deleteGaushala
} = require('./gaushala.controller');
const { protect, authorize } = require('../../shared/middleware/protect');

const router = express.Router();

router
    .route('/')
    .get(getGaushalas)
    .post(protect, authorize('gaushala_owner', 'admin'), createGaushala);

router
    .route('/:id')
    .get(getGaushala)
    .put(protect, authorize('gaushala_owner', 'admin'), updateGaushala)
    .delete(protect, authorize('gaushala_owner', 'admin'), deleteGaushala);

module.exports = router;
