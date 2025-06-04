const express = require("express")
const router = express.Router()
const {getMessage,postMessage, predictExpense, speechToText} = require("../controller/AIController")
const multer = require("multer");
const {verifyToken} = require("../middlewares/authentication")
const {authorizationRoles} = require("../middlewares/authRole")
const {redisCache} = require("../middlewares/redisCache")
const upload = multer({ dest: "uploads/" });
const {aiLimiter} = require("../utils/rateLimit")

router.get("/chat-bot",verifyToken,authorizationRoles("admin","user"),redisCache,getMessage)
router.post("/chat-bot",aiLimiter,verifyToken,authorizationRoles("admin","user"),postMessage)
router.post("/predict",verifyToken,authorizationRoles("admin","user"),predictExpense)
router.post("/voice",upload.single("audio"),verifyToken,authorizationRoles("admin","user"),speechToText)

module.exports = router