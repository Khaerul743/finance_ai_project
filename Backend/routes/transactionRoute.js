const express = require("express");
const router = express.Router();
const { transaction } = require("../middlewares/transaction");
const {
  getAllTransactions,
  getTransactionById,
  getAllTransactionsByDate,
  getSummary,
  addTransaction,
  updateTransaction,
  deleteTransaction,
} = require("../controller/transactionController");
const { validate } = require("../middlewares/validation");
const {
  addTransactionSchema,
  updateTransactionSchema,
} = require("../config/validationInput");

const {verifyToken} = require("../middlewares/authentication")
const {authorizationRoles} = require("../middlewares/authRole")

router.get("/transaction",verifyToken,authorizationRoles("admin","user"),getAllTransactions);
router.get("/transaction/:id",verifyToken,authorizationRoles("admin","user"), getTransactionById);
router.get("/transaction/all/:wallet_id",verifyToken,authorizationRoles("admin","user"), getAllTransactionsByDate);
router.get("/transaction/summary/:wallet_id",getSummary)
// examples

// Semua transaksi tahun 2024:
// /transactions?start=2024-01-01&end=2024-12-31

// Transaksi setelah 1 Maret:
// /transactions?start=2024-03-01

// Transaksi sebelum Februari:
// /transactions?end=2024-02-01

router.post(
  "/transaction",
  verifyToken,
  authorizationRoles("admin","user"),
  transaction,
  validate(addTransactionSchema),
  addTransaction
);
router.put(
  "/transaction/:id",
  verifyToken,
  authorizationRoles("admin","user"),
  transaction,
  validate(updateTransactionSchema),
  updateTransaction
);
router.delete("/transaction/:id",verifyToken,authorizationRoles("admin","user"), transaction, deleteTransaction);

module.exports = router;
