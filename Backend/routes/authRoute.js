const express = require("express");
const router = express.Router();
const { validate } = require("../middlewares/validation");
const { registerSchema, loginSchema } = require("../config/validationInput");

const {
  registerHandler,
  loginHandler,
} = require("../controller/authController");

router.post("/register", validate(registerSchema), registerHandler);
router.post("/login", validate(loginSchema), loginHandler);

module.exports = router;
