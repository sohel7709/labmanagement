const asyncHandler = require('express-async-handler');
const ReportService = require('../services/reportService');

// @desc    Create new report
// @route   POST /api/reports
// @access  Private/Admin,Technician
const createReport = asyncHandler(async (req, res) => {
    const report = await ReportService.createReport(
        req.body,
        req.user._id,
        req.user.lab
    );

    res.status(201).json(report);
});

// @desc    Get all reports
// @route   GET /api/reports
// @access  Private/Admin,Technician
const getReports = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const filters = {
        status: req.query.status,
        priority: req.query.priority,
        testType: req.query.testType,
        patientId: req.query.patientId,
        startDate: req.query.startDate,
        endDate: req.query.endDate
    };

    const result = await ReportService.getReports(
        filters,
        page,
        limit,
        req.user
    );

    res.json(result);
});

// @desc    Get single report
// @route   GET /api/reports/:id
// @access  Private/Admin,Technician
const getReport = asyncHandler(async (req, res) => {
    const report = await ReportService.getReport(
        req.params.id,
        req.user
    );

    res.json(report);
});

// @desc    Update report
// @route   PUT /api/reports/:id
// @access  Private/Admin,Technician
const updateReport = asyncHandler(async (req, res) => {
    const report = await ReportService.updateReport(
        req.params.id,
        req.body,
        req.user
    );

    res.json(report);
});

// @desc    Delete report
// @route   DELETE /api/reports/:id
// @access  Private/Admin
const deleteReport = asyncHandler(async (req, res) => {
    const result = await ReportService.deleteReport(
        req.params.id,
        req.user
    );

    res.json(result);
});

// @desc    Get report statistics
// @route   GET /api/reports/stats
// @access  Private/Admin
const getReportStats = asyncHandler(async (req, res) => {
    const startDate = req.query.startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // Default to last 30 days
    const endDate = req.query.endDate || new Date();

    const stats = await ReportService.getReportStats(
        req.user.lab,
        startDate,
        endDate
    );

    res.json(stats);
});

// @desc    Assign report to technician
// @route   PUT /api/reports/:id/assign
// @access  Private/Admin
const assignReport = asyncHandler(async (req, res) => {
    const { technicianId } = req.body;

    if (!technicianId) {
        res.status(400);
        throw new Error('Please provide technician ID');
    }

    const report = await ReportService.updateReport(
        req.params.id,
        {
            assignedTo: technicianId,
            status: 'assigned'
        },
        req.user
    );

    res.json(report);
});

// @desc    Verify report
// @route   PUT /api/reports/:id/verify
// @access  Private/Admin
const verifyReport = asyncHandler(async (req, res) => {
    const report = await ReportService.updateReport(
        req.params.id,
        {
            status: 'verified',
            verificationNotes: req.body.verificationNotes
        },
        req.user
    );

    res.json(report);
});

// @desc    Add comment to report
// @route   POST /api/reports/:id/comments
// @access  Private/Admin,Technician
const addComment = asyncHandler(async (req, res) => {
    const { comment } = req.body;

    if (!comment) {
        res.status(400);
        throw new Error('Please provide comment');
    }

    const report = await ReportService.updateReport(
        req.params.id,
        { comment },
        req.user
    );

    res.json(report);
});

module.exports = {
    createReport,
    getReports,
    getReport,
    updateReport,
    deleteReport,
    getReportStats,
    assignReport,
    verifyReport,
    addComment
};
