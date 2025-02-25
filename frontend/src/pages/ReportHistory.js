import React, { useState } from 'react';
import {
    Container,
    Paper,
    Typography,
    TextField,
    Button,
    Grid,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Box,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from '@mui/material';
import {
    Search as SearchIcon,
    Visibility as ViewIcon,
    Print as PrintIcon,
    Download as DownloadIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const ReportHistory = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useState({
        patientName: '',
        testType: '',
        dateFrom: '',
        dateTo: '',
        status: '',
    });

    // Mock data for demonstration
    const reports = [
        {
            id: 1,
            patientName: 'John Doe',
            testType: 'Blood Test',
            date: '2024-03-01',
            status: 'Completed',
            doctor: 'Dr. Smith',
        },
        {
            id: 2,
            patientName: 'Jane Smith',
            testType: 'Urine Analysis',
            date: '2024-03-02',
            status: 'Pending',
            doctor: 'Dr. Johnson',
        },
    ];

    const handleSearch = () => {
        console.log('Search params:', searchParams);
    };

    const handleViewReport = (reportId) => {
        navigate(`/reports/${reportId}`);
    };

    const handlePrintReport = (reportId) => {
        console.log('Print report:', reportId);
    };

    const handleDownloadReport = (reportId) => {
        console.log('Download report:', reportId);
    };

    const handleClearFilters = () => {
        setSearchParams({
            patientName: '',
            testType: '',
            dateFrom: '',
            dateTo: '',
            status: '',
        });
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Paper sx={{ p: 4 }}>
                <Typography variant="h5" gutterBottom>
                    Report History
                </Typography>

                {/* Search Filters */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={12} sm={6} md={3}>
                        <TextField
                            fullWidth
                            label="Patient Name"
                            value={searchParams.patientName}
                            onChange={(e) =>
                                setSearchParams({ ...searchParams, patientName: e.target.value })
                            }
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <FormControl fullWidth>
                            <InputLabel>Test Type</InputLabel>
                            <Select
                                value={searchParams.testType}
                                onChange={(e) =>
                                    setSearchParams({ ...searchParams, testType: e.target.value })
                                }
                            >
                                <MenuItem value="">All</MenuItem>
                                <MenuItem value="blood">Blood Test</MenuItem>
                                <MenuItem value="urine">Urine Analysis</MenuItem>
                                <MenuItem value="covid">COVID-19</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6} md={2}>
                        <TextField
                            fullWidth
                            label="From Date"
                            type="date"
                            value={searchParams.dateFrom}
                            onChange={(e) =>
                                setSearchParams({ ...searchParams, dateFrom: e.target.value })
                            }
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={2}>
                        <TextField
                            fullWidth
                            label="To Date"
                            type="date"
                            value={searchParams.dateTo}
                            onChange={(e) =>
                                setSearchParams({ ...searchParams, dateTo: e.target.value })
                            }
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={2}>
                        <FormControl fullWidth>
                            <InputLabel>Status</InputLabel>
                            <Select
                                value={searchParams.status}
                                onChange={(e) =>
                                    setSearchParams({ ...searchParams, status: e.target.value })
                                }
                            >
                                <MenuItem value="">All</MenuItem>
                                <MenuItem value="pending">Pending</MenuItem>
                                <MenuItem value="completed">Completed</MenuItem>
                                <MenuItem value="reviewed">Reviewed</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>

                {/* Search Actions */}
                <Box sx={{ mb: 4, display: 'flex', gap: 2 }}>
                    <Button
                        variant="contained"
                        startIcon={<SearchIcon />}
                        onClick={handleSearch}
                    >
                        Search
                    </Button>
                    <Button
                        variant="outlined"
                        onClick={handleClearFilters}
                    >
                        Clear Filters
                    </Button>
                </Box>

                {/* Results Table */}
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Patient Name</TableCell>
                                <TableCell>Test Type</TableCell>
                                <TableCell>Date</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Doctor</TableCell>
                                <TableCell align="center">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {reports.map((report) => (
                                <TableRow key={report.id}>
                                    <TableCell>{report.patientName}</TableCell>
                                    <TableCell>{report.testType}</TableCell>
                                    <TableCell>{report.date}</TableCell>
                                    <TableCell>{report.status}</TableCell>
                                    <TableCell>{report.doctor}</TableCell>
                                    <TableCell align="center">
                                        <IconButton
                                            color="primary"
                                            onClick={() => handleViewReport(report.id)}
                                        >
                                            <ViewIcon />
                                        </IconButton>
                                        <IconButton
                                            color="primary"
                                            onClick={() => handlePrintReport(report.id)}
                                        >
                                            <PrintIcon />
                                        </IconButton>
                                        <IconButton
                                            color="primary"
                                            onClick={() => handleDownloadReport(report.id)}
                                        >
                                            <DownloadIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </Container>
    );
};

export default ReportHistory;
