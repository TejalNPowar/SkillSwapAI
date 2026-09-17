const express = require("express");
const { createMeet } = require("../controllers/meetController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/create", authMiddleware, createMeet);

module.exports = router;