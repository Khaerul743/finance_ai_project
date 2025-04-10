const { response } = require("../utils/response");
const { Wallet, User, Transaction } = require("../models/relations");
const { addWalletSchema } = require("../config/validationInput");
const paginate = require("../utils/paginate");

const getAllWallet = async (req, res) => {
  try {
    const { page, limit, offset, all = true } = paginate(req.body);

    let getDatas;
    if (all == "true") {
      getDatas = await Wallet.findAll();
    } else {
      getDatas = await Wallet.findAll({
        limit: parseInt(limit),
        offset: parseInt(offset),
      });
    }

    if (!getDatas || getDatas.length === 0) {
      return response(res, 404, false, "Wallet masih kosong");
    }

    return response(res, 200, true, "Mengambil semua data wallet", getDatas);
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
    const { name, type, balance } = req.body;
    const { id } = req.user;

    //Cek apakah user ada
    const isUserExist = await User.findByPk(id);
    if (!isUserExist) return response(res, 404, false, "User tidak ditemukan");

    //Masukan ke db
    const createData = await Wallet.create({
      user_id: id,
      name,
      type,
      balance,
    });

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

// const getTransactionByWalletId = async (req, res) => {
//   try {
//     const { id } = req.params;
//     //Cek wallet apakah ada
//     const wallet = await Wallet.findByPk(id);
//     if (!wallet) return response(res, 404, false, "Wallet tidak ditemukan");

//     //Ambil transaksi berdasarkan wallet id
//     const getTransactions = await Transaction.findAll({
//       where: { wallet_id: id },
//       order: [["createdAt", "DESC"]],
//     });

//     if (!getTransactions || getTransactions.length === 0) {
//       return response(
//         res,
//         200,
//         true,
//         "Belum ada transaksi untuk wallet ini",
//         []
//       );
//     }

//     return response(
//       res,
//       200,
//       true,
//       "Mengambil semua transaksi berdasarkan id wallet",
//       getTransactions
//     );
//   } catch (error) {
//     console.log("Gagal mengambil transaksi: ", error);
//     return response(res, 500, false, error.message);
//   }
// };

const getTransactionByWalletId = async (req, res) => {
  try {
    const { id } = req.params;
    // const { page = 1, limit = 10, all = false } = req.query;
    const { page, limit, offset, all = true } = paginate(req.query);

    // Cek wallet apakah ada
    const wallet = await Wallet.findByPk(id);
    if (!wallet) return response(res, 404, false, "Wallet tidak ditemukan");

    // Ambil transaksi berdasarkan wallet_id
    let transactions;

    if (all === "true") {
      // Ambil semua transaksi
      transactions = await Transaction.findAll({
        where: { wallet_id: id },
      });
    } else {
      // Pakai pagination
      transactions = await Transaction.findAll({
        where: { wallet_id: id },
        limit: parseInt(limit),
        offset: parseInt(offset),
      });
    }

    if (!transactions || transactions.length === 0) {
      return response(res, 404, false, "Belum melakukan transaksi");
    }

    return response(
      res,
      200,
      true,
      "Mengambil semua transaksi berdasarkan id wallet",
      transactions
    );
  } catch (error) {
    console.log("Gagal mengambil transaksi: ", error);
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
  getTransactionByWalletId,
};
