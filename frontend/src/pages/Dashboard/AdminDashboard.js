import React from 'react';
import { Container, Typography, Grid, Paper, Box } from '@mui/material';
import { useHistory } from 'react-router-dom';

const AdminDashboard = () => {
  const history = useHistory();

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>
          Admin Dashboard
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Paper
              sx={{
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                height: 240,
                cursor: 'pointer',
              }}
              onClick={() => history.push('/technicians')}
            >
              <Typography variant="h6" gutterBottom>
                Technicians
              </Typography>
              <Typography variant="h3" component="div">
                0
              </Typography>
              <Typography color="text.secondary">
                Active technicians
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper
              sx={{
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                height: 240,
                cursor: 'pointer',
              }}
              onClick={() => history.push('/reports')}
            >
              <Typography variant="h6" gutterBottom>
                Reports
              </Typography>
              <Typography variant="h3" component="div">
                0
              </Typography>
              <Typography color="text.secondary">
                Total test reports
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper
              sx={{
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                height: 240,
              }}
            >
              <Typography variant="h6" gutterBottom>
                Revenue
              </Typography>
              <Typography variant="h3" component="div">
                $0
              </Typography>
              <Typography color="text.secondary">
                Monthly revenue
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper
              sx={{
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                minHeight: 240,
              }}
            >
              <Typography variant="h6" gutterBottom>
                Recent Activity
              </Typography>
              <Typography color="text.secondary">
                No recent activity
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default AdminDashboard;
