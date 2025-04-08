const bcrypt = require("bcrypt");

const hashPass = async (pass, saltNum) => {
  try {
    const salt = await bcrypt.genSalt(saltNum);
    const hashed = await bcrypt.hash(pass, salt);
    return hashed;
  } catch (error) {
    return error;
  }
};

const comparePass = async (hashed, pass) => {
  try {
    const result = await bcrypt.compare(pass, hashed);
    return result;
  } catch (error) {
    return error;
  }
};

module.exports = { hashPass, comparePass };
