const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Lab = require('../models/labModel');
const User = require('../models/userModel');

// Load env vars
dotenv.config();

// Connect to MongoDB with specific database name
const dbName = 'labmanagement';
const mongoUri = process.env.MONGO_URI.replace(/\/[^/]*$/, `/${dbName}`);

const initDb = async () => {
    try {
        await mongoose.connect(mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        // Clear existing data
        await Lab.deleteMany();
        await User.deleteMany();

        console.log('Existing data cleared...');

        // Create default lab
        const defaultLab = await Lab.create({
            name: 'System Lab',
            address: 'System Address',
            contact: '0000000000',
            email: 'system@labmanagement.com',
            status: 'active',
            subscription: 'enterprise'
        });

        console.log('Default lab created...');

        // Create super admin user
        const superAdmin = await User.create({
            lab: defaultLab._id,
            name: 'Super Admin',
            email: 'admin@labmanagement.com',
            password: 'admin123',
            role: 'super_admin',
            status: 'active'
        });

        console.log('Super admin user created...');

        // Create sample admin user
        const admin = await User.create({
            lab: defaultLab._id,
            name: 'Sample Admin',
            email: 'admin@systemlab.com',
            password: 'admin123',
            role: 'admin',
            status: 'active'
        });

        console.log('Sample admin user created...');

        // Create sample technician user
        const technician = await User.create({
            lab: defaultLab._id,
            name: 'Sample Technician',
            email: 'tech@systemlab.com',
            password: 'admin123',
            role: 'technician',
            status: 'active'
        });

        console.log('Sample technician user created...');

        console.log('Database initialized successfully!');
        console.log({
            superAdmin: {
                email: superAdmin.email,
                password: 'admin123'
            },
            admin: {
                email: admin.email,
                password: 'admin123'
            },
            technician: {
                email: technician.email,
                password: 'admin123'
            }
        });

        process.exit(0);
    } catch (error) {
        console.error('Error initializing database:', error);
        process.exit(1);
    }
};

initDb();
