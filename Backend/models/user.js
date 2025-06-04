const sequelize = require("../config/db_connet");
const { DataTypes } = require("sequelize");

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("admin", "user"),
      defaultValue: "user",
    },
    provider:{type:DataTypes.STRING,allowNull:true},
    g_refreshToken:{type:DataTypes.TEXT,allowNull:true},
    g_accessToken:{type:DataTypes.TEXT,allowNull:true}
  },
  {
    tableName: "users",
    timestamps: false,
  }
);

module.exports = { User };
