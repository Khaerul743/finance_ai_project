const express = require("express");
const router = express.Router();
const {
  getAllWallet,
  getAllWalletById,
} = require("../controller/walletController");

router.get("/wallet", getAllWallet);
router.get("/wallet/:id", getAllWalletById);

module.exports = router;
