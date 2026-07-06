const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
    getAllUsers,
    getUserById    
} = require("../controllers/userController");

router.get(
    "/",
    authMiddleware,
    getAllUsers
);

router.get(
    "/:id",
    authMiddleware,
    getUserById
);

module.exports = router;