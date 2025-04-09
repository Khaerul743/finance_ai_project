const { Transaction, Wallet } = require("../models/relations");
const paginate = require("../utils/paginate");
const { response } = require("../utils/response");

const getAllTransactions = async (req, res) => {
  try {
    const { page, limit, offset, all = true } = paginate(req.query);

    let getTransactions;
    if (all == "true") {
      getTransactions = await Transaction.findAll();
    } else {
      getTransactions = await Transaction.findAll({
        limit: parseInt(limit),
        offset: parseInt(offset),
      });
    }

    if (!getTransactions || getTransactions.length === 0) {
      return response(res, 404, false, "Data transaksi masih kosong");
    }

    return response(
      res,
      200,
      true,
      "Mengambil semua data transaksi",
      getTransactions
    );
  } catch (error) {
    console.log("Gagal mengambil data transaksi", error);
    return response(res, 500, false, error.message);
  }
};

const getTransactionById = async (req, res) => {
  try {
    const { id } = req.params;
    //Cek apakah transaksi ada
    const getTransaction = await Transaction.findByPk(id);
    if (!getTransaction)
      return response(res, 404, false, "Transaksi tidak ditemukan");

    return response(
      res,
      200,
      true,
      "Mengambil transaksi berdasarkan id",
      getTransaction
    );
  } catch (error) {
    console.log("Gagal mengambil transaksi", error);
    return response(res, 500, false);
  }
};

const addTransaction = async (req, res) => {
  try {
    const { wallet_id, name, type, balance } = req.body;

    //Cek apakah wallet ada
    const wallet = await Wallet.findByPk(wallet_id);
    if (!wallet) return response(res, 404, false, "Wallet tidak ditemukan");

    //Tambahkan transaksi baru
    const addTransaction = await wallet.create({ name, type, balance });

    return response(res, 201, true, "Berhasil menambahkan transaksi baru");
  } catch (error) {
    console.log("Gagal menambahkan transaksi: ", error);
    return response(res, 500, false, error.message);
  }
};

const updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, type, balance } = req.body;

    //Cek apakah transaksi ada
    const transaction = await Transaction.findByPk(id);
    if (!transaction)
      return response(res, 404, false, "Transaksi tidak ditemukan");

    //Update transaksi
    await transaction.update({ name, type, balance });
    return response(res, 200, true, { name, type, balance });
  } catch (error) {
    console.log("Gagal update transaksi: ", error);
    return response(res, 500, false, error.message);
  }
};

const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;

    //Cek apakah transaksi ada
    const transaction = await Transaction.findByPk(id);
    if (!transaction)
      return response(res, 404, false, "Transaksi tidak ditemukan");

    //delete transaksi
    await transaction.destroy();
    return response(res, 200, true, "Berhasil menghapus transaksi", { id });
  } catch (error) {
    console.log("Gagal menghapus transaksi: ", error);
    return response(res, 500, false, error.message);
  }
};
module.exports = {
  getAllTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
};
