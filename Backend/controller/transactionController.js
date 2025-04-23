const { Transaction, Wallet, DailySummary } = require("../models/relations");
const paginate = require("../utils/paginate");
const { response } = require("../utils/response");
const moment = require("moment");
const { Op, where } = require("sequelize");

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
  const t = req.transaction;
  try {
    const { wallet_id,type, amount, category, description,date = moment().startOf("day").toDate() } = req.body;
    // Cek wallet
    const wallet = await Wallet.findByPk(wallet_id, { transaction: t });
    if (!wallet) {
      await t.rollback();
      return response(res, 404, false, "Wallet tidak ditemukan");
    }

    // Cek saldo jika transaksi pengeluaran
    if (type === "pengeluaran" && wallet.balance < amount) {
      await t.rollback();
      return response(res, 400, false, "Saldo tidak cukup");
    }

    // Hitung saldo baru
    const newBalance =
      type === "pengeluaran"
        ? wallet.balance - amount
        : wallet.balance + amount;

    // Update saldo wallet
    await wallet.update({ balance: newBalance }, { transaction: t });

    // Buat transaksi baru
    const newTransaction = await Transaction.create(
      {
        wallet_id,
        type,
        amount,
        category,
        description,
        date
      },
      { transaction: t }
    );
    const summary = await DailySummary.findOne({ where: { wallet_id, date } });

    if (!summary) {
      const total_expense = type === "pengeluaran" ? amount : 0;
      const total_income = type === "pemasukan" ? amount : 0;
      await DailySummary.create(
        {
          wallet_id,
          date,
          total_expense,
          total_income,
        },
        {
          transaction: t,
        }
      );
    }

    if (summary) {
      if (type === "pengeluaran") {
        summary.total_expense += amount;
      } else if (type === "pemasukan") {
        summary.total_income += amount;
      }
      await summary.save();
    }

    await t.commit();
    return response(
      res,
      201,
      true,
      "Berhasil menambahkan transaksi baru",
      newTransaction
    );
  } catch (error) {
    await t.rollback();
    console.log("Gagal menambahkan transaksi: ", error);
    return response(res, 500, false, error.message);
  }
};

const updateTransaction = async (req, res) => {
  const t = req.transaction;
  try {
    const { id } = req.params;
    const { type, amount, category, description, date } = req.body;

    const transaction = await Transaction.findByPk(id);
    if (!transaction) {
      await t.rollback();
      return response(res, 404, false, "Transaksi tidak ditemukan");
    }

    const wallet = await Wallet.findByPk(transaction.wallet_id);
    if (!wallet) {
      await t.rollback();
      return response(res, 404, false, "Wallet tidak ditemukan");
    }

    const oldTransaction = { ...transaction.get() };
    const walletId = wallet.id;

    let balance = wallet.balance;

    // 1. Kembalikan efek transaksi lama
    if (transaction.type === "pengeluaran") {
      balance += transaction.amount;
    } else {
      balance -= transaction.amount;
    }

    // 2. Terapkan efek transaksi baru
    if (type === "pengeluaran") {
      if (balance < amount) {
        await t.rollback();
        return response(res, 400, false, "Saldo tidak cukup untuk update");
      }
      balance -= amount;
    } else {
      balance += amount;
    }

    // 3. Simpan perubahan transaksi & wallet
    await wallet.update({ balance }, { transaction: t });
    await transaction.update(
      { type, amount, category, description, date },
      { transaction: t }
    );

    // 4. Update DailySummary
    const oldDate = oldTransaction.date.toISOString().split("T")[0];
    const newDate = new Date(date).toISOString().split("T")[0];

    if (oldDate === newDate) {
      const summary = await DailySummary.findOne({
        where: { wallet_id: walletId, date: oldDate },
        transaction: t,
      });

      if (summary) {
        // Rollback data lama
        if (oldTransaction.type === "pengeluaran") {
          summary.total_expense -= oldTransaction.amount;
        } else {
          summary.total_income -= oldTransaction.amount;
        }

        // Tambahkan data baru
        if (type === "pengeluaran") {
          summary.total_expense += amount;
        } else {
          summary.total_income += amount;
        }

        // Hindari nilai negatif
        summary.total_expense = Math.max(summary.total_expense, 0);
        summary.total_income = Math.max(summary.total_income, 0);

        await summary.save({ transaction: t });
      }
    } else {
      // Update tanggal lama
      const oldSummary = await DailySummary.findOne({
        where: { wallet_id: walletId, date: oldDate },
        transaction: t,
      });

      if (oldSummary) {
        if (oldTransaction.type === "pengeluaran") {
          oldSummary.total_expense -= oldTransaction.amount;
        } else {
          oldSummary.total_income -= oldTransaction.amount;
        }

        oldSummary.total_expense = Math.max(oldSummary.total_expense, 0);
        oldSummary.total_income = Math.max(oldSummary.total_income, 0);

        await oldSummary.save({ transaction: t });
      }

      // Update/tambah tanggal baru
      let newSummary = await DailySummary.findOne({
        where: { wallet_id: walletId, date: newDate },
        transaction: t,
      });

      if (!newSummary) {
        newSummary = await DailySummary.create(
          {
            wallet_id: walletId,
            date: newDate,
            total_expense: 0,
            total_income: 0,
          },
          { transaction: t }
        );
      }

      if (type === "pengeluaran") {
        newSummary.total_expense += amount;
      } else {
        newSummary.total_income += amount;
      }

      newSummary.total_expense = Math.max(newSummary.total_expense, 0);
      newSummary.total_income = Math.max(newSummary.total_income, 0);

      await newSummary.save({ transaction: t });
    }

    await t.commit();
    return response(res, 200, true, "Transaksi berhasil diupdate", {
      type,
      amount,
      category,
      description,
      date,
    });
  } catch (error) {
    await t.rollback();
    console.log("Gagal update transaksi: ", error);
    return response(res, 500, false, error.message);
  }
};

const deleteTransaction = async (req, res) => {
  const t = req.transaction;
  try {
    const { id } = req.params;

    //Cek apakah transaksi ada
    const transaction = await Transaction.findByPk(id);
    if (!transaction)
      return response(res, 404, false, "Transaksi tidak ditemukan");

    const { wallet_id, amount, type, date } = transaction;
    const wallet = await Wallet.findByPk(wallet_id);

    type == "pengeluaran"
      ? await wallet.update({ balance: wallet.balance + amount })
      : await wallet.update({ balance: wallet.balance - amount });

    //Delete dairy summary
    const summary = await DailySummary.findOne({ where: { wallet_id, date } });
    if (summary) {
      if (type === "pengeluaran") {
        summary.total_expense -= amount;
      } else {
        summary.total_income -= amount;
      }
      await summary.save({ transaction: t });
    }
    //delete transaksi
    await transaction.destroy({ transaction: t });
    await t.commit();
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
