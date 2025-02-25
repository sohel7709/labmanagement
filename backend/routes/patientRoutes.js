const express = require('express');
const router = express.Router();
const loggingMiddleware = require('../middleware/loggingMiddleware');
const {
    addPatient,
    getPatients,
    getPatient,
    updatePatient,
    deletePatient,
    searchPatients
} = require('../controllers/patientController');

// Use logging middleware
router.use(loggingMiddleware);

// All routes require authentication
router.route('/')
    .post(addPatient)
    .get(getPatients);

router.get('/search', searchPatients);

router.route('/:id')
    .get(getPatient)
    .put(updatePatient)
    .delete(deletePatient);

module.exports = router;
