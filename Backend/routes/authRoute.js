const express = require("express");
const router = express.Router();
const { validate } = require("../middlewares/validation");
const { registerSchema, loginSchema } = require("../config/validationInput");

const {
  registerHandler,
  loginHandler,
  loginGoogle,
  googleCallback,
  googleRedirect,
  emailProfile,
} = require("../controller/authController");

router.get("/google", loginGoogle);
router.get("/google/callback", googleCallback, googleRedirect);
router.get("/google/profile", emailProfile);
router.post("/register", validate(registerSchema), registerHandler);
router.post("/login", validate(loginSchema), loginHandler);

module.exports = router;
