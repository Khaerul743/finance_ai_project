const redisClient = require("../config/redis_connect")
const { response } = require("../utils/response");

const redisCache = async (req,res,next) => {
    const key = req.originalUrl
    try {
        const getDataFromRedis = await redisClient.get(key)
        if(getDataFromRedis){
            console.log("Ambil data dari redis")
            return response(res,200,true,"Mengambil dari redis cache",JSON.parse(getDataFromRedis));
        }
        console.log("Ambil data dari database")
        next()
    } catch (error) {
        console.log("Gagal mengambil data dari redis", error);
        next()
    }
}

module.exports = {redisCache}