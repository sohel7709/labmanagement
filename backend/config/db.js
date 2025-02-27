const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log(`MongoDB Connected: ${conn.connection.host}`);

        // Add middleware to handle lab context in queries
        mongoose.plugin(schema => {
            schema.pre('find', function() {
                const labContext = this.getQuery().lab;
                if (!labContext && this.model.modelName !== 'Lab') {
                    const user = this.options?.user;
                    if (user && user.role !== 'super_admin') {
                        this.where({ lab: user.lab });
                    }
                }
            });

            schema.pre('findOne', function() {
                const labContext = this.getQuery().lab;
                if (!labContext && this.model.modelName !== 'Lab') {
                    const user = this.options?.user;
                    if (user && user.role !== 'super_admin') {
                        this.where({ lab: user.lab });
                    }
                }
            });

            schema.pre('save', function() {
                if (!this.lab && this.constructor.modelName !== 'Lab') {
                    const user = this.options?.user;
                    if (user && user.role !== 'super_admin') {
                        this.lab = user.lab;
                    }
                }
            });
        });

    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
