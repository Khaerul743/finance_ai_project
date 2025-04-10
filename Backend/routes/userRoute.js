const express = require("express");
const router = express.Router();
const { getAllUsers, getUserById } = require("../controller/userController");
const { authorizationRoles } = require("../middlewares/authRole");
const { verifyToken } = require("../middlewares/authentication");

router.get("/user", verifyToken, authorizationRoles("user"), getAllUsers);
router.get("/user/:id", getUserById);

module.exports = router;
