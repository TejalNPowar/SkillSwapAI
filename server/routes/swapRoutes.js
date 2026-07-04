const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
    sendSwapRequest,
    getReceivedRequests,
    getSentRequests,
    acceptSwapRequest,
    rejectSwapRequest,
} = require("../controllers/swapController");

router.post(
    "/send",
    authMiddleware,
    sendSwapRequest
);

router.get(
    "/received",
    authMiddleware,
    getReceivedRequests
);

router.get(
    "/sent",
    authMiddleware,
    getSentRequests
);

router.put(
    "/:id/accept",
    authMiddleware,
    acceptSwapRequest
);

router.put(
    "/:id/reject",
    authMiddleware,
    rejectSwapRequest
);

module.exports = router;