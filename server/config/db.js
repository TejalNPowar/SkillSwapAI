const mongoose = require("mongoose");

const connectDB = async () => {
    console.log("Attempting to connect to MongoDB...");

    try {

        const conn = await mongoose.connect(process.env.MONGO_URI);

        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

        return conn;

    } catch (error) {

        console.error("❌ Database Connection Failed");
        console.error(error.message);

        throw error;
    }
};

module.exports = connectDB;