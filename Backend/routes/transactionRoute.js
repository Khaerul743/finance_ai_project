const express = require("express");
const router = express.Router();
const {
  getAllTransactions,
  getTransactionById,
} = require("../controller/transactionController");

router.get("/transaction", getAllTransactions);
router.get("/transaction/:id", getTransactionById);
module.exports = router;
