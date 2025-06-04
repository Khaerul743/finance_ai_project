const { google } = require("googleapis");
const cheerio = require("cheerio");
const { HistoryEmail } = require("../models/relations");
require("dotenv").config()

async function getEmails(accessToken, user_id) {
  const auth = new google.auth.OAuth2();
  auth.setCredentials({ access_token: accessToken });

  const gmail = google.gmail({ version: "v1", auth });

  try {
    const res = await gmail.users.messages.list({
      userId: "me",
      maxResults: 10, // Ambil 5 email terbaru
    });

    if (!res.data.messages) {
      console.log("Tidak ada email ditemukan.");
      return [];
    }

    let emails = [];
    for (let msg of res.data.messages) {
      let email = await gmail.users.messages.get({
        userId: "me",
        id: msg.id,
      });
      emails.push(email.data);
    }

    const parsedEmails = emails.map((email) => {
      const headers = email.payload.headers;

      const getHeader = (name) =>
        headers.find((h) => h.name.toLowerCase() === name.toLowerCase())
          ?.value || "";

      const subject = getHeader("Subject");
      const from = getHeader("From");
      const to = getHeader("To");
      const date = getHeader("Date");

      let body = "";
      if (email.payload.parts) {
        const part = email.payload.parts.find(
          (p) => p.mimeType === "text/plain"
        );
        const data = part?.body?.data;
        if (data)
          body = cleanEmailBody(
            extrak(Buffer.from(data, "base64").toString("utf-8"))
          );
      } else if (email.payload.body?.data) {
        body = cleanEmailBody(
          extrak(
            Buffer.from(email.payload.body.data, "base64").toString("utf-8")
          )
        );
      }

      return {
        id: email.id,
        subject,
        from,
        to,
        date,
        body,
      };
    });

    parsedEmails;

    parsedEmails.forEach(async (email) => {
      const isExistHistory = await HistoryEmail.findOne({
        where: { email_id: email.id },
      });
      if (!isExistHistory) {
        await HistoryEmail.create({
          user_id,
          email_id: email.id,
          subject: email.subject,
          body: email.body,
          from_address: email.from,
          to_address: email.to,
          date_received: email.date,
        });
      }
    });

    const newEmails = emails
      .map(
        (email) => email.payload.body.data || email.payload.parts[0].body.data
      )
      .filter((item) => item != null);
    return newEmails;
  } catch (error) {
    console.error("Error fetching emails:", error);
    return [];
  }
}

function decodeEmailContent(encodedMessage) {
  const decodedMessage = Buffer.from(encodedMessage, "base64").toString(
    "utf-8"
  );
  return decodedMessage;
}

function extrak(html) {
  const $ = cheerio.load(html);

  // Hapus elemen yang nggak diperlukan
  $("style, script").remove();

  // Ambil teks bersih dari body
  let text = $("body").text();

  // Bersihin teks dari newline dan spasi berlebih
  text = text.replace(/\s+/g, " ").trim();
  // const el = $("strong")
  //   .map((i, el) => $(el).text())
  //   .get();
  return text;
}

function cleanEmailBody(text) {
  // Hilangkan emotikon seperti 😀, 🤖, dll
  text = text.replace(/[^\w\s,]/g, ""); // Menghapus semua karakter spesial yang bukan huruf atau spasi

  // Hilangkan link
  text = text.replace(/http\S+/g, "");

  // Hilangkan footer atau informasi tidak relevan
  text = text.replace(/©.*?All Rights Reserved\./gs, "");

  // Hilangkan tanda baca lain dan karakter berlebih
  text = text.replace(/[^a-zA-Z0-9\s]/g, "");

  // Hilangkan spasi berlebih
  text = text.replace(/\s+/g, " ").trim();

  return text;
}


const getNewAccessToken = async (refreshToken) => {
  const oAuth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );

  oAuth2Client.setCredentials({ refresh_token: refreshToken });

  try {
    const { credentials } = await oAuth2Client.refreshAccessToken(); // ✅ deprecated tapi masih aman dipakai
    return credentials.access_token;
  } catch (err) {
    console.error("Error refreshing access token:", err);
    throw err;
  }
};



module.exports = { getEmails, decodeEmailContent, extrak, cleanEmailBody,getNewAccessToken };
