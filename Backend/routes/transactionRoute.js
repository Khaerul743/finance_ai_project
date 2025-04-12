const express = require("express");
const router = express.Router();
const { transaction } = require("../middlewares/transaction");

const {
  getAllTransactions,
  getTransactionById,
  getAllTransactionsByDate,
  addTransaction,
  updateTransaction,
  deleteTransaction,
} = require("../controller/transactionController");
const { validate } = require("../middlewares/validation");
const {
  addTransactionSchema,
  updateTransactionSchema,
} = require("../config/validationInput");

router.get("/transaction", getAllTransactions);
router.get("/transaction/:id", getTransactionById);
router.get("/transaction/:wallet_id", getAllTransactionsByDate);
// examples

// Semua transaksi tahun 2024:
// /transactions?start=2024-01-01&end=2024-12-31

// Transaksi setelah 1 Maret:
// /transactions?start=2024-03-01

// Transaksi sebelum Februari:
// /transactions?end=2024-02-01

router.post(
  "/transaction/:wallet_id",
  transaction,
  validate(addTransactionSchema),
  addTransaction
);
router.put(
  "/transaction/:id",
  transaction,
  validate(updateTransactionSchema),
  updateTransaction
);
router.delete("/transaction/:id", transaction, deleteTransaction);

module.exports = router;
