const express = require("express")
const router = express.Router()

const {getAllTransactions,getAllTransactionsByDate,addTransaction} = require("../controller/transactionController")
const {agentAuthMiddleware} = require("../middlewares/authentication")
const {getWalletById} = require("../controller/walletController")
const {validate} = require("../middlewares/validation")
const {addTransactionSchema} = require("../config/validationInput")
const { transaction } = require("../middlewares/transaction");
router.get("/transaction",agentAuthMiddleware,getAllTransactions)
router.get("/transaction/:wallet_id",agentAuthMiddleware,getAllTransactionsByDate)
router.post("/transaction",agentAuthMiddleware,transaction,validate(addTransactionSchema),addTransaction)
router.get("/wallet/:id",agentAuthMiddleware,getWalletById)

module.exports = router