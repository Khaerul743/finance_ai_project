const jwt = require("jsonwebtoken");
const { response } = require("../utils/response");
require("dotenv").config();

const verifyToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return response(res, 403, false, "Invalid token");
  try {
    const verified = jwt.verify(token, process.env.SECRET_KEY);
    req.user = verified;
    next();
  } catch (error) {
    response(res, 500, false, error.message);
    console.log(error);
  }
};

module.exports = { verifyToken };
