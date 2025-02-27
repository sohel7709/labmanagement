const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    lab: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lab',
        required: [true, 'Lab reference is required']
    },
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: 6,
        select: false // Don't return password in queries by default
    },
    role: {
        type: String,
        enum: ['super_admin', 'admin', 'technician'],
        required: [true, 'Role is required']
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'suspended'],
        default: 'active'
    },
    permissions: [{
        type: String,
        enum: [
            // Super Admin permissions
            'manage_labs',
            'manage_admins',
            'view_all_labs',
            // Admin permissions
            'manage_technicians',
            'manage_reports',
            'view_lab_stats',
            // Technician permissions
            'generate_reports',
            'edit_reports',
            'view_assigned_reports'
        ]
    }],
    lastLogin: {
        type: Date
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
userSchema.pre('save', async function(next) {
    this.updatedAt = Date.now();

    // Only hash password if it's modified
    if (!this.isModified('password')) return next();

    try {
        // Hash password
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Set default permissions based on role
userSchema.pre('save', function(next) {
    if (this.isModified('role')) {
        switch (this.role) {
            case 'super_admin':
                this.permissions = [
                    'manage_labs',
                    'manage_admins',
                    'view_all_labs'
                ];
                break;
            case 'admin':
                this.permissions = [
                    'manage_technicians',
                    'manage_reports',
                    'view_lab_stats'
                ];
                break;
            case 'technician':
                this.permissions = [
                    'generate_reports',
                    'edit_reports',
                    'view_assigned_reports'
                ];
                break;
        }
    }
    next();
});

// Method to check if password matches
userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Method to check if user has specific permission
userSchema.methods.hasPermission = function(permission) {
    return this.permissions.includes(permission);
};

// Method to check if user has any of the specified permissions
userSchema.methods.hasAnyPermission = function(permissions) {
    return this.permissions.some(p => permissions.includes(p));
};

module.exports = mongoose.model('User', userSchema);
