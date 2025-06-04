const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  `mysql://${process.env.DB_USER}:${process.env.DB_PASS}@${
    process.env.DB_HOST
  }:${process.env.DB_PORT || 3307}/${process.env.DB_NAME}`,
  {
    logging: false,
  }
);

async function testConnection(retries = 10) {
  while (retries) {
    try {
      await sequelize.authenticate();
      await sequelize.sync({ alter: true })
      console.log('Connected to MySQL via Sequelize!');
      break;
    } catch (err) {
      console.error('MySQL not ready, retrying...', err);
      retries--;
      await new Promise(res => setTimeout(res, 3000));
    }
  }

  if (!retries) {
    console.log('Out of retries. Exiting.');
    process.exit(1);
  }
}

testConnection();

module.exports = sequelize;