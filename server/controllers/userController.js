const User = require("../models/User");

// Get all users except the logged-in user
const getAllUsers = async (req, res) => {
    try {

        const users = await User.find({
            _id: { $ne: req.user.id }   // Exclude logged-in user
        }).select("-password");

        return res.status(200).json({
            success: true,
            count: users.length,
            users
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }
};


// Existing getAllUsers...

const getUserById = async (req, res) => {
    try {

        const user = await User.findById(req.params.id)
            .select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            user
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }
};


module.exports = {
    getAllUsers,
    getUserById
};