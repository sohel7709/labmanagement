const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const { errorHandler, notFound } = require('./middleware/errorMiddleware');
const loggingMiddleware = require('./middleware/loggingMiddleware');

// Import routes
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const technicianRoutes = require('./routes/technicianRoutes');
const reportRoutes = require('./routes/reportRoutes');
const patientRoutes = require('./routes/patientRoutes');
const superAdminRoutes = require('./routes/superAdminRoutes');

// Load env vars
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

mongoose.connection.on('connected', () => {
    console.log('MongoDB Connected:', mongoose.connection.host);
});

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(loggingMiddleware);

// Mount routes - Order matters!
// Mount superAdmin routes first as they are more specific
app.use('/api/superadmin', superAdminRoutes);  // Changed from /api to /api/superadmin

// Mount other routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/technician', technicianRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/patients', patientRoutes);

// API Documentation
app.get('/api/docs', (req, res) => {
    res.sendFile(path.join(__dirname, 'docs', 'api.html'));
});

// Error handling
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const MODE = process.env.NODE_ENV || 'development';

app.listen(PORT, () => {
    console.log(`Server running in ${MODE} mode on port ${PORT}`);
    console.log(`Documentation available at http://localhost:${PORT}/api/docs`);
});
