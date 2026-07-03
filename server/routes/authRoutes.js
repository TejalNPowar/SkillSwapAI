const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

const {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
} = require("../controllers/authController");

router.post("/register", registerUser);

router.post("/login",loginUser);

router.get(
    "/profile",
    authMiddleware,
    getProfile
);

router.put(
    "/profile",
    authMiddleware,
    updateProfile
);

module.exports = router;