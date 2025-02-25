const mongoose = require('mongoose');
require('dotenv').config();

const dropCollection = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        await mongoose.connection.dropCollection('patients');
        console.log('Patients collection dropped successfully');
        process.exit(0);
    } catch (error) {
        if (error.code === 26) {
            console.log('Collection does not exist, proceeding...');
            process.exit(0);
        } else {
            console.error('Error:', error);
            process.exit(1);
        }
    }
};

dropCollection();
