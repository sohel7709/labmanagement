import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Layout from './components/Layout';
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
                                <Dashboard />
                            </Layout>
                        }
                    />

                    <Route
                        path="/reports"
                        element={
                            <Layout>
                                {/* <Reports /> */}
                            </Layout>
                        }
                    />

                    <Route
                        path="/patients"
                        element={
                            <Layout>
                                {/* <Patients /> */}
                            </Layout>
                        }
                    />

                    <Route
                        path="/settings"
                        element={
                            <Layout>
                                {/* <Settings /> */}
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
