const SwapRequest = require("../models/SwapRequest");
const User = require("../models/User");

const sendSwapRequest = async (req, res) => {
    try {

        const {
            receiverId,
            offeredSkill,
            requestedSkill,
            message
        } = req.body;

        const senderId = req.user.id;

       

        // Validate required fields
        if (!receiverId || !offeredSkill || !requestedSkill) {
            return res.status(400).json({
                success: false,
                message: "All required fields must be provided."
            });
        }

        // Check if receiver exists
        const receiver = await User.findById(receiverId);

        if (!receiver) {
            return res.status(404).json({
                success: false,
                message: "Receiver not found."
            });
        }

        // Prevent sending request to yourself
        if (senderId === receiverId) {
            return res.status(400).json({
                success: false,
                message: "You cannot send a swap request to yourself."
            });
        }

        // Create Swap Request
        const swapRequest = await SwapRequest.create({
            sender: senderId,
            receiver: receiverId,
            offeredSkill,
            requestedSkill,
            message
        });

        return res.status(201).json({
            success: true,
            message: "Swap request sent successfully.",
            swapRequest
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }
};


const getReceivedRequests = async (req, res) => {
    try {

        // Logged-in user
        const receiverId = req.user.id;

        // Find all requests received by this user
        const requests = await SwapRequest.find({
            receiver: receiverId
        }).populate(
            "sender",
            "name email college department"
        );

        return res.status(200).json({
            success: true,
            count: requests.length,
            requests
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
    sendSwapRequest,
    getReceivedRequests
};