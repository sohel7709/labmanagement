const express = require('express');
const router = express.Router();
const {
    login,
    getMe,
    requestPasswordReset,
    resetPassword,
    changePassword,
    updateProfile,
    verifySession
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.post('/login', login);
router.post('/reset-password', requestPasswordReset);
router.put('/reset-password/:token', resetPassword);
router.get('/verify-session', verifySession);

// Protected routes
router.use(protect); // Apply protection middleware to all routes below

router.get('/me', getMe);
router.put('/change-password', changePassword);
router.put('/profile', updateProfile);

// Session management routes
router.post('/logout', (req, res) => {
    // Client-side logout (token invalidation would be handled on the client)
    res.json({ message: 'Logged out successfully' });
});

router.post('/refresh-token', (req, res) => {
    // Token refresh logic would be implemented here
    res.status(501).json({ message: 'Not implemented' });
});

// Role-specific routes
router.get('/permissions', (req, res) => {
    res.json({
        role: req.user.role,
        permissions: req.user.permissions
    });
});

module.exports = router;
