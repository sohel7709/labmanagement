const mongoose = require('mongoose');

const testReportSchema = mongoose.Schema({
    lab: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lab',
        required: true
    },
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        required: true
    },
    reportId: {
        type: String,
        unique: true
    },
    testType: {
        type: String,
        required: [true, 'Please specify test type']
    },
    category: {
        type: String,
        required: [true, 'Please specify test category']
    },
    parameters: [{
        name: {
            type: String,
            required: true
        },
        value: {
            type: String,
            required: true
        },
        unit: String,
        referenceRange: {
            min: Number,
            max: Number,
            text: String
        },
        status: {
            type: String,
            enum: ['normal', 'low', 'high', 'critical'],
            default: 'normal'
        }
    }],
    sampleCollectedAt: Date,
    sampleType: String,
    technician: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    verifiedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    status: {
        type: String,
        enum: ['pending', 'in_progress', 'completed', 'verified'],
        default: 'pending'
    },
    result: {
        summary: String,
        interpretation: String,
        remarks: String
    },
    attachments: [{
        filename: String,
        path: String,
        uploadedAt: {
            type: Date,
            default: Date.now
        }
    }],
    reportGeneratedAt: Date,
    reportPdfUrl: String,
    urgency: {
        type: String,
        enum: ['routine', 'urgent', 'emergency'],
        default: 'routine'
    }
}, {
    timestamps: true
});

// Create report ID before saving
testReportSchema.pre('save', async function(next) {
    if (!this.reportId) {
        const currentDate = new Date();
        const year = currentDate.getFullYear().toString().substr(-2);
        const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
        const day = currentDate.getDate().toString().padStart(2, '0');
        const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        this.reportId = `TR${year}${month}${day}${randomNum}`;
    }
    next();
});

// Update report status based on verification
testReportSchema.pre('save', function(next) {
    if (this.verifiedBy && this.status === 'completed') {
        this.status = 'verified';
    }
    next();
});

module.exports = mongoose.model('TestReport', testReportSchema);
