const asyncHandler = require('express-async-handler');
const Patient = require('../models/patientModel');

// @desc    Get all patients
// @route   GET /api/patients
// @access  Private
const getPatients = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = { lab: req.user.lab };

    const patients = await Patient.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    const total = await Patient.countDocuments(query);

    res.json({
        patients,
        page,
        totalPages: Math.ceil(total / limit),
        total
    });
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

// @desc    Create new patient
// @route   POST /api/patients
// @access  Private
const createPatient = asyncHandler(async (req, res) => {
    const patient = await Patient.create({
        ...req.body,
        lab: req.user.lab
    });

    res.status(201).json(patient);
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
    const patient = await Patient.findOne({
        _id: req.params.id,
        lab: req.user.lab
    });

    if (!patient) {
        res.status(404);
        throw new Error('Patient not found');
    }

    await patient.remove();

    res.json({ message: 'Patient removed' });
});

// @desc    Search patients
// @route   GET /api/patients/search
// @access  Private
const searchPatients = asyncHandler(async (req, res) => {
    const { query } = req.query;
    const searchQuery = {
        lab: req.user.lab,
        $or: [
            { name: { $regex: query, $options: 'i' } },
            { email: { $regex: query, $options: 'i' } },
            { phone: { $regex: query, $options: 'i' } }
        ]
    };

    const patients = await Patient.find(searchQuery)
        .limit(10)
        .sort({ createdAt: -1 });

    res.json(patients);
});

module.exports = {
    getPatients,
    getPatient,
    createPatient,
    updatePatient,
    deletePatient,
    searchPatients
};
