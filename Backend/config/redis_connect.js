const redis = require("redis")
const redisClient = redis.createClient({
    socket: {
        host: 'redis', // nama service di docker-compose
        port: 6379
    }
})

redisClient.on("error",error => {
    console.log(error)
})

const isConnect = async () => {
    await redisClient.connect()
    if(!redisClient.isOpen){
        console.log("redis gagal berhasil connect")
    }
}

isConnect()

module.exports = redisClient