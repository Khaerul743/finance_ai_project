const { User } = require("./user");
const { Wallet } = require("./wallet");

User.hasMany(Wallet, { foreignKey: "user_id" });
Wallet.belongsTo(User, { foreignKey: "user_id" });

module.exports = { User, Wallet };
