const Joi = require("joi");

const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      const errorDetails = error.details.map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: "Validasi gagal",
        errors: errorDetails,
      });
    }

    next();
  };
};

module.exports = { validate };
