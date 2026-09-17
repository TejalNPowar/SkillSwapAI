// const express = require("express");

// const router = express.Router();

// const authMiddleware = require("../middleware/authMiddleware");

// const {
//     googleAuth,
//     googleCallback,
// } = require("../controllers/googleAuthController");


// // User must be logged in to connect Google
// router.get(
//     "/auth",
//     authMiddleware,
//     googleAuth
// );


// // Google redirects here after authorization
// router.get(
//     "/callback",
//     googleCallback
// );


// module.exports = router;


const express = require("express");

const router = express.Router();

const {
    googleAuth,
    googleCallback,
} = require("../controllers/googleAuthController");

const authMiddleware = require("../middleware/authMiddleware");


// User must be logged in before connecting Google
router.get("/", authMiddleware, googleAuth);


// Google redirects here after authorization
router.get("/callback", googleCallback);


module.exports = router;