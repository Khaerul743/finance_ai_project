const Joi = require("joi");

const registerSchema = Joi.object({
  name: Joi.string().required().messages({
    "any.required": "Username is required",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "Invalid email format.",
    "any.required": "Email is required",
  }),
  password: Joi.string().min(6).required().messages({
    "string.min": "password must be long than 6 character",
    "any.required": "Password is required",
  }),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Invalid email format",
    "any.required": "Email is required",
  }),
  password: Joi.string().required().messages({
    "any.required": "Password is required",
  }),
});

const addWalletSchema = Joi.object({
  user_id: Joi.number().integer().required(),
  name: Joi.string().min(3).max(50).required(),
  type: Joi.string().valid("pokok", "goal").required(),
  balance: Joi.number().min(0).required(),
});

module.exports = { registerSchema, loginSchema, addWalletSchema };
