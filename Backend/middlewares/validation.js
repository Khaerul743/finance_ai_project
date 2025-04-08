const { addWalletSchema } = require("../config/validationInput");

const validateAddWallet = (req, res, next) => {
  const { error } = addWalletSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }
  next();
};

const validateRegister = (req, res, next) => {
  //validasi input
  const { error } = registerSchema.validate(req.body, { abortEarly: false });
  if (error)
    return response(
      res,
      400,
      false,
      error.details.map((err) => err.message)
    );
  next();
};

const validateLogin = (req, res, next) => {
  //validasi input
  const { error } = loginSchema.validate(req.body, { abortEarly: false });
  if (error)
    return response(
      res,
      400,
      false,
      error.details.map((err) => err.message)
    );
  next();
};

module.exports = { validateAddWallet, validateLogin, validateRegister };
