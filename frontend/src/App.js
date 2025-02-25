import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Layout from './components/Layout';
import TechnicianDashboard from './pages/TechnicianDashboard';
import TestReport from './pages/TestReport';
import ReportHistory from './pages/ReportHistory';
import PatientList from './pages/PatientList';
import AddPatient from './pages/AddPatient';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';
import Profile from './pages/Profile';

// MUI Theme
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Import styles
import 'react-toastify/dist/ReactToastify.css';

const theme = createTheme({
    palette: {
        primary: {
            main: '#1976d2',
        },
        secondary: {
            main: '#dc004e',
        },
    },
});

const App = () => {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Router>
                <Routes>
                    {/* Main Routes */}
                    <Route
                        path="/"
                        element={
                            <Layout>
                                <TechnicianDashboard />
                            </Layout>
                        }
                    />
                    <Route
                        path="/reports/new"
                        element={
                            <Layout>
                                <TestReport />
                            </Layout>
                        }
                    />
                    <Route
                        path="/reports/history"
                        element={
                            <Layout>
                                <ReportHistory />
                            </Layout>
                        }
                    />
                    <Route
                        path="/patients"
                        element={
                            <Layout>
                                <PatientList />
                            </Layout>
                        }
                    />
                    <Route
                        path="/patients/add"
                        element={
                            <Layout>
                                <AddPatient />
                            </Layout>
                        }
                    />
                    <Route
                        path="/profile"
                        element={
                            <Layout>
                                <Profile />
                            </Layout>
                        }
                    />
                    {/* 404 Route */}
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </Router>
            <ToastContainer />
        </ThemeProvider>
    );
};

export default App;
