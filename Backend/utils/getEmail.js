const { google } = require("googleapis");
const cheerio = require("cheerio");

async function getEmails(accessToken) {
  const auth = new google.auth.OAuth2();
  auth.setCredentials({ access_token: accessToken });

  const gmail = google.gmail({ version: "v1", auth });

  try {
    const res = await gmail.users.messages.list({
      userId: "me",
      maxResults: 1, // Ambil 5 email terbaru
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

module.exports = { getEmails, decodeEmailContent, extrak, cleanEmailBody };
