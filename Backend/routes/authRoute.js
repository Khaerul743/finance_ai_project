const express = require("express");
const router = express.Router();
const { validate } = require("../middlewares/validation");
const { registerSchema, loginSchema } = require("../config/validationInput");

const {
  registerHandler,
  loginHandler,
  logoutHandler,
  loginGoogle,
  googleCallback,
  googleRedirect,
  emailProfile,
  verifyOtp
} = require("../controller/authController");

router.get("/google", loginGoogle);
router.get("/google/callback", googleCallback, googleRedirect);
router.get("/google/profile", emailProfile);
router.post("/register", validate(registerSchema), registerHandler);
router.post("/login", validate(loginSchema), loginHandler);
router.post("/logout", logoutHandler);
router.post("/verify-otp",verifyOtp)

module.exports = router;
