const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
const Patient = mongoose.models.NewPatient || require('../models/patientModel');

// @desc    Add new patient
// @route   POST /api/patients
// @access  Private
const addPatient = asyncHandler(async (req, res) => {
    console.log('Received request to add patient:', req.body);
    const { name, age, gender, phone } = req.body;

    // Validate phone number (must be 10 digits)
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phone)) {
        res.status(400);
        throw new Error('Phone number must be 10 digits');
    }

    try {
        // Create patient
        const patient = new Patient({
            name,
            age,
            gender,
            contact: { phone },
            lab: req.user.lab, // From auth middleware
            registeredBy: req.user._id
        });

        await patient.save();
        res.status(201).json(patient);
    } catch (error) {
        console.error('Error saving patient:', error);
        res.status(400);
        throw new Error(error.message || 'Invalid patient data');
    }
});

// @desc    Get all patients
// @route   GET /api/patients
// @access  Private
const getPatients = asyncHandler(async (req, res) => {
    const patients = await Patient.find({ lab: req.user.lab });
    res.json(patients);
});

// @desc    Get single patient
// @route   GET /api/patients/:id
// @access  Private
const getPatient = asyncHandler(async (req, res) => {
    const patient = await Patient.findOne({ 
        _id: req.params.id,
        lab: req.user.lab 
    });

    if (!patient) {
        res.status(404);
        throw new Error('Patient not found');
    }

    res.json(patient);
});

// @desc    Update patient
// @route   PUT /api/patients/:id
// @access  Private
const updatePatient = asyncHandler(async (req, res) => {
    const patient = await Patient.findOne({
        _id: req.params.id,
        lab: req.user.lab
    });

    if (!patient) {
        res.status(404);
        throw new Error('Patient not found');
    }

    const updatedPatient = await Patient.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );

    res.json(updatedPatient);
});

// @desc    Delete patient
// @route   DELETE /api/patients/:id
// @access  Private
const deletePatient = asyncHandler(async (req, res) => {
    try {
        const deletedPatient = await Patient.findOneAndDelete({
            _id: req.params.id,
            lab: req.user.lab
        });

        if (!deletedPatient) {
            res.status(404);
            throw new Error('Patient not found');
        }

        res.json({ message: 'Patient removed', id: req.params.id });
    } catch (error) {
        console.error('Error deleting patient:', error);
        res.status(500);
        throw new Error('Failed to delete patient: ' + error.message);
    }
});

// @desc    Search patients
// @route   GET /api/patients/search
// @access  Private
const searchPatients = asyncHandler(async (req, res) => {
    const { query } = req.query;
    
    const patients = await Patient.find({
        lab: req.user.lab,
        $or: [
            { name: { $regex: query, $options: 'i' } },
            { 'contact.phone': { $regex: query, $options: 'i' } }
        ]
    });

    res.json(patients);
});

module.exports = {
    addPatient,
    getPatients,
    getPatient,
    updatePatient,
    deletePatient,
    searchPatients
};
