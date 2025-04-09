const { Transaction, Wallet } = require("../models/relations");
const paginate = require("../utils/paginate");
const { response } = require("../utils/response");
const { Op } = require("sequelize");

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

const getAllTransactionsByDate = async (req, res) => {
  try {
    const { page, limit, offset, all } = paginate(req.query);
    const { start, end } = req.query;
    const { wallet_id } = req.params;
    let whereClause = {};

    if (wallet_id) whereClause.wallet_id = wallet_id;
    // Tambahkan filter tanggal kalau ada query-nya
    if (start && end) {
      whereClause.date = {
        [Op.between]: [new Date(start), new Date(end)],
      };
    } else if (start) {
      whereClause.date = {
        [Op.gte]: new Date(start),
      };
    } else if (end) {
      whereClause.date = {
        [Op.lte]: new Date(end),
      };
    }

    const transactions =
      all === "true"
        ? await Transaction.findAll({ where: whereClause })
        : await Transaction.findAll({
            where: whereClause,
            limit,
            offset,
          });

    if (!transactions?.length) {
      return response(res, 404, false, "Data transaksi tidak ditemukan");
    }

    return response(
      res,
      200,
      true,
      "Berhasil mengambil transaksi",
      transactions
    );
  } catch (error) {
    console.error("Gagal mengambil data transaksi:", error);
    return response(res, 500, false, error.message);
  }
};

const addTransaction = async (req, res) => {
  try {
    const { wallet_id, type, amount, category, description, date } = req.body;

    //Cek apakah wallet ada
    const wallet = await Wallet.findByPk(wallet_id);
    if (!wallet) return response(res, 404, false, "Wallet tidak ditemukan");

    //Tambahkan transaksi baru
    const addTransaction = await wallet.create({
      type,
      amount,
      category,
      description,
      date,
    });

    return response(
      res,
      201,
      true,
      "Berhasil menambahkan transaksi baru",
      addTransaction
    );
  } catch (error) {
    console.log("Gagal menambahkan transaksi: ", error);
    return response(res, 500, false, error.message);
  }
};

const updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const { type, amount, category, description, date } = req.body;

    //Cek apakah transaksi ada
    const transaction = await Transaction.findByPk(id);
    if (!transaction)
      return response(res, 404, false, "Transaksi tidak ditemukan");

    //Update transaksi
    await transaction.update({ type, amount, category, description, date });
    return response(res, 200, true, {
      type,
      amount,
      category,
      description,
      date,
    });
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
  getAllTransactionsByDate,
  addTransaction,
  updateTransaction,
  deleteTransaction,
};
