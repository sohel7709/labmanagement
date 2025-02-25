const mongoose = require('mongoose');
require('dotenv').config();

const resetDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        // Drop the patients collection
        await mongoose.connection.db.dropCollection('patients');
        console.log('Patients collection dropped successfully');

        // Drop the labs collection
        await mongoose.connection.db.dropCollection('labs');
        console.log('Labs collection dropped successfully');

        // Create mock lab again
        const Lab = require('../models/labModel');
        const mockLab = new Lab({
            _id: '000000000000000000000001',
            name: 'Development Lab',
            licenseNumber: 'DEV123456',
            address: {
                street: '123 Dev Street',
                city: 'Dev City',
                state: 'Dev State',
                zipCode: '12345',
                country: 'Dev Country'
            },
            contact: {
                phone: '1234567890',
                email: 'dev@example.com',
                website: 'www.devlab.com'
            }
        });

        await mockLab.save();
        console.log('Mock lab recreated successfully');

        process.exit(0);
    } catch (error) {
        console.error('Error resetting database:', error);
        process.exit(1);
    }
};

resetDatabase();
