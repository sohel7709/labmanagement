import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Container, Typography, Button, Box } from '@mui/material';

const NotFound = () => {
    return (
        <Container>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '100vh'
                }}
            >
                <Typography variant="h1" component="h1" gutterBottom>
                    404
                </Typography>
                <Typography variant="h5" component="h2" gutterBottom>
                    Page Not Found
                </Typography>
                <Typography variant="body1" gutterBottom>
                    The page you are looking for does not exist.
                </Typography>
                <Button
                    component={RouterLink}
                    to="/"
                    variant="contained"
                    sx={{ mt: 2 }}
                >
                    Go to Home
                </Button>
            </Box>
        </Container>
    );
};

export default NotFound;
