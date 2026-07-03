const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const swapRoutes = require("./routes/swapRoutes");

const app = express();
app.use(express.json());
connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/swaps", swapRoutes);

// Middleware
app.use(cors());



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