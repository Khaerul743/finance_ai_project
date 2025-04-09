const express = require("express");
const router = express.Router();
const { getAllUsers, getUserById } = require("../controller/userController");

router.get("/user", getAllUsers);
router.get("/user/:id", getUserById);

module.exports = router;
