const express = require("express");
const router = express.Router();
const { fetchEmail } = require("../controller/emailController");

router.post("/email/fetch-emails", fetchEmail);

module.exports = router;
