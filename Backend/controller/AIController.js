const fs = require("fs");
const FormData = require("form-data");
const {response} = require("../utils/response")
const axios = require("axios")
const {DailySummary,Wallet} = require("../models/relations")
require("dotenv").config()

const postMessage = async (req,res) => {
    const {message,wallet_id} = req.body
    try{
        if(!message) return response(res,404,false,"Message masih kosong.")
        
        const response = await axios.post(`${process.env.SERVICE_URL}/api/AI/chat-bot`,{message,wallet_id})
        const {intent} = response.data
        let getData;
        if(intent === "tampilkan_pengeluaran"){
            getData = await DailySummary.findAll({where:{wallet_id}})
        }else if(intent === "tampilkan_saldo"){
            const {balance} = await Wallet.findByPk(wallet_id)
            getData = balance
        }
        response.data.data_response = getData

        return res.json(response.data)
    }catch(error){
        console.log(error)
        return response(res,500,false,error.message)
    }
}

const predictExpense = async (req,res) => {
    try{
        const {wallet_id,day_target} = req.body
        const wallet = await Wallet.findByPk(wallet_id)
        if(!wallet) return response(res,404,false,"Wallet tidak ada.")
        
        const dailySummary = await DailySummary.findAll({where:{wallet_id}})
        if(!dailySummary?.length === 0) return response(res,404,false,"Pengeluarna harian masih kosong.")
        
        const payload = {
            dailySummary,
            day_target
        }
        const responseService = await axios.post(`${process.env.SERVICE_URL}/api/ML/predict-expense`,payload)

        return response(res,200,true,"Berhasil predict",responseService.data)
    }catch(error){
        console.log(error)
        return response(res,500,false,error.message)
    }
}

const speechToText = async (req,res) => {
    try {
        const filePath = req.file.path;
        const {wallet_id} = req.body
        // const {wallet_id} = req.params
        console.log(filePath)
        const formData = new FormData();
        formData.append("file", fs.createReadStream(filePath), "voice.webm");
        formData.append("wallet_id",wallet_id)
        const responseData = await axios.post(`${process.env.SERVICE_URL}/api/AI/transcribe`, formData, {
          headers: formData.getHeaders(),
        });
        console.log(responseData.data)
        const {intent} = responseData.data.data
        if(intent !== "catat_pengeluaran") return response(res,400,false,"Mohon masukan detail transaksi yang valid.")
        fs.unlinkSync(filePath); // hapus file setelah dikirim
        return response(res,200,true,"Berhasil menambahkan transaksi.",responseData.data)
      } catch (err) {
        console.log(err)
        res.status(500).json({ error: err.message });
      }
}

module.exports = {postMessage,predictExpense,speechToText}