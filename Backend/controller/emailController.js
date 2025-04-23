const { response } = require("../utils/response");
const { HistoryEmail } = require("../models/relations");
const { Op } = require("sequelize");
const moment = require("moment");
const axios = require("axios");
const {
  getEmails,
  decodeEmailContent,
  extrak,
  cleanEmailBody,
} = require("../utils/getEmail");

const fetchEmail = async (req, res) => {
  try {
    const { accessToken, user_id } = req.body;

    if (!accessToken) {
      return res.status(400).json({ error: "Access token diperlukan!" });
    }

    const emails = await getEmails(accessToken, user_id);
    const decodedEmails = emails.map((email) => decodeEmailContent(email));
    const extrakEmails = decodedEmails.map((email) => extrak(email));
    const cleanEmails = extrakEmails.map((email) => cleanEmailBody(email));
    return response(
      res,
      200,
      true,
      "Berhasil mengambil email user",
      cleanEmails
    );
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
    const data = await axios.post(
      "http://localhost:5000/api/email/history-handler",
      {
        wallet_id,
        emailHistory,
      },
      {
        headers: {
          "Content-Type": "application/json",
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
