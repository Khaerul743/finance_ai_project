const { User } = require("./user");
const { Wallet } = require("./wallet");
const { Transaction } = require("./transaction");
const { DailySummary } = require("./dailySummary");

User.hasMany(Wallet, { foreignKey: "user_id" });
Wallet.belongsTo(User, { foreignKey: "user_id" });

Wallet.hasMany(Transaction, { foreignKey: "wallet_id" });
Transaction.belongsTo(Wallet, { foreignKey: "wallet_id" });

Wallet.hasMany(DailySummary, { foreignKey: "wallet_id" });
DailySummary.belongsTo(DailySummary, { foreignKey: "wallet_id" });

module.exports = { User, Wallet, Transaction, DailySummary };
