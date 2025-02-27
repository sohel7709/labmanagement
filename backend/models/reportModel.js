const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    lab: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lab',
        required: [true, 'Lab reference is required']
    },
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        required: [true, 'Patient reference is required']
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Report must be assigned to a technician']
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Report creator reference is required']
    },
    testType: {
        type: String,
        required: [true, 'Test type is required']
    },
    status: {
        type: String,
        enum: ['pending', 'in_progress', 'completed', 'verified', 'delivered'],
        default: 'pending'
    },
    priority: {
        type: String,
        enum: ['routine', 'urgent', 'emergency'],
        default: 'routine'
    },
    results: [{
        parameter: {
            type: String,
            required: true
        },
        value: {
            type: String,
            required: true
        },
        normalRange: {
            min: String,
            max: String
        },
        unit: String,
        interpretation: {
            type: String,
            enum: ['normal', 'high', 'low', 'critical'],
            required: true
        }
    }],
    comments: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        text: {
            type: String,
            required: true
        },
        timestamp: {
            type: Date,
            default: Date.now
        }
    }],
    verifiedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    verifiedAt: Date,
    reportDate: {
        type: Date,
        required: true
    },
    deliveryMethod: {
        type: String,
        enum: ['email', 'print', 'portal'],
        default: 'portal'
    },
    deliveredAt: Date,
    attachments: [{
        name: String,
        url: String,
        type: String,
        uploadedAt: {
            type: Date,
            default: Date.now
        }
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Indexes for efficient querying
reportSchema.index({ lab: 1, status: 1 });
reportSchema.index({ assignedTo: 1, status: 1 });
reportSchema.index({ patient: 1, createdAt: -1 });

// Update timestamp on save
reportSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

// Middleware to set verification details
reportSchema.pre('save', function(next) {
    if (this.isModified('status') && this.status === 'verified') {
        this.verifiedAt = Date.now();
    }
    if (this.isModified('status') && this.status === 'delivered') {
        this.deliveredAt = Date.now();
    }
    next();
});

// Virtual for report age
reportSchema.virtual('age').get(function() {
    return Math.floor((Date.now() - this.createdAt) / (1000 * 60 * 60 * 24));
});

// Virtual for turnaround time
reportSchema.virtual('turnaroundTime').get(function() {
    if (this.status === 'delivered' && this.deliveredAt) {
        return Math.floor((this.deliveredAt - this.createdAt) / (1000 * 60 * 60));
    }
    return null;
});

module.exports = mongoose.model('Report', reportSchema);
