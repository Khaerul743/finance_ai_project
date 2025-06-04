const { User } = require("./user");
const { Wallet } = require("./wallet");
const { Transaction } = require("./transaction");
const { DailySummary } = require("./dailySummary");
const { HistoryEmail } = require("./historyEmail");
const {ChatHistory} = require("./chatHistory")

User.hasMany(Wallet, { foreignKey: "user_id" });
Wallet.belongsTo(User, { foreignKey: "user_id" });

Wallet.hasMany(Transaction, { foreignKey: "wallet_id" });
Transaction.belongsTo(Wallet, { foreignKey: "wallet_id" });

Wallet.hasMany(DailySummary, { foreignKey: "wallet_id" });
DailySummary.belongsTo(Wallet, { foreignKey: "wallet_id" });

User.hasMany(HistoryEmail, { foreignKey: "user_id" });
HistoryEmail.belongsTo(User, { foreignKey: "user_id" });

Wallet.hasMany(ChatHistory,{foreignKey:"wallet_id"})
ChatHistory.belongsTo(Wallet,{foreignKey:"wallet_id"})
module.exports = { User, Wallet, Transaction, DailySummary, HistoryEmail,ChatHistory };
