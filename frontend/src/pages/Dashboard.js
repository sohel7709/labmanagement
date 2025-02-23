import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Button, Box } from '@mui/material';

const Dashboard = () => {
    const navigate = useNavigate();

    // Mock user for development
    const mockUser = {
        name: 'Development User',
        email: 'dev@example.com',
        role: 'super_admin'
    };

    return (
        <Container>
            <Box sx={{ mt: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Welcome, {mockUser.name}
                </Typography>
                <Typography variant="h6" gutterBottom>
                    Role: {mockUser.role}
                </Typography>
                <Button variant="contained" onClick={() => navigate('/reports')}>
                    View Reports
                </Button>
            </Box>
        </Container>
    );
};

export default Dashboard;
