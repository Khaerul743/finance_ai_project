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

function agentAuthMiddleware(req, res, next) {
  const token = req.headers['key'];
  if (token !== process.env.AGENT_SECRET) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  next();
}


module.exports = { verifyToken,agentAuthMiddleware};
