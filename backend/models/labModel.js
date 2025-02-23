const mongoose = require('mongoose');

const labSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a lab name'],
        unique: true
    },
    address: {
        street: String,
        city: String,
        state: String,
        zipCode: String,
        country: String
    },
    contact: {
        phone: String,
        email: String,
        website: String
    },
    logo: {
        type: String,
        default: 'default-lab-logo.png'
    },
    licenseNumber: {
        type: String,
        required: [true, 'Please add a license number'],
        unique: true
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'suspended'],
        default: 'active'
    },
    settings: {
        reportHeader: String,
        reportFooter: String,
        currency: {
            type: String,
            default: 'USD'
        },
        timeZone: {
            type: String,
            default: 'UTC'
        }
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Lab', labSchema);
