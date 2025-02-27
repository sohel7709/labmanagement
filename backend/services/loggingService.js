const mongoose = require('mongoose');

// Define the schema for system logs
const systemLogSchema = new mongoose.Schema({
    level: {
        type: String,
        enum: ['info', 'warning', 'error', 'critical'],
        required: true
    },
    category: {
        type: String,
        enum: ['auth', 'lab', 'user', 'report', 'system'],
        required: true
    },
    message: {
        type: String,
        required: true
    },
    details: mongoose.Schema.Types.Mixed,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    lab: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lab'
    },
    ip: String,
    userAgent: String,
    timestamp: {
        type: Date,
        default: Date.now
    }
});

const SystemLog = mongoose.model('SystemLog', systemLogSchema);

class LoggingService {
    /**
     * Log system event
     */
    static async logSystemEvent(level, category, message, details = {}, context = {}) {
        try {
            const logEntry = await SystemLog.create({
                level,
                category,
                message,
                details,
                user: context.userId,
                lab: context.labId,
                ip: context.ip,
                userAgent: context.userAgent
            });

            // If it's a critical error, we might want to send notifications
            if (level === 'critical') {
                // TODO: Implement notification system
                console.error('CRITICAL ERROR:', message, details);
            }

            return logEntry;
        } catch (error) {
            console.error('Error logging system event:', error);
            // Don't throw the error as logging should not break the main flow
        }
    }

    /**
     * Log authentication event
     */
    static async logAuthEvent(action, userId, success, details = {}, context = {}) {
        return this.logSystemEvent(
            success ? 'info' : 'warning',
            'auth',
            `Authentication ${action} - ${success ? 'success' : 'failed'}`,
            { ...details, userId, success },
            context
        );
    }

    /**
     * Log lab management event
     */
    static async logLabEvent(action, labId, details = {}, context = {}) {
        return this.logSystemEvent(
            'info',
            'lab',
            `Lab ${action}`,
            { ...details, labId },
            context
        );
    }

    /**
     * Log user management event
     */
    static async logUserEvent(action, targetUserId, details = {}, context = {}) {
        return this.logSystemEvent(
            'info',
            'user',
            `User ${action}`,
            { ...details, targetUserId },
            context
        );
    }

    /**
     * Log report event
     */
    static async logReportEvent(action, reportId, details = {}, context = {}) {
        return this.logSystemEvent(
            'info',
            'report',
            `Report ${action}`,
            { ...details, reportId },
            context
        );
    }

    /**
     * Get logs with filtering and pagination
     */
    static async getLogs(filters = {}, page = 1, limit = 10) {
        const query = {};

        if (filters.level) query.level = filters.level;
        if (filters.category) query.category = filters.category;
        if (filters.lab) query.lab = filters.lab;
        if (filters.user) query.user = filters.user;
        if (filters.startDate) query.timestamp = { $gte: new Date(filters.startDate) };
        if (filters.endDate) query.timestamp = { ...query.timestamp, $lte: new Date(filters.endDate) };

        const skip = (page - 1) * limit;

        const logs = await SystemLog.find(query)
            .populate('user', 'name email role')
            .populate('lab', 'name')
            .sort({ timestamp: -1 })
            .skip(skip)
            .limit(limit);

        const total = await SystemLog.countDocuments(query);

        return {
            logs,
            page,
            totalPages: Math.ceil(total / limit),
            total
        };
    }

    /**
     * Get lab-specific logs
     */
    static async getLabLogs(labId, filters = {}, page = 1, limit = 10) {
        return this.getLogs({ ...filters, lab: labId }, page, limit);
    }

    /**
     * Get user-specific logs
     */
    static async getUserLogs(userId, filters = {}, page = 1, limit = 10) {
        return this.getLogs({ ...filters, user: userId }, page, limit);
    }

    /**
     * Clean old logs
     */
    static async cleanOldLogs(daysToKeep = 30) {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

        const result = await SystemLog.deleteMany({
            timestamp: { $lt: cutoffDate },
            level: { $ne: 'critical' } // Keep critical logs
        });

        return {
            message: `Cleaned logs older than ${daysToKeep} days`,
            deletedCount: result.deletedCount
        };
    }
}

module.exports = LoggingService;
