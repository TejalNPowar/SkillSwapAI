const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
    sendSwapRequest,
    getReceivedRequests,
    acceptSwapRequest,
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

router.put(
    "/:id/accept",
    authMiddleware,
    acceptSwapRequest
);

module.exports = router;