const mongoose = require('mongoose');
const Patient = require('../models/patientModel');
require('dotenv').config();

const logPatients = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        const patients = await Patient.find({});
        console.log('Existing Patients:', patients);
        process.exit(0);
    } catch (error) {
        console.error('Error logging patients:', error);
        process.exit(1);
    }
};

logPatients();
