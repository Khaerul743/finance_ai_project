const jwt = require("jsonwebtoken");
const { response } = require("./response");
require("dotenv").config();

const generateToken = (res, user,provider=undefined) => {
  const payload = { id: user.id, role: user.role };
  const options = {
    expiresIn: "24h",
  };
  jwt.sign(payload, process.env.SECRET_KEY, options, (err, token) => {

    if (err) {
      return response(res, 400, false, "Gagal generate token");
    }

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // aktifkan hanya jika pakai HTTPS
      sameSite: "Lax", // agar bisa cross-origin (misal frontend beda domain)
    });
    const url = process.env.FE_URL
    //Kirim response
    if(provider == "google") return res.redirect(`${url}/dashboard`)
      
    return response(res, 200, true, "Login berhasil", {
      email: user.email,
    });
  });
};

module.exports = { generateToken };
