const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load env vars
dotenv.config();

const dropDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        await mongoose.connection.dropDatabase();
        console.log('Database dropped successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error dropping database:', error);
        process.exit(1);
    }
};

dropDatabase();
