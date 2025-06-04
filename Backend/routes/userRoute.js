const express = require("express");
const router = express.Router();
const { getAllUsers, getUserById,getUserProfile } = require("../controller/userController");
const { authorizationRoles } = require("../middlewares/authRole");
const { verifyToken } = require("../middlewares/authentication");

router.get("/user",verifyToken,authorizationRoles("admin"), getAllUsers);
router.get("/user/profile",verifyToken,authorizationRoles("admin","user"), getUserProfile);
router.get("/user/:id",verifyToken,authorizationRoles("admin","user"), getUserById);

module.exports = router;
