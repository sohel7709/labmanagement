const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const {
    createTestReport,
    getTestReports,
    getTestReportById,
    updateTestReport,
    generatePDF,
    uploadAttachments
} = require('../controllers/testReportController');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = 'uploads/attachments';
        // Create directory if it doesn't exist
        require('fs').mkdirSync(uploadPath, { recursive: true });
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = ['.jpg', '.jpeg', '.png', '.pdf', '.doc', '.docx'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only images, PDFs and documents are allowed.'));
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

// Routes - BYPASSED FOR DEVELOPMENT
router.route('/')
    .post(createTestReport) // Bypass protect and authorize
    .get(getTestReports); // Bypass protect

router.route('/:id')
    .get(getTestReportById) // Bypass protect
    .put(updateTestReport); // Bypass protect

router.post('/:id/pdf', generatePDF); // Bypass protect

router.post(
    '/:id/attachments',
    upload.array('files', 5), // Allow up to 5 files
    uploadAttachments // Bypass protect and authorize
);

module.exports = router;
