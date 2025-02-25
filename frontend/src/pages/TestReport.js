import React, { useState } from 'react';
import {
    Container,
    Paper,
    Typography,
    TextField,
    Button,
    Grid,
    MenuItem,
    Box,
    Stepper,
    Step,
    StepLabel,
    FormControl,
    InputLabel,
    Select,
    IconButton,
    Alert,
} from '@mui/material';
import {
    Save as SaveIcon,
    Print as PrintIcon,
    Upload as UploadIcon,
    Delete as DeleteIcon,
} from '@mui/icons-material';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const TestReport = () => {
    const [activeStep, setActiveStep] = useState(0);
    const [files, setFiles] = useState([]);
    const [successMessage, setSuccessMessage] = useState('');

    const steps = ['Patient Information', 'Test Details', 'Results & Attachments'];

    const testTypes = [
        'Blood Test',
        'Urine Analysis',
        'COVID-19',
        'Liver Function',
        'Kidney Function',
        'Complete Blood Count',
    ];

    const statusOptions = [
        { value: 'pending', label: 'Pending' },
        { value: 'in_progress', label: 'In Progress' },
        { value: 'completed', label: 'Completed' },
        { value: 'reviewed', label: 'Reviewed' },
    ];

    const formik = useFormik({
        initialValues: {
            patientName: '',
            patientAge: '',
            patientGender: '',
            patientContact: '',
            testType: '',
            testDate: '',
            status: 'pending',
            results: '',
            remarks: '',
        },
        validationSchema: Yup.object({
            patientName: Yup.string().required('Required'),
            patientAge: Yup.number().required('Required').positive('Must be positive'),
            patientGender: Yup.string().required('Required'),
            patientContact: Yup.string().required('Required'),
            testType: Yup.string().required('Required'),
            testDate: Yup.date().required('Required'),
            status: Yup.string().required('Required'),
            results: Yup.string(),
            remarks: Yup.string(),
        }),
        onSubmit: (values) => {
            console.log('Form Values:', values);
            console.log('Attached Files:', files);
            setSuccessMessage('Report saved successfully!');
        },
    });

    const handleFileUpload = (event) => {
        const newFiles = Array.from(event.target.files);
        setFiles([...files, ...newFiles]);
    };

    const handleFileDelete = (index) => {
        setFiles(files.filter((_, i) => i !== index));
    };

    const handleNext = () => {
        setActiveStep((prevStep) => prevStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevStep) => prevStep - 1);
    };

    const getStepContent = (step) => {
        switch (step) {
            case 0:
                return (
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                name="patientName"
                                label="Patient Name"
                                value={formik.values.patientName}
                                onChange={formik.handleChange}
                                error={formik.touched.patientName && Boolean(formik.errors.patientName)}
                                helperText={formik.touched.patientName && formik.errors.patientName}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                name="patientAge"
                                label="Age"
                                type="number"
                                value={formik.values.patientAge}
                                onChange={formik.handleChange}
                                error={formik.touched.patientAge && Boolean(formik.errors.patientAge)}
                                helperText={formik.touched.patientAge && formik.errors.patientAge}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel>Gender</InputLabel>
                                <Select
                                    name="patientGender"
                                    value={formik.values.patientGender}
                                    onChange={formik.handleChange}
                                    error={formik.touched.patientGender && Boolean(formik.errors.patientGender)}
                                >
                                    <MenuItem value="male">Male</MenuItem>
                                    <MenuItem value="female">Female</MenuItem>
                                    <MenuItem value="other">Other</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                name="patientContact"
                                label="Contact Number"
                                value={formik.values.patientContact}
                                onChange={formik.handleChange}
                                error={formik.touched.patientContact && Boolean(formik.errors.patientContact)}
                                helperText={formik.touched.patientContact && formik.errors.patientContact}
                            />
                        </Grid>
                    </Grid>
                );
            case 1:
                return (
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel>Test Type</InputLabel>
                                <Select
                                    name="testType"
                                    value={formik.values.testType}
                                    onChange={formik.handleChange}
                                    error={formik.touched.testType && Boolean(formik.errors.testType)}
                                >
                                    {testTypes.map((type) => (
                                        <MenuItem key={type} value={type}>
                                            {type}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                name="testDate"
                                label="Test Date"
                                type="date"
                                value={formik.values.testDate}
                                onChange={formik.handleChange}
                                InputLabelProps={{ shrink: true }}
                                error={formik.touched.testDate && Boolean(formik.errors.testDate)}
                                helperText={formik.touched.testDate && formik.errors.testDate}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel>Status</InputLabel>
                                <Select
                                    name="status"
                                    value={formik.values.status}
                                    onChange={formik.handleChange}
                                >
                                    {statusOptions.map((option) => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                );
            case 2:
                return (
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                multiline
                                rows={4}
                                name="results"
                                label="Test Results"
                                value={formik.values.results}
                                onChange={formik.handleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                multiline
                                rows={2}
                                name="remarks"
                                label="Remarks"
                                value={formik.values.remarks}
                                onChange={formik.handleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button
                                variant="outlined"
                                component="label"
                                startIcon={<UploadIcon />}
                            >
                                Upload Attachments
                                <input
                                    type="file"
                                    hidden
                                    multiple
                                    onChange={handleFileUpload}
                                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                                />
                            </Button>
                            <Box sx={{ mt: 2 }}>
                                {files.map((file, index) => (
                                    <Box
                                        key={index}
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            mt: 1,
                                        }}
                                    >
                                        <Typography>{file.name}</Typography>
                                        <IconButton
                                            size="small"
                                            onClick={() => handleFileDelete(index)}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </Box>
                                ))}
                            </Box>
                        </Grid>
                    </Grid>
                );
            default:
                return 'Unknown step';
        }
    };

    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <Paper sx={{ p: 4 }}>
                <Typography variant="h5" gutterBottom>
                    Create Test Report
                </Typography>

                {successMessage && (
                    <Alert severity="success" sx={{ mb: 2 }}>
                        {successMessage}
                    </Alert>
                )}

                <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>

                <form onSubmit={formik.handleSubmit}>
                    {getStepContent(activeStep)}

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                        <Button
                            disabled={activeStep === 0}
                            onClick={handleBack}
                        >
                            Back
                        </Button>
                        <Box>
                            <Button
                                variant="contained"
                                startIcon={<PrintIcon />}
                                sx={{ mr: 1 }}
                                disabled={!formik.isValid}
                            >
                                Print
                            </Button>
                            {activeStep === steps.length - 1 ? (
                                <Button
                                    variant="contained"
                                    startIcon={<SaveIcon />}
                                    type="submit"
                                    disabled={!formik.isValid}
                                >
                                    Save Report
                                </Button>
                            ) : (
                                <Button
                                    variant="contained"
                                    onClick={handleNext}
                                    disabled={!formik.isValid}
                                >
                                    Next
                                </Button>
                            )}
                        </Box>
                    </Box>
                </form>
            </Paper>
        </Container>
    );
};

export default TestReport;
