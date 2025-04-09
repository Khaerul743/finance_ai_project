const express = require("express");
const router = express.Router();
const {
  getAllWallet,
  getAllWalletById,
  addWallet,
  updateWallet,
  deleteWallet,
  getBalanceById,
} = require("../controller/walletController");

const { validate } = require("../middlewares/validation");
const {
  addWalletSchema,
  updateWalletSchema,
} = require("../config/validationInput");

router.get("/wallet", getAllWallet);
router.get("/wallet/:id", getAllWalletById);
router.post("/wallet", validate(addWalletSchema), addWallet);
router.put("/wallet/:id", validate(updateWalletSchema), updateWallet);
router.delete("/wallet/:id", deleteWallet);
router.get("/wallet/:id/balance", getBalanceById);

module.exports = router;
