const express = require('express');
const {
    getRoles,
    createRole,
    updateRole,
    deleteRole
} = require('./role.controller');
const { protect, authorize } = require('../../shared/middleware/protect');

const router = express.Router();

router.use(protect);
router.use(authorize('admin'));

router
    .route('/')
    .get(getRoles)
    .post(createRole);

router
    .route('/:id')
    .put(updateRole)
    .delete(deleteRole);

module.exports = router;
