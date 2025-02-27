const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');

// Protect routes - verify token and set user
const protect = asyncHandler(async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Get user from token
            req.user = await User.findById(decoded.id)
                .select('-password')
                .populate('lab', 'name status');

            if (!req.user) {
                res.status(401);
                throw new Error('User not found');
            }

            if (req.user.status !== 'active') {
                res.status(403);
                throw new Error('User account is not active');
            }

            next();
        } catch (error) {
            res.status(401);
            throw new Error('Not authorized');
        }
    }

    if (!token) {
        res.status(401);
        throw new Error('Not authorized, no token');
    }
});

// Check user role
const checkRole = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            res.status(403);
            throw new Error('Not authorized for this role');
        }
        next();
    };
};

// Check user permissions
const checkPermission = (...permissions) => {
    return (req, res, next) => {
        const hasPermission = permissions.some(permission => 
            req.user.permissions.includes(permission)
        );
        
        if (!hasPermission) {
            res.status(403);
            throw new Error('Not authorized - insufficient permissions');
        }
        next();
    };
};

// Check if user belongs to lab
const checkLabAccess = asyncHandler(async (req, res, next) => {
    const labId = req.params.labId || req.body.labId;

    if (!labId) {
        next();
        return;
    }

    // Super admin can access any lab
    if (req.user.role === 'super_admin') {
        next();
        return;
    }

    // Check if user belongs to the requested lab
    if (req.user.lab.toString() !== labId) {
        res.status(403);
        throw new Error('Not authorized to access this lab');
    }

    next();
});

// Set lab context for multi-tenant operations
const setLabContext = asyncHandler(async (req, res, next) => {
    // For super_admin, lab context is optional
    if (req.user.role === 'super_admin') {
        req.labContext = req.params.labId || req.body.labId || null;
    } else {
        // For other roles, lab context is their assigned lab
        req.labContext = req.user.lab;
    }
    next();
});

module.exports = {
    protect,
    checkRole,
    checkPermission,
    checkLabAccess,
    setLabContext
};
