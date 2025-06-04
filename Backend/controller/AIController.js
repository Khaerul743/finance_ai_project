const fs = require("fs");
const FormData = require("form-data");
const {response} = require("../utils/response")
const axios = require("axios")
const {DailySummary,Wallet,ChatHistory} = require("../models/relations");
const redisClient = require("../config/redis_connect")
require("dotenv").config()

const getMessage = async (req,res) => {
    const {wallet_id} = req.query
    const key = req.originalUrl
    try{
        if(!wallet_id) return response(res,404,false,"wallet id required")
        const getChatHistory = await ChatHistory.findAll({where:{wallet_id}})
        await redisClient.set(key,JSON.stringify(getChatHistory),{EX:"60"})
        return response(res,200,true,"Berhasil mengambil riwayat pesan",getChatHistory)
    } catch(error){
        console.log(error)
        return response(res,500,false,error.message)
    }
}
const postMessage = async (req,res) => {
    const {message,wallet_id} = req.body
    try{
        const api_key = process.env.SERVICE_API_KEY
        if(!message) return response(res,404,false,"Message masih kosong.")
        
        payload={message,wallet_id,role:req.user.role}
        headers = {
            'api-key': `Barear ${api_key}`,
            'Content-Type': 'application/json'
        }
        const response_llm = await axios.post(`${process.env.SERVICE_URL}/api/service/AI/chat-bot`,payload,{headers})
        if(!response_llm) return response(res,400,false,"AI tidak meresponse")
        await ChatHistory.create(response_llm.data)
        return response(res,200,true,"Berhasil",response_llm.data)
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
        if(!dailySummary?.length === 0) return response(res,404,false,"Pengeluaran harian masih kosong.")
        
        const payload = {
            dailySummary,
            day_target
        }
        const api_key = process.env.SERVICE_API_KEY
        headers = {
            'api-key': `Barear ${api_key}`,
            'Content-Type': 'application/json'
        }
        const responseService = await axios.post(`${process.env.SERVICE_URL}/api/service/ML/predict-expense`,payload)

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
        const formData = new FormData();
        formData.append("file", fs.createReadStream(filePath), "voice.webm");
        formData.append("wallet_id",wallet_id)
        const responseData = await axios.post(`${process.env.SERVICE_URL}/api/service/AI/transcribe`, formData, {
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

module.exports = {getMessage,postMessage,predictExpense,speechToText}