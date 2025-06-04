const { response } = require("../utils/response");

const authorizationRoles = (...roles) => {
  return (req, res, next) => {
    // console.log(req.user)
    if (!roles.includes(req.user.role)) {
      return response(res, 403, false, "Access denied!");
    }
    next();
  };
};

module.exports = { authorizationRoles };
