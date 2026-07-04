const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {

    try {

        console.log("Headers:", req.headers);
        console.log("Authorization:", req.headers.authorization);

        // Get Authorization Header
        const authHeader = req.headers.authorization;

        // Check if token exists
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Access denied. No token provided."
            });
        }

        // Extract token
        const token = authHeader.split(" ")[1];

        console.log("Received Token:", token);
        console.log("JWT Secret:", process.env.JWT_SECRET);

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        console.log("Decoded Token:", decoded);

        // Save decoded user into request
        req.user = decoded;
        
        // Continue to controller
        next();

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token."
        });
    }
};

module.exports = authMiddleware;