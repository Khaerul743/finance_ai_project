const express = require("express");
const router = express.Router();
const {
  validateRegister,
  validateLogin,
} = require("../middlewares/validation");

const {
  registerHandler,
  loginHandler,
} = require("../controller/authController");

router.post("/register", validateRegister, registerHandler);
router.post("/login", validateLogin, loginHandler);

module.exports = router;
