const sequelize = require("../config/db_connet");
const { Sequelize } = require("sequelize");

const transaction = async (req, res, next) => {
  const t = await sequelize.transaction({
    isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.REPEATABLE_READ, // Set isolation level
  });
  req.transaction = t;
  try {
    await next();
    // await t.commit();
  } catch (error) {
    await t.rollback();
    next(error);
  }
};

module.exports = { transaction };
