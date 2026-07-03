const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const connectDB = require("./config/db");

const app = express();
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

// Default Route
app.get("/", (req, res) => {
    res.send("🚀 SkillSwap AI Backend is Running...");
});

// Server Port
const PORT = process.env.PORT || 5000;



// Start Server
app.listen(PORT, () => {
    console.log(`✅ Server is running on http://localhost:${PORT}`);
});