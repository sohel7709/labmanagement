  import React, { useState } from 'react';
import {
    Container,
    Paper,
    Typography,
    TextField,
    Button,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Alert,
    Box,
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from '../utils/axios';
import { useNavigate } from 'react-router-dom';
import { PersonAdd as PersonAddIcon } from '@mui/icons-material';

const AddPatient = () => {
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const formik = useFormik({
        initialValues: {
            name: '',
            age: '',
            gender: '',
            phone: '',
        },
        validationSchema: Yup.object({
            name: Yup.string()
                .required('Required')
                .min(2, 'Must be at least 2 characters'),
            age: Yup.number()
                .required('Required')
                .positive('Must be a positive number')
                .integer('Must be a whole number'),
            gender: Yup.string()
                .required('Required')
                .oneOf(['male', 'female', 'other'], 'Invalid gender'),
            phone: Yup.string()
                .required('Required')
                .matches(/^\d{10}$/, 'Phone number must be exactly 10 digits'),
        }),
        onSubmit: async (values, { resetForm }) => {
            try {
                setError('');
                const response = await axios.post('/api/patients', values);
                setSuccess('Patient added successfully!');
                resetForm();
                setTimeout(() => {
                    navigate('/patients');
                }, 2000);
            } catch (err) {
                console.error('Error details:', err.response?.data);
                setError(err.response?.data?.message || 'Error adding patient');
            }
        },
    });

    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <Paper elevation={3} sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <PersonAddIcon sx={{ fontSize: 32, mr: 2 }} />
                    <Typography variant="h5">Add New Patient</Typography>
                </Box>

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                {success && (
                    <Alert severity="success" sx={{ mb: 2 }}>
                        {success}
                    </Alert>
                )}

                <form onSubmit={formik.handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                id="name"
                                name="name"
                                label="Patient Name"
                                value={formik.values.name}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.name && Boolean(formik.errors.name)}
                                helperText={formik.touched.name && formik.errors.name}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                id="age"
                                name="age"
                                label="Age"
                                type="number"
                                value={formik.values.age}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.age && Boolean(formik.errors.age)}
                                helperText={formik.touched.age && formik.errors.age}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <FormControl 
                                fullWidth
                                error={formik.touched.gender && Boolean(formik.errors.gender)}
                            >
                                <InputLabel>Gender</InputLabel>
                                <Select
                                    id="gender"
                                    name="gender"
                                    value={formik.values.gender}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    label="Gender"
                                >
                                    <MenuItem value="male">Male</MenuItem>
                                    <MenuItem value="female">Female</MenuItem>
                                    <MenuItem value="other">Other</MenuItem>
                                </Select>
                                {formik.touched.gender && formik.errors.gender && (
                                    <Typography variant="caption" color="error">
                                        {formik.errors.gender}
                                    </Typography>
                                )}
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                id="phone"
                                name="phone"
                                label="Phone Number"
                                value={formik.values.phone}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.phone && Boolean(formik.errors.phone)}
                                helperText={formik.touched.phone && formik.errors.phone}
                            />
                        </Grid>
                    </Grid>

                    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                        <Button
                            variant="outlined"
                            onClick={() => navigate('/patients')}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={!formik.isValid || formik.isSubmitting}
                        >
                            Add Patient
                        </Button>
                    </Box>
                </form>
            </Paper>
        </Container>
    );
};

export default AddPatient;
