const { response } = require("../utils/response");
const { HistoryEmail,User } = require("../models/relations");
const { Op } = require("sequelize");
const moment = require("moment");
const axios = require("axios");
const {getNewAccessToken} = require("../utils/getEmail")
const {
  getEmails,
  decodeEmailContent,
  extrak,
  cleanEmailBody,
} = require("../utils/getEmail");
require("dotenv").config()

const fetchEmail = async (req, res) => {
  try {
    const {id} = req.user;
    const {wallet_id} = req.body
    const getUser = await User.findByPk(id)
    if(!getUser) return response(res,404,false,"User not found")
      const {g_refreshToken} = getUser
    if(!g_refreshToken) return response(res,404,false,"Anda perlu login dengan akun google")
      
    const accessToken = await getNewAccessToken(g_refreshToken)
    if (!accessToken) {
      return res.status(400).json({ error: "Terjadi kesalahan saat" });
    }
    getUser.g_accessToken = accessToken
    getUser.save()
    
    const emails = await getEmails(accessToken, id);
    const decodedEmails = emails.map((email) => decodeEmailContent(email));
    const extrakEmails = decodedEmails.map((email) => extrak(email));
    const cleanEmails = extrakEmails.map((email) => cleanEmailBody(email));
    
    if(!emails) return response(res,400,false,"gagal mengambil data email")
    // const url = process.env.THIS_URL
    // return res.redirect(`${url}/api/email/history/${wallet_id}`)
    // Ambil tanggal hari ini
    const todayStart = moment().startOf("day").toDate(); // Mulai hari
    const todayEnd = moment().endOf("day").toDate(); // Selesai hari

    // Query data email yang dikirim hari ini
    const emailHistory = await HistoryEmail.findAll(
      {
      where: {
        date_received: {
          [Op.between]: [todayStart, todayEnd],
        },
      },
    }
  );

    // Jika tidak ada data
    if (emailHistory.length === 0) {
      return res.status(404).json({ message: "No email history for today" });
    }
    // Kirimkan data email
    const api_key = process.env.SERVICE_API_KEY
    const data = await axios.post(
      `${process.env.SERVICE_URL}/api/service/email/history-handler`,
      {
        wallet_id,
        emailHistory,
      },
      {
        headers: {
          "Content-Type": "application/json",
          'api-key': `Barear ${api_key}`,
        },
      }
    );

    if(!data){
      return response(res,400,false,"Gagal menambahkan transaksi")
    }
    return response(res,201,true,"Berhasil menambahkan transaksi melalui email",data.data)
  } catch (error) {
    console.log("Gagal mengambil email user: ", error);
    return response(res, 500, false, error.message);
  }
};

const postHistoryEmail = async (req, res) => {
  try {
    const {wallet_id} = req.params
    // Ambil tanggal hari ini
    const todayStart = moment().startOf("day").toDate(); // Mulai hari
    const todayEnd = moment().endOf("day").toDate(); // Selesai hari

    // Query data email yang dikirim hari ini
    const emailHistory = await HistoryEmail.findAll(
      {
      where: {
        date_received: {
          [Op.between]: [todayStart, todayEnd],
        },
      },
    }
  );

    // Jika tidak ada data
    if (emailHistory.length === 0) {
      return res.status(404).json({ message: "No email history for today" });
    }
    // Kirimkan data email
    const api_key = process.env.SERVICE_API_KEY
    const data = await axios.post(
      `${process.env.SERVICE_URL}/api/service/email/history-handler`,
      {
        wallet_id,
        emailHistory,
      },
      {
        headers: {
          "Content-Type": "application/json",
          'api-key': `Barear ${api_key}`,
        },
      }
    );

    if(data){

    }
    return res.json(data.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { fetchEmail, postHistoryEmail };
