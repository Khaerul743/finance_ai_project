const express = require("express")
const router = express.Router()
const {postMessage, predictExpense, speechToText} = require("../controller/AIController")
const multer = require("multer");

const upload = multer({ dest: "uploads/" });

router.post("/chat-bot",postMessage)
router.post("/predict",predictExpense)
router.post("/voice",upload.single("audio"),speechToText)


module.exports = router