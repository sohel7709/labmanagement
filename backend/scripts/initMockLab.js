const mongoose = require('mongoose');
const Lab = require('../models/labModel');
require('dotenv').config();

const createMockLab = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        const mockLab = new Lab({
            _id: '000000000000000000000001', // Match the ID used in mockAuthMiddleware
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
        console.log('Mock lab created successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error creating mock lab:', error);
        process.exit(1);
    }
};

createMockLab();
