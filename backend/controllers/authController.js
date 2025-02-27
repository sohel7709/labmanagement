const asyncHandler = require('express-async-handler');
const AuthService = require('../services/authService');
const UserService = require('../services/userService');

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400);
        throw new Error('Please provide email and password');
    }

    const result = await AuthService.login(email, password);
    res.json(result);
});

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
    const sessionInfo = await AuthService.getSessionInfo(req.user._id);
    res.json(sessionInfo);
});

// @desc    Request password reset
// @route   POST /api/auth/reset-password
// @access  Public
const requestPasswordReset = asyncHandler(async (req, res) => {
    const { email } = req.body;

    if (!email) {
        res.status(400);
        throw new Error('Please provide email');
    }

    const { user, resetToken } = await AuthService.requestPasswordReset(email);

    // In a real application, you would send an email with the reset token
    // For development, we'll just return it
    if (process.env.NODE_ENV === 'development') {
        res.json({
            message: 'Password reset token generated',
            resetToken,
            // Only in development!
            resetUrl: `${req.protocol}://${req.get('host')}/reset-password/${resetToken}`
        });
    } else {
        // In production, send email and return generic message
        // await sendPasswordResetEmail(user.email, resetToken);
        res.json({
            message: 'Password reset instructions sent to your email'
        });
    }
});

// @desc    Reset password
// @route   PUT /api/auth/reset-password/:token
// @access  Public
const resetPassword = asyncHandler(async (req, res) => {
    const { password } = req.body;
    const { token } = req.params;

    if (!password) {
        res.status(400);
        throw new Error('Please provide new password');
    }

    const result = await AuthService.resetPassword(token, password);
    res.json(result);
});

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
const changePassword = asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
        res.status(400);
        throw new Error('Please provide current and new password');
    }

    const result = await UserService.changePassword(
        req.user._id,
        currentPassword,
        newPassword
    );

    res.json(result);
});

// @desc    Update profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = asyncHandler(async (req, res) => {
    const updates = {
        name: req.body.name,
        email: req.body.email
        // Add other fields that users are allowed to update
    };

    const user = await UserService.updateUser(req.user._id, updates);
    res.json(user);
});

// @desc    Verify session
// @route   GET /api/auth/verify-session
// @access  Public
const verifySession = asyncHandler(async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
        res.status(401);
        throw new Error('No token provided');
    }

    const user = await AuthService.verifyToken(token);
    const sessionInfo = await AuthService.getSessionInfo(user._id);
    
    res.json(sessionInfo);
});

module.exports = {
    login,
    getMe,
    requestPasswordReset,
    resetPassword,
    changePassword,
    updateProfile,
    verifySession
};
