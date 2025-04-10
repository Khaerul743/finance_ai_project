const jwt = require("jsonwebtoken");
const { response } = require("./response");
require("dotenv").config();

const generateToken = (res, user) => {
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
      sameSite: "none", // agar bisa cross-origin (misal frontend beda domain)
    });

    // Kirim response
    response(res, 200, true, "Login berhasil", {
      email: user.email,
      token,
    });
  });
};

module.exports = { generateToken };
