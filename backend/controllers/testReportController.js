const asyncHandler = require('express-async-handler');
const TestReport = require('../models/testReportModel');
const Patient = require('../models/patientModel');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

// @desc    Create new test report
// @route   POST /api/reports
// @access  Private/Technician
const createTestReport = asyncHandler(async (req, res) => {
    const {
        patient,
        testType,
        category,
        parameters,
        sampleType,
        urgency
    } = req.body;

    // Check if patient exists
    const patientExists = await Patient.findById(patient);
    if (!patientExists) {
        res.status(404);
        throw new Error('Patient not found');
    }

    const report = await TestReport.create({
        lab: req.user.lab,
        patient,
        testType,
        category,
        parameters,
        sampleType,
        urgency,
        technician: req.user._id,
        sampleCollectedAt: new Date()
    });

    if (report) {
        res.status(201).json(report);
    } else {
        res.status(400);
        throw new Error('Invalid report data');
    }
});

// @desc    Get all test reports for a lab
// @route   GET /api/reports
// @access  Private
const getTestReports = asyncHandler(async (req, res) => {
    const pageSize = 10;
    const page = Number(req.query.page) || 1;
    
    const filterOptions = {
        lab: req.user.lab
    };

    // Add filters if provided
    if (req.query.status) filterOptions.status = req.query.status;
    if (req.query.urgency) filterOptions.urgency = req.query.urgency;
    if (req.query.testType) filterOptions.testType = req.query.testType;

    const count = await TestReport.countDocuments(filterOptions);
    
    const reports = await TestReport.find(filterOptions)
        .populate('patient', 'name')
        .populate('technician', 'name')
        .populate('verifiedBy', 'name')
        .sort({ createdAt: -1 })
        .limit(pageSize)
        .skip(pageSize * (page - 1));

    res.json({
        reports,
        page,
        pages: Math.ceil(count / pageSize),
        total: count
    });
});

// @desc    Get test report by ID
// @route   GET /api/reports/:id
// @access  Private
const getTestReportById = asyncHandler(async (req, res) => {
    const report = await TestReport.findById(req.params.id)
        .populate('patient', 'name gender age contact')
        .populate('technician', 'name')
        .populate('verifiedBy', 'name');

    if (report) {
        res.json(report);
    } else {
        res.status(404);
        throw new Error('Report not found');
    }
});

// @desc    Update test report
// @route   PUT /api/reports/:id
// @access  Private/Technician
const updateTestReport = asyncHandler(async (req, res) => {
    const report = await TestReport.findById(req.params.id);

    if (!report) {
        res.status(404);
        throw new Error('Report not found');
    }

    // Check if user is authorized to update
    if (report.technician.toString() !== req.user._id.toString() && 
        req.user.role !== 'admin' && 
        req.user.role !== 'super_admin') {
        res.status(403);
        throw new Error('Not authorized to update this report');
    }

    // Update report
    Object.assign(report, req.body);
    
    // If report is being verified
    if (req.body.status === 'verified') {
        report.verifiedBy = req.user._id;
        report.reportGeneratedAt = new Date();
    }

    const updatedReport = await report.save();
    res.json(updatedReport);
});

// @desc    Generate PDF report
// @route   POST /api/reports/:id/pdf
// @access  Private
const generatePDF = asyncHandler(async (req, res) => {
    const report = await TestReport.findById(req.params.id)
        .populate('patient', 'name gender age contact')
        .populate('technician', 'name')
        .populate('verifiedBy', 'name')
        .populate('lab', 'name contact logo settings');

    if (!report) {
        res.status(404);
        throw new Error('Report not found');
    }

    const doc = new PDFDocument();
    const filename = `report_${report.reportId}.pdf`;
    const filepath = path.join('uploads', 'reports', filename);

    // Ensure directory exists
    if (!fs.existsSync(path.join('uploads', 'reports'))) {
        fs.mkdirSync(path.join('uploads', 'reports'), { recursive: true });
    }

    // Pipe PDF to file
    doc.pipe(fs.createWriteStream(filepath));

    // Add content to PDF
    // Header
    if (report.lab.logo) {
        doc.image(report.lab.logo, 50, 45, { width: 50 });
    }
    doc.fontSize(20).text(report.lab.name, 120, 50);
    doc.fontSize(10).text(report.lab.settings.reportHeader || '', 120, 70);

    // Patient Info
    doc.moveDown();
    doc.fontSize(12).text(`Name: ${report.patient.name}`);
    doc.text(`Gender: ${report.patient.gender}`);
    doc.text(`Age: ${report.patient.age}`);
    doc.text(`Report ID: ${report.reportId}`);
    doc.text(`Date: ${report.createdAt.toLocaleDateString()}`);

    // Test Results
    doc.moveDown();
    doc.fontSize(14).text('Test Results', { underline: true });
    doc.moveDown();

    // Parameters table
    const startX = 50;
    let startY = doc.y;
    const rowHeight = 25;
    const colWidths = [200, 100, 150, 100];

    // Table headers
    doc.fontSize(10);
    doc.text('Parameter', startX, startY);
    doc.text('Result', startX + colWidths[0], startY);
    doc.text('Reference Range', startX + colWidths[0] + colWidths[1], startY);
    doc.text('Status', startX + colWidths[0] + colWidths[1] + colWidths[2], startY);

    startY += rowHeight;

    // Table rows
    report.parameters.forEach(param => {
        doc.text(param.name, startX, startY);
        doc.text(param.value, startX + colWidths[0], startY);
        doc.text(param.referenceRange.text || `${param.referenceRange.min} - ${param.referenceRange.max}`, 
            startX + colWidths[0] + colWidths[1], startY);
        doc.text(param.status, startX + colWidths[0] + colWidths[1] + colWidths[2], startY);
        startY += rowHeight;
    });

    // Comments
    if (report.result.remarks) {
        doc.moveDown();
        doc.fontSize(12).text('Remarks:', { underline: true });
        doc.fontSize(10).text(report.result.remarks);
    }

    // Footer
    doc.fontSize(10).text(report.lab.settings.reportFooter || '', 50, doc.page.height - 50);

    // Signatures
    if (report.status === 'verified') {
        doc.text(`Verified by: ${report.verifiedBy.name}`, 
            doc.page.width - 200, doc.page.height - 50);
    }

    doc.end();

    // Update report with PDF URL
    report.reportPdfUrl = filepath;
    await report.save();

    res.json({ 
        message: 'PDF generated successfully',
        pdfUrl: filepath 
    });
});

// @desc    Upload test report attachments
// @route   POST /api/reports/:id/attachments
// @access  Private/Technician
const uploadAttachments = asyncHandler(async (req, res) => {
    const report = await TestReport.findById(req.params.id);

    if (!report) {
        res.status(404);
        throw new Error('Report not found');
    }

    if (!req.files || req.files.length === 0) {
        res.status(400);
        throw new Error('No files uploaded');
    }

    const attachments = req.files.map(file => ({
        filename: file.filename,
        path: file.path,
        uploadedAt: new Date()
    }));

    report.attachments.push(...attachments);
    await report.save();

    res.json(report);
});

module.exports = {
    createTestReport,
    getTestReports,
    getTestReportById,
    updateTestReport,
    generatePDF,
    uploadAttachments
};
