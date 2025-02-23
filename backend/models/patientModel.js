const mongoose = require('mongoose');

const patientSchema = mongoose.Schema({
    lab: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lab',
        required: true
    },
    patientId: {
        type: String,
        required: true,
        unique: true
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

// Create patient ID before saving
patientSchema.pre('save', async function(next) {
    if (!this.patientId) {
        const currentDate = new Date();
        const year = currentDate.getFullYear().toString().substr(-2);
        const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
        const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        this.patientId = `P${year}${month}${randomNum}`;
    }
    next();
});

module.exports = mongoose.model('Patient', patientSchema);
