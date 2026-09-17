const mongoose = require("mongoose");

const connectDB = async () => {
    console.log("Attempting to connect to MongoDB...");

    try {

        const conn = await mongoose.connect(process.env.MONGO_URI);

        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
        console.log(`📦 Database Name: ${conn.connection.name}`);
        console.log(`🔗 MongoDB URI Host: ${new URL(process.env.MONGO_URI).hostname}`);

        return conn;

    } catch (error) {

        console.error("❌ Database Connection Failed");
        console.error(error.message);

        throw error;
    }
};

module.exports = connectDB;