const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');
const path = require('path');
const { protect } = require('./middleware/mockAuthMiddleware');

// Route imports
const testReportRoutes = require('./routes/testReportRoutes');
const patientRoutes = require('./routes/patientRoutes');

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Apply mock auth middleware to all routes
app.use(protect);

// Routes
app.use('/api/reports', testReportRoutes);
app.use('/api/patients', patientRoutes);

app.get('/', (req, res) => {
    res.send('API is running...');
});

// Simple error handler
app.use((err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
});

// Start server with port fallback
const startServer = async () => {
    const ports = [5000, 5001, 5002, 5003, 5004];
    
    for (const port of ports) {
        try {
            await new Promise((resolve, reject) => {
                const server = app.listen(port)
                    .once('listening', () => {
                        console.log(`Server running on port ${port}`);
                        resolve();
                    })
                    .once('error', (err) => {
                        if (err.code === 'EADDRINUSE') {
                            server.close();
                            reject(new Error(`Port ${port} is in use`));
                        } else {
                            reject(err);
                        }
                    });
            });
            break; // If successful, exit the loop
        } catch (err) {
            console.log(err.message);
            if (port === ports[ports.length - 1]) {
                console.error('No available ports found');
                process.exit(1);
            }
        }
    }
};

startServer();
