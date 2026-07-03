const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
    sendSwapRequest
} = require("../controllers/swapController");

router.post(
    "/send",
    authMiddleware,
    sendSwapRequest
);

module.exports = router;