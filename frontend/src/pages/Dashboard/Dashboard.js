import React from 'react';
import { Container, Typography, Grid, Paper, Box } from '@mui/material';
import { useHistory } from 'react-router-dom';

const Dashboard = () => {
  const history = useHistory();

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>
          Dashboard
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
              onClick={() => history.push('/patients')}
            >
              <Typography variant="h6" gutterBottom>
                Patients
              </Typography>
              <Typography variant="h3" component="div">
                0
              </Typography>
              <Typography color="text.secondary">
                Total registered patients
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
                Pending
              </Typography>
              <Typography variant="h3" component="div">
                0
              </Typography>
              <Typography color="text.secondary">
                Reports pending review
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Dashboard;
