const { response } = require("express")
const sequelize = require("../config/db_connet")
const {DataTypes} = require("sequelize")

const ChatHistory = sequelize.define("ChatHistory",
    {
        id:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            autoIncrement:true
        },
        wallet_id:{
            type:DataTypes.INTEGER,
            allowNull:false,
            references:{
                model:"wallet",
                key:"id"
            },
            onUpdate:"CASCADE",
            onDelete:"CASCADE"
        },
        user_message:{type:DataTypes.TEXT},
        response:{type:DataTypes.TEXT},
        date:{type:DataTypes.DATE,defaultValue:DataTypes.NOW}
    },
    {
        tableName:"chat_history",
        timestamps:false
    }
)

module.exports = {ChatHistory}