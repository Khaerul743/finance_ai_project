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
  name: Joi.string().min(3).max(50).required(),
  type: Joi.string().valid("cash", "bank", "ewallet").required(),
  balance: Joi.number().min(0).required(),
});

const updateWalletSchema = Joi.object({
  name: Joi.string().min(3).max(50).optional(),
  type: Joi.string().valid("cash", "bank", "ewallet").optional(),
  balance: Joi.number().min(0).optional(),
});

const addTransactionSchema = Joi.object({
  wallet_id:Joi.number().required(),
  type: Joi.string().valid("pengeluaran", "pemasukan").required(),
  amount: Joi.number().min(0).required(),
  category: Joi.string().valid(
    "belanja",
    "keperluan pribadi",
    "hiburan",
    "donasi",
    "investasi",
    "makanan dan minuman",
    "kesehatan",
    "pendidikan",
    "tagihan",
    "transportasi",
    "transfer",
    "lainnya"
  ),
  description: Joi.string(),
  date: Joi.string(),
  intent:Joi.string(),
});

const updateTransactionSchema = Joi.object({
  type: Joi.string().valid("pengeluaran", "pemasukan").required(),
  amount: Joi.number().min(0).required(),
  category: Joi.string().valid(
    "belanja",
    "keperluan pribadi",
    "hiburan",
    "donasi",
    "investasi",
    "makanan dan minuman",
    "kesehatan",
    "pendidikan",
    "tagihan",
    "transportasi",
    "transfer",
    "lainnya"
  ),
  description: Joi.string(),
  date: Joi.string(),
});

module.exports = {
  registerSchema,
  loginSchema,
  addWalletSchema,
  updateWalletSchema,
  addTransactionSchema,
  updateTransactionSchema,
};
