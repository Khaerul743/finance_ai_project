const { response } = require("../utils/response");
const { Wallet, User } = require("../models/relations");
const { addWalletSchema } = require("../config/validationInput");
const { where } = require("sequelize");

const getAllWallet = async (req, res) => {
  try {
    const getDatas = await Wallet.findAll();
    if (!getDatas) return response(res, 400, false, "Data masih kosong", []);
    return response(
      res,
      200,
      true,
      "Berhasil mengambil semua wallet",
      getDatas
    );
  } catch (error) {
    console.log(error);
    response(res, 500, false, error.message);
  }
};

const getAllWalletById = async (req, res) => {
  try {
    const { id } = req.params;
    const getData = await Wallet.findByPk(id);
    if (!getData) return response(res, 404, false, "Wallet tidak ditemukan");
    return response(res, 200, true, "Berhasil mengambil wallet", getData);
  } catch (error) {
    console.log(error);
    return response(res, 500, false, error.message);
  }
};

const addWallet = async (req, res) => {
  try {
    const { user_id, name, type, balance } = req.body;

    //Cek apakah user ada
    const isUserExist = await User.findByPk(user_id);
    if (!isUserExist) return response(res, 404, false, "User tidak ditemukan");

    //Masukan ke db
    const createData = await Wallet.create({ user_id, name, type, balance });

    return response(
      res,
      201,
      true,
      "Berhasil menambahkan wallet baru",
      createData
    );
  } catch (error) {
    console.log(error);
    return response(res, 500, false, error.message);
  }
};

const updateWallet = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, type, balance } = req.body;
    //Cek wallet apakah ada
    const wallet = await Wallet.findByPk(id);
    if (!wallet) return response(res, 404, false, "Wallet tidak ditemukan");

    //Update wallet
    await wallet.update({ name, type, balance });

    return response(res, 201, true, "Wallet berhasil diperbarui", {
      id,
      name,
      type,
      balance,
    });
  } catch (error) {
    console.log("Update wallet error: ", error);
    return response(res, 500, false, error.message);
  }
};

const deleteWallet = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, type, balance } = req.body;
    //Cek wallet apakah ada
    const wallet = await Wallet.findByPk(id);
    if (!wallet) return response(res, 404, false, "Wallet tidak ditemukan");

    //Delete wallet
    await wallet.destroy();

    return response(res, 201, true, "Wallet berhasil dihapus", { id });
  } catch (error) {
    console.log("Delete wallet error", error);
    return response(res, 500, false, error.message);
  }
};

const getBalanceById = async (req, res) => {
  try {
    const { id } = req.params;
    //Cek wallet apakah ada
    const wallet = await Wallet.findByPk(id);
    if (!wallet) return response(res, 404, false, "Wallet tidak ditemukan");

    //Ambil saldo di wallet
    const { balance } = wallet;
    return response(res, 200, true, "Berhasil mengambil saldo", { balance });
  } catch (error) {
    console.log("Gagal mengambil wallet: ", error);
    return response(res, 500, false, error.message);
  }
};

module.exports = {
  getAllWallet,
  getAllWalletById,
  addWallet,
  updateWallet,
  deleteWallet,
  getBalanceById,
};
