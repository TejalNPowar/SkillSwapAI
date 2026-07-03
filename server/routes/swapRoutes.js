const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
    sendSwapRequest,
    getReceivedRequests
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

module.exports = router;