const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');

class AuthService {
    /**
     * Generate JWT Token
     */
    static generateToken(userId) {
        return jwt.sign(
            { id: userId },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRE }
        );
    }

    /**
     * Login user
     */
    static async login(email, password) {
        // Find user by email
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            throw new Error('Invalid credentials');
        }

        // Check if user is active
        if (user.status !== 'active') {
            throw new Error('User account is not active');
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new Error('Invalid credentials');
        }

        // Update last login
        user.lastLogin = Date.now();
        await user.save();

        // Generate token
        const token = this.generateToken(user._id);

        return {
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                lab: user.lab,
                permissions: user.permissions
            }
        };
    }

    /**
     * Verify token and get user
     */
    static async verifyToken(token) {
        try {
            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Get user
            const user = await User.findById(decoded.id)
                .select('-password')
                .populate('lab', 'name status subscription');

            if (!user) {
                throw new Error('User not found');
            }

            if (user.status !== 'active') {
                throw new Error('User account is not active');
            }

            return user;
        } catch (error) {
            throw new Error('Invalid token');
        }
    }

    /**
     * Reset password request
     */
    static async requestPasswordReset(email) {
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error('User not found');
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        user.resetPasswordToken = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');
        
        // Set expiry (1 hour)
        user.resetPasswordExpire = Date.now() + 3600000;
        await user.save();

        return {
            user,
            resetToken
        };
    }

    /**
     * Reset password
     */
    static async resetPassword(resetToken, newPassword) {
        // Get hashed token
        const resetPasswordToken = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');

        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) {
            throw new Error('Invalid or expired reset token');
        }

        // Set new password
        user.password = newPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        return {
            message: 'Password reset successful'
        };
    }

    /**
     * Check permission
     */
    static checkPermission(user, permission) {
        return user.permissions.includes(permission);
    }

    /**
     * Check if user has any of the specified permissions
     */
    static hasAnyPermission(user, permissions) {
        return user.permissions.some(p => permissions.includes(p));
    }

    /**
     * Get user session info
     */
    static async getSessionInfo(userId) {
        const user = await User.findById(userId)
            .select('-password')
            .populate('lab', 'name status subscription');

        if (!user) {
            throw new Error('User not found');
        }

        return {
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                lab: user.lab,
                permissions: user.permissions,
                lastLogin: user.lastLogin
            },
            lab: user.lab ? {
                _id: user.lab._id,
                name: user.lab.name,
                status: user.lab.status,
                subscription: user.lab.subscription
            } : null
        };
    }
}

module.exports = AuthService;
