const sequelize = require("../config/db_connet");
const { DataTypes } = require("sequelize");

const HistoryEmail = sequelize.define(
  "HistoryEmail",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    email_id: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    subject: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    body: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    from_address: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    to_address: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    date_received: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    tableName: "history_email",
    timestamps: false,
  }
);

module.exports = { HistoryEmail };
