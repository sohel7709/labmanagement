const User = require('../models/userModel');
const Lab = require('../models/labModel');
const bcrypt = require('bcryptjs');

class UserService {
    /**
     * Create a new user
     */
    static async createUser(userData, labId) {
        // Check if user with email already exists
        const existingUser = await User.findOne({ email: userData.email });
        if (existingUser) {
            throw new Error('User with this email already exists');
        }

        // Check if lab exists
        const lab = await Lab.findById(labId);
        if (!lab) {
            throw new Error('Lab not found');
        }

        // Set default permissions based on role
        const permissions = this.getDefaultPermissions(userData.role);

        // Create user
        const user = await User.create({
            ...userData,
            lab: labId,
            permissions,
            status: 'active'
        });

        return user;
    }

    /**
     * Get default permissions for a role
     */
    static getDefaultPermissions(role) {
        const permissions = {
            super_admin: [
                'manage_labs',
                'manage_admins',
                'view_all_labs'
            ],
            admin: [
                'manage_technicians',
                'manage_reports',
                'view_lab_stats'
            ],
            technician: [
                'generate_reports',
                'edit_reports',
                'view_assigned_reports'
            ]
        };

        return permissions[role] || [];
    }

    /**
     * Update user details
     */
    static async updateUser(userId, updateData) {
        // Remove sensitive fields that shouldn't be updated directly
        const { password, role, lab, ...safeUpdateData } = updateData;

        const user = await User.findByIdAndUpdate(
            userId,
            safeUpdateData,
            { new: true }
        ).select('-password');

        if (!user) {
            throw new Error('User not found');
        }

        return user;
    }

    /**
     * Change user password
     */
    static async changePassword(userId, currentPassword, newPassword) {
        const user = await User.findById(userId).select('+password');
        if (!user) {
            throw new Error('User not found');
        }

        // Check current password
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            throw new Error('Current password is incorrect');
        }

        // Update password
        user.password = newPassword;
        await user.save();

        return { message: 'Password updated successfully' };
    }

    /**
     * Get users by role for a specific lab
     */
    static async getUsersByRole(labId, role, page = 1, limit = 10) {
        const skip = (page - 1) * limit;

        const users = await User.find({ lab: labId, role })
            .select('-password')
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        const total = await User.countDocuments({ lab: labId, role });

        return {
            users,
            page,
            totalPages: Math.ceil(total / limit),
            total
        };
    }

    /**
     * Get user performance metrics
     */
    static async getUserPerformance(userId, startDate, endDate) {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        // Different metrics based on user role
        let performance = {
            user: {
                _id: user._id,
                name: user.name,
                role: user.role
            },
            metrics: {}
        };

        if (user.role === 'technician') {
            performance.metrics = await this.getTechnicianMetrics(userId, startDate, endDate);
        } else if (user.role === 'admin') {
            performance.metrics = await this.getAdminMetrics(userId, startDate, endDate);
        }

        return performance;
    }

    /**
     * Get technician-specific metrics
     */
    static async getTechnicianMetrics(userId, startDate, endDate) {
        // This would be implemented based on your Report model
        return {
            reportsCompleted: 0,
            averageCompletionTime: 0,
            accuracyRate: 0
        };
    }

    /**
     * Get admin-specific metrics
     */
    static async getAdminMetrics(userId, startDate, endDate) {
        // This would be implemented based on your specific requirements
        return {
            techniciansManaged: 0,
            reportsApproved: 0,
            averageResponseTime: 0
        };
    }

    /**
     * Deactivate user
     */
    static async deactivateUser(userId) {
        const user = await User.findByIdAndUpdate(
            userId,
            { status: 'inactive' },
            { new: true }
        ).select('-password');

        if (!user) {
            throw new Error('User not found');
        }

        return user;
    }

    /**
     * Bulk create users
     */
    static async bulkCreateUsers(usersData, labId) {
        const session = await User.startSession();
        session.startTransaction();

        try {
            const createdUsers = [];
            for (const userData of usersData) {
                const permissions = this.getDefaultPermissions(userData.role);
                const user = await User.create([{
                    ...userData,
                    lab: labId,
                    permissions,
                    status: 'active'
                }], { session });
                createdUsers.push(user[0]);
            }

            await session.commitTransaction();
            return createdUsers;
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }
    }
}

module.exports = UserService;
