const { User } = require("../models/relations");
const { response } = require("../utils/response");
const { registerSchema, loginSchema } = require("../config/validationInput");
const { hashPass, comparePass } = require("../utils/bcrypt");

const registerHandler = async (req, res) => {
  let { name, email, password } = req.body;
  try {
    //cek apakah email sudah ada
    const isEmailExist = await User.findOne({ where: { email } });
    if (isEmailExist)
      return response(res, 409, false, "Email sudah digunakan.");

    //hash password
    const hashedPass = await hashPass(password, 10);
    password = hashedPass;

    //simpan di database
    await User.create({ name, email, password });

    return response(res, 201, true, "Success", { name, email });
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
  } catch (error) {
    console.log(error);
    return response(res, 500, false, error.message);
  }
};

module.exports = { registerHandler, loginHandler };
