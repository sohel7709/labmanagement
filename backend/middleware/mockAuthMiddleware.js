const asyncHandler = require('express-async-handler');

// Mock authentication middleware
const protect = asyncHandler(async (req, res, next) => {
    // Set mock user with lab ID for development
    req.user = {
        _id: '000000000000000000000000',
        name: 'Development User',
        email: 'dev@example.com',
        role: 'super_admin',
        lab: '000000000000000000000001' // Mock lab ID
    };
    next();
});

// Grant access to specific roles
const authorize = (...roles) => {
    return (req, res, next) => {
        // Allow all role checks to pass in development
        next();
    };
};

// Lab access middleware
const checkLabAccess = asyncHandler(async (req, res, next) => {
    // Allow all lab access in development
    next();
});

module.exports = {
    protect,
    authorize,
    checkLabAccess
};
