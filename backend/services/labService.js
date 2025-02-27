const Lab = require('../models/labModel');
const User = require('../models/userModel');
const Report = require('../models/reportModel');

class LabService {
    /**
     * Create a new lab with initial admin user
     */
    static async createLabWithAdmin(labData, adminData) {
        // Start a transaction
        const session = await Lab.startSession();
        session.startTransaction();

        try {
            // Create the lab
            const lab = await Lab.create([{
                name: labData.name,
                address: labData.address,
                contact: labData.contact,
                email: labData.email,
                status: 'active',
                subscription: labData.subscription || 'basic'
            }], { session });

            // Create the admin user
            const admin = await User.create([{
                lab: lab[0]._id,
                name: adminData.name,
                email: adminData.email,
                password: adminData.password,
                role: 'admin',
                status: 'active',
                permissions: [
                    'manage_technicians',
                    'manage_reports',
                    'view_lab_stats'
                ]
            }], { session });

            await session.commitTransaction();
            return { lab: lab[0], admin: admin[0] };
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }
    }

    /**
     * Get lab statistics
     */
    static async getLabStats(labId) {
        const stats = {
            users: {
                total: await User.countDocuments({ lab: labId }),
                active: await User.countDocuments({ lab: labId, status: 'active' }),
                byRole: await User.aggregate([
                    { $match: { lab: labId } },
                    { $group: { _id: '$role', count: { $sum: 1 } } }
                ])
            },
            reports: {
                total: await Report.countDocuments({ lab: labId }),
                byStatus: await Report.aggregate([
                    { $match: { lab: labId } },
                    { $group: { _id: '$status', count: { $sum: 1 } } }
                ])
            }
        };

        return stats;
    }

    /**
     * Get lab performance metrics
     */
    static async getLabPerformance(labId, startDate, endDate) {
        const performance = {
            reportMetrics: await Report.aggregate([
                { 
                    $match: { 
                        lab: labId,
                        createdAt: { 
                            $gte: startDate, 
                            $lte: endDate 
                        }
                    }
                },
                {
                    $group: {
                        _id: null,
                        totalReports: { $sum: 1 },
                        avgTurnaroundTime: { 
                            $avg: { 
                                $divide: [
                                    { $subtract: ['$deliveredAt', '$createdAt'] },
                                    1000 * 60 * 60 // Convert to hours
                                ]
                            }
                        }
                    }
                }
            ]),
            technicianPerformance: await Report.aggregate([
                {
                    $match: {
                        lab: labId,
                        createdAt: {
                            $gte: startDate,
                            $lte: endDate
                        }
                    }
                },
                {
                    $group: {
                        _id: '$assignedTo',
                        reportsCompleted: { 
                            $sum: { 
                                $cond: [
                                    { $eq: ['$status', 'completed'] },
                                    1,
                                    0
                                ]
                            }
                        },
                        avgCompletionTime: {
                            $avg: {
                                $divide: [
                                    { $subtract: ['$completedAt', '$assignedAt'] },
                                    1000 * 60 * 60
                                ]
                            }
                        }
                    }
                }
            ])
        };

        return performance;
    }

    /**
     * Update lab subscription
     */
    static async updateLabSubscription(labId, subscription) {
        const lab = await Lab.findByIdAndUpdate(
            labId,
            { 
                subscription,
                updatedAt: Date.now()
            },
            { new: true }
        );

        if (!lab) {
            throw new Error('Lab not found');
        }

        return lab;
    }

    /**
     * Get lab audit logs
     */
    static async getLabAuditLogs(labId, page = 1, limit = 10) {
        // This is a placeholder for actual audit log implementation
        return {
            logs: [],
            page,
            totalPages: 0,
            total: 0
        };
    }

    /**
     * Check if lab has exceeded its subscription limits
     */
    static async checkSubscriptionLimits(labId) {
        const lab = await Lab.findById(labId);
        if (!lab) {
            throw new Error('Lab not found');
        }

        const limits = {
            basic: {
                users: 5,
                reportsPerMonth: 100
            },
            premium: {
                users: 20,
                reportsPerMonth: 500
            },
            enterprise: {
                users: -1, // unlimited
                reportsPerMonth: -1 // unlimited
            }
        };

        const currentLimits = limits[lab.subscription];
        const userCount = await User.countDocuments({ lab: labId });
        
        // Get current month's report count
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);
        
        const reportsThisMonth = await Report.countDocuments({
            lab: labId,
            createdAt: { $gte: startOfMonth }
        });

        return {
            hasReachedUserLimit: currentLimits.users !== -1 && userCount >= currentLimits.users,
            hasReachedReportLimit: currentLimits.reportsPerMonth !== -1 && reportsThisMonth >= currentLimits.reportsPerMonth,
            currentUsage: {
                users: userCount,
                reportsThisMonth
            },
            limits: currentLimits
        };
    }
}

module.exports = LabService;
