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


const acceptSwapRequest = async (req, res) => {
    try {

        // Get Swap Request ID from URL
        const swapRequestId = req.params.id;

        // Find the swap request
        const swapRequest = await SwapRequest.findById(swapRequestId);

        // Check if request exists
        if (!swapRequest) {
            return res.status(404).json({
                success: false,
                message: "Swap request not found."
            });
        }

        // Check if logged-in user is the receiver
        if (swapRequest.receiver.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to accept this request."
            });
        }

        // Prevent accepting an already processed request
        if (swapRequest.status !== "Pending") {
            return res.status(400).json({
                success: false,
                message: "This request has already been processed."
            });
        }

        // Accept the request
        swapRequest.status = "Accepted";

        await swapRequest.save();

        return res.status(200).json({
            success: true,
            message: "Swap request accepted successfully.",
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


const rejectSwapRequest = async (req, res) => {
    try {

        // Get Swap Request ID from URL
        const swapRequestId = req.params.id;

        // Find the swap request
        const swapRequest = await SwapRequest.findById(swapRequestId);

        // Check if request exists
        if (!swapRequest) {
            return res.status(404).json({
                success: false,
                message: "Swap request not found."
            });
        }

        // Check if logged-in user is the receiver
        if (swapRequest.receiver.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to rejected this request."
            });
        }

        // Prevent accepting an already processed request
        if (swapRequest.status !== "Pending") {
            return res.status(400).json({
                success: false,
                message: "This request has already been processed."
            });
        }

        // Reject the request
        swapRequest.status = "Rejected";

        await swapRequest.save();

        return res.status(200).json({
            success: true,
            message: "Swap request rejected successfully.",
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


const getSentRequests = async (req, res) => {
    try {

        const sentRequests = await SwapRequest.find({
            sender: req.user.id
        })
        .populate(
            "receiver",
            "name email college department"
        )
        return res.status(200).json({
            success: true,
            count: sentRequests.length,
            requests: sentRequests
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
    getReceivedRequests,
    getSentRequests,
    acceptSwapRequest,
    rejectSwapRequest,

};