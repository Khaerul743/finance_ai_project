const sequelize = require("../config/db_connet")
const {DataTypes} = require("sequelize")

const EmailOtp = sequelize.define("EmailOtp",{
    id:{type:DataTypes.INTEGER,primaryKey:true,autoIncrement:true},
    email:{type:DataTypes.TEXT,allowNull:false},
    kode_otp:{type:DataTypes.STRING,allowNull:false},
    expires:{type:DataTypes.DATE}
},{
    tableName:"email_otp",
    timestamps:false
})

module.exports = {EmailOtp}