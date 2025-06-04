const express = require("express");
const router = express.Router();

const { verifyToken } = require("../middlewares/authentication");
const { authorizationRoles } = require("../middlewares/authRole")
const {
  getAllWallet,
  getWalletById,
  addWallet,
  getMyWallet,
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
const {redisCache} = require("../middlewares/redisCache")

router.get("/wallet",verifyToken,authorizationRoles("admin"), getAllWallet);
router.get("/wallet/my_wallet",verifyToken,authorizationRoles("admin","user"), getMyWallet);
router.get("/wallet/:id",verifyToken,authorizationRoles("admin","user"), getWalletById);
router.post("/wallet", verifyToken,authorizationRoles("admin","user"), validate(addWalletSchema), addWallet);
router.put("/wallet/:id",verifyToken, validate(updateWalletSchema),authorizationRoles("admin","user"), updateWallet);
router.delete("/wallet/:id",verifyToken,authorizationRoles("admin","user"), deleteWallet);
router.get("/wallet/:id/balance",verifyToken,authorizationRoles("admin","user"), getBalanceById);
router.get("/wallet/:id/transactions",verifyToken,authorizationRoles("admin","user"),redisCache, getTransactionByWalletId);

module.exports = router;