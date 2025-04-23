const express = require("express");
const router = express.Router();
const {
  fetchEmail,
  postHistoryEmail,
} = require("../controller/emailController");

router.post("/email/history/:wallet_id", postHistoryEmail);
router.post("/email/fetch-emails", fetchEmail);

module.exports = router;
