const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
    createSession,
} = require("../controllers/sessionController");

router.post(
    "/",
    authMiddleware,
    createSession
);

module.exports = router;