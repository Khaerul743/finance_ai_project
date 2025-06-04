const { User } = require("../models/relations");
const { response } = require("../utils/response");
const paginate = require("../utils/paginate");

const getAllUsers = async (req, res) => {
  try {
    const { page, limit, offset, all = true } = paginate(req.query);

    const users =
      all === "true"
        ? await User.findAll()
        : await User.findAll({
            limit: parseInt(limit),
            offset: parseInt(offset),
          });

    //Cek apakah data ada
    if (!users?.length) return response(res, 404, false, "Data masih kosong");

    return response(res, 200, true, "Berhasil mengambil semua user", users);
  } catch (error) {
    console.log("Gagal mengambil data user: ", error);
    return response(res, 500, false, error.message);
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    //Cek apakah user ada
    const user = await User.findByPk(id);
    if (!user) return response(res, 404, false, "User tidak ditemukan");

    const { name, email, role } = user;
    return response(res, 200, true, "Berhasil mengambil data user", {
      name,
      email,
      role,
    });
  } catch (error) {
    console.log("Gagal mengambil data user: ", error);
    return response(res, 500, false, error.message);
  }
};

const getUserProfile = async (req, res) => {
  try {
    const { id } = req.user;
    console.log(req.user)
    //Cek apakah user ada
    const user = await User.findByPk(id);
    if (!user) return response(res, 404, false, "User tidak ditemukan");

    const { name, email, role } = user;
    return response(res, 200, true, "Berhasil mengambil data user", {
      name,
      email,
      role,
    });
  } catch (error) {
    console.log("Gagal mengambil data user: ", error);
    return response(res, 500, false, error.message);
  }
};

module.exports = { getAllUsers, getUserById,getUserProfile };
