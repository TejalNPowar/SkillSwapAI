const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
    createSession,
    getMySessions,
    joinSession,
} = require("../controllers/sessionController");

router.post(
    "/",
    authMiddleware,
    createSession
);

router.get(
    "/",
    authMiddleware,
    getMySessions
);

router.get(
    "/:id/join",
    authMiddleware,
    joinSession
);

module.exports = router;
