const sequelize = require("../config/db_connet");
const { DataTypes } = require("sequelize");

const Transaction = sequelize.define(
  "Transaction",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    wallet_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "wallet",
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    category: {
      type: DataTypes.ENUM(
        "belanja",
        "keperluan pribadi",
        "hiburan",
        "donasi",
        "investasi",
        "makanan dan minuman",
        "kesehatan",
        "pendidikan",
        "tagihan",
        "transportasi",
        "transfer",
        "lainnya"
      ),
      allowNull: false,
      defaultValue: "lainnya",
    },
    type: {
      type: DataTypes.ENUM("pengeluaran", "pemasukan"),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: "tidak ada",
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "transaksi",
    timestamps: false,
  }
);

module.exports = { Transaction };
