const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const swapRoutes = require("./routes/swapRoutes");
const userRoutes = require("./routes/userRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const sessionRoutes = require("./routes/sessionRoutes");
const googleAuthRoutes = require("./routes/googleAuthRoutes");
const meetRoutes = require("./routes/meetRoutes");

const app = express();

// Middleware
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));

app.use(express.json());

app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// Routes
app.use("/api/auth", authRoutes);
app.get("/api/test-google", (req, res) => {
    res.send("Google route system is working!");
});
app.use("/api/auth/google", googleAuthRoutes);
app.use("/api/swaps", swapRoutes);
app.use("/api/users", userRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/meet", meetRoutes);

// Default Route
app.get("/", (req, res) => {
    res.send("🚀 SkillSwap AI Backend is Running...");
});

// Server Port
const PORT = process.env.PORT || 5000;

// Start Server
const startServer = async () => {
    try {
        await connectDB();

        app.listen(PORT, () => {
            console.log(`✅ Server is running on http://localhost:${PORT}`);
        });

    } catch (error) {
        console.error("Failed to start server");
        console.error(error);
    }
};

startServer();