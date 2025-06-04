const { User } = require("../models/relations");
const {EmailOtp} = require("../models/emailOtp")
const { response } = require("../utils/response");
const { hashPass, comparePass } = require("../utils/bcrypt");
const { generateToken } = require("../utils/generateToken");
const passport = require("passport");
const transporter = require("../config/email_config")
const {generateOTP,generateOtpEmailTemplate} = require("../utils/helper");
require("dotenv").config()

const registerHandler = async (req, res) => {
  let { name, email,password } = req.body;
  try {
    //cek apakah email sudah ada
    const isEmailExist = await User.findOne({ where: { email } });
    if (isEmailExist)
      return response(res, 409, false, "Email sudah digunakan.");

    const otp = generateOTP()
    const hashedOtp = await hashPass(otp,10)
    const expires = Date.now() + 5 * 60 * 1000; // berlaku 5 menit

    const isOtpExist = await EmailOtp.findOne({where:{email}})
    if(isOtpExist){
      await EmailOtp.destroy({where:{email}})
    }
    await EmailOtp.create({email,kode_otp:hashedOtp,expires})

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your OTP Code',
      html: generateOtpEmailTemplate(email,otp)
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) return res.status(500).send('Gagal kirim email');
      return response(res, 201, true, "Success", { name, email });
    });

  } catch (error) {
    console.log(error);
    return response(res, 500, false, error.message);
  }
};

const verifyOtp = async (req, res) => {
  try {   
    let {name,email,password,otp } = req.body;
    const getEmail = await EmailOtp.findOne({where:{email}})
    const validationOtp = await comparePass(getEmail.kode_otp,otp.toString())
    if (!getEmail) return response(res,404,false,"Otp tidak ditemukan")
    if (Date.now() > getEmail.expires) return response(res,400,false,"Otp sudah expired")
    if (!validationOtp) return response(res,400,false,"Otp tidak sesuai")
    
    await EmailOtp.destroy({where:{email}})
    //hash password
    const hashedPass = await hashPass(password, 10);
    password = hashedPass;
    
    //simpan di database
    await User.create({ name, email, password });
    return response(res,200,true,"Verifikasi berhasil")

  } catch (error) {
    console.log(error);
    return response(res, 500, false, error.message);
  }
};


const loginHandler = async (req, res) => {
  const { email, password } = req.body;

  try {
    //Cek apakah email sudah terdaftar
    const user = await User.findOne({ where: { email } });
    if (!user) return response(res, 409, false, "Email belum terdaftar.");

    //validasi password
    const validationPass = await comparePass(user.password, password);
    if (!validationPass) return response(res, 400, false, "Password salah");
    
  return generateToken(res, user);

    //     //Kirim response
    // return response(res, 200, true, "Login berhasil", {
    //   email: user.email,
    // });
  } catch (error) {
    console.log(error);
    return response(res, 500, false, error.message);
  }
};

const logoutHandler = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: false, // true kalau HTTPS
    sameSite: "Lax", // atau "None" kalau HTTPS + beda origin
  });
  return response(res,200,true,"Logout berhasil");
};

const loginGoogle = passport.authenticate("google", {
  scope: ["profile", "email", "https://www.googleapis.com/auth/gmail.readonly"],
  accessType: "offline",
  prompt: 'consent'
});

const googleCallback = passport.authenticate("google", {
  failureRedirect: "/",
});

const googleRedirect = (req, res) => {
  res.redirect("/api/auth/google/profile");
};

const emailProfile = async (req, res) => {
  if (!req.isAuthenticated()) return res.redirect("/");

  const { _json } = req.user.profile;
  const { refreshToken,accessToken } = req.user;

  const { name, email } = _json;

  // ✅ Cari user berdasarkan email
  let user = await User.findOne({ where: { email } });

  if (user) {
    // ✅ Update token kalau belum ada / berubah
    if (refreshToken && user.g_refreshToken !== refreshToken) {
      user.g_refreshToken = refreshToken;
      await user.save();
    }
  } else {
    // ✅ Buat user baru
    user = await User.create({
      name,
      email,
      provider:"google",
      g_refreshToken: refreshToken,
      g_accessToken: accessToken
    });
  }
  // ✅ Buat JWT token & set cookie
  return generateToken(res, user,"google");

};

module.exports = {
  registerHandler,
  loginHandler,
  logoutHandler,
  loginGoogle,
  googleCallback,
  googleRedirect,
  emailProfile,
  verifyOtp
};
