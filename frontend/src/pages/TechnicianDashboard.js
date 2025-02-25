import React, { useState } from 'react';
import {
    Container,
    Grid,
    Paper,
    Typography,
    Box,
    Card,
    CardContent,
    CardActions,
    Button,
    IconButton,
    Divider,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Badge,
} from '@mui/material';
import {
    Assignment as AssignmentIcon,
    Notifications as NotificationsIcon,
    PendingActions as PendingIcon,
    CheckCircle as CompletedIcon,
    LocalHospital as TestIcon,
    Search as SearchIcon,
    History as HistoryIcon,
    Print as PrintIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const TechnicianDashboard = () => {
    const navigate = useNavigate();
    const [notifications] = useState(5); // Mock notifications count

    // Mock data for dashboard
    const stats = {
        totalReports: 150,
        pendingReports: 25,
        completedToday: 15,
        recentTests: [
            { id: 1, patient: 'John Doe', test: 'Blood Test', status: 'Pending' },
            { id: 2, patient: 'Jane Smith', test: 'Urine Analysis', status: 'Completed' },
            { id: 3, patient: 'Mike Johnson', test: 'COVID-19', status: 'In Progress' },
        ],
    };

    const DashboardCard = ({ title, value, icon, color }) => (
        <Card sx={{ height: '100%' }}>
            <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6" color="textSecondary">
                        {title}
                    </Typography>
                    <IconButton sx={{ backgroundColor: `${color}20`, color }}>
                        {icon}
                    </IconButton>
                </Box>
                <Typography variant="h4" sx={{ mt: 2 }}>
                    {value}
                </Typography>
            </CardContent>
        </Card>
    );

    const QuickActions = () => (
        <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
                Quick Actions
            </Typography>
            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <Button
                        fullWidth
                        variant="contained"
                        startIcon={<AssignmentIcon />}
                        onClick={() => navigate('/reports/new')}
                    >
                        New Report
                    </Button>
                </Grid>
                <Grid item xs={6}>
                    <Button
                        fullWidth
                        variant="contained"
                        startIcon={<SearchIcon />}
                        onClick={() => navigate('/reports/search')}
                    >
                        Search Reports
                    </Button>
                </Grid>
                <Grid item xs={6}>
                    <Button
                        fullWidth
                        variant="contained"
                        startIcon={<HistoryIcon />}
                        onClick={() => navigate('/reports/history')}
                    >
                        View History
                    </Button>
                </Grid>
                <Grid item xs={6}>
                    <Button
                        fullWidth
                        variant="contained"
                        startIcon={<PrintIcon />}
                        onClick={() => navigate('/reports/print')}
                    >
                        Print Reports
                    </Button>
                </Grid>
            </Grid>
        </Paper>
    );

    const RecentTests = () => (
        <Paper sx={{ p: 2, mt: 2 }}>
            <Typography variant="h6" gutterBottom>
                Recent Tests
            </Typography>
            <List>
                {stats.recentTests.map((test) => (
                    <React.Fragment key={test.id}>
                        <ListItem>
                            <ListItemIcon>
                                <TestIcon />
                            </ListItemIcon>
                            <ListItemText
                                primary={test.patient}
                                secondary={`${test.test} - ${test.status}`}
                            />
                            <Button
                                variant="outlined"
                                size="small"
                                onClick={() => navigate(`/reports/${test.id}`)}
                            >
                                View
                            </Button>
                        </ListItem>
                        <Divider />
                    </React.Fragment>
                ))}
            </List>
        </Paper>
    );

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={3}>
                {/* Header with notifications */}
                <Grid item xs={12}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Typography variant="h4">Lab Technician Dashboard</Typography>
                        <IconButton color="inherit">
                            <Badge badgeContent={notifications} color="error">
                                <NotificationsIcon />
                            </Badge>
                        </IconButton>
                    </Box>
                </Grid>

                {/* Statistics Cards */}
                <Grid item xs={12} md={4}>
                    <DashboardCard
                        title="Total Reports"
                        value={stats.totalReports}
                        icon={<AssignmentIcon />}
                        color="#1976d2"
                    />
                </Grid>
                <Grid item xs={12} md={4}>
                    <DashboardCard
                        title="Pending Reports"
                        value={stats.pendingReports}
                        icon={<PendingIcon />}
                        color="#ed6c02"
                    />
                </Grid>
                <Grid item xs={12} md={4}>
                    <DashboardCard
                        title="Completed Today"
                        value={stats.completedToday}
                        icon={<CompletedIcon />}
                        color="#2e7d32"
                    />
                </Grid>

                {/* Quick Actions */}
                <Grid item xs={12} md={6}>
                    <QuickActions />
                </Grid>

                {/* Recent Tests */}
                <Grid item xs={12} md={6}>
                    <RecentTests />
                </Grid>
            </Grid>
        </Container>
    );
};

export default TechnicianDashboard;
