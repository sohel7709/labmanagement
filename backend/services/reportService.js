const Report = require('../models/reportModel');
const LoggingService = require('./loggingService');

class ReportService {
    /**
     * Create a new report
     */
    static async createReport(reportData, userId, labId) {
        const report = await Report.create({
            ...reportData,
            lab: labId,
            createdBy: userId,
            reportDate: new Date(),
            status: 'pending'
        });

        await LoggingService.logReportEvent(
            'created',
            report._id,
            { reportType: report.testType },
            { userId, labId }
        );

        return report;
    }

    /**
     * Get reports with filtering and pagination
     */
    static async getReports(filters = {}, page = 1, limit = 10, user) {
        const query = { lab: user.lab };

        // Apply filters
        if (filters.status) query.status = filters.status;
        if (filters.priority) query.priority = filters.priority;
        if (filters.testType) query.testType = filters.testType;
        if (filters.patientId) query.patient = filters.patientId;
        
        // Date range filter
        if (filters.startDate || filters.endDate) {
            query.reportDate = {};
            if (filters.startDate) query.reportDate.$gte = new Date(filters.startDate);
            if (filters.endDate) query.reportDate.$lte = new Date(filters.endDate);
        }

        // Role-based filtering
        if (user.role === 'technician') {
            query.assignedTo = user._id;
        }

        const skip = (page - 1) * limit;

        const reports = await Report.find(query)
            .populate('patient', 'name age gender')
            .populate('assignedTo', 'name')
            .populate('createdBy', 'name')
            .populate('verifiedBy', 'name')
            .sort({ reportDate: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Report.countDocuments(query);

        return {
            reports,
            page,
            totalPages: Math.ceil(total / limit),
            total
        };
    }

    /**
     * Get single report
     */
    static async getReport(reportId, user) {
        const report = await Report.findOne({
            _id: reportId,
            lab: user.lab
        })
        .populate('patient', 'name age gender')
        .populate('assignedTo', 'name')
        .populate('createdBy', 'name')
        .populate('verifiedBy', 'name');

        if (!report) {
            throw new Error('Report not found');
        }

        // Check if user has access to this report
        if (user.role === 'technician' && report.assignedTo.toString() !== user._id.toString()) {
            throw new Error('Not authorized to access this report');
        }

        return report;
    }

    /**
     * Update report
     */
    static async updateReport(reportId, updateData, user) {
        const report = await Report.findOne({
            _id: reportId,
            lab: user.lab
        });

        if (!report) {
            throw new Error('Report not found');
        }

        // Check if user has access to update this report
        if (user.role === 'technician' && report.assignedTo.toString() !== user._id.toString()) {
            throw new Error('Not authorized to update this report');
        }

        // Handle status changes
        if (updateData.status) {
            switch (updateData.status) {
                case 'completed':
                    updateData.completedAt = Date.now();
                    break;
                case 'verified':
                    updateData.verifiedBy = user._id;
                    updateData.verifiedAt = Date.now();
                    break;
                case 'delivered':
                    updateData.deliveredAt = Date.now();
                    break;
            }
        }

        // Add comment if provided
        if (updateData.comment) {
            report.comments.push({
                user: user._id,
                text: updateData.comment
            });
        }

        // Update report
        Object.assign(report, updateData);
        await report.save();

        await LoggingService.logReportEvent(
            'updated',
            report._id,
            { 
                status: report.status,
                updatedFields: Object.keys(updateData)
            },
            { userId: user._id, labId: user.lab }
        );

        return report;
    }

    /**
     * Delete report
     */
    static async deleteReport(reportId, user) {
        const report = await Report.findOne({
            _id: reportId,
            lab: user.lab
        });

        if (!report) {
            throw new Error('Report not found');
        }

        // Only allow deletion of pending reports
        if (report.status !== 'pending') {
            throw new Error('Cannot delete non-pending reports');
        }

        await report.remove();

        await LoggingService.logReportEvent(
            'deleted',
            reportId,
            { status: report.status },
            { userId: user._id, labId: user.lab }
        );

        return { message: 'Report deleted successfully' };
    }

    /**
     * Get report statistics
     */
    static async getReportStats(labId, startDate, endDate) {
        const stats = await Report.aggregate([
            {
                $match: {
                    lab: labId,
                    reportDate: {
                        $gte: new Date(startDate),
                        $lte: new Date(endDate)
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    totalReports: { $sum: 1 },
                    pendingReports: {
                        $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
                    },
                    completedReports: {
                        $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
                    },
                    verifiedReports: {
                        $sum: { $cond: [{ $eq: ['$status', 'verified'] }, 1, 0] }
                    },
                    avgTurnaroundTime: {
                        $avg: {
                            $divide: [
                                { $subtract: ['$completedAt', '$reportDate'] },
                                1000 * 60 * 60 // Convert to hours
                            ]
                        }
                    }
                }
            }
        ]);

        return stats[0] || {
            totalReports: 0,
            pendingReports: 0,
            completedReports: 0,
            verifiedReports: 0,
            avgTurnaroundTime: 0
        };
    }
}

module.exports = ReportService;
