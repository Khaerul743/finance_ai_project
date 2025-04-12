const { response } = require("../utils/response");
const {
  getEmails,
  decodeEmailContent,
  extrak,
  cleanEmailBody,
} = require("../utils/getEmail");

const fetchEmail = async (req, res) => {
  try {
    const { accessToken } = req.body;

    if (!accessToken) {
      return res.status(400).json({ error: "Access token diperlukan!" });
    }

    const emails = await getEmails(accessToken);
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

module.exports = { fetchEmail };
