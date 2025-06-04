const express = require("express");
const router = express.Router();
const {verifyToken,} = require("../middlewares/authentication")
const {authorizationRoles} = require("../middlewares/authRole")
const {
  fetchEmail,
  postHistoryEmail,
} = require("../controller/emailController");

// router.post("/email/history/:wallet_id",postHistoryEmail);
router.post("/email/history/:wallet_id",verifyToken,authorizationRoles("admin","user"), postHistoryEmail);
router.post("/email/fetch-emails",verifyToken,authorizationRoles("admin","user"), fetchEmail);
// router.post("/email/fetch-emails",fetchEmail);

module.exports = router;
