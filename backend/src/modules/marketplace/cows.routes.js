const express = require('express');
const {
    getCows,
    getCow,
    createCow,
    updateCow,
    deleteCow,
    adoptCow,
    getCowsByGaushala
} = require('./cow.controller');
const { protect, authorize } = require('../../shared/middleware/protect');

const router = express.Router();

// Re-route into gaushala router
const gaushalaRouter = require('./gaushalas.routes');
router.use('/gaushalas/:gaushalaId/cows', gaushalaRouter);

// Regular routes
router
    .route('/')
    .get(getCows)
    .post(protect, authorize('gaushala_owner', 'admin'), createCow);

router
    .route('/:id')
    .get(getCow)
    .put(protect, authorize('gaushala_owner', 'admin'), updateCow)
    .delete(protect, authorize('gaushala_owner', 'admin'), deleteCow);

// Adoption route
router
    .route('/:id/adopt')
    .post(protect, authorize('user', 'admin'), adoptCow);

// Get cows by gaushala
router
    .route('/gaushala/:gaushalaId')
    .get(getCowsByGaushala);

module.exports = router;