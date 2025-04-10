const express = require("express");
const router = express.Router();

const { verifyToken } = require("../middlewares/authentication");
const {
  getAllWallet,
  getAllWalletById,
  addWallet,
  updateWallet,
  deleteWallet,
  getBalanceById,
  getTransactionByWalletId,
} = require("../controller/walletController");

const { validate } = require("../middlewares/validation");
const {
  addWalletSchema,
  updateWalletSchema,
} = require("../config/validationInput");

router.get("/wallet", getAllWallet);
router.get("/wallet/:id", getAllWalletById);
router.post("/wallet", verifyToken, validate(addWalletSchema), addWallet);
router.put("/wallet/:id", validate(updateWalletSchema), updateWallet);
router.delete("/wallet/:id", deleteWallet);
router.get("/wallet/:id/balance", getBalanceById);
router.get("/wallet/:id/transactions", getTransactionByWalletId);

module.exports = router;
