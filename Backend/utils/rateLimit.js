const rateLimit = require("express-rate-limit")

//Limiter
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 menit
    max: 10000, // maksimal 100 request per IP
    message: 'Terlalu banyak request dari IP ini, coba lagi nanti.',
    standardHeaders: true, // mengaktifkan RateLimit-* headers
    legacyHeaders: false, // nonaktifkan X-RateLimit-* headers lama
});
  
const aiLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 5,
    message: 'Batas penggunaan AI tercapai.',
});

module.exports = {limiter,aiLimiter}