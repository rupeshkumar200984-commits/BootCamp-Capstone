const mongoose = require('mongoose');

const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) {
        console.log('Database connection already active. Skipping duplicate handshake.');
        return;
    }

    try {
        const uri = process.env.MONGODB_URI || 'mongodb://AxonDatabase:Rupesh123456@ac-dlalins-shard-00-00.lyhgt6e.mongodb.net:27017,ac-dlalins-shard-00-01.lyhgt6e.mongodb.net:27017,ac-dlalins-shard-00-02.lyhgt6e.mongodb.net:27017/axon?ssl=true&replicaSet=atlas-dcvsgx-shard-0&authSource=admin&appName=Cluster0';
        console.log('Attempting database handshake connection to MongoDB Atlas Cloud...');

        const conn = await mongoose.connect(uri);
        console.log(`MongoDB Connected Successfully: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Database Connection Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;