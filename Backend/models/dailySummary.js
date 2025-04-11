const sequelize = require("../config/db_connet");
const { DataTypes } = require("sequelize");

const DailySummary = sequelize.define(
  "DailySummary",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    wallet_id: { type: DataTypes.INTEGER, allowNull: false },
    date: { type: DataTypes.DATEONLY, allowNull: false },
    total_income: { type: DataTypes.INTEGER, defaultValue: 0 },
    total_expense: { type: DataTypes.INTEGER, defaultValue: 0 },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
  },
  {
    tableName: "daily_summary",
    timestamps: false,
  }
);

module.exports = { DailySummary };
