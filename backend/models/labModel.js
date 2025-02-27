const mongoose = require('mongoose');

const labSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Lab name is required'],
        trim: true
    },
    address: {
        type: String,
        required: [true, 'Lab address is required']
    },
    contact: {
        type: String,
        required: [true, 'Contact number is required']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'suspended'],
        default: 'active'
    },
    subscription: {
        type: String,
        enum: ['basic', 'premium', 'enterprise'],
        default: 'basic'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update timestamp on save
labSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Lab', labSchema);
