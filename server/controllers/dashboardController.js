const User = require("../models/User");
const SwapRequest = require("../models/SwapRequest");

const getDashboard = async (req, res) => {
  try {

    const userId = req.user.id;

    // Fetch logged-in user
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Count pending requests received
    const pendingRequests = await SwapRequest.countDocuments({
      receiver: userId,
      status: "Pending",
    });

    // Count accepted requests
    const acceptedRequests = await SwapRequest.countDocuments({
      receiver: userId,
      status: "Accepted",
    });

    // Count all requests received
    const receivedRequests = await SwapRequest.countDocuments({
      receiver: userId,
    });

    res.status(200).json({
      success: true,
      dashboard: {
        pendingRequests,
        acceptedRequests,
        receivedRequests,
        skillsOffered: user.skillsOffered.length,
        skillsWanted: user.skillsWanted.length,
      },
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });

  }
};

module.exports = {
  getDashboard,
};