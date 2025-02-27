const express = require('express');
const router = express.Router();
const {
    getPatients,
    getPatient,
    createPatient,
    updatePatient,
    deletePatient,
    searchPatients
} = require('../controllers/patientController');
const {
    protect,
    checkPermission,
    setLabContext
} = require('../middleware/authMiddleware');

// Protect all routes and set lab context
router.use(protect);
router.use(setLabContext);

// Patient management routes
router.route('/')
    .get(checkPermission('view_patients'), getPatients)
    .post(checkPermission('manage_patients'), createPatient);

router.route('/search')
    .get(checkPermission('view_patients'), searchPatients);

router.route('/:id')
    .get(checkPermission('view_patients'), getPatient)
    .put(checkPermission('manage_patients'), updatePatient)
    .delete(checkPermission('manage_patients'), deletePatient);

module.exports = router;
