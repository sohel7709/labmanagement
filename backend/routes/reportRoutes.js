const express = require('express');
const router = express.Router();
const {
    protect,
    checkRole,
    checkPermission,
    setLabContext
} = require('../middleware/authMiddleware');
const {
    createReport,
    getReports,
    getReport,
    updateReport,
    deleteReport,
    getReportStats,
    assignReport,
    verifyReport,
    addComment
} = require('../controllers/testReportController');

// Protect all routes and set lab context
router.use(protect);
router.use(setLabContext);

// Report management routes
router.route('/')
    .post(
        checkPermission('manage_reports'),
        createReport
    )
    .get(
        checkPermission('view_assigned_reports'),
        getReports
    );

// Report statistics
router.get(
    '/stats',
    checkRole('admin', 'super_admin'),
    checkPermission('view_lab_stats'),
    getReportStats
);

// Individual report routes
router.route('/:id')
    .get(
        checkPermission('view_assigned_reports'),
        getReport
    )
    .put(
        checkPermission('edit_reports'),
        updateReport
    )
    .delete(
        checkRole('admin'),
        checkPermission('manage_reports'),
        deleteReport
    );

// Report assignment
router.put(
    '/:id/assign',
    checkRole('admin'),
    checkPermission('manage_reports'),
    assignReport
);

// Report verification
router.put(
    '/:id/verify',
    checkRole('admin'),
    checkPermission('manage_reports'),
    verifyReport
);

// Report comments
router.post(
    '/:id/comments',
    checkPermission('edit_reports'),
    addComment
);

// Report batch operations
router.post(
    '/batch/assign',
    checkRole('admin'),
    checkPermission('manage_reports'),
    async (req, res) => {
        // Batch assign reports to technician
        res.status(501).json({ message: 'Not implemented' });
    }
);

router.post(
    '/batch/verify',
    checkRole('admin'),
    checkPermission('manage_reports'),
    async (req, res) => {
        // Batch verify reports
        res.status(501).json({ message: 'Not implemented' });
    }
);

// Report templates
router.get(
    '/templates',
    checkPermission('generate_reports'),
    async (req, res) => {
        // Get available report templates
        res.status(501).json({ message: 'Not implemented' });
    }
);

router.post(
    '/templates',
    checkRole('admin'),
    checkPermission('manage_reports'),
    async (req, res) => {
        // Create new report template
        res.status(501).json({ message: 'Not implemented' });
    }
);

// Report export
router.get(
    '/:id/export',
    checkPermission('view_assigned_reports'),
    async (req, res) => {
        // Export report in various formats (PDF, Excel, etc.)
        res.status(501).json({ message: 'Not implemented' });
    }
);

// Report analytics
router.get(
    '/analytics/turnaround-time',
    checkRole('admin'),
    checkPermission('view_lab_stats'),
    async (req, res) => {
        // Get report turnaround time analytics
        res.status(501).json({ message: 'Not implemented' });
    }
);

router.get(
    '/analytics/technician-performance',
    checkRole('admin'),
    checkPermission('view_lab_stats'),
    async (req, res) => {
        // Get technician performance analytics
        res.status(501).json({ message: 'Not implemented' });
    }
);

module.exports = router;
