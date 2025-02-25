const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
    lab: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lab',
        required: true
    },
    name: {
        type: String,
        required: [true, 'Please add patient name']
    },
    age: {
        type: Number,
        required: [true, 'Please add patient age']
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'other'],
        required: [true, 'Please specify gender']
    },
    contact: {
        phone: {
            type: String,
            required: [true, 'Please add contact number']
        },
        email: String,
        address: String
    },
    medicalHistory: [{
        condition: String,
        diagnosis: String,
        year: Number
    }],
    bloodGroup: {
        type: String,
        enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
    },
    emergencyContact: {
        name: String,
        relationship: String,
        phone: String
    },
    registeredBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Patient', patientSchema);
